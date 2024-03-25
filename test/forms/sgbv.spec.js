const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { sgbvScenarios, referralFollowUpScenarios } = require('../forms-inputs');
const { Services, getField } = require('../../common-extras');

describe('SGBV Assessment Test', () => {
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

  it('Assessed with no violence signs observerd ', async () => {
    const result = await harness.fillForm(Services.SGBV, ...sgbvScenarios.none);
    expect(result.errors).to.be.empty;
  });

  it('Assessed with violence signs observerd ', async () => {
    const result = await harness.fillForm(Services.SGBV, ...sgbvScenarios.observed);
    expect(result.errors).to.be.empty;
  });

  it('Assessed with violence signs observerd with referral follow up', async () => {
    let result = await harness.fillForm(Services.SGBV, ...sgbvScenarios.referred);
    expect(result.errors).to.be.empty;

    harness.user = 'cha_id';
    const tasks = await harness.getTasks({ title: 'task.sgbv_referral_follow_up.title' });
    expect(tasks).lengthOf(1);

    result = await harness.loadAction(tasks[0], ...referralFollowUpScenarios.availableAndVisited);
    expect(result.errors).to.be.empty;
    expect(getField(result.report, 'group_follow_up.sgbv_observed')).to.not.be.null;
    expect(await harness.getTasks({ title: 'task.sgbv_referral_follow_up.title' })).lengthOf(0);
  });

});
