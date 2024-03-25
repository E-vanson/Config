const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness({ subject: 'household_id' });
const { washStatusScenarios } = require('../forms-inputs');
const { Services } = require('../../common-extras');
const task = 'task.wash.title';

describe('WASH Service Tasks', () => {
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

  it('should trigger a follow up task if household has no functional latrine', async () => {
    // confirm there are no tasks of this type
    let tasks = await harness.getTasks({ title: task });
    expect(tasks).to.have.property('length', 0);

    // submit a service report
    let report = await harness.fillForm(Services.WASH, ...washStatusScenarios.notGood);
    expect(report.errors).to.be.empty;

    // confirm no task yet then flush and confirm task is triggered
    tasks = await harness.getTasks({ title: task });
    expect(tasks).to.have.property('length', 0);

    await harness.flush(28);
    let summary = await harness.countTaskDocsByState({ title: task });
    expect(summary).to.include({ Draft: 0, Ready: 1, Cancelled: 0, Completed: 0, Failed: 0, Total: 1});

    // complete the action and confirm task resolves
    tasks = await harness.getTasks({ title: task });
    await harness.loadAction(tasks[0]);
    report = await harness.fillForm(...washStatusScenarios.good);
    expect(report.errors).to.be.empty;
    summary = await harness.countTaskDocsByState({ title: task });
    expect(summary).to.include({ Draft: 0, Ready: 0, Cancelled: 0, Completed: 1, Failed: 0, Total: 1});
  });

  it('should not trigger a follow up task if household has functional latrine', async () => {
    // confirm there are no tasks of this type
    let tasks = await harness.getTasks({ title: task });
    expect(tasks).to.have.property('length', 0);

    // submit a service report
    const report = await harness.fillForm(Services.WASH, ...washStatusScenarios.good);
    expect(report.errors).to.be.empty;

    // confirm no task yet then flush and confirm still no task is triggered
    tasks = await harness.getTasks({ title: task });
    expect(tasks).to.have.property('length', 0);

    await harness.flush(20);
    const summary = await harness.countTaskDocsByState({ title: task });
    expect(summary).to.include({ Draft: 0, Ready: 0, Cancelled: 0, Completed: 0, Failed: 0, Total: 0});
  });
});
