const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { Targets, Persons } = require('../../common-extras');
const { personRegistrationScenarios, getDate, DateTime } = require('../forms-inputs');

describe('Total males', () => {
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

  it('should count a living unmuted male hosuehold member', async () => {
    let analytics = await harness.getTargets({ type: Targets.TOTAL_MALES });
    expect(analytics).to.have.property('length', 1);
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.total': 0 });

    harness.subject.sex = 'male';
    analytics = await harness.getTargets({ type: Targets.TOTAL_MALES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });
  });

  it('should not count a female household member', async () => {
    let analytics = await harness.getTargets({ type: Targets.TOTAL_MALES });
    expect(analytics).to.have.property('length', 1);
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.total': 0 });

    await harness.fillContactCreateForm(Persons.CLIENT, ...personRegistrationScenarios.default(DateTime.now().minus({ years: 20 }).toISODate()));
    analytics = await harness.getTargets({ type: Targets.TOTAL_MALES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.total': 0 });
  });

  it('should not count a muted male household member', async () => {
    harness.subject.sex = 'male';
    let analytics = await harness.getTargets({ type: Targets.TOTAL_MALES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    harness.subject.muted = getDate(-1);
    analytics = await harness.getTargets({ type: Targets.TOTAL_MALES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.total': 0 });
  });

  it('should not count a deceased male household member', async () => {
    harness.subject.sex = 'male';
    let analytics = await harness.getTargets({ type: Targets.TOTAL_MALES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 1, 'value.total': 1 });

    harness.subject.date_of_death = getDate(-1);
    analytics = await harness.getTargets({ type: Targets.TOTAL_MALES });
    expect(analytics[0]).to.nested.include({ 'value.pass': 0, 'value.total': 0 });
  });
});
