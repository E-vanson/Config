const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const {
  Targets,
  Services,
  Places
} = require('../../common-extras');
const {
  householdRegistrationScenarios,
  washStatusScenarios,
  overFiveAssessmentScenarios,
  u5AssessmentScenarios,
  pregnancyHomeVisitScenarios
} = require('../forms-inputs');
const { DateTime } = require('luxon');

describe('Target: % HH Visited', () => {
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
    const analytics = await harness.getTargets({ type: Targets.HH_VISITED });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0 });
  });

  it('should update count HH when report submitted for HH Member', async () => {
    let analytics = await harness.getTargets({ type: Targets.HH_VISITED });
    expect(analytics[0]).to.nested.include({ 'value.percent': 0 });

    const result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasMentalHealth);
    expect(result.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.HH_VISITED });
    expect(analytics[0]).to.nested.include({ 'value.percent': 100 });
  });

  it('should not update count HH when report submitted for HH', async () => {
    let analytics = await harness.getTargets({ type: Targets.HH_VISITED });
    expect(analytics[0]).to.nested.include({ 'value.percent': 0 });

    harness.subject = 'household_id';
    const result = await harness.fillForm(Services.WASH, ...washStatusScenarios.good);
    expect(result.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.HH_VISITED });
    expect(analytics[0]).to.nested.include({
      'value.pass': 0,
      'value.total': 1,
      'value.percent': 0
    });
  });

  it('should not update count HH when report submitted for new HH', async () => {
    let result = await harness.fillContactForm(Places.HOUSEHOLD, ...householdRegistrationScenarios.default);
    expect(result.errors).to.be.empty;

    let analytics = await harness.getTargets({ type: Targets.HH_VISITED });

    // value.total is 2 because we have a household specified in harness.defaults.json
    expect(analytics[0]).to.nested.include({
      'value.pass': 0,
      'value.total': 2,
      'value.percent': 0
    });

    harness.subject = result.contacts.find(c => c.contact_type === Places.HOUSEHOLD);
    result = await harness.fillForm(Services.WASH, ...washStatusScenarios.good);
    expect(result.errors).to.be.empty;

    harness.subject = 'household_id';
    result = await harness.fillForm(Services.WASH, ...washStatusScenarios.good);
    expect(result.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.HH_VISITED });
    expect(analytics[0]).to.nested.include({
      'value.pass': 0,
      'value.total': 2,
      'value.percent': 0
    });
  });

  it('should reset HH visited count monthly', async () => {
    harness.subject = 'household_id';
    harness.setNow(DateTime.now().startOf('month').toISODate());
    let result = await harness.fillContactForm(Places.HOUSEHOLD, ...householdRegistrationScenarios.default);
    expect(result.errors).to.be.empty;

    harness.subject = result.contacts.find(c => c.contact_type === Places.HOUSEHOLD);
    result = await harness.fillForm(Services.WASH, ...washStatusScenarios.good);
    expect(result.errors).to.be.empty;

    harness.subject = 'patient_id';
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_fast_breathing);
    expect(result.errors).to.be.empty;

    let analytics = await harness.getTargets({ type: Targets.HH_VISITED });

    expect(analytics[0]).to.nested.include({
      'value.pass': 1,
      'value.total': 2,
      'value.percent': 50
    });

    result = await harness.fillContactForm(Places.HOUSEHOLD, ...householdRegistrationScenarios.default);
    expect(result.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.HH_VISITED });
    expect(analytics[0]).to.nested.include({
      'value.pass': 1,
      'value.total': 3,
      'value.percent': 33
    });


    harness.setNow(DateTime.now().endOf('month').plus({ days: 1 }).toISODate());
    analytics = await harness.getTargets({ type: Targets.HH_VISITED });
    expect(analytics[0]).to.nested.include({
      'value.pass': 0,
      'value.total': 3,
      'value.percent': 0
    });
  });

  it('should not update when a non-assessment report is submitted for a member', async () => {
    let analytics = await harness.getTargets({ type: Targets.HH_VISITED });
    expect(analytics[0]).to.nested.include({ 'value.percent': 0 });
  
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant());
    expect(result.errors).to.be.empty;
  
    analytics = await harness.getTargets({ type: Targets.HH_VISITED });
    expect(analytics[0]).to.nested.include({
      'value.pass': 0,
      'value.total': 1,
      'value.percent': 0
    });
  });
  
  it('should not decrement when a household member intially assessed is muted in the same month', async () => {
    harness.setNow(DateTime.now().endOf('month').plus({ days: 1 }).toISODate());
    let analytics = await harness.getTargets({ type: Targets.HH_VISITED });
    expect(analytics[0]).to.nested.include({ 'value.percent': 0 });

    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_fast_breathing);
    expect(result.errors).to.be.empty;
  
    analytics = await harness.getTargets({ type: Targets.HH_VISITED });
    expect(analytics[0]).to.nested.include({
      'value.pass': 1,
      'value.total': 1,
      'value.percent': 100
    });

    await harness.flush({weeks: 2});
    harness.subject.muted = DateTime.now().toISO({ includeMillis: true });
    
    analytics = await harness.getTargets({ type: Targets.HH_VISITED });
    expect(analytics[0]).to.nested.include({
      'value.pass': 1,
      'value.total': 1,
      'value.percent': 100
    });
  });
});
