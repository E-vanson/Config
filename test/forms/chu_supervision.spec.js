const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { chuSupervisionScenarios } = require('../forms-inputs');
const formName = 'chu_supervision';

describe('CHU Supervision', () => {
  before(async () => {
    return await harness.start();
  });
  after(async () => {
    return await harness.stop();
  });
  beforeEach(async () => {
    await harness.clear();
  });
  afterEach(() => { });

  it('Fill CHU Supervision form succesfully', async () => {
    harness.user = 'schmt_id';
    harness.subject = 'chu_id';

    let summary = await harness.getContactSummary();
    expect(summary.context).to.include({
      last_action_points: ''
    });
    const result = await harness.fillForm(formName, ...chuSupervisionScenarios.default);
    expect(result.errors).to.be.empty;
    expect(result.report.fields.last_action_points).to.equal('');

    summary = await harness.getContactSummary();
    expect(summary.context).to.include({
      last_action_points: 'action point is supervision visit needs follow up '.concat(1)
    });

    const result2 = await harness.fillForm(formName, ...chuSupervisionScenarios.defaultAfter(2));
    expect(result2.errors).to.be.empty;
    expect(result2.report.fields.last_action_points).to.equal('action point is supervision visit needs follow up '.concat(1));

  });


  it('Should give error if form fields are not filled correctly', async () => {
    harness.user = 'schmt_id';
    harness.subject = 'chu_id';

    const result = await harness.fillForm(formName, ...chuSupervisionScenarios.moreResponsesThanNeeded);
    expect(result.errors[0]).to.deep.include({
      type: 'page',
      msg: 'Attempted to fill 2 questions, but only 1 are visible.'
    });
  });

  it('Should give error if date form field is not filled correctly', async () => {
    harness.user = 'schmt_id';
    harness.subject = 'chu_id';

    const result = await harness.fillForm(formName, ...chuSupervisionScenarios.incorrectDate);
    expect(result.errors[0]).to.deep.include({
      type: 'validation',
      question: 'Date of last CHU supervision visit*\nThis field does not allow future dates',
      msg: 'This field does not allow future dates'
    });
  });

});
