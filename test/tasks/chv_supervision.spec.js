const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness({ subject: 'chv_id' });
const { chvSupervisionScenarios, chaSupervisionScenarios, DateTime } = require('../forms-inputs');
const { Services, TASKS } = require('../../common-extras');
const now = () => DateTime.now();

describe('CHV Supervision Tasks', () => {
  before(async () => {
    await harness.start();
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

  it('should trigger if chv was not available in a past supervision visit', async () => {
    harness.user = 'cha_id';
    harness.subject = 'chv_id';
    const result = await harness.fillForm(Services.CHA_SUPERVISION_CALENDAR, ...chaSupervisionScenarios.default(now().plus({days: 7}).toISODate()));
    expect(result.errors).to.be.empty;

    await harness.flush(3);
    let tasks = await harness.getTasks({title: TASKS.chv_supervision});
    expect(tasks).to.have.property('length', 0);

    await harness.flush(1);
    tasks = await harness.getTasks({title: TASKS.chv_supervision});
    expect(tasks).to.have.property('length', 1);

    await harness.loadAction(tasks[0], ...chvSupervisionScenarios.notAvailable(now().plus({days: 7}).toISODate()));
    await harness.flush(4);
    tasks = await harness.getTasks({title: TASKS.chv_supervision});
    expect(tasks).to.have.property('length', 1);
    await harness.loadAction(tasks[0],...chvSupervisionScenarios.available);
    await harness.flush(3);
    tasks = await harness.countTaskDocsByState({title: TASKS.chv_supervision});
    expect(tasks).to.include({ Draft: 0, Ready: 0, Cancelled: 0, Completed: 2, Failed: 0, Total: 2});
  });
});
