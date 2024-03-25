const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { overFiveAssessmentScenarios, referralFollowUpScenarios, getDate } = require('../forms-inputs');
const { Services } = require('../../common-extras');
const { DateTime } = require('luxon');


describe('Over 5 assessment', () => {
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

  it('needs danger signs referral if other danger sign is selected', async () => {
    harness.subject.upi = 'test_upi';
    const result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasOtherDangerSignsReferral);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_follow_up: 'yes',
      needs_general_danger_signs_referral: 'true',
      general_danger_signs_referral_follow_up_date: getDate(1),
      visited_contact_uuid: 'household_id'
    });
    expect(result.report.fields.data).to.deep.include({
      _upi: 'test_upi',
    });
    expect(result.report.fields.data._screening).to.deep.include({
      _symptoms: 'other'
    });
    expect(result.report.fields.data._supporting_info).to.deep.include({
      _symptoms_other: 'others'
    });
    const taskTime = result.report.fields.general_danger_signs_referral_follow_up_date;
    await harness.setNow(taskTime);

    let followUpTask = await harness.getTasks({ title: 'task.danger_sign_over_five_referral_service.title' });
    expect(followUpTask).to.have.property('length', 1);

    //resolve task
    const result2 = await harness.loadAction(followUpTask[0], ...referralFollowUpScenarios.availableAndVisited);
    expect(result2.errors).to.be.empty;
    expect(result2.report.fields).to.nested.include({
      needs_follow_up: `no`,
      visited_contact_uuid: 'household_id'
    });

    followUpTask = await harness.getTasks({ actionForm: Services.REFERRAL_FOLLOW_UP });
    expect(followUpTask).to.have.property('length', 0);
  });


  it('needs danger signs referral if fever more than seven days is selected', async () => {
    harness.subject.upi = 'test_upi';
    const result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasFeverReferral(7, 'yes'));
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_follow_up: 'yes',
      needs_fever_referral: 'true',
      fever_referral_follow_up_date: getDate(1),
      visited_contact_uuid: 'household_id'
    });

    const taskTime = result.report.fields.fever_referral_follow_up_date;
    await harness.setNow(taskTime);

    let followUpTask = await harness.getTasks({ title: 'task.danger_sign_over_five_referral_service.title' });
    expect(followUpTask).to.have.property('length', 1);

    //resolve task
    const result2 = await harness.loadAction(followUpTask[0], ...referralFollowUpScenarios.availableAndVisited);
    expect(result2.errors).to.be.empty;
    expect(result2.report.fields).to.nested.include({
      needs_follow_up: `no`,
      visited_contact_uuid: 'household_id'
    });

    followUpTask = await harness.getTasks({ actionForm: Services.REFERRAL_FOLLOW_UP });
    expect(followUpTask).to.have.property('length', 0);
  });


  it('needs diarrhoea danger sign referral if has diarrhoea/blood in stool', async () => {
    harness.subject.upi = 'test_upi';
    harness.subject.date_of_birth = DateTime.now().minus({ year: 5, day: 1 }).toISODate();
    const result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasDiarrhoea);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_follow_up: 'yes',
      needs_diarrhoea_referral: 'true',
      diarrhoea_referral_follow_up_date: getDate(1),
      visited_contact_uuid: 'household_id'
    });
    expect(result.report.fields.data).to.deep.include({
      _upi: 'test_upi',
    });
    expect(result.report.fields.data._screening).to.deep.include({
      _symptoms: 'diarrhoea',
      _has_blood_in_stool: 'blood_in_stool'
    });
    expect(result.report.fields.data._supporting_info).to.deep.include({
      _diarrhea_duration: '14'
    });

    const taskTime = result.report.fields.diarrhoea_referral_follow_up_date;
    await harness.setNow(taskTime);

    let followUpTask = await harness.getTasks({ title: 'task.danger_sign_over_five_referral_service.title' });
    expect(followUpTask).to.have.property('length', 1);

    //resolve task
    const result2 = await harness.loadAction(followUpTask[0], ...referralFollowUpScenarios.availableAndVisited);
    expect(result2.errors).to.be.empty;
    expect(result2.report.fields).to.nested.include({
      needs_follow_up: `no`,
      visited_contact_uuid: 'household_id'
    });

    followUpTask = await harness.getTasks({ actionForm: Services.REFERRAL_FOLLOW_UP });
    expect(followUpTask).to.have.property('length', 0);
  });

  it('needs tb referral if presenting with tb symptoms', async () => {
    harness.subject.upi = 'test_upi';
    harness.subject.date_of_birth = DateTime.now().minus({ year: 5, day: 1 }).toISODate();
    const result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasTBSigns);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_follow_up: 'yes',
      needs_tb_referral: 'true',
      tb_referral_follow_up_date: getDate(3),
      visited_contact_uuid: 'household_id'
    });
    expect(result.report.fields.data).to.deep.include({
      _upi: 'test_upi',
    });
    expect(result.report.fields.data._screening).to.deep.include({
      _symptoms: 'cough_of_any_duration',
      _tb_symptoms: 'chest_pain',
    });
    expect(result.report.fields.data._supporting_info).to.deep.include({
      _is_on_tb_treatment: 'no',
    });

    const taskTime = result.report.fields.tb_referral_follow_up_date;
    await harness.setNow(taskTime);

    const followUpTask = await harness.getTasks({ title: 'task.over_five_referral_service_3_day.title' });
    expect(followUpTask).to.have.property('length', 1);
  });

  it('needs hypertension referral if presenting with the symptoms', async () => {
    harness.subject.upi = 'test_upi';
    const result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasHypertension);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_follow_up: 'yes',
      needs_hypertension_referral: 'true',
      hypertension_referral_follow_up_date: getDate(3),
      visited_contact_uuid: 'household_id'
    });
    expect(result.report.fields.data).to.deep.include({
      _upi: 'test_upi',
    });
    expect(result.report.fields.data._screening).to.deep.include({
      _hypertension_symptoms: 'dizziness'
    });
    expect(result.report.fields.data._supporting_info).to.deep.include({
      _systolic_blood_pressure: '140',
      _diastolic_blood_pressure: '90',
    });

    const taskTime = result.report.fields.hypertension_referral_follow_up_date;
    await harness.setNow(taskTime);

    const followUpTask = await harness.getTasks({ title: 'task.over_five_referral_service_3_day.title' });
    expect(followUpTask).to.have.property('length', 1);
  });

  it('Subsequent service should not prompt hypertension question if someone is confirmed hypertensive in the first assessment', async () => {
    const result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasHypertension);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      is_curr_hypertensive: 'true',
      is_sub_hypertensive: '',
      visited_contact_uuid: 'household_id'
    });

    const result2 = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.subSequentHasHypertension);
    expect(result2.errors).to.be.empty;
    expect(result2.report.fields).to.nested.include({
      is_curr_hypertensive: 'true',
      is_sub_hypertensive: 'true',
      visited_contact_uuid: 'household_id'
    });
  });

  it('Subsequent service should not prompt diabetes question if someone is confirmed diabetic in the first assessment', async () => {
    const result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasDiabetes);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      is_curr_diabetic: 'true',
      is_sub_diabetic: '',
      visited_contact_uuid: 'household_id'
    });

    const result2 = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.subSequentHasDiabetes);
    expect(result2.errors).to.be.empty;
    expect(result2.report.fields).to.nested.include({
      is_curr_diabetic: 'true',
      is_sub_diabetic: 'true',
      visited_contact_uuid: 'household_id'
    });
  });

  it('needs mental health referral if presenting with the symptoms', async () => {
    harness.subject.upi = 'test_upi';
    const result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasMentalHealth);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_follow_up: 'yes',
      needs_mental_health_referral: 'true',
      mental_health_referral_follow_up_date: getDate(3),
      visited_contact_uuid: 'household_id'
    });
    expect(result.report.fields.data).to.deep.include({
      _upi: 'test_upi',
    });
    expect(result.report.fields.data._screening).to.deep.include({
      _mental_signs: 'lack_of_sleep'
    });
    const taskTime = result.report.fields.mental_health_referral_follow_up_date;
    await harness.setNow(taskTime);

    const followUpTask = await harness.getTasks({ title: 'task.over_five_referral_service_3_day.title' });
    expect(followUpTask).to.have.property('length', 1);
  });

  it('needs sexual and gender based violence referral if presenting with the signs', async () => {
    harness.subject.upi = 'test_upi';
    const result = await harness.fillForm(Services.OVER_FIVE_ASSESSMENT, ...overFiveAssessmentScenarios.hasSGBVSigns);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_follow_up: 'yes',
      needs_sgbv_referral: 'true',
      sgbv_referral_follow_up_date: getDate(3),
      visited_contact_uuid: 'household_id'
    });
    expect(result.report.fields.data).to.deep.include({
      _upi: 'test_upi',
    });
    expect(result.report.fields.data._supporting_info).to.deep.include({
      _has_observed_signs_of_violence: 'yes'
    });

    const taskTime = result.report.fields.sgbv_referral_follow_up_date;
    await harness.setNow(taskTime);

    const followUpTask = await harness.getTasks({ title: 'task.over_five_referral_service_3_day.title' });
    expect(followUpTask).to.have.property('length', 1);
  });
});
