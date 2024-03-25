const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness({ subject: 'household_id' });
const { washStatusScenarios, getDate } = require('../forms-inputs');
const { Services } = require('../../common-extras');

describe('Wash service test', () => {
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

  it('wash form can be filled and successfully saved - wash status: good ', async () => {
    // Load the wash form and fill in
    const result = await harness.fillForm(Services.WASH, ...washStatusScenarios.good);
    expect(result.errors).to.be.empty;

    // Verify some attributes on the resulting report
    expect(result.report.fields).to.nested.include({
      place_id: 'household_id',
      place_name: 'Test Household',
      place_contact_id: 'patient_id',
      place_contact_name: 'Test Client',
      'summary.good_wash_status': 'true'
    });
  });

  it('wash form can be filled and successfully saved - wash status: not good ', async () => {
    // Load the wash form and fill in
    const result = await harness.fillForm(Services.WASH, ...washStatusScenarios.notGood);

    // Verify that the form successfully got submitted
    expect(result.errors).to.be.empty;

    // Verify some attributes on the resulting report
    const followUpDays = 28;
    expect(result.report.fields).to.nested.include({
      place_id: 'household_id',
      place_name: 'Test Household',
      place_contact_id: 'patient_id',
      place_contact_name: 'Test Client',
      'summary.next_follow_up_date': getDate(followUpDays),
      'summary.good_wash_status': 'false',
      visited_contact_uuid: 'household_id'
    });
  });
});
