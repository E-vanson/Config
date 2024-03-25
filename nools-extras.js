const shared = require('./common-extras');
const {
  isEligibleForTasks,
  PNC_PERIOD_DAYS,
  getVaccinesReceived,
  countTotalVaccinesByAge,
  getNewbornHomeVisitCount,
  Services,
  Persons
} = shared;

const { DateTime } = require('luxon');

const isFormArraySubmittedInWindow = (reports, formArray, dueDate, event, count, sourceID) => {
  let found = false;
  let reportCount = 0;

  const start = Utils.addDate(dueDate, -event.start).getTime();
  const end = Utils.addDate(dueDate, event.end + 1).getTime();

  reports.some(function (report) {
    if (formArray.includes(report.form)) {
      if (report.reported_date >= start && report.reported_date <= end) {
        if (sourceID) {
          if (Utils.getField(report, 'inputs.source_id') === sourceID) {
            found = true;

            if (count) {
              reportCount++;
            }
          }
        } else {
          found = true;

          if (count) {
            reportCount++;
          }
        }
      }
    }
  });

  if (count) { return reportCount >= count; }
  return found;
};

const getMostRecentPregnancy = reports => {
  return Utils.getMostRecentReport(reports, Services.PREGNANCY_HOME_VISIT);
};

const isPregnancyTaskMuted = contact => {
  if (!isEligibleForTasks(contact.contact)) { return true; }
  const mostRecentPregnancy = getMostRecentPregnancy(contact.reports);
  const postnatalCareVisits = contact.reports.filter(report => report.form === Services.POSTNATAL_CARE_SERVICE && Utils.getField(report, 'group_pregnancy_status.has_delivered') === 'yes');
  if(!mostRecentPregnancy){
    return false;
  }
  if (postnatalCareVisits.length > 0) {
    const mostRecentDeliveryReport = Utils.getMostRecentReport(postnatalCareVisits, Services.POSTNATAL_CARE_SERVICE);
    return mostRecentDeliveryReport && mostRecentDeliveryReport.reported_date > mostRecentPregnancy.reported_date;
  }
  return mostRecentPregnancy && Utils.getField(mostRecentPregnancy, 'pregnancy_screening.is_still_pregnant') === 'no';
};

const getMostRecentEddForPregnancy = reports => Utils.getField(getMostRecentPregnancy(reports), 'current_edd');

const isReportedThisMonth = report => {
  const currentDateTime = DateTime.local();
  const reportedDateTime = DateTime.fromMillis(report.reported_date);
  return currentDateTime.month === reportedDateTime.month && currentDateTime.year === reportedDateTime.year;
};

const getReportsSubmittedInWindow = (reports, form, start, end, condition) => {
  const reportsFound = [];
  reports.forEach(function (report) {
    if (form.includes(report.form)) {
      if (report.reported_date >= start && report.reported_date <= end) {
        if (!condition || condition(report)) {
          reportsFound.push(report);
        }
      }
    }
  });
  return reportsFound;
};

const ageInMonths = dateOfBirth => DateTime.local().diff(DateTime.fromISO(dateOfBirth)).as('months');
const ageInYears = dateOfBirth => DateTime.local().diff(DateTime.fromISO(dateOfBirth)).as('years');

const FIELDS_FOR_CHV_REFERRAL = {
  [Services.PREGNANCY_HOME_VISIT]: ['has_been_referred'],
  [Services.POSTNATAL_CARE_SERVICE]: ['needs_danger_signs_follow_up', 'needs_pnc_update_follow_up', 'needs_mental_health_follow_up'],
  [Services.POSTNATAL_CARE_SERVICE_NEWBORN]: ['is_referred'],
  [Services.U5_ASSESSMENT]: ['has_been_referred'],
  [Services.IMMUNIZATION_SERVICE]: ['needs_follow_up'],
  [Services.DEFAULTER_FOLLOW_UP]: ['needs_follow_up']
};

const isReferredByCHV = (c, report) => FIELDS_FOR_CHV_REFERRAL[report.form].some(field => ['true', 'yes'].includes(Utils.getField(report, field)));
const isUnder5WithPneumonia = report => report && report.form === Services.U5_ASSESSMENT && Utils.getField(report, 'u5_assessment.has_cough') === 'yes' && Utils.getField(report, 'u5_assessment.u5_has_fast_breathing') === 'true';

const isUnder5WithPneumoniaTreated = report => isUnder5WithPneumonia(report) && Utils.getField(report, 'u5_assessment.chest_indrawing') === 'no' && Utils.getField(report, 'group_summary_no_danger_signs.r_given_amox') === 'yes';

const MUAC_COLORS = ['red', 'yellow', 'green'];
const MALNUTRITION_MUAC_COLORS = ['red', 'yellow'];

const FIELDS_FOR_GROWTH_MONITORING = {
  [Services.U5_ASSESSMENT]: 'growth_and_monitoring.is_participating_growth_monitoring',
  [Services.IMMUNIZATION_SERVICE]: 'group_growth_and_monitoring.is_participating_in_monthly_growth_monitoring'
};

const MRDT_RESULT_OPTIONS = ['positive', 'negative', 'invalid', 'not_done'];
const MRDT_TEST_RESULT_OPTIONS = ['positive', 'negative', 'invalid'];

const FIELDS_FOR_MRDT_RESULT = {
  [Services.U5_ASSESSMENT]: 'malaria_screening.malaria_test_result',
  [Services.OVER_FIVE_ASSESSMENT]: 'group_malaria.rdt_result'
};

const FIELDS_FOR_CHV_SUPERVISION = {
  [Services.CHA_SUPERVISION_CALENDAR]: 'details.when_supervise',
  [Services.CHV_SUPERVISION]: 'group_visit.is_available'
};

const FIELDS_FOR_CHV_SUPERVISION_TASK = {
  [Services.CHA_SUPERVISION_CALENDAR]: 'details.when_supervise',
  [Services.CHV_SUPERVISION]: 'next_supervision_visit_date'
};

const isChvPerson = contact => [contact.type, contact.contact_type].includes(Persons.USER) && contact.parent && contact.parent.parent && contact.parent.parent.parent;

const FIELDS_FOR_SGBV_REFERRAL = {
  [Services.OVER_FIVE_ASSESSMENT]: 'group_sexual_gender_based_violence.is_referred_to_cha',
  [Services.SGBV]: 'sgbv.is_referred_to_cha'
};


const startOfMonthDate = () => DateTime.local().startOf('month');
const midMonthDate = () => startOfMonthDate().plus({weeks: 2});

module.exports = {
  isEligibleForTasks,
  isFormArraySubmittedInWindow,
  PNC_PERIOD_DAYS,
  getVaccinesReceived,
  countTotalVaccinesByAge,
  getNewbornHomeVisitCount,
  getMostRecentEddForPregnancy,
  getReportsSubmittedInWindow,
  isPregnancyTaskMuted,
  isReportedThisMonth,
  ageInMonths,
  ageInYears,
  isReferredByCHV,
  isUnder5WithPneumonia,
  isUnder5WithPneumoniaTreated,
  FIELDS_FOR_CHV_REFERRAL,
  FIELDS_FOR_MRDT_RESULT,
  MRDT_RESULT_OPTIONS,
  MRDT_TEST_RESULT_OPTIONS,
  MUAC_COLORS,
  FIELDS_FOR_GROWTH_MONITORING,
  MALNUTRITION_MUAC_COLORS,
  FIELDS_FOR_CHV_SUPERVISION,
  DateTime,
  FIELDS_FOR_CHV_SUPERVISION_TASK,
  isChvPerson,
  FIELDS_FOR_SGBV_REFERRAL,
  startOfMonthDate,
  midMonthDate
};
