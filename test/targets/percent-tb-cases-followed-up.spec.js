const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { DateTime } = require('luxon');
const { u5AssessmentScenarios, overFiveAssessmentScenarios, referralFollowUpScenarios, personRegistrationScenarios } = require('../forms-inputs');
const { Targets, Services, Persons, TASKS } = require('../../common-extras');

describe('Target: % of referred TB cases followed up', () => {
  before(async () => {
    return await harness.start();
  });
  after(async () => {
    return await harness.stop();
  });
  beforeEach(async () => {
    await harness.clear();
    await harness.setNow('2001-01-31');
  });
  afterEach(() => {
    expect(harness.consoleErrors).to.be.empty;
  });

  it('default target value', async () => {
    const [analytics] = await harness.getTargets({ type: Targets.PERCENT_REFERRED_TB_CASES_FOLLOWED_UP });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });
  });

  it('under 5 assessment with tb follow up should increment percent and value if a follow up is done', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_REFERRED_TB_CASES_FOLLOWED_UP });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });

    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_contact_with_tb_and_danger_sign);
    expect(result.errors).to.be.empty;
    await harness.flush(3);
    const tasks = await harness.getTasks({ title: TASKS.under5_3day_referral });
    const resultReferralFollowUp = await harness.loadAction(tasks[0], ...referralFollowUpScenarios.availableAndVisited);
    expect(resultReferralFollowUp.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.PERCENT_REFERRED_TB_CASES_FOLLOWED_UP });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.percent': 100, 'value.total': 1 });

    //Check value at end month. Should remain the same
    await harness.setNow(DateTime.now().endOf('month').toISODate());

    analytics = await harness.getTargets({ type: Targets.PERCENT_REFERRED_TB_CASES_FOLLOWED_UP, subject: 'patient_id', user: 'cha_id' });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.percent': 100, 'value.total': 1 });

    //Value should change next month to zero
    await harness.flush({ days: 1 });

    analytics = await harness.getTargets({ type: Targets.PERCENT_REFERRED_TB_CASES_FOLLOWED_UP, subject: 'patient_id', user: 'cha_id' });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.percent': 0, 'value.total': 0 });
  });

  it('over 5 assessment with tb follow up should increment percent and value if a follow up is done', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 6 }).toISODate();
    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_REFERRED_TB_CASES_FOLLOWED_UP });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });

    const result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasTBSigns);
    expect(result.errors).to.be.empty;

    const monthAtCreation = DateTime.now().month;
    await harness.flush(3);
    const targetValue = DateTime.now().month > monthAtCreation ? 0 : 1;

    //Should still be 0 for pass since referral not yet submitted
    //NOTE: value.total resets at the end of the month
    analytics = await harness.getTargets({ type: Targets.PERCENT_REFERRED_TB_CASES_FOLLOWED_UP });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.total': targetValue, 'value.percent': 0 });

    const tasks = await harness.getTasks({ title: TASKS.over5_3day_referral });
    const resultReferralFollowUp = await harness.loadAction(tasks[0], ...referralFollowUpScenarios.availableAndVisited);
    expect(resultReferralFollowUp.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.PERCENT_REFERRED_TB_CASES_FOLLOWED_UP });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.percent': 100, 'value.total': 1 });
  });

  it('filling both over 5 assessment and u5 assssment with tb follow up should increment percent and value if a follow up is done', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_REFERRED_TB_CASES_FOLLOWED_UP });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });

    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_contact_with_tb_and_danger_sign);
    expect(result.errors).to.be.empty;

    const monthAtCreation = DateTime.now().month;
    await harness.flush(3);
    // Work around monthly targets resetting when you cross over to a new month
    const targetValue = DateTime.now().month > monthAtCreation ? 0 : 1;

    analytics = await harness.getTargets({ type: Targets.PERCENT_REFERRED_TB_CASES_FOLLOWED_UP });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.total': targetValue, 'value.percent': 0 });

    const tasks = await harness.getTasks({ title: TASKS.under5_3day_referral });
    const resultReferralFollowUp = await harness.loadAction(tasks[0], ...referralFollowUpScenarios.availableAndVisited);
    expect(resultReferralFollowUp.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.PERCENT_REFERRED_TB_CASES_FOLLOWED_UP });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.percent': 100, 'value.total': 1 });

    const contactResult = await harness.fillContactCreateForm(Persons.CLIENT, ...personRegistrationScenarios.overFiveUnderTenMale(DateTime.now().minus({ years: 6 }).toISODate()));
    expect(contactResult.errors).to.be.empty;

    harness.subject = contactResult.contacts[0];

    analytics = await harness.getTargets({ type: Targets.PERCENT_REFERRED_TB_CASES_FOLLOWED_UP });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.percent': 100, 'value.total': 1 });

    const resultOver5 = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasTBSigns);
    expect(resultOver5.errors).to.be.empty;
    await harness.flush(3);
    const tasksOver5 = await harness.getTasks({ title: TASKS.over5_3day_referral });
    const resultOver5ReferralFollowUp = await harness.loadAction(tasksOver5[0], ...referralFollowUpScenarios.availableAndVisited);
    expect(resultOver5ReferralFollowUp.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.PERCENT_REFERRED_TB_CASES_FOLLOWED_UP });
    expect(analytics[0]).to.nested.include({ 'value.pass': 2, 'value.percent': 100, 'value.total': 2 });
  });

  it('under 5 should not increment value if no tb referral is done', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_REFERRED_TB_CASES_FOLLOWED_UP });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });

    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_fast_breathing);
    expect(result.errors).to.be.empty;
    await harness.flush(3);
    const tasks = await harness.getTasks({ title: TASKS.under5_3day_referral });
    expect(tasks).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.PERCENT_REFERRED_TB_CASES_FOLLOWED_UP });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.percent': 0, 'value.total': 0 });
  });

  it('over 5 should not increment value if no referral is done', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 6 }).toISODate();
    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_REFERRED_TB_CASES_FOLLOWED_UP });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });

    const result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasDiarrhoea);
    expect(result.errors).to.be.empty;
    await harness.flush(3);

    //Should still be 0 for pass since referral not yet submitted
    analytics = await harness.getTargets({ type: Targets.PERCENT_REFERRED_TB_CASES_FOLLOWED_UP });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });

    const tasks = await harness.getTasks({ title: TASKS.danger_signs_referral_follow_up });
    const resultReferralFollowUp = await harness.loadAction(tasks[0], ...referralFollowUpScenarios.availableAndVisited);
    expect(resultReferralFollowUp.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.PERCENT_REFERRED_TB_CASES_FOLLOWED_UP });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.percent': 0, 'value.total': 0 });
  });
});
