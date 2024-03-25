const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const { DateTime } = require('luxon');
const harness = new TestHarness({ subject: 'patient_id' });
const { Targets, Services } = require('../../common-extras');
const {
  pregnancyHomeVisitScenarios,
  subsequentPregnancyHomeVisitScenarios,
  getDate
} = require('../forms-inputs');
describe('Target: New Pregnancies', () => {

  before(async () => await harness.start());

  after(async () => await harness.stop());

  beforeEach(async () => await harness.clear());

  afterEach(() => {
    expect(harness.consoleErrors).to.be.empty;
  });

  it('should count new pregnant women from pregnancy-home-visit', async () => {
    harness.subject.sex = 'female';
    let analytics = await harness.getTargets({ type: Targets.NEW_PREGNANT });
    expect(analytics[0]).to.nested.include({ 'value.total': 0 });

    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant());
    expect(result.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.NEW_PREGNANT });
    expect(analytics[0]).to.nested.include({ 'value.total': 1 });
  });

  it('should not count women who are not pregnant', async () => {
    harness.subject.sex = 'female';
    let analytics = await harness.getTargets({ type: Targets.NEW_PREGNANT });
    expect(analytics[0]).to.nested.include({ 'value.total': 0 });

    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.onFp);
    expect(result.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.NEW_PREGNANT });
    expect(analytics[0]).to.nested.include({ 'value.total': 0 });
  });

  it('should not update count when woman is not pregnant anymore', async () => {
    harness.subject.sex = 'female';
    let analytics = await harness.getTargets({ type: Targets.NEW_PREGNANT });
    expect(analytics[0]).to.nested.include({ 'value.total': 0 });

    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant());
    expect(result.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.NEW_PREGNANT });
    expect(analytics[0]).to.nested.include({ 'value.total': 1 });

    const result2 = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...subsequentPregnancyHomeVisitScenarios.notPregnantAnymoreAction);
    expect(result2.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.NEW_PREGNANT });
    expect(analytics[0]).to.nested.include({ 'value.total': 1 });

  });

  it('should update count regardless of muting status', async () => {
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant());
    expect(result.errors).to.be.empty;

    let analytics = await harness.getTargets({ type: Targets.NEW_PREGNANT });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    harness.subject.muted = getDate(-1);
    analytics = await harness.getTargets({ type: Targets.NEW_PREGNANT });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    harness.subject.muted = undefined;

    analytics = await harness.getTargets({ type: Targets.NEW_PREGNANT });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });
  });

  it('should update count regardless of deceased status', async () => {
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant());
    expect(result.errors).to.be.empty;

    let analytics = await harness.getTargets({ type: Targets.NEW_PREGNANT });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    harness.subject.date_of_death = getDate(-1);
    analytics = await harness.getTargets({ type: Targets.NEW_PREGNANT });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    harness.subject.date_of_death = undefined;

    analytics = await harness.getTargets({ type: Targets.NEW_PREGNANT });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });
  });

  it('should reset count of new pregnant women in the following month', async () => {
    await harness.setNow(DateTime.now().startOf('month').toISODate());

    harness.subject.sex = 'female';
    let analytics = await harness.getTargets({ type: Targets.NEW_PREGNANT });
    expect(analytics[0]).to.nested.include({ 'value.total': 0 });

    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant());
    expect(result.errors).to.be.empty;

    await harness.setNow(DateTime.now().startOf('month').plus({ month: 1 }).toISODate());

    analytics = await harness.getTargets({ type: Targets.NEW_PREGNANT });
    expect(analytics[0]).to.nested.include({ 'value.total': 0 });
  });

});
