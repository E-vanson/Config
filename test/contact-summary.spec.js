const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { Services, TASKS, Persons, getPregnancyAgeInWeeks, FAMILY_PLANNING_METHODS, Places } = require('../common-extras');
const {
  pregnancyHomeVisitScenarios,
  getDate,
  postnatalServiceScenarios,
  DateTime,
  subsequentPregnancyHomeVisitScenarios,
  personRegistrationScenarios,
  familyPlanningScenarios,
  mutePersonScenarios,
  muteHouseholdScenarios,
  approveMutePersonScenarios,
  approveMuteHouseholdScenarios,
  unmuteScenarios,
  householdRegistrationScenarios,
  deathScenarios,
  deathReviewScenarios,
  chvSupervisionScenarios,
  chaSupervisionScenarios } = require('./forms-inputs');

describe('postnatal care service card', () => {
  before(async () => { return await harness.start(); });
  after(async () => { return await harness.stop(); });
  beforeEach(async () => { return await harness.clear(); });
  afterEach(() => { expect(harness.consoleErrors).to.be.empty; });

  it('should show if in postnatal period - with danger signs if observed', async () => {
    let result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant());
    expect(result.errors).to.be.empty;

    result = await harness.fillForm(Services.POSTNATAL_CARE_SERVICE, ...postnatalServiceScenarios.pncMotherDangerSigns(7));
    expect(result.errors).to.be.empty;

    let contactSummary = await harness.getContactSummary();
    let postnatalCard = contactSummary.cards.find(card => card.label === 'contact.profile.pnc');
    expect(postnatalCard).to.be.not.undefined;
    const fields = postnatalCard.fields;
    expect(fields).to.have.property('length', 3);
    expect(fields.find(field => field.label === 'contact.profile.pnc.date_of_delivery')).to.deep.equal({
      label: 'contact.profile.pnc.date_of_delivery',
      value: DateTime.fromISO(getDate(-7)).toFormat('dd/MM/yyyy'),
      width: 6
    });
    expect(fields.find(field => field.label === 'contact.profile.pnc.danger_signs')).to.deep.equal({
      icon: 'icon-warning',
      label: 'contact.profile.pnc.danger_signs',
      value: 'contact.profile.pnc.danger_signs.present',
      translate: true,
      width: 6
    });
    let contextFields = contactSummary.context;
    expect(contextFields).to.include({
      days_since_delivery: 7,
      is_in_pnc: true,
      is_pregnant: false,
      pnc_follow_up_count: 2
    });

    harness.flush(3);
    harness.content.source = 'contact';
    result = await harness.fillForm(Services.POSTNATAL_CARE_SERVICE, ...postnatalServiceScenarios.subsequentVisitIfBabyDeceased());
    expect(result.errors).to.be.empty;

    contactSummary = await harness.getContactSummary();
    contextFields = contactSummary.context;
    expect(contextFields).to.include({
      days_since_delivery: 10,
      is_in_pnc: true,
      is_pregnant: false,
      pnc_follow_up_count: 3
    });

    harness.flush(49);
    contactSummary = await harness.getContactSummary();
    postnatalCard = contactSummary.cards.find(card => card.label === 'contact.profile.pnc');
    expect(postnatalCard).to.be.undefined;
  });

  it('should not show if not in postnatal care period', async () => {
    let result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant());
    expect(result.errors).to.be.empty;

    result = await harness.fillForm(Services.POSTNATAL_CARE_SERVICE, ...postnatalServiceScenarios.pncMotherDangerSigns(50));
    expect(result.errors).to.be.empty;

    const contactSummary = await harness.getContactSummary();
    const postnatalCard = contactSummary.cards.find(card => card.label === 'contact.profile.pnc');
    expect(postnatalCard).to.be.undefined;
  });
});

describe('pregnancy service card', () => {
  before(async () => { return await harness.start(); });
  after(async () => { return await harness.stop(); });
  beforeEach(async () => { return await harness.clear(); });
  afterEach(() => { expect(harness.consoleErrors).to.be.empty; });

  it('should show if pregnant - with danger signs if observed', async () => {
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.muac('red'));
    expect(result.errors).to.be.empty;

    const contactSummary = await harness.getContactSummary();
    const pregnancyCard = contactSummary.cards.find(card => card.label === 'contact.profile.pregnancy');
    expect(pregnancyCard).to.be.not.undefined;

    const fields = pregnancyCard.fields;
    expect(fields).to.have.property('length', 4);

    const pregnancy_age_in_weeks = getPregnancyAgeInWeeks(new Date(getDate(100)));
    expect(fields.find(field => field.label === 'contact.profile.pregnancy.pregnancy_age')).to.deep.equal({
      label: 'contact.profile.pregnancy.pregnancy_age',
      value: pregnancy_age_in_weeks + ' Weeks',
      width: 6
    });

    expect(fields.find(field => field.label === 'contact.profile.pregnancy.edd')).to.deep.equal({
      label: 'contact.profile.pregnancy.edd',
      value: DateTime.fromISO(getDate(100)).toFormat('dd/MM/yyyy'),
      width: 6
    });

    expect(fields.find(field => field.label === 'contact.profile.pregnancy.high_risk')).to.deep.equal({
      label: 'contact.profile.pregnancy.high_risk',
      value: 'contact.profile.pregnancy.danger_signs.present',
      width: 12,
      translate: true,
      icon: 'icon-warning'
    });

    expect(fields.find(field => field.label === 'contact.profile.pregnancy.anc_visit_status')).to.deep.equal({
      label: 'contact.profile.pregnancy.anc_visit_status',
      value: 'contact.profile.pregnancy.anc_upto_date',
      width: 12,
      translate: true
    });

    const contextFields = contactSummary.context;
    expect(contextFields).to.include({
      edd: getDate(100),
      pregnant: true,
      pregnancy_age_in_weeks: pregnancy_age_in_weeks,
      pregnancy_id: result.report._id
    });
  });

  it('should update edd and anc status to most recent pregnancy information', async () => {
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant(getDate(100)));
    expect(result.errors).to.be.empty;

    let contactSummary = await harness.getContactSummary();
    let pregnancyCard = contactSummary.cards.find(card => card.label === 'contact.profile.pregnancy');
    expect(pregnancyCard).to.be.not.undefined;

    let fields = pregnancyCard.fields;
    expect(fields).to.have.property('length', 3);

    let pregnancy_age_in_weeks = getPregnancyAgeInWeeks(new Date(getDate(100)));
    expect(fields.find(field => field.label === 'contact.profile.pregnancy.pregnancy_age')).to.deep.equal({
      label: 'contact.profile.pregnancy.pregnancy_age',
      value: pregnancy_age_in_weeks + ' Weeks',
      width: 6
    });

    expect(fields.find(field => field.label === 'contact.profile.pregnancy.edd')).to.deep.equal({
      label: 'contact.profile.pregnancy.edd',
      value: DateTime.fromISO(getDate(100)).toFormat('dd/MM/yyyy'),
      width: 6
    });

    expect(fields.find(field => field.label === 'contact.profile.pregnancy.anc_visit_status')).to.deep.equal({
      label: 'contact.profile.pregnancy.anc_visit_status',
      value: 'contact.profile.pregnancy.anc_upto_date',
      width: 12,
      translate: true
    });

    let contextFields = contactSummary.context;
    expect(contextFields).to.include({
      edd: getDate(100),
      pregnant: true,
      pregnancy_age_in_weeks: 29,
      pregnancy_id: result.report._id
    });

    //subsequent visit
    const expectedEDD = getDate(200);
    await harness.flush(13);
    const pregnancyHomeVisitTask = await harness.getTasks({ title: TASKS.pregnancy_home_visit_service });
    expect(pregnancyHomeVisitTask).to.have.property('length', 1);

    const result2 = await harness.loadAction(pregnancyHomeVisitTask[0], ...subsequentPregnancyHomeVisitScenarios.ancUptoDateTask);
    expect(result2.errors).to.be.empty;

    contactSummary = await harness.getContactSummary();
    pregnancyCard = contactSummary.cards.find(card => card.label === 'contact.profile.pregnancy');
    expect(pregnancyCard).to.be.not.undefined;

    fields = pregnancyCard.fields;
    expect(fields).to.have.property('length', 3);

    pregnancy_age_in_weeks = getPregnancyAgeInWeeks(new Date(expectedEDD));
    expect(fields.find(field => field.label === 'contact.profile.pregnancy.pregnancy_age')).to.deep.equal({
      label: 'contact.profile.pregnancy.pregnancy_age',
      value: pregnancy_age_in_weeks + ' Weeks',
      width: 6
    });

    expect(fields.find(field => field.label === 'contact.profile.pregnancy.edd')).to.deep.equal({
      label: 'contact.profile.pregnancy.edd',
      value: DateTime.fromISO(expectedEDD).toFormat('dd/MM/yyyy'),
      width: 6
    });

    expect(fields.find(field => field.label === 'contact.profile.pregnancy.anc_visit_status')).to.deep.equal({
      label: 'contact.profile.pregnancy.anc_visit_status',
      value: 'contact.profile.pregnancy.anc_upto_date',
      width: 12,
      translate: true
    });

    contextFields = contactSummary.context;
    expect(contextFields).to.include({
      edd: expectedEDD,
      pregnant: true,
      pregnancy_age_in_weeks: 17,
      pregnancy_id: result.report._id
    });
  });

  it('should show with no edd if pregnancy test result is positive ', async () => {
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.positivePregnancyTest);
    expect(result.errors).to.be.empty;

    const contactSummary = await harness.getContactSummary();
    const pregnancyCard = contactSummary.cards.find(card => card.label === 'contact.profile.pregnancy');
    expect(pregnancyCard).to.be.not.undefined;

    const fields = pregnancyCard.fields;
    expect(fields).to.have.property('length', 1);

    expect(fields.find(field => field.label === 'contact.profile.pregnancy.anc_visit_status')).to.deep.equal({
      label: 'contact.profile.pregnancy.anc_visit_status',
      value: 'contact.profile.pregnancy.anc_not_upto_date',
      width: 12,
      translate: true
    });

    const contextFields = contactSummary.context;
    expect(contextFields).to.include({
      edd: '',
      pregnant: true,
      pregnancy_age_in_weeks: 0,
      pregnancy_id: result.report._id
    });
  });

  it('should not show danger signs field if contact has no danger signs ', async () => {
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.positivePregnancyTest);
    expect(result.errors).to.be.empty;

    const contactSummary = await harness.getContactSummary();
    const pregnancyCard = contactSummary.cards.find(card => card.label === 'contact.profile.pregnancy');
    expect(pregnancyCard).to.be.not.undefined;

    const fields = pregnancyCard.fields;
    expect(fields).to.have.property('length', 1);

    expect(fields.find(field => field.label === 'contact.profile.pregnancy.high_risk')).to.be.undefined;

    const contextFields = contactSummary.context;
    expect(contextFields).to.include({
      edd: '',
      pregnant: true,
      pregnancy_age_in_weeks: 0,
      pregnancy_id: result.report._id
    });
  });

  [
    {
      input: pregnancyHomeVisitScenarios.onFp,
      description: 'is on family planning'
    },
    {
      input: pregnancyHomeVisitScenarios.lmpLt30Days,
      description: 'has lmp less than 30 days ago'
    },
    {
      input: pregnancyHomeVisitScenarios.lmpGt30Days(),
      description: 'pregnancy test is negative'
    },
    {
      input: pregnancyHomeVisitScenarios.pregnancyTestNotDone,
      description: 'pregnancy test is not done'
    },
    {
      input: pregnancyHomeVisitScenarios.lostPregnancy(),
      description: 'has lost pregnancy'
    }
  ].forEach(scenario => it(`should not show if contact ${scenario.description}`, async () => {
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...scenario.input);
    expect(result.errors).to.be.empty;

    const contactSummary = await harness.getContactSummary();
    const pregnancyCard = contactSummary.cards.find(card => card.label === 'contact.profile.pregnancy');
    expect(pregnancyCard).to.be.undefined;
  }));

  it(`should not show if contact is not pregnant anymore`, async () => {
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.muac('green'));
    expect(result.errors).to.be.empty;

    let contactSummary = await harness.getContactSummary();
    let pregnancyCard = contactSummary.cards.find(card => card.label === 'contact.profile.pregnancy');
    expect(pregnancyCard).to.be.not.undefined;

    await harness.flush(13);
    const pregnancyHomeVisitTask = await harness.getTasks({ title: TASKS.pregnancy_home_visit_service });
    expect(pregnancyHomeVisitTask).to.have.property('length', 1);

    const result2 = await harness.loadAction(pregnancyHomeVisitTask[0], ...subsequentPregnancyHomeVisitScenarios.notPregnantAnymoreTask);
    expect(result2.errors).to.be.empty;

    contactSummary = await harness.getContactSummary();
    pregnancyCard = contactSummary.cards.find(card => card.label === 'contact.profile.pregnancy');
    expect(pregnancyCard).to.be.undefined;
  });
});

describe('family planning service card', () => {
  before(async () => { return await harness.start(); });
  after(async () => { return await harness.stop(); });
  beforeEach(async () => { return await harness.clear(); });
  afterEach(() => { expect(harness.consoleErrors).to.be.empty; });

  const validSex = [`female`, `male`, `intersex`];

  it(`should show for elligible contacts who don't have reports`, async () => {
    const result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.femaleOnFp(DateTime.now().minus({ years: 20 }).toISODate()));
    expect(result.errors).to.be.empty;
    expect(result.contacts).to.have.lengthOf(1);

    const lady = harness.state.contacts.find(c => c.name === result.contacts[0].name);
    const household = harness.state.contacts.find(h => h._id === 'household_id');
    lady.parent = household;

    harness.subject = lady;

    const contactSummary = await harness.getContactSummary();
    const familyPlanningCard = contactSummary.cards.find(card => card.label === 'contact.profile.family_planning');
    expect(familyPlanningCard).to.be.not.undefined;

    const { fields } = familyPlanningCard;
    expect(fields).to.have.property('length', 1);
    expect(fields.find(field => field.label === 'contact.profile.family_planning.method')).to.deep.equal({
      label: 'contact.profile.family_planning.method',
      value: 'contact.profile.family_planning.method.none',
      translate: true,
      width: 6
    });
    const contextFields = contactSummary.context;
    expect(contextFields).to.include({
      is_on_fp: false,
      fp_method: undefined
    });
  });

  it(`should update for elligible contacts who are on fp`, async () => {
    let result = await harness.fillForm(Services.FAMILY_PLANNING, ...familyPlanningScenarios.noSideEffects);
    expect(result.errors).to.be.empty;

    let contactSummary = await harness.getContactSummary();
    let familyPlanningCard = contactSummary.cards.find(card => card.label === 'contact.profile.family_planning');
    expect(familyPlanningCard).to.be.not.undefined;

    let { fields } = familyPlanningCard;
    expect(fields).to.have.property('length', 1);
    expect(fields.find(field => field.label === 'contact.profile.family_planning.method')).to.deep.equal({
      label: 'contact.profile.family_planning.method',
      value: FAMILY_PLANNING_METHODS['injectables'],
      width: 6
    });
    let contextFields = contactSummary.context;
    expect(contextFields).to.include({
      is_on_fp: true,
      fp_method: 'injectables'
    });

    //Update to another fp method
    result = await harness.fillForm(Services.FAMILY_PLANNING, ...familyPlanningScenarios.changedToTubalLigation);
    expect(result.errors).to.be.empty;

    contactSummary = await harness.getContactSummary();
    familyPlanningCard = contactSummary.cards.find(card => card.label === 'contact.profile.family_planning');
    expect(familyPlanningCard).to.be.not.undefined;

    fields = familyPlanningCard.fields;
    expect(fields).to.have.property('length', 1);
    expect(fields.find(field => field.label === 'contact.profile.family_planning.method')).to.deep.equal({
      label: 'contact.profile.family_planning.method',
      value: FAMILY_PLANNING_METHODS['tubal_ligation'],
      width: 6
    });
    contextFields = contactSummary.context;
    expect(contextFields).to.include({
      is_on_fp: true,
      fp_method: 'tubal_ligation'
    });
  });

  ['cocs', 'pops', 'condoms'].forEach(method => it(`should show refill date for refilled refillable fp option: ${FAMILY_PLANNING_METHODS[method]}`, async () => {
    const result = await harness.fillForm(Services.FAMILY_PLANNING, ...familyPlanningScenarios.refillableFp(method));
    expect(result.errors).to.be.empty;

    const contactSummary = await harness.getContactSummary();
    const familyPlanningCard = contactSummary.cards.find(card => card.label === 'contact.profile.family_planning');
    expect(familyPlanningCard).to.be.not.undefined;

    const { fields } = familyPlanningCard;
    expect(fields).to.have.property('length', 2);
    expect(fields.find(field => field.label === 'contact.profile.family_planning.method')).to.deep.equal({
      label: 'contact.profile.family_planning.method',
      value: FAMILY_PLANNING_METHODS[method],
      width: 6
    });
    expect(fields.find(field => field.label === 'contact.profile.family_planning.refill_date')).to.deep.equal({
      label: 'contact.profile.family_planning.refill_date',
      value: DateTime.fromISO(getDate(21)).toFormat('dd/MM/yyyy'),
      width: 6
    });

    const contextFields = contactSummary.context;
    expect(contextFields).to.include({
      is_on_fp: true,
      fp_method: method
    });
  }));

  it(`should update to show that woman is not on family planning if contact is not on family planning anymore`, async () => {
    let result = await harness.fillForm(Services.FAMILY_PLANNING, ...familyPlanningScenarios.noSideEffects);
    expect(result.errors).to.be.empty;

    let contactSummary = await harness.getContactSummary();
    let familyPlanningCard = contactSummary.cards.find(card => card.label === 'contact.profile.family_planning');
    expect(familyPlanningCard).to.be.not.undefined;

    await harness.flush(13);
    result = await harness.fillForm(Services.FAMILY_PLANNING, ...familyPlanningScenarios.notOnFpAnymore);
    expect(result.errors).to.be.empty;

    contactSummary = await harness.getContactSummary();
    familyPlanningCard = contactSummary.cards.find(card => card.label === 'contact.profile.family_planning');
    expect(familyPlanningCard).to.be.not.undefined;

    const { fields } = familyPlanningCard;
    expect(fields).to.have.property('length', 1);
    expect(fields.find(field => field.label === 'contact.profile.family_planning.method')).to.deep.equal({
      label: 'contact.profile.family_planning.method',
      value: 'contact.profile.family_planning.method.none',
      translate: true,
      width: 6
    });
    const contextFields = contactSummary.context;
    expect(contextFields).to.include({
      is_on_fp: false,
      fp_method: undefined
    });
  });

  // fix in https://github.com/moh-kenya/config-echis-2.0/pull/1447
  // validSex.forEach(sex => it(`should not show for ${sex} client less than 10 years old`, async () => {
  //   const age = DateTime.now().minus({ years: 9 }).toISODate();
  //   const input = sex === 'male' ? personRegistrationScenarios.overFiveUnderTenMale(age) : personRegistrationScenarios.overFiveUnderTenFemale(age, sex);
  //   const result = await harness.fillContactCreateForm(Persons.CLIENT, ...input);
  //   expect(result.errors).to.be.empty;
  //   expect(result.contacts).to.have.lengthOf(1);

  //   const contact = harness.state.contacts.find(c => c.name === result.contacts[0].name);
  //   const household = harness.state.contacts.find(h => h._id === 'household_id');
  //   contact.parent = household;

  //   harness.subject = contact;

  //   const contactSummary = await harness.getContactSummary();
  //   expect(contactSummary.cards).to.be.empty;
  // }));

  validSex.forEach(sex => it(`should not show for ${sex} client more than 49 years old`, async () => {
    const result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.elderly(50, sex));
    expect(result.errors).to.be.empty;
    expect(result.contacts).to.have.lengthOf(1);

    const contact = harness.state.contacts.find(c => c.name === result.contacts[0].name);
    const household = harness.state.contacts.find(h => h._id === 'household_id');
    contact.parent = household;

    harness.subject = contact;

    const contactSummary = await harness.getContactSummary();
    expect(contactSummary.cards).to.be.empty;
  }));

  validSex.filter(s => s !== 'female').forEach(sex => it(`should show for ${sex} client on vasectomy`, async () => {
    const dob = DateTime.now().minus({ years: 21 }).toISODate();
    const input = sex === 'intersex' ? personRegistrationScenarios.intersex(dob) : personRegistrationScenarios.man(dob);
    let result = await harness.fillContactCreateForm(Persons.CLIENT, ...input);
    expect(result.errors).to.be.empty;
    expect(result.contacts).to.have.lengthOf(1);

    const person = harness.state.contacts.find(c => c.name === result.contacts[0].name);
    const household = harness.state.contacts.find(h => h._id === 'household_id');
    person.parent = household;

    harness.subject = person;

    let contactSummary = await harness.getContactSummary();
    let familyPlanningCard = contactSummary.cards.find(card => card.label === 'contact.profile.family_planning');
    expect(familyPlanningCard).to.be.not.undefined;

    let { fields } = familyPlanningCard;
    expect(fields).to.have.property('length', 1);
    expect(fields.find(field => field.label === 'contact.profile.family_planning.method')).to.deep.equal({
      label: 'contact.profile.family_planning.method',
      value: 'contact.profile.family_planning.method.none',
      translate: true,
      width: 6
    });

    result = await harness.fillForm(Services.FAMILY_PLANNING, ...familyPlanningScenarios.vasectomy);
    expect(result.errors).to.be.empty;

    contactSummary = await harness.getContactSummary();
    familyPlanningCard = contactSummary.cards.find(card => card.label === 'contact.profile.family_planning');
    expect(familyPlanningCard).to.be.not.undefined;

    fields = familyPlanningCard.fields;
    expect(fields).to.have.property('length', 1);
    expect(fields.find(field => field.label === 'contact.profile.family_planning.method')).to.deep.equal({
      label: 'contact.profile.family_planning.method',
      value: FAMILY_PLANNING_METHODS[familyPlanningScenarios.vasectomy[0][1]],
      width: 6
    });
  }));
});

describe('Eligibility for home visit service', () => {
  before(async () => { return await harness.start(); });
  after(async () => { return await harness.stop(); });
  beforeEach(async () => { return await harness.clear(); });
  afterEach(() => { expect(harness.consoleErrors).to.be.empty; });

  const scenarios = [
    {
      contactType: Persons.CLIENT,
      contactInputs: personRegistrationScenarios.default(DateTime.now().minus({ years: 18 }).toISODate()),
      muteService: Services.MUTE_PERSON,
      unmuteService: Services.UNMUTE_PERSON,
      input: mutePersonScenarios.confirmedMute(['relocated_outside_chv_area']),
      taskTitle: TASKS.APPROVE_MUTE_PERSON,
      approvingUser: 'cha_id',
      muteApprovalInput: approveMutePersonScenarios.confirmedMute,
      muteRejectingInput: approveMutePersonScenarios.rejectedMute,
      unmuteServiceInput: unmuteScenarios.confirmedUnmute
    },
    {
      contactType: Places.HOUSEHOLD,
      contactInputs: householdRegistrationScenarios.default,
      subject: 'household_id',
      muteService: Services.MUTE_HOUSEHOLD,
      unmuteService: Services.UNMUTE_HOUSEHOLD,
      input: muteHouseholdScenarios.confirmedMute(['relocated_outside_chv_area']),
      taskTitle: TASKS.APPROVE_MUTE_HOUSEHOLD,
      approvingUser: 'cha_id',
      muteApprovalInput: approveMuteHouseholdScenarios.confirmedMute,
      muteRejectingInput: approveMuteHouseholdScenarios.rejectedMute,
      unmuteServiceInput: unmuteScenarios.confirmedUnmute
    }
  ];

  scenarios.forEach(elem => it(`should be true for ${elem.contactType} contacts with no reports`, async () => {
    const result = await harness.fillContactForm(elem.contactType, ...elem.contactInputs);
    expect(result.errors).to.be.empty;
    harness.subject = harness.state.contacts.find(c => c.name === result.contacts[0].name);
    const contactSummary = await harness.getContactSummary();
    const contextFields = contactSummary.context;
    expect(contextFields).to.include({
      is_eligible_for_home_visit_service: true
    });
  }));

  scenarios.forEach(elem => it(`should be false for ${elem.contactType} contacts with mute report pending approval`, async () => {
    let result = await harness.fillContactForm(elem.contactType, ...elem.contactInputs);
    expect(result.errors).to.be.empty;
    harness.subject = harness.state.contacts.find(c => c.name === result.contacts[0].name);
    result = await harness.fillForm(elem.muteService, ...elem.input);
    let contactSummary = await harness.getContactSummary();
    let contextFields = contactSummary.context;
    expect(contextFields).to.include({
      is_eligible_for_home_visit_service: false
    });
    expect(result.errors).to.be.empty;
    contactSummary = await harness.getContactSummary();
    contextFields = contactSummary.context;
    expect(contextFields).to.include({
      is_eligible_for_home_visit_service: false
    });
  }));

  scenarios.forEach(elem => it(`should be false for ${elem.contactType} contacts with confirmed mute report`, async () => {
    let result = await harness.fillContactForm(elem.contactType, ...elem.contactInputs);
    expect(result.errors).to.be.empty;
    harness.subject = harness.state.contacts.find(c => c.name === result.contacts[0].name);
    result = await harness.fillForm(elem.muteService, ...elem.input);
    expect(result.errors).to.be.empty;
    let contactSummary = await harness.getContactSummary();
    let contextFields = contactSummary.context;
    expect(contextFields).to.include({
      is_eligible_for_home_visit_service: false
    });
    harness.user = elem.approvingUser;
    const followUpTask = await harness.getTasks({ title: elem.taskTitle });
    result = await harness.loadAction(followUpTask[0], ...elem.muteApprovalInput);
    expect(result.errors).to.be.empty;
    harness.subject.muted = DateTime.now().toMillis(); //currently no access to sentinel transitions
    contactSummary = await harness.getContactSummary();
    contextFields = contactSummary.context;
    expect(contextFields).to.include({
      is_eligible_for_home_visit_service: false
    });
  }));

  scenarios.forEach(elem => it(`should be true for ${elem.contactType} contacts with confirmed unmute report`, async () => {
    let result = await harness.fillContactForm(elem.contactType, ...elem.contactInputs);
    expect(result.errors).to.be.empty;
    harness.subject = harness.state.contacts.find(c => c.name === result.contacts[0].name);
    result = await harness.fillForm(elem.muteService, ...elem.input);
    expect(result.errors).to.be.empty;
    let contactSummary = await harness.getContactSummary();
    let contextFields = contactSummary.context;
    expect(contextFields).to.include({
      is_eligible_for_home_visit_service: false
    });
    harness.user = elem.approvingUser;
    const followUpTask = await harness.getTasks({ title: elem.taskTitle });
    result = await harness.loadAction(followUpTask[0], ...elem.muteApprovalInput);
    expect(result.errors).to.be.empty;
    harness.subject.muted = DateTime.now().toMillis(); //currently no access to sentinel transitions
    contactSummary = await harness.getContactSummary();
    contextFields = contactSummary.context;
    expect(contextFields).to.include({
      is_eligible_for_home_visit_service: false
    });

    await harness.flush({ days: 1 });
    harness.user = 'chv_id';
    result = await harness.fillForm(elem.unmuteService, ...elem.unmuteServiceInput);
    expect(result.errors).to.be.empty;
    delete harness.subject.muted;
    contactSummary = await harness.getContactSummary();
    contextFields = contactSummary.context;
    expect(contextFields).to.include({
      is_eligible_for_home_visit_service: true
    });
  }));

  scenarios.forEach(elem => it(`should be true for ${elem.contactType} contacts with rejected mute report`, async () => {
    let result = await harness.fillContactForm(elem.contactType, ...elem.contactInputs);
    expect(result.errors).to.be.empty;
    harness.subject = harness.state.contacts.find(c => c.name === result.contacts[0].name);
    result = await harness.fillForm(elem.muteService, ...elem.input);
    expect(result.errors).to.be.empty;
    let contactSummary = await harness.getContactSummary();
    let contextFields = contactSummary.context;
    expect(contextFields).to.include({
      is_eligible_for_home_visit_service: false
    });
    harness.user = elem.approvingUser;
    const followUpTask = await harness.getTasks({ title: elem.taskTitle });
    result = await harness.loadAction(followUpTask[0], ...elem.muteRejectingInput);
    expect(result.errors).to.be.empty;
    contactSummary = await harness.getContactSummary();
    contextFields = contactSummary.context;
    expect(contextFields).to.include({
      is_eligible_for_home_visit_service: true
    });
  }));

  it(`should be false when a death report is submitted, then true when death is not confirmed`, async () => {
    let result = await harness.fillContactCreateForm(Persons.CLIENT, ...personRegistrationScenarios.default(DateTime.now().minus({ years: 20 }).toISODate()));
    expect(result.errors).to.be.empty;
    harness.subject = harness.state.contacts.find(c => c.name === result.contacts[0].name);
    harness.user = 'chv_id';
    result = await harness.fillForm(Services.DEATH_REPORT, ...deathScenarios.healthFacility);
    expect(result.errors).to.be.empty;
    let contactSummary = await harness.getContactSummary();
    let contextFields = contactSummary.context;
    expect(contextFields).to.include({
      is_eligible_for_home_visit_service: false
    });
    harness.user = `cha_id`;
    const followUpTask = await harness.getTasks({ title: TASKS.death_confirmation });
    result = await harness.loadAction(followUpTask[0], ...deathReviewScenarios.notConfirmed);
    expect(result.errors).to.be.empty;
    contactSummary = await harness.getContactSummary();
    contextFields = contactSummary.context;
    expect(contextFields).to.include({
      is_eligible_for_home_visit_service: true
    });
  });

  it(`should be false when a death report is confirmed`, async () => {
    let result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.default(DateTime.now().minus({ years: 20 }).toISODate()));
    expect(result.errors).to.be.empty;
    harness.subject = harness.state.contacts.find(c => c.name === result.contacts[0].name);
    harness.user = 'chv_id';
    result = await harness.fillForm(Services.DEATH_REPORT, ...deathScenarios.healthFacility);
    expect(result.errors).to.be.empty;
    let contactSummary = await harness.getContactSummary();
    let contextFields = contactSummary.context;
    expect(contextFields).to.include({
      is_eligible_for_home_visit_service: false
    });
    harness.user = `cha_id`;
    const followUpTask = await harness.getTasks({ title: TASKS.death_confirmation });
    result = await harness.loadAction(followUpTask[0], ...deathReviewScenarios.healthFacility);
    expect(result.errors).to.be.empty;
    harness.subject.date_of_death = DateTime.now().toISODate(); //currently no access to sentinel transitions
    contactSummary = await harness.getContactSummary();
    contextFields = contactSummary.context;
    expect(contextFields).to.include({
      is_eligible_for_home_visit_service: false
    });
  });
});

describe('chv context for supervision summary', () => {
  before(async () => { return await harness.start(); });
  after(async () => { return await harness.stop(); });
  beforeEach(async () => { return await harness.clear(); });
  afterEach(() => { expect(harness.consoleErrors).to.be.empty; });

  it('should update fields when supervision report is submitted', async () => {
    harness.user = 'cha_id';
    harness.subject = 'chv_id';
    let result = await harness.fillForm(Services.CHA_SUPERVISION_CALENDAR, ...chaSupervisionScenarios.default(DateTime.now().toISODate()));
    expect(result.errors).to.be.empty;

    let contactSummary = await harness.getContactSummary();
    let contextFields = contactSummary.context;
    expect(contextFields).to.include({
      calc_last_visit_date: '',
      calc_last_visit_action_points: '',
      calc_supervision_visit_count: 0
    });
    await harness.flush(3);
    const tasks = await harness.getTasks({ title: TASKS.chv_supervision });
    expect(tasks).to.have.property('length', 1);
    result = await harness.loadAction(tasks[0], ...chvSupervisionScenarios.available);
    expect(result.errors).to.be.empty;

    contactSummary = await harness.getContactSummary();
    contextFields = contactSummary.context;
    expect(contextFields).to.include({
      calc_last_visit_date: getDate(0),
      calc_last_visit_action_points: chvSupervisionScenarios.available[3].toString(),
      calc_supervision_visit_count: '1'
    });
  });
});
