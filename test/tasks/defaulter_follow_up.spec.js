const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness({ subject: 'patient_id' });
const { defaulterFollowUpScenarios, postnatalServiceScenarios, pregnancyHomeVisitScenarios, getDate } = require('../forms-inputs');
const { Services } = require('../../common-extras');
const taskTitle = 'task.defaulter_follow_up.title';

describe('Defaulter follow up form', () => {
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

  it('yields no task if the client is available and did a clinic visit', async () => {
    const result = await harness.fillForm(Services.DEFAULTER_FOLLOW_UP, ...defaulterFollowUpScenarios.availableDidClinicVisit);
    expect(result.errors).to.be.empty;

    expect(result.report.fields).to.nested.include({
      needs_follow_up: 'no',
      next_follow_up_date: ''
    });

    const tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 0);

    await harness.flush(2);
    expect(tasks).to.have.property('length', 0);
  });

  it('yields no task if the client did not a attended a clinic visit and needs no clinic visit', async () => {
    const result = await harness.fillForm(Services.DEFAULTER_FOLLOW_UP, ...defaulterFollowUpScenarios.availableNoClinicVisitNeedsNoClinicVisit);
    expect(result.errors).to.be.empty;

    expect(result.report.fields).to.nested.include({
      needs_follow_up: 'no',
      next_follow_up_date: ''
    });

    const tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 0);
  });

  it('yields a task if the client is not available ', async () => {
    const daysToFollowUp = 2;
    const result = await harness.fillForm(Services.DEFAULTER_FOLLOW_UP, ...defaulterFollowUpScenarios.notAvailable(daysToFollowUp));
    expect(result.errors).to.be.empty;

    expect(result.report.fields).to.nested.include({
      needs_follow_up: 'yes',
      next_follow_up_date: getDate(daysToFollowUp)
    });

    await harness.flush(daysToFollowUp);

    const tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 1);

    await harness.loadAction(tasks[0], ...defaulterFollowUpScenarios.availableNoClinicVisitNeedsNoClinicVisit);
    expect(await harness.getTasks({ title: taskTitle })).to.be.empty;
  });

  it('Errors if follow up date is more than 7 days from now', async () => {
    const daysToFollowUp = 8;
    const result = await harness.fillForm(Services.DEFAULTER_FOLLOW_UP, ...defaulterFollowUpScenarios.notAvailable(daysToFollowUp));

    expect(result.errors.length).to.be.eql(1);
    expect(result.errors[0]).to.have.property('type', 'validation');
    expect(result.errors[0]).to.have.property('question').that.includes('in the future');
  });

  it('yields a task if the client did not attend a clinic visit ', async () => {
    const result = await harness.fillForm(Services.DEFAULTER_FOLLOW_UP, ...defaulterFollowUpScenarios.availableNoClinicVisitNeedsClinicVisit);
    expect(result.errors).to.be.empty;

    expect(result.report.fields).to.nested.include({
      needs_follow_up: 'yes',
      next_follow_up_date: getDate(3)
    });

    await harness.flush(2);

    const tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 1);

    await harness.loadAction(tasks[0], ...defaulterFollowUpScenarios.availableNoClinicVisitNeedsNoClinicVisit);
    expect(await harness.getTasks({ title: taskTitle })).to.be.empty;
  });

  it('Test for PNC showing as a defaulted service option ', async () => {
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant());
    expect(result.errors).to.be.empty;

    const result2 = await harness.fillForm(Services.POSTNATAL_CARE, ...postnatalServiceScenarios.notUpdatedImmunization(7));
    expect(result2.errors).to.be.empty;

    const result3 = await harness.fillForm(Services.DEFAULTER_FOLLOW_UP, ...defaulterFollowUpScenarios.availableNoClinicVisitNeedsClinicVisitPNC);
    expect(result3.errors).to.be.empty;

    expect(result3.report.fields).to.nested.include({
      needs_follow_up: 'yes',
      next_follow_up_date: getDate(3)
    });

    // Fix #1020: task shows a day before
    await harness.flush(1);
    let tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 0);

    await harness.flush(1);
    tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 1);

    await harness.loadAction(tasks[0], ...defaulterFollowUpScenarios.availableNoClinicVisitNeedsNoClinicVisit);
    expect(await harness.getTasks({ title: taskTitle })).to.be.empty;
  });
});
