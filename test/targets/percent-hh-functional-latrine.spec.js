const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness({ subject: 'household_id' });
const { washStatusScenarios } = require('../forms-inputs');
const { Services } = require('../../common-extras');
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

  it('if functional latrine present target should increase by total pass of 1 and total value of 1', async () => {
    let analytics = await harness.getTargets({ type: Targets.HH_FUNCTIONAL_LATRINES, user: 'cha_id' });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.percent': 0, 'value.total': 0 });

    const report = await harness.fillForm({ form: Services.WASH, subject: 'household_id' }, ...washStatusScenarios.good);
    expect(report.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.HH_FUNCTIONAL_LATRINES, subject: 'household_id', user: 'cha_id' });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.percent': 100, 'value.total': 1 });

    //If non functional latrine wash report sent the next day, total pass should be 0
    const reportNextDay = await harness.fillForm(Services.WASH, ...washStatusScenarios.notGood);
    expect(reportNextDay.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.HH_FUNCTIONAL_LATRINES, user: 'cha_id' });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.percent': 0, 'value.total': 1 });

    // 1 month later
    harness.flush(31);

    analytics = await harness.getTargets({ type: Targets.HH_FUNCTIONAL_LATRINES, user: 'cha_id' });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.percent': 0, 'value.total': 1 });
    //Send functional latrine form
    const reportOneMonthLater = await harness.fillForm({ form: Services.WASH, subject: 'household_id' }, ...washStatusScenarios.good);
    expect(reportOneMonthLater.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.HH_FUNCTIONAL_LATRINES, subject: 'household_id', user: 'cha_id' });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.percent': 100, 'value.total': 1 });
  });

  it('if functional latrine not present target should increase by pass of 0  and total value of 1', async () => {
    let analytics = await harness.getTargets({ type: Targets.HH_FUNCTIONAL_LATRINES, user: 'cha_id' });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.percent': 0, 'value.total': 0 });

    const report = await harness.fillForm(Services.WASH, ...washStatusScenarios.notGood);
    expect(report.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.HH_FUNCTIONAL_LATRINES, user: 'cha_id' });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.percent': 0, 'value.total': 1 });
  });
});
