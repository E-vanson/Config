const shared = require('./common-extras');
const summaryExtras = require('./contact-summary-extras');

const { DateTime } = require('luxon');

const {
  isEligibleForTasks,
  Persons,
  Places,
  isMale,
  isFemaleOrIntersex,
  Services,
  Targets,
  getHouseholdId,
  getField,
} = shared;

const {
  isHouseholdMember,
  isPregnant,
  getMostRecentReport
} = summaryExtras;

const {
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
  MALNUTRITION_MUAC_COLORS
} = require('./nools-extras');

module.exports = [
  {
    id: 'total-population-male-all-time',
    translation_key: 'targets.population.male.title',
    subtitle_translation_key: 'targets.all_time.subtitle',
    type: 'count',
    icon: 'icon-man',
    goal: -1,
    appliesTo: 'contacts',
    appliesToType: [Persons.CLIENT],
    appliesIf: (c) => isHouseholdMember(c.contact) && isEligibleForTasks(c.contact) && isMale(c.contact),
    date: 'now'
  },
  {
    id: Targets.WOMEN_15_49,
    translation_key: 'targets.population.women_15_49',
    subtitle_translation_key: 'targets.all_time.subtitle',
    type: 'count',
    icon: 'icon-woman',
    goal: -1,
    appliesTo: 'contacts',
    appliesToType: [Persons.CLIENT],
    appliesIf: (c) => {
      const age = ageInYears(c.contact.date_of_birth);
      const ageValid = age >= 15 && age <= 49;
      return isHouseholdMember(c.contact) && isEligibleForTasks(c.contact) && isFemaleOrIntersex(c.contact) && ageValid;
    },
    date: 'now'
  },
  {
    id: 'total-population-female-all-time',
    translation_key: 'targets.population.female.title',
    subtitle_translation_key: 'targets.all_time.subtitle',
    type: 'count',
    icon: 'icon-woman',
    goal: -1,
    appliesTo: 'contacts',
    appliesToType: [Persons.CLIENT],
    appliesIf: (c) => {
      const state = isHouseholdMember(c.contact) && isEligibleForTasks(c.contact) && isFemaleOrIntersex(c.contact);
      return state;
    },
    date: 'now'
  },
  {
    id: Targets.HH_VISITED,
    translation_key: 'targets.household.visited.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    type: 'percent',
    goal: 100,
    icon: 'icon-community-health-unit',
    appliesTo: 'contacts',
    appliesToType: [Places.HOUSEHOLD, Persons.CLIENT],
    idType: 'contact',
    groupBy: (contact) => getHouseholdId(contact),
    passesIfGroupCount: { gte: 1 },
    appliesIf: (contact) => Boolean(getHouseholdId(contact)),
    emitCustom: (emit, original, contact) => {
      const householdId = getHouseholdId(contact);

      for (const report of contact.reports.filter((report) => [Services.U5_ASSESSMENT, Services.OVER_FIVE_ASSESSMENT].includes(report.form))) {
        const visitDate = DateTime.fromMillis(parseInt(report.reported_date || 0));
        if (visitDate) {
          const instance = Object.assign({}, original, {
            _id: `${householdId}-${visitDate.toFormat('yyyy-MM-dd')}`,
            pass: true,
            date: visitDate.toMillis(),
          });
          emit(instance);
        }
      }

      // Emit one failing instance so the household is counted even if it has no reports
      if (contact.contact && [Places.HOUSEHOLD, Persons.CLIENT].includes(contact.contact.contact_type)) {
        emit(Object.assign({}, original, {
          _id: householdId,
          date: Date.now(),
          pass: false,
        }));
      }
    }
  },
  {
    id: Targets.UNDER_1_POPULATION,
    translation_key: 'targets.population.under_1',
    subtitle_translation_key: 'targets.all_time.subtitle',
    type: 'count',
    icon: 'icon-baby',
    goal: -1,
    appliesTo: 'contacts',
    appliesToType: [Persons.CLIENT],
    appliesIf: (c) => {
      return isHouseholdMember(c.contact) && isEligibleForTasks(c.contact) && ageInYears(c.contact.date_of_birth) < 1;
    },
    date: 'now'
  },
  {
    id: Targets.ACTIVE_PREGNANCIES,
    translation_key: 'targets.population.active_pregnancies',
    subtitle_translation_key: 'targets.all_time.subtitle',
    type: 'count',
    icon: 'icon-pregnancy-home-visit-service',
    goal: -1,
    appliesTo: 'contacts',
    appliesToType: [Persons.CLIENT],
    appliesIf: (c) => {
      return isHouseholdMember(c.contact) && isEligibleForTasks(c.contact) && isFemaleOrIntersex(c.contact) && isPregnant(c.contact, c.reports);
    },
    date: 'now'
  },
  {
    id: Targets.UNDER_5_POPULATION,
    translation_key: 'targets.population.under_5',
    subtitle_translation_key: 'targets.all_time.subtitle',
    type: 'count',
    icon: 'icon-baby',
    goal: -1,
    appliesTo: 'contacts',
    appliesToType: [Persons.CLIENT],
    appliesIf: (c) => {
      return isHouseholdMember(c.contact) && isEligibleForTasks(c.contact) && ageInYears(c.contact.date_of_birth) < 5;
    },
    date: 'now'
  },
  {
    id: Targets.PERCENT_POPULATION_LT_2_MONTHS_ASSESSED,
    type: 'percent',
    icon: 'icon-child-growth',
    goal: 100,
    translation_key: 'targets.assessments.percentage.lt.2.months.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'contacts',
    appliesToType: [Persons.CLIENT],
    appliesIf: function (c) {
      return isHouseholdMember(c.contact) && isEligibleForTasks(c.contact) && ageInMonths(c.contact.date_of_birth) < 2;
    },
    passesIf: function (contact) {
      return contact.reports.some(report => report.form === Services.U5_ASSESSMENT && isReportedThisMonth(report));
    },
    idType: 'contact',
    date: 'now'
  },
  {
    id: Targets.PERCENT_POPULATION_2_TO_59_MONTHS_ASSESSED,
    type: 'percent',
    icon: 'icon-child-growth',
    goal: 100,
    translation_key: 'targets.assessments.percentage_2_to_59_months.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'contacts',
    appliesToType: [Persons.CLIENT],
    appliesIf: function (c) {
      const age = ageInMonths(c.contact.date_of_birth);
      return isHouseholdMember(c.contact) && isEligibleForTasks(c.contact) && age >= 2 && age < 60;
    },
    passesIf: function (contact) {
      return contact.reports.some(report => report.form === Services.U5_ASSESSMENT && isReportedThisMonth(report));
    },
    idType: 'contact',
    date: 'now'
  },
  {
    id: Targets.PERCENT_POPULATION_OVER_5_YEARS_ASSESSED,
    type: 'percent',
    icon: 'icon-healthcare-assessment',
    goal: 100,
    translation_key: 'targets.assessments.percentage_over_5_years.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'contacts',
    appliesToType: [Persons.CLIENT],
    appliesIf: function (c) {
      return isHouseholdMember(c.contact) && isEligibleForTasks(c.contact) && ageInYears(c.contact.date_of_birth) > 5;
    },
    passesIf: function (contact) {
      return contact.reports.some(report => report.form === Services.OVER_FIVE_ASSESSMENT && isReportedThisMonth(report));
    },
    idType: 'contact',
    date: 'now'
  },
  {
    id: Targets.U5_WITH_PNEUMONIA_TREATED,
    type: 'percent',
    icon: 'icon-disease-pneumonia',
    goal: 100,
    translation_key: 'targets.u5_with_pneumonia_treated.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'contacts',
    appliesToType: [Persons.CLIENT],
    appliesIf: function (c) {
      return isHouseholdMember(c.contact) &&
        isEligibleForTasks(c.contact) &&
        ageInYears(c.contact.date_of_birth) < 5 &&
        c.reports.some(report => isReportedThisMonth(report) && isUnder5WithPneumonia(report));
    },
    passesIf: function (contact) {
      return contact.reports.some(report => isUnder5WithPneumoniaTreated(report));
    },
    idType: 'contact',
    date: 'now'
  },
  {
    id: Targets.U5_WITH_MALARIA_TREATED,
    type: 'percent',
    icon: 'icon-disease-malaria',
    goal: 100,
    translation_key: 'targets.u5_with_malaria_treated.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'contacts',
    appliesToType: [Persons.CLIENT],
    appliesIf: function (c) {
      return isHouseholdMember(c.contact) &&
        isEligibleForTasks(c.contact) &&
        ageInYears(c.contact.date_of_birth) < 5 &&
        c.reports.some(report =>
          report.form === Services.U5_ASSESSMENT &&
          isReportedThisMonth(report) &&
          getField(report, 'malaria_screening.malaria_test_positive') === 'true');
    },
    passesIf: function (contact) {
      return contact.reports.some(
        report =>
          report.form === Services.U5_ASSESSMENT &&
          isReportedThisMonth(report) &&
          getField(report, 'group_summary_no_danger_signs.r_given_al') === 'yes'
      );
    },
    idType: 'contact'
  },
  {
    id: 'percent-hh-functional-latrine',
    type: 'percent',
    icon: 'icon-people-family',
    goal: 100,
    translation_key: 'targets.percent-hh-functional-latrine.title',
    context: 'user.parent && user.parent.contact_type === "c_community_health_unit"',
    appliesTo: 'contacts',
    appliesToType: ['e_household'],
    emitCustom: (emit, original, contact) => {
      const householdId = contact.contact._id;
      const mostRecentWashReport = getMostRecentReport(contact.reports, Services.WASH);

      if (mostRecentWashReport && Utils.getField(mostRecentWashReport, 'group_wash.has_functional_latrine') === 'yes') {
        emit(Object.assign({}, original, {
          _id: householdId, //Emits a passing target instance with the household ID as the target instance ID
          pass: true
        }));
      }

      if (mostRecentWashReport && Utils.getField(mostRecentWashReport, 'group_wash.has_functional_latrine') !== 'yes') {
        emit(Object.assign({}, original, {
          _id: householdId, //Emits a passing target instance with the household ID as the target instance ID
          pass: false
        }));
      }
    },
    groupBy: contact => contact.contact._id,
    passesIfGroupCount: { gte: 1 },
    date: 'now'
  },
  {
    id: Targets.U5_WITH_DIARRHOEA_TREATED,
    type: 'percent',
    icon: 'icon-condition-diarrhea',
    goal: 100,
    translation_key: 'targets.u5_with_diarrhoea_treated.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'contacts',
    appliesToType: [Persons.CLIENT],
    appliesIf: function (c) {
      return isHouseholdMember(c.contact) &&
        isEligibleForTasks(c.contact) &&
        ageInYears(c.contact.date_of_birth) < 5 &&
        c.reports.some(report =>
          report.form === Services.U5_ASSESSMENT &&
          isReportedThisMonth(report) &&
          getField(report, 'u5_assessment.has_diarrhoea') === 'yes');
    },
    passesIf: function (contact) {
      return contact.reports.some(
        report =>
          report.form === Services.U5_ASSESSMENT &&
          isReportedThisMonth(report) &&
          (
            (getField(report, 'group_summary_no_danger_signs.r_given_ors') === 'yes' && getField(report, 'group_summary_no_danger_signs.r_given_zinc') === 'yes') ||
            (getField(report, 'group_summary_danger_signs.r_dt_given_ors') === 'yes' && getField(report, 'group_summary_danger_signs.r_dt_diarrhoea_given_zinc') === 'yes')
          )
      );
    },
    idType: 'contact',
    date: 'now'
  },
  {
    id: Targets.TOTAL_REFERRALS,
    translation_key: 'targets.referrals.total',
    subtitle_translation_key: 'targets.this_month.subtitle',
    type: 'count',
    icon: 'icon-follow-up',
    goal: -1,
    appliesTo: 'reports',
    appliesToType: Object.keys(FIELDS_FOR_CHV_REFERRAL),
    appliesIf: isReferredByCHV,
    date: 'reported',
    idType: 'report'
  },
  {
    id: 'skilled-deliveries-cha-percent',
    type: 'percent',
    icon: 'icon-delivery',
    goal: 100,
    translation_key: 'targets.skilled-deliveries-percent.title',
    context: 'user.parent && user.parent.contact_type === "c_community_health_unit"',
    appliesTo: 'reports',
    idType: 'report',
    appliesIf: function (contact, report) {
      return report.form === 'postnatal_care_service' && Utils.getField(report, 'group_pregnancy_status.has_delivered') === 'yes';
    },
    passesIf: function (contact, report) {
      return Utils.getField(report, 'group_pnc_visit.place_of_delivery') === 'health_facility';
    },
    date: 'now',
  },
  {
    id: Targets.CHILDREN_WITH_UPTODATE_GROWTH_MONITORING,
    translation_key: 'targets.children_with_uptodate_growth_monitoring.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    type: 'percent',
    icon: 'icon-baby',
    goal: 100,
    appliesTo: 'contacts',
    context: 'user.parent && user.parent.contact_type === "c_community_health_unit"',
    appliesToType: [Persons.CLIENT],
    appliesIf: function (c) {
      return isHouseholdMember(c.contact) &&
        isEligibleForTasks(c.contact) &&
        ageInYears(c.contact.date_of_birth) < 5;
    },
    passesIf: function (c) {
      return c.reports.some(report =>
        Object.keys(FIELDS_FOR_GROWTH_MONITORING).includes(report.form) &&
        isReportedThisMonth(report) &&
        getField(report, FIELDS_FOR_GROWTH_MONITORING[report.form]) === 'yes'
      );
    },
    idType: 'contact',
    date: 'now'
  },
  {
    id: Targets.GAM_RATE,
    translation_key: 'targets.gam_rate.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    type: 'percent',
    icon: 'icon-child-nutrition',
    goal: -1,
    appliesTo: 'contacts',
    appliesToType: [Persons.CLIENT],
    context: 'user.parent && user.parent.contact_type === "c_community_health_unit"',
    appliesIf: function (c) {
      return isHouseholdMember(c.contact) &&
        isEligibleForTasks(c.contact) &&
        ageInYears(c.contact.date_of_birth) < 5 &&
        c.reports.some(report =>
          report.form === Services.U5_ASSESSMENT &&
          isReportedThisMonth(report) &&
          MUAC_COLORS.includes(getField(report, 'malnutrition_screening.muac_color'))
        );
    },
    passesIf: function (c) {
      return c.reports.some(report =>
        report.form === Services.U5_ASSESSMENT &&
        isReportedThisMonth(report) &&
        MALNUTRITION_MUAC_COLORS.includes(getField(report, 'malnutrition_screening.muac_color'))
      );
    },
    idType: 'contact',
    date: 'now'
  },
  {
    id: Targets.NEW_PREGNANT,
    translation_key: 'targets.new_pregnancies.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    type: 'count',
    icon: 'icon-pregnancy-home-visit-service',
    goal: -1,
    appliesTo: 'contacts',
    context: 'user.parent && user.parent.contact_type === "c_community_health_unit"',
    appliesToType: [Persons.CLIENT],
    appliesIf: c => c.reports.some(r => isReportedThisMonth(r) &&
      r.form === Services.PREGNANCY_HOME_VISIT &&
      getField(r, 'marked_as_pregnant') === 'true'
    ),
    date: 'now'
  },
  {
    id: Targets.PERCENT_POPULATION_OVER_2_MONTHS_SUSPECTED_MALARIA_TESTED_WITH_MRDT,
    translation_key: 'targets.over_two_months_with_suspected_malaria_tested_with_mrdt.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    type: 'percent',
    icon: 'icon-healthcare-mrdt',
    goal: 100,
    appliesTo: 'contacts',
    context: 'user.parent && user.parent.contact_type === "c_community_health_unit"',
    appliesToType: [Persons.CLIENT],
    appliesIf: function (c) {
      return isHouseholdMember(c.contact) &&
        isEligibleForTasks(c.contact) &&
        ageInMonths(c.contact.date_of_birth) > 2 &&
        c.reports.some(report =>
          Object.keys(FIELDS_FOR_MRDT_RESULT).includes(report.form) &&
          isReportedThisMonth(report) &&
          MRDT_RESULT_OPTIONS.includes(getField(report, FIELDS_FOR_MRDT_RESULT[report.form]))
        );
    },
    passesIf: function (c) {
      return c.reports.some(report =>
        Object.keys(FIELDS_FOR_MRDT_RESULT).includes(report.form) &&
        isReportedThisMonth(report) &&
        MRDT_TEST_RESULT_OPTIONS.includes(getField(report, FIELDS_FOR_MRDT_RESULT[report.form]))
      );
    },
    idType: 'contact',
    date: 'now'
  },
  {
    id: 'percent-exclusive-breastfeeding',
    type: 'percent',
    icon: 'icon-baby',
    goal: 100,
    translation_key: 'targets.percent-exclusive-breastfeeding.title',
    context: 'user.parent && user.parent.contact_type === "c_community_health_unit"',
    appliesTo: 'contacts',
    appliesToType: [Persons.CLIENT],
    appliesIf: function (contact) {
      const date6MonthsAgo = DateTime.now().minus({ month: 6 }).toISODate();
      return isHouseholdMember(contact.contact) && isEligibleForTasks(contact.contact) && (contact.contact.date_of_birth > date6MonthsAgo);
    },
    passesIf: function (contact) {
      return contact.reports.some(report => report.form === Services.U5_ASSESSMENT && Utils.getField(report, 'nutrition_screening.is_breastfeeding_exclusively') === 'yes' && isReportedThisMonth(report));
    },
    idType: 'contact',
    date: 'now'
  },
  {
    id: Targets.PERCENT_REFERRED_TB_CASES_FOLLOWED_UP,
    type: 'percent',
    icon: 'icon-follow-up',
    goal: 100,
    translation_key: 'targets.percent-tb-cases-follow-up.title',
    context: 'user.parent && user.parent.contact_type === "c_community_health_unit"',
    appliesTo: 'reports',
    idType: 'report',
    appliesIf: function (contact, report) {
      const symptoms = ['tb_contact', 'chest_pain', 'weight_loss_failure_to_thrive', 'night_sweats', 'fatigue'];
      return (report.form === 'u5_assessment' &&
        (
          Utils.getField(report, 'u5_assessment.has_cough') === 'yes' &&
          Utils.getField(report, 'u5_assessment.has_contact_with_tb') === 'yes'
        )
      )
        || (report.form === 'over_five_assessment' &&
          (
            Utils.getField(report, 'group_tb.tb_symptoms') &&
            (Utils.getField(report, 'group_tb.tb_symptoms').split(' ')).some(over_5_symptom => symptoms.some(symptom => symptom === over_5_symptom))
          )
        );
    },
    passesIf: function (contact) {
      return contact.reports.filter(r => r.form === 'referral_follow_up' && isReportedThisMonth(r) && Utils.getField(r, 'referral_reason').includes('tb')).length;
    },
    date: function (contact, report) {
      const reports = contact.reports.filter(r => r.form === 'referral_follow_up' && isReportedThisMonth(r) && Utils.getField(r, 'referral_reason').includes('tb'));
      return reports.length && new Date(reports[0].reported_date) || new Date(report.reported_date);
    }
  },
];
