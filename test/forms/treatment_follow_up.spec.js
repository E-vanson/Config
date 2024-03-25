const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { treatmentFollowUpScenarios, getDate } = require('../forms-inputs');
const { Services } = require('../../common-extras');

describe('Treatment follow up', () => {
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

  it('needs follow up if is not available', async () => {
    const result = await harness.fillForm(Services.TREATMENT_FOLLOW_UP, ...treatmentFollowUpScenarios.notAvailable);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_follow_up: 'yes',
      follow_up_date: getDate(1),
      visited_contact_uuid: 'household_id' //Confirm if unavailability => not a hh visit
    });

    const taskTime = result.report.fields.follow_up_date;
    await harness.setNow(taskTime);

    const followUpTask = await harness.getTasks({ actionForm: Services.REFERRAL_FOLLOW_UP });
    expect(followUpTask).to.have.property('length', 1);
  });

  it('needs follow up if has side effects', async () => {
    harness.subject.upi = 'test_upi';
    const result = await harness.fillForm(Services.TREATMENT_FOLLOW_UP, ...treatmentFollowUpScenarios.hasSideEffects);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_follow_up: 'yes',
      follow_up_date: getDate(3),
      visited_contact_uuid: 'household_id'
    });
    expect(result.report.fields.data).to.deep.include({
      _upi: 'test_upi',
    });
    expect(result.report.fields.data._screening).to.deep.include({
      _progress: 'feeling_better',
      _side_effects: 'constipation'
    });

    const taskTime = result.report.fields.follow_up_date;
    await harness.setNow(taskTime);

    const followUpTask = await harness.getTasks({ actionForm: Services.REFERRAL_FOLLOW_UP });
    expect(followUpTask).to.have.property('length', 1);
  });

  it('needs follow up if condition is getting worse or no change', async () => {
    harness.subject.upi = 'test_upi';
    const result = await harness.fillForm(Services.TREATMENT_FOLLOW_UP, ...treatmentFollowUpScenarios.worseOrNoChange);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_follow_up: 'yes',
      follow_up_date: getDate(3),
      visited_contact_uuid: 'household_id'
    });
    expect(result.report.fields.data).to.deep.include({
      _upi: 'test_upi',
    });
    expect(result.report.fields.data._screening).to.deep.include({
      _progress: 'no_change',
    });

    const taskTime = result.report.fields.follow_up_date;
    await harness.setNow(taskTime);

    const followUpTask = await harness.getTasks({ actionForm: Services.REFERRAL_FOLLOW_UP });
    expect(followUpTask).to.have.property('length', 1);
  });

  it('needs no follow up if contact did not visit and does not need to', async () => {
    const result = await harness.fillForm(Services.TREATMENT_FOLLOW_UP, ...treatmentFollowUpScenarios.noFollowUp);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_follow_up: 'no',
      follow_up_date: '',
      visited_contact_uuid: 'household_id'
    });

    const followUpTask = await harness.getTasks({ actionForm: Services.REFERRAL_FOLLOW_UP });
    expect(followUpTask).to.have.property('length', 0);
  });
});
