const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness({ subject: 'patient_id' });
const { pregnancyHomeVisitScenarios, getDate, subsequentPregnancyHomeVisitScenarios } = require('../forms-inputs');
const { Services } = require('../../common-extras');

describe('Pregnancy Home Visit Service Form Tests', () => {
  before(async () => {
    return await harness.start();
  });
  after(async () => {
    return await harness.stop();
  });
  beforeEach(async () => {
    await harness.clear();
  });

  [
    {
      input: pregnancyHomeVisitScenarios.onFp,
      description: 'is on family planning',
      calculateFields: {
        has_danger_signs: 'no',
        has_mental_danger_signs: 'no',
        is_pregnancy_referral: 'no',
        is_referral_case: 'no',
        is_perinatal_death: 'no',
        was_available: 'yes',
        marked_as_pregnant: 'false',
        is_upcoming_pregnancy_home_visit: 'no',
        is_anc_defaulter: 'false'
      },
      contextFields: {
        is_pregnant: false,
        edd: undefined
      }
    },
    {
      input: pregnancyHomeVisitScenarios.isPregnant(),
      description: 'is pregnant',
      calculateFields: {
        has_danger_signs: 'no',
        has_mental_danger_signs: 'no',
        is_pregnancy_referral: 'no',
        is_referral_case: 'no',
        is_perinatal_death: 'no',
        was_available: 'yes',
        marked_as_pregnant: 'true',
        is_upcoming_pregnancy_home_visit: 'yes',
        is_anc_defaulter: 'false'
      },
      contextFields: {
        is_pregnant: true,
        edd: getDate(100)
      }
    },
    {
      input: pregnancyHomeVisitScenarios.lmpLt30Days,
      description: 'lmp is less than 30 days ago',
      calculateFields: {
        has_danger_signs: 'no',
        has_mental_danger_signs: 'no',
        is_pregnancy_referral: 'no',
        is_referral_case: 'no',
        is_perinatal_death: 'no',
        was_available: 'yes',
        marked_as_pregnant: 'false',
        is_upcoming_pregnancy_home_visit: 'no',
        is_anc_defaulter: 'false'
      },
      contextFields: {
        is_pregnant: false,
        edd: undefined
      }
    },
    {
      input: pregnancyHomeVisitScenarios.lmpGt30Days(),
      description: 'lmp is more than 30 days ago and pregnancy test negative',
      calculateFields: {
        has_danger_signs: 'no',
        has_mental_danger_signs: 'no',
        is_pregnancy_referral: 'no',
        is_referral_case: 'no',
        is_perinatal_death: 'no',
        was_available: 'yes',
        marked_as_pregnant: 'false',
        is_upcoming_pregnancy_home_visit: 'no',
        is_anc_defaulter: 'false'
      },
      contextFields: {
        is_pregnant: false,
        edd: undefined
      }
    },
    {
      input: pregnancyHomeVisitScenarios.positivePregnancyTest,
      description: 'lmp is more than 30 days ago and pregnancy test positive',
      calculateFields: {
        has_danger_signs: 'no',
        has_mental_danger_signs: 'no',
        is_pregnancy_referral: 'yes',
        is_referral_case: 'yes',
        is_perinatal_death: 'no',
        was_available: 'yes',
        marked_as_pregnant: 'true',
        is_upcoming_pregnancy_home_visit: 'yes',
        is_anc_defaulter: 'false'
      },
      contextFields: {
        is_pregnant: true,
        edd: ''
      }
    },
    {
      input: pregnancyHomeVisitScenarios.pregnancyTestNotDone,
      description: 'lmp is more than 30 days ago and pregnancy test not done',
      calculateFields: {
        has_danger_signs: 'no',
        has_mental_danger_signs: 'no',
        is_pregnancy_referral: 'no',
        is_referral_case: 'yes',
        is_perinatal_death: 'no',
        was_available: 'yes',
        marked_as_pregnant: 'false',
        is_upcoming_pregnancy_home_visit: 'yes',
        is_anc_defaulter: 'false'
      },
      contextFields: {
        is_pregnant: false,
        edd: undefined
      }
    },
    {
      input: pregnancyHomeVisitScenarios.hasDangerSigns,
      description: 'has ANC danger signs',
      calculateFields: {
        has_danger_signs: 'yes',
        has_mental_danger_signs: 'no',
        is_pregnancy_referral: 'no',
        is_referral_case: 'yes',
        is_perinatal_death: 'no',
        was_available: 'yes',
        marked_as_pregnant: 'true',
        is_upcoming_pregnancy_home_visit: 'yes',
        is_anc_defaulter: 'false'
      },
      contextFields: {
        is_pregnant: true,
        edd: getDate(100)
      }
    },
    {
      input: pregnancyHomeVisitScenarios.hasMentalDangerSigns,
      description: 'has mental danger signs',
      calculateFields: {
        has_danger_signs: 'no',
        has_mental_danger_signs: 'yes',
        is_pregnancy_referral: 'no',
        is_referral_case: 'yes',
        is_perinatal_death: 'no',
        was_available: 'yes',
        marked_as_pregnant: 'true',
        is_upcoming_pregnancy_home_visit: 'yes',
        is_anc_defaulter: 'false'
      },
      contextFields: {
        is_pregnant: true,
        edd: getDate(100)
      }
    },
    {
      input: pregnancyHomeVisitScenarios.muac('red'),
      description: 'has red muac colour',
      calculateFields: {
        has_danger_signs: 'yes',
        has_mental_danger_signs: 'no',
        is_pregnancy_referral: 'no',
        is_referral_case: 'yes',
        is_perinatal_death: 'no',
        was_available: 'yes',
        marked_as_pregnant: 'true',
        is_upcoming_pregnancy_home_visit: 'yes',
        is_anc_defaulter: 'false'
      },
      contextFields: {
        is_pregnant: true,
        edd: getDate(100)
      }
    },
    {
      input: pregnancyHomeVisitScenarios.muac('yellow'),
      description: 'has yellow muac colour',
      calculateFields: {
        has_danger_signs: 'yes',
        has_mental_danger_signs: 'no',
        is_pregnancy_referral: 'no',
        is_referral_case: 'yes',
        is_perinatal_death: 'no',
        was_available: 'yes',
        marked_as_pregnant: 'true',
        is_upcoming_pregnancy_home_visit: 'yes',
        is_anc_defaulter: 'false'
      },
      contextFields: {
        is_pregnant: true,
        edd: getDate(100)
      }
    },
    {
      input: pregnancyHomeVisitScenarios.muac('green'),
      description: 'has green muac colour',
      calculateFields: {
        has_danger_signs: 'no',
        has_mental_danger_signs: 'no',
        is_pregnancy_referral: 'no',
        is_referral_case: 'no',
        is_perinatal_death: 'no',
        was_available: 'yes',
        marked_as_pregnant: 'true',
        is_upcoming_pregnancy_home_visit: 'yes',
        is_anc_defaulter: 'false'
      },
      contextFields: {
        is_pregnant: true,
        edd: getDate(100)
      }
    },
    {
      input: pregnancyHomeVisitScenarios.lostPregnancy(),
      description: 'lost pregnancy of below 7 months',
      calculateFields: {
        has_danger_signs: 'no',
        has_mental_danger_signs: 'no',
        is_pregnancy_referral: 'no',
        is_referral_case: 'no',
        is_perinatal_death: 'no',
        was_available: 'yes',
        marked_as_pregnant: 'false',
        is_upcoming_pregnancy_home_visit: 'no',
        is_anc_defaulter: 'false'
      },
      contextFields: {
        is_pregnant: false,
        edd: undefined
      }
    },
    {
      input: pregnancyHomeVisitScenarios.lostPregnancy('7_months_or_more'),
      description: 'lost pregnancy of 7 months and above',
      calculateFields: {
        has_danger_signs: 'no',
        has_mental_danger_signs: 'no',
        is_pregnancy_referral: 'no',
        is_referral_case: 'no',
        is_perinatal_death: 'yes',
        was_available: 'yes',
        marked_as_pregnant: 'false',
        is_upcoming_pregnancy_home_visit: 'no',
        is_anc_defaulter: 'false'
      },
      contextFields: {
        is_pregnant: false,
        edd: undefined
      }
    },
  ].forEach(scenario => it(`pregnancy home visit service filled and successfully saved if contact ${scenario.description}`, async () => {
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...scenario.input);
    expect(result.errors, scenario.description).to.be.empty;

    Object.entries(scenario.calculateFields).forEach(([field, value]) => {
      expect(result.report.fields).to.have.property(field, value);
    });

    expect(result.report.fields).to.nested.include({
      visited_contact_uuid: 'household_id'
    });

    const summary = await harness.getContactSummary();
    Object.entries(scenario.contextFields).forEach(([field, value]) => {
      expect(summary.context).to.have.property(field, value);
    });
  }));

  it(`should load pregnancy home visit service with pregnancy information on contact summary context`, async () => {
    const subsequentSubmission = await harness.fillForm({
      form: Services.PREGNANCY_HOME_VISIT,
      contactSummary: {
        context: {
          is_pregnant: true,
          edd: getDate(60)
        }
      }
    }, ...subsequentPregnancyHomeVisitScenarios.stillPregnantAction);

    expect(subsequentSubmission.errors).to.be.empty;
    expect(subsequentSubmission.report.fields).to.nested.include({
      currently_pregnant: 'true',
      current_edd: getDate(60),
      has_danger_signs: 'yes',
      has_mental_danger_signs: 'yes',
      is_pregnancy_referral: 'yes',
      is_referral_case: 'yes',
      is_perinatal_death: 'no',
      visited_contact_uuid: 'household_id'
    });
  });

  it(`should update calculated edd on form and contact summary context`, async () => {
    const subsequentSubmission = await harness.fillForm({
      form: Services.PREGNANCY_HOME_VISIT,
      contactSummary: {
        context: {
          is_pregnant: true,
          edd: getDate(60)
        }
      }
    }, ...subsequentPregnancyHomeVisitScenarios.ancUptoDateAction);

    expect(subsequentSubmission.errors).to.be.empty;
    expect(subsequentSubmission.report.fields).to.include({
      currently_pregnant: 'true',
      current_edd: getDate(200),
      has_danger_signs: 'no',
      has_mental_danger_signs: 'yes',
      is_pregnancy_referral: 'no',
      is_referral_case: 'yes',
      is_perinatal_death: 'no',
      visited_contact_uuid: 'household_id'
    });

    const summary = await harness.getContactSummary();
    expect(summary.context).to.include({
      is_pregnant: true,
      edd: getDate(200)
    });
  });

  it(`should update pregnancy information on form and contact summary context to not pregnant`, async () => {
    const subsequentSubmission = await harness.fillForm({
      form: Services.PREGNANCY_HOME_VISIT,
      contactSummary: {
        context: {
          is_pregnant: true,
          edd: getDate(60)
        }
      }
    }, ...subsequentPregnancyHomeVisitScenarios.notPregnantAnymoreAction);

    expect(subsequentSubmission.errors).to.be.empty;
    expect(subsequentSubmission.report.fields).to.include({
      currently_pregnant: 'true',
      current_edd: getDate(60),
      has_danger_signs: 'no',
      has_mental_danger_signs: 'no',
      is_pregnancy_referral: 'no',
      is_referral_case: 'no',
      is_perinatal_death: 'no',
      visited_contact_uuid: 'household_id'
    });

    const summary = await harness.getContactSummary();
    expect(summary.context).to.include({
      is_pregnant: false,
      edd: undefined
    });
  });

  it(`should throw error if edd is in the past`, async () => {
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant(getDate(-15)));
    expect(result.errors).to.be.not.empty; //length is 2; The hint is being recorded as a validation message
    expect(result.errors[0]).to.have.property('type', 'validation');
    expect(result.errors[0]).to.have.property('question').that.includes('updated EDD');
  });

  it(`should throw error if next ANC appointment date is in the past`, async () => {
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.isPregnant(getDate(15), getDate(-15)));
    expect(result.errors.length).to.be.eql(1);
    expect(result.errors[0]).to.have.property('type', 'validation');
    expect(result.errors[0]).to.have.property('question').that.includes('next ANC visit');
  });

  // Fixes https://github.com/moh-kenya/config-echis-2.0/issues/800
  it(`Fix #800: show test for pregnancy if lmp > 30 days and is pregnant=unknown`, async () => {
    const result = await harness.fillForm(Services.PREGNANCY_HOME_VISIT, ...pregnancyHomeVisitScenarios.pregnantUnknownLmpGt30);
    expect(result.errors).to.be.empty;
  });
});
