const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { DateTime } = require('luxon');
const { u5AssessmentScenarios, treatmentFollowUpScenarios } = require('../forms-inputs');
const { Targets, Services } = require('../../common-extras');

describe('Target: % Malaria Treatments', () => {
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
    const [analytics] = await harness.getTargets({ type: Targets.U5_WITH_MALARIA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });
  });

  it('target value.pass updates when given AL', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_malaria_positive);
    expect(result.errors).to.be.empty;
    const [analytics] = await harness.getTargets({ type: Targets.U5_WITH_MALARIA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1, 'value.percent': 100 });
  });

  it('target value resets monthly', async () => {
    harness.setNow(DateTime.now().startOf('month').toISODate());
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_malaria_positive);
    expect(result.errors).to.be.empty;
    let [analytics] = await harness.getTargets({ type: Targets.U5_WITH_MALARIA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1, 'value.percent': 100 });

    harness.setNow(DateTime.now().endOf('month').plus({ day: 7 }).toISODate());
    [analytics] = await harness.getTargets({ type: Targets.U5_WITH_MALARIA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });
  });

  it('target value unchanged by other forms', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.TREATMENT_FOLLOW_UP, ...treatmentFollowUpScenarios.noFollowUp);
    expect(result.errors).to.be.empty;
    const [analytics] = await harness.getTargets({ type: Targets.U5_WITH_MALARIA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });
  });

  it('target value.pass does not update when not given AL', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_malaria_positive_no_al);
    expect(result.errors).to.be.empty;
    const [analytics] = await harness.getTargets({ type: Targets.U5_WITH_MALARIA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });
  });

  it('target value updates when contact muted', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_malaria_positive);
    expect(result.errors).to.be.empty;
    let [analytics] = await harness.getTargets({ type: Targets.U5_WITH_MALARIA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1, 'value.percent': 100 });

    harness.subject.muted = DateTime.now().toISODate();
    [analytics] = await harness.getTargets({ type: Targets.U5_WITH_MALARIA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });

    harness.subject.muted = null;
    [analytics] = await harness.getTargets({ type: Targets.U5_WITH_MALARIA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1, 'value.percent': 100 });
  });

  it('target value updates when contact deceased', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_malaria_positive);
    expect(result.errors).to.be.empty;
    let [analytics] = await harness.getTargets({ type: Targets.U5_WITH_MALARIA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1, 'value.percent': 100 });

    harness.subject.date_of_death = DateTime.now().toISODate();
    [analytics] = await harness.getTargets({ type: Targets.U5_WITH_MALARIA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });
  });

});
