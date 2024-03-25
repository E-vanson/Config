const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { DateTime } = require('luxon');
const { personRegistrationScenarios, pregnancyHomeVisitScenarios, postnatalServiceScenarios, postnatalServiceNewbornScenarios, u5AssessmentScenarios, immunizationServiceScenarios, defaulterFollowUpScenarios, getDate } = require('../forms-inputs');
const { Targets, Services, Persons, DAYS_IN_WEEK } = require('../../common-extras');
const now = () => DateTime.now();

describe('Target: Total Referrals', () => {
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
    const [analytics] = await harness.getTargets({ type: Targets.TOTAL_REFERRALS });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });
  });

  it('should increment value if a referral is done', async () => {
    let [analytics] = await harness.getTargets({ type: Targets.TOTAL_REFERRALS });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });

    let result = await harness.fillForm(Services.DEFAULTER_FOLLOW_UP, ...defaulterFollowUpScenarios.availableNoClinicVisitNeedsClinicVisitPNC);
    expect(result.errors).to.be.empty;
    [analytics] = await harness.getTargets({ type: Targets.TOTAL_REFERRALS });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    result = await harness.fillForm(Services.POSTNATAL_CARE, ...postnatalServiceScenarios.pncMotherDangerSigns(7));
    expect(result.errors).to.be.empty;
    [analytics] = await harness.getTargets({ type: Targets.TOTAL_REFERRALS });
    expect(analytics).to.nested.include({ 'value.pass': 2, 'value.total': 2 });

    result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.under6Month(now().minus({ days: 1 }).toISODate()));
    expect(result.errors).to.be.empty;
    
    harness.subject = result.contacts[0];
    result = await harness.fillForm(Services.POSTNATAL_CARE_SERVICE_NEWBORN, ...postnatalServiceNewbornScenarios.withDangerSigns());
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.TOTAL_REFERRALS });
    expect(analytics).to.nested.include({ 'value.pass': 3, 'value.total': 3 });

    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.under2MonthOld_chest_indrawing_danger_sign);
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.TOTAL_REFERRALS });
    expect(analytics).to.nested.include({ 'value.pass': 4, 'value.total': 4 });

    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.under2MonthOld_chest_indrawing_danger_sign);
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.TOTAL_REFERRALS });
    expect(analytics).to.nested.include({ 'value.pass': 5, 'value.total': 5 });

    harness.subject.date_of_birth = now().minus({ months: 6 }).toISODate();
    result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...immunizationServiceScenarios.referForSomeMissedVaccines);
    [analytics] = await harness.getTargets({ type: Targets.TOTAL_REFERRALS });
    expect(analytics).to.nested.include({ 'value.pass': 6, 'value.total': 6 });
  });

  it('should not increment value if no referral is done', async () => {
    let [analytics] = await harness.getTargets({ type: Targets.TOTAL_REFERRALS });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });

    let result = await harness.fillForm(Services.POSTNATAL_CARE, ...postnatalServiceScenarios.deliveredAndWell(getDate(-DAYS_IN_WEEK), getDate(DAYS_IN_WEEK)));
    expect(result.errors).to.be.empty;
    [analytics] = await harness.getTargets({ type: Targets.TOTAL_REFERRALS });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });

    result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.under6Month(now().minus({ days: 1 }).toISODate()));
    expect(result.errors).to.be.empty;
    
    harness.subject = result.contacts[0];
    result = await harness.fillForm(Services.POSTNATAL_CARE_SERVICE_NEWBORN, ...postnatalServiceNewbornScenarios.default());
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.TOTAL_REFERRALS });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });
  });

  it('should reset total referrals count monthly', async () => {
    await harness.setNow(now().startOf('month').toISODate());
    
    let [analytics] = await harness.getTargets({ type: Targets.TOTAL_REFERRALS });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });

    let result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.muac('yellow'));
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.TOTAL_REFERRALS });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.under6Month(now().minus({ month: 1 }).toISODate()));
    expect(result.errors).to.be.empty;
    
    harness.subject = result.contacts[0];
    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.under2MonthOld_chest_indrawing_danger_sign);
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.TOTAL_REFERRALS });
    expect(analytics).to.nested.include({ 'value.pass': 2, 'value.total': 2 });

    await harness.setNow(now().endOf('month').plus({ days: 1 }).toISODate());
    [analytics] = await harness.getTargets({ type: Targets.TOTAL_REFERRALS });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });
  });
});
