const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { DateTime } = require('luxon');
const { u5AssessmentScenarios, referralFollowUpScenarios, treatmentFollowUpScenarios } = require('../forms-inputs');
const { Services } = require('../../common-extras');

describe('U5_assessment service test', () => {
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

  it('u5 assessment form can be filled and successfully saved for under 2 month old - no danger sign', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ month: 1 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.under2MonthOld_noDangerSigns);
    expect(result.errors).to.be.empty;
  });

  it('u5 assessment form can be filled and successfully saved for over 2 month old - no danger sign', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    let result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2MonthOld_noDangerSigns_incompleteImmunization);

    expect(result.errors).to.not.be.empty;
    expect(result.errors[0]).to.deep.include({
      type: 'validation',
      msg: 'All eligible vaccines need to be selected if the immunization status is up to date'
    });

    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_fully_immunized);
    expect(result.errors).to.be.empty;
  });

  it('u5 assessment hide vitamin A if upto date', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ months: 6, days: 1 }).toISODate();
    let result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.sixMonth_immunization(['bcg', 'opv0', 'opv1', 'opv2', 'opv3', 'pcv1', 'pcv2', 'pcv3',
      'penta1', 'penta2', 'penta3', 'ipv', 'rota1', 'rota2', 'rota3', 'vit_a'], ['6_months']));
    expect(result.errors).to.be.empty;

    let context = (await harness.getContactSummary()).context;
    expect(context.vit_a_6_given).eq(1);
    expect(context.vitamin_a_vaccines_upto_date).eq(1);

    // vitamin A section not shown
    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.sixMonth_upto_date_immunization_and_vitamin_a);
    expect(result.errors).to.be.empty;

    // fast foward to when contact is 12 months old
    await harness.setNow(DateTime.now().plus({ month: 6 }));

    context = (await harness.getContactSummary()).context;
    expect(context.vit_a_6_given).eq(1);
    expect(context.vitamin_a_vaccines_upto_date).eq(0);

    // should now show the vitamin A section
    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.twelveMonth_immunization('measles_9', '12_months'));
    expect(result.errors).to.be.empty;
  });

  it('test vitamin A doses outbound field', async () => {
    harness.subject.upi = 'test_upi';
    harness.subject.date_of_birth = DateTime.now().minus({ month: 6 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.sixMonth_immunization(['bcg', 'opv0', 'opv1', 'opv2', 'opv3', 'pcv1', 'pcv2', 'pcv3',
      'penta1', 'penta2', 'penta3', 'ipv', 'rota1', 'rota2', 'rota3', 'vit_a'], ['6_months']));
    expect(result.errors).to.be.empty;
    expect(result.errors).to.be.empty;
    expect(result.report.fields.data).to.deep.include({
      _upi: 'test_upi',
    });
    expect(result.report.fields.data._screening).to.deep.include({
      _vitamin_a_doses_given: '6_months'
    });
  });

  it('should not show optional vaccines question if administered', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ months: 6, days: 1 }).toISODate();
    let result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.optional_immunization);
    expect(result.errors).to.be.empty;

    const context = (await harness.getContactSummary()).context;
    expect(context.measles_6_given).eq('measles_6');
    expect(context.malaria_given).eq('malaria');

    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.optional_immunization);
    expect(result.errors).to.not.be.empty;

    expect(result.errors[0]).to.deep.include({
      type: 'page',
      msg: 'Attempted to fill 4 questions, but only 3 are visible.'
    });
  });

  [
    u5AssessmentScenarios.under2MonthOld_fast_breathing,
    u5AssessmentScenarios.under2MonthOld_fever,
  ].forEach((scenario, index) => {
    it(`u5 assessment under 2 month old scenario ${index} fills successfully`, async () => {
      harness.subject.date_of_birth = DateTime.now().minus({ month: 1 }).toISODate();
      const result = await harness.fillForm(Services.U5_ASSESSMENT, ...scenario);
      expect(result.errors, `scenario ${index}`).to.be.empty;
    });
  });

  [
    u5AssessmentScenarios.under2MonthOld_no_feeding_danger_sign,
    u5AssessmentScenarios.under2MonthOld_convulsion_danger_sign,
    u5AssessmentScenarios.under2MonthOld_temp_danger_sign(38),
    u5AssessmentScenarios.under2MonthOld_temp_danger_sign(35),
    u5AssessmentScenarios.under2MonthOld_chest_indrawing_danger_sign,
    u5AssessmentScenarios.under2MonthOld_no_movement_danger_sign,
    u5AssessmentScenarios.under2MonthOld_yellow_soles_danger_sign,
    u5AssessmentScenarios.under2MonthOld_bleeding_umbilical_danger_sign,
    u5AssessmentScenarios.under2MonthOld_local_infection_danger_sign,
    u5AssessmentScenarios.under2MonthOld_birth_weight_danger_sign
  ].forEach((scenario, index) => {
    it(`u5 assessment under 2 month old scenario ${index} with danger sign triggers referral follow up`, async () => {
      harness.subject.date_of_birth = DateTime.now().minus({ month: 1 }).toISODate();
      const result = await harness.fillForm(Services.U5_ASSESSMENT, ...scenario);
      expect(result.errors, `scenario ${index}`).to.be.empty;
      await harness.flush(1);
      const tasks = await harness.getTasks({ title: 'task.u5_assessment_danger_sign_referral_follow_up.title' });
      expect(tasks, `scenario ${index}`).lengthOf(1);
    });
  });

  [
    u5AssessmentScenarios.over2Month_contact_with_tb,
    u5AssessmentScenarios.over2Month_diarrhoea_given_ors,
    u5AssessmentScenarios.over2Month_malaria_positive,
  ].forEach((scenario, index) => {
    it(`u5 assessment over 2 month old scenario ${index} fills successfully`, async () => {
      harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
      const result = await harness.fillForm(Services.U5_ASSESSMENT, ...scenario);
      expect(result.errors, `scenario ${index}`).to.be.empty;
      await harness.flush(1);
      const tasks = await harness.getTasks({ title: 'task.u5_assessment_danger_sign_referral_follow_up.title' });
      expect(tasks, `scenario ${index}`).lengthOf(0);
    });
  });

  [
    u5AssessmentScenarios.over2Month_chest_indrawing,
    u5AssessmentScenarios.over2Month_blood_in_stool,
    u5AssessmentScenarios.over2Month_fever_danger_sign,
    u5AssessmentScenarios.over2Month_temp_danger_sign(34),
    u5AssessmentScenarios.over2Month_temp_danger_sign(38),
    u5AssessmentScenarios.over2Month_convulsions_danger_sign,
    u5AssessmentScenarios.over2Month_no_feeding_danger_sign,
    u5AssessmentScenarios.over2Month_vomiting_everything_danger_sign,
    u5AssessmentScenarios.over2Month_unconscious_danger_sign,
    u5AssessmentScenarios.over2MonthOld_muac_red,
    u5AssessmentScenarios.over2MonthOld_muac_swollen_feet
  ].forEach((scenario, index) => {
    it(`u5 assessment over 2 month old scenario ${index} with danger sign triggers referral follow up`, async () => {
      harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
      const result = await harness.fillForm(Services.U5_ASSESSMENT, ...scenario);
      expect(result.errors, `scenario ${index}`).to.be.empty;
      const tasks = await harness.getTasks({ title: 'task.u5_assessment_danger_sign_referral_follow_up.title' });
      expect(tasks, `scenario ${index}`).lengthOf(1);
    });
  });

  it('u5 assessment with muac red danger sign triggers referral follow up', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2MonthOld_muac_red);
    expect(result.errors).to.be.empty;
    let tasks = await harness.getTasks({ title: 'task.muac_danger_sign_referral_follow_up.title' });
    expect(tasks).lengthOf(1);

    const taskResult = await harness.loadAction(tasks[0], ...referralFollowUpScenarios.availableAndVisited);
    expect(taskResult.errors).to.be.empty;
    tasks = await harness.getTasks({ title: 'task.muac_danger_sign_referral_follow_up.title' });
    expect(tasks).lengthOf(0);
  });

  it('u5 assessment with immunization schedule not upto date triggers referral follow up', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_immunization_not_upto_date(['6_months']));
    expect(result.errors).to.be.empty;
    await harness.flush(3);
    let tasks = await harness.getTasks({ title: 'task.immunization_referral_follow_up.title' });
    expect(tasks).lengthOf(1);

    const taskResult = await harness.loadAction(tasks[0], ...referralFollowUpScenarios.availableAndVisited);
    expect(taskResult.errors).to.be.empty;
    tasks = await harness.getTasks({ title: 'task.muac_danger_sign_referral_follow_up.title' });
    expect(tasks).lengthOf(0);
  });

  it('test vaccines referred for outbound field', async () => {
    harness.subject.upi = 'test_upi';
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_immunization_not_upto_date(['6_months']));
    expect(result.errors).to.be.empty;
    expect(result.report.fields.data).to.deep.include({
      _upi: 'test_upi',
    });
    expect(result.report.fields.data._screening).to.deep.include({
      _vaccines_referred_for: 'pcv3 rota3'
    });
  });

  it('skip immunization question if upto date', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ month: 3 }).toISODate();
    let result = await harness.fillForm(Services.U5_ASSESSMENT, ...[
      ['no', 'mother'],
      ['yes'],
      ['yes'],
      ['yes', 'handbook', ['bcg', 'opv0', 'opv1', 'pcv1', 'rota1', 'penta1', 'opv2', 'pcv2', 'rota2', 'penta2']],
      ['yes', 'no'],
      ['no'],
      ['yes', 'nhif']
    ]);
    expect(result.errors).to.be.empty;

    result = await harness.fillForm(Services.U5_ASSESSMENT, ...[
      ['no', 'mother'],
      ['yes'],
      ['yes'],
      ['yes', 'handbook'],
      ['yes', 'no'],
      ['no'],
      ['yes', 'nhif']
    ]);
    expect(result.errors).to.be.empty;
  });

  it('skip immunization question if schedule upto date but we still select not upto date in the form', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ month: 3 }).toISODate();
    let result = await harness.fillForm(Services.U5_ASSESSMENT, ...[
      ['no', 'mother'],
      ['yes'],
      ['yes'],
      ['yes', 'handbook', ['bcg', 'opv0', 'opv1', 'pcv1', 'rota1', 'penta1', 'opv2', 'pcv2', 'rota2', 'penta2']],
      ['yes', 'no'],
      ['no'],
      ['yes', 'nhif']
    ]);
    expect(result.errors).to.be.empty;

    result = await harness.fillForm(Services.U5_ASSESSMENT, ...[
      ['no', 'mother'],
      ['yes'],
      ['yes'],
      ['no', 'handbook'],
      ['yes', 'no'],
      ['no'],
      ['yes', 'nhif']
    ]);
    expect(result.errors).to.be.empty;
  });

  it('u5 assessment with growth monitoring schedule not upto date triggers referral follow up', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 1 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.oneYearAndOver_growth_monitoring_delayed(['standing']));
    expect(result.errors).to.be.empty;
    await harness.flush(3);
    let tasks = await harness.getTasks({ title: 'task.growth_monitoring_referral_follow_up.title' });
    expect(tasks).lengthOf(1);

    const taskResult = await harness.loadAction(tasks[0], ...referralFollowUpScenarios.availableAndVisited);
    expect(taskResult.errors).to.be.empty;

    tasks = await harness.getTasks({ title: 'task.growth_monitoring_referral_follow_up.title' });
    expect(tasks).lengthOf(0); // resolves

    tasks = await harness.getTasks({ title: 'task.muac_danger_sign_referral_follow_up.title' });
    expect(tasks).lengthOf(0);
  });

  it('#1444 - multiple assessments should not trigger multiple growth monitoring followups at the same time', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 1 }).toISODate();
    const firstAssessment = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.oneYearAndOver_growth_monitoring_delayed(['standing']));
    expect(firstAssessment.errors).to.be.empty;

    await harness.flush(1);
    const secondAssessment = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.oneYearAndOver_growth_monitoring_delayed(['standing'], '12_months'));
    expect(secondAssessment.errors).to.be.empty;
    
    await harness.flush(3);
    const tasks = await harness.getTasks({ title: 'task.growth_monitoring_referral_follow_up.title' });
    expect(tasks).lengthOf(1);
  });

  it('test growth monitoring outbound field', async () => {
    harness.subject.upi = 'test_upi';
    harness.subject.date_of_birth = DateTime.now().minus({ year: 1 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.oneYearAndOver_growth_monitoring_delayed(['standing']));
    expect(result.errors).to.be.empty;
    expect(result.report.fields.data).to.deep.include({
      _upi: 'test_upi',
    });
    expect(result.report.fields.data._screening).to.deep.include({
      _has_delayed_development_milestones: 'standing'
    });
    expect(result.report.fields.data._supporting_info).to.deep.include({
      is_participating_in_growth_monitoring: 'yes'
    });
  });

  it('u5 assessment with amoxicilin given triggers treatment follow up', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_fast_breathing);
    expect(result.errors).to.be.empty;
    await harness.flush(3);
    let tasks = await harness.getTasks({ title: 'task.u5_assessment_treatment_follow_up.title' });
    expect(tasks).lengthOf(1);

    const taskResult = await harness.loadAction(tasks[0], ...treatmentFollowUpScenarios.noFollowUp);
    expect(taskResult.errors).to.be.empty;
    tasks = await harness.getTasks({ title: 'task.u5_assessment_treatment_follow_up.title' });
    expect(tasks).lengthOf(0);
  });

  it('u5 assessment with ors given triggers treatment follow up', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_diarrhoea_given_ors);
    expect(result.errors).to.be.empty;
    await harness.flush(3);
    let tasks = await harness.getTasks({ title: 'task.u5_assessment_treatment_follow_up.title' });
    expect(tasks).lengthOf(1);

    const taskResult = await harness.loadAction(tasks[0], ...treatmentFollowUpScenarios.noFollowUp);
    expect(taskResult.errors).to.be.empty;
    tasks = await harness.getTasks({ title: 'task.u5_assessment_treatment_follow_up.title' });
    expect(tasks).lengthOf(0);
  });

  it('u5 assessment with zinc given triggers treatment follow up', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_diarrhoea_given_zinc);
    expect(result.errors).to.be.empty;
    await harness.flush(3);
    let tasks = await harness.getTasks({ title: 'task.u5_assessment_treatment_follow_up.title' });
    expect(tasks).lengthOf(1);

    const taskResult = await harness.loadAction(tasks[0], ...treatmentFollowUpScenarios.noFollowUp);
    expect(taskResult.errors).to.be.empty;
    tasks = await harness.getTasks({ title: 'task.u5_assessment_treatment_follow_up.title' });
    expect(tasks).lengthOf(0);
  });

  it('u5 assessment form generates household ID as visited contact uuid', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ month: 1 }).toISODate();
    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.under2MonthOld_noDangerSigns);
    expect(result.errors).to.be.empty;

    expect(result.report.fields).to.include({
      visited_contact_uuid: 'household_id'
    });
  });

  [
    u5AssessmentScenarios.over2Month_malaria_al_pack_values(['6', '6', '12']),
    u5AssessmentScenarios.over2Month_malaria_al_pack_values(['6', '12', '12']),
    u5AssessmentScenarios.over2Month_malaria_al_pack_values(['6', '18', '12']),
    u5AssessmentScenarios.over2Month_malaria_al_pack_values(['6', '24', '12']),
  ].forEach((scenario, index) => {
    it(`u5 assessment al scenario ${index} should not ask specific question for number of tablets per pack if the number of packs selected is one`, async () => {
      harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
      const result = await harness.fillForm(Services.U5_ASSESSMENT, ...scenario);
      expect(result.errors).to.not.be.empty;

      expect(result.errors[0]).to.deep.include({
        type: 'page',
        msg: 'Attempted to fill 4 questions, but only 3 are visible.'
      });
    });
  });

  [
    u5AssessmentScenarios.over2Month_malaria_al_pack_values(['12', ['6', '12'], '6', '6']),
    u5AssessmentScenarios.over2Month_malaria_al_pack_values(['18', ['6', '12'], '12', '6']),
    u5AssessmentScenarios.over2Month_malaria_al_pack_values(['24', ['6', '12'], '18', '6'])
  ].forEach((scenario, index) => {
    it(`u5 assessment al dispensing scenario ${index} should submit successfully if total selected tablets equal number of tablets given`, async () => {
      harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
      const result = await harness.fillForm(Services.U5_ASSESSMENT, ...scenario);

      expect(result.errors).be.empty;
    });
  });

  [
    u5AssessmentScenarios.over2Month_malaria_al_pack_values(['6', ['6', '12'], '6', '6']),
    u5AssessmentScenarios.over2Month_malaria_al_pack_values(['12', ['6', '12'], '12', '18']),
    u5AssessmentScenarios.over2Month_malaria_al_pack_values(['18', ['18', '12'], '12', '24']),
    u5AssessmentScenarios.over2Month_malaria_al_pack_values(['24', ['18', '24'], '18', '12'])
  ].forEach((scenario, index) => {
    it(`u5 assessment al dispensing scenario ${index} should give validation error for number of tabs per pack`, async () => {
      harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
      const result = await harness.fillForm(Services.U5_ASSESSMENT, ...scenario);

      expect(result.errors).to.not.be.empty;

      expect(result.errors[0]).to.deep.include({
        type: 'validation',
        msg: 'Total selected tablets must equal number of tablets given'
      });
    });
  });

  [
    {
      ageInWeeks: 4,
      input: u5AssessmentScenarios.under2MonthOld_development_milestones([])
    },
    {
      ageInWeeks: 8,
      input: u5AssessmentScenarios.under2Month_growth_monitoring_delayed([])
    },
    {
      ageInWeeks: 20,
      input: u5AssessmentScenarios.under6Month_growth_monitoring_delayed([])
    },
    {
      ageInWeeks: 35,
      input: u5AssessmentScenarios.over2Month_growth_monitoring_delayed([])
    },
    {
      ageInWeeks: 60,
      input: u5AssessmentScenarios.oneYearAndOver_growth_monitoring_delayed([])
    },
    {
      ageInWeeks: 76,
      input: u5AssessmentScenarios.oneYearAndOver_growth_monitoring_delayed([])
    }
  ].forEach((scenario) => {
    it(`should show all previous delayed milestone choices upto child age (${scenario.ageInWeeks} weeks old)`, async () => {
      const milestones = {
        'Social Smile': 4,
        'Head Holding/Control': 4,
        'Turns towards the origin of sound': 8,
        'Extend hand to grasp a toy': 8,
        'Sitting': 20,
        'Standing': 35,
        'Walking': 60,
        'Talking': 76
      };

      harness.subject.date_of_birth = DateTime.now().minus({ weeks: scenario.ageInWeeks }).toISODate();
      const result = await harness.fillForm(Services.U5_ASSESSMENT, ...scenario.input);

      expect(result.errors).lengthOf(1);
      expect(result.errors[0]).to.deep.include({
        type: 'validation',
        msg: 'enketo.constraint.required'
      });

      Object.keys(milestones).forEach(key => {
        if (milestones[key] <= scenario.ageInWeeks) {
          expect(result.errors[0].question).to.deep.include(key);
        } else {
          expect(result.errors[0].question).to.not.include(key);
        }
      });
    });
  });

  [
    {
      dangerSign: 'cannot_feed',
      input: u5AssessmentScenarios.under2MonthOld_no_feeding_danger_sign
    },
    {
      dangerSign: 'convusled_or_fitted',
      input: u5AssessmentScenarios.under2MonthOld_convulsion_danger_sign,
      expected: 'convulsions_newborn'
    },
    {
      dangerSign: 'has_fever',
      input: u5AssessmentScenarios.under2MonthOld_fever,
    },
    {
      dangerSign: 'no_move',
      input: u5AssessmentScenarios.under2MonthOld_no_movement_danger_sign,
      expected: 'no_movement'
    },
    {
      dangerSign: 'has_yellow_soles',
      input: u5AssessmentScenarios.under2MonthOld_yellow_soles_danger_sign,

    },
    {
      dangerSign: 'bleeding_umbilical_stump',
      input: u5AssessmentScenarios.under2MonthOld_bleeding_umbilical_danger_sign
    },
    {
      dangerSign: 'local_infection_signs',
      input: u5AssessmentScenarios.under2MonthOld_local_infection_danger_sign
    },
    {
      dangerSign: 'birth_weight_chart',
      input: u5AssessmentScenarios.under2MonthOld_birth_weight_danger_sign
    },
  ].forEach(scenario => {
    it(`validate under 2 screening outbound data: ${scenario.dangerSign}`, async () => {
      harness.subject.upi = 'test_upi';
      harness.subject.date_of_birth = DateTime.now().minus({ month: 1 }).toISODate();
      const result = await harness.fillForm(Services.U5_ASSESSMENT, ...scenario.input);
      expect(result.errors, scenario.dangerSign).to.be.empty;
      expect(result.report.fields.data, scenario.ds).to.deep.include({
        _upi: 'test_upi',
      });
      expect(result.report.fields.data._screening, scenario.dangerSign).to.deep.include({
        [`_${scenario.dangerSign}`]: scenario.expected ? scenario.expected : scenario.dangerSign
      });
    });
  });

  [
    {
      dangerSign: 'u5_has_cough',
      input: u5AssessmentScenarios.over2Month_contact_with_tb_and_danger_sign,
      expected: 'has_cough'
    },
    {
      dangerSign: 'u5_breath_count',
      input: u5AssessmentScenarios.over2Month_fast_breathing,
      expected: 'has_fast_breathing'
    },
    {
      dangerSign: 'u5_chest_indrawing',
      input: u5AssessmentScenarios.over2Month_chest_indrawing,
      expected: 'chest_indrawing'
    },
    {
      dangerSign: 'u5_has_diarrhoea',
      input: u5AssessmentScenarios.over2Month_diarrhoea_ds,
      expected: 'has_diarrhoea'
    },
    {
      dangerSign: 'u5_blood_in_stool',
      input: u5AssessmentScenarios.over2Month_blood_in_stool,
      expected: 'blood_in_stool'
    },
    {
      dangerSign: 'u5_has_fever',
      input: u5AssessmentScenarios.over2Month_fever_danger_sign,
      expected: 'has_fever'
    },
    {
      dangerSign: 'u5_has_convulsions',
      input: u5AssessmentScenarios.over2Month_convulsions_danger_sign,
      expected: 'convulsions'
    },
    {
      dangerSign: 'u5_cannot_drink_feed',
      input: u5AssessmentScenarios.over2Month_no_feeding_danger_sign,
      expected: 'cannot_drink_or_feed'
    },
    {
      dangerSign: 'u5_is_vomiting_everything',
      input: u5AssessmentScenarios.over2Month_vomiting_everything_danger_sign,
      expected: 'is_vomiting_everything'
    },
    {
      dangerSign: 'u5_has_swollen_feet',
      input: u5AssessmentScenarios.over2MonthOld_muac_swollen_feet,
      expected: 'has_swollen_feet'
    },
    {
      dangerSign: 'u5_muac_color',
      input: u5AssessmentScenarios.over2MonthOld_muac_red,
      expected: 'muac_red'
    },
    {
      dangerSign: 'u5_is_sleepy_unconscious',
      input: u5AssessmentScenarios.over2Month_unconscious_danger_sign,
      expected: 'is_sleepy_or_unconscious'
    },
    {
      dangerSign: 'u5_malaria_test',
      input: u5AssessmentScenarios.over2Month_malaria_positive,
      expected: 'malaria_positive'
    },
  ].forEach(scenario => {
    it(`validate over 2 month screening outbound data: ${scenario.dangerSign}`, async () => {
      harness.subject.upi = 'test_upi';
      harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
      const result = await harness.fillForm(Services.U5_ASSESSMENT, ...scenario.input);
      expect(result.errors, scenario.dangerSign).to.be.empty;
      expect(result.report.fields.data, scenario.dangerSign).to.deep.include({
        _upi: 'test_upi',
      });
      expect(result.report.fields.data._screening, scenario.dangerSign).to.deep.include({
        [`_${scenario.dangerSign}`]: scenario.expected
      });
    });
  });

});
