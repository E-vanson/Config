const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness({ subject: 'patient_id' });

const { familyPlanningScenarios } = require('../forms-inputs');
const { Services } = require('../../common-extras');

describe('Family Planning Form Tests', () => {
  before(async () => {
    return await harness.start();
  });
  after(async () => {
    return await harness.stop();
  });
  beforeEach(async () => {
    await harness.clear();
  });

  const applicableSex = ['female', 'intersex'];
  harness.subject.sex = applicableSex[Math.floor(Math.random() * applicableSex.length)];
  [
    {
      input: familyPlanningScenarios.isPregnant,
      description: 'pregnant',
      calculateFields: {
        has_fp_follow_up: 'no',
        is_referral: 'no',
        coalesced_fp_method: '',
        visited_contact_uuid: 'household_id'
      },
      contextFields: {
        fp_method: undefined,
        on_fp: false
      }
    },
    {
      input: familyPlanningScenarios.notPregnant,
      description: 'not pregnant',
      calculateFields: {
        has_fp_follow_up: 'no',
        is_referral: 'yes',
        coalesced_fp_method: '',
        visited_contact_uuid: 'household_id'
      },
      contextFields: {
        fp_method: undefined,
        on_fp: false
      }
    },
    {
      input: familyPlanningScenarios.hasSideEffects,
      description: 'has side effects',
      calculateFields: {
        has_fp_follow_up: 'no',
        is_referral: 'yes',
        coalesced_fp_method: 'injectables',
        visited_contact_uuid: 'household_id'
      },
      contextFields: {
        fp_method: 'injectables',
        on_fp: true
      }
    },
    {
      input: familyPlanningScenarios.noSideEffects,
      description: 'has no side effects',
      calculateFields: {
        has_fp_follow_up: 'no',
        is_referral: 'no',
        coalesced_fp_method: 'injectables',
        visited_contact_uuid: 'household_id'
      },
      contextFields: {
        fp_method: 'injectables',
        on_fp: true
      }
    },
    {
      input: familyPlanningScenarios.refillableFp(),
      description: 'for refillable methods',
      calculateFields: {
        has_fp_follow_up: 'yes',
        is_referral: 'no',
        coalesced_fp_method: 'cocs',
        visited_contact_uuid: 'household_id'
      },
      contextFields: {
        fp_method: 'cocs',
        on_fp: true
      }
    }
  ].forEach(scenario => it(`family planning form filled and successfully saved if ${scenario.description}`, async () => {
    const result = await harness.fillForm(Services.FAMILY_PLANNING, ...scenario.input);
    expect(result.errors).to.be.empty;

    Object.entries(scenario.calculateFields).forEach(([field, value]) => {
      expect(result.report.fields).to.have.property(field, value);
    });

    const summary = await harness.getContactSummary();
    Object.entries(scenario.contextFields).forEach(([field, value]) => {
      expect(summary.context).to.have.property(field, value);
    });
  }));


  Object.entries({
    past: -10,
    today: 0
  }).forEach(([time, numDays]) => it(`should throw validation error if next appointment date is ${time}`, async () => {
    const result = await harness.fillForm(Services.FAMILY_PLANNING, ...familyPlanningScenarios.refillableFp('cocs', numDays));
    expect(result.errors.length).to.be.eql(1);
    expect(result.errors[0]).to.have.property('type', 'validation');
    expect(result.errors[0]).to.have.property('question').that.includes('next appointment');
  }));

  [
    {
      input: familyPlanningScenarios.refillableFp('cocs', 10, -1),
      description: 'less than 0',
      metric: 'cycles'
    },
    {
      input: familyPlanningScenarios.refillableFp('cocs', 10, 0),
      description: '0',
      metric: 'cycles'
    },
    {
      input: familyPlanningScenarios.refillableFp('condoms', 10, -1),
      description: 'less than 0',
      metric: 'pieces'
    },
    {
      input: familyPlanningScenarios.refillableFp('condoms', 10, 0),
      description: '0',
      metric: 'pieces'
    }
  ].forEach(scenario => it(`should throw validation error for ${scenario.description} ${scenario.metric}`, async () => {
    const result = await harness.fillForm(Services.FAMILY_PLANNING, ...scenario.input);
    expect(result.errors.length).to.be.eql(1);
    expect(result.errors[0]).to.have.property('type', 'validation');
    expect(result.errors[0]).to.have.property('question').that.includes(`How many ${scenario.metric}`);
  }));

  it(`should load fp form with family planning information on contact summary context`, async () => {
    const initialFpSubmission = await harness.fillForm(Services.FAMILY_PLANNING, ...familyPlanningScenarios.refillableFp());
    expect(initialFpSubmission.errors).to.be.empty;

    const subsequentSubmission = await harness.fillForm(Services.FAMILY_PLANNING, ...familyPlanningScenarios.cocsSubsequentVisit);
    expect(subsequentSubmission.errors).to.be.empty;
    expect(subsequentSubmission.report.fields).to.include({
      current_fp_method: 'cocs',
      already_on_fp: 'true',
      coalesced_fp_method: 'cocs',
      visited_contact_uuid: 'household_id'
    });
  });

  [
    'male',
    'intersex'
  ].forEach(scenario => it(`should submit report successfully for ${scenario} contacts on vasectomy`, async () => {
    harness.subject.sex = scenario;
    const result = await harness.fillForm(Services.FAMILY_PLANNING, ...familyPlanningScenarios.vasectomy);
    expect(result.errors).to.be.empty;
  }));

  [
    {
      input: familyPlanningScenarios.vasectomy,
      sex: 'female'
    },
    {
      input: familyPlanningScenarios.tubalLigation,
      sex: 'male'
    }
  ].forEach(scenario => it(`should throw validation error for ${scenario.sex} with invalid fp method`, async () => {
    harness.subject.sex = scenario.sex;
    const result = await harness.fillForm(Services.FAMILY_PLANNING, ...scenario.input);
    expect(result.errors.length).to.be.eql(1);
    expect(result.errors[0]).to.have.property('type', 'validation');
    expect(result.errors[0]).to.have.property('question').that.includes(`Which FP method`);
  }));

});
