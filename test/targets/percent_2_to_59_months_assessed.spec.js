const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { Targets, Persons, Services, DAYS_IN_WEEK } = require('../../common-extras');
const { personRegistrationScenarios, u5AssessmentScenarios, DateTime, immunizationServiceScenarios } = require('../forms-inputs');

describe('Target: percent 2 to 59 months assessed', () => {
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
    const [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_2_TO_59_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });
  });

  it('should count an eligible over 2 months with assessment report', async () => {
    // first contact
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();

    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_2_TO_59_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });

    let result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2MonthOld_noDangerSigns);
    expect(result.errors).to.be.empty;

    result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.over1Under5Yr(DateTime.now().minus({ year: 3 }).toISODate()));
    expect(result.errors).to.be.empty;

    harness.subject = result.contacts.find(c => c.contact_type === Persons.CLIENT);
    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2MonthOld_noDangerSigns);
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_2_TO_59_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 2, 'value.total': 2, 'value.percent': 100 });

    result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.over1Under5Yr(DateTime.now().minus({ year: 3 }).toISODate()));
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_2_TO_59_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 2, 'value.total': 3, 'value.percent': 67 });

    harness.subject = result.contacts.find(c => c.contact_type === Persons.CLIENT);
    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2MonthOld_noDangerSigns);
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_2_TO_59_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 3, 'value.total': 3, 'value.percent': 100 });
  });

  it('should update count when eligible over 2 months is muted', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_2_TO_59_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });

    await harness.flush({ days: DAYS_IN_WEEK });
    harness.subject.muted = DateTime.now().minus({ days: 1 }).toISODate();
    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_2_TO_59_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });

  });

  it('should update count when eligible over 2 months has death confirmed', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_2_TO_59_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });

    await harness.flush({ days: DAYS_IN_WEEK });
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2MonthOld_noDangerSigns);
    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_2_TO_59_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1, 'value.percent': 100 });
    expect(result.errors).to.be.empty;

    harness.subject.date_of_death = DateTime.now().plus({ days: 1 }).toISODate();
    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_2_TO_59_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });
  });

  it('should not update when an under 2 months with assessments is submitted', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ months: 1 }).toISODate();
    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_2_TO_59_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });

    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.under2MonthOld_noDangerSigns);
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_2_TO_59_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });
  });

  it('should reset the target percent 2-59 months assessed at the beginning of each month (no assessments done yet)', async () => {
    harness.setNow(DateTime.now().startOf('month').toISODate());
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();

    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_2_TO_59_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });

    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_fully_immunized);
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_2_TO_59_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1, 'value.percent': 100 });

    harness.setNow(DateTime.now().endOf('month').plus({ days: 1 }).toISODate());
    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_2_TO_59_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });
  });

  it('should not update if an eligible over 2 months has non-assessment report', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ months: 6 }).toISODate();

    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_2_TO_59_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });

    const result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...immunizationServiceScenarios.referForSomeMissedVaccines);
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_2_TO_59_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });
  });

  it('should not update if an over 5 years is added', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ years: 6 }).toISODate();

    const [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_2_TO_59_MONTHS_ASSESSED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });
  });
});
