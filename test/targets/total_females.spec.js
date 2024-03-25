const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { Targets, Persons } = require('../../common-extras');
const { personRegistrationScenarios, getDate, DateTime } = require('../forms-inputs');

describe('Total females', () => {
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

  it('should count a living unmuted female hosuehold member', async () => {
    harness.subject.sex = 'female';
    let analytics = await harness.getTargets({ type: Targets.TOTAL_FEMALES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    await harness.fillContactCreateForm(Persons.CLIENT, ...personRegistrationScenarios.femaleOnFp(DateTime.now().minus({ years: 20 }).toISODate()));
    analytics = await harness.getTargets({ type: Targets.TOTAL_FEMALES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 2, 'value.total': 2 });
  });


  it('should not count male household members', async () => {
    harness.subject.sex = 'female';
    let analytics = await harness.getTargets({ type: Targets.TOTAL_FEMALES });
    expect(analytics).to.have.property('length', 1);
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    await harness.fillContactEditForm(Persons.CLIENT, ...personRegistrationScenarios.man(DateTime.now().minus({ years: 20 }).toISODate()));
    analytics = await harness.getTargets({ type: Targets.TOTAL_FEMALES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });
  });

  it('should not count a muted female household member', async () => {
    harness.subject.sex = 'female';
    let analytics = await harness.getTargets({ type: Targets.TOTAL_FEMALES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    harness.subject.muted = getDate(-1);
    analytics = await harness.getTargets({ type: Targets.TOTAL_FEMALES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.total': 0 });
  });

  it('should not count a deceased female household member', async () => {
    harness.subject.sex = 'female';
    let analytics = await harness.getTargets({ type: Targets.TOTAL_FEMALES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    harness.subject.date_of_death = getDate(-1);
    analytics = await harness.getTargets({ type: Targets.TOTAL_FEMALES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.total': 0 });
  });
});
