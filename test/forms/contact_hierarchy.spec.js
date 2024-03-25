const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { placeScenarios, householdRegistrationScenarios, personRegistrationScenarios, DateTime } = require('../forms-inputs');
const { Places, Persons, Services } = require('../../common-extras');

describe('County contact', () => {
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

  it('county create - with focal person', async () => {
    const result = await harness.fillContactForm(Places.COUNTY, ...placeScenarios.withFocalPerson);
    expect(result.errors).to.be.empty;
    const place = result.contacts.filter((contact) => contact.contact_type === Places.COUNTY);
    expect(place).to.have.lengthOf(1);
    const placeContacts = result.contacts.filter((contact) => contact.type === Persons.USER);
    expect(placeContacts).to.have.lengthOf(1);
    expect(place[0].contact._id).equal(placeContacts[0]._id);
  });

  it('county create - without focal person', async () => {
    const result = await harness.fillContactForm(Places.COUNTY, ...placeScenarios.withoutFocalPerson);
    expect(result.errors).to.be.empty;
    const place = result.contacts.filter((contact) => contact.contact_type === Places.COUNTY);
    expect(place).to.have.lengthOf(1);
    const placeContacts = result.contacts.filter((contact) => contact.type === Persons.USER);
    expect(placeContacts).to.have.lengthOf(0);
  });
});

describe('Sub County contact', () => {
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

  it('sub-county create - with focal person', async () => {
    const result = await harness.fillContactForm(Places.SUB_COUNTY, ...placeScenarios.withFocalPerson);
    expect(result.errors).to.be.empty;
    const place = result.contacts.filter((contact) => contact.contact_type === Places.SUB_COUNTY);
    expect(place).to.have.lengthOf(1);
    const placeContacts = result.contacts.filter((contact) => contact.type === Persons.USER);
    expect(placeContacts).to.have.lengthOf(1);
    expect(place[0].contact._id).equal(placeContacts[0]._id);
  });

  it('sub-county create - without focal person', async () => {
    const result = await harness.fillContactForm(Places.SUB_COUNTY, ...placeScenarios.withoutFocalPerson);
    expect(result.errors).to.be.empty;
    const place = result.contacts.filter((contact) => contact.contact_type === Places.SUB_COUNTY);
    expect(place).to.have.lengthOf(1);
    const placeContacts = result.contacts.filter((contact) => contact.type === Persons.USER);
    expect(placeContacts).to.have.lengthOf(0);
  });
});

describe('CHU contacts', () => {
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

  it('CHU create - with focal person', async () => {
    const result = await harness.fillContactForm(Places.CHU, ...placeScenarios.chuWithFocalPerson);
    expect(result.errors).to.be.empty;
    const place = result.contacts.filter((contact) => contact.contact_type === Places.CHU);
    expect(place).to.have.lengthOf(1);
    const placeContacts = result.contacts.filter((contact) => contact.type === Persons.USER);
    expect(placeContacts).to.have.lengthOf(1);
    expect(place[0].contact._id).equal(placeContacts[0]._id);
  });

  it('CHU create - without focal person', async () => {
    const result = await harness.fillContactForm(Places.CHU, ...placeScenarios.chuWithoutFocalPerson);
    expect(result.errors).to.be.empty;
    const place = result.contacts.filter((contact) => contact.contact_type === Places.CHU);
    expect(place).to.have.lengthOf(1);
    const placeContacts = result.contacts.filter((contact) => contact.type === Persons.USER);
    expect(placeContacts).to.have.lengthOf(0);
  });
});

describe('CHV Area contacts', () => {
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

  it('CHV Area create - with focal person', async () => {
    const result = await harness.fillContactForm(Places.CHV_AREA, ...placeScenarios.chvWithFocalPerson);
    expect(result.errors).to.be.empty;
    const place = result.contacts.filter((contact) => contact.contact_type === Places.CHV_AREA);
    expect(place).to.have.lengthOf(1);
    const placeContacts = result.contacts.filter((contact) => contact.type === Persons.USER);
    expect(placeContacts).to.have.lengthOf(1);
    expect(place[0].contact._id).equal(placeContacts[0]._id);
  });

  it('CHV Area create - without focal person', async () => {
    const result = await harness.fillContactForm(Places.CHV_AREA, ...placeScenarios.chvWithoutFocalPerson);
    expect(result.errors).to.be.empty;
    const place = result.contacts.filter((contact) => contact.contact_type === Places.CHV_AREA);
    expect(place).to.have.lengthOf(1);
    const placeContacts = result.contacts.filter((contact) => contact.type === Persons.USER);
    expect(placeContacts).to.have.lengthOf(0);
  });

  it('CHV Area create - use focal person name', async () => {
    const result = await harness.fillContactForm(Places.CHV_AREA, ...placeScenarios.chvUseFocalPersonName);
    expect(result.errors).to.be.empty;
    const place = result.contacts.filter((contact) => contact.contact_type === Places.CHV_AREA);
    expect(place).to.have.lengthOf(1);
    //@TODO, the translation doesn't seem to work correctly on the current version of test harness,
    // uncomment once we upgrade cht-conf-test-harness
    //expect(place[0]).to.nested.include({ name: `Demo Focal Person's Area` });
    const placeContacts = result.contacts.filter((contact) => contact.type === Persons.USER);
    expect(placeContacts).to.have.lengthOf(1);
  });

  it('CHV Area create - Expect CHU code to have six numeric characters and link facility to have 5 numeric characters', async () => {
    const result = await harness.fillContactForm(Places.CHV_AREA, ...placeScenarios.chvUseFocalPersonName);
    expect(result.errors).to.be.empty;
    const place = result.contacts.filter((contact) => contact.contact_type === Places.CHV_AREA);
    expect(place).to.have.lengthOf(1);
    //@TODO, the translation doesn't seem to work correctly on the current version of test harness,
    // uncomment once we upgrade cht-conf-test-harness
    //expect(place[0]).to.nested.include({ name: `Demo Focal Person's Area` });
    const placeContacts = result.contacts.filter((contact) => contact.type === Persons.USER);
    expect(placeContacts).to.have.lengthOf(1);
  });

  it('CHV Area create - CHU code to have any other numeric characters apart from six', async () => {
    const result = await harness.fillContactForm(Places.CHV_AREA, ...placeScenarios.chvWithWrongChuCode);
    const expectedError = [{
      type: 'validation',
      question: 'Community Unit Code*\nmust be 6 numeric characters',
      msg: 'must be 6 numeric characters'
    }];
    expect(result.errors).to.not.be.empty;
    expect(result.errors).to.not.deep.include(expectedError);
  });

  it('CHV Area create - Link facility code to have any other numeric characters apart from five', async () => {
    const result = await harness.fillContactForm(Places.CHV_AREA, ...placeScenarios.chvWithWrongLinkFacilityCode);
    const expectedError = [{
      type: 'validation',
      question: 'Link Facility Code*\nmust be 5 numeric characters',
      msg: 'must be 5 numeric characters'
    }];
    expect(result.errors).to.not.be.empty;
    expect(result.errors).to.not.deep.include(expectedError);
  });
});

describe('Household contacts', () => {
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

  it('Household create without any other members does not trigger a reminder task', async () => {
    const result = await harness.fillContactCreateForm(Places.HOUSEHOLD, ...householdRegistrationScenarios.default);
    expect(result.errors).to.be.empty;
    expect(result.contacts).to.have.lengthOf(2);
    expect(result.contacts.some((contact) => contact.contact_type === Persons.CLIENT)).to.be.true;
    expect(result.contacts.some((contact) => contact.contact_type === Places.HOUSEHOLD)).to.be.true;
    const tasks = await harness.getTasks({ title: 'task.household_member_registration_reminder' });
    expect(tasks).to.have.lengthOf(0);
  });

  it('Household create without any other members and approx dob', async () => {
    const age = 30;
    const result = await harness.fillContactForm(Places.HOUSEHOLD, ...householdRegistrationScenarios.default_with_approx_dob(age));
    expect(result.errors).to.be.empty;
    expect(result.contacts).to.have.lengthOf(2);
    expect(result.contacts.some((contact) => contact.contact_type === Persons.CLIENT)).to.be.true;
    expect(result.contacts.some((contact) => contact.contact_type === Places.HOUSEHOLD)).to.be.true;
    const tasks = await harness.getTasks({ title: 'task.household_member_registration_reminder' });
    expect(tasks).to.have.lengthOf(0);
    expect(result.contacts.find((contact) => contact.contact_type === Persons.CLIENT).date_of_birth).to.be.equal(DateTime.now().minus({ year: age }).toISODate());
  });

  it('Household create with other members not present triggers a reminder task', async () => {
    const result = await harness.fillContactForm(Places.HOUSEHOLD, ...householdRegistrationScenarios.registerLater);
    expect(result.errors).to.be.empty;
    const tasks = await harness.getTasks({ title: 'task.household_member_registration_reminder' });
    expect(tasks).to.have.lengthOf(1);
  });

  it('Household create with members', async () => {
    const hhHeadPhone = '+254712323423';
    const result = await harness.fillContactCreateForm(Places.HOUSEHOLD, ...householdRegistrationScenarios.withMembers(hhHeadPhone));
    expect(result.errors).to.be.empty;
    expect(result.contacts).to.have.lengthOf(3);
    expect(result.contacts.filter((contact) => contact.contact_type === Persons.CLIENT).length === 2).to.be.true;
    const baby = result.contacts.find((contact) => contact.contact_type === Persons.CLIENT && contact.first_name === 'Baby');
    expect(baby.phone).to.be.eq(hhHeadPhone);
    expect(result.contacts.some((contact) => contact.contact_type === Places.HOUSEHOLD)).to.be.true;

    const tasks = await harness.getTasks({ title: 'task.household_member_registration_reminder' });
    expect(tasks).to.have.lengthOf(0);
  });

  it('Add members using create form', async () => {
    const result = await harness.fillContactCreateForm(Persons.CLIENT, ...personRegistrationScenarios.default(DateTime.now().minus({ years: 18 }).toISODate()));
    expect(result.errors).to.be.empty;
    expect(result.contacts).to.have.lengthOf(1);
    expect(result.contacts.filter((contact) => contact.contact_type === Persons.CLIENT).length === 1).to.be.true;
  });

  it('Add members using create form with approx dob', async () => {
    const age = 60;
    const result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.elderly(age));
    expect(result.errors).to.be.empty;
    expect(result.contacts).to.have.lengthOf(1);
    expect(result.contacts.filter((contact) => contact.contact_type === Persons.CLIENT).length === 1).to.be.true;
    expect(result.contacts.find((contact) => contact.contact_type === Persons.CLIENT).date_of_birth).to.be.equal(DateTime.now().minus({ year: age }).toISODate());
  });

  it('Add members using household member registration reminder form', async () => {
    const result = await harness.fillForm(Services.HOUSEHOLD_MEMBER_REGISTRATION_REMINDER, ...personRegistrationScenarios.withMembers(18));
    expect(result.errors).to.be.empty;
    expect(result.additionalDocs).to.have.lengthOf(2);
    expect(result.additionalDocs.filter((contact) => contact.contact_type === Persons.CLIENT).length === 2).to.be.true;
  });
});
