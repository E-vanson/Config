const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { TASKS, Persons, clientRegistryFields, Services } = require('../../common-extras');
const { personRegistrationScenarios } = require('../forms-inputs');
const { DateTime } = require('luxon');

describe('Update Contact CR fields Task/Card', () => {
  before(async () => {
    return await harness.start();
  });
  after(async () => {
    return await harness.stop();
  });
  beforeEach(async () => {
    await harness.setNow(DateTime.local().startOf('month').toJSDate());
    await harness.clear();
  });
  afterEach(() => {
    expect(harness.consoleErrors).to.be.empty;
  });

  it(`should not show task after registration with client registry fields`, async () => {
    const result = await harness.fillContactCreateForm(Persons.CLIENT, personRegistrationScenarios.foreigner(DateTime.now().minus({ year: 20 }).toISODate()));
    expect(result.errors).to.be.empty;
    harness.subject = result.contacts[0];
    const tasks = await harness.getTasks({ title: TASKS.hh_update_member_cr, ownedBySubject: true });
    expect(tasks).to.have.property('length', 0);
  });

  clientRegistryFields.forEach(field => {
    it(`show task if missing ${field} field`, async () => {
      const result = await harness.fillContactCreateForm(Persons.CLIENT, personRegistrationScenarios.foreigner(DateTime.now().minus({ year: 20 }).toISODate()));
      expect(result.errors).to.be.empty;

      harness.subject = result.contacts[0];
      harness.subject[field] = '';

      // fast foward to end month
      await harness.setNow(DateTime.local().startOf('month').plus({ months: 1 }).toJSDate());
      let tasks = await harness.getTasks({ title: TASKS.hh_update_member_cr, ownedBySubject: true });
      expect(tasks).to.have.property('length', 1);

      harness.subject[field] = 'val';
      tasks = await harness.getTasks({ title: TASKS.hh_update_member_cr, ownedBySubject: true });
      expect(tasks).to.have.property('length', 0);
    });
  });

  it(`show task when we get a client mismatch report`, async () => {
    const result = await harness.fillContactCreateForm(Persons.CLIENT, personRegistrationScenarios.foreigner(DateTime.now().minus({ year: 20 }).toISODate()));
    expect(result.errors).to.be.empty;
    harness.subject = result.contacts[0]._id;
    harness.pushMockedDoc({
      _id: '1',
      type: 'data_record',
      form: Services.CLIENT_DETAILS_MISMATCH,
      reported_date: DateTime.now().toMillis(),
      fields: {
        patient_id: result.contacts[0]._id,
        patient_uuid: result.contacts[0]._id,
        mismatched_fields: 'firstName middleName lastName contact.primaryPhone',
        source: 'Client Registry'
      }
    });
    // fast foward to end month
    await harness.setNow(DateTime.local().startOf('month').plus({ months: 1 }).toJSDate());
    const tasks = await harness.getTasks({ title: TASKS.hh_update_member_cr, ownedBySubject: true });
    expect(tasks).to.have.property('length', 1);
  });

});
