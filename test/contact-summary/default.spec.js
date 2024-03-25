const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();


describe('Deafult contact card', () => {
  before(async () => { return await harness.start(); });
  after(async () => { return await harness.stop(); });
  beforeEach(async () => { return await harness.clear(); });
  afterEach(() => { expect(harness.consoleErrors).to.be.empty; });

  it('does not error when rendering for each contact type', async () => {
    const contactIDs = harness.state.contacts.map(doc => doc._id);
    for (const contactID of contactIDs) {
      harness.subject = contactID;
      const summary = await harness.getContactSummary();
      expect(summary.cards).to.have.length.greaterThanOrEqual(0);
      expect(summary.fields).to.have.length.greaterThanOrEqual(1);
    }
  });
});
