const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { socioEconomicSurveyScenarios } = require('../forms-inputs');
const { Services, DateTime } = require('../../common-extras');

describe('Socio Economic Survey Form (Household Member)', () => {
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

  it('should successfully create a socio-economic survey report', async () => {
    harness.subject.date_of_birth = DateTime.local().minus({ years: 10 }).toISODate();
    let result = await harness.fillForm(Services.SOCIO_ECONOMIC_SURVEY_PERSON, ...socioEconomicSurveyScenarios.personUnder14(DateTime.local().minus({ years: 10 }).toISODate()));
    expect(result.errors).to.be.empty;

    // flush 9 years and complete a survey
    await harness.flush({ years: 9 });
    result = await harness.fillForm(Services.SOCIO_ECONOMIC_SURVEY_PERSON, ...socioEconomicSurveyScenarios.personOver14(DateTime.local().minus({ years: 19 }).toISODate()));
    expect(result.errors).to.be.empty;
  });
});

describe('Socio Economic Survey Form (Household)', () => {
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

  it('should successfully create a socio-economic survey report', async () => {
    harness.subject = 'household_id';
    const result = await harness.fillForm(Services.SOCIO_ECONOMIC_SURVEY, ...socioEconomicSurveyScenarios.household);
    expect(result.errors).to.be.empty;
  });

  it('should give error if socio-economic survey report village field is filled with number', async () => {
    harness.subject = 'household_id';
    const result = await harness.fillForm(Services.SOCIO_ECONOMIC_SURVEY, ...socioEconomicSurveyScenarios.householdVillageNameError);
    expect(result.errors[0]).to.deep.include({
      type: 'validation',
      question: 'Village*\nThis field is text only',
      msg: 'This field is text only'
    });
  });

  it('should give error if socio-economic survey report name of programme field is filled with non-alphanumeric characters', async () => {
    harness.subject = 'household_id';
    const result = await harness.fillForm(Services.SOCIO_ECONOMIC_SURVEY, ...socioEconomicSurveyScenarios.householdProgrammeNameError);
    expect(result.errors[0]).to.deep.include({
      type: 'validation',
      question: 'Name of the programme(s)*\nThis field can only have letters and numbers',
      msg: 'This field can only have letters and numbers'
    });
  });
});
