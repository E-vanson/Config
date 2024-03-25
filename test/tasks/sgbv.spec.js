const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { sgbvScenarios, referralFollowUpScenarios, overFiveAssessmentScenarios } = require('../forms-inputs');
const { Services, TASKS } = require('../../common-extras');

describe('SGBV Service Tasks', () => {
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

  it(`should not trigger if client not referred to the cha`, async () => {
    let result = await harness.fillForm(Services.SGBV, ...sgbvScenarios.observed);
    expect(result.errors).to.be.empty;

    let tasks = await harness.getTasks({ title: TASKS.sgbv_referral_follow_up });
    expect(tasks).to.have.property('length', 0);

    result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasDangerSignsReferral);
    expect(result.errors).to.be.empty;
    tasks = await harness.getTasks({ title: TASKS.sgbv_referral_follow_up });
    expect(tasks).to.have.property('length', 0);
  });

  it(`should trigger chv follow up task if client was referred to cha`, async () => {
    let result = await harness.fillForm(Services.SGBV, ...sgbvScenarios.referred);
    expect(result.errors).to.be.empty;
    await harness.flush({days: 3});
    let tasks = await harness.getTasks({ title: TASKS.sgbv_referral_follow_up });
    expect(tasks).to.have.property('length', 1);

    result = await harness.loadAction(tasks[0], ...referralFollowUpScenarios.availableAndVisited);
    expect(result.errors).to.be.empty;
    tasks = await harness.getTasks({ title: TASKS.sgbv_referral_follow_up });
    expect(tasks).to.have.property('length', 0);

    result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasSGBVSigns);
    expect(result.errors).to.be.empty;
    tasks = await harness.getTasks({ title: TASKS.sgbv_referral_follow_up });
    expect(tasks).to.have.property('length', 1);

    result = await harness.loadAction(tasks[0], ...referralFollowUpScenarios.availableAndVisited);
    expect(result.errors).to.be.empty;
    tasks = await harness.getTasks({ title: TASKS.sgbv_referral_follow_up });
    expect(tasks).to.have.property('length', 0);
  });
});
