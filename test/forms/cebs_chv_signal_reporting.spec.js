const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-things'));

const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { cebsScenarios } = require('../forms-inputs');
const { Services } = require('../../common-extras');

describe('CEBS CHV Signal Reporting', () => {
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

  it('is successfully submitted', async() => {
    const result = await harness.fillForm(Services.CEBS_CHV_SIGNAL_REPORTING, ...cebsScenarios.chvSignalReporting);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.be.nested.include({
      'chv_signal.signal_type': 'public_event_of_concern',
      'chv_signal.signal_description': 'Food poisoning at Kids Excellence School.',
      signal_code: '7',
    });
  });

  it('validates required signal type', async() => {
    const result = await harness.fillForm(Services.CEBS_CHV_SIGNAL_REPORTING, []);
    expect(result.errors).to.have.lengthOf(1);
    expect(result.errors[0]).to.include({
      msg: 'enketo.constraint.required'
    });
  });
});
