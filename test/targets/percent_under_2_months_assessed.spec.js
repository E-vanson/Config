const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { Targets, Persons, Services, DAYS_IN_WEEK } = require('../../common-extras');
const { personRegistrationScenarios, u5AssessmentScenarios, DateTime, referralFollowUpScenarios } = require('../forms-inputs');
const now = () => DateTime.now();

describe('Target: percent under 2 months assessed', () => {
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

  it('default percent', async () => {
    const [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_LT_2_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });
  });

  it('should count an eligible under 2 months with assessment report', async () => {
    let result = await harness.fillContactCreateForm(Persons.CLIENT, ...personRegistrationScenarios.under6Month(now().minus({ month: 1 }).toISODate()));
    expect(result.errors).to.be.empty;

    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_LT_2_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });

    harness.subject = result.contacts.find(c => c.contact_type === Persons.CLIENT);
    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.under2MonthOld_noDangerSigns);
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_LT_2_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1, 'value.percent': 100 });
  });

  it('should update count when under 2 months household member is muted', async () => {
    harness.subject.date_of_birth = now().minus({ months: 1 }).toISODate();
    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_LT_2_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });

    await harness.flush({ days: DAYS_IN_WEEK });
    harness.subject.muted = now().minus({ days: 1 }).toISODate();
    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_LT_2_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });

  });

  it('should update count when under 2 months household member has death confirmed', async () => {
    harness.subject.date_of_birth = now().minus({ months: 1 }).toISODate();
    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_LT_2_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });

    await harness.flush({ days: DAYS_IN_WEEK });
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.under2MonthOld_noDangerSigns);
    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_LT_2_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1, 'value.percent': 100 });
    expect(result.errors).to.be.empty;

    harness.subject.date_of_death = now().plus({ days: 1 }).toISODate();
    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_LT_2_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });
  });

  it('should not update when an over 2 months with assessments is submitted', async () => {
    harness.subject.date_of_birth = now().minus({ year: 3 }).toISODate();
    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_LT_2_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });

    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2MonthOld_noDangerSigns);
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_LT_2_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });
  });

  it('should reset percent under 2 months assessed monthly', async () => {
    harness.setNow(now().startOf('month').toISODate());
    let result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.under6Month(now().minus({ days: 20 }).toISODate()));
    expect(result.errors).to.be.empty;

    harness.subject = result.contacts.find(c => c.contact_type === Persons.CLIENT);
    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.under1MonthOld_noDangerSigns);
    expect(result.errors).to.be.empty;

    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_LT_2_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1, 'value.percent': 100 });

    result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.under6Month(now().minus({ days: 20 }).toISODate()));
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_LT_2_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 2, 'value.percent': 50 });

    harness.setNow(now().endOf('month').plus({ days: 1 }).toISODate());
    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_LT_2_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 2, 'value.percent': 0 });

    harness.setNow(now().plus({ year: 2 }).toISODate()); // make contacts older then 2 months
    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_LT_2_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });

    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2MonthOld_noDangerSigns);
    expect(result.errors).to.be.empty;
    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_LT_2_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });

  });

  it('should not update if an eligible under 2 months has non-assessment report', async () => {
    let result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.under6Month(now().minus({ month: 1 }).toISODate()));
    expect(result.errors).to.be.empty;

    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_LT_2_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });

    harness.subject = result.contacts.find(c => c.contact_type === Persons.CLIENT);
    harness.content.t_referral_type = 'danger signs';
    result = await harness.fillForm(Services.REFERRAL_FOLLOW_UP, ...referralFollowUpScenarios.notAvailable);
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_LT_2_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });
  });
});
