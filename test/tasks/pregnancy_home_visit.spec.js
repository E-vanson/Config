const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { pregnancyHomeVisitScenarios, subsequentPregnancyHomeVisitScenarios, defaulterFollowUpScenarios, referralFollowUpScenarios, postnatalServiceScenarios, getDate } = require('../forms-inputs');
const { Services, TASKS, getField } = require('../../common-extras');

describe('Pregnancy Home Visit Service Tasks', () => {
  before(async () => {
    return await harness.start();
  });
  after(async () => {
    return await harness.stop();
  });
  beforeEach(async () => {
    await harness.clear();
  });

  [
    {
      input: pregnancyHomeVisitScenarios.isPregnant(),
      taskTitle: TASKS.pregnancy_home_visit_service,
      taskDescription: 'a pregnancy home visit task 3 days after anc appointment date',
      condition: 'is pregnant',
      flushDays: 13,
      taskInput: subsequentPregnancyHomeVisitScenarios.notPregnantAnymoreTask
    },
    {
      input: pregnancyHomeVisitScenarios.notStartedAnc,
      taskTitle: TASKS.pregnancy_home_visit_service,
      taskDescription: 'a pregnancy home visit task in 3 days',
      condition: 'is pregnant but has not started anc',
      flushDays: 3,
      taskInput: subsequentPregnancyHomeVisitScenarios.stillPregnantTask
    },
    {
      input: pregnancyHomeVisitScenarios.positivePregnancyTest,
      taskTitle: TASKS.pregnancy_home_visit_service,
      taskDescription: 'a pregnancy home visit task in 3 days',
      condition: 'pregnancy test is positive',
      flushDays: 3,
      taskInput: subsequentPregnancyHomeVisitScenarios.stillPregnantTask
    },
    {
      input: pregnancyHomeVisitScenarios.pregnancyTestNotDone,
      taskTitle: TASKS.pregnancy_home_visit_service,
      taskDescription: 'a pregnancy home visit task in 3 days',
      condition: 'pregnancy test has not been done',
      flushDays: 3,
      taskInput: pregnancyHomeVisitScenarios.onFp
    },
    {
      input: pregnancyHomeVisitScenarios.hasDangerSigns,
      taskTitle: TASKS.anc_danger_signs_referral_follow_up,
      taskDescription: 'anc danger signs referral followup task in 24 hours',
      condition: 'has danger signs',
      flushDays: 1,
      taskInput: referralFollowUpScenarios.availableAndVisited
    },
    {
      input: pregnancyHomeVisitScenarios.hasMentalDangerSigns,
      taskTitle: TASKS.anc_danger_signs_referral_follow_up,
      taskDescription: 'anc danger signs from mental signs referral follow up task in 3 days',
      condition: 'has mental danger signs',
      flushDays: 3,
      taskInput: referralFollowUpScenarios.availableAndNotVisited
    },
    {
      input: pregnancyHomeVisitScenarios.ancNotUptoDate,
      taskTitle: TASKS.anc_defaulter_service,
      taskDescription: 'anc defaulter follow up in 3 days',
      condition: 'anc is not up to date',
      flushDays: 3,
      taskInput: defaulterFollowUpScenarios.availableDidClinicVisit
    },
    {
      input: pregnancyHomeVisitScenarios.muac('red'),
      taskTitle: TASKS.anc_danger_signs_referral_follow_up,
      taskDescription: 'anc danger signs referral followup task in 24 hours',
      condition: 'has red muac colour',
      flushDays: 1,
      taskInput: referralFollowUpScenarios.availableAndVisited
    },
    {
      input: pregnancyHomeVisitScenarios.muac('yellow'),
      taskTitle: TASKS.anc_danger_signs_referral_follow_up,
      taskDescription: 'anc danger signs referral followup task in 24 hours',
      condition: 'has yellow muac colour',
      flushDays: 1,
      taskInput: referralFollowUpScenarios.availableAndVisited
    },
  ].forEach(scenario => it(`should emit ${scenario.taskDescription} if contact ${scenario.condition}`, async () => {
    // confirm there are no tasks of this type
    let followUpTask = await harness.getTasks({ title: scenario.taskTitle });
    expect(followUpTask).to.have.property('length', 0);

    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...scenario.input);
    expect(result.errors).to.be.empty;

    await harness.flush(scenario.flushDays);

    followUpTask = await harness.getTasks({ title: scenario.taskTitle });
    expect(followUpTask).to.have.property('length', 1);

    //Ensure resolved
    await harness.loadAction(followUpTask[0], ...scenario.taskInput);
    expect(await harness.getTasks({ title: scenario.taskTitle })).to.be.empty;
  }));

  [
    {
      input: pregnancyHomeVisitScenarios.onFp,
      condition: 'is on family planning'
    },
    {
      input: pregnancyHomeVisitScenarios.lmpLt30Days,
      condition: 'lmp is less than 30 days ago'
    },
    {
      input: pregnancyHomeVisitScenarios.lmpGt30Days('negative'),
      condition: 'pregnancy test is negative',
    },
    {
      input: pregnancyHomeVisitScenarios.lostPregnancy(),
      condition: 'has lost pregnancy of below 7 months'
    },
    {
      input: pregnancyHomeVisitScenarios.lostPregnancy('7_months_or_more'),
      condition: 'has lost pregnancy of 7 months and above'
    }
  ].forEach(scenario => it(`should not emit a task if contact ${scenario.condition}`, async () => {
    // confirm there are no tasks of this type
    const followUpTask = await harness.getTasks({title: TASKS.pregnancy_home_visit_service});
    expect(followUpTask).to.have.property('length', 0);

    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...scenario.input);
    expect(result.errors).to.be.empty;

    const referralSummary = await harness.countTaskDocsByState({title: TASKS.pregnancy_home_visit_service});
    expect(referralSummary).to.include({
      Total: 0
    });
  }));

  [
    {
      input: pregnancyHomeVisitScenarios.isPregnant(),
      taskTitle: TASKS.anc_danger_signs_referral_follow_up,
      taskDescription: 'a danger signs referral follow up task',
      condition: 'does not have danger signs',
    },
    {
      input: pregnancyHomeVisitScenarios.isPregnant(),
      taskTitle: TASKS.anc_defaulter_service,
      taskDescription: 'a defaulter follow up task',
      condition: 'anc is upto date',
    },
    {
      input: pregnancyHomeVisitScenarios.isPregnant(),
      taskTitle: TASKS.anc_mental_referral_follow_up,
      taskDescription: 'anc mental danger signs referral follow up task',
      condition: 'does not have mental danger signs',
    },
    {
      input: pregnancyHomeVisitScenarios.muac('green'),
      taskTitle: TASKS.anc_danger_signs_referral_follow_up,
      taskDescription: 'anc danger signs referral followup task in 24 hours',
      condition: 'has green muac colour',
    },
  ].forEach(scenario => it(`should not emit ${scenario.taskDescription} if contact ${scenario.condition}`, async () => {
    // confirm there are no tasks of this type
    const followUpTask = await harness.getTasks({ title: scenario.taskTitle });
    expect(followUpTask).to.have.property('length', 0);

    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...scenario.input);
    expect(result.errors).to.be.empty;

    const referralSummary = await harness.countTaskDocsByState({ title: scenario.taskTitle });
    expect(referralSummary).to.include({
      Total: 0
    });
  }));

  it(`should clear a pregnancy visit task after delivery`, async () => {
    const followUpTask1 = await harness.getTasks({ title: TASKS.pregnancy_home_visit_service });
    expect(followUpTask1).to.have.property('length', 0);

    const result1 = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant());
    expect(result1.errors).to.be.empty;

    await harness.flush(13);
    const followUpTask2 = await harness.getTasks({ title: TASKS.pregnancy_home_visit_service });
    expect(followUpTask2).to.have.property('length', 1);

    const result2 = await harness.fillForm(Services.POSTNATAL_CARE_SERVICE, ...postnatalServiceScenarios.deliveredAndWell(getDate(-5), getDate(5)));
    expect(result2.errors).to.be.empty;

    const followUpTask3 = await harness.getTasks({ title: TASKS.pregnancy_home_visit_service });
    expect(followUpTask3).to.have.property('length', 0);
  });

  it(`check for delivery note`, async () => {
    const result1 = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant());
    expect(result1.errors).to.be.empty;
    await harness.flush(5);
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.delivered);
    expect(result.errors).to.be.empty;
    expect(getField(result.report, 'pregnancy_screening.delivery_registration_note')).to.not.be.null;
  });

  it(`exit form if woman not available and trigger task after 3 days`, async () => {
    let result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant());
    expect(result.errors).to.be.empty;

    await harness.flush(13);
    let tasks = await harness.getTasks({ title: TASKS.pregnancy_home_visit_service });
    expect(tasks).to.have.property('length', 1);

    result = await harness.loadAction(tasks[0], ['no']);
    expect(result.errors).to.be.empty;

    await harness.flush(3);
    tasks = await harness.getTasks({ title: TASKS.pregnancy_home_visit_service });
    expect(tasks).to.have.property('length', 1);
    result = await harness.loadAction(tasks[0], ...subsequentPregnancyHomeVisitScenarios.ancUptoDateTask);
    expect(result.errors).to.be.empty;

    tasks = await harness.getTasks({ title: TASKS.pregnancy_home_visit_service });
    expect(tasks).to.have.property('length', 0);    
  });
});
