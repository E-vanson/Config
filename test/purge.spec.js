const { expect } = require('chai');
const TestHarness = require('cht-conf-test-harness');
const harness = new TestHarness();
const { DateTime, Duration } = require('luxon');
const { fn: purge } = require('../purge');

describe('Test Purge Rules for CHAs', () => {
  before(async () => {
    return await harness.start();
  });
  after(async () => {
    return await harness.stop();
  });
  beforeEach(async () => {
    await harness.clear();
    harness.user = 'cha_id';
  });
  afterEach(() => {
    expect(harness.consoleErrors).to.be.empty;
  });

  const fourMonthOldReportsToPurge = [
    'cha_verbal_autopsy', 
  ];

  const threeMonthOldReportsToPurge = [
    'approve_mute_household', 
    'approve_mute_person', 
    'cha_signal_reporting_verification',
    'cha_signal_verification',
    'chu_supervision',
    'commodities_order', 
    'commodity_received',
    'commodity_stockout',
    'commodity_supply',
    'community_event',
    'death_review',
    'referral_follow_up',
    'sgbv',
    'stock_ammendment',
  ];

  const oneAndHalfMonthOldReportsToPurge = [
    'defaulter_follow_up',
    'immunization_service',
    'over_five_assessment',
    'postnatal_care_service',
    'postnatal_care_service_newborn',
    'pregnancy_home_visit',
    'u5_assessment',
  ];

  const reportsToAlwaysPurge = [
    'death_report',
    'family_planning',
    'household_member_registration_reminder',
    'mute_person',
    'mute_household',
    'treatment_follow_up',
    'wash'
  ];

  fourMonthOldReportsToPurge.forEach(formName => {
    it('purge ' + formName + ' for CHAs', async () => {
      const reports = [
        {
          _id: 'p1',
          form: formName,
          reported_date: DateTime.now().minus(Duration.fromObject({ days: 30 * 4 })).toMillis()
        },
        {
          _id: 'p2',
          form: formName,
          reported_date: DateTime.now().minus(Duration.fromObject({ days: 30 * 3 })).toMillis()
        }
      ];
      expect(purge({ roles: ['community_health_assistant'] }, {}, reports, []), formName).to.deep.equal(['p1']);
    });
  });

  threeMonthOldReportsToPurge.forEach(formName => {
    it('purge ' + formName + ' for CHAs', async () => {
      const reports = [
        {
          _id: 'p1',
          form: formName,
          reported_date: DateTime.now().minus(Duration.fromObject({ days: 30 * 3 })).toMillis()
        },
        {
          _id: 'p2',
          form: formName,
          reported_date: DateTime.now().minus(Duration.fromObject({ days: 30 * 2 })).toMillis()
        }
      ];
      expect(purge({ roles: ['community_health_assistant'] }, {}, reports, []), formName).to.deep.equal(['p1']);
    });
  });

  oneAndHalfMonthOldReportsToPurge.forEach(formName => {
    it('purge ' + formName + ' for CHAs', async () => {
      const reports = [
        {
          _id: 'p1',
          form: formName,
          reported_date: DateTime.now().minus(Duration.fromObject({ days: 30 * 1.5 })).toMillis()
        },
        {
          _id: 'p2',
          form: formName,
          reported_date: DateTime.now().minus(Duration.fromObject({ days: 30 * 1 })).toMillis()
        }
      ];
      expect(purge({ roles: ['community_health_assistant'] }, {}, reports, []), formName).to.deep.equal(['p1']);
    });
  });

  reportsToAlwaysPurge.forEach(formName => {
    it('purge ' + formName + ' for CHAs', async () => {
      const reports = [
        {
          _id: 'p1',
          form: formName,
          reported_date: DateTime.now().minus(Duration.fromObject({ days: 30 * 3 })).toMillis()
        },
        {
          _id: 'p2',
          form: formName,
          reported_date: DateTime.now().minus(Duration.fromObject({ days: 1 })).toMillis()
        }
      ];
      expect(purge({ roles: ['community_health_assistant'] }, {}, reports, []), formName).to.deep.equal(['p1', 'p2']);
    });
  });

});

describe('Test Purge Rules for CHVs', () => {
  before(async () => {
    return await harness.start();
  });
  after(async () => {
    return await harness.stop();
  });
  beforeEach(async () => {
    await harness.clear();
    harness.user = 'chv_id';
  });
  afterEach(() => {
    expect(harness.consoleErrors).to.be.empty;
  });
  
  const threeMonthOldReportsToPurge = [
    'chv_signal_reporting',
    'family_planning',
    'over_five_assessment',
    'postnatal_care_service',
    'postnatal_care_service_newborn',
    'referral_follow_up',
    'treatment_follow_up',
    'u5_assessment',
    'chv_consumption_log',
  ];

  const oneMonthOldReportsToPurge = [
    'commodity_count',
    'commodity_received',
    'commodity_return',
    'death_report',
    'mute_household',
    'mute_person',
    'sgbv',
    'socio_economic_survey',
    'unmute_household',
    'unmute_person',
  ];

  const oneAndHalfMonthOldReportsToPurge = [
    'defaulter_follow_up',
    'pregnancy_home_visit',
  ];

  it('purge immunization_service >= 24 months for CHPs', async () => {
    const reports = [
      {
        _id: 'p1',
        form: 'immunization_service',
        reported_date: DateTime.now().minus(Duration.fromObject({ days: 30 * 24 })).toMillis()
      },
      {
        _id: 'p2',
        form: 'immunization_service',
        reported_date: DateTime.now().minus(Duration.fromObject({ days: 30 * 3 })).toMillis()
      }
    ];
    expect(purge({ roles: ['community_health_volunteer'] }, {}, reports, []), 'immunization_service').to.deep.equal(['p1']);
  });

  it('purge wash >= 6 months for CHPs', async () => {
    const reports = [
      {
        _id: 'p1',
        form: 'wash',
        reported_date: DateTime.now().minus(Duration.fromObject({ days: 30 * 6 })).toMillis()
      },
      {
        _id: 'p2',
        form: 'wash',
        reported_date: DateTime.now().minus(Duration.fromObject({ days: 30 * 3 })).toMillis()
      }
    ];
    expect(purge({ roles: ['community_health_volunteer'] }, {}, reports, []), 'wash').to.deep.equal(['p1']);
  });

  oneAndHalfMonthOldReportsToPurge.forEach(formName => {
    it('purge ' + formName + ' >= 1.5 months for CHPs', async () => {
      const reports = [
        {
          _id: 'p1',
          form: formName,
          reported_date: DateTime.now().minus(Duration.fromObject({ days: 30 * 1.5 })).toMillis()
        },
        {
          _id: 'p2',
          form: formName,
          reported_date: DateTime.now().minus(Duration.fromObject({ days: 30 * 0.5 })).toMillis()
        }
      ];
      expect(purge({ roles: ['community_health_volunteer'] }, {}, reports, []), formName).to.deep.equal(['p1']);
    });
  });

  oneMonthOldReportsToPurge.forEach(formName => {
    it('purge ' + formName + ' >= 1 month for CHPs', async () => {
      const reports = [
        {
          _id: 'p1',
          form: formName,
          reported_date: DateTime.now().minus(Duration.fromObject({ days: 30 * 1 })).toMillis()
        },
        {
          _id: 'p2',
          form: formName,
          reported_date: DateTime.now().minus(Duration.fromObject({ days: 30 * 0.5 })).toMillis()
        }
      ];
      expect(purge({ roles: ['community_health_volunteer'] }, {}, reports, []), formName).to.deep.equal(['p1']);
    });
  });

  threeMonthOldReportsToPurge.forEach(formName => {
    it('purge ' + formName + ' >= 3 months for CHPs', async () => {
      const reports = [
        {
          _id: 'p1',
          form: formName,
          reported_date: DateTime.now().minus(Duration.fromObject({ days: 30 * 3 })).toMillis()
        },
        {
          _id: 'p2',
          form: formName,
          reported_date: DateTime.now().minus(Duration.fromObject({ days: 30 * 2 })).toMillis()
        }
      ];
      expect(purge({ roles: ['community_health_volunteer'] }, {}, reports, []), formName).to.deep.equal(['p1']);
    });
  });
});
