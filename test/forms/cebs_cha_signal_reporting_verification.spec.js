const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-things'));

const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { cebsScenarios } = require('../forms-inputs');
const { Services } = require('../../common-extras');

describe.skip('CEBS CHA Signal Reporting and Verification', () => {
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

  it('successfully submitted', async() => {
    const result = await harness.fillForm(Services.CEBS_CHA_SIGNAL_REPORTING_VERIFICATION, ...cebsScenarios.chaSignalReporting);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.be.nested.include({
      'cha_signal.signal_type': 'child_weak_legs_arms',
      signal_code: '3',
    });
  });

  it('validates datetime', async() => {
    const result = await harness.fillForm(Services.CEBS_CHA_SIGNAL_REPORTING_VERIFICATION, ...cebsScenarios.chaSignalReportingDateInFuture);
    expect(result.errors).to.have.lengthOf(6);
    const uniqueErrors = new Set(result.errors.map(each => each.msg));
    expect(uniqueErrors).to.have.lengthOf(2);
    const dateErrMsg = 'Date should not be in the future.';
    const timeErrMsg = 'Time should not be in the future.';
    expect(uniqueErrors).to.include(dateErrMsg);
    expect(uniqueErrors).to.include(timeErrMsg);
  });

  it('requires sub county disease surveillance notificate date if threat is ongoing', async() => {
    const result = await harness.fillForm(Services.CEBS_CHA_SIGNAL_REPORTING_VERIFICATION, ...cebsScenarios.chaSignalReportingNotAnOngoingThreat);
    expect(result.errors).to.be.empty;
    expect(result.report.fields.cha_verification).to.not.have.keys('q_scdsc_informed_datetime');
  });
});
