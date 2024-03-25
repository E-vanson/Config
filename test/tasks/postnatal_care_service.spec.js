const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { pregnancyHomeVisitScenarios, getDate, postnatalServiceScenarios } = require('../forms-inputs');
const { Services, DAYS_IN_WEEK, MAX_PREGNANCY_AGE_IN_WEEKS, DELIVERY_CHECK_WEEKS } = require('../../common-extras');
const weeksToEdd = [...Array((DELIVERY_CHECK_WEEKS.END - DELIVERY_CHECK_WEEKS.START) + 1).keys()];
const pncHomeVisitTaskTitle = 'task.pnc_home_visit.title';
const pncMotherFollowUpTaskTitle = 'task.pnc_mother_followup.title';

describe('Mother and Newborn PNC Home Visit Service', () => {
  before(async () => {
    return await harness.start();
  });
  after(async () => {
    return await harness.stop();
  });
  beforeEach(async () => {
    await harness.clear();
  });
  afterEach(() => {
    expect(harness.consoleErrors).to.be.empty;
  });

  it('task should be triggered weekly 28-44 weeks of pregnancy if not delivered', async () => {
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant(getDate(MAX_PREGNANCY_AGE_IN_WEEKS * DAYS_IN_WEEK)));
    expect(result.errors).to.be.empty;
    const tasks = await harness.getTasks({ title: pncHomeVisitTaskTitle });
    expect(tasks).to.have.property('length', 0);
    await harness.flush(DELIVERY_CHECK_WEEKS.START * DAYS_IN_WEEK);
    for (let i = 0; i < weeksToEdd.length - 1; i++) {
      const taskForHomeVisit = await harness.getTasks({ title: pncHomeVisitTaskTitle });
      expect(taskForHomeVisit, `Expected task ${i} weeks to EDD missing`).to.have.property('length', 1);
      await harness.flush(DAYS_IN_WEEK);
    }
    await harness.flush(1);
    const tasksBeyondMaxPregnancyAge = await harness.getTasks({ title: pncHomeVisitTaskTitle });
    expect(tasksBeyondMaxPregnancyAge).to.have.property('length', 0);
  });

  it('task should not be shown if anc not upto date', async () => {
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.ancNotUptoDate);
    expect(result.errors).to.be.empty;

    let tasks = await harness.getTasks({ title: pncHomeVisitTaskTitle });
    expect(tasks).to.have.property('length', 0);

    await harness.flush(DELIVERY_CHECK_WEEKS.START * DAYS_IN_WEEK);
    for (let i = 0; i < weeksToEdd.length - 1; i++) {
      tasks = await harness.getTasks({ title: pncHomeVisitTaskTitle });
      expect(tasks).to.have.property('length', 0);
      await harness.flush(DAYS_IN_WEEK);
    }
  });

  it('subsequent tasks should resolve if pregnancy is muted', async () => {
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant(getDate(MAX_PREGNANCY_AGE_IN_WEEKS * DAYS_IN_WEEK)));
    expect(result.errors).to.be.empty;

    // resolve the week 28 task
    const flushDays = DELIVERY_CHECK_WEEKS.START * DAYS_IN_WEEK;
    await harness.flush(flushDays);
    const tasks = await harness.getTasks({ title: pncHomeVisitTaskTitle });
    expect(tasks).to.have.property('length', 1);

    const result1 = await harness.loadAction(tasks[0], ...postnatalServiceScenarios.deliveredAndWell(getDate(-DAYS_IN_WEEK), getDate(DAYS_IN_WEEK)));
    expect(result1.errors).to.be.empty;

    // confirm subsequent tasks resolve
    for (let i = 1; i < weeksToEdd.length - 1; i++) {
      await harness.flush(DAYS_IN_WEEK);
      const taskForHomeVisit = await harness.getTasks({ title: pncHomeVisitTaskTitle });
      expect(taskForHomeVisit, `Task on week ${i} should have been cleared`).to.have.property('length', 0);
    }
  });

  const testCases = [
    {
      deliveryType: 'home',
      scenarios: [
        {
          flushDays: 0, taskCount: 1
        },
        {
          flushDays: 1, taskCount: 1
        },
        {
          flushDays: 2, taskCount: 1
        },
        {
          flushDays: 4, taskCount: 1
        }
      ]
    },
    {
      deliveryType: 'health_facility',
      scenarios: [
        {
          flushDays: 1, taskCount: 1
        },
        {
          flushDays: 2, taskCount: 1
        },
        {
          flushDays: 4, taskCount: 1
        }
      ]
    }
  ];

  testCases.forEach((testCase) => {
    it(`a ${testCase.deliveryType} delivery yields ${testCase.scenarios.length} PNC follow up tasks`, async () => {
      let tasks; let
        result;

      result = await harness.fillForm(Services.POSTNATAL_CARE, ...postnatalServiceScenarios.deliveredAndWell(getDate(-1), getDate(DAYS_IN_WEEK), testCase.deliveryType));
      expect(result.errors).to.be.empty;

      for (const scenario of testCase.scenarios) {
        await harness.flush(scenario.flushDays);
        tasks = await harness.getTasks({ title: pncMotherFollowUpTaskTitle });
        expect(tasks).to.be.of.length(scenario.taskCount);

        //If client is unavailable, task should not resolve
        result = await harness.loadAction(tasks[0], ...postnatalServiceScenarios.unavailable);
        expect(result.errors).to.be.empty;
        tasks = await harness.getTasks({ title: pncMotherFollowUpTaskTitle });
        expect(tasks).to.be.of.length(scenario.taskCount);

        result = await harness.loadAction(tasks[0], ...postnatalServiceScenarios.subsequentVisitTask());
        expect(result.errors).to.be.empty;
        tasks = await harness.getTasks({ title: pncMotherFollowUpTaskTitle });
        expect(tasks).to.be.of.length((scenario.taskCount - 1));
      }

      tasks = await harness.getTasks({ title: pncMotherFollowUpTaskTitle });
      expect(tasks).to.be.of.length(0);
    });
  });
});
