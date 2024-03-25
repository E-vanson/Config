module.exports = {
  cron: '0 0 * * *',
  run_every_days: 1,
  fn: function (userCtx, contact, reports) {
    const reportsToPurge = [];

    const excludedChpReportsToPurgeForCha = [
      'death_report',
      'family_planning',
      'household_member_registration_reminder',
      'mute_person',
      'mute_household',
      'treatment_follow_up',
      'wash'
    ];

    const purgeScheduleForChas = [
      { form: 'commodities_order', durationInDays: 30 * 3 },
      { form: 'commodity_received', durationInDays: 30 * 3 },
      { form: 'commodity_supply', durationInDays: 30 * 3 },
      { form: 'stock_ammendment', durationInDays: 30 * 3 },
      { form: 'commodity_stockout', durationInDays: 30 * 3 },
      { form: 'cha_signal_reporting_verification', durationInDays: 30 * 3 },
      { form: 'cha_signal_verification', durationInDays: 30 * 3 },
      { form: 'death_review', durationInDays: 30 * 3 },
      { form: 'cha_verbal_autopsy', durationInDays: 30 * 4 },
      { form: 'approve_mute_person', durationInDays: 30 * 3 },
      { form: 'approve_mute_household', durationInDays: 30 * 3 },
      { form: 'sgbv', durationInDays: 30 * 3 },
      { form: 'chu_supervision', durationInDays: 30 * 3 },
      { form: 'community_event', durationInDays: 30 * 3 },
      { form: 'referral_follow_up', durationInDays: 30 * 3 },
      { form: 'postnatal_care_service', durationInDays: 30 * 1.5 },
      { form: 'u5_assessment', durationInDays: 30 * 1.5 },
      { form: 'over_five_assessment', durationInDays: 30 * 1.5 },
      { form: 'pregnancy_home_visit', durationInDays: 30 * 1.5 },
      { form: 'postnatal_care_service_newborn', durationInDays: 30 * 1.5 },
      { form: 'immunization_service', durationInDays: 30 * 1.5 },
      { form: 'defaulter_follow_up', durationInDays: 30 * 1.5 },
    ];

    const purgeScheduleForChps = [
      { form: 'chv_signal_reporting', durationInDays: 30 * 3 },
      { form: 'commodity_count', durationInDays: 30 * 1 },
      { form: 'commodity_received', durationInDays: 30 * 1 },
      { form: 'commodity_return', durationInDays: 30 * 1 },
      { form: 'death_report', durationInDays: 30 * 1 },
      { form: 'defaulter_follow_up', durationInDays: 30 * 1.5 },
      { form: 'family_planning', durationInDays: 30 * 3 },
      { form: 'immunization_service', durationInDays: 30 * 24 },
      { form: 'mute_household', durationInDays: 30 * 1 },
      { form: 'mute_person', durationInDays: 30 * 1 },
      { form: 'over_five_assessment', durationInDays: 30 * 3 },
      { form: 'postnatal_care_service', durationInDays: 30 * 3 },
      { form: 'postnatal_care_service_newborn', durationInDays: 30 * 3 },
      { form: 'pregnancy_home_visit', durationInDays: 30 * 1.5 },
      { form: 'referral_follow_up', durationInDays: 30 * 3 },
      { form: 'sgbv', durationInDays: 30 * 1 },
      { form: 'socio_economic_survey', durationInDays: 30 * 1 },
      { form: 'treatment_follow_up', durationInDays: 30 * 3 },
      { form: 'u5_assessment', durationInDays: 30 * 3 },
      { form: 'unmute_household', durationInDays: 30 * 1 },
      { form: 'unmute_person', durationInDays: 30 * 1 },
      { form: 'wash', durationInDays: 30 * 6 },
      { form: 'chv_consumption_log', durationInDays: 30 * 3 },
    ];

    const generateReportsToPurge = (purgeSchedule) => reports.filter(report => [...purgeSchedule].map(item => item.form).includes(report.form))
      .filter(report => {
        const duration = purgeSchedule.find(item => item.form === report.form).durationInDays;
        const old = Date.now() - (1000 * 60 * 60 * 24 * duration);
        return report.reported_date <= old;
      }).map(report => report._id);

    if (userCtx.roles.includes('community_health_volunteer')) {
      reportsToPurge.push(...generateReportsToPurge(purgeScheduleForChps));
    }
    if (userCtx.roles.includes('community_health_assistant')) {
      const excludedReportsToPurgeForCha = reports
        .filter(report => excludedChpReportsToPurgeForCha.includes(report.form))
        .map(report => report._id);

      reportsToPurge.push(...generateReportsToPurge(purgeScheduleForChas), ...excludedReportsToPurgeForCha);
    }

    return reportsToPurge;
  }
};
