const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { deathScenarios, deathReviewScenarios } = require('../forms-inputs');
const { Services, TASKS } = require('../../common-extras');
const taskTitle = TASKS.death_confirmation;

describe('Death Review Tasks', () => {
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

  it('task should resolve and generate death confirmation report if death request is approved', async () => {
    const result = await harness.fillForm(Services.DEATH_REPORT, ...deathScenarios.healthFacility);
    expect(result.errors).to.be.empty;
    await harness.flush(5);

    harness.user = 'cha_id';
    const tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 1);

    const reviewResult = await harness.loadAction(tasks[0], ...deathReviewScenarios.healthFacility);
    expect(reviewResult.errors).to.be.empty;

    expect(reviewResult.additionalDocs).to.have.property('length', 1);
    expect(reviewResult.additionalDocs[0]).to.nested.include({
      form: 'death_confirmation',
      'contact._id': 'cha_id',
      'fields.patient_id': 'patient_id',
      'fields.date_of_death': deathScenarios.healthFacility[0][1]
    });

    const generatedDeathConfirmationReport = harness.state.reports.find(report => report.form === 'death_confirmation');
    expect(generatedDeathConfirmationReport).to.not.be.undefined;

    const summary = await harness.countTaskDocsByState({ title: taskTitle });
    expect(summary).to.nested.include({ Draft: 0, Ready: 0, Cancelled: 0, Completed: 1, Failed: 0, Total: 1 });
  });

  it('task should resolve and not generate death confirmation report if death request is rejected', async () => {
    const result = await harness.fillForm(Services.DEATH_REPORT, ...deathScenarios.healthFacility);
    expect(result.errors).to.be.empty;
    await harness.flush(5);

    harness.user = 'cha_id';
    const tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 1);

    const reviewResult = await harness.loadAction(tasks[0], deathReviewScenarios.notConfirmed);
    expect(reviewResult.errors).to.be.empty;
    expect(reviewResult.additionalDocs).to.have.property('length', 0);
    const summary = await harness.countTaskDocsByState({ title: taskTitle });
    expect(summary).to.nested.include({ Draft: 0, Ready: 0, Cancelled: 0, Completed: 1, Failed: 0, Total: 1 });
  });

  it('should disappear after 7 days', async () => {
    const result = await harness.fillForm(Services.DEATH_REPORT, ...deathScenarios.healthFacility);
    expect(result.errors).to.be.empty;

    harness.user = 'cha_id';

    await harness.flush(7);
    let tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 1);

    await harness.flush(8);
    tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 0);

    const summary = await harness.countTaskDocsByState({ title: taskTitle });
    expect(summary).to.nested.include({ Draft: 0, Ready: 0, Cancelled: 0, Completed: 0, Failed: 1, Total: 1 });
  });
});
