const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { commodityCountScenarios, commoditySuppliedScenarios, commodityReceivedScenarios, commodityReturnedScenarios, commodityReturnScenarios, commodityDiscrepancyScenarios, commodityDiscrepancyResolutionScenarios } = require('../forms-inputs');
const { Services, TASKS } = require('../../common-extras');
const { DateTime } = require('luxon');
const now = () => DateTime.now();

describe('Commodities supply', () => {
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

  it('should trigger a task to chv when commodities are supplied by the cha', async () => {
    harness.user = 'cha_id';
    const taskTitle = TASKS.chv_commodity_receipt;
    let report = await harness.fillForm(Services.COMMODITES_SUPPLIED, ...commoditySuppliedScenarios.default);
    expect(report.errors).to.be.empty;
    let tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 0);

    harness.user = 'chv_id';
    tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 1);

    report = await harness.loadAction(tasks[0], ...commodityReceivedScenarios.default);
    expect(report.errors).to.be.empty;
    const summary = await harness.countTaskDocsByState({ title: taskTitle });
    expect(summary).to.include({ Completed: 1 });
  });
});

describe('Commodities count', () => {
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

  it('should be triggered as a task every 2 weeks (beginning and mid month)', async () => {
    const endOfCurrMonth = now().endOf('month');
    const startOfNextMonth = endOfCurrMonth.plus({ days: 1 });
    harness.setNow(endOfCurrMonth.toISODate());
    const taskTitle = TASKS.chv_commodity_count;
    let tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 0);

    harness.setNow(startOfNextMonth.toISODate());
    tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 1);

    let report = await harness.loadAction(tasks[0], ...commodityCountScenarios.default);
    expect(report.errors).to.be.empty;
    let summary = await harness.countTaskDocsByState({ title: taskTitle });
    expect(summary).to.include({ Completed: 1 });

    harness.flush({ weeks: 2 });
    tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 1);

    report = await harness.loadAction(tasks[0], ...commodityCountScenarios.default);
    expect(report.errors).to.be.empty;
    summary = await harness.countTaskDocsByState({ title: taskTitle });
    expect(summary).to.include({ Completed: 2 });
  });
});

describe('Commodities returned', () => {
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

  it('should trigger a cha task to receive returned commodities', async () => {
    const taskTitle = TASKS.cha_commodity_returned;
    let tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 0);

    let report = await harness.fillForm(Services.COMMODITES_RETURN, ...commodityReturnScenarios.default);
    expect(report.errors).to.be.empty;
    harness.user = 'cha_id';
    tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 1);

    report = await harness.loadAction(tasks[0], ...commodityReturnedScenarios.default);
    expect(report.errors).to.be.empty;
    tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 0);
  });
});

describe('Commodities discrepancy resolution', () => {
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

  it('task should be triggered if commodity quantities supplied cha vs received by chv do not tally', async () => {
    harness.user = 'cha_id';
    let report = await harness.fillForm(Services.COMMODITES_SUPPLIED, ...commoditySuppliedScenarios.default);
    expect(report.errors).to.be.empty;
    let tasks = await harness.getTasks({ title: TASKS.chv_commodity_receipt });
    expect(tasks).to.have.property('length', 0);

    harness.user = 'chv_id';
    tasks = await harness.getTasks({ title: TASKS.chv_commodity_receipt });
    expect(tasks).to.have.property('length', 1);

    report = await harness.loadAction(tasks[0], ...commodityDiscrepancyScenarios.default);
    expect(report.errors).to.be.empty;
    tasks = await harness.getTasks({ title: TASKS.chv_commodity_receipt });
    expect(tasks).to.have.property('length', 0);
    tasks = await harness.getTasks({ title: TASKS.cha_commodity_supplied_reconciliation });
    expect(tasks).to.have.property('length', 0);

    harness.user = 'cha_id';
    tasks = await harness.getTasks({ title: TASKS.cha_commodity_supplied_reconciliation });
    expect(tasks).to.have.property('length', 1);

    report = await harness.loadAction(tasks[0], ...commodityDiscrepancyResolutionScenarios.default);
    expect(report.errors).to.be.empty;
    tasks = await harness.getTasks({ title: TASKS.cha_commodity_supplied_reconciliation });
    expect(tasks).to.have.property('length', 0);
  });
});

describe('Commodities stock out', () => {
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

  it('should trigger a cha task immediately there is a stock out reported ', async () => {
    const taskTitle = TASKS.cha_commodity_stock_out;
    let tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 0);

    let report = await harness.fillForm(Services.COMMODITES_COUNT,...commodityCountScenarios.default);
    expect(report.errors).to.be.empty;
    
    tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 0);
    
    harness.user = 'cha_id';
    tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 1);

    report = await harness.loadAction(tasks[0], []);
    expect(report.errors).to.be.empty;
    tasks = await harness.getTasks({ title: taskTitle });
    expect(tasks).to.have.property('length', 0);
  });
});
