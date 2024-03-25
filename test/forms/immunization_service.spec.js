const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness({ subject: 'patient_id' });
const { immunizationServiceScenarios, getDate } = require('../forms-inputs');
const { Services } = require('../../common-extras');
const { DateTime } = require('luxon');

describe('Immunization service', () => {
  before(async () => {
    return await harness.start();
  });
  after(async () => {
    return await harness.stop();
  });
  beforeEach(async () => {
    await harness.clear();
    harness.subject.date_of_birth = DateTime.now().minus({ months: 6, weeks: 2 }).toISODate();
  });
  afterEach(() => {
    expect(harness.consoleErrors).to.be.empty;
  });

  it('should refer for vaccines if some vaccines are checked for referral', async () => {
    const result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...immunizationServiceScenarios.referForVaccines);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_follow_up: 'yes',
      follow_up_date: getDate(3),
      needs_immunization_follow_up: 'yes',
      needs_vitamin_a_follow_up: 'no',
      needs_growth_monitoring_follow_up: 'no',
      needs_deworming_follow_up: 'no',
      visited_contact_uuid: 'household_id'
    });
  });

  it('should refer for vaccines if some vaccines were missed', async () => {
    const result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...immunizationServiceScenarios.referForSomeMissedVaccines);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_follow_up: 'yes',
      follow_up_date: getDate(3),
      needs_immunization_follow_up: 'yes',
      needs_vitamin_a_follow_up: 'no',
      needs_growth_monitoring_follow_up: 'no',
      needs_deworming_follow_up: 'no',
      visited_contact_uuid: 'household_id'
    });
  });

  it('should refer for vitamin a if due dose was not given', async () => {
    harness.content.given_bcg = 'yes';
    harness.content.given_opv_0 = 'yes';
    const result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...immunizationServiceScenarios.referVitaminA);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_follow_up: 'yes',
      follow_up_date: getDate(3),
      needs_immunization_follow_up: 'yes',
      needs_vitamin_a_follow_up: 'yes',
      needs_growth_monitoring_follow_up: 'no',
      needs_deworming_follow_up: 'no',
      visited_contact_uuid: 'household_id'
    });
  });

  it('should refer for growth monitoring if delayed milestones', async () => {
    const result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...immunizationServiceScenarios.referGrowthMonitoring);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_follow_up: 'yes',
      follow_up_date: getDate(3),
      needs_immunization_follow_up: 'yes',
      needs_vitamin_a_follow_up: 'no',
      needs_growth_monitoring_follow_up: 'yes',
      needs_deworming_follow_up: 'no',
      visited_contact_uuid: 'household_id'
    });
  });

  it('should refer for deworming if dose not given', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 1, days: 5 }).toISODate();
    const result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...immunizationServiceScenarios.referDeworming);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_follow_up: 'yes',
      follow_up_date: getDate(3),
      needs_immunization_follow_up: 'yes',
      needs_vitamin_a_follow_up: 'no',
      needs_growth_monitoring_follow_up: 'no',
      needs_deworming_follow_up: 'yes',
      visited_contact_uuid: 'household_id'
    });
  });

  it('should not refer if not needed', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    const result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...immunizationServiceScenarios.full_immunized);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_follow_up: 'no',
      needs_immunization_follow_up: 'no',
      needs_vitamin_a_follow_up: 'no',
      needs_growth_monitoring_follow_up: 'no',
      needs_deworming_follow_up: 'no',
      visited_contact_uuid: 'household_id'
    });
  });

  it('skip immunization question if upto date', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ month: 2 }).toISODate();
    let result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...[
      ['yes', 'mother_and_child_handbook', ['bcg', 'opv_0', 'opv_1', 'pcv_1', 'rota_1', 'penta_1']],
      ['yes', 'none'],
      ['yes', 'nhif']
    ]);
    expect(result.errors).to.be.empty;

    result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...[
      ['yes', 'mother_and_child_handbook'],
      ['yes', 'none'],
      ['yes', 'nhif']
    ]);
    expect(result.errors).to.be.empty;

    result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...[
      ['no', 'mother_and_child_handbook'],
      ['yes', 'none'],
      ['yes', 'nhif']
    ]);
    expect(result.errors).to.be.empty;
  });

  it('show immunization referred question', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ month: 2 }).toISODate();
    let result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...[
      ['yes', 'mother_and_child_handbook', ['bcg', 'opv_0', 'opv_1', 'pcv_1'], ['rota_1', 'penta_1']],
      ['yes', 'none'],
      ['yes', 'nhif']
    ]);
    expect(result.errors).to.be.empty;

    result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...[
      ['no', 'mother_and_child_handbook', ['rota_1', 'penta_1']],
      ['yes', 'none'],
      ['yes', 'nhif']
    ]);
    expect(result.errors).to.be.empty;
  });

  it('should not show optional vaccines question if administered', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ month: 6 }).toISODate();
    let result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...immunizationServiceScenarios.receivedOptionalVaccines);
    expect(result.errors).to.be.empty;

    const context = (await harness.getContactSummary()).context;
    expect(context.measles_6_given).eq('measles_6');
    expect(context.malaria_given).eq('malaria');

    result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...immunizationServiceScenarios.receivedOptionalVaccines);
    expect(result.errors).to.not.be.empty;

    expect(result.errors[0]).to.deep.include({
      type: 'page',
      msg: 'Attempted to fill 4 questions, but only 3 are visible.'
    });
  });

  it('test deworming outbound field', async () => {
    harness.subject.upi = 'test_upi';
    harness.subject.date_of_birth = DateTime.now().minus({ year: 1 }).toISODate();
    const result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...immunizationServiceScenarios.referDeworming);
    expect(result.errors).to.be.empty;
    expect(result.report.fields.data).to.deep.include({
      _upi: 'test_upi',
    });
    expect(result.report.fields.data._supporting_info).to.deep.include({
      deworming_upto_date: 'no'
    });
  });

  it('test growth_monitoring outbound field', async () => {
    harness.subject.upi = 'test_upi';
    const result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...immunizationServiceScenarios.referGrowthMonitoring);
    expect(result.errors).to.be.empty;
    expect(result.report.fields.data).to.deep.include({
      _upi: 'test_upi',
    });
    expect(result.report.fields.data._screening).to.deep.include({
      _has_delayed_development_milestones: 'sitting'
    });
    expect(result.report.fields.data._supporting_info).to.deep.include({
      is_participating_in_growth_monitoring: 'yes'
    });
  });

  it('test vaccines referred for outbound field', async () => {
    harness.subject.upi = 'test_upi';
    const result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...immunizationServiceScenarios.referForVaccines);
    expect(result.errors).to.be.empty;
    expect(result.report.fields.data).to.deep.include({
      _upi: 'test_upi',
    });
    expect(result.report.fields.data._screening).to.deep.include({
      _vaccines_referred_for: 'opv_3'
    });
  });

});
