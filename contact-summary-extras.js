const common = require('./common-extras');
const {
  differenceInDays,
  differenceInYears,
  differenceInWeeks,
  getPregnancyAgeInWeeks,
  FAMILY_PLANNING_METHODS,
  PNC_PERIOD_DAYS,
  Services,
  Places,
  Persons,
  VACCINATIONS,
  getVaccinesReceived,
  countTotalVaccinesByAge,
  countTotalVitaminAVaccinesByAge,
  isEligibleForTasks,
  getNewbornHomeVisitCount,
  isEligibleNewborn,
  getLastChvSupervisionSummary,
  mapImmunizationServiceVaccineAnswers,
  isOfChildBearingAge,
  getMemberSocioEconomicSummary,
  getHouseholdSocioEconomicSummary,
  clientRegistryFields
} = common;
const { DateTime, Interval } = require('luxon');

const { getField, getMostRecentReport } = require('cht-nootils')();

const getReportedDate = (report) => {
  const reportedDate = report && report.reported_date && parseInt(report.reported_date);
  return DateTime.fromMillis(reportedDate || 0);
};

const isMostRecentDeliveryInPNC = (report) => {
  if (report.form === Services.POSTNATAL_CARE_SERVICE && getField(report, 'group_pnc_visit.date_of_delivery')) {
    const deliveryDate = getField(report, 'group_pnc_visit.date_of_delivery');
    return DateTime.local().diff(DateTime.fromISO(deliveryDate)).as('days') <= PNC_PERIOD_DAYS;
  }
  return false;
};

const buildPostnatalCard = (reports) => {
  const context = {};
  const fields = [];
  let motherDead = false;
  let isWithinPncDays = false;
  let daysSinceDelivery = -1;
  const babyNames = [];
  const babyDocIds = [];
  const babyBirthCerts = [];

  reports.forEach((report) => {
    if (isMostRecentDeliveryInPNC(report)) {
      fields.push({
        label: 'contact.profile.pnc.place_of_delivery',
        value: getField(report, 'group_pnc_visit.place_of_delivery_display'),
        width: 6
      });
      fields.push({
        label: 'contact.profile.pnc.date_of_delivery',
        value: DateTime.fromISO(getField(report, 'group_pnc_visit.date_of_delivery')).toFormat('dd/MM/yyyy'),
        width: 6
      });
      fields.push({
        label: 'contact.profile.pnc.danger_signs',
        value: 'contact.profile.pnc.danger_signs.' + (getField(report, 'needs_danger_signs_follow_up') === 'true' ? 'present' : 'none'),
        translate: true,
        icon: getField(report, 'needs_danger_signs_follow_up') === 'true' ? 'icon-warning' : '',
        width: 6
      });
      motherDead = getField(report, 'group_pnc_visit.condition_of_the_mother') === 'dead';
      isWithinPncDays = true;
      daysSinceDelivery = Math.floor(differenceInDays(new Date(getField(report, 'group_pnc_visit.date_of_delivery')), new Date()));
      const number_of_babies_alive = getField(report, 'group_delivery_outcome.number_of_babies_alive');
      if (number_of_babies_alive && number_of_babies_alive > 0) {
        getField(report, 'newborn_details.child').forEach((child) => {
          babyNames.push(child.name.split(' ').join('_'));
          babyDocIds.push(child.child_doc);
          babyBirthCerts.push(child.identification_number || 'None');
        });
        context.baby_names = babyNames.join(' ');
        context.baby_doc_ids = babyDocIds.join(' ');
        context.baby_birth_cert_ids = babyBirthCerts.join(' ');
      }
    }
  });
  context.days_since_delivery = daysSinceDelivery;
  context.is_in_pnc = !motherDead && isWithinPncDays;
  const pncHomeVisitCount = getPostnatalServiceVisitCount(reports);
  context.pnc_follow_up_count = pncHomeVisitCount > 0 ? pncHomeVisitCount + 1 : pncHomeVisitCount;
  return { fields, context };
};

const isHouseholdMember = (contact) => contact.contact_type === Persons.CLIENT && contact.parent && contact.parent.parent && contact.parent.parent.parent && contact.parent.parent.parent.parent && contact.parent.parent.parent.parent.parent;

const dewormingChildStatus = (contact, reports) => {
  const assessment = getMostRecentReport(reports, [Services.U5_ASSESSMENT, Services.IMMUNIZATION_SERVICE]);
  return assessment && (assessment.form === Services.U5_ASSESSMENT ? getField(assessment, 'deworming.deworming_upto_date') : getField(assessment, 'group_deworming.has_deworming_status_uptodate'));
};

const getVitADosesGiven = (contact, reports) => {
  let doses = [];
  reports.filter((report) => [Services.IMMUNIZATION_SERVICE, Services.U5_ASSESSMENT].includes(report.form))
    .forEach(report => {
      if (report.form === Services.IMMUNIZATION_SERVICE) {
        const dosesGiven = getField(report, 'group_vitamin_a.vitamin_a_doses_given');
        if (dosesGiven) {
          doses = doses.concat(dosesGiven.split(' '));
        }
      } else if (report.form === Services.U5_ASSESSMENT) {
        const dosesGiven = getField(report, 'vit_a_group.vit_a_received');
        if (dosesGiven) {
          doses = doses.concat(dosesGiven.split(' '));
        }
      }
    });
  doses = Array.from(new Set(doses));
  const context = {};
  Object.keys(common.VITAMIN_A_DOSES).forEach(key => {
    context[`${key}_given`] = doses.includes(common.VITAMIN_A_DOSES[key]) ? 1 : 0;
  });
  const vitaminADosesReceived = Object.values(context).reduce((partialSum, a) => partialSum + a, 0);
  const vitaminAVaccinesUptoDate = vitaminADosesReceived === countTotalVitaminAVaccinesByAge(contact) ? 1 : 0;
  context['vitamin_a_vaccines_upto_date'] = vitaminAVaccinesUptoDate;
  return context;
};

const requiredVaccinations = Object.keys(VACCINATIONS).filter((vaccination) => !['measles_6', 'malaria'].includes(vaccination));

const isFullyImmunized = (receivedVaccinations) => {
  return receivedVaccinations.length === requiredVaccinations.length && requiredVaccinations.every(vaccination => receivedVaccinations.includes(vaccination));
};

const buildImmunizationCard = (contact, reports) => {
  const fields = [];
  let vaccinations = [];
  let mostRecentReport;
  const context = {};

  if (contact.group_immunization) {
    vaccinations = vaccinations.concat(...contact.group_immunization.vaccines.split(' '));
  }
  if (reports) {
    reports.forEach((report) => {
      let optionalImmunizations;
      if (report.form === Services.IMMUNIZATION_SERVICE) {
        const immunizations = getField(report, 'group_vaccines.vaccines_given');
        optionalImmunizations = getField(report, 'group_vaccines.optional_vaccines_given');
        if (immunizations) {
          vaccinations = vaccinations.concat(...mapImmunizationServiceVaccineAnswers(immunizations).split(' '));
        }
        if (optionalImmunizations) {
          vaccinations = vaccinations.concat(...optionalImmunizations.split(' '));
        }
        if (!mostRecentReport || mostRecentReport.reported_date < report.reported_date) {
          mostRecentReport = report;
        }
      } else if (report.form === Services.U5_ASSESSMENT) {
        const vaccines = getField(report, 'immunization_screening.vaccines');
        optionalImmunizations = getField(report, 'immunization_screening.optional_vaccines_given');
        if (vaccines) {
          vaccinations = vaccinations.concat(...vaccines.split(' '));
        }
        if (optionalImmunizations) {
          vaccinations = vaccinations.concat(...optionalImmunizations.split(' '));
        }
      }
    });
  }
  vaccinations = Array.from(new Set(vaccinations));

  if (vaccinations.length > 0) {
    Object.keys(common.VACCINATIONS).forEach(vaccine => {
      context[`${vaccine}_given`] = vaccinations.includes(vaccine) ? vaccine : undefined;
    });

    if (mostRecentReport) {
      const nextImmunizationDate =
        getField(mostRecentReport, 'group_immunization.next_immunization_visit_date') ||
        getField(mostRecentReport, 'group_missed_visit.visit_date_rescheduled');

      context.on_immunization = true;
      context.next_immunization_date = nextImmunizationDate;

    }

    fields.push({
      label: 'contact.profile.immunization.confirmed',
      value: Array.from(new Set(vaccinations.map((item) => VACCINATIONS[item]))).join(),
      width: 12
    });

    fields.push({
      label: 'contact.profile.immunization.fully_immunized',
      value: 'contact.profile.immunization.fully_immunized.' + (isFullyImmunized(vaccinations) ? 'yes' : 'no'),
      translate: true
    });
  } else {
    fields.push({
      label: 'contact.profile.immunization.confirmed',
      value: 'contact.profile.immunization.none',
      translate: true
    });
  }
  return { fields, context };
};

const buildFamilyPlanningCard = (reports) => {
  const fields = [];
  const context = {};

  const latestFamilyPlanningReport = getMostRecentReport(reports, Services.FAMILY_PLANNING);
  const isOnFp = latestFamilyPlanningReport && getField(latestFamilyPlanningReport, 'on_fp') === 'yes';
  context.is_on_fp = isOnFp;

  if (isOnFp) {
    const fpMethod = getField(latestFamilyPlanningReport, 'coalesced_fp_method');
    const refillDate = getField(latestFamilyPlanningReport, 'family_planning.next_appointment_date');
    context.fp_method = fpMethod;

    fields.push({
      label: 'contact.profile.family_planning.method',
      value: FAMILY_PLANNING_METHODS[fpMethod],
      width: 6
    });

    if (refillDate) {
      fields.push({
        label: 'contact.profile.family_planning.refill_date',
        value: DateTime.fromISO(refillDate).toFormat('dd/MM/yyyy'),
        width: 6
      });
    }

  } else {
    fields.push({
      label: 'contact.profile.family_planning.method',
      value: 'contact.profile.family_planning.method.none',
      translate: true,
      width: 6
    });
  }
  return { fields, context };
};

const mostRecentPregnancyVisit = reports => getMostRecentReport(reports, Services.PREGNANCY_HOME_VISIT, { 'was_available': 'yes' });

function isPregnant(contact, reports) {
  if (!isHouseholdMember(contact) || !isOfChildBearingAge(contact)) {
    return false;
  }

  const mostRecentPregnancy = mostRecentPregnancyVisit(reports);

  if (mostRecentPregnancy) {
    const markedPregnant = getField(mostRecentPregnancy, 'marked_as_pregnant') === 'true';
    const stillPregnant = getField(mostRecentPregnancy, 'pregnancy_screening.is_still_pregnant') === 'yes';
    const subsequentDeliveries = reports.filter(report => report.form === Services.POSTNATAL_CARE
      && report.reported_date >= mostRecentPregnancy.reported_date && getField(report, 'group_pregnancy_status.has_delivered') === 'yes');
    const intervalToToday = Interval.fromDateTimes(DateTime.fromMillis(mostRecentPregnancy.reported_date), DateTime.now());
    const durationInMonths = intervalToToday.toDuration().shiftTo('months').toObject().months;
    const edd = getField(mostRecentPregnancy, 'current_edd');
    const weeks = edd.length > 0 && differenceInWeeks(new Date(), edd);
    //When start date > end date, differenceInWeeks(start, end) returns NaN. So when edd == 'NaN', that means it is past due
    const withinPregnancyPeriod = weeks || isNaN(weeks) ? weeks > 0 || !isNaN(weeks) : durationInMonths <= 10;
    return (markedPregnant || stillPregnant) && withinPregnancyPeriod && !subsequentDeliveries.length;
  }
  return false;
}

const buildPregnancyCard = (contact, reports) => {
  if (contact.contact_type !== 'f_client') {
    return;
  }
  const context = {};
  const fields = [];

  const mostRecentPregnancy = mostRecentPregnancyVisit(reports);
  const pregnant = isPregnant(contact, reports);

  let hasStartedAnc = false;
  let hasAncDangerSigns = false;
  let ancUptoDate = false;
  let edd;
  let pregnancyId;

  if (pregnant) {
    const markedPregnant = mostRecentPregnancy && getField(mostRecentPregnancy, 'marked_as_pregnant') === 'true';
    hasStartedAnc = getField(mostRecentPregnancy, 'anc_visits.has_started_anc') === 'yes' || getField(mostRecentPregnancy, 'started_anc') === 'true';

    if (markedPregnant) {
      pregnancyId = mostRecentPregnancy._id;
    } else {
      pregnancyId = getField(mostRecentPregnancy, 'pregnancy_id');
    }

    hasAncDangerSigns = getField(mostRecentPregnancy, 'has_danger_signs') === 'yes';
    edd = getField(mostRecentPregnancy, 'current_edd');
    ancUptoDate = getField(mostRecentPregnancy, 'anc_visits.anc_upto_date') === 'yes';

    const pregnancyAgeInWeeks = getPregnancyAgeInWeeks(edd);

    if (edd) {
      fields.push({
        label: 'contact.profile.pregnancy.pregnancy_age',
        value: pregnancyAgeInWeeks + ' Weeks',
        width: 6
      });
      fields.push({
        label: 'contact.profile.pregnancy.edd',
        value: DateTime.fromISO(edd).toFormat('dd/MM/yyyy'),
        width: 6
      });
    }

    const ancUptoDateField = {
      label: 'contact.profile.pregnancy.anc_visit_status',
      value: '',
      translate: true,
      width: 12
    };

    if (ancUptoDate) {
      ancUptoDateField.value = 'contact.profile.pregnancy.anc_upto_date';
    } else {
      ancUptoDateField.value = 'contact.profile.pregnancy.anc_not_upto_date';
    }

    fields.push(ancUptoDateField);

    const dangerSignsField = {
      label: 'contact.profile.pregnancy.high_risk',
      value: '',
      width: 12,
      translate: true,
      icon: 'icon-warning'
    };

    if (hasAncDangerSigns) {
      dangerSignsField.value = 'contact.profile.pregnancy.danger_signs.present';
      fields.push(dangerSignsField);
    }

    context.pregnancy_id = pregnancyId;
    context.pregnancy_age_in_weeks = pregnancyAgeInWeeks;
  }
  context.anc_upto_date = ancUptoDate;
  context.pregnant = pregnant;
  context.edd = edd;
  context.started_anc = hasStartedAnc;

  return { fields, context };
};

const getPostnatalServiceVisitCount = (reports) => {
  const recentVisitReport = getMostRecentReport(reports, Services.POSTNATAL_CARE_SERVICE);
  const count = recentVisitReport ? getField(recentVisitReport, 'postnatal_care_service_count') : 0;
  return parseInt(count);
};

const isFemaleOrIntersex = (contact) => [`female`, `intersex`].includes(contact.sex);

const isDiabetic = (reports) => {
  const latestOverFiveReport = getMostRecentReport(reports, Services.OVER_FIVE_ASSESSMENT);
  return (latestOverFiveReport && latestOverFiveReport.fields.is_curr_diabetic === 'true');
};

const isHypertensive = (reports) => {
  const latestOverFiveReport = getMostRecentReport(reports, Services.OVER_FIVE_ASSESSMENT);
  return (latestOverFiveReport && latestOverFiveReport.fields.is_curr_hypertensive === 'true');
};

const hasClientRegistryFields = (contact) => contact && clientRegistryFields.every(field => contact[field]);

module.exports = {
  differenceInDays,
  isPregnant,
  differenceInYears,
  isOfChildBearingAge,
  isHouseholdMember,
  buildPostnatalCard,
  buildImmunizationCard,
  getVitADosesGiven,
  dewormingChildStatus,
  buildFamilyPlanningCard,
  buildPregnancyCard,
  getMostRecentReport,
  getReportedDate,
  Places,
  Persons,
  getVaccinesReceived,
  countTotalVaccinesByAge,
  Services,
  isEligibleForTasks,
  getNewbornHomeVisitCount,
  isEligibleNewborn,
  getLastChvSupervisionSummary,
  isFemaleOrIntersex,
  getMemberSocioEconomicSummary,
  getHouseholdSocioEconomicSummary,
  isDiabetic,
  isHypertensive,
  hasClientRegistryFields
};
