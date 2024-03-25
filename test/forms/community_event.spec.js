const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness({ subject: 'chu_id' });
const { communityEventScenarios } = require('../forms-inputs');
const { Services } = require('../../common-extras');

describe('CHU Community Event', () => {
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

  it('form can be filled and successfully saved', async () => {
    const result = await harness.fillForm(Services.COMMUNITY_EVENT, ...communityEventScenarios.default(-2));
    expect(result.errors).to.be.empty;

    // Verify some attributes on the resulting report
    expect(result.report.fields).to.nested.include({
      place_id: 'chu_id',
      community_health_unit_name: 'Test Community Health Unit'
    });
  });

  it('should display error if date is in the future', async () => {
    const result = await harness.fillForm(Services.COMMUNITY_EVENT, ...communityEventScenarios.default(1));
    expect(result.errors[0]).to.deep.include({
      type: 'validation',
      msg: 'Date cannot be in the future'
    });
  });

  it('should show error if number of attendees is less than 0', async () => {
    const result = await harness.fillForm(Services.COMMUNITY_EVENT, ...communityEventScenarios.numAttendeesEdits(-3));
    expect(result.errors[0]).to.deep.include({
      type: 'validation',
      msg: 'Number must be at least 0 and equal to the number of male and female attendees'
    });
  });

  it('should show error if number of male attendees is less than 0', async () => {
    const result = await harness.fillForm(Services.COMMUNITY_EVENT, ...communityEventScenarios.numAttendeesEdits(3, -2));
    expect(result.errors[0]).to.deep.include({
      type: 'validation',
      msg: 'Number must be greater or equal to 0'
    });

    expect(result.errors[1]).to.deep.include({
      type: 'validation',
      msg: 'Number must be at least 0 and equal to the number of male and female attendees'
    });
  });

  it('should show error if number of female attendees is less than 0', async () => {
    const result = await harness.fillForm(Services.COMMUNITY_EVENT, ...communityEventScenarios.numAttendeesEdits(3, 2, -1));
    expect(result.errors[0]).to.deep.include({
      type: 'validation',
      msg: 'Number must be greater or equal to 0'
    });

    expect(result.errors[1]).to.deep.include({
      type: 'validation',
      msg: 'Number must be at least 0 and equal to the number of male and female attendees'
    });
  });
});
