const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { Targets, Persons } = require('../../common-extras');
const { personRegistrationScenarios } = require('../forms-inputs');
const { DateTime } = require('luxon');

describe('Target: Population Under 5', () => {
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

  it('default count', async () => {
    const [under5Target] = await harness.getTargets({ type: Targets.UNDER_5_POPULATION });
    expect(under5Target).to.nested.include({ 'value.pass': 0, 'value.total': 0 });
  });

  it('should count male children under 5', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ years: 3 }).toISODate();
    harness.subject.sex = 'male';

    const [under1Target] = await harness.getTargets({ type: Targets.UNDER_5_POPULATION });
    expect(under1Target).to.nested.include({ 'value.pass': 1, 'value.total': 1 });
  });

  it('should count a living unmuted under 5 household member', async () => {
    const result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.over1Under5Yr(DateTime.now().minus({ year: 2 }).toISODate()));
    expect(result.errors).to.be.empty;

    const [under5Target] = await harness.getTargets({ type: Targets.UNDER_5_POPULATION });
    expect(under5Target).to.nested.include({ 'value.pass': 1, 'value.total': 1 });
  });

  it('should update count when under 5 household member is muted', async () => {
    const children = [];
    const inputs = [
      personRegistrationScenarios.under6Month(DateTime.now().minus({ month: 2 }).toISODate()),
      personRegistrationScenarios.under1(DateTime.now().minus({ month: 7 }).toISODate()),
      personRegistrationScenarios.over1Under5Yr(DateTime.now().minus({ year: 3 }).toISODate())
    ];
    for (let i = 0; i < inputs.length; i++) {
      const result = await harness.fillContactCreateForm(Persons.CLIENT, ...inputs[i]);
      expect(result.errors, i).to.be.empty;
      children.push(result.contacts[0]);
    }

    let count = children.length;
    let [under5Target] = await harness.getTargets({ type: Targets.UNDER_5_POPULATION });
    expect(under5Target).to.nested.include({ 'value.pass': count, 'value.total': count });

    do {
      const child = children.pop();
      child.muted = DateTime.now().toISODate();
      [under5Target] = await harness.getTargets({ type: Targets.UNDER_5_POPULATION });
      expect(under5Target).to.nested.include({ 'value.pass': count - 1, 'value.total': count - 1 });
      count--;
    } while (count > 0);
  });

  it('should update count when under 1 hosuehold member has death confirmed', async () => {
    const children = [];
    const inputs = [
      personRegistrationScenarios.under6Month(DateTime.now().minus({ month: 2 }).toISODate()),
      personRegistrationScenarios.under1(DateTime.now().minus({ month: 7 }).toISODate()),
      personRegistrationScenarios.over1Under5Yr(DateTime.now().minus({ year: 3 }).toISODate())
    ];
    for (let i = 0; i < inputs.length; i++) {
      const result = await harness.fillContactForm(Persons.CLIENT, ...inputs[i]);
      expect(result.errors, i).to.be.empty;
      children.push(result.contacts[0]);
    }

    let count = children.length;
    let [under5Target] = await harness.getTargets({ type: Targets.UNDER_5_POPULATION });
    expect(under5Target).to.nested.include({ 'value.pass': count, 'value.total': count });

    do {
      const child = children.pop();
      child.date_of_death = DateTime.now().toISODate();
      [under5Target] = await harness.getTargets({ type: Targets.UNDER_5_POPULATION });
      expect(under5Target).to.nested.include({ 'value.pass': count - 1, 'value.total': count - 1 });
      count--;
    } while (count > 0);
  });

});
