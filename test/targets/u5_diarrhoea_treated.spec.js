const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { DateTime } = require('luxon');
const { u5AssessmentScenarios } = require('../forms-inputs');
const { Targets, Services } = require('../../common-extras');

describe('Target: %  of Children with Diarrohea Treated', () => {
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
    const [analytics] = await harness.getTargets({ type: Targets.U5_WITH_DIARRHOEA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });
  });

  it('target value.pass updates when given zinc and ors', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_diarrhoea_given_ors_zinc);
    expect(result.errors).to.be.empty;
    const [analytics] = await harness.getTargets({ type: Targets.U5_WITH_DIARRHOEA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1, 'value.percent': 100 });
  });

  it('target value resets monthly', async () => {
    harness.setNow(DateTime.now().startOf('month').toISODate());
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_diarrhoea_given_ors_zinc);
    expect(result.errors).to.be.empty;
    let [analytics] = await harness.getTargets({ type: Targets.U5_WITH_DIARRHOEA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1, 'value.percent': 100 });

    harness.setNow(DateTime.now().endOf('month').plus({ day: 7 }).toISODate());
    [analytics] = await harness.getTargets({ type: Targets.U5_WITH_DIARRHOEA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });
  });

  it('target value updates when contact muted', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_diarrhoea_given_ors_zinc);
    expect(result.errors).to.be.empty;
    let [analytics] = await harness.getTargets({ type: Targets.U5_WITH_DIARRHOEA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1, 'value.percent': 100 });

    harness.subject.muted = DateTime.now().toISODate();
    [analytics] = await harness.getTargets({ type: Targets.U5_WITH_DIARRHOEA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });

    harness.subject.muted = null;
    [analytics] = await harness.getTargets({ type: Targets.U5_WITH_DIARRHOEA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1, 'value.percent': 100 });
  });

  it('target value updates when contact deceased', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_diarrhoea_given_ors_zinc);
    expect(result.errors).to.be.empty;
    let [analytics] = await harness.getTargets({ type: Targets.U5_WITH_DIARRHOEA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 1, 'value.total': 1, 'value.percent': 100 });

    harness.subject.date_of_death = DateTime.now().toISODate();
    [analytics] = await harness.getTargets({ type: Targets.U5_WITH_DIARRHOEA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });
  });

  it('target value.total updates when child is assessed with diarrhoea', async () => {
    let [analytics] = await harness.getTargets({ type: Targets.U5_WITH_DIARRHOEA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });

    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_diarrhoea_not_given_ors_zinc);
    expect(result.errors).to.be.empty;

    [analytics] = await harness.getTargets({ type: Targets.U5_WITH_DIARRHOEA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });
  });

  it('target value.pass does not update if we only give ors', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_diarrhoea_given_ors);
    expect(result.errors).to.be.empty;

    const [analytics] = await harness.getTargets({ type: Targets.U5_WITH_DIARRHOEA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });
  });

  it('target value.pass does not update if we only give zinc', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_diarrhoea_given_zinc);
    expect(result.errors).to.be.empty;

    const [analytics] = await harness.getTargets({ type: Targets.U5_WITH_DIARRHOEA_TREATED });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 1, 'value.percent': 0 });
  });

});
