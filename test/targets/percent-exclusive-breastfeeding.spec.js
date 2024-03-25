const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const { DateTime } = require('luxon');
const harness = new TestHarness({ subject: 'patient_id' });
const { u5AssessmentScenarios, immunizationServiceScenarios, personRegistrationScenarios } = require('../forms-inputs');
const { Services, Persons} = require('../../common-extras');
const { Targets, differenceInDays } = require('../../common-extras');

describe('<6 Months Assessment Exclusive Breastfeeding Targets', () => {
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

  it('if u5 assessment filled exlusive breastfeeding target should increase by total pass of 1 and total value of 1', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ month: 3 }).toISODate();

    let analytics = await harness.getTargets({ type: Targets.EXCLUSIVE_BREASTFEEDING, user: 'cha_id'});
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.percent':0, 'value.total': 1 });

    const report = await harness.fillForm({form: Services.U5_ASSESSMENT, subject: 'patient_id'}, ...u5AssessmentScenarios.threeMonth_noDangerSigns);
    expect(report.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.EXCLUSIVE_BREASTFEEDING, subject: 'patient_id', user: 'cha_id' });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.percent':100, 'value.total': 1 });
  });

  it('create u5 contact and fill u5 assessment filled exlusive breastfeeding target should increase by total pass of 1 and total value of 1', async () => {
    const result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.under6Month(DateTime.now().minus({ month: 3 }).toISODate()));
    expect(result.errors).to.be.empty;
    harness.subject = result.contacts.find(c => c.contact_type === Persons.CLIENT);

    const baby_id = harness.subject._id;

    let analytics = await harness.getTargets({ type: Targets.EXCLUSIVE_BREASTFEEDING, user: 'cha_id'});
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.percent':0, 'value.total': 1 });

    const report = await harness.fillForm({form: Services.U5_ASSESSMENT, subject: baby_id}, ...u5AssessmentScenarios.threeMonth_noDangerSigns);
    expect(report.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.EXCLUSIVE_BREASTFEEDING, subject: baby_id, user: 'cha_id' });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.percent':100, 'value.total': 1 });
  });

  it('if u5 assessment filled exlusive breastfeeding target and time moved by 1 month target should read pass of 0 and total value of 0', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ month: 3 }).toISODate();

    let analytics = await harness.getTargets({ type: Targets.EXCLUSIVE_BREASTFEEDING, user: 'cha_id'});
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.percent':0, 'value.total': 1 });

    const report = await harness.fillForm({form: Services.U5_ASSESSMENT, subject: 'patient_id'}, ...u5AssessmentScenarios.threeMonth_noDangerSigns);
    expect(report.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.EXCLUSIVE_BREASTFEEDING, subject: 'patient_id', user: 'cha_id' });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.percent':100, 'value.total': 1 });
    
    //Check value at end month. Should remain the same
    const dateToEndMonth = differenceInDays(DateTime.now().toISODate(), DateTime.now().endOf('month').toISODate());
    harness.flush({days: dateToEndMonth});

    analytics = await harness.getTargets({ type: Targets.EXCLUSIVE_BREASTFEEDING, subject: 'patient_id', user: 'cha_id' });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.percent':100, 'value.total': 1 });
    
    //Value should change next month to zero
    harness.flush({days: 1});

    analytics = await harness.getTargets({ type: Targets.EXCLUSIVE_BREASTFEEDING, subject: 'patient_id', user: 'cha_id' });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.percent':0, 'value.total': 1 });
  });

  it('if <6 months assessment exlusive breastfeeding target filled target is muted', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ month: 3 }).toISODate();

    let analytics = await harness.getTargets({ type: Targets.EXCLUSIVE_BREASTFEEDING, user: 'cha_id'});
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.percent':0, 'value.total': 1 });

    const report = await harness.fillForm({form: Services.U5_ASSESSMENT, subject: 'patient_id'}, ...u5AssessmentScenarios.threeMonth_noDangerSigns);
    expect(report.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.EXCLUSIVE_BREASTFEEDING, subject: 'patient_id', user: 'cha_id' });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.percent':100, 'value.total': 1 });

    harness.subject.muted = DateTime.now().minus({ days: 1 }).toISODate();
    [analytics] = await harness.getTargets({ type: Targets.EXCLUSIVE_BREASTFEEDING });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });
  });

  it('if < 6 months old assessment exlusive breastfeeding filled target is dead', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ month: 3 }).toISODate();

    let analytics = await harness.getTargets({ type: Targets.EXCLUSIVE_BREASTFEEDING, user: 'cha_id'});
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.percent':0, 'value.total': 1 });

    const report = await harness.fillForm({form: Services.U5_ASSESSMENT, subject: 'patient_id'}, ...u5AssessmentScenarios.threeMonth_noDangerSigns);
    expect(report.errors).to.be.empty;

    analytics = await harness.getTargets({ type: Targets.EXCLUSIVE_BREASTFEEDING, subject: 'patient_id', user: 'cha_id' });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.percent':100, 'value.total': 1 });

    harness.subject.date_of_death = DateTime.now().minus({ days: 1 }).toISODate();
    [analytics] = await harness.getTargets({ type: Targets.EXCLUSIVE_BREASTFEEDING });
    expect(analytics).to.nested.include({ 'value.pass': 0, 'value.total': 0, 'value.percent': 0 });
  });

  it('should not update if has non-u5 assessment exlusive breastfeeding report', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ month: 3 }).toISODate();

    const result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...immunizationServiceScenarios.nonReferral3MonthsOld);
    expect(result.errors).to.be.empty;

    const analytics = await harness.getTargets({ type: Targets.EXCLUSIVE_BREASTFEEDING, user: 'cha_id'});
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.percent':0, 'value.total': 1 });
  });

  it('if over 6 months old assessment filled target should not increase. All values should be 0', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_malaria_positive);
    expect(result.errors).to.be.empty;

    const analytics = await harness.getTargets({ type: Targets.EXCLUSIVE_BREASTFEEDING, user: 'cha_id' });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.percent':0, 'value.total': 0 });
  });
});
