const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { DateTime } = require('luxon');
const { chaVerbalAutopsyScenarios, personRegistrationScenarios, deathScenarios, deathReviewScenarios } = require('../forms-inputs');
const { Persons, Services, TASKS } = require('../../common-extras');
const taskTitle = TASKS.cha_verbal_autopsy;
const deathReviewTaskTitle = TASKS.death_confirmation;
const now = () => DateTime.now();

describe('CHA Verbal Autopsy', () => {
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

  it('Should trigger cha verbal autopsy task', async () => {
    const result = await harness.fillForm(Services.DEATH_REPORT, ...deathScenarios.healthFacility);
    expect(result.errors).to.be.empty;
    await harness.flush(5);

    harness.user = 'cha_id';
    const tasks = await harness.getTasks({ title: deathReviewTaskTitle });
    expect(tasks).to.have.property('length', 1);

    const reviewResult = await harness.loadAction(tasks[0], ...deathReviewScenarios.healthFacility);
    expect(reviewResult.errors).to.be.empty;

    const tasksAutopsy = await harness.getTasks({ title: taskTitle });
    expect(tasksAutopsy).to.have.property('length', 1);

    const autopsyResult = await harness.loadAction(tasksAutopsy[0], ...chaVerbalAutopsyScenarios.default);
    expect(autopsyResult.errors).to.be.empty;

    const tasksAutopsy2 = await harness.getTasks({ title: taskTitle });
    expect(tasksAutopsy2).to.have.property('length', 0);
  });

  it('Should not clear cha verbal autopsy task when participated = no', async () => {
    const result = await harness.fillForm(Services.DEATH_REPORT, ...deathScenarios.healthFacility);
    expect(result.errors).to.be.empty;
    await harness.flush(5);

    harness.user = 'cha_id';
    const tasks = await harness.getTasks({ title: deathReviewTaskTitle });
    expect(tasks).to.have.property('length', 1);

    const reviewResult = await harness.loadAction(tasks[0], ...deathReviewScenarios.healthFacility);
    expect(reviewResult.errors).to.be.empty;

    const tasksAutopsy = await harness.getTasks({ title: taskTitle });
    expect(tasksAutopsy).to.have.property('length', 1);

    const autopsyResult = await harness.loadAction(tasksAutopsy[0], ...chaVerbalAutopsyScenarios.notPlanned(now().plus({ days: 7 }).toISODate()));
    expect(autopsyResult.errors).to.be.empty;

    const tasksAutopsy2 = await harness.getTasks({ title: taskTitle });
    expect(tasksAutopsy2).to.have.property('length', 1);
  });

  it('if 2 verbal autopsy tasks triggered, one being resolved should not clear the other', async () => {
    const resultLady = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.femaleOnFp(DateTime.now().minus({ years: 20 }).toISODate()));
    expect(resultLady.errors).to.be.empty;
    expect(resultLady.contacts).to.have.lengthOf(1);

    const lady = harness.state.contacts.find(c => c.name === resultLady.contacts[0].name);
    const household = harness.state.contacts.find(h => h._id === 'household_id');
    lady.parent = household;

    harness.subject = lady;
    const result = await harness.fillForm(Services.DEATH_REPORT, ...deathScenarios.homeFemale('sick'));
    expect(result.errors).to.be.empty;
    // await harness.flush(5);

    harness.subject = 'patient_id';
    const result2 = await harness.fillForm(Services.DEATH_REPORT, ...deathScenarios.homeFemale('sick'));
    expect(result2.errors).to.be.empty;
    await harness.flush(5);

    harness.user = 'cha_id';
    const tasks = await harness.getTasks({ title: deathReviewTaskTitle });
    expect(tasks).to.have.property('length', 2);

    const reviewResult = await harness.loadAction(tasks[0], ...deathReviewScenarios.homeFemale);
    expect(reviewResult.errors).to.be.empty;

    let tasksAutopsy = await harness.getTasks({ title: taskTitle });
    expect(tasksAutopsy).to.have.property('length', 1);

    const reviewResult2 = await harness.loadAction(tasks[1], ...deathReviewScenarios.homeFemale);
    expect(reviewResult2.errors).to.be.empty;

    tasksAutopsy = await harness.getTasks({ title: taskTitle });
    expect(tasksAutopsy).to.have.property('length', 2);

    const autopsyResult = await harness.loadAction(tasksAutopsy[0], ...chaVerbalAutopsyScenarios.default);
    expect(autopsyResult.errors).to.be.empty;

    let verbalAutopsyTask = await harness.getTasks({ title: taskTitle });
    expect(verbalAutopsyTask).to.have.property('length', 1);

    harness.setNow(now().endOf('month').toISODate()); //End of the month

    verbalAutopsyTask = await harness.getTasks({ title: taskTitle });
    expect(verbalAutopsyTask).to.have.property('length', 1);

    harness.flush(1); //Next month

    verbalAutopsyTask = await harness.getTasks({ title: taskTitle });
    expect(verbalAutopsyTask).to.have.property('length', 1);

    const verbalAutopsy2ndReportFill = await harness.loadAction(verbalAutopsyTask[0], ...chaVerbalAutopsyScenarios.notPlanned(now().plus({ days: 7 }).toISODate()));
    expect(verbalAutopsy2ndReportFill.errors).to.be.empty;

    verbalAutopsyTask = await harness.getTasks({ title: taskTitle });
    expect(verbalAutopsyTask).to.have.property('length', 1);

    harness.flush(300); //After 300 days

    verbalAutopsyTask = await harness.getTasks({ title: taskTitle });
    expect(verbalAutopsyTask).to.have.property('length', 1);

  });

});
