const {
  Services, VACCINATIONS, differenceInDays, differenceInWeeks, DELIVERY_CHECK_WEEKS, MAX_PREGNANCY_AGE_IN_WEEKS, DAYS_IN_WEEK, isChv, isCha,
  isEligibleNewborn, getLastChvSupervisionSummary, TASKS, Places, Persons
} = require('./common-extras');

const extras = require('./nools-extras');
const { suppliedContent, discrepancyContent, returnedContent, hasDiscrepancy, hasStockOut, stockOutContent } = require('./commodityFunctions');
const { hasClientRegistryFields } = require('./contact-summary-extras');
const {
  isEligibleForTasks,
  isFormArraySubmittedInWindow,
  PNC_PERIOD_DAYS,
  getVaccinesReceived,
  countTotalVaccinesByAge,
  getNewbornHomeVisitCount,
  getMostRecentEddForPregnancy,
  isPregnancyTaskMuted,
  startOfMonthDate,
  midMonthDate,
  FIELDS_FOR_CHV_SUPERVISION,
  DateTime,
  FIELDS_FOR_CHV_SUPERVISION_TASK,
  isChvPerson,
  FIELDS_FOR_SGBV_REFERRAL
} = extras;

const generateEventForNewbornHomeVisit = (count, start, end) => ({
  id: `newborn-home-visit-${count}`,
  start,
  end,
  dueDate: function (event, contact) {
    let days = 0;
    if (count === 1) {
      days = contact.contact.place_of_birth === 'home' ? 1 : 2;
    } else {
      days = count === 2 ? 3 : 7;
    }
    return Utils.addDate(new Date(contact.contact.date_of_birth), days);
  }
});

const generateEventForDeliveryCheckHomeVisit = (week, start, end) => ({
  id: `delivery-check-home-visit-week${week}`,
  start,
  end,
  dueDate: function (event, contact) {
    const edd = getMostRecentEddForPregnancy(contact.reports);
    return Utils.addDate(new Date(edd), week * DAYS_IN_WEEK);
  }
});


const postNatalCareTemplate = ({
  name,
  customAppliesIf,
  events,
}) => ({
  name: `postnatal_care_yields_postnatal_care-${name}`,
  icon: 'icon-postnatal-care-service',
  title: 'task.pnc_mother_followup.title',
  appliesTo: 'reports',
  appliesToType: ['postnatal_care_service'],
  appliesIf: function (contact, report) {
    const boundAppliesIf = customAppliesIf.bind(this);
    return isChv(user) && isEligibleForTasks(contact.contact) &&
      Utils.getField(report, 'is_in_postnatal_care') === 'yes' && boundAppliesIf(contact, report);
  },
  resolvedIf: (contact, report, event, dueDate) => {
    return isFormArraySubmittedInWindow(
      contact.reports.filter(r => Utils.getField(r, 'group_follow_up.client_available') === 'yes'),
      ['postnatal_care_service'],
      dueDate,
      event,
      null,
      report._id);
  },
  actions: [{
    type: 'report',
    form: 'postnatal_care_service'
  }],
  events,
});

const postnatalEvents = [{
  id: 'mother-postnatal-follow-up-0',
  start: 0,
  end: 0,
  dueDate: function (event, contact, report) {
    return Utils.addDate(new Date(Utils.getField(report, 'group_pnc_visit.date_of_delivery')), 1);
  }
},
{
  id: 'mother-postnatal-follow-up-1',
  start: 0,
  end: 0,
  dueDate: function (event, contact, report) {
    return Utils.addDate(new Date(Utils.getField(report, 'group_pnc_visit.date_of_delivery')), 2);
  }
},
{
  id: 'mother-postnatal-follow-up-2',
  start: 0,
  end: 3,
  dueDate: function (event, contact, report) {
    return Utils.addDate(new Date(Utils.getField(report, 'group_pnc_visit.date_of_delivery')), 3);
  }
},
{
  id: 'mother-postnatal-follow-up-3',
  start: 0,
  end: 3,
  dueDate: function (event, contact, report) {
    return Utils.addDate(new Date(Utils.getField(report, 'group_pnc_visit.date_of_delivery')), 7);
  }
}];

module.exports = [
  {
    name: 'household_member_registration_reminder',
    icon: 'icon-person',
    title: 'task.household_member_registration_reminder',
    appliesTo: 'contacts',
    appliesToType: ['e_household'],
    appliesIf: function (contact) {
      return isChv(user) && isEligibleForTasks(contact.contact) && contact.contact.needs_registration_follow_up === 'yes';
    },
    actions: [{ form: 'household_member_registration_reminder' }],
    events: [
      {
        id: 'household_member_registration_reminder',
        days: 7,
        start: 7,
        end: 2,
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return Utils.isFormSubmittedInWindow(
        contact.reports,
        'household_member_registration_reminder',
        Utils.addDate(dueDate, -event.start).getTime(),
        Utils.addDate(dueDate, event.end + 1).getTime()
      );
    }
  },
  {
    name: 'household_member_pregnancy_visit',
    icon: 'icon-pregnancy-home-visit-service',
    title: 'task.pregnancy_home_visit_service.title',
    appliesTo: 'contacts',
    appliesToType: ['f_client'],
    appliesIf: function (contact) {
      return isChv(user) && isEligibleForTasks(contact.contact) && contact.contact.has_mch_handbook === 'yes';
    },
    actions: [{ form: 'pregnancy_home_visit' }],
    events: [
      {
        id: 'household_member_pregnancy_visit',
        days: 30,
        start: 31,
        end: 2,
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return Utils.isFormSubmittedInWindow(
        contact.reports,
        'pregnancy_home_visit',
        Utils.addDate(dueDate, -event.start).getTime(),
        Utils.addDate(dueDate, event.end + 1).getTime()
      ) || isPregnancyTaskMuted(contact);
    }
  },
  {
    name: 'family-planning-service',
    icon: 'icon-family-planning-service',
    title: 'task.family_planning_service.title',
    appliesTo: 'reports',
    appliesToType: ['family_planning'],
    appliesIf: function (contact, report) {
      return isChv(user) && Utils.getField(report, 'has_fp_follow_up') === 'yes';
    },
    actions: [
      {
        form: 'family_planning'
      },
    ],
    events: [
      {
        id: 'family-planning-service',
        dueDate: function (event, contact, report) {
          return new Date(Utils.getField(report, 'fp_follow_up_date'));
        },
        start: 3,
        end: 7,
      }
    ]
  },
  {
    name: 'fp-side-effects-referral-follow-up',
    icon: 'icon-follow-up',
    title: 'task.fp_side_effects_referral_follow_up.title',
    appliesTo: 'reports',
    appliesToType: ['family_planning'],
    appliesIf: function (contact, report) {
      return isChv(user) && Utils.getField(report, 'family_planning.has_side_effects') === 'yes';
    },
    actions: [
      {
        form: 'referral_follow_up',
        modifyContent: function (content) {
          content.t_referral_type = 'fp_side_effects';
        }
      },
    ],
    events: [
      {
        id: 'fp-side-effects-referral-follow-up',
        days: 3,
        start: 0,
        end: 5,
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, ['referral_follow_up'], dueDate, event, null, report._id);
    },
  },
  {
    //Defaulter Follow Up Task
    name: 'defaulter_follow_up_loop',
    icon: 'icon-follow-up',
    title: 'task.defaulter_follow_up.title',
    appliesTo: 'reports',
    appliesToType: ['defaulter_follow_up'],
    appliesIf: function (contact, report) {
      return isChv(user) && isEligibleForTasks(contact.contact) && Utils.getField(report, 'needs_follow_up') === 'yes';
    },
    actions: [{ form: 'defaulter_follow_up' }],
    events: [
      {
        id: 'defaulter_follow_up',
        dueDate: (event, contact, report) => {
          if (Utils.getField(report, 'needs_follow_up') === 'yes') {
            return new Date(Utils.getField(report, 'next_follow_up_date'));
          }
          return Utils.addDate(new Date(report.reported_date), 3);
        },
        start: 1,
        end: 3,
      },
    ]
  },
  {
    name: 'task.wash.periodic',
    icon: 'icon-wash-service',
    title: 'task.wash.title',
    appliesTo: 'reports',
    appliesToType: ['wash'],
    appliesIf: (contact, report) => {
      return isChv(user) && isEligibleForTasks(contact.contact) && Utils.getField(report, 'group_wash.has_functional_latrine') === 'no';
    },
    actions: [{ form: 'wash' }],
    events: [{
      id: 'household-visit',
      start: 5, end: 14,
      dueDate: (event, contact, report) => {
        return new Date(Utils.getField(report, 'summary.next_follow_up_date'));
      }
    }],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, ['wash'], dueDate, event, null, report._id);
    },
  },
  // Immunization referral task
  {
    name: 'task.immunization.referral',
    icon: 'icon-healthcare-immunization',
    title: 'task.immunization.title',
    appliesTo: 'reports',
    appliesToType: ['immunization_service'],
    appliesIf: (contact, report) => {
      const needs_immunization_follow_up = Utils.getField(report, 'needs_immunization_follow_up');
      const needs_vitamin_a_follow_up = Utils.getField(report, 'needs_vitamin_a_follow_up');
      const needs_growth_monitoring_follow_up = Utils.getField(report, 'needs_growth_monitoring_follow_up');
      const services_for_follow_up = Utils.getField(report, 'services_for_follow_up');

      return isChv(user) &&
        (
          needs_immunization_follow_up === 'no' ||
          needs_vitamin_a_follow_up === 'no' ||
          needs_growth_monitoring_follow_up === 'no' ||
          services_for_follow_up === 'no'
        );
    },
    actions: [
      {
        form: 'immunization_service',
        modifyContent: function (content, contact, report) {
          const vaccines_for_referral = Utils.getField(report, 'group_vaccines.vaccines_for_referral');
          const vaccines_given = Utils.getField(report, 'group_vaccines.vaccines_given');
          content.count_due_vaccines = countTotalVaccinesByAge(contact.contact) - getVaccinesReceived(contact.reports.filter(report => [Services.IMMUNIZATION_SERVICE, Services.U5_ASSESSMENT].includes(report.form))).length;

          if (vaccines_for_referral) {
            Array.from(new Set(vaccines_for_referral.split(' '))).forEach(vaccine => {
              content[`${vaccine}`] = Object.keys(VACCINATIONS).includes(vaccine) ? 'yes' : 'no';
            });
          }

          if (vaccines_given) {
            Array.from(new Set(vaccines_given.split(' '))).forEach(vaccine => {
              content[`${vaccine}`] = Object.keys(VACCINATIONS).includes(vaccine) ? 'yes' : 'no';
            });
          }
        }
      }
    ],
    events: [{
      id: 'immunization-referral-followup',
      start: 0, end: 1,
      dueDate: (event, contact, report) => {
        return new Date(Utils.getField(report, 'follow_up_date'));
      }
    }],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, ['immunization_service'], dueDate, event, null, report._id) ||
        isFormArraySubmittedInWindow(contact.reports, ['u5_assessment'], dueDate, event);
    },
  },
  {
    name: 'task.wash-triggeer',
    icon: 'icon-wash-service',
    title: 'task.wash.title',
    appliesTo: 'contacts',
    appliesToType: ['e_household'],
    appliesIf: (contact) => {
      return isChv(user) && isEligibleForTasks(contact.contact) && contact.has_functional_latrine === 'no';
    },
    actions: [{ form: 'wash' }],
    events: [{
      id: 'household-visit-from-registration',
      start: 5, end: 14, days: 30
    }],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, ['wash'], dueDate, event, null, report._id);
    },
  },
  {
    name: 'mute_person_confirmation',
    icon: 'icon-mute',
    title: 'task.mute_person_confirmation.title',
    appliesTo: 'reports',
    appliesToType: ['mute_person'],
    appliesIf: function (contact, report) {
      return isCha(user) && Utils.getField(report, 'mute_report.confirm_mute') === 'yes';
    },
    actions: [
      {
        form: 'approve_mute_person',
        modifyContent: function (content, contact, report) {
          content.t_mute_reason = Utils.getField(report, 'c_mute_reason');
          content.t_current_timestamp = new Date().toISOString();
        }
      }
    ],
    events: [
      {
        id: 'mute_person_confirmation',
        days: 3,
        start: 3,
        end: 7,
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return Utils.isFormSubmittedInWindow(
        contact.reports,
        'approve_mute_person',
        Utils.addDate(dueDate, -event.start).getTime(),
        Utils.addDate(dueDate, event.end + 1).getTime()
      );
    }
  },
  {
    name: 'mute_household_confirmation',
    icon: 'icon-mute',
    title: 'task.mute_household_confirmation.title',
    appliesTo: 'reports',
    appliesToType: ['mute_household'],
    appliesIf: function (contact, report) {
      return isCha(user) && Utils.getField(report, 'mute_household_report.confirm_mute') === 'yes';
    },
    actions: [
      {
        form: 'approve_mute_household',
        modifyContent: function (content, contact, report) {
          content.t_mute_reason = Utils.getField(report, 'c_mute_reason');
          content.t_current_timestamp = new Date().toISOString();
          content.t_supervisor_phone = user.phone;
        }
      },
    ],
    events: [
      {
        id: 'mute_household_confirmation',
        days: 3,
        start: 3,
        end: 7,
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return Utils.isFormSubmittedInWindow(
        contact.reports,
        'approve_mute_household',
        Utils.addDate(dueDate, -event.start).getTime(),
        Utils.addDate(dueDate, event.end + 1).getTime()
      );
    }
  },
  {
    name: 'anc-defaulter-referral-follow-up-service',
    icon: 'icon-follow-up',
    title: 'task.anc-defaulter-referral-follow-up-service.title',
    appliesTo: 'reports',
    appliesToType: ['pregnancy_home_visit'],
    appliesIf: function (contact, report) {
      return isChv(user) && isEligibleForTasks(contact.contact) && Utils.getField(report, 'is_anc_defaulter') === 'true';
    },
    actions: [
      {
        form: 'defaulter_follow_up',
        modifyContent: function (content) {
          content.t_referral_type = 'anc';
        }
      },
    ],
    events: [
      {
        id: 'anc-referral-follow-up-service',
        days: 3,
        start: 0,
        end: 5,
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, ['defaulter_follow_up'], dueDate, event, null, report._id);
    }
  },
  {
    name: 'anc-danger-signs-referral-follow-up-service',
    icon: 'icon-anc-danger-signs',
    title: 'task.anc-danger-signs-referral-follow-up-service.title',
    appliesTo: 'reports',
    appliesToType: ['pregnancy_home_visit'],
    appliesIf: function (contact, report) {
      return isChv(user) && isEligibleForTasks(contact.contact) && (Utils.getField(report, 'has_danger_signs') === 'yes' || Utils.getField(report, 'has_mental_danger_signs') === 'yes');
    },
    actions: [
      {
        form: 'referral_follow_up',
        modifyContent: function (content, contact, report) {
          const dangerSignsStr = Utils.getField(report, 'has_danger_signs') === 'yes' ? 'anc_danger_signs' : '';
          const mentalSignsStr = Utils.getField(report, 'has_mental_danger_signs') === 'yes' ? 'anc_mental_signs' : '';
          content.t_referral_type = [dangerSignsStr, mentalSignsStr].filter(str => str !== '').join(', ');
        }
      }
    ],
    events: [
      {
        id: 'anc-danger-signs-referral-follow-up-service',
        dueDate: function (event, contact, report) {
          let days = 3;
          if (Utils.getField(report, 'has_danger_signs') === 'yes') {
            days = 1;
          }
          return Utils.addDate(new Date(report.reported_date), days);
        },
        start: 0,
        end: 5,
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, ['referral_follow_up'], dueDate, event, null, report._id);
    }
  },
  {
    name: 'u5_assessment_treatment_follow_up',
    icon: 'icon-commodity',
    title: 'task.u5_assessment_treatment_follow_up.title',
    appliesTo: 'reports',
    appliesToType: ['u5_assessment'],
    appliesIf: function (contact, report) {
      const conditions = []
        .concat(Utils.getField(report, 'malaria_screening.malaria_danger_signs') === 'true')
        .concat(Utils.getField(report, 'group_summary_no_danger_signs.r_given_amox') === 'yes')
        .concat(Utils.getField(report, 'group_summary_no_danger_signs.r_given_zinc') === 'yes')
        .concat(Utils.getField(report, 'group_summary_no_danger_signs.r_given_ors') === 'yes');
      return isChv(user) && isEligibleForTasks(contact.contact) && conditions.some(result => result);
    },
    actions: [
      {
        form: 'treatment_follow_up',
      },
    ],
    events: [
      {
        id: 'u5_assessment_treatment_follow_up',
        days: 3, start: 1, end: 7,
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, ['treatment_follow_up'], dueDate, event, null, report._id);
    }
  },
  {
    name: 'u5_assessment_danger_sign_referral_follow_up',
    icon: 'icon-iccm-danger-signs',
    title: 'task.u5_assessment_danger_sign_referral_follow_up.title',
    appliesTo: 'reports',
    appliesToType: ['u5_assessment'],
    appliesIf: (contact, report) => {
      return isChv(user) && isEligibleForTasks(contact.contact) && Utils.getField(report, 'has_danger_signs') === 'true';
    },
    actions: [{
      form: 'referral_follow_up',
      modifyContent: function (content, contact, report) {
        content.t_referral_type = 'danger_signs';

        let str = '';
        if (Utils.getField(report, 'needs_malaria_referral') === 'true') { str = str + 'malaria '; }
        if (Utils.getField(report, 'needs_tb_referral') === 'true') { str = str + 'tb '; }
        if (Utils.getField(report, 'needs_diarrhea_referral') === 'true') { str = str + 'diarrhea '; }
        if (Utils.getField(report, 'needs_immunization_referral') === 'true') { str = str + 'immunization '; }
        if (Utils.getField(report, 'needs_growth_monitoring_referral') === 'true') { str = str + 'growth_monitoring '; }
        if (Utils.getField(report, 'needs_malnutrition_referral') === 'true') { str = str + 'malnutrition '; }
        content.t_referral_reason = str;
      }
    }],
    events: [{
      id: 'u5_assessment_danger_sign_referral_follow_up',
      days: 1, start: 1, end: 5,
    }],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, ['referral_follow_up'], dueDate, event, null, report._id);
    }
  },
  {
    name: 'u5_assessment_3_day_referral_follow_up',
    icon: 'icon-iccm-danger-signs',
    title: 'task.u5_assessment_3_day_referral_follow_up.title',
    appliesTo: 'reports',
    appliesToType: ['u5_assessment'],
    appliesIf: (contact, report) => {
      return isChv(user) && isEligibleForTasks(contact.contact) && Utils.getField(report, 'needs_tb_referral') === 'true';
    },
    actions: [{
      form: 'referral_follow_up',
      modifyContent: function (content, contact, report) {
        content.t_referral_type = '3_day_danger_signs';

        let str = '';
        if (Utils.getField(report, 'needs_malaria_referral') === 'true') { str = str + 'malaria '; }
        if (Utils.getField(report, 'needs_tb_referral') === 'true') { str = str + 'tb '; }
        if (Utils.getField(report, 'needs_diarrhea_referral') === 'true') { str = str + 'diarrhea '; }
        if (Utils.getField(report, 'needs_immunization_referral') === 'true') { str = str + 'immunization '; }
        if (Utils.getField(report, 'needs_growth_monitoring_referral') === 'true') { str = str + 'growth_monitoring '; }
        if (Utils.getField(report, 'needs_malnutrition_referral') === 'true') { str = str + 'malnutrition '; }
        content.t_referral_reason = str;
      }
    }],
    events: [{
      id: 'u5_assessment_3_day_referral_follow_up',
      days: 3, start: 0, end: 5,
    }],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, ['referral_follow_up'], dueDate, event, null, report._id);
    }
  },
  {
    name: 'muac_danger_sign_referral_follow_up',
    icon: 'icon-iccm-danger-signs',
    title: 'task.muac_danger_sign_referral_follow_up.title',
    appliesTo: 'reports',
    appliesToType: ['u5_assessment'],
    appliesIf: (contact, report) => {
      return isChv(user) && isEligibleForTasks(contact.contact) && Utils.getField(report, 'malnutrition_screening.muac_color') === 'red';
    },
    actions: [{
      form: 'referral_follow_up',
      modifyContent: function (content) {
        content.t_referral_type = 'danger_signs';
      }
    }],
    events: [{
      id: 'muac_danger_sign_referral_follow_up',
      days: 1, start: 1, end: 5,
    }],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, ['referral_follow_up'], dueDate, event, null, report._id);
    }
  },
  {
    name: 'immunization_referral_follow_up',
    icon: 'icon-healthcare-immunization',
    title: 'task.immunization_referral_follow_up.title',
    appliesTo: 'reports',
    appliesToType: ['u5_assessment'],
    appliesIf: (contact, report) => {
      return isChv(user) && isEligibleForTasks(contact.contact) && Utils.getField(report, 'immunization_screening.imm_schedule_upto_date') === 'no';
    },
    actions: [{
      form: 'referral_follow_up',
      modifyContent: function (content) {
        content.t_referral_type = 'danger_signs';
      }
    }],
    events: [{
      id: 'immunization_referral_follow_up',
      days: 3, start: 0, end: 5,
    }],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, ['referral_follow_up'], dueDate, event, null, report._id);
    }
  },
  {
    name: 'growth_monitoring_referral_follow_up',
    icon: 'icon-iccm-danger-signs',
    title: 'task.growth_monitoring_referral_follow_up.title',
    appliesTo: 'contacts',
    appliesToType: ['f_client'],
    appliesIf: function (contact) {
      const latestAssessment = Utils.getMostRecentReport(contact.reports, 'u5_assessment');
      this.assessment = latestAssessment;
      return latestAssessment 
        && isChv(user)
        && isEligibleForTasks(contact.contact) 
        && Utils.getField(latestAssessment, 'growth_and_monitoring.delayed_development_milestones') !== '';
    },
    actions: [{
      form: 'referral_follow_up',
      modifyContent: function (content) {
        content.t_referral_type = 'danger_signs';
      }
    }],
    events: [{
      id: 'growth_monitoring_referral_follow_up',
      start: 0,
      dueDate: function () {
        return Utils.addDate(new Date(this.assessment.reported_date), 3);
      },
      end: 5,
    }]
  },
  {
    name: 'pregnancy-home-visit-service',
    icon: 'icon-pregnancy-home-visit-service',
    title: 'task.pregnancy_home_visit_service.title',
    appliesTo: 'reports',
    appliesToType: ['pregnancy_home_visit'],
    appliesIf: function (contact, report) {
      return isChv(user) && isEligibleForTasks(contact.contact) && (Utils.getField(report, 'is_upcoming_pregnancy_home_visit') === 'yes' || Utils.getField(report, 'was_available') === 'no');
    },
    actions: [
      {
        form: 'pregnancy_home_visit'
      },
    ],
    events: [
      {
        id: 'pregnancy-home-visit-service',
        dueDate: function (event, contact, report) {
          const nextAppointmentDate = Utils.getField(report, 'anc_visits.next_anc_visit_date');
          if (nextAppointmentDate) {
            return Utils.addDate(new Date(nextAppointmentDate), 3);
          } else {
            return Utils.addDate(new Date(report.reported_date), 3);
          }
        },
        start: 0,
        end: 5,
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return this.definition.defaultResolvedIf(contact, report, event, dueDate) || isPregnancyTaskMuted(contact);
    }
  },
  {
    name: 'referral-followup-service',
    icon: 'icon-follow-up',
    title: 'task.referral_follow_up.title',
    appliesTo: 'reports',
    appliesToType: ['referral_follow_up'],
    appliesIf: function (contact, report) {
      return isChv(user) && isEligibleForTasks(contact.contact) && Utils.getField(report, 'needs_follow_up') === 'yes';
    },
    actions: [
      {
        form: 'referral_follow_up',
        modifyContent: function (content) {
          content.t_referral_type = 'referral_follow_up';
        }
      },
    ],
    events: [
      {
        id: 'referral-follow-up-referral-followup-service',
        dueDate: function (event, contact, report) {
          return new Date(Utils.getField(report, 'follow_up_date'));
        },
        start: 0,
        end: 5,
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, ['referral_follow_up'], dueDate, event, null, report._id);
    },
  },
  {
    name: 'treatment-follow-up-referral-followup-service',
    icon: 'icon-commodity',
    title: 'task.treament_follow_up_referral_service.title',
    appliesTo: 'reports',
    appliesToType: ['treatment_follow_up'],
    appliesIf: function (contact, report) {
      return isChv(user) && isEligibleForTasks(contact.contact) && Utils.getField(report, 'needs_follow_up') === 'yes';
    },
    actions: [
      {
        form: 'referral_follow_up',
        modifyContent: function (content) {
          content.t_referral_type = 'treatment_follow_up';
        }
      },
    ],
    events: [
      {
        id: 'treatment-follow-up-referral-followup-service',
        dueDate: function (event, contact, report) {
          return new Date(Utils.getField(report, 'follow_up_date'));
        },
        start: 0,
        end: 5,
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, ['referral_follow_up'], dueDate, event, null, report._id);
    },
  },
  {
    name: 'over-five-referral-followup-24-hour-service',
    icon: 'icon-follow-up',
    title: TASKS.danger_signs_referral_follow_up,
    appliesTo: 'reports',
    appliesToType: [Services.OVER_FIVE_ASSESSMENT],
    appliesIf: function (contact, report) {
      return isChv(user) && isEligibleForTasks(contact.contact)
        && (
          Utils.getField(report, 'needs_general_danger_signs_referral') === 'true'
          || Utils.getField(report, 'needs_general_signs_symptoms_referral') === 'true'
          || Utils.getField(report, 'needs_fever_referral') === 'true'
          || Utils.getField(report, 'needs_diarrhoea_referral') === 'true'
        );
    },
    actions: [
      {
        form: 'referral_follow_up',
        modifyContent: function (content) {
          content.t_referral_type = '24_hour_referral_follow_up';
        }
      },
    ],
    events: [
      {
        id: 'over-five-referral-followup-24-hour-service',
        dueDate: function (event, contact, report) {
          const nextAppointmentDate = Utils.getField(report, 'general_danger_signs_referral_follow_up_date')
            || Utils.getField(report, 'general_signs_symptoms_referral_follow_up_date')
            || Utils.getField(report, 'fever_referral_follow_up_date')
            || Utils.getField(report, 'diarrhoea_referral_follow_up_date');
          return new Date(nextAppointmentDate);
        },
        start: 1,
        end: 5,
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, [Services.REFERRAL_FOLLOW_UP], dueDate, event, null, report._id);
    },
  },
  {
    name: 'over-five-referral-followup-3-day',
    icon: 'icon-follow-up',
    title: 'task.over_five_referral_service_3_day.title',
    appliesTo: 'reports',
    appliesToType: ['over_five_assessment'],
    appliesIf: function (contact, report) {
      return isChv(user) && isEligibleForTasks(contact.contact)
        && (
          Utils.getField(report, 'needs_malaria_referral') === 'true'
          || Utils.getField(report, 'needs_tb_referral') === 'true'
          || Utils.getField(report, 'needs_diabetes_referral') === 'true'
          || Utils.getField(report, 'needs_hypertension_referral') === 'true'
          || Utils.getField(report, 'needs_mental_health_referral') === 'true'
          || Utils.getField(report, 'needs_sgbv_referral') === 'true'
        );
    },
    actions: [
      {
        form: 'referral_follow_up',
        modifyContent: function (content, c, report) {
          content.t_referral_type = '3_day_referral_follow_up';
          let str = '';
          if (Utils.getField(report, 'needs_malaria_referral') === 'true') { str = str + 'malaria '; }
          if (Utils.getField(report, 'needs_tb_referral') === 'true') { str = str + 'tb '; }
          if (Utils.getField(report, 'needs_diabetes_referral') === 'true') { str = str + 'diabetes '; }
          if (Utils.getField(report, 'needs_hypertension_referral') === 'true') { str = str + 'hypertension '; }
          if (Utils.getField(report, 'needs_mental_health_referral') === 'true') { str = str + 'mental_health '; }
          if (Utils.getField(report, 'needs_sgbv_referral') === 'true') { str = str + 'sgbv '; }
          content.t_referral_reason = str;
        }
      },
    ],
    events: [
      {
        id: 'over-five-referral-followup-3-day-service',
        dueDate: function (event, contact, report) {
          const nextAppointmentDate = Utils.getField(report, 'malaria_referral_follow_up_date')
            || Utils.getField(report, 'tb_referral_follow_up_date')
            || Utils.getField(report, 'diabetes_referral_follow_up_date')
            || Utils.getField(report, 'hypertension_referral_follow_up_date')
            || Utils.getField(report, 'mental_health_referral_follow_up_date')
            || Utils.getField(report, 'sgbv_referral_follow_up_date');
          return new Date(nextAppointmentDate);
        },
        start: 0,
        end: 5,
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, ['referral_follow_up'], dueDate, event, null, report._id);
    },
  },
  {
    name: 'pnc-mother-danger-signs-referral',
    icon: 'icon-pnc-danger-signs',
    title: 'task.pnc_mother_danger_signs.title',
    appliesTo: 'reports',
    appliesToType: ['postnatal_care_service'],
    appliesIf: function (contact, report) {
      return isChv(user) && isEligibleForTasks(contact.contact) &&
        (Utils.getField(report, 'needs_danger_signs_follow_up') === 'true' ||
          Utils.getField(report, 'needs_pnc_update_follow_up') === 'true' ||
          Utils.getField(report, 'needs_mental_health_follow_up') === 'true');
    },
    actions: [
      {
        form: 'referral_follow_up',
        modifyContent: function (content) {
          content.t_referral_type = 'mother_danger_signs';
        }
      },
    ],
    events: [
      {
        id: 'pnc-mother-danger-signs-referral-follow-up-service',
        start: 0,
        end: 0,
        dueDate: (event, c, report) => {
          const followUpDate = Utils.getField(report, 'danger_signs_follow_up_date') || Utils.getField(report, 'pnc_update_follow_up_date') || Utils.getField(report, 'mental_health_follow_up_date');
          return new Date(followUpDate);
        }
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, ['referral_follow_up'], dueDate, event, null, report._id);
    }
  },
  {
    name: 'pnc-newborn-danger-signs-referral',
    icon: 'icon-baby-danger-signs',
    title: 'task.pnc_newborn_danger_signs.title',
    appliesTo: 'contacts',
    appliesToType: ['f_client'],
    appliesIf: function (contact) {
      const _contact = contact.contact;
      return isChv(user) && isEligibleForTasks(contact.contact) &&
        differenceInDays(new Date(_contact.date_of_birth), new Date()) < PNC_PERIOD_DAYS &&
        _contact.needs_newborn_danger_signs_follow_up === 'true';
    },
    actions: [
      {
        form: 'referral_follow_up',
        modifyContent: function (content) {
          content.t_referral_type = 'newborn_danger_signs';
        }
      },
    ],
    events: [
      {
        id: 'pnc-newborn-danger-signs-referral-follow-up-service',
        start: 0,
        end: 0,
        dueDate: function (e, c) {
          return new Date(c.contact.newborn_danger_signs_follow_up_date);
        },
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, ['referral_follow_up'], dueDate, event);
    }
  },
  postNatalCareTemplate({
    name: 'pnc-mother-followup-home-delivery',
    customAppliesIf: function (contact, report) {
      return Utils.getField(report, 'place_of_birth') === 'home';
    },
    events: [...postnatalEvents]
  }),

  postNatalCareTemplate({
    name: 'pnc-mother-followup-facility-delivery',
    customAppliesIf: function (contact, report) {
      return Utils.getField(report, 'place_of_birth') === 'health_facility';
    },
    events: [...postnatalEvents.slice(1)]
  }),
  {
    name: 'pnc-immunization-followup',
    icon: 'icon-iccm-immunization',
    title: 'task.pnc_newborn_immunization.title',
    appliesTo: 'contacts',
    appliesToType: ['f_client'],
    appliesIf: function (contact) {
      const _contact = contact.contact;
      return isChv(user) && isEligibleForTasks(_contact) &&
        differenceInDays(new Date(_contact.date_of_birth), new Date()) < PNC_PERIOD_DAYS &&
        _contact.needs_immunization_follow_up === 'true';
    },
    actions: [
      {
        form: 'referral_follow_up',
        modifyContent: function (content) {
          content.t_referral_type = 'newborn_immunization';
        }
      }
    ],
    events: [
      {
        id: 'newborn-immunization-follow-up',
        start: 0,
        end: 1,
        dueDate: (event, c) => {
          return new Date(c.contact.immunization_follow_up_date);
        }
      }
    ],
    resolvedIf: function (c, r, event, dueDate) {
      return isFormArraySubmittedInWindow(c.reports, ['referral_follow_up'], dueDate, event);
    }
  },
  {
    name: 'pnc.home_visit_newborn.from_contact',
    icon: 'icon-baby',
    title: 'task.pnc_home_visit_newborn.title',
    appliesTo: 'contacts',
    appliesToType: ['f_client'],
    appliesIf: function (contact) {
      return isChv(user) && isEligibleNewborn(contact.contact);
    },
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(
        contact.reports.filter(r => Utils.getField(r, 'is_patient_available') === 'true'),
        ['postnatal_care_service_newborn'],
        dueDate,
        event
      );
    },
    actions: [
      {
        type: 'report',
        form: 'postnatal_care_service_newborn',
        modifyContent: function (content, contact) {
          content.t_delivery_uuid = contact.contact.created_by_doc || '';
          content.t_place_of_birth = contact.contact.place_of_birth || '';
          content.t_is_immunization_defaulter = getVaccinesReceived(contact.reports).length !== countTotalVaccinesByAge(contact) ? 'yes' : 'no';
          content.t_newborn_home_visit_count = getNewbornHomeVisitCount(contact.reports);
        }
      }
    ],
    events: [
      generateEventForNewbornHomeVisit(1, 0, 0),
      generateEventForNewbornHomeVisit(2, 0, 1),
      generateEventForNewbornHomeVisit(3, 0, 1)
    ]
  },
  {
    name: 'newborn-immunization-followup',
    icon: 'icon-iccm-immunization',
    title: 'task.pnc_newborn_immunization.title',
    appliesTo: 'reports',
    appliesToType: ['postnatal_care_service_newborn'],
    appliesIf: function (contact, report) {
      return isChv(user) && isEligibleForTasks(contact.contact) && Utils.getField(report, 'needs_immunization_follow_up') === 'yes';
    },
    actions: [
      {
        form: 'immunization_service',
        modifyContent: function (content) {
          content.t_referral_type = 'newborn_immunization';
        }
      }
    ],
    events: [
      {
        id: 'newborn-immunization-follow-up',
        start: 0,
        end: 1,
        dueDate: (event, c, r) => {
          return new Date(Utils.getField(r, 'immunization_follow_up_date'));
        }
      }
    ],
    resolvedIf: function (c, r, event, dueDate) {
      return isFormArraySubmittedInWindow(c.reports, ['immunization_service', 'posnatal_care_service_newborn'], dueDate, event);
    }
  },
  {
    name: 'newborn-danger-signs-referral',
    icon: 'icon-baby-danger-signs',
    title: 'task.pnc_newborn_danger_signs.title',
    appliesTo: 'reports',
    appliesToType: ['postnatal_care_service_newborn'],
    appliesIf: function (contact, report) {
      return isChv(user) && isEligibleForTasks(contact.contact) && Utils.getField(report, 'needs_danger_signs_follow_up') === 'yes';
    },
    actions: [
      {
        form: 'referral_follow_up',
        modifyContent: function (content) {
          content.t_referral_type = 'newborn_danger_signs';
        }
      },
    ],
    events: [
      {
        id: 'pnc-newborn-danger-signs-referral-follow-up-service',
        start: 0,
        end: 0,
        dueDate: function (e, c, r) {
          return new Date(Utils.getField(r, 'danger_signs_follow_up_date'));
        },
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, ['referral_follow_up', 'postnatal_care_service_newborn'], dueDate, event);
    }
  },
  {
    name: 'death-confirmation',
    icon: 'icon-follow-up',
    title: TASKS.death_confirmation,
    appliesTo: 'reports',
    appliesToType: [Services.DEATH_REPORT],
    appliesIf: () => {
      return isCha(user);
    },
    actions: [{
      form: Services.DEATH_REVIEW,
      modifyContent: (content, c, report) => {
        content.t_patient_name = Utils.getField(report, 'patient_name');
        content.t_patient_id = Utils.getField(report, 'patient_id');
        content.t_chv_name = Utils.getField(report, 'chv_name');
        content.t_chv_phone = Utils.getField(report, 'chv_phone');
        content.t_patient_age_in_years = Utils.getField(report, 'patient_age_in_years');
        content.t_patient_age_in_months = Utils.getField(report, 'patient_age_in_months');
        content.t_patient_age_in_days = Utils.getField(report, 'patient_age_in_days');
        content.t_patient_sex = Utils.getField(report, 'patient_sex');
        content.t_supervisor_phone = user.phone;
        content.t_household_id = Utils.getField(report, 'household_id');
        content.t_household_name = Utils.getField(report, 'household_name');
      }
    }],
    contactLabel: (contact, report) => {
      return Utils.getField(report, 'patient_name');
    },
    events: [{
      id: 'death-report-confirmation',
      start: 5, end: 7, days: 1
    }],
    resolvedIf: function (c, report, event, dueDate) {
      return isFormArraySubmittedInWindow(c.reports, [Services.DEATH_REVIEW], dueDate, event, null, report._id);
    }
  },
  {
    name: 'pnc.delivery.check',
    icon: 'icon-delivery',
    title: 'task.pnc_home_visit.title',
    appliesTo: 'reports',
    appliesToType: ['pregnancy_home_visit'],
    appliesIf: function (contact, report) {
      const recentEdd = getMostRecentEddForPregnancy(contact.reports);
      // We only want to show from 28 until 44 weeks (if not delivered), max weeks = 44 and ANC upto date
      if (recentEdd) {
        const weeks = differenceInWeeks(new Date(), recentEdd);
        const pregnancyAge = MAX_PREGNANCY_AGE_IN_WEEKS - weeks;
        return isChv(user) && pregnancyAge >= DELIVERY_CHECK_WEEKS.START && pregnancyAge <= DELIVERY_CHECK_WEEKS.END && Utils.getField(report, 'anc_visits.anc_upto_date') === 'yes';
      }
      return false;
    },
    actions: [
      {
        type: 'report',
        form: 'postnatal_care_service'
      }
    ],
    //every 1 weeks from week 28 until 44 gestation period, show before due date: 0 days, show after due date: 7 days
    events: [...Array((DELIVERY_CHECK_WEEKS.END - DELIVERY_CHECK_WEEKS.START) + 1).keys()].map(i => generateEventForDeliveryCheckHomeVisit(i * -1, 0, 3)),
    resolvedIf: function (contact, report, event, dueDate) {
      if (isPregnancyTaskMuted(contact)) { return true; }
      return isFormArraySubmittedInWindow(contact.reports, ['postnatal_care_service'], dueDate, event, null, report._id);
    }
  },
  // CEBS task
  {
    name: 'cebs-signal-verification',
    icon: 'icon-signal-verification',
    title: TASKS.ceb_signal_verification,
    appliesTo: 'reports',
    appliesToType: [Services.CEBS_CHV_SIGNAL_REPORTING],
    appliesIf: () => isCha(user),
    events: [
      {
        id: 'cha-signal-verification',
        days: 0,
        start: 0,
        end: 60,
      },
    ],
    resolvedIf: function (contact, report) {
      return contact.reports.findIndex(
        r => r.form === Services.CEBS_CHA_SIGNAL_VERIFICATION &&
          (Utils.getField(r, 'case_id') === report.case_id || Utils.getField(r, 'inputs.source_id') === report._id)
      ) !== -1;
    },
    actions: [
      {
        form: Services.CEBS_CHA_SIGNAL_VERIFICATION,
        modifyContent: function (content, contact, report) {
          content.t_source_chw_id = Utils.getField(report, 'chw_id');
          content.t_source_chw_name = Utils.getField(report, 'chw_name');
          content.t_source_chw_phone = Utils.getField(report, 'chw_phone');
          content.t_source_signal_id = report.case_id;
          content.t_source_signal_type = Utils.getField(report, 'chv_signal.signal_type');
          content.source_id = report._id;
        }
      }
    ]
  },
  // end of CEBS task
  {
    name: 'chv-supervision',
    icon: 'icon-community-health-volunteer-area',
    title: TASKS.chv_supervision,
    appliesTo: 'reports',
    appliesToType: [Services.CHV_SUPERVISION, Services.CHA_SUPERVISION_CALENDAR],
    appliesIf: (contact, report) => {
      const taskTriggerField = Utils.getField(report, FIELDS_FOR_CHV_SUPERVISION[report.form]);
      return isCha(user) && isChvPerson(contact.contact) && isEligibleForTasks(contact.contact) && (DateTime.fromISO(taskTriggerField).isValid || taskTriggerField === 'no');
    },
    actions: [
      {
        form: Services.CHV_SUPERVISION,
        modifyContent: function (content, contact) {
          const summary = getLastChvSupervisionSummary(contact.reports);
          content.calc_last_visit_date = summary.last_visit_date;
          content.calc_last_visit_action_points = summary.last_visit_action_points;
          content.calc_supervision_visit_count = summary.supervision_visit_count;
        }
      }
    ],
    events: [{
      id: 'household-visit',
      start: 3, end: 3,
      dueDate: (event, contact, report) => {
        const taskDueDate = Utils.getField(report, FIELDS_FOR_CHV_SUPERVISION_TASK[report.form]);
        return new Date(taskDueDate);
      }
    }],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, [Services.CHV_SUPERVISION], dueDate, event, null, report._id);
    }
  },
  {
    name: 'cha-verbal-autopsy',
    icon: 'icon-follow-up',
    title: TASKS.cha_verbal_autopsy,
    appliesTo: 'reports',
    appliesToType: ['death_review'],
    appliesIf: (contact, report) => {
      return isCha(user) && Utils.getField(report, 'group_review.dead') === 'yes';
    },
    actions: [{
      form: 'cha_verbal_autopsy',
      modifyContent: (content, c, report) => {
        content.t_patient_name = Utils.getField(report, 'patient_name');
        content.t_patient_id = Utils.getField(report, 'patient_id');
        content.t_chv_name = Utils.getField(report, 'chv_name');
        content.t_chv_phone = Utils.getField(report, 'chv_phone');
        content.t_patient_age_in_years = Utils.getField(report, 'patient_age_in_years');
        content.t_patient_age_in_months = Utils.getField(report, 'patient_age_in_months');
        content.t_patient_age_in_days = Utils.getField(report, 'patient_age_in_days');
        content.t_patient_sex = Utils.getField(report, 'patient_sex');
        content.t_supervisor_phone = user.phone;
        content.t_household_id = Utils.getField(report, 'household_id');
        content.t_household_name = Utils.getField(report, 'household_name');
        content.t_cause_of_death = Utils.getField(report, 'cause_of_death');
        content.t_date_of_death = Utils.getField(report, 'date_of_death');
      }
    }],
    contactLabel: (contact, report) => {
      return Utils.getField(report, 'patient_name');
    },
    events: [{
      id: 'cha-verbal-autopsy',
      start: 0, end: 365, days: 0
    }],
    resolvedIf: function (c, report, event, dueDate) {
      return isFormArraySubmittedInWindow(c.reports.filter(r => Utils.getField(r, 'autopsy.participated') === 'yes'),
        ['cha_verbal_autopsy'],
        dueDate, event, null, report._id);
    }
  },
  {
    name: 'sgbv-referral-followup-service',
    icon: 'icon-follow-up',
    title: 'task.sgbv_referral_follow_up.title',
    appliesTo: 'reports',
    appliesToType: ['sgbv', 'u5_assessment'],
    appliesIf: function (contact, report) {
      let needFollowUp = false;
      if (report.form === 'sgbv') {
        needFollowUp = Utils.getField(report, 'sgbv.is_referred_to_cha') === 'yes';
      } else if (report.form === 'u5_assessment') {
        needFollowUp = Utils.getField(report, 'group_sgbv.is_referred_to_cha') === 'yes';
      }
      return isCha(user) && isEligibleForTasks(contact.contact) && needFollowUp;
    },
    actions: [
      {
        form: 'referral_follow_up',
        modifyContent: function (content) {
          content.t_referral_type = 'sgbv';
        }
      },
    ],
    events: [{
      id: 'sgbv-referral-followup-service',
      start: 5, end: 5, days: 3
    }],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, ['referral_follow_up'], dueDate, event, null, report._id);
    }
  },
  {
    name: 'sgbv-referral-followup-service-chv',
    icon: 'icon-follow-up',
    title: TASKS.sgbv_referral_follow_up,
    appliesTo: 'reports',
    appliesToType: Object.keys(FIELDS_FOR_SGBV_REFERRAL),
    appliesIf: function (contact, report) {
      return isChv(user) && isEligibleForTasks(contact.contact) && Utils.getField(report, FIELDS_FOR_SGBV_REFERRAL[report.form]) === 'yes';
    },
    actions: [
      {
        form: 'referral_follow_up',
        modifyContent: function (content) {
          content.t_referral_type = 'sgbv';
        }
      },
    ],
    events: [{
      id: 'sgbv-referral-followup-service',
      start: 3, end: 5, days: 3
    }],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, ['referral_follow_up'], dueDate, event, null, report._id);
    }
  },
  // commodity management tasks
  // 1. when commodities have been supplied
  {
    name: 'chv-commodity-receipt',
    icon: 'icon-commodity',
    title: TASKS.chv_commodity_receipt,
    appliesTo: 'reports',
    appliesToType: [Services.COMMODITES_SUPPLIED],
    appliesIf: () => {
      return isChv(user);
    },
    actions: [
      {
        form: Services.COMMODITES_RECEIVED,
        modifyContent: function (content, contact, report) {
          content.t_rs_chv_name = user.name;
          content = suppliedContent(content, report);
        }
      }
    ],
    events: [
      {
        id: 'commodities-received-bookkeeping',
        days: 0,
        start: 0,
        end: 1
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, [Services.COMMODITY_RECEIVED_CONFRIMATION], dueDate, event, null, report._id);
    }
  },
  // 2. on chv profile every 2 weeks, beginning and mid month
  {
    name: 'chv-commodity-count',
    icon: 'icon-commodity',
    title: TASKS.chv_commodity_count,
    appliesTo: 'contacts',
    appliesToType: [Places.CHV_AREA],
    appliesIf: (contact) => {
      return isChv(user) && !contact.muted;
    },
    actions: [
      {
        form: Services.COMMODITES_COUNT
      }
    ],
    events: [
      {
        id: 'commodities-stock-take-start',
        dueDate: () => new Date(startOfMonthDate()),
        start: 0,
        end: 7
      },
      {
        id: 'commodities-stock-take-mid',
        dueDate: () => new Date(midMonthDate()),
        start: 0,
        end: 7
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, [Services.COMMODITES_COUNT], dueDate, event);
    }
  },
  // 3. commodity returned on CHA profile
  {
    name: 'cha-commodity-returned',
    icon: 'icon-commodity',
    title: TASKS.cha_commodity_returned,
    appliesTo: 'reports',
    appliesToType: [Services.COMMODITES_RETURN],
    appliesIf: () => {
      return isCha(user);
    },
    actions: [
      {
        form: Services.COMMODITES_RETURNED, // holder for action form
        modifyContent: function (content, contact, report) {
          content = returnedContent(content, report);
        }
      }
    ],
    events: [
      {
        id: 'commodities-returned-bookkeeping',
        days: 0,
        start: 0,
        end: 1
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, [Services.COMMODITES_RETURNED], dueDate, event, null, report._id);
    }
  },
  // 4. cha profile on commodity discrepancies
  {
    name: 'cha-commodity-supplied-reconciliation',
    icon: 'icon-commodity',
    title: TASKS.cha_commodity_supplied_reconciliation,
    appliesTo: 'reports',
    appliesToType: ['commodity_received'],
    appliesIf: (contact, report) => {
      return isCha(user) && hasDiscrepancy(report);  // holder calculated field in commodity_received form: 'yes' if at least one item is not tallying, else 'no'
    },
    actions: [
      {
        form: Services.COMMODITES_DISCREPANCY_RESOLUTION, // holder for action form
        modifyContent: function (content, contact, report) {
          content = discrepancyContent(content, report);// holder to list all received items
        }
      }
    ],
    events: [
      {
        id: 'commodities-discrepancy-resolution',
        days: 0,
        start: 0,
        end: 1
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, [Services.COMMODITES_DISCREPANCY_RESOLUTION], dueDate, event, null, report._id);
    }
  },
  // 5. cha profile on chv stockout
  {
    name: 'cha-commodity-stock-out',
    icon: 'icon-commodity',
    title: TASKS.cha_commodity_stock_out,
    appliesTo: 'reports',
    appliesToType: [Services.COMMODITES_COUNT],
    appliesIf: (contact, report) => {

      return isCha(user) && hasStockOut(report); // holder calculated field in commodity_count form: 'yes' if at least one item is stocked out, else 'no'
    },
    actions: [
      {
        form: Services.COMMODITES_STOCK_OUT,
        modifyContent: function (content, contact, report) {
          content = stockOutContent(content, report);
        }
      }
    ],
    events: [
      {
        id: 'commodities-stock-out',
        days: 0,
        start: 0,
        end: 30
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, [Services.COMMODITES_STOCK_OUT], dueDate, event, null, report._id);
    }
  },
  {
    name: 'anc-danger-signs-referral-follow-up-service-demo',
    icon: 'icon-anc-danger-signs',
    title: 'task.anc-danger-signs-referral-follow-up-service.title',
    appliesTo: 'reports',
    appliesToType: ['REFERRAL_FOLLOWUP_AFYA_KE'],
    appliesIf: function (contact) {
      return isChv(user) && isEligibleForTasks(contact.contact);
    },
    actions: [
      {
        form: 'referral_follow_up',
        modifyContent: function (content, c, report) {
          content.t_referral_type = 'anc_danger_signs';
          content.t_follow_up_instruction = Utils.getField(report, 'follow_up_instruction');
          content.t_health_facility_contact = Utils.getField(report, 'health_facility_contact');
        }
      },
    ],
    events: [
      {
        id: 'anc-danger-signs-referral-follow-up-service',
        days: 0,
        start: 0,
        end: 5,
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, ['referral_follow_up'], dueDate, event, null, report._id);
    }
  },
  {
    name: 'hh-update-patient-details',
    icon: 'icon-warning',
    title: TASKS.hh_update_member_cr,
    appliesTo: 'contacts',
    appliesToType: [Persons.CLIENT],
    appliesIf: (contact) => {
      return contact && contact.contact && isEligibleForTasks(contact.contact) && !hasClientRegistryFields(contact.contact);
    },
    actions: [{
      form: Services.CLIENT_DETAILS_NOTIFICATION,
      modifyContent: function (content, contact) {
        content.patient_name = contact.contact.name;
        content.patient_uuid = contact.contact._id;
      }
    }],
    events: [-1, 0, 1].map(month => {
      const dueDate = DateTime.local().startOf('month').plus({ month });
      return {
        id: `update_notification-${dueDate.toFormat('MM-yyyy')}`,
        start: 7,
        end: 7,
        dueDate: () => dueDate.plus({ days: 7 }).toJSDate(),
      };
    }),
    resolvedIf: function (contact) {
      return hasClientRegistryFields(contact.contact);
    }
  },
  {
    name: 'hh-update-patient-details-fix',
    icon: 'icon-warning',
    title: TASKS.hh_update_member_cr,
    appliesTo: 'reports',
    appliesToType: [Services.CLIENT_DETAILS_MISMATCH],
    appliesIf: (contact) => {
      return isChv(user) && isEligibleForTasks(contact.contact);
    },
    actions: [{
      form: Services.CLIENT_DETAILS_NOTIFICATION,
      modifyContent: function (content, contact, report) {
        content.patient_name = contact.contact.name;
        content.patient_uuid = contact.contact._id;
        content.mismatched_fields = Utils.getField(report, 'mismatched_fields');
      }
    }],
    events: [-1, 0, 1].map(month => {
      const dueDate = DateTime.local().startOf('month').plus({ month });
      return {
        id: `update_notification-${dueDate.toFormat('MM-yyyy')}`,
        start: 7,
        end: 7,
        dueDate: () => dueDate.plus({ days: 7 }).toJSDate(),
      };
    }),
    resolvedIf: function (contact, report, event, dueDate) {
      return isFormArraySubmittedInWindow(contact.reports, [Services.CLIENT_DETAILS_NOTIFICATION], dueDate, event, null, report._id);
    }
  },
];
