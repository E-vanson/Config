const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { deathReviewScenarios, getDate } = require('../forms-inputs');
const { Services } = require('../../common-extras');

describe('Death Review Service Form', () => {
  before(async () => {
    return await harness.start();
  });
  after(async () => {
    return await harness.stop();
  });
  beforeEach(async () => {
    await harness.clear();
    harness.user = 'cha_id';
  });
  afterEach(() => {
    expect(harness.consoleErrors).to.be.empty;
  });

  it('should result in a death report with place of death = health_facility', async () => {
    // load and fill in the form
    const result = await harness.fillForm(Services.DEATH_REVIEW, ...deathReviewScenarios.healthFacility);
    expect(result.errors).to.be.empty;

    expect(result.report.fields).to.be.nested.include({
      'group_review.place_of_death': deathReviewScenarios.healthFacility[0][1]
    });
  });

  it('should result in a death report with date of death and cause of death for male contact', async () => {
    harness.subject.sex = 'male';
    // load and fill in the form
    const result = await harness.fillForm(Services.DEATH_REVIEW, ...deathReviewScenarios.homeMale);
    expect(result.errors).to.be.empty;

    expect(result.report.fields).to.be.nested.include({
      'group_review.date_of_death': deathReviewScenarios.homeMale[0][2],
      'group_review.probable_cause_of_death': deathReviewScenarios.homeMale[0][3]
    });
  });

  it(`should ask pregnancy questions for for female contact`, async () => {
    const result = await harness.fillForm(Services.DEATH_REVIEW, ...deathReviewScenarios.homeFemale);
    expect(result.errors).to.be.empty;

    expect(result.report.fields).to.be.nested.include({
      death_type: '',
      'group_review.pregnant_at_death': deathReviewScenarios.homeFemale[0][4]
    });
  });

  it(`should flag as maternal death if female contact was pregnant at death`, async () => {
    const result = await harness.fillForm(Services.DEATH_REVIEW, ...deathReviewScenarios.homeFemalePregnant);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.be.nested.include({
      death_type: 'maternal death'
    });
  });

  it(`should flag as perinatal death if contact was less than 7 days old`, async () => {
    harness.subject.date_of_birth = getDate(-5);
    const result = await harness.fillForm(Services.DEATH_REVIEW, ...deathReviewScenarios.healthFacility);
    expect(result.errors).to.be.empty;

    expect(result.report.fields).to.be.nested.include({
      death_type: 'perinatal death'
    });
  });

  it('should not allow date of death to be in the future', async () => {
    harness.subject.sex = 'male';
    const result = await harness.fillForm(Services.DEATH_REVIEW, ...deathReviewScenarios.inTheFuture);
    expect(result.errors).to.be.an('array').with.lengthOf(1);
    expect(result.errors[0].question).to.match(/Date of death/i);
    expect(result).to.nested.include({
      'errors[0].msg': 'Date of death can\'t be in the future.',
      'errors[0].type': 'validation',
      'errors[0].question': 'Date of death*\nDate of death can\'t be in the future.',
    });
  });

  it('should generate death confirmation report if death report is approved', async () => {
    const result = await harness.fillForm(Services.DEATH_REVIEW, ...deathReviewScenarios.healthFacility);
    expect(result.errors).to.be.empty;
    expect(result.additionalDocs).to.have.property('length', 1);
    expect(result.additionalDocs[0]).to.nested.include({
      form: 'death_confirmation',
      'contact._id': 'cha_id',
      'fields.patient_id': 'patient_id',
      'fields.date_of_death': deathReviewScenarios.healthFacility[0][2]
    });

    const generatedDeathConfirmationReport = harness.state.reports.find(report => report.form === 'death_confirmation');
    expect(generatedDeathConfirmationReport).to.not.be.undefined;
  });

  it('should not generate death confirmation report if death report is rejected', async () => {
    const result = await harness.fillForm(Services.DEATH_REVIEW, ...deathReviewScenarios.notConfirmed);
    expect(result.errors).to.be.empty;
    expect(result.additionalDocs).to.have.property('length', 0);
  });
});
