const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { DateTime } = require('luxon');
const { personRegistrationScenarios, u5AssessmentScenarios, immunizationServiceScenarios } = require('../forms-inputs');
const { Targets, Services, Persons } = require('../../common-extras');

describe('Target: % of children with upto date Growth Monitoring', () => {
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
    const [analytics] = await harness.getTargets({ type: Targets.CHILDREN_WITH_UPTODATE_GROWTH_MONITORING });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });
  });

  it('should increment value if growth monitoring is upto date', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    let [analytics] = await harness.getTargets({ type: Targets.CHILDREN_WITH_UPTODATE_GROWTH_MONITORING });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1 });

    let result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_fast_breathing_not_given_amox);
    expect(result.errors).to.be.empty;
    [analytics] = await harness.getTargets({ type: Targets.CHILDREN_WITH_UPTODATE_GROWTH_MONITORING });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.over1Under5Yr(DateTime.now().minus({ years: 3 }).toISODate()));
    expect(result.errors).to.be.empty;

    harness.subject = result.contacts[0];
    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2MonthOld_muac_swollen_feet);
    expect(result.errors).to.be.empty;
    [analytics] = await harness.getTargets({ type: Targets.CHILDREN_WITH_UPTODATE_GROWTH_MONITORING });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 2 });
  });

  it('should not increment value if growth monitoring is not upto date', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ month: 6 }).toISODate();
    let [analytics] = await harness.getTargets({ type: Targets.CHILDREN_WITH_UPTODATE_GROWTH_MONITORING });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1 });

    let result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...immunizationServiceScenarios.referGrowthMonitoring);
    expect(result.errors).to.be.empty;
    [analytics] = await harness.getTargets({ type: Targets.CHILDREN_WITH_UPTODATE_GROWTH_MONITORING });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.over1Under5Yr(DateTime.now().minus({ years: 3 }).toISODate()));
    expect(result.errors).to.be.empty;

    harness.subject = result.contacts[0];
    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_no_growth_monitoring);
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.CHILDREN_WITH_UPTODATE_GROWTH_MONITORING });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 2 });
  });

  it('should reset % of children with upto date growth monitoring monthly', async () => {
    await harness.setNow(DateTime.now().startOf('month').toISODate());

    let [analytics] = await harness.getTargets({ type: Targets.CHILDREN_WITH_UPTODATE_GROWTH_MONITORING });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });

    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_fully_immunized);
    expect(result.errors).to.be.empty;
    [analytics] = await harness.getTargets({ type: Targets.CHILDREN_WITH_UPTODATE_GROWTH_MONITORING });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    await harness.setNow(DateTime.now().endOf('month').plus({ days: 1 }).toISODate());
    [analytics] = await harness.getTargets({ type: Targets.CHILDREN_WITH_UPTODATE_GROWTH_MONITORING });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1 });
  });
});
