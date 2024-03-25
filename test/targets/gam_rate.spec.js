const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { DateTime } = require('luxon');
const { personRegistrationScenarios, u5AssessmentScenarios } = require('../forms-inputs');
const { Targets, Services, Persons } = require('../../common-extras');

describe('Target: GAM (global acute malnutrition) Rate', () => {
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

  it('default target value', async () => {
    harness.user = 'cha_id';
    const [analytics] = await harness.getTargets({ type: Targets.GAM_RATE });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });
  });

  it('should increment value if a red or yellow muac color is reported', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    let [analytics] = await harness.getTargets({ type: Targets.GAM_RATE });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });

    let result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2MonthOld_muac_red);
    expect(result.errors).to.be.empty;
    harness.user = 'cha_id';
    [analytics] = await harness.getTargets({ type: Targets.GAM_RATE });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    harness.user = 'chv_id';
    result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.over1Under5Yr(DateTime.now().minus({ years: 3 }).toISODate()));
    expect(result.errors).to.be.empty;

    harness.subject = result.contacts[0];
    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2MonthOld_muac_swollen_feet);
    expect(result.errors).to.be.empty;
    harness.user = 'cha_id';
    [analytics] = await harness.getTargets({ type: Targets.GAM_RATE });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 2 });

    harness.user = 'chv_id';
    result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.over1Under5Yr(DateTime.now().minus({ years: 3.5 }).toISODate()));
    expect(result.errors).to.be.empty;

    harness.subject = result.contacts[0];
    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2MonthOld_muac_yellow);
    expect(result.errors).to.be.empty;
    harness.user = 'cha_id';
    [analytics] = await harness.getTargets({ type: Targets.GAM_RATE });
    expect(analytics).to.nested.include({ 'value.pass': 2, 'value.total': 3 });
  });

  it('should not increment value if muac is not done or is green', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    harness.user = 'cha_id';
    let [analytics] = await harness.getTargets({ type: Targets.GAM_RATE });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });

    harness.user = 'chv_id';
    let result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2MonthOld_muac_swollen_feet);
    expect(result.errors).to.be.empty;
    harness.user = 'cha_id';
    [analytics] = await harness.getTargets({ type: Targets.GAM_RATE });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1 });

    harness.user = 'chv_id';
    result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.over1Under5Yr(DateTime.now().minus({ years: 3 }).toISODate()));
    expect(result.errors).to.be.empty;

    harness.subject = result.contacts[0];
    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2MonthOld_muac_not_done);
    expect(result.errors).to.be.empty;

    harness.user = 'cha_id';
    [analytics] = await harness.getTargets({ type: Targets.GAM_RATE });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1 });
  });

  it('should reset GAM rate monthly', async () => {
    await harness.setNow(DateTime.now().startOf('month').toISODate());

    harness.user = 'cha_id';
    let [analytics] = await harness.getTargets({ type: Targets.GAM_RATE });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });

    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    harness.user = 'chv_id';
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2MonthOld_muac_red);
    expect(result.errors).to.be.empty;
    harness.user = 'cha_id';
    [analytics] = await harness.getTargets({ type: Targets.GAM_RATE });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    await harness.setNow(DateTime.now().endOf('month').plus({ days: 1 }).toISODate());
    [analytics] = await harness.getTargets({ type: Targets.GAM_RATE });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });
  });
});
