const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness({ subject: 'household_id' });
const { postnatalServiceScenarios, getDate } = require('../forms-inputs');
const { Services, DAYS_IN_WEEK, DELIVERY_CHECK_WEEKS } = require('../../common-extras');
const { Targets } = require('../../common-extras');

describe('WASH Service Targets', () => {
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

  it('increments target if it was a skilled delivery', async () => {
    const flushDays = DELIVERY_CHECK_WEEKS.START * DAYS_IN_WEEK;
    await harness.flush(flushDays);
    // submit a service report
    let analytics = await harness.getTargets({ type: Targets.SKILLED_DELIVERIES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.percent': 0, 'value.total': 0 });

    const report = await harness.fillForm(Services.POSTNATAL_CARE_SERVICE, ...postnatalServiceScenarios.deliveredAndWell(getDate(-DAYS_IN_WEEK), getDate(DAYS_IN_WEEK)));
    expect(report.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.SKILLED_DELIVERIES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.percent': 100, 'value.total': 1 });

  });

  it('does not increment target if it was not a skilled delivery', async () => {
    // submit a service report
    let analytics = await harness.getTargets({ type: Targets.SKILLED_DELIVERIES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.percent': 0, 'value.total': 0 });

    const report = await harness.fillForm(Services.POSTNATAL_CARE_SERVICE, ...postnatalServiceScenarios.pncMotherDangerSigns(7));
    expect(report.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.SKILLED_DELIVERIES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.percent': 0, 'value.total': 1 });

  });
});
