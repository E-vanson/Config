const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { personRegistrationScenarios, postnatalServiceNewbornScenarios } = require('../forms-inputs');
const { Persons } = require('../../common-extras');
const taskTitle = 'task.pnc_home_visit_newborn.title';

describe('PNC (Newborn) Home Visit Service', () => {
  before(async () => {
    return await harness.start();
  });
  after(async () => {
    return await harness.stop();
  });
  beforeEach(async () => {
    await harness.clear();
    const result = await harness.fillContactForm(Persons.CLIENT, ...personRegistrationScenarios.newborn());
    expect(result.errors).to.be.empty;
    harness.subject = result.contacts[0];
  });
  afterEach(() => {
    expect(harness.consoleErrors).to.be.empty;
  });

  it('should trigger newborn pnc follow ups for a newborn', async () => {
    let tasks = await harness.getTasks({title: taskTitle});
    expect(tasks).to.have.property('length', 0);

    await harness.flush(1);
    tasks = await harness.getTasks({title: taskTitle});
    expect(tasks).to.have.property('length', 1);
    //If client available, resolve task
    await harness.loadAction(tasks[0], ...postnatalServiceNewbornScenarios.default(true, 'task'));
    tasks = await harness.getTasks({title: taskTitle});
    expect(tasks).to.have.property('length', 0);

    await harness.flush(2);
    tasks = await harness.getTasks({title: taskTitle});
    expect(tasks).to.have.property('length', 1);
    //If client unavailable, task should not resolve
    await harness.loadAction(tasks[0], ...postnatalServiceNewbornScenarios.notAvailable);
    tasks = await harness.getTasks({title: taskTitle});
    expect(tasks).to.have.property('length', 1);
    //If client available, resolve task
    await harness.loadAction(tasks[0], ...postnatalServiceNewbornScenarios.default(false));
    tasks = await harness.getTasks({title: taskTitle});
    expect(tasks).to.have.property('length', 0);

    await harness.flush(4);
    tasks = await harness.getTasks({title: taskTitle});
    expect(tasks).to.have.property('length', 1);
    //If client unavailable, task should not resolve
    await harness.loadAction(tasks[0], ...postnatalServiceNewbornScenarios.notAvailable);
    tasks = await harness.getTasks({title: taskTitle});
    expect(tasks).to.have.property('length', 1);
    //If client available, resolve task
    await harness.loadAction(tasks[0], ...postnatalServiceNewbornScenarios.default(false));
    tasks = await harness.getTasks({title: taskTitle});
    expect(tasks).to.have.property('length', 0);

    await harness.flush(28);
    tasks = await harness.getTasks({title: taskTitle});
    expect(tasks).to.have.property('length', 0);
  });

  it('should not trigger newborn pnc follow ups for a non-newborn', async () => {
    await harness.flush(28);
    const tasks = await harness.getTasks({title: taskTitle});
    expect(tasks).to.have.property('length', 0);
  });
});
