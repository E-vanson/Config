const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { Targets, Persons, Services, DAYS_IN_WEEK } = require('../../common-extras');
const { personRegistrationScenarios, overFiveAssessmentScenarios, DateTime, pregnancyHomeVisitScenarios } = require('../forms-inputs');

describe('Target: percent over 5 years assessed', () => {
  before(async () => {
    return await harness.start();
  });
  after(async () => {
    return await harness.stop();
  });
  beforeEach(async () => {
    await harness.clear();
    harness.subject.date_of_birth = DateTime.now().minus({ year: 4 }).toISODate();
  });
  afterEach(() => {
    expect(harness.consoleErrors).to.be.empty;
  });

  it('default percent', async () => {
    const [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_5_YEARS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });
  });

  it('should count an eligible  over 5 years contact with assessment report', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 6 }).toISODate();

    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_5_YEARS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });

    let result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasTBSigns);
    expect(result.errors).to.be.empty;

    result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.man(DateTime.now().minus({ years: 25 }).toISODate()));
    expect(result.errors).to.be.empty;

    harness.subject = result.contacts.find(c => c.contact_type === Persons.CLIENT);
    result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasDangerSignsReferral);
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_5_YEARS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 2, 'value.total': 2, 'value.percent': 100 });

    result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.man(DateTime.now().minus({ years: 30 }).toISODate()));
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_5_YEARS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 2, 'value.total': 3, 'value.percent': 67 });

    harness.subject = result.contacts.find(c => c.contact_type === Persons.CLIENT);
    result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasDangerSignsReferral);
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_5_YEARS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 3, 'value.total': 3, 'value.percent': 100 });
  });

  it('should update count when eligible over 5 years is muted', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 8 }).toISODate();
    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_5_YEARS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });

    await harness.flush({ days: DAYS_IN_WEEK });
    harness.subject.muted = DateTime.now().minus({ days: 1 }).toISODate();
    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_5_YEARS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });

  });

  it('should update count when eligible over 5 years contact has death confirmed', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 12 }).toISODate();
    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_5_YEARS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });

    await harness.flush({ days: DAYS_IN_WEEK });
    const result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasOtherDangerSignsReferralForWithCareGiver);
    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_5_YEARS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1, 'value.percent': 100 });
    expect(result.errors).to.be.empty;

    harness.subject.date_of_death = DateTime.now().plus({ days: 1 }).toISODate();
    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_5_YEARS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });
  });

  it('should reset the target percent over 5 years assessed at the beginning of each month (no assessments done yet)', async () => {
    harness.setNow(DateTime.now().startOf('month').toISODate());
    harness.subject.date_of_birth = DateTime.now().minus({ year: 10 }).toISODate();

    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_5_YEARS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });

    const result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasOtherDangerSignsReferralForWithCareGiver);
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_5_YEARS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1, 'value.percent': 100 });

    harness.setNow(DateTime.now().endOf('month').plus({ days: 1 }).toISODate());
    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_5_YEARS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });
  });

  it('should not update if an eligible over 5 years has non-assessment report', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ years: 20 }).toISODate();

    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_5_YEARS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });

    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant());
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_5_YEARS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });
  });
});
