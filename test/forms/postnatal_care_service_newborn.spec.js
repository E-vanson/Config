const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { postnatalServiceNewbornScenarios, getDate } = require('../forms-inputs');
const { Services } = require('../../common-extras');

describe('Postnatal care service for newborn', () => {
  before(async () => {
    return await harness.start();
  });
  after(async () => {
    return await harness.stop();
  });
  beforeEach(async () => {
    await harness.clear();
    harness.subject.date_of_birth = getDate(-1);
    harness.subject.place_of_birth = 'home';
    harness.subject.created_by_doc = 'report_id';
    harness.content.source = 'contact';
  });
  afterEach(() => {
    expect(harness.consoleErrors).to.be.empty;
  });

  it('should not count as true visit if contact is not available', async () => {
    let result = await harness.fillForm(Services.POSTNATAL_CARE_SERVICE_NEWBORN, ...postnatalServiceNewbornScenarios.default());
    expect(result.errors).to.be.empty;
    expect((await harness.getContactSummary()).context.newborn_home_visit_count).to.eq(1);

    harness.content.source = ''; // any source that isn't the action from the contact page so we can ask if the patient is available
    result = await harness.fillForm(Services.POSTNATAL_CARE_SERVICE_NEWBORN, ...postnatalServiceNewbornScenarios.notAvailable);
    expect(result.errors).to.be.empty;
    expect((await harness.getContactSummary()).context.newborn_home_visit_count).to.eq(1);
    expect(result.report.fields).to.nested.include({
      newborn_home_visit_count: '1'
    });
  });

  it('should increment visit count if visit was completed as expected', async () => {
    let result = await harness.fillForm(Services.POSTNATAL_CARE_SERVICE_NEWBORN, ...postnatalServiceNewbornScenarios.default());
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      newborn_home_visit_count: '0',
      needs_missed_visit_follow_up: 'no',
      needs_danger_signs_follow_up: 'no',
      needs_immunization_follow_up: 'no',
      visited_contact_uuid: 'household_id'
    });
    expect((await harness.getContactSummary()).context.newborn_home_visit_count).to.eq(1);

    await harness.flush(2);
    result = await harness.fillForm(Services.POSTNATAL_CARE_SERVICE_NEWBORN, ...postnatalServiceNewbornScenarios.default(false));
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      newborn_home_visit_count: '1'
    });
    expect((await harness.getContactSummary()).context.newborn_home_visit_count).to.eq(2);
  });

  it('should be marked for danger signs follow up if danger signs are selected', async () => {
    harness.subject.upi = 'test_upi';
    const result = await harness.fillForm(Services.POSTNATAL_CARE_SERVICE_NEWBORN, ...postnatalServiceNewbornScenarios.withDangerSigns());
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      newborn_home_visit_count: '0',
      needs_missed_visit_follow_up: 'no',
      needs_danger_signs_follow_up: 'yes',
      needs_immunization_follow_up: 'no',
      visited_contact_uuid: 'household_id'
    });
    expect((await harness.getContactSummary()).context.newborn_home_visit_count).to.eq(1);
    expect(result.report.fields.data).to.deep.include({
      _upi: 'test_upi',
    });
    expect(result.report.fields.data._screening).to.deep.include({
      _convulsed: 'convulsions_newborn',
      _fever: 'fever',
      _not_moving: 'not_moving'
    });
    expect(result.report.fields.data._supporting_info).to.deep.include({
      _temperature: '40',
    });
  });

  it('should be marked for immunization follow up if status is not up-to-date', async () => {
    harness.subject.upi = 'test_upi';
    const result = await harness.fillForm(Services.POSTNATAL_CARE_SERVICE_NEWBORN, ...postnatalServiceNewbornScenarios.withImmunizationDefault());
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      newborn_home_visit_count: '0',
      needs_missed_visit_follow_up: 'no',
      needs_danger_signs_follow_up: 'no',
      needs_immunization_follow_up: 'yes',
      visited_contact_uuid: 'household_id'
    });
    expect((await harness.getContactSummary()).context.newborn_home_visit_count).to.eq(1);
    expect(result.report.fields.data).to.deep.include({
      _upi: 'test_upi',
    });
    expect(result.report.fields.data._screening).to.deep.include({
      _has_updated_immunization_status: 'imm_not_upto_date'
    });
  });
});
