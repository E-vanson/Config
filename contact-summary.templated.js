const { CommoditySummaryAlgo } = require('./commodity-summary-algo');
const { CommoditySummaryCard } = require('./commodity-summary-card');
const extras = require('./contact-summary-extras');
const {
  isOfChildBearingAge,
  isHouseholdMember,
  buildPostnatalCard,
  getMostRecentReport,
  buildImmunizationCard,
  dewormingChildStatus,
  buildFamilyPlanningCard,
  buildPregnancyCard,
  differenceInYears,
  Places,
  Persons,
  Services,
  getVaccinesReceived,
  countTotalVaccinesByAge,
  getNewbornHomeVisitCount,
  isEligibleNewborn,
  getLastChvSupervisionSummary,
  isEligibleForTasks,
  isFemaleOrIntersex,
  getMemberSocioEconomicSummary,
  getHouseholdSocioEconomicSummary,
  isDiabetic,
  isHypertensive
} = extras;

const { getField } = require('cht-nootils')();

const context = {};
let fields = [];
let cards = [];

const familyPlanningCard = buildFamilyPlanningCard(reports);
const pregnancyCard = buildPregnancyCard(contact, reports);
const recentFpReport = getMostRecentReport(reports, Services.FAMILY_PLANNING);
const postnatalCard = buildPostnatalCard(reports);
const isNewborn = isEligibleNewborn(contact);
const recentChvSupervisionSummary = getLastChvSupervisionSummary(reports);

if (contact.contact_type === 'f_client') {
  context.is_pregnant = pregnancyCard.context.pregnant;
  context.edd = pregnancyCard.context.edd;
  context.in_postnatal_period = postnatalCard.context.in_postnatal_period;
  context.pregnancy_age_in_weeks = pregnancyCard.context.pregnancy_age_in_weeks || 0;
  context.is_female_or_intersex = isFemaleOrIntersex(contact);
  context.demographics = getMemberSocioEconomicSummary(contact, reports);
  context.hasDiabetes = isDiabetic(reports);
  context.hasHypertension = isHypertensive(reports);
}

if (recentFpReport) {
  context.on_fp = familyPlanningCard.context.is_on_fp || false;
  context.fp_method = familyPlanningCard.context.fp_method;
}

if (isNewborn) {
  context.is_newborn = true;
  context.delivery_uuid = contact.created_by_doc;
  context.place_of_birth = contact.place_of_birth;
  context.is_immunization_defaulter = getVaccinesReceived(reports).length !== countTotalVaccinesByAge(contact) ? 'yes' : 'no';
  context.newborn_home_visit_count = getNewbornHomeVisitCount(reports);
}
if (contact.contact_type === Places.CHU || contact.contact_type === Places.CHV_AREA) {
  const stockSummaryValues = CommoditySummaryAlgo.init(reports).evaluate();
  Object.assign(context, Object.keys(stockSummaryValues).reduce((accumulator, commodity) => {
    accumulator[`stock_summary_${commodity}`] = stockSummaryValues[commodity];
    return accumulator;
  }, {}));
}

if (contact.contact_type === 'c_community_health_unit') {
  const recentCHUSupervisionReport = getMostRecentReport(reports.filter(r => r.form === Services.CHU_SUPERVISION && r.fields.patient_id === contact._id), Services.CHU_SUPERVISION);
  context.last_action_points = recentCHUSupervisionReport && getField(recentCHUSupervisionReport, 'chs_tools.action_pts_sup') || '';
}

if ([Persons.CLIENT, Places.HOUSEHOLD].includes(contact.contact_type)) {
  context.is_eligible_for_home_visit_service = isEligibleForTasks(contact, reports.filter(report => getField(report, 'inputs.contact._id') === contact._id));
  if (contact.contact_type === Places.HOUSEHOLD) {
    context.demographics = getHouseholdSocioEconomicSummary(reports);
  }
}

fields = [
  { appliesIf: () => { return Object.values(Persons).includes(contact.contact_type) && !!contact.patient_id; }, label: 'patient_id', value: contact.patient_id, width: 4 },
  { appliesIf: () => { return Object.values(Persons).includes(contact.contact_type) && !!contact.date_of_birth; }, label: 'contact.age', value: contact.date_of_birth, width: 4, filter: 'age' },
  { appliesIf: () => { return Object.values(Persons).includes(contact.contact_type) && !!contact.sex; }, label: 'contact.sex', value: 'contact.sex.' + contact.sex, translate: true, width: 4 },
  { appliesIf: () => { return Object.values(Persons).includes(contact.contact_type) && !!contact.phone; }, label: 'contact.phone', value: contact.phone, width: 4 },
  { appliesIf: () => { return Object.values(Persons).includes(contact.contact_type) && !!contact.alternate_phone; }, label: 'contact.alternate_phone', value: contact.alternate_phone, width: 4 },
  { appliesIf: () => { return Object.values(Persons).includes(contact.contact_type) && !!contact.external_id; }, label: 'External ID', value: contact.external_id, width: 4 },
  { appliesIf: () => { return Object.values(Persons).includes(contact.contact_type) && !!contact.upi; }, label: 'contact.upi', value: contact.upi, width: 4 },

  { appliesIf: () => { return Object.values(Places).includes(contact.contact_type); }, label: 'Contact', value: contact.contact && contact.contact.name, width: 4 },
  { appliesIf: () => { return Object.values(Places).includes(contact.contact_type); }, label: 'contact.phone', value: contact.contact && contact.contact.phone, width: 4 },

  { appliesIf: () => { return contact.parent && lineage[0]; }, label: 'contact.parent', value: lineage, filter: 'lineage' }
];

cards = [
  CommoditySummaryCard(reports),
  {
    label: 'contact.profile.cr_fields',
    appliesToType: Persons.CLIENT,
    icon: 'icon-warning',
    appliesIf: () => {
      return isHouseholdMember(contact) && !extras.hasClientRegistryFields(contact);
    },
    fields: () => {
      return [
        {
          label: 'contact.profile.missing_cr_fields',
          value: 'contact.profile.missing_cr_fields.msg',
          translate: true
        }
      ];
    },
  },
  {
    label: 'contact.profile.pnc',
    appliesToType: Persons.CLIENT,
    appliesIf: () => isHouseholdMember(contact) && isOfChildBearingAge(contact) && postnatalCard.context.is_in_pnc && !postnatalCard.context.pregnant && isFemaleOrIntersex(contact),
    fields: () => postnatalCard.fields,
    modifyContext: (ctx) => {
      ctx.is_in_pnc = postnatalCard.context.is_in_pnc || false;
      ctx.days_since_delivery = postnatalCard.context.days_since_delivery || -1;
      ctx.pnc_follow_up_count = postnatalCard.context.pnc_follow_up_count;
      ctx.baby_names = postnatalCard.context.baby_names;
      ctx.baby_birth_cert_ids = postnatalCard.context.baby_birth_cert_ids;
      ctx.baby_doc_ids = postnatalCard.context.baby_doc_ids;
    }
  },
  {
    label: 'contact.profile.child_health_card',
    appliesToType: Persons.CLIENT,
    appliesIf: () => isHouseholdMember(contact) && differenceInYears(new Date(contact.date_of_birth), new Date()) < 5,
    fields: () => {
      const fields = [];
      const immunizationCard = buildImmunizationCard(contact, reports);
      const dewormingStatus = dewormingChildStatus(contact, reports);
      if (dewormingStatus) {
        fields.push(
          {
            label: 'contact.profile.deworming_status',
            value: dewormingStatus === 'yes' ? 'contact.profile.deworming_upto_date' : 'contact.profile.deworming_not_upto_date',
            width: 6,
            translate: true
          });
      }
      return fields.concat(immunizationCard.fields);
    },
    modifyContext: (ctx) => {
      const immunizationCard = buildImmunizationCard(contact, reports);
      ctx.bcg_given = immunizationCard.context.bcg_given;
      ctx.opv0_given = immunizationCard.context.opv0_given;
      ctx.opv1_given = immunizationCard.context.opv1_given;
      ctx.opv2_given = immunizationCard.context.opv2_given;
      ctx.opv3_given = immunizationCard.context.opv3_given;
      ctx.pcv1_given = immunizationCard.context.pcv1_given;
      ctx.pcv2_given = immunizationCard.context.pcv2_given;
      ctx.pcv3_given = immunizationCard.context.pcv3_given;
      ctx.penta1_given = immunizationCard.context.penta1_given;
      ctx.penta2_given = immunizationCard.context.penta2_given;
      ctx.penta3_given = immunizationCard.context.penta3_given;
      ctx.ipv_given = immunizationCard.context.ipv_given;
      ctx.rota1_given = immunizationCard.context.rota1_given;
      ctx.rota2_given = immunizationCard.context.rota2_given;
      ctx.rota3_given = immunizationCard.context.rota3_given;
      ctx.vit_a_given = immunizationCard.context.vit_a_given;
      ctx.measles_6_given = immunizationCard.context.measles_6_given;
      ctx.measles_9_given = immunizationCard.context.measles_9_given;
      ctx.measles_18_given = immunizationCard.context.measles_18_given;
      ctx.malaria_given = immunizationCard.context.malaria_given;
      ctx.count_due_vaccines = countTotalVaccinesByAge(contact) - getVaccinesReceived(reports.filter(report => [Services.IMMUNIZATION_SERVICE, Services.U5_ASSESSMENT].includes(report.form))).length;
      ctx.is_immunization_defaulter = ctx.count_due_vaccines > 0 ? 'yes' : 'no';
      const vitADoses = extras.getVitADosesGiven(contact, reports);
      Object.keys(vitADoses).forEach(key => ctx[key] = vitADoses[key]);
    }
  },
  {
    label: 'contact.profile.family_planning',
    appliesToType: Persons.CLIENT,
    appliesIf: () => isHouseholdMember(contact) && isOfChildBearingAge(contact) && !postnatalCard.context.is_in_pnc && !pregnancyCard.context.pregnant,
    fields: () => familyPlanningCard.fields,
    modifyContext: (ctx) => {
      ctx.is_on_fp = familyPlanningCard.context.is_on_fp || false;
      ctx.fp_method = familyPlanningCard.context.fp_method;
    }
  },
  {
    label: 'contact.profile.pregnancy',
    appliesToType: Persons.CLIENT,
    appliesIf: () => isHouseholdMember(contact) && isOfChildBearingAge(contact) && pregnancyCard.context.pregnant && !postnatalCard.context.is_in_pnc && isFemaleOrIntersex(contact),
    fields: () => pregnancyCard.fields,
    modifyContext: (ctx) => {
      ctx.pregnant = pregnancyCard.context.pregnant;
      ctx.pregnancy_age_in_weeks = pregnancyCard.context.pregnancy_age_in_weeks || 0;
      ctx.edd = pregnancyCard.context.edd;
      ctx.pregnancy_id = pregnancyCard.context.pregnancy_id;
      ctx.anc_upto_date = pregnancyCard.anc_upto_date;
      ctx.started_anc = pregnancyCard.started_anc;
    }
  },
];

if (contact.parent && contact.parent.contact_type === Places.CHV_AREA) {
  context.calc_last_visit_date = recentChvSupervisionSummary.last_visit_date;
  context.calc_last_visit_action_points = recentChvSupervisionSummary.last_visit_action_points;
  context.calc_supervision_visit_count = recentChvSupervisionSummary.supervision_visit_count;
}

module.exports = {
  fields,
  cards,
  context
};
