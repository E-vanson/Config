const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { postnatalServiceScenarios, getDate, referralFollowUpScenarios, personRegistrationScenarios } = require('../forms-inputs');
const { Services, TASKS, Persons } = require('../../common-extras');
const { hasClientRegistryFields } = require('../../contact-summary-extras');
const { DateTime } = require('luxon');

describe('Postnatal care service', () => {
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

  it('if mother not delivered, exit form', async () => {
    harness.content.source = 'contact';
    const result = await harness.fillForm(Services.POSTNATAL_CARE, ...postnatalServiceScenarios.notDelivered);
    expect(result.errors).to.be.empty;
    expect((await harness.countTaskDocsByState({ actionForm: Services.REFERRAL_FOLLOW_UP })).Total).to.equal(0);
    expect((await harness.countTaskDocsByState({ actionForm: Services.POSTNATAL_CARE_SERVICE })).Total).to.equal(0);
  });

  it('mother not delivered should not increment postnatal care home visit count', async () => {
    const result = await harness.fillForm(Services.POSTNATAL_CARE, ...postnatalServiceScenarios.notDelivered);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      postnatal_care_service_count: '0'
    });
  });

  it('mother delivered, but died should end follow ups', async () => {
    const result = await harness.fillForm(Services.POSTNATAL_CARE, ...postnatalServiceScenarios.deliveredDead);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      'group_pnc_visit.condition_of_the_mother': 'dead',
      neonatal_deaths: '1',
      needs_danger_signs_follow_up: 'false',
      needs_pnc_update_follow_up: 'false',
      needs_mental_health_follow_up: 'false',
      needs_subsequent_visit: 'false',
      needs_missed_home_visit_follow_up: 'false',
      is_in_postnatal_care: 'yes',
      visited_contact_uuid: 'household_id'
    });

    const taskTime = getDate(3);
    await harness.setNow(taskTime);

    const followUpTask = await harness.getTasks({ title: TASKS.pnc_mother_danger_signs });
    expect(followUpTask).to.have.property('length', 0);
  });

  it('mother has danger signs should trigger follow up', async () => {
    const result = await harness.fillForm(Services.POSTNATAL_CARE, ...postnatalServiceScenarios.pncMotherDangerSigns(7));
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      neonatal_deaths: '1',
      needs_danger_signs_follow_up: 'true',
      danger_signs_follow_up_date: getDate(1),
      needs_pnc_update_follow_up: 'false',
      needs_mental_health_follow_up: 'false',
      needs_subsequent_visit: 'true',
      subsequent_visit_date: getDate(10),
      needs_missed_home_visit_follow_up: 'false',
      is_in_postnatal_care: 'yes',
      visited_contact_uuid: 'household_id'
    });

    const taskTime = result.report.fields.danger_signs_follow_up_date;
    await harness.setNow(taskTime);

    const followUpTask = await harness.getTasks({ title: TASKS.pnc_mother_danger_signs });
    expect(followUpTask).to.have.property('length', 1);

    const day1FollowUp = await harness.loadAction(followUpTask[0], ...referralFollowUpScenarios.availableAndVisited);
    expect(day1FollowUp.errors).to.be.empty;
    const followUpTaskFinal = await harness.getTasks({ title: TASKS.pnc_mother_danger_signs });
    expect(followUpTaskFinal).to.have.property('length', 0);
  });

  it('newborn has danger signs should trigger follow up', async () => {
    const result = await harness.fillForm(Services.POSTNATAL_CARE, ...postnatalServiceScenarios.newbornDangerSigns(7));
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_danger_signs_follow_up: 'false',
      needs_pnc_update_follow_up: 'false',
      needs_mental_health_follow_up: 'false',
      needs_subsequent_visit: 'true',
      subsequent_visit_date: getDate(10),
      needs_missed_home_visit_follow_up: 'false',
      visited_contact_uuid: 'household_id'
    });
    expect(result.additionalDocs[0]).to.include({
      needs_newborn_danger_signs_follow_up: 'true',
      newborn_danger_signs_follow_up_date: getDate(1),
      needs_immunization_follow_up: 'false'
    });


    expect(result.additionalDocs[0].parent).to.include({
      _id: harness.subject.parent._id,
    });

    expect(result.additionalDocs[0].data._screening).to.deep.include({
      _fever: 'fever',
    });
    expect(result.additionalDocs[0].data._supporting_info).to.deep.include({
      _temperature: '40',
    });

    const taskTime = result.additionalDocs[0].newborn_danger_signs_follow_up_date;
    await harness.setNow(taskTime);
    const followUpTask = await harness.getTasks({ title: TASKS.newborn_danger_signs });
    expect(followUpTask).to.have.property('length', 1);
    const day1FollowUp = await harness.loadAction(followUpTask[0], ...referralFollowUpScenarios.availableAndVisited);
    expect(day1FollowUp.errors).to.be.empty;
    const followUpTaskFinal = await harness.getTasks({ title: TASKS.newborn_danger_signs });
    expect(followUpTaskFinal).to.have.property('length', 0);
  });

  it('mother pnc not uptodate should trigger follow up', async () => {
    const result = await harness.fillForm(Services.POSTNATAL_CARE, ...postnatalServiceScenarios.motherPncNotUptodate(7));
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_danger_signs_follow_up: 'false',
      needs_pnc_update_follow_up: 'true',
      pnc_update_follow_up_date: getDate(3),
      needs_mental_health_follow_up: 'false',
      needs_subsequent_visit: 'true',
      subsequent_visit_date: getDate(10),
      needs_missed_home_visit_follow_up: 'false',
      visited_contact_uuid: 'household_id'
    });

    const taskTime = result.report.fields.pnc_update_follow_up_date;
    await harness.setNow(taskTime);

    const followUpTask = await harness.getTasks({ title: TASKS.pnc_mother_danger_signs });
    expect(followUpTask).to.have.property('length', 1);

    const day1FollowUp = await harness.loadAction(followUpTask[0], ...referralFollowUpScenarios.availableAndVisited);
    expect(day1FollowUp.errors).to.be.empty;
    const followUpTaskFinal = await harness.getTasks({ title: TASKS.pnc_mother_danger_signs });
    expect(followUpTaskFinal).to.have.property('length', 0);
  });

  it('mother mental signs should trigger follow up', async () => {
    const result = await harness.fillForm(Services.POSTNATAL_CARE, ...postnatalServiceScenarios.mentalSigns(7));
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_danger_signs_follow_up: 'false',
      needs_pnc_update_follow_up: 'true',
      pnc_update_follow_up_date: getDate(3),
      needs_mental_health_follow_up: 'true',
      mental_health_follow_up_date: getDate(3),
      needs_subsequent_visit: 'true',
      subsequent_visit_date: getDate(10),
      needs_missed_home_visit_follow_up: 'false',
      visited_contact_uuid: 'household_id'
    });

    const taskTime = result.report.fields.mental_health_follow_up_date;
    await harness.setNow(taskTime);

    const followUpTask = await harness.getTasks({ title: TASKS.pnc_mother_danger_signs });
    expect(followUpTask).to.have.property('length', 1);


    const day1FollowUp = await harness.loadAction(followUpTask[0], ...referralFollowUpScenarios.availableAndVisited);
    expect(day1FollowUp.errors).to.be.empty;
    const followUpTaskFinal = await harness.getTasks({ title: TASKS.pnc_mother_danger_signs });
    expect(followUpTaskFinal).to.have.property('length', 0);

  });

  it('newborn not upto date immunization should trigger follow up', async () => {
    const result = await harness.fillForm(Services.POSTNATAL_CARE, ...postnatalServiceScenarios.notUpdatedImmunization(7));
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_danger_signs_follow_up: 'false',
      needs_pnc_update_follow_up: 'false',
      needs_mental_health_follow_up: 'false',
      needs_subsequent_visit: 'true',
      subsequent_visit_date: getDate(10),
      needs_missed_home_visit_follow_up: 'false',
      visited_contact_uuid: 'household_id'
    });
    expect(result.additionalDocs[0]).to.include({
      needs_newborn_danger_signs_follow_up: 'false',
      needs_immunization_follow_up: 'true',
      immunization_follow_up_date: getDate(3)
    });

    const taskTime = result.additionalDocs[0].immunization_follow_up_date;
    await harness.setNow(taskTime);

    const followUpTask = await harness.getTasks({ title: TASKS.pnc_newborn_immunization });
    expect(followUpTask).to.have.property('length', 1);

    const day1FollowUp = await harness.loadAction(followUpTask[0], ...referralFollowUpScenarios.availableAndVisited);
    expect(day1FollowUp.errors).to.be.empty;
    const followUpTaskFinal = await harness.getTasks({ title: TASKS.pnc_newborn_immunization });
    expect(followUpTaskFinal).to.have.property('length', 0);
  });

  it('mother died, but child alive should end follow ups for mother and continue for baby', async () => {
    const result = await harness.fillForm(Services.POSTNATAL_CARE, ...postnatalServiceScenarios.deliveredDeadChildAlive());
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      'group_pnc_visit.condition_of_the_mother': 'dead',
      neonatal_deaths: '0',
      needs_danger_signs_follow_up: 'false',
      needs_pnc_update_follow_up: 'false',
      needs_mental_health_follow_up: 'false',
      needs_subsequent_visit: 'false',
      needs_missed_home_visit_follow_up: 'false',
      is_in_postnatal_care: 'yes',
      visited_contact_uuid: 'household_id'
    });

    const taskTime = getDate(3);
    await harness.setNow(taskTime);

    const followUpTask = await harness.getTasks({ title: TASKS.pnc_mother_danger_signs });
    expect(followUpTask).to.have.property('length', 0);
  });

  // fixes https://github.com/moh-kenya/config-echis-2.0/issues/842
  it('Fixes #842: hide pregnancy and delivery sections in subsequent home visit action', async () => {
    const babyNames = ['baby first one', 'baby second one'];
    let result = await harness.fillForm(Services.POSTNATAL_CARE,
      ...postnatalServiceScenarios.deliveredMultipleAndWell(
        DateTime.now().minus({ days: 1 }).toISODate(),
        babyNames,
        DateTime.now().plus({ days: 7 }).toISODate())
    );
    expect(result.errors).to.be.empty;
    const childDocIds = result.additionalDocs.map((doc) => doc.child_doc);

    harness.content.source = 'contact';
    result = await harness.fillForm(Services.POSTNATAL_CARE, ...postnatalServiceScenarios.subsequentVisitContact(babyNames));
    expect(result.errors).to.be.empty;

    expect(result.report.fields.group_newborn_danger_signs_assessment.newborn_assessment_count).to.eq(`${babyNames.length}`);
    expect(result.report.fields.group_newborn_danger_signs_assessment.newborn_assessment.map(doc => doc.child_doc)).to.deep.eq(childDocIds);
  });

  it('Fixes #842: subsequent home visit assesses only live babies', async () => {
    let result = await harness.fillForm(Services.POSTNATAL_CARE,
      ['yes'],
      ['alive', DateTime.now().minus({ days: 1 }).toISODate(), 'health_facility'],
      [2, 1],
      ['none', 'yes', DateTime.now().plus({ days: 7 }).toISODate(), 'no', 'no'],
      ['hello', 'middle', 'world', 'female', 'yes', '8', 'other', 'grandchild', 'no', 'none', 'none', 'no', 'immunization', 'yes'],
      ['none', 'none'],
      ['yes', 'nhif']
    );
    expect(result.errors).to.be.empty;
    const childDocIds = result.additionalDocs.map((doc) => doc.child_doc);

    harness.content.source = 'contact';
    result = await harness.fillForm(Services.POSTNATAL_CARE, ...postnatalServiceScenarios.subsequentVisitContact());
    expect(result.errors).to.be.empty;

    expect(result.report.fields.group_newborn_danger_signs_assessment.newborn_assessment_count).to.eq('1');
    expect(result.report.fields.group_newborn_danger_signs_assessment.newborn_assessment.map(doc => doc.child_doc)).to.deep.eq(childDocIds);
  });

  it('test newborn hierarchy', async () => {
    const result = await harness.fillForm(Services.POSTNATAL_CARE, ...postnatalServiceScenarios.deliveredAndWell(getDate(-5), getDate(5)));
    expect(result.errors).to.be.empty;
    const childDoc = result.additionalDocs[0];
    // values dependent on what is passed to TestHarness harnessDataPath, default is harness.default.json
    const household = childDoc.parent;
    expect(household._id).to.equal('household_id');
    const chvArea = household.parent;
    expect(chvArea._id).to.equal('chv_area_id');
    const chu = chvArea.parent;
    expect(chu._id).to.equal('chu_id');
    const subcounty = chu.parent;
    expect(subcounty._id).to.equal('sub_county_id');
    const county = subcounty.parent;
    expect(county._id).to.equal('county_id');
  });

  it('test newborn fields', async () => {
    let result = await harness.fillContactCreateForm(Persons.CLIENT, ...personRegistrationScenarios.default(DateTime.now().minus({ years: 20 }).toISODate()));
    expect(result.errors).to.be.empty;
    harness.subject = result.contacts[0];
    result = await harness.fillForm(Services.POSTNATAL_CARE, ...postnatalServiceScenarios.deliveredAndWell(getDate(-5), getDate(5)));
    expect(result.errors).to.be.empty;

    const childDoc = result.additionalDocs[0];
    expect(hasClientRegistryFields(childDoc)).to.be.false;
    // this is what we still need to revise
    childDoc.identification_type = 'birth_certificate';
    childDoc.identification_number = '234847872847';
    expect(hasClientRegistryFields(childDoc)).to.be.true;
  });

  it('validate referral data', async () => {
    harness.subject.upi = 'test_upi';
    const result = await harness.fillForm(Services.POSTNATAL_CARE, ...postnatalServiceScenarios.pncMotherDangerSigns(7));
    expect(result.errors).to.be.empty;
    expect(result.report.fields.data).to.deep.include({
      '_upi': 'test_upi',
      '_patient_name': 'Test Client'
    });
    expect(result.report.fields.data._screening).to.deep.include({
      _mother_danger_signs: 'fever',
      _mother_danger_signs_other: '',
      _mental_danger_signs: 'none',
      _observed_mental_danger_signs: 'none'
    });
    expect(result.report.fields.data._supporting_info).to.deep.include({
      _has_pnc_up_to_date: 'yes',
      _has_started_family_planning: 'no',
    });
  });

});
