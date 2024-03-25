const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { DateTime } = require('luxon');
const { personRegistrationScenarios, u5AssessmentScenarios, overFiveAssessmentScenarios } = require('../forms-inputs');
const { Targets, Services, Persons } = require('../../common-extras');

describe('Target: % of >2 months with suspected malaria tested with mRDT', () => {
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
    const [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_2_MONTHS_SUSPECTED_MALARIA_TESTED_WITH_MRDT });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });
  });

  it('should increment value if a positive or negative or invalid mrdt result is reported', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 15 }).toISODate();
    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_2_MONTHS_SUSPECTED_MALARIA_TESTED_WITH_MRDT });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });

    let result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasMalariaReferral);
    expect(result.errors).to.be.empty;
    harness.user = 'cha_id';
    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_2_MONTHS_SUSPECTED_MALARIA_TESTED_WITH_MRDT });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    harness.user = 'chv_id';
    result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.over1Under5Yr(DateTime.now().minus({ years: 3 }).toISODate()));
    expect(result.errors).to.be.empty;

    harness.subject = result.contacts[0];
    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_malaria_negative);
    expect(result.errors).to.be.empty;
    harness.user = 'cha_id';
    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_2_MONTHS_SUSPECTED_MALARIA_TESTED_WITH_MRDT });
    expect(analytics).to.nested.include({ 'value.pass': 2, 'value.total': 2 });

    harness.user = 'chv_id';
    result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.elderly(55));
    expect(result.errors).to.be.empty;

    harness.subject = result.contacts[0];
    result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasInvalidMRDT);
    expect(result.errors).to.be.empty;
    harness.user = 'cha_id';
    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_2_MONTHS_SUSPECTED_MALARIA_TESTED_WITH_MRDT });
    expect(analytics).to.nested.include({ 'value.pass': 3, 'value.total': 3 });
  });

  it('should not increment value if mrdt result is not done', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 55 }).toISODate();
    harness.user = 'cha_id';
    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_2_MONTHS_SUSPECTED_MALARIA_TESTED_WITH_MRDT });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });

    harness.user = 'chv_id';
    const result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasNoMRDTDone);
    expect(result.errors).to.be.empty;
    harness.user = 'cha_id';
    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_2_MONTHS_SUSPECTED_MALARIA_TESTED_WITH_MRDT });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1 });
  });

  it('should reset % of >2 months with suspected malaria tested with mRDT monthly', async () => {
    await harness.setNow(DateTime.now().startOf('month').toISODate());

    harness.user = 'cha_id';
    let [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_2_MONTHS_SUSPECTED_MALARIA_TESTED_WITH_MRDT });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });

    harness.subject.date_of_birth = DateTime.now().minus({ year: 15 }).toISODate();
    harness.user = 'chv_id';
    const result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasMalariaReferral);
    expect(result.errors).to.be.empty;
    harness.user = 'cha_id';
    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_2_MONTHS_SUSPECTED_MALARIA_TESTED_WITH_MRDT });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    await harness.setNow(DateTime.now().endOf('month').plus({ days: 1 }).toISODate());
    [analytics] = await harness.getTargets({ type: Targets.PERCENT_POPULATION_OVER_2_MONTHS_SUSPECTED_MALARIA_TESTED_WITH_MRDT });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0 });
  });
});
