const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { Targets, Persons } = require('../../common-extras');
const { personRegistrationScenarios } = require('../forms-inputs');
const { DateTime } = require('luxon');

describe('Target: Population Under 1', () => {
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

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  it('default count', async () => {
    const [under1Target] = await harness.getTargets({ type: Targets.UNDER_1_POPULATION });
    expect(under1Target).to.nested.include({ 'value.pass': 0, 'value.total': 0 });
  });

  it('should count male children under 1', async () => {
    harness.subject.date_of_birth = DateTime.now().minus({ month: 2 }).toISODate();
    harness.subject.sex = 'male';

    const [under1Target] = await harness.getTargets({ type: Targets.UNDER_1_POPULATION });
    expect(under1Target).to.nested.include({ 'value.pass': 1, 'value.total': 1 });
  });

  it('should count a living unmuted under 1 hosuehold member', async () => {
    const result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.under6Month(DateTime.now().minus({ month: 2 }).toISODate()));
    expect(result.errors).to.be.empty;

    const [under1Target] = await harness.getTargets({ type: Targets.UNDER_1_POPULATION });
    expect(under1Target).to.nested.include({ 'value.pass': 1, 'value.total': 1 });
  });

  it('should update count when under 1 hosuehold member is muted', async () => {
    let count = 0;
    const children = [];
    do {
      const ageInMonths = getRandomInt(1, 12);
      let input = null;
      if (ageInMonths < 6) {
        input = personRegistrationScenarios.under6Month(DateTime.now().minus({ month: ageInMonths }).toISODate());
      } else {
        input = personRegistrationScenarios.under1(DateTime.now().minus({ month: ageInMonths }).toISODate());
      }
      const result = await harness.fillContactCreateForm(Persons.CLIENT, ...input);
      expect(result.errors).to.be.empty;
      children.push(result.contacts[0]);
      count++;
    } while (count < 5);

    let [under1Target] = await harness.getTargets({ type: Targets.UNDER_1_POPULATION });
    expect(under1Target).to.nested.include({ 'value.pass': count, 'value.total': count });

    do {
      const child = children.pop();
      child.muted = DateTime.now().toISODate();
      [under1Target] = await harness.getTargets({ type: Targets.UNDER_1_POPULATION });
      expect(under1Target).to.nested.include({ 'value.pass': count - 1, 'value.total': count - 1 });
      count--;
    } while (count > 0);
  });

  it('should update count when under 1 hosuehold member has death confirmed', async () => {
    let count = 0;
    const children = [];
    do {
      const ageInMonths = getRandomInt(1, 12);
      let input = null;
      if (ageInMonths < 6) {
        input = personRegistrationScenarios.under6Month(DateTime.now().minus({ month: ageInMonths }).toISODate());
      } else {
        input = personRegistrationScenarios.under1(DateTime.now().minus({ month: ageInMonths }).toISODate());
      }
      const result = await harness.fillContactForm(Persons.CLIENT, ...input);
      expect(result.errors).to.be.empty;
      children.push(result.contacts[0]);
      count++;
    } while (count < 5);

    let [under1Target] = await harness.getTargets({ type: Targets.UNDER_1_POPULATION });
    expect(under1Target).to.nested.include({ 'value.pass': count, 'value.total': count });

    do {
      const child = children.pop();
      child.date_of_death = DateTime.now().toISODate();
      [under1Target] = await harness.getTargets({ type: Targets.UNDER_1_POPULATION });
      expect(under1Target).to.nested.include({ 'value.pass': count - 1, 'value.total': count - 1 });
      count--;
    } while (count > 0);
  });

});
