const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness({ subject: 'chv_id' });
const { chvSupervisionScenarios, DateTime } = require('../forms-inputs');
const { Services } = require('../../common-extras');
const now = () => DateTime.now();

describe('CHV Supervision', () => {
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

  it('form can be filled and successfully saved', async () => {
    const result = await harness.fillForm(Services.CHV_SUPERVISION, ...chvSupervisionScenarios.available);
    expect(result.errors).to.be.empty;
    // Verify some attributes on the resulting report
    expect(result.report.fields).to.nested.include({
      chv_uuid: 'chv_id',
      patient_id: 'chv_id',
      supervision_visit_count: '1',
      calc_assessment_score: '66.67',
      calc_assessment_denominator: '18',
      calc_pneumonia_denominator: '0',
      calc_malaria_denominator: '0',
      calc_diarrhea_denominator: '0',
      calc_nutrition_denominator: '10',
      calc_immunization_denominator: '5',
      calc_pregnancy_home_visit_denominator: '0',
      calc_newborn_visit_denominator: '0',
      calc_family_planning_denominator: '0',
      calc_infection_prevention_control_denominator: '0',
      calc_wash_denominator: '3',
      calc_pneumonia_score: '0',
      calc_malaria_score: '0',
      calc_diarrhea_score: '0',
      calc_nutrition_score: '8',
      calc_immunization_score: '3',
      calc_pregnancy_home_visit_score: '0',
      calc_newborn_visit_score: '0',
      calc_family_planning_score: '0',
      calc_infection_prevention_control_score: '0',
      calc_wash_score: '1',
    });
  });

  it('should display error if next supervision date is in the future', async () => {
    const result = await harness.fillForm(Services.CHV_SUPERVISION, ...chvSupervisionScenarios.notAvailable(now().plus({days: -7}).toISODate()));
    expect(result.errors[0]).to.deep.include({
      type: 'validation',
      msg: 'Date cannot be in the past and more than two months into the future.'
    });
  });
});
