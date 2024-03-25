const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness({ subject: 'chv_id' });
const { chaSupervisionCalendarScenarios, DateTime, chvSupervisionScenarios } = require('../forms-inputs');
const { Services, TASKS } = require('../../common-extras');
const now = () => DateTime.now();

describe('CHA Supervision Calendar', () => {
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

  it('cha supervision calendar form and subsequent task can be filled and successfully saved', async () => {
    harness.user = 'cha_id';
    harness.subject = 'chv_id';
    const result = await harness.fillForm(Services.CHA_SUPERVISION_CALENDAR, ...chaSupervisionCalendarScenarios.default(now().plus({days: 7}).toISODate()));
    expect(result.errors).to.be.empty;
    // Verify some attributes on the resulting report
    expect(result.report.fields).to.nested.include({
      patient_id: 'chv_id',
      chv_name: 'Test CHV'
    });
   
    harness.flush(7);
    let tasks = await harness.getTasks({ title: TASKS.chv_supervision });
    expect(tasks).to.have.property('length', 1);

    const reviewResult = await harness.loadAction(tasks[0], ...chvSupervisionScenarios.available);
    expect(reviewResult.errors).to.be.empty;

    tasks = await harness.getTasks({ title: TASKS.chv_supervision });
    expect(tasks).to.have.property('length', 0);

  });

  it('cha supervision calendar form task schedule - make sure task shows 3 days before due date and 3 days after due date', async () => {
    harness.user = 'cha_id';
    harness.subject = 'chv_id';
    const result = await harness.fillForm(Services.CHA_SUPERVISION_CALENDAR, ...chaSupervisionCalendarScenarios.default(now().plus({days: 7}).toISODate()));
    expect(result.errors).to.be.empty;
    // Verify some attributes on the resulting report
    expect(result.report.fields).to.nested.include({
      patient_id: 'chv_id',
      chv_name: 'Test CHV'
    });
    
    //After 3 days
    harness.flush(3);
    let tasks = await harness.getTasks({ title: TASKS.chv_supervision });
    expect(tasks).to.have.property('length', 0);
    
    //After 4 days
    harness.flush(1);
    tasks = await harness.getTasks({ title: TASKS.chv_supervision });
    expect(tasks).to.have.property('length', 1);
    
    //After 11 days
    harness.flush(7);
    tasks = await harness.getTasks({ title: TASKS.chv_supervision });
    expect(tasks).to.have.property('length', 0);

  });

  it('should display error if next supervision date is in the past or more than one month from now', async () => {
    let result = await harness.fillForm(Services.CHA_SUPERVISION_CALENDAR, ...chaSupervisionCalendarScenarios.default(now().plus({days: -1}).toISODate()));
    expect(result.errors[0]).to.deep.include({
      type: 'validation',
      msg: 'Don\'t put in past dates or more than 30 days from today'
    });

    result = await harness.fillForm(Services.CHA_SUPERVISION_CALENDAR, ...chaSupervisionCalendarScenarios.default(now().plus({days: 31}).toISODate()));
    expect(result.errors[0]).to.deep.include({
      type: 'validation',
      msg: 'Don\'t put in past dates or more than 30 days from today'
    });
  });
});
