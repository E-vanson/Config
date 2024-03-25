const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-things'));

const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { DateTime } = require('luxon');
const { deathScenarios } = require('../forms-inputs');
const { Services } = require('../../common-extras');

describe('Death service form', () => {
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

  it('should result in a death report with place of death = health_facility', async() => {
    // load and fill in the form
    const result = await harness.fillForm(Services.DEATH_REPORT, ...deathScenarios.healthFacility);
    expect(result.errors).to.be.empty;

    expect(result.report.fields).to.be.nested.include({
      'group_death.place_of_death': deathScenarios.healthFacility[0][0],
      visited_contact_uuid: 'household_id'
    });
  });

  it('should result in a death report with date of death and cause of death for male contact', async() => {
    harness.subject.sex = 'male';
    // load and fill in the form
    const result = await harness.fillForm(Services.DEATH_REPORT, ...deathScenarios.homeMale);
    expect(result.errors).to.be.empty;

    expect(result.report.fields).to.be.nested.include({
      'group_death.date_of_death': DateTime.fromISO(deathScenarios.homeMale[0][1]).toFormat('yyyy-MM-dd'),
      'group_death.probable_cause_of_death': deathScenarios.homeMale[0][2],
      visited_contact_uuid: 'household_id'
    });
  });

  [
    'sick',
    'suicide',
    'sudden_death',
    'unknown'
  ].forEach(reason => it(`should ask pregnancy questions for ${reason} as cause of death for female contact`, async() => {
    const result = await harness.fillForm(Services.DEATH_REPORT, ...deathScenarios.homeFemale(reason));
    expect(result.errors).to.be.empty;

    expect(result.report.fields).to.be.nested.include({
      'group_death.date_of_death': DateTime.fromISO(deathScenarios.homeFemale(reason)[0][1]).toFormat('yyyy-MM-dd'),
      'group_death.probable_cause_of_death': deathScenarios.homeFemale(reason)[0][2],
      visited_contact_uuid: 'household_id'
    });
  }));

  it('should not ask pregnancy questions if cause of death is accident', async() => {
    // load and fill in the form
    const result = await harness.fillForm(Services.DEATH_REPORT, ...deathScenarios.homeFemaleAccident);
    expect(result.errors).to.be.empty;

    expect(result.report.fields).to.be.nested.include({
      'group_death.date_of_death': DateTime.fromISO(deathScenarios.homeFemaleAccident[0][1]).toFormat('yyyy-MM-dd'),
      'group_death.probable_cause_of_death': deathScenarios.homeFemaleAccident[0][2],
      visited_contact_uuid: 'household_id'
    });
  });

  it('should not allow date of death to be in the future', async () => {
    harness.subject.sex = 'male';
    const result = await harness.fillForm(Services.DEATH_REPORT, ...deathScenarios.inTheFuture);
    expect(result.errors).to.be.an('array').with.lengthOf(1);
    expect(result.errors).to.deep.include.something.that.has.property('type','validation');
    expect(result.errors).to.deep.include.something.that.has.property('msg','Date of death can\'t be in the future.');
    expect(result.errors[0].question).to.match(/Date of death/i);
  });
});
