const { Interval, DateTime } = require('luxon');
const { getField, getMostRecentReport } = require('cht-nootils')();


const DAYS_IN_YEAR = 365;
const DAYS_IN_WEEK = 7;

const differenceInDays = (start, end) => timeDifference(start, end, 'days');
const differenceInYears = (start, end) => timeDifference(start, end, 'years');
const differenceInWeeks = (start, end) => timeDifference(start, end, 'weeks');
const differenceInMonths = (start, end) => timeDifference(start, end, 'months');

const timeDifference = (start, end, period) => {
  return Interval.fromDateTimes(new Date(start), new Date(end)).length(period);
};

const MS_IN_DAY = 24 * 60 * 60 * 1000;  // 1 day in ms
const sortReports = (a, b) => a.reported_date - b.reported_date;

const PNC_PERIOD_DAYS = 42;
const MAX_PREGNANCY_AGE_IN_WEEKS = 44;

const isEligibleForTasks = (contact, reports = []) => !contact.muted && !contact.date_of_death && !isInMuteQueue(reports) && !isInDeathConfirmationQueue(reports);
const isCHMT = (user) => user.parent && user.parent.contact_type === 'a_county';
const isSCHMT = (user) => user.parent && user.parent.contact_type === 'b_sub_county';
const getPregnancyAgeInWeeks = (edd) => Math.floor(differenceInDays(new Date(new Date(edd).getTime() - (MAX_PREGNANCY_AGE_IN_WEEKS * 7) * MS_IN_DAY), new Date()) / 7);
const isCha = (user) => user.parent && user.parent.contact_type === 'c_community_health_unit';
const isChv = (user) => user.parent && user.parent.contact_type === 'd_community_health_volunteer_area';
const isOfChildBearingAge = (contact) => {
  const ageInYears = differenceInYears(contact.date_of_birth, new Date());
  return ageInYears >= 10 && ageInYears <= 49;
};

const VACCINATIONS = {
  bcg: 'BCG',
  opv0: 'Birth Polio (OPV 0)',
  opv1: 'OPV 1',
  opv2: 'OPV 2',
  opv3: 'OPV 3',
  pcv1: 'PCV 1',
  pcv2: 'PCV 2',
  pcv3: 'PCV 3',
  penta1: 'Penta 1',
  penta2: 'Penta 2',
  penta3: 'Penta 3',
  ipv: 'IPV',
  rota1: 'Rota 1',
  rota2: 'Rota 2',
  rota3: 'Rota 3',
  vit_a: 'Vitamin A',
  measles_6: 'Measles 6 months',
  measles_9: 'Measles 9 months',
  measles_18: 'Measles 18 months',
  malaria: 'Malaria'
};

const VITAMIN_A_DOSES = {
  vit_a_6: '6_months',
  vit_a_12: '12_months',
  vit_a_18: '18_months',
  vit_a_24: '24_months',
  vit_a_30: '30_months',
  vit_a_36: '36_months',
  vit_a_42: '42_months',
  vit_a_48: '48_months',
  vit_a_54: '54_months',
  vit_a_60: '60_months',
};

const FAMILY_PLANNING_METHODS = {
  cocs: 'COCs – Combined Oral Contraceptive',
  pops: 'POPs - Progestogen-only Pill',
  injectables: 'Injectables',
  implant_1_rod: 'Implants (1 rod)',
  implant_2_rods: 'Implants (2 rods)',
  iucd: 'IUCD (Coil)',
  condoms: 'Condoms',
  tubal_ligation: 'Tubal Ligation (TL)',
  cycle_beads: 'Cycle Beads',
  vasectomy: 'Vasectomy'
};

const Services = {
  WASH: 'wash',
  REFERRAL_FOLLOW_UP: 'referral_follow_up',
  DEFAULTER_FOLLOW_UP: 'defaulter_follow_up',
  DEATH_REPORT: 'death_report',
  MUTE_PERSON: 'mute_person',
  MUTE_HOUSEHOLD: 'mute_household',
  POSTNATAL_CARE: 'postnatal_care_service',
  FAMILY_PLANNING: 'family_planning',
  POSTNATAL_CARE_SERVICE: 'postnatal_care_service',
  TREATMENT_FOLLOW_UP: 'treatment_follow_up',
  OVER_FIVE_ASSESSMENT: 'over_five_assessment',
  PREGNANCY_HOME_VISIT: 'pregnancy_home_visit',
  IMMUNIZATION_SERVICE: 'immunization_service',
  U5_ASSESSMENT: 'u5_assessment',
  HOUSEHOLD_MEMBER_REGISTRATION_REMINDER: 'household_member_registration_reminder',
  COMMUNITY_EVENT: 'community_event',
  POSTNATAL_CARE_SERVICE_NEWBORN: 'postnatal_care_service_newborn',
  SGBV: 'sgbv',
  DEATH_REVIEW: 'death_review',
  COMMODITES_ORDER: 'commodities_order',
  COMMODITES_RECEIVED: 'commodity_received',
  COMMODITES_SUPPLIED: 'commodity_supply',
  COMMODITES_COUNT: 'commodity_count',
  COMMODITES_RETURN: 'commodity_return',
  COMMODITES_RETURNED: 'commodity_returned',
  COMMODITES_DISCREPANCY_RESOLUTION: 'commodity_discrepancy',
  COMMODITES_STOCK_OUT: 'commodity_stockout',
  CHV_CONSUMPTION_LOG: 'chv_consumption_log',
  COMMODITY_RECEIVED_CONFRIMATION: 'commodity_received_confirmation',
  COMMODITIES_DISCREPANCY_RECONCILIATION: 'stock_ammendment',
  COMMODITY_RETURNED_CONFIRMATION: 'commodity_returned_confirmation',
  UNMUTE_PERSON: 'unmute_person',
  UNMUTE_HOUSEHOLD: 'unmute_household',
  APPROVE_MUTE_PERSON: 'approve_mute_person',
  APPROVE_MUTE_HOUSEHOLD: 'approve_mute_household',
  CHU_SUPERVISION: 'chu_supervision',
  CHV_SUPERVISION: 'chv_supervision',
  CHA_SUPERVISION_CALENDAR: 'cha_supervision_calendar',
  CEBS_CHV_SIGNAL_REPORTING: 'chv_signal_reporting',
  CEBS_CHA_SIGNAL_REPORTING_VERIFICATION: 'cha_signal_reporting_verification',
  CEBS_CHA_SIGNAL_VERIFICATION: 'cha_signal_verification',
  SOCIO_ECONOMIC_SURVEY_PERSON: 'socio_economic_survey_person',
  SOCIO_ECONOMIC_SURVEY: 'socio_economic_survey',
  CLIENT_DETAILS_NOTIFICATION: 'patient_details_reminder',
  CLIENT_DETAILS_MISMATCH: 'CLIENT_DETAILS_MISMATCH'
};

const TASKS = {
  fp_side_effects: 'task.fp_side_effects_referral_follow_up.title',
  fp_refill_service: 'task.family_planning_service.title',
  immunization_service: 'task.immunization.title',
  anc_defaulter_service: 'task.anc-defaulter-referral-follow-up-service.title',
  anc_danger_signs_referral_follow_up: 'task.anc-danger-signs-referral-follow-up-service.title',
  anc_mental_referral_follow_up: 'task.anc-mental-signs-referral-follow-up-service.title',
  pregnancy_home_visit_service: 'task.pregnancy_home_visit_service.title',
  pnc_mother_danger_signs: 'task.pnc_mother_danger_signs.title',
  newborn_danger_signs: 'task.pnc_newborn_danger_signs.title',
  pnc_newborn_immunization: 'task.pnc_newborn_immunization.title',
  death_confirmation: 'task.death_report_confirmation.title',
  chv_commodity_receipt: 'task.commodity.received.title',
  chv_commodity_count: 'task.commodity.count.title',
  cha_commodity_returned: 'task.commodity.returned.title',
  cha_commodity_supplied_reconciliation: 'task.commodity.supplied.reconciliation.title',
  cha_commodity_stock_out: 'task.commodity.stock.out.title',
  sgbv_referral_follow_up: 'task.sgbv_referral_follow_up.title',
  cha_verbal_autopsy: 'task.cha_verbal_autopsy.title',
  chv_supervision: 'task.chv_supervision.title',
  over5_3day_referral: 'task.over_five_referral_service_3_day.title',
  under5_3day_referral: 'task.u5_assessment_3_day_referral_follow_up.title',
  danger_signs_referral_follow_up: 'task.danger_sign_over_five_referral_service.title',
  //TODO: the above are potential duplicates. Might be workthwhile to just have a 3-day referral service
  ceb_signal_verification: 'task.ceb_signal_verification.title',
  hh_update_member_cr: 'task.cr_contact.update'
};

const Places = {
  COUNTY: 'a_county',
  SUB_COUNTY: 'b_sub_county',
  CHU: 'c_community_health_unit',
  CHV_AREA: 'd_community_health_volunteer_area',
  HOUSEHOLD: 'e_household'
};

const Persons = {
  USER: 'person',
  CLIENT: 'f_client'
};

const countTotalVaccinesByAge = (contact) => {
  const ageInWeeks = differenceInWeeks(contact.date_of_birth, new Date());
  let filteredCount = 0;
  if (ageInWeeks >= 0) {
    filteredCount += 2; // BCG, OPV0
  }
  if (ageInWeeks >= 6) {
    filteredCount += 4; // OPV1, PCV1, ROTA1, PENTA1
  }
  if (ageInWeeks >= 10) {
    filteredCount += 4; // OPV2, PCV2, ROTA1, PENTA2
  }
  if (ageInWeeks >= 14) {
    filteredCount += 5; // OPV3, PCV3, ROTA3, IPV, PENTA3
  }
  if (ageInWeeks >= 24) {
    filteredCount += 1; // VitA, MMR6 is optional
  }
  if (ageInWeeks >= 36) {
    filteredCount += 1; // MMR9
  }
  if (ageInWeeks >= 72) {
    filteredCount += 1; // MMR18
  }
  return filteredCount;
};

const countTotalVitaminAVaccinesByAge = (contact) => {
  const ageInMonths = differenceInMonths(contact.date_of_birth, new Date());
  let filteredCount = 0;
  [6, 12, 18, 24, 30, 36, 42, 48, 54, 60].forEach(age => {
    if (ageInMonths >= age) {
      filteredCount += 1;
    }
  });
  return filteredCount;
};

const extractVaccinations = (record) => record.split(' ').map((item) => VACCINATIONS[item]);

const mapImmunizationServiceVaccineAnswers = (vaccines) => {
  return vaccines.replace(/_(\d{1})\b/g, '$1').replace(/(\d{1})_months\b/g, '$1').replace('vitamin_a', 'vit_a');
};

const getVaccinesReceived = reports => {
  let vaccinations = [];
  reports.forEach((report) => {
    const immunizations = report.form === Services.IMMUNIZATION_SERVICE ? getField(report, 'group_vaccines.vaccines_given') : getField(report, 'immunization_screening.vaccines');
    if (immunizations) {
      vaccinations = vaccinations.concat(extractVaccinations(mapImmunizationServiceVaccineAnswers(immunizations)));
    }
  });
  vaccinations = Array.from(new Set(vaccinations));
  return vaccinations;
};

const getNewbornHomeVisitCount = reports => {
  return reports.filter(report => report.form === Services.POSTNATAL_CARE_SERVICE_NEWBORN && getField(report, 'is_patient_available') === 'true').length;
};

const MAX_NEWBORN_AGE_IN_DAYS = 28;

const DELIVERY_CHECK_WEEKS = {
  START: 28,
  END: 44
};

const isFemaleOrIntersex = (contact) => contact.sex && (contact.sex === 'female' || contact.sex === 'intersex');
const isMale = (contact) => contact.sex && contact.sex === 'male';

const Targets = {
  TOTAL_MALES: 'total-population-male-all-time',
  WOMEN_15_49: 'total-population-women-15-49-yr',
  TOTAL_FEMALES: 'total-population-female-all-time',
  SKILLED_DELIVERIES: 'skilled-deliveries-cha-percent',
  U5_ASSESSMENTS: 'percent-under-5-assessed',
  HH_FUNCTIONAL_LATRINES: 'percent-hh-functional-latrine',
  EXCLUSIVE_BREASTFEEDING: 'percent-exclusive-breastfeeding',
  HH_VISITED: 'count-households-visited',
  ACTIVE_PREGNANCIES: 'total-active-pregnancies',
  UNDER_1_POPULATION: 'total-population-under-1',
  UNDER_5_POPULATION: 'total-population-under-5',
  PERCENT_POPULATION_LT_2_MONTHS_ASSESSED: 'percent-population-under-2-months-assessed',
  U5_WITH_MALARIA_TREATED: 'u5-with-malaria-treated',
  PERCENT_POPULATION_2_TO_59_MONTHS_ASSESSED: 'percent-population-2-to-59-months-assessed',
  TOTAL_REFERRALS: 'total-referrals',
  PERCENT_POPULATION_OVER_5_YEARS_ASSESSED: 'percent-population-over-5-years-assessed',
  U5_WITH_PNEUMONIA_TREATED: 'u5-with-pneumonia-treated',
  U5_WITH_DIARRHOEA_TREATED: 'u5-with-diarrhoea-treated',
  GAM_RATE: 'global-acute-malnutrition-rate',
  CHILDREN_WITH_UPTODATE_GROWTH_MONITORING: 'children-with-uptodate-growth-monitoring',
  NEW_PREGNANT: 'new-pregnant-women',
  PERCENT_POPULATION_OVER_2_MONTHS_SUSPECTED_MALARIA_TESTED_WITH_MRDT: 'percent-population-over-two-months-with-suspected-malaria-tested-with-mrdt',
  PERCENT_REFERRED_TB_CASES_FOLLOWED_UP: 'percent-tb-cases-follow-up'
};

const isEligibleNewborn = contact => differenceInDays(contact.date_of_birth, new Date()) < MAX_NEWBORN_AGE_IN_DAYS && isEligibleForTasks(contact);
const getHouseholdId = (contact) => contact.contact && contact.contact.contact_type === Places.HOUSEHOLD ? contact.contact._id : contact.contact.parent && contact.contact.parent._id;

const getLastChvSupervisionSummary = (reports) => {
  const validReports = reports.filter(report => report.form === Services.CHV_SUPERVISION && getField(report, 'group_visit.is_available') === 'yes');
  const recentSupervisionReport = getMostRecentReport(validReports, Services.CHV_SUPERVISION);
  return {
    last_visit_date: recentSupervisionReport && DateTime.fromMillis(recentSupervisionReport.reported_date).toISODate() || '',
    last_visit_action_points: recentSupervisionReport && getField(recentSupervisionReport, 'group_action_points.next_steps') || '',
    supervision_visit_count: recentSupervisionReport && getField(recentSupervisionReport, 'supervision_visit_count') || 0
  };
};

const isInMuteQueue = reports => {
  const newestMuteReport = getMostRecentReport(reports, [Services.MUTE_PERSON, Services.MUTE_HOUSEHOLD]);
  const newestMuteConfirmationReport = getMostRecentReport(reports, [Services.APPROVE_MUTE_PERSON, Services.APPROVE_MUTE_HOUSEHOLD]);
  return newestMuteReport && (newestMuteConfirmationReport && newestMuteConfirmationReport.reported_date < newestMuteReport.reported_date || !newestMuteConfirmationReport);
};

const isInDeathConfirmationQueue = reports => {
  const newestDeathReport = getMostRecentReport(reports, Services.DEATH_REPORT);
  const newestDeathConfirmationReport = getMostRecentReport(reports, Services.DEATH_REVIEW);
  return newestDeathReport && (newestDeathConfirmationReport && newestDeathConfirmationReport.reported_date < newestDeathReport.reported_date || !newestDeathConfirmationReport);
};

const getMemberSocioEconomicSummary = (contact, reports) => {
  const report = getMostRecentReport(reports, Services.SOCIO_ECONOMIC_SURVEY_PERSON) || {};
  return {
    identification_type: getField(report, 'group_demographics.identification_type') || contact.identification_type,
    identification_type_other: getField(report, 'group_demographics.identification_type_other') || contact.identification_type_other,
    identification_number: getField(report, 'group_demographics.identification_number') || contact.identification_number,
    relationship_to_hh_head: getField(report, 'group_demographics.relationship_to_hh_head') || contact.relationship_to_hh_head,
    relationship_to_hh_other: getField(report, 'group_demographics.relationship_to_hh_other') || contact.relationship_to_hh_other,
    sex: getField(report, 'group_demographics.sex') || contact.sex,
    date_of_birth: getField(report, 'group_demographics.date_of_birth') || contact.date_of_birth,
    marital_status: getField(report, 'group_demographics.marital_status') || '',
    spouse_live_in_house: getField(report, 'group_demographics.spouse_live_in_house') || '',
    spouse_contact_uuid: getField(report, 'group_demographics.spouse_contact_uuid') || '',
    is_father_alive: getField(report, 'group_demographics.is_father_alive') || '',
    is_mother_alive: getField(report, 'group_demographics.is_mother_alive') || '',
    has_chronic_illness: getField(report, 'group_demographics.has_chronic_illness') || contact.has_chronic_illness,
    chronic_illnesses: getField(report, 'group_demographics.chronic_illnesses') || contact.chronic_illnesses,
    chronic_illnesses_other: getField(report, 'group_demographics.chronic_illnesses_other') || contact.chronic_illnesses_other,
    disability: getField(report, 'group_demographics.disability') || contact.disability,
    disability_other: getField(report, 'group_demographics.disability_other') || contact.disability_other,
    requires_24_hour_care: getField(report, 'group_demographics.requires_24_hour_care') || '',
    main_care_giver_id: getField(report, 'group_demographics.main_care_giver_id') || '',
    school_attendance_status: getField(report, 'group_demographics.school_attendance_status') || '',
    education_level: getField(report, 'group_demographics.education_level') || '',
    other_education_level: getField(report, 'group_demographics.other_education_level') || '',
    doing_last_7_days: getField(report, 'group_demographics.doing_last_7_days') || '',
    work_formal: getField(report, 'group_demographics.work_formal') || ''
  };
};

const getHouseholdSocioEconomicSummary = (reports) => {
  const report = getMostRecentReport(reports, Services.SOCIO_ECONOMIC_SURVEY);
  return {
    group_geographic_identification: report ? report.fields.group_geographic_identification : {},
    group_dwelling_and_household: report ? report.fields.group_dwelling_and_household : {},
    group_wash: report ? report.fields.group_wash : {},
    group_fuel: report ? report.fields.group_fuel : {},
    group_house_asset_ownership: report ? report.fields.group_house_asset_ownership : {},
    group_social_assistance: report ? report.fields.group_social_assistance : {}
  };
};

const clientRegistryFields = ['first_name', 'last_name', 'phone', 'nationality', 'country_of_birth',
  'county_of_residence', 'subcounty', 'ward', 'village', 'identification_type', 'identification_number'
];

module.exports = {
  isEligibleForTasks,
  TASKS,
  Services,
  Places,
  Persons,
  DAYS_IN_YEAR,
  differenceInDays,
  differenceInYears,
  FAMILY_PLANNING_METHODS,
  MS_IN_DAY,
  sortReports,
  PNC_PERIOD_DAYS,
  MAX_PREGNANCY_AGE_IN_WEEKS,
  getPregnancyAgeInWeeks,
  VACCINATIONS,
  VITAMIN_A_DOSES,
  getField,
  getVaccinesReceived,
  countTotalVaccinesByAge,
  countTotalVitaminAVaccinesByAge,
  mapImmunizationServiceVaccineAnswers,
  getNewbornHomeVisitCount,
  MAX_NEWBORN_AGE_IN_DAYS,
  DELIVERY_CHECK_WEEKS,
  DAYS_IN_WEEK,
  differenceInWeeks,
  differenceInMonths,
  isSCHMT,
  isCHMT,
  isCha,
  isChv,
  isMale,
  isFemaleOrIntersex,
  Targets,
  getHouseholdId,
  isEligibleNewborn,
  getLastChvSupervisionSummary,
  DateTime,
  Interval,
  getMostRecentReport,
  isOfChildBearingAge,
  getMemberSocioEconomicSummary,
  getHouseholdSocioEconomicSummary,
  clientRegistryFields
};
