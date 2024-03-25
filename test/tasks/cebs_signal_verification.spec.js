const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { cebsScenarios } = require('../forms-inputs');
const { Services, TASKS } = require('../../common-extras');

describe.skip('CEBS Signal Verification Task', () => {
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

  it('triggers for signal reported by the chv', async () => {
    const taskTitle = TASKS.ceb_signal_verification;

    harness.user = 'cha_id';
    let tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 0);

    harness.user = 'chv_id';
    let report = await harness.fillForm(Services.CEBS_CHV_SIGNAL_REPORTING, ...cebsScenarios.chvSignalReporting);

    harness.user = 'cha_id';
    tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 1);

    report = await harness.loadAction(tasks[0], ...cebsScenarios.signalVerification);
    expect(report.errors).to.be.empty;

    const summary = await harness.countTaskDocsByState({ title: taskTitle });
    expect(summary).to.include({ Completed: 1 });
  });

  it('does not trigger for the chv reporting the signal', async () => {
    const taskTitle = TASKS.ceb_signal_verification;

    harness.user = 'chv_id';
    let tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 0);

    harness.user = 'chv_id';
    await harness.fillForm(Services.CEBS_CHV_SIGNAL_REPORTING, ...cebsScenarios.chvSignalReporting);

    tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 0);
  });

  it('does not trigger for the cha when they report a signal', async () => {
    const taskTitle = TASKS.ceb_signal_verification;

    harness.user = 'cha_id';
    let tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 0);

    harness.user = 'cha_id';
    await harness.fillForm(Services.CEBS_CHA_SIGNAL_REPORTING_VERIFICATION, ...cebsScenarios.chaSignalReporting);

    tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 0);
  });
});
