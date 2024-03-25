const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const { DateTime } = require('luxon');
const harness = new TestHarness();
const { Services, VACCINATIONS, mapImmunizationServiceVaccineAnswers } = require('../../common-extras');
const { immunizationServiceScenarios, u5AssessmentScenarios } = require('../forms-inputs');
const requiredVaccinations = Object.fromEntries(Object.entries(VACCINATIONS).filter(([vaccination]) => !['measles_6', 'malaria'].includes(vaccination)));

describe('Child Health Card', () => {
  before(async () => { return await harness.start(); });
  after(async () => { return await harness.stop(); });
  beforeEach(async () => { return await harness.clear(); });
  afterEach(() => { expect(harness.consoleErrors).to.be.empty; });

  it('show vaccines on card when reported with immunization service for 2 month old', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ month: 2, day: 1 }).toISODate();

    let contactSummary = await harness.getContactSummary();
    let card = contactSummary.cards.find(card => card.label === 'contact.profile.child_health_card');
    expect(card.fields.find(field => field.label === 'contact.profile.immunization.confirmed').value).to.be.equal('contact.profile.immunization.none');

    const vaccs = ['bcg', 'opv_0', 'opv_1', 'pcv_1', 'penta_1', 'rota_1'];
    const result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ['yes', 'mother_and_child_handbook', vaccs], ['yes', 'none'], ['yes', 'nhif']);
    expect(result.errors).to.be.empty;

    contactSummary = await harness.getContactSummary();
    const normVaccs = mapImmunizationServiceVaccineAnswers(vaccs.join(' ')).split(' ');
    Object.keys(VACCINATIONS).filter(vaccine => normVaccs.includes(vaccine)).forEach(vaccine => {
      expect(contactSummary.context[`${vaccine}_given`]).to.equal(vaccine);
    });
    card = contactSummary.cards.find(card => card.label === 'contact.profile.child_health_card');
    expect(card.fields.find(field => field.label === 'contact.profile.immunization.confirmed').value).to.be.equal(Object.keys(VACCINATIONS).filter(vacc => normVaccs.includes(vacc)).map(key => VACCINATIONS[key]).join(','));
  });

  it('show vaccines on card for subsequent immunization service reports', async () => {
    const verifyContext = (context, vaccs) => Object.keys(VACCINATIONS).filter(vaccine => vaccs.includes(vaccine)).forEach(vaccine => { expect(context[`${vaccine}_given`]).to.equal(vaccine); });
    const verifyCardField = (card, field, value) => expect(card.fields.find(f => f.label === field).value).to.be.equal(value);
    harness.subject.date_of_birth = DateTime.now().minus({ month: 1 }).toISODate();

    let contactSummary = await harness.getContactSummary();
    verifyCardField(contactSummary.cards.find(card => card.label === 'contact.profile.child_health_card'), 'contact.profile.immunization.confirmed', 'contact.profile.immunization.none');

    let vaccs = ['bcg', 'opv_0'];
    let result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ['yes', 'mother_and_child_handbook', vaccs], ['yes', 'nhif']);
    expect(result.errors).to.be.empty;

    let vaccsComplete = [...vaccs];
    vaccsComplete = mapImmunizationServiceVaccineAnswers(vaccsComplete.join(' ')).split(' ');

    contactSummary = await harness.getContactSummary();
    verifyContext(contactSummary.context, vaccsComplete);
    verifyCardField(contactSummary.cards.find(card => card.label === 'contact.profile.child_health_card'), 'contact.profile.immunization.confirmed', Object.keys(VACCINATIONS).filter(vacc => vaccsComplete.includes(vacc)).map(key => VACCINATIONS[key]).join(','));

    harness.setNow(DateTime.now().plus({ month: 2, day: 1 }).toISODate());

    vaccs = ['opv_1', 'pcv_1', 'penta_1', 'rota_1', 'opv_2', 'pcv_2', 'penta_2', 'rota_2'];
    result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ['yes', 'mother_and_child_handbook', vaccs], ['yes', 'none'], ['yes', 'nhif']);
    expect(result.errors).to.be.empty;

    vaccsComplete = vaccsComplete.concat(vaccs);
    vaccsComplete = mapImmunizationServiceVaccineAnswers(vaccsComplete.join(' ')).split(' ');

    contactSummary = await harness.getContactSummary();
    verifyContext(contactSummary.context, vaccsComplete);
    const card = contactSummary.cards.find(card => card.label === 'contact.profile.child_health_card');
    expect(card.fields.find(field => field.label === 'contact.profile.immunization.confirmed').value.split(',').sort()).to.deep.equal(Object.keys(VACCINATIONS).filter(vacc => vaccsComplete.includes(vacc)).map(key => VACCINATIONS[key]).sort());
  });

  it('report vaccines with immunization service and under 5 assessment', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ month: 6 }).toISODate();

    let contactSummary = await harness.getContactSummary();
    let card = contactSummary.cards.find(card => card.label === 'contact.profile.child_health_card');
    expect(card.fields.find(field => field.label === 'contact.profile.immunization.confirmed').value).to.be.equal('contact.profile.immunization.none');

    let vaccs = ['bcg', 'opv_0', 'opv_1', 'pcv_1', 'penta_1', 'rota_1'];
    const missedVaccs = ['opv_2', 'pcv_2', 'penta_2', 'rota_2', 'opv_3', 'pcv_3', 'penta_3', 'rota_3', 'ipv', 'vitamin_a'];
    let result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ['yes', 'mother_and_child_handbook', vaccs, '', missedVaccs], ['6_months'], ['yes', 'none'], ['yes', 'nhif']);
    expect(result.errors).to.be.empty;

    contactSummary = await harness.getContactSummary();
    Object.keys(VACCINATIONS).filter(vaccine => mapImmunizationServiceVaccineAnswers(vaccs.join(' ')).split(' ').includes(vaccine)).forEach(vaccine => {
      expect(contactSummary.context[`${vaccine}_given`]).to.equal(vaccine);
    });
    card = contactSummary.cards.find(card => card.label === 'contact.profile.child_health_card');
    expect(card.fields.find(field => field.label === 'contact.profile.immunization.confirmed').value)
      .to.be.equal(Object.keys(VACCINATIONS).filter(vacc => mapImmunizationServiceVaccineAnswers(vaccs.join(' ')).split(' ').includes(vacc)).map(key => VACCINATIONS[key]).join(','));

    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.sixMonth_upto_date_vitamin_a(mapImmunizationServiceVaccineAnswers(missedVaccs.join(' ')).split(' ')));
    expect(result.errors).to.be.empty;

    vaccs = vaccs.concat(missedVaccs);
    vaccs = mapImmunizationServiceVaccineAnswers(vaccs.join(' ')).split(' ');
    contactSummary = await harness.getContactSummary();
    Object.keys(VACCINATIONS).filter(vaccine => vaccs.includes(vaccine)).forEach(vaccine => {
      expect(contactSummary.context[`${vaccine}_given`]).to.equal(vaccine);
    });
    card = contactSummary.cards.find(card => card.label === 'contact.profile.child_health_card');
    expect(card.fields.find(field => field.label === 'contact.profile.immunization.confirmed').value.split(',').sort()).to.deep.equal(Object.keys(VACCINATIONS).filter(vacc => vaccs.includes(vacc)).map(key => VACCINATIONS[key]).sort());
  });

  it('show vaccines on card for subsequent u5 assessment reports', async () => {
    const verifyContext = (context, vaccs) => Object.keys(requiredVaccinations).filter(vaccine => vaccs.includes(vaccine)).forEach(vaccine => { expect(context[`${vaccine}_given`]).to.equal(vaccine); });
    const verifyCardField = (card, field, value) => expect(card.fields.find(f => f.label === field).value).to.be.equal(value);
    harness.subject.date_of_birth = DateTime.now().minus({ month: 4 }).toISODate();

    let contactSummary = await harness.getContactSummary();
    verifyCardField(contactSummary.cards.find(card => card.label === 'contact.profile.child_health_card'), 'contact.profile.immunization.confirmed', 'contact.profile.immunization.none');

    let vaccs = ['bcg', 'opv0', 'opv1', 'pcv1', 'penta1', 'rota1', 'opv2', 'pcv2', 'penta2', 'rota2', 'opv3', 'pcv3', 'penta3', 'rota3', 'ipv'];
    let result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.fourMonth_immunization(vaccs));
    expect(result.errors).to.be.empty;

    let vaccsComplete = [...vaccs];
    contactSummary = await harness.getContactSummary();
    verifyContext(contactSummary.context, vaccsComplete);
    verifyCardField(contactSummary.cards.find(card => card.label === 'contact.profile.child_health_card'), 'contact.profile.immunization.confirmed', Object.keys(VACCINATIONS).filter(vacc => vaccsComplete.includes(vacc)).map(key => VACCINATIONS[key]).join(','));

    harness.setNow(DateTime.now().plus({ month: 2, day: 1 }).toISODate());
    vaccs = ['vit_a'];
    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.sixMonth_immunization(vaccs, ['6_months']));
    expect(result.errors).to.be.empty;

    vaccsComplete = vaccsComplete.concat(vaccs);

    contactSummary = await harness.getContactSummary();
    verifyContext(contactSummary.context, vaccsComplete);
    const card = contactSummary.cards.find(card => card.label === 'contact.profile.child_health_card');
    expect(card.fields.find(field => field.label === 'contact.profile.immunization.confirmed').value.split(',').sort()).to.deep.equal(Object.keys(VACCINATIONS).filter(vacc => vaccsComplete.includes(vacc)).map(key => VACCINATIONS[key]).sort());

  });

  it('test vaccine list validation in under 5 assessment', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ month: 6 }).toISODate();
    const vaccs = ['bcg', 'opv_0', 'opv_1', 'pcv_1', 'penta_1', 'rota_1'];
    const missedVaccs = ['opv_2', 'pcv_2', 'penta_2', 'rota_2', 'opv_3', 'pcv_3', 'penta_3', 'rota_3', 'ipv', 'vitamin_a', 'measles_6_months'];
    let result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ['yes', 'mother_and_child_handbook', vaccs,'', missedVaccs], ['6_months'], ['yes', 'none'], ['yes', 'nhif']);
    expect(result.errors).to.be.empty;
    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.sixMonth_upto_date_vitamin_a(mapImmunizationServiceVaccineAnswers(vaccs.join(' ')).split(' ')));
    expect(result.errors).lengthOf(1);
    expect(result.errors[0].type).to.equal('validation');
  });

  it('test vaccine list validation in under immunization service', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ month: 6 }).toISODate();
    const vaccs = ['bcg', 'opv0', 'opv1', 'pcv1', 'penta1', 'rota1', 'opv2', 'pcv2', 'penta2', 'rota2', 'opv3', 'pcv3', 'penta3', 'rota3', 'ipv', 'vit_a'];
    let result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.sixMonth_immunization(vaccs, ['6_months']));
    expect(result.errors).to.be.empty;
    const vaccs_imm_service = mapImmunizationServiceVaccineAnswers(vaccs.join(' ')).split(' ');
    result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ['yes', 'mother_and_child_handbook', vaccs_imm_service, 'measles_6'], ['yes', 'none'], ['yes', 'nhif'], ['link_health_facility']);
    expect(result.errors).lengthOf(1);
    expect(result.errors[0]).to.deep.include({
      type: 'page',
      msg: 'Attempted to fill 4 questions, but only 3 are visible.'
    });
  });

  it('show vaccines on card when reported with immunization service', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();

    let contactSummary = await harness.getContactSummary();
    let card = contactSummary.cards.find(card => card.label === 'contact.profile.child_health_card');
    expect(card.fields.find(field => field.label === 'contact.profile.immunization.confirmed').value).to.be.equal('contact.profile.immunization.none');
    expect(card.fields.find(field => field.label === 'contact.profile.immunization.fully_immunized')).to.be.undefined;
    expect(card.fields.find(field => field.label === 'contact.profile.deworming_status')).to.be.undefined;

    const result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...immunizationServiceScenarios.full_immunized);
    expect(result.errors).to.be.empty;
    contactSummary = await harness.getContactSummary();
    Object.keys(requiredVaccinations).forEach(vaccine => {
      expect(contactSummary.context[`${vaccine}_given`]).to.equal(vaccine);
    });
    card = contactSummary.cards.find(card => card.label === 'contact.profile.child_health_card');
    expect(card.fields.find(field => field.label === 'contact.profile.immunization.confirmed').value).to.be.equal(Object.values(requiredVaccinations).join(','));
    expect(card.fields.find(field => field.label === 'contact.profile.deworming_status').value).to.be.equal('contact.profile.deworming_upto_date');
  });

  it('show vaccines on card when reported with u5 assessment', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();

    let contactSummary = await harness.getContactSummary();
    let card = contactSummary.cards.find(card => card.label === 'contact.profile.child_health_card');
    expect(card.fields.find(field => field.label === 'contact.profile.immunization.confirmed').value).to.be.equal('contact.profile.immunization.none');
    expect(card.fields.find(field => field.label === 'contact.profile.immunization.fully_immunized')).to.be.undefined;
    expect(card.fields.find(field => field.label === 'contact.profile.deworming_status')).to.be.undefined;

    const result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_fully_immunized);
    expect(result.errors).to.be.empty;
    contactSummary = await harness.getContactSummary();
    Object.keys(requiredVaccinations).forEach(vaccine => {
      expect(contactSummary.context[`${vaccine}_given`]).to.equal(vaccine);
    });
    card = contactSummary.cards.find(card => card.label === 'contact.profile.child_health_card');
    expect(card.fields.find(field => field.label === 'contact.profile.immunization.confirmed').value).to.be.equal(Object.values(requiredVaccinations).join(','));
    expect(card.fields.find(field => field.label === 'contact.profile.deworming_status').value).to.be.equal('contact.profile.deworming_upto_date');
  });

  it('should update immunization status to "yes" when fully immunized', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();

    let contactSummary = await harness.getContactSummary();
    let card = contactSummary.cards.find(card => card.label === 'contact.profile.child_health_card');
    expect(card.fields.find(field => field.label === 'contact.profile.immunization.fully_immunized')).to.be.undefined;

    const vaccs = ['bcg', 'opv_0', 'opv_1', 'pcv_1', 'penta_1', 'rota_1'];
    let result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ['yes', 'mother_and_child_handbook', vaccs, '', 'rota_2'], ['12_months'], ['yes'], ['yes'], ['yes', 'nhif']);
    expect(result.errors).to.be.empty;
    contactSummary = await harness.getContactSummary();
    card = contactSummary.cards.find(card => card.label === 'contact.profile.child_health_card');
    expect(card.fields.find(field => field.label === 'contact.profile.immunization.fully_immunized').value).to.equal('contact.profile.immunization.fully_immunized.no');

    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_fully_immunized);
    expect(result.errors).to.be.empty;
    contactSummary = await harness.getContactSummary();
    Object.keys(requiredVaccinations).forEach(vaccine => {
      expect(contactSummary.context[`${vaccine}_given`]).to.equal(vaccine);
    });
    card = contactSummary.cards.find(card => card.label === 'contact.profile.child_health_card');
    expect(card.fields.find(field => field.label === 'contact.profile.immunization.fully_immunized').value).to.equal('contact.profile.immunization.fully_immunized.yes');
  });

  it('test vitamin a choice filter in immunization service', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ month: 18 }).toISODate();
    const vaccs = ['bcg', 'opv_0', 'opv_1', 'pcv_1', 'penta_1', 'rota_1'];
    let result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ['no', 'mother_and_child_handbook', '', vaccs], ['6_months'], ['yes'], ['yes', 'none'], ['yes', 'nhif']);
    expect(result.errors).to.be.empty;
    result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ['no', 'mother_and_child_handbook', '', vaccs], [], ['yes'], ['yes', 'none'], ['yes', 'nhif']);
    expect(result.errors).lengthOf(1);
    expect(result.errors[0]).to.deep.include({
      type: 'validation',
      question: 'Which Vitamin A dose has Test Client received?*\nNone\n12 months\n18 months\nenketo.constraint.required',
      msg: 'enketo.constraint.required'
    });
  });

  it('test u5 assessment vitamin a choice filter', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ year: 3 }).toISODate();
    let result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_immunization_not_upto_date(['6_months', '12_months']));
    expect(result.errors).to.be.empty;
    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.over2Month_immunization_not_upto_date([]));
    expect(result.errors).lengthOf(1);
    expect(result.errors[0]).to.deep.include({
      type: 'validation',
      question: 'Which Vit A dose has Test Client received?*\nNone\n18 months\n24 months\n30 months\n36 months\nenketo.constraint.required',
      msg: 'enketo.constraint.required'
    });
  });

  it('test vitamin a validation in immunization service and u5 assessment', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ month: 6 }).toISODate();
    const vaccs = ['bcg', 'opv_0', 'opv_1', 'pcv_1', 'penta_1', 'rota_1'];
    let result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ['yes', 'mother_and_child_handbook', vaccs, '', ['opv_2']], ['6_months'], ['yes', 'none'], ['yes', 'nhif']);
    expect(result.errors).to.be.empty;
    const missed = ['opv2', 'pcv2', 'penta2', 'rota2', 'opv3', 'pcv3', 'penta3', 'rota3', 'ipv', 'vit_a', 'measles_6'];
    result = await harness.fillForm(Services.U5_ASSESSMENT, ...u5AssessmentScenarios.sixMonth_upto_date_vitamin_a(missed));
    expect(result.errors).to.be.empty;
  });

});
