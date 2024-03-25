const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness({ subject: 'patient_id' });
const { immunizationScenarios } = require('../forms-inputs');
const { Services, TASKS } = require('../../common-extras');

const { DateTime } = require('luxon');
const scenarios = [
  {
    input: immunizationScenarios.vaccineStatusUptodate,
    description: 'A vaccination not received should trigger Immunization referral followup',
    condition: 'Child has not received vaccines',
    flushDays: 3,
    taskInput: immunizationScenarios.immunization
  },
  {
    input: immunizationScenarios.growthMonitoring,
    description: 'Not following growth monitoring triggers Immunization referral followup',
    condition: 'Child not following Growth monitoring',
    flushDays: 3,
    taskInput: immunizationScenarios.immunization
  }
];

describe('Immunization referral followup', () => {

  before(async () => {
    return await harness.start();
  });

  after( async() => {
    return await harness.stop();
  });

  beforeEach(async () => {
    await harness.clear();
  });

  afterEach(async () => {
    expect(harness.consoleErrors).to.be.empty;
  });

  for(const scenario of scenarios){
    it(`${scenario.description}`, async () => {

      // confirm there are no tasks of this type
      let followUpTask = await harness.getTasks({ title: TASKS.immunization_service });
      expect(followUpTask).to.have.property('length', 0);

      harness.subject.date_of_birth = DateTime.now().minus({ weeks: 152 }).toISODate();
      const result = await harness.fillForm(Services.IMMUNIZATION_SERVICE, ...scenario.input);
      expect(result.errors).to.be.empty;
      
      await harness.flush(scenario.flushDays);
    
      followUpTask = await harness.getTasks({ title: TASKS.immunization_service });
      expect(followUpTask).to.have.property('length', 1);
    
      //Ensure task resolves
      await harness.loadAction(followUpTask[0], ...scenario.taskInput);
      expect(await harness.getTasks({ title: TASKS.immunization_service })).to.be.empty;

      followUpTask = await harness.getTasks({ title: TASKS.immunization_service });
      expect(followUpTask).to.have.property('length', 0);
    });
  }
});
