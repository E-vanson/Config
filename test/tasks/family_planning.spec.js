const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { familyPlanningScenarios, referralFollowUpScenarios } = require('../forms-inputs');
const { Services, TASKS } = require('../../common-extras');

describe('Family Planning Service Tasks', () => {
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
      input: familyPlanningScenarios.hasSideEffects,
      taskTitle: TASKS.fp_side_effects,
      description: 'a side effects referral follow up task',
      condition: 'has fp side effects',
      flushDays: 3,
      taskInput: referralFollowUpScenarios.availableAndVisited
    },
    {
      input: familyPlanningScenarios.refillableFp(),
      taskTitle: TASKS.fp_refill_service,
      description: 'an fp service task for next appointment',
      condition: 'has been refilled',
      flushDays: 19, //default appointment in 21 days
      taskInput: familyPlanningScenarios.cocsSubsequentVisit
    }
  ].forEach(scenario => it(`should emit ${scenario.description} if contact ${scenario.condition}`, async () => {
    // confirm there are no tasks of this type
    let followUpTask = await harness.getTasks({ title: scenario.taskTitle });
    expect(followUpTask).to.have.property('length', 0);

    const result = await harness.fillForm(Services.FAMILY_PLANNING, ...scenario.input);
    expect(result.errors).to.be.empty;

    await harness.flush(scenario.flushDays);

    followUpTask = await harness.getTasks({ title: scenario.taskTitle });
    expect(followUpTask).to.have.property('length', 1);

    //Ensure resolved
    await harness.loadAction(followUpTask[0], ...scenario.taskInput);
    expect(await harness.getTasks({ title: scenario.taskTitle })).to.be.empty;
  }));

  [
    {
      input: familyPlanningScenarios.noSideEffects,
      description: 'side effects referral follow up task',
      condition: 'has no fp side effects'
    },
    {
      input: familyPlanningScenarios.notRefilled,
      description: 'refill task',
      condition: 'has not been refilled'
    },
    {
      input: familyPlanningScenarios.notPregnant,
      description: 'fp or referral follow up task',
      condition: 'is not on fp and pregnant'
    },
    {
      input: familyPlanningScenarios.isPregnant,
      description: 'fp or referral follow up task',
      condition: 'is pregnant'
    },
  ].forEach(scenario => it(`should not emit a ${scenario.description} if contact ${scenario.condition}`, async () => {
    // confirm there are no tasks of this type
    const followUpTask = await harness.countTaskDocsByState({ actionForm: Services.REFERRAL_FOLLOW_UP });
    expect(followUpTask).to.include({
      Total: 0
    });

    const result = await harness.fillForm(Services.FAMILY_PLANNING, ...scenario.input);
    expect(result.errors).to.be.empty;

    const referralSummary = await harness.countTaskDocsByState({ actionForm: Services.REFERRAL_FOLLOW_UP});
    expect(referralSummary).to.include({
      Total: 0
    });

    const familyPlanningSummary = await harness.countTaskDocsByState({ actionForm: Services.FAMILY_PLANNING });
    expect(familyPlanningSummary).to.include({
      Total: 0
    });
  }));
});
