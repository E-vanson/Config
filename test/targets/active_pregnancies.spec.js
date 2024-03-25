const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness({ subject: 'patient_id' });
const { DateTime } = require('luxon');
const { Targets, Services, Persons, MAX_PREGNANCY_AGE_IN_WEEKS } = require('../../common-extras');
const { pregnancyHomeVisitScenarios, subsequentPregnancyHomeVisitScenarios, personRegistrationScenarios, getDate } = require('../forms-inputs');

describe('Target: Active Pregnancies', () => {
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

  it('default count', async () => {
    const analytics = await harness.getTargets({ type: Targets.ACTIVE_PREGNANCIES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.total': 0 });
  });

  it('count reduces when we get past a pregnancies edd', async () => {
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant());
    expect(result.errors).to.be.empty;

    let analytics = await harness.getTargets({ type: Targets.ACTIVE_PREGNANCIES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    const { pregnancy_age_in_weeks } = (await harness.getContactSummary()).context;
    await harness.flush((MAX_PREGNANCY_AGE_IN_WEEKS - pregnancy_age_in_weeks) * 7);

    analytics = await harness.getTargets({ type: Targets.ACTIVE_PREGNANCIES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.total': 0 });
  });

  it('count does not change during next month while within pregnancy period', async () => {
    harness.setNow(DateTime.now().startOf('month').toISODate());
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant());
    expect(result.errors).to.be.empty;

    let analytics = await harness.getTargets({ type: Targets.ACTIVE_PREGNANCIES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    harness.setNow(DateTime.now().startOf('month').plus({ month: 1, day: 5 }).toISODate());
    analytics = await harness.getTargets({ type: Targets.ACTIVE_PREGNANCIES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });
  });

  it('should count an active pregnancy', async () => {
    let result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant());
    expect(result.errors).to.be.empty;

    let analytics = await harness.getTargets({ type: Targets.ACTIVE_PREGNANCIES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    const contactResult = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.femaleOnFp(DateTime.now().minus({ years: 20 }).toISODate()));
    expect(contactResult.errors).to.be.empty;

    harness.subject = contactResult.contacts[0];
    result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant());
    expect(result.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.ACTIVE_PREGNANCIES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 2, 'value.total': 2 });
  });

  it('should update active pregnancy count when not pregnant anymore', async () => {
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant());
    expect(result.errors).to.be.empty;

    let analytics = await harness.getTargets({ type: Targets.ACTIVE_PREGNANCIES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    const subsequentSubmission = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...subsequentPregnancyHomeVisitScenarios.notPregnantAnymoreAction);
    expect(subsequentSubmission.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.ACTIVE_PREGNANCIES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.total': 0 });
  });

  it('should update active pregnancy count when contact is muted', async () => {
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant());
    expect(result.errors).to.be.empty;

    let analytics = await harness.getTargets({ type: Targets.ACTIVE_PREGNANCIES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    harness.subject.muted = getDate(-1);
    analytics = await harness.getTargets({ type: Targets.ACTIVE_PREGNANCIES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.total': 0 });

    harness.subject.muted = undefined;

    analytics = await harness.getTargets({ type: Targets.ACTIVE_PREGNANCIES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });
  });

  it('should update active pregnancy count when contact is deceased', async () => {
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant());
    expect(result.errors).to.be.empty;

    let analytics = await harness.getTargets({ type: Targets.ACTIVE_PREGNANCIES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    harness.subject.date_of_death = getDate(-1);
    analytics = await harness.getTargets({ type: Targets.ACTIVE_PREGNANCIES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.total': 0 });

    harness.subject.date_of_death = undefined;

    analytics = await harness.getTargets({ type: Targets.ACTIVE_PREGNANCIES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });
  });

});
