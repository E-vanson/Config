const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { referralFollowUpScenarios, getDate } = require('../forms-inputs');
const { Services } = require('../../common-extras');

describe('Referral follow up form', () => {
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

  it(`needs follow up if client is not available`, async () => {
    harness.content.t_referral_type = 'danger signs';
    const result = await harness.fillForm(Services.REFERRAL_FOLLOW_UP, ...referralFollowUpScenarios.notAvailable);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_follow_up: `yes`,
      follow_up_date: getDate(3),
      visited_contact_uuid: 'household_id' //Confirm if unavailability => not a hh visit
    });

    const taskTime = result.report.fields.follow_up_date;
    await harness.setNow(taskTime);

    const followUpTask = await harness.getTasks({ actionForm: Services.REFERRAL_FOLLOW_UP });
    expect(followUpTask).to.have.property('length', 1);
  });

  it(`needs no follow up if client is available and visited health facility`, async () => {
    harness.content.t_referral_type = 'danger signs';
    const result = await harness.fillForm(Services.REFERRAL_FOLLOW_UP, ...referralFollowUpScenarios.availableAndVisited);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_follow_up: `no`,
      visited_contact_uuid: 'household_id'
    });

    await harness.flush(3);

    const followUpTask = await harness.getTasks({ actionForm: Services.REFERRAL_FOLLOW_UP });
    expect(followUpTask).to.have.property('length', 0);
  });

  it(`needs follow up if client is available, but did not visit health facility`, async () => {
    harness.content.t_referral_type = 'danger signs';
    const result = await harness.fillForm(Services.REFERRAL_FOLLOW_UP, ...referralFollowUpScenarios.availableAndNotVisited);
    expect(result.errors).to.be.empty;
    expect(result.report.fields).to.nested.include({
      needs_follow_up: `yes`,
      follow_up_date: getDate(3),
      visited_contact_uuid: 'household_id'
    });

    const taskTime = result.report.fields.follow_up_date;
    await harness.setNow(taskTime);

    const followUpTask = await harness.getTasks({ actionForm: Services.REFERRAL_FOLLOW_UP });
    expect(followUpTask).to.have.property('length', 1);

    await harness.loadAction(followUpTask[0], ...referralFollowUpScenarios.availableAndVisited);
    expect(await harness.getTasks({ actionForm: Services.REFERRAL_FOLLOW_UP })).to.be.empty;

  });

  it(`should throw if referral type is not set`, async () => {
    const result = await harness.fillForm(Services.REFERRAL_FOLLOW_UP, ...referralFollowUpScenarios.notAvailable);
    expect(result.errors.length).to.be.eql(1);

    await harness.flush(3);

    const followUpTask = await harness.getTasks({ actionForm: Services.REFERRAL_FOLLOW_UP });
    expect(followUpTask).to.have.property('length', 0);
  });
});
