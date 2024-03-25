const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness({ subject: 'patient_id' });
const { mutePersonScenarios, approveMutePersonScenarios } = require('../forms-inputs');
const { Services } = require('../../common-extras');

describe('CHV Mute Person test', () => {
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

  it('mute_person form can be filled and successfully saved', async () => {
    // Load the wash form and fill in
    const result = await harness.fillForm(Services.MUTE_PERSON, ...mutePersonScenarios.confirmedMute(['relocated_outside_chv_area']));
    expect(result.errors).to.be.empty;

    const otherResult = await harness.fillForm(Services.MUTE_PERSON, ...mutePersonScenarios.confirmedMute(['other','very rude guy']));
    expect(otherResult.errors).to.be.empty;

    // Verify some attributes on the resulting report
    expect(result.report.fields).to.nested.include({
      'mute_report.mute_reason': 'relocated_outside_chv_area',
      visited_contact_uuid: 'household_id'
    });
    expect(otherResult.report.fields).to.nested.include({
      'mute_report.specify_reason': 'very rude guy',
    });
  });

  it('approve mute_person task should not show up for CHV', async () => {
    // Load the wash form and fill in
    const result = await harness.fillForm(Services.MUTE_PERSON, ...mutePersonScenarios.confirmedMute(['relocated_outside_chv_area']));

    // Verify that the form successfully got submitted
    expect(result.errors).to.be.empty;

    //Ensure task appears for CHA
    const followUpTask = await harness.getTasks({ title: 'task.mute_person_confirmation.title', user: 'patient_id' });
    expect(followUpTask).to.have.property('length', 0);
  });

  it('mute_person form triggers a task for a CHA if confirmed', async () => {
    // Load the wash form and fill in
    const result = await harness.fillForm(Services.MUTE_PERSON, ...mutePersonScenarios.confirmedMute(['relocated_outside_chv_area']));
    // Verify that the form successfully got submitted
    expect(result.errors).to.be.empty;

    //Ensure task not appearing for CHV
    const chvSummary = await harness.countTaskDocsByState({ title: 'task.mute_person_confirmation.title' });
    expect(chvSummary).to.nested.include({
      Draft: 0,
      Ready: 0,
      Completed: 0,
      Total: 0
    });

    //Ensure task appears for CHA
    const summary = await harness.countTaskDocsByState({ title: 'task.mute_person_confirmation.title', user: 'cha_id' });
    expect(summary).to.nested.include({
      Ready: 1
    });

    //Load and fill the task form

    const followUpTask = await harness.getTasks({ title: 'task.mute_person_confirmation.title', user: 'cha_id' });
    expect(followUpTask).to.have.property('length', 1);

    const day1FollowUp = await harness.loadAction(followUpTask[0], ...approveMutePersonScenarios.confirmedMute);
    expect(day1FollowUp.errors).to.be.empty;
    expect(day1FollowUp.additionalDocs[0]).to.include({
      form: 'mute_person_confirmed',
      type: 'data_record',
      content_type: 'xml',
      patient_id: 'patient_id',
      patient_uuid: 'patient_id',
      patient_name: 'Test Client'
    });
    //Ensure the right contacts are linked in the generated doc
    expect(day1FollowUp.additionalDocs[0]).deep.nested.property('fields.inputs.contact._id', 'patient_id');
    expect(day1FollowUp.additionalDocs[0]).deep.nested.property('contact._id', 'chv_id');

    const followUpTaskFinal = await harness.getTasks({ title: 'task.mute_person_confirmation.title', user: 'cha_id' });
    expect(followUpTaskFinal).to.have.property('length', 0);

  });

  it(`mute_person form doesn't trigger a task for a CHA if not confirmed`, async () => {
    // Load the muting form and fill in
    const result = await harness.fillForm(Services.MUTE_PERSON, ...mutePersonScenarios.unconfirmedMute);

    // Verify that the form successfully got submitted
    expect(result.errors).to.be.empty;

    //Ensure task not appearing for CHV
    const chvSummary = await harness.countTaskDocsByState({ title: 'task.mute_person_confirmation.title'});
    expect(chvSummary).to.nested.include({
      Draft: 0,
      Ready: 0,
      Completed: 0,
      Total: 0
    });

    //Ensure task not appearing for CHA
    const chaSummary = await harness.countTaskDocsByState({ title: 'task.mute_person_confirmation.title', user: 'cha_id' });
    expect(chaSummary).to.nested.include({
      Draft: 0,
      Ready: 0,
      Completed: 0,
      Total: 0
    });
  });

  it(`mute_person form should not cause household to behave like it is muted`, async () => {
    // Load the muting form and fill in
    const result = await harness.fillForm(Services.MUTE_PERSON, ...mutePersonScenarios.unconfirmedMute);

    // Verify that the form successfully got submitted
    expect(result.errors).to.be.empty;
    harness.subject = 'household_id';

    const summary = await harness.getContactSummary();
    expect(summary.context).to.include({
      is_eligible_for_home_visit_service: true
    });

  });
});
