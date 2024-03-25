const { DateTime, Duration } = require('luxon');
const NOW = () => DateTime.local().setZone('Africa/Nairobi');
const getDate = numOfDays => NOW().plus(Duration.fromObject({ days: numOfDays })).toISODate();
const over2MonthVaccines = ['bcg', 'opv0', 'opv1', 'opv2', 'opv3', 'pcv1', 'pcv2', 'pcv3',
  'penta1', 'penta2', 'penta3', 'ipv', 'rota1', 'rota2', 'rota3', 'vit_a', 'measles_9', 'measles_18'];
const over2MonthVaccines_immunization_service = ['bcg', 'opv_0', 'opv_1', 'opv_2', 'opv_3', 'pcv_1', 'pcv_2', 'pcv_3',
  'penta_1', 'penta_2', 'penta_3', 'ipv', 'rota_1', 'rota_2', 'rota_3', 'vitamin_a', 'measles_9_months', 'measles_18_months'];
const childHealthProducts = [
  'dt_250',
  'ors_zinc',
  'ors_sachets',
  'zinc_sulphate',
  'albendazole',
  'tetra_eye',
  'paracetamol_120'
];
const reproProducts = [
  'mebendazole',
  'coc',
  'prog',
  'depo_im',
  'depo_sc',
  'preg_strip',
  'condoms'
];
const washProducts = [
  'chlorine'
];
const ncdsProducts = [
  'gluc_strips'
];
const otherProducts = [
  'paracetamol_500'
];
const nonPharmaProducts = [
  'bandages',
  'povi',
  'strap',
  'gloves',
  'envelopes'
];
const equipments = [
  'glucometer',
  'backpack',
  'badge',
  'flashlight',
  'salter',
  'color_salter',
  'weighing_scale',
  'first_aid',
  'bp',
  'thermometer',
  'resp_timer',
  'muac_tape_adults',
  'muac_tape_children',
  'family_muac_tape',
  'moh_513',
  'moh_514',
  'moh_521',
  'moh_100',
  'comm_daily_register',
  'phone',
  'safety_box',
  'others'
];

module.exports = {
  washStatusScenarios: {
    good: [
      ['yes', 'yes', 'piped_water', 'yes', 'yes'],
      ['yes', 'nhif']
    ],
    notGood: [
      ['no', 'no', 'shallow_well', 'no', 'boiling', 'yes', 'pur', 5, 'yes', 'yes'],
      ['yes', 'nhif']
    ],
  },
  placeScenarios: {
    withFocalPerson: [
      ['new_person', 'Demo Focal Person'],
      ['false', 'Demo Place']
    ],
    withoutFocalPerson: [
      ['none'],
      ['false', 'Demo Place']
    ],
    useFocalPersonName: [
      ['new_person', 'Demo Focal Person'],
      ['yes']
    ],
    chvWithFocalPerson: [
      ['new_person', 'Demo Focal Person', '', ''],
      ['false', 'Demo Place', '', '55232', 'Demo Facility', '563847', 'Demo CU']
    ],
    chvWithoutFocalPerson: [
      ['none'],
      ['Demo Place', '', '55232', 'Demo Facility', '563847', 'Demo CU']
    ],
    chvUseFocalPersonName: [
      ['new_person', 'Demo Focal Person', '', ''],
      ['true', '', '55232', 'Demo Facility', '563847', 'Demo CU']
    ],
    chvWithWrongChuCode: [
      ['new_person', 'Demo Focal Person', '', ''],
      ['true', '', '55232', 'Demo Facility', '56384', 'Demo CU']
    ],
    chvWithWrongLinkFacilityCode: [
      ['new_person', 'Demo Focal Person', '', ''],
      ['true', '', '552329', 'Demo Facility', '563848', 'Demo CU']
    ],
    chuWithFocalPerson: [
      ['new_person', 'Demo Focal Person', '', ''],
      ['yes', '', 231]
    ],
    chuWithoutFocalPerson: [
      ['none'],
      ['false', 'Demo Place', 555]
    ],
    chuUseFocalPersonName: [
      ['new_person', 'Demo Focal Person'],
      ['yes', 554]

    ]
  },
  referralFollowUpScenarios: {
    notAvailable: [
      ['no']
    ],
    availableAndVisited: [
      ['yes', 'yes']
    ],
    availableAndNotVisited: [
      ['yes', 'no', 'yes'],
      ['link_health_facility']
    ],
  },
  deathScenarios: {
    healthFacility: [
      ['health_facility', getDate(-10)]
    ],
    homeMale: [
      ['home', getDate(-10), 'unknown']
    ],
    homeFemaleAccident: [
      ['home', getDate(-10), 'accident']
    ],
    homeFemale: (causeOfDeath) => [
      ['home', getDate(-10), causeOfDeath, 'no', 'no']
    ],
    inTheFuture: [
      ['home', getDate(3), 'unknown']
    ]
  },
  mutePersonScenarios: {
    confirmedMute: (reason) => [
      [...reason, 'yes'],
    ],
    unconfirmedMute: [
      ['other', 'blah', 'no']
    ]
  },
  approveMutePersonScenarios: {
    confirmedMute: [
      ['approve']
    ],
    rejectedMute: [
      ['reject', 'some reason']
    ]
  },
  muteHouseholdScenarios: {
    confirmedMute: (reason) => [
      [...reason, 'yes'],
    ],
    unconfirmedMute: [
      ['other', 'Aliniboo tu', 'no']
    ]
  },
  approveMuteHouseholdScenarios: {
    confirmedMute: [
      ['approve']
    ],
    rejectedMute: [
      ['reject', 'some reason']
    ]
  },
  postnatalServiceScenarios: {
    notDelivered: [
      ['no'],
    ],
    deliveredDead: [
      ['yes'],
      ['dead', getDate(-1), 'home'],
      [1, 0],
    ],
    deliveredAndWell: (dateOfDelivey, nextImmunizationDate, placeOfDelivery = 'health_facility') => [
      ['yes'],
      ['alive', dateOfDelivey, placeOfDelivery],
      [1, 1],
      ['none', 'yes', nextImmunizationDate, 'no', 'no'],
      ['hello', 'middle', 'world', 'female', 'yes', '8', 'child', 'no', 'none', 'none', 'no', ['hygiene', 'exclusive_breastfeeding'], 'no'],
      ['none', 'none'],
      ['yes', 'nhif']
    ],
    pncMotherDangerSigns: (days) => [
      ['yes'],
      ['alive', getDate(-days), 'home'],
      [1, 0],
      ['fever', 'yes', getDate(days), 'no', 'no'],
      ['none', 'none'],
      ['yes', 'nhif']
    ],
    newbornDangerSigns: (days) => [
      ['yes'],
      ['alive', getDate(-days), 'home'],
      [1, 1],
      ['none', 'yes', getDate(days), 'yes', getDate(days)],
      ['hello', 'middle', 'world', 'female', 'yes', '8', 'child', 'no', 'none', 'fever', 40, 'yes'],
      ['none', 'none'],
      ['yes', 'nhif']
    ],
    motherPncNotUptodate: (days) => [
      ['yes'],
      ['alive', getDate(-days), 'home'],
      [1, 0],
      ['none', 'no', getDate(days), 'yes', getDate(days)],
      ['none', 'none'],
      ['yes', 'nhif']
    ],
    mentalSigns: (days) => [
      ['yes'],
      ['alive', getDate(-days), 'home'],
      [1, 0],
      ['none', 'no', getDate(days), 'yes', getDate(days)],
      ['none', 'lack_of_hygiene'],
      ['yes', 'nhif']
    ],
    notUpdatedImmunization: (days) => [
      ['yes'],
      ['alive', getDate(-days), 'home'],
      [1, 1],
      ['none', 'yes', getDate(days), 'yes', getDate(days)],
      ['hello', 'middle', 'world', 'female', 'yes', '8', 'other', 'grandchild', 'no', 'none', 'none', 'no', 'immunization', 'yes'],
      ['none', 'none'],
      ['yes', 'nhif']
    ],
    unavailable: [
      ['no'],
    ],
    subsequentVisitIfBabyDeceased: () => [
      ['none', 'yes', getDate(3), 'yes', getDate(30)],
      ['none', 'none'],
      ['yes', 'nhif']
    ],
    subsequentVisitContact: (babyNames = ['default']) => [
      ['none', 'yes', getDate(3), 'yes', getDate(30)],
      (babyNames.map(() => ['yes', 'none', 'yes', 'hygiene'])).flat(),
      ['none', 'none'],
      ['yes', 'nhif']
    ],
    subsequentVisitTask: (babyNames = ['default']) => [
      ['yes'],
      ['none', 'yes', getDate(3), 'yes', getDate(30)],
      babyNames.map(() => ['yes', 'none', 'yes', 'hygiene']).flat(),
      ['none', 'none'],
      ['yes', 'nhif']
    ],
    deliveredDeadChildAlive: (days = -1) => [
      ['yes'],
      ['dead', getDate(days), 'health_facility'],
      [1, 1],
      ['hello', 'middle', 'world', 'female', 'yes', '8', 'other', 'grandchild', 'no', 'none', 'none', 'no', 'immunization', 'yes'],
    ],
    deliveredMultipleAndWell: (dateOfDelivey, babyNames, nextPnc, placeOfDelivery = 'health_facility') => [
      ['yes'],
      ['alive', dateOfDelivey, placeOfDelivery],
      [babyNames.length, babyNames.length],
      ['none', 'yes', nextPnc, 'no', 'no'],
      (babyNames.map(name => [...name.split(' '), 'female', 'yes', '8', 'child', 'no', 'none', 'none', 'no', ['hygiene', 'exclusive_breastfeeding'], 'no'])).flat(),
      ['none', 'none'],
      ['yes', 'nhif']
    ],
  },
  immunizationServiceScenarios: {
    full_immunized: [
      ['yes', 'mother_and_child_handbook', over2MonthVaccines_immunization_service, ''],
      ['6_months'],
      ['yes'],
      ['yes'],
      ['yes', 'nhif'],
    ],
    receivedOptionalVaccines: [
      ['no', 'mother_and_child_handbook', ['measles_6', 'malaria'], 'opv_3'],
      ['6_months'],
      ['yes', 'none'],
      ['yes', 'nhif']
    ],
    referForVaccines: [
      ['no', 'mother_and_child_handbook', '', 'opv_3'],
      ['6_months'],
      ['yes', 'none'],
      ['yes', 'nhif']
    ],
    referForSomeMissedVaccines: [
      ['yes', 'mother_and_child_handbook', ['opv_3', 'pcv_3', 'penta_1'], '', ['penta_2']],
      ['6_months'],
      ['yes', 'none'],
      ['yes', 'nhif']
    ],
    referVitaminA: [
      ['yes', 'mother_and_child_handbook', ['opv_3', 'pcv_3', 'penta_3', 'ipv', 'rota_3', 'vitamin_a'], 'measles_6', ['penta_2']],
      ['none'],
      ['yes', 'none'],
      ['yes', 'nhif']
    ],
    referGrowthMonitoring: [
      ['yes', 'mother_and_child_handbook', ['opv_3', 'pcv_3', 'penta_3', 'ipv', 'rota_3', 'vitamin_a'], 'measles_6', ['penta_2']],
      ['6_months'],
      ['yes', 'sitting'],
      ['yes', 'nhif']
    ],
    referDeworming: [
      ['yes', 'mother_and_child_handbook', ['opv_3', 'pcv_3', 'penta_3', 'ipv', 'rota_3', 'vitamin_a'], ['measles_6'], ['penta_2']],
      ['6_months'],
      ['no'],
      ['yes', 'none'],
      ['yes', 'nhif'],
      ['no', 'out_of_stock']
    ],
    nonReferral: [
      ['no', 'mother_and_child_handbook'],
      ['6_months'],
      ['yes', 'none'],
      ['yes', 'nhif'],
    ],
    nonReferral3MonthsOld: [
      ['no', 'mother_and_child_handbook', 'bcg'],
      ['yes', 'none'],
      ['yes', 'nhif']
    ]
  },
  familyPlanningScenarios: {
    isPregnant: [
      ['no', 'yes'],
      ['no']
    ],
    notPregnant: [
      ['no', 'no', 'yes'],
      ['yes', 'nhif']
    ],
    hasSideEffects: [
      ['yes', 'injectables', 'yes'],
      ['yes', 'nhif']
    ],
    noSideEffects: [
      ['yes', 'injectables', 'no'],
      ['yes', 'nhif']
    ],
    refillableFp: (fpMethod = 'cocs', numDays = 21, numPieces = 10) => [
      ['yes', fpMethod, 'no', 'yes', numPieces, getDate(numDays)],
      ['yes', 'nhif']
    ],
    notRefilled: [
      ['yes', 'cocs', 'no', 'no'],
      ['yes', 'nhif']
    ],
    cocsSubsequentVisit: [
      ['yes', 'no', 'no'],
      ['yes', 'nhif']
    ],
    notOnFpAnymore: [
      ['no', 'no', 'no', 'no'],
      ['yes', 'nhif']
    ],
    changedToTubalLigation: [
      ['no', 'yes', 'tubal_ligation'],
      ['yes', 'nhif'],
    ],
    vasectomy: [
      ['yes', 'vasectomy'],
      ['no']
    ],
    tubalLigation: [
      ['yes', 'tubal_ligation'],
      ['no']
    ]
  },
  u5AssessmentScenarios: {
    under2MonthOld_noDangerSigns: [
      ['no', 'mother'],
      ['yes'],
      ['yes'],
      ['yes', 'no'],
      ['no'],
      ['yes', 'nhif']
    ],
    under1MonthOld_noDangerSigns: [
      ['no', 'mother'],
      ['yes'],
      ['yes'],
      ['yes', 'no'],
      ['yes', 'nhif']
    ],
    under2MonthOld_no_feeding_danger_sign: [
      ['yes', 'mother'],
      ['yes', 'no', 54, 'no', 'no', 36, ...Array(5).fill('no')],
      ['yes'],
      ['yes'],
      ['no']
    ],
    under2MonthOld_convulsion_danger_sign: [
      ['yes', 'mother'],
      ['no', 'yes', 54, 'no', 'no', 36, ...Array(5).fill('no')],
      ['yes'],
      ['yes'],
      ['no']
    ],
    under2MonthOld_fast_breathing: [
      ['yes', 'mother'],
      ['no', 'no', 70, 'no', 'no', 36, ...Array(5).fill('no')],
      ['yes'],
      ['yes'],
      ['yes', 'no'],
      ['no'],
      ['yes', 'nhif']
    ],
    under2MonthOld_chest_indrawing_danger_sign: [
      ['yes', 'mother'],
      ['no', 'no', 54, 'yes', 'no', 36, ...Array(5).fill('no')],
      ['yes'],
      ['yes'],
      ['no']
    ],
    under2MonthOld_fever: [
      ['yes', 'mother'],
      ['no', 'no', 54, 'no', 'yes', 36, ...Array(5).fill('no')],
      ['yes'],
      ['yes'],
      ['yes', 'no'],
      ['no'],
      ['yes', 'nhif']
    ],
    under2MonthOld_temp_danger_sign: (temp) => [
      ['yes', 'mother'],
      ['no', 'no', 54, 'no', 'no', temp, ...Array(5).fill('no')],
      ['yes'],
      ['yes'],
      ['no']
    ],
    under2MonthOld_no_movement_danger_sign: [
      ['yes', 'mother'],
      ['no', 'no', 54, 'no', 'no', 36, 'yes', ...Array(4).fill('no')],
      ['yes'],
      ['yes'],
      ['no']
    ],
    under2MonthOld_yellow_soles_danger_sign: [
      ['yes', 'mother'],
      ['no', 'no', 54, 'no', 'no', 36, 'no', 'yes', ...Array(3).fill('no')],
      ['yes'],
      ['yes'],
      ['no']
    ],
    under2MonthOld_bleeding_umbilical_danger_sign: [
      ['yes', 'mother'],
      ['no', 'no', 54, 'no', 'no', 36, 'no', 'no', 'yes', ...Array(2).fill('no')],
      ['yes'],
      ['yes'],
      ['no']
    ],
    under2MonthOld_local_infection_danger_sign: [
      ['yes', 'mother'],
      ['no', 'no', 54, 'no', 'no', 36, ...Array(3).fill('no'), 'yes', 'no'],
      ['yes'],
      ['yes'],
      ['no']
    ],
    under2MonthOld_birth_weight_danger_sign: [
      ['yes', 'mother'],
      ['no', 'no', 54, 'no', 'no', 36, ...Array(4).fill('no'), 'yes'],
      ['yes'],
      ['yes'],
      ['no']
    ],
    under2MonthOld_development_milestones: (milestones) => [
      ['no', 'mother'],
      ['no'],
      ['yes'],
      ['no', 'yes', milestones],
      ['no'],
      ['no']
    ],
    over2MonthOld_noDangerSigns_incompleteImmunization: [
      ['no', 'mother'],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['yes', 'handbook', ['bcg', 'opv0']],
      ['yes'],
      ['yes'],
      ['yes'],
      ['no'],
      ['yes', 'nhif']
    ],
    over2MonthOld_noDangerSigns: [
      ['no', 'mother'],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['yes', 'handbook', over2MonthVaccines],
      [['6_months']],
      ['yes'],
      ['yes'],
      ['no'],
      ['yes', 'nhif']
    ],
    over2Month_fully_immunized: [
      ['no', 'mother'],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['yes', 'handbook', over2MonthVaccines, ''],
      [['6_months']],
      ['yes'],
      ['yes'],
      ['no'],
      ['yes', 'nhif']
    ],
    fourMonth_immunization: (vaccs) => [
      ['no', 'mother'],
      ['yes'],
      ['yes'],
      ['yes', 'handbook', vaccs],
      ['yes', 'no'],
      ['no'],
      ['yes', 'nhif'],
    ],
    sixMonth_immunization: (vaccs, vitamin_a_doses) => [
      ['no', 'mother'],
      ['green', 'no', 'no'],
      ['yes'],
      ['no', 'no', 'no'],
      ['yes', 'handbook', vaccs],
      [vitamin_a_doses],
      ['yes', 'no'],
      ['no'],
      ['yes', 'nhif'],
    ],
    optional_immunization: [
      ['no', 'mother'],
      ['green', 'no', 'no'],
      ['yes'],
      ['no', 'no', 'no'],
      ['no', 'handbook', ['measles_6', 'malaria'], ['bcg', 'opv0']],
      ['none'],
      ['yes', 'no'],
      ['no'],
      ['yes', 'nhif'],
    ],
    sixMonth_upto_date_vitamin_a: (vaccs) => [
      ['no', 'mother'],
      ['green', 'no', 'no'],
      ['yes'],
      ['no', 'no', 'no'],
      ['yes', 'handbook', vaccs],
      ['yes', 'no'],
      ['no'],
      ['yes', 'nhif'],
    ],
    sixMonth_upto_date_immunization_and_vitamin_a: [
      ['no', 'mother'],
      ['green', 'no', 'no'],
      ['yes'],
      ['no', 'no', 'no'],
      ['yes', 'handbook'],
      ['yes', 'no'],
      ['no'],
      ['yes', 'nhif'],
    ],
    twelveMonth_immunization: (vaccs, vitamin_a_doses) => [
      ['no', 'mother'],
      ['green', 'no', 'no'],
      ['yes'],
      ['no', 'no'],
      ['yes', 'handbook', vaccs],
      [vitamin_a_doses],
      ['yes'],
      ['yes', 'no'],
      ['no'],
      ['yes', 'nhif'],
    ],
    over2Month_immunization_not_upto_date: (vitamin_doses) => [
      ['no', 'mother'],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['no', 'handbook', '', ['pcv3', 'rota3']],
      [vitamin_doses],
      ['yes'],
      ['yes'],
      ['no'],
      ['yes', 'nhif']
    ],
    over2Month_growth_monitoring_delayed: (milestones) => [
      ['no', 'mother'],
      ['green', 'no', 'no'],
      ['yes'],
      ['no', 'no'],
      ['yes', 'handbook', over2MonthVaccines],
      [['6_months']],
      ['yes', 'yes', ...milestones],
      ['no'],
      ['yes', 'nhif']
    ],
    oneYearAndOver_growth_monitoring_delayed: (milestones, vitADose = '6_months') => [
      ['no', 'mother'],
      ['green', 'no', 'no'],
      ['yes'],
      ['no', 'no'],
      ['no', 'handbook', '', 'bcg'],
      [[vitADose]],
      ['yes'],
      ['yes', 'yes', ...milestones],
      ['no'],
      ['yes', 'nhif']
    ],
    under2Month_growth_monitoring_delayed: (milestones) => [
      ['no', 'mother'],
      ['yes'],
      ['yes'],
      ['yes', 'yes', ...milestones],
      ['no'],
      ['yes', 'nhif']
    ],
    under6Month_growth_monitoring_delayed: (milestones) => [
      ['no', 'mother'],
      ['no'],
      ['no'],
      ['yes', 'handbook', over2MonthVaccines],
      ['yes', 'yes', ...milestones],
      ['no'],
      ['yes', 'nhif']
    ],
    over2Month_malaria_positive: [
      ['yes', 'mother'],
      [...Array(4).fill('no'), 'yes', 2, ...Array(6).fill('no')],
      ['positive'],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['yes', 'handbook', over2MonthVaccines],
      [['6_months']],
      ['yes'],
      ['yes'],
      ['no'],
      ['yes', 'nhif'],
      ['yes', '6', '6'],
    ],
    over2Month_malaria_al_pack_values: (dosageInformation) => [
      ['yes', 'mother'],
      [...Array(4).fill('no'), 'yes', 2, ...Array(6).fill('no')],
      ['positive'],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['yes', 'handbook', over2MonthVaccines],
      [['6_months']],
      ['yes'],
      ['yes'],
      ['no'],
      ['yes', 'nhif'],
      ['yes', ...dosageInformation],
    ],
    over2Month_malaria_positive_no_al: [
      ['yes', 'mother'],
      [...Array(4).fill('no'), 'yes', 2, ...Array(6).fill('no')],
      ['positive'],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['yes', 'handbook', over2MonthVaccines],
      [['6_months']],
      ['yes'],
      ['yes'],
      ['no'],
      ['yes', 'nhif'],
      ['no', 'out_of_stock'],
    ],
    over2Month_fast_breathing: [
      ['yes', 'mother'],
      ['yes', 'no', 70, ...Array(8).fill('no')],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['yes', 'handbook', ['bcg', 'opv0', 'opv1', 'opv2', 'opv3', 'pcv1', 'pcv2', 'pcv3',
        'penta1', 'penta2', 'penta3', 'ipv', 'rota1', 'rota2', 'rota3', 'vit_a', 'measles_6', 'measles_9', 'measles_18']],
      [['6_months']],
      ['yes'],
      ['yes'],
      ['no'],
      ['yes', 'nhif'],
      ['no', 'yes', 2]
    ],
    over2Month_diarrhoea_given_ors: [
      ['yes', 'mother'],
      ['no', 'no', 'no', 'yes', 3, ...Array(7).fill('no')],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['yes', 'handbook', over2MonthVaccines],
      [['6_months']],
      ['yes'],
      ['yes'],
      ['no'],
      ['yes', 'nhif'],
      ['yes', 4, 'no', 'out_of_stock']
    ],
    over2Month_diarrhoea_ds: [
      ['yes', 'mother'],
      ['no', 'no', 'no', 'yes', 14, ...Array(7).fill('no')],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['no'],
      ['yes', 4, 'yes', 3]
    ],
    over2Month_diarrhoea_given_zinc: [
      ['yes', 'mother'],
      ['no', 'no', 'no', 'yes', 3, ...Array(7).fill('no')],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['yes', 'handbook', over2MonthVaccines],
      [['6_months']],
      ['yes'],
      ['yes'],
      ['no'],
      ['yes', 'nhif'],
      ['no', 'out_of_stock', 'yes', 4]
    ],
    over2Month_diarrhoea_not_given_ors_zinc: [
      ['yes', 'mother'],
      ['no', 'no', 'no', 'yes', 3, ...Array(7).fill('no')],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['yes', 'handbook', over2MonthVaccines],
      [['6_months']],
      ['yes'],
      ['yes'],
      ['no'],
      ['yes', 'nhif'],
      ['no', 'out_of_stock', 'no', 'out_of_stock']
    ],
    over2Month_diarrhoea_given_ors_zinc: [
      ['yes', 'mother'],
      ['no', 'no', 'no', 'yes', 3, ...Array(7).fill('no')],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['yes', 'handbook', over2MonthVaccines],
      [['6_months']],
      ['yes'],
      ['yes'],
      ['no'],
      ['yes', 'nhif'],
      ['yes', 4, 'yes', 3]
    ],
    over2Month_contact_with_tb: [
      ['yes', 'mother'],
      ['no', 'yes', ...Array(8).fill('no')],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['yes', 'handbook', over2MonthVaccines],
      [['6_months']],
      ['yes'],
      ['yes'],
      ['no'],
      ['yes', 'nhif'],
    ],
    over2Month_contact_with_tb_and_danger_sign: [
      ['yes', 'mother'],
      ['yes', 'yes', '5', ...Array(8).fill('no')],
      ['red', 'no', 'yes'],
      ['yes'],
      ['no'],
      // ['yes'],
      // ['yes'],
      // ['yes'],
      ['no']
    ],
    over2Month_chest_indrawing: [
      ['yes', 'mother'],
      ['no', 'no', 'yes', ...Array(7).fill('no')],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['no']
    ],
    over2Month_blood_in_stool: [
      ['yes', 'mother'],
      [...Array(3).fill('no'), 'yes', 3, 'yes', ...Array(6).fill('no')],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['no'],
      ['yes', 4, 'yes', 3]

    ],
    over2Month_fever_danger_sign: [
      ['yes', 'mother'],
      [...Array(4).fill('no'), 'yes', 14, ...Array(6).fill('no')],
      ['not_done'],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['no'],
      ['yes', 'syrup', 1]

    ],
    over2Month_temp_danger_sign: (temp) => [
      ['yes', 'mother'],
      [...Array(5).fill('no'), 'yes', temp, ...Array(4).fill('no')],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['no']
    ],
    over2Month_convulsions_danger_sign: [
      ['yes', 'mother'],
      [...Array(6).fill('no'), 'yes', ...Array(3).fill('no')],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['no']
    ],
    over2Month_no_feeding_danger_sign: [
      ['yes', 'mother'],
      [...Array(7).fill('no'), 'yes', 'yes', ...Array(2).fill('no')],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['no']
    ],
    over2Month_vomiting_everything_danger_sign: [
      ['yes', 'mother'],
      [...Array(8).fill('no'), 'yes', 'yes', 'no'],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['no']
    ],
    over2Month_unconscious_danger_sign: [
      ['yes', 'mother'],
      [...Array(9).fill('no'), 'yes'],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['no']
    ],
    over2MonthOld_muac_red: [
      ['no', 'mother'],
      ['red', 'no', 'no'],
      ['yes'],
      ['no'],
      ['no']
    ],
    over2MonthOld_muac_swollen_feet: [
      ['no', 'mother'],
      ['green', 'yes', 'no'],
      ['yes'],
      ['no'],
      ['no']
    ],
    threeMonth_noDangerSigns: [
      ['no', 'mother'],
      ['yes'],
      ['yes'],
      ['yes', 'handbook', ['bcg', 'opv0', 'opv1', 'opv2', 'pcv1', 'pcv2', 'penta1', 'penta2', 'rota1', 'rota2']],
      ['yes', 'no'],
      ['no'],
      ['yes', 'nhif']
    ],
    threeMonth_notExclusivelyBreastfeeding: [
      ['no', 'mother'],
      ['yes'],
      ['no'],
      ['yes', 'handbook', 'opv1'],
      ['yes', 'none'],
      ['no'],
      ['yes', 'nhif']
    ],
    over2Month_fast_breathing_not_given_amox: [
      ['yes', 'mother'],
      ['yes', 'no', 70, ...Array(8).fill('no')],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['yes', 'handbook', over2MonthVaccines],
      [['6_months']],
      ['yes'],
      ['yes'],
      ['no'],
      ['yes', 'nhif'],
      ['no', 'no', 'out_of_stock']
    ],
    over2Month_no_growth_monitoring: [
      ['no', 'mother'],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['yes', 'handbook', ['bcg', 'opv0', 'opv1', 'opv2', 'opv3', 'pcv1', 'pcv2', 'pcv3',
        'penta1', 'penta2', 'penta3', 'ipv', 'rota1', 'rota2', 'rota3', 'vit_a', 'measles_6', 'measles_9', 'measles_18']],
      [['6_months']],
      ['yes'],
      ['no'],
      ['no'],
      ['yes', 'nhif']
    ],
    over2MonthOld_muac_not_done: [
      ['no', 'mother'],
      ['not_done', 'no', 'no'],
      ['yes'],
      ['no'],
      ['yes', 'handbook', over2MonthVaccines],
      [['6_months']],
      ['yes'],
      ['yes'],
      ['no'],
      ['yes', 'nhif']
    ],
    over2MonthOld_muac_yellow: [
      ['no', 'mother'],
      ['yellow', 'no', 'no'],
      ['yes'],
      ['no'],
      ['yes', 'handbook', over2MonthVaccines],
      [['6_months']],
      ['yes'],
      ['yes'],
      ['no'],
      ['yes', 'nhif']
    ],
    over2Month_malaria_negative: [
      ['yes', 'mother'],
      [...Array(4).fill('no'), 'yes', 2, ...Array(6).fill('no')],
      ['negative'],
      ['green', 'no', 'no'],
      ['yes'],
      ['no'],
      ['yes', 'handbook', over2MonthVaccines],
      [['6_months']],
      ['yes'],
      ['yes'],
      ['no'],
      ['yes', 'nhif']
    ]
  },
  householdRegistrationScenarios: {
    default: [
      ['John', '', 'Fonda', 'male', 'approx', '24', 0, 'yes', 'yes', '44', '44', 'suna-west', 'wiga', 'airbase', '+254712323423', '', 'national_id', '12345678', 'Jane', 'aunt', 'Nairobi', '+254712323423', '', '', 'no', 'no', 'no', 'no'],
      ['no', 'no', 'no', 'piped_water', 'yes']
    ],
    default_with_approx_dob: (age) => [
      ['John', '', 'Fonda', 'male', 'approx', age, 0, 'yes', 'yes', '44', '44', 'suna-west', 'wiga', 'airbase', '+254712323423', '', 'national_id', '12345678', 'Jane', 'aunt', 'Nairobi', '+254712323423', '', '', 'no', 'no', 'no', 'no'],
      ['no', 'no', 'no', 'piped_water', 'yes']
    ],
    registerLater: [
      ['John', '', 'Fonda', 'male', 'approx', '24', 0, 'yes', 'yes', '44', '44', 'suna-west', 'wiga', 'airbase', '+254712323423', '', 'national_id', '12345678', 'Jane', 'aunt', 'Nairobi', '+254712323423', '', '', 'no', 'no', 'no', 'yes', 'no'],
      ['no', 'no', 'no', 'piped_water', 'yes']
    ],
    withMembers: (phone = '+254712323423') => [
      ['John', '', 'Fonda', 'male', 'approx', '24', 0, 'yes', 'yes', '44', '44', 'suna-west', 'wiga', 'airbase', phone, '', 'national_id', '12345678', 'Jane', 'aunt', 'Nairobi', '+254712323423', '', '', 'no', 'no', 'no', 'yes', 'yes'],
      [1, 'Baby', '', 'Janet', 'male', 'approx', 10, 0, 'yes', 'yes', '44', '44', 'suna-west', 'wiga', 'airbase', 'birth_certificate', '12345678', 'yes', 'Jane', 'aunt', 'Nairobi', '+254712323423', '', '', 'child', 'no', 'no', 'no', 'no'],
      ['no', 'no', 'no', 'piped_water', 'yes']
    ]
  },
  pregnancyHomeVisitScenarios: {
    onFp: [
      ['no', 'yes'],
      ['yes', 'nhif']
    ],
    isPregnant: (edd = getDate(100), nextAnc = getDate(10)) => [
      ['yes'],
      ['yes', 'yes', edd, nextAnc],
      ['none'],
      ['green'],
      [],
      ['yes'],
      [],
      ['none', 'none'],
      ['yes', 'nhif']
    ],
    lmpLt30Days: [
      ['no', 'no', 'no', 'less_than_30_days_ago'],
      ['yes', 'nhif']
    ],
    lmpGt30Days: (pregnancyTestResult = 'negative') => [
      ['no', 'no', 'no', 'more_than_30_days_ago', pregnancyTestResult],
      ['yes', 'nhif']
    ],
    positivePregnancyTest: [
      ['no', 'no', 'no', 'more_than_30_days_ago', 'positive'],
      ['none'],
      ['not_taken'],
      [],
      ['yes'],
      [],
      ['none', 'none'],
      ['yes', 'nhif']
    ],
    pregnancyTestNotDone: [
      ['no', 'no', 'no', 'more_than_30_days_ago', 'not_done'],
      ['yes', 'nhif']
    ],
    pregnantUnknownLmpGt30: [
      ['unknown', 'more_than_30_days_ago', 'negative'], ['yes', 'nhif']
    ],
    hasDangerSigns: [
      ['yes'],
      ['yes', 'yes', getDate(100), getDate(10)],
      [['fits', 'fever']],
      ['green'],
      [],
      ['yes'],
      [],
      ['none', 'none'],
      ['yes', 'nhif']
    ],
    hasMentalDangerSigns: [
      ['yes'],
      ['yes', 'yes', getDate(100), getDate(10)],
      ['none'],
      ['green'],
      [],
      ['yes'],
      [],
      ['tearfulness', 'anxiety'],
      ['yes', 'nhif']
    ],
    notStartedAnc: [
      ['yes'],
      ['no'],
      ['none'],
      ['green'],
      [],
      ['yes'],
      [],
      ['none', 'none'],
      ['yes', 'nhif']
    ],
    ancNotUptoDate: [
      ['yes'],
      ['yes', 'no'],
      ['none'],
      ['green'],
      [],
      ['yes'],
      [],
      ['none', 'none'],
      ['yes', 'nhif']
    ],
    muac: (muac, edd = getDate(100)) => [
      ['yes'],
      ['yes', 'yes', edd, getDate(10)],
      ['none'],
      [muac],
      [],
      ['yes'],
      [],
      ['none', 'none'],
      ['yes', 'nhif'],
      []
    ],
    lostPregnancy: (pregnancyPeriod = 'less_than_7_months') => [
      ['no', 'no', 'yes', 'no', pregnancyPeriod],
      ['yes', 'nhif']
    ],
    delivered: [
      ['no', 'no', 'no'],
      ['yes', 'nhif']
    ]
  },
  subsequentPregnancyHomeVisitScenarios: {
    notPregnantAnymoreTask: [
      ['yes', 'no', 'no', 'no'],
      ['yes', 'nhif']
    ],
    notPregnantAnymoreAction: [
      ['no', 'no', 'no'],
      ['yes', 'nhif']
    ],
    stillPregnantTask: [
      ['yes', 'yes'],
      ['no'],
      [['fits', 'fever']],
      ['green'],
      [],
      ['yes'],
      [],
      ['tearfulness', 'anxiety'],
      ['yes', 'nhif']
    ],
    stillPregnantAction: [
      ['yes'],
      ['no'],
      [['fits', 'fever']],
      ['green'],
      [],
      ['yes'],
      [],
      ['tearfulness', 'anxiety'],
      ['yes', 'nhif']
    ],
    ancUptoDateTask: [
      ['yes', 'yes'],
      ['yes', getDate(200), getDate(20)],
      ['none'],
      ['green'],
      [],
      ['yes'],
      [],
      ['tearfulness', 'anxiety'],
      ['yes', 'nhif']
    ],
    ancUptoDateAction: [
      ['yes'],
      ['yes', getDate(200), getDate(20)],
      ['none'],
      ['green'],
      [],
      ['yes'],
      [],
      ['tearfulness', 'anxiety'],
      ['yes', 'nhif']
    ]
  },
  treatmentFollowUpScenarios: {
    notAvailable: [
      ['no']
    ],
    hasSideEffects: [
      ['yes', 'feeling_better', 'yes', 'constipation'],
      ['link_health_facility']
    ],
    worseOrNoChange: [
      ['yes', 'no_change', 'no'],
      ['link_health_facility']
    ],
    noFollowUp: [
      ['yes', 'feeling_better', 'no']
    ]
  },
  immunizationScenarios: {
    vaccineStatusUptodate: [
      ['no', 'mother_and_child_handbook', '', ['opv_3', 'pcv_3']],
      [['36_months']],
      ['yes'],
      ['no'],
      ['yes', 'nhif']
    ],
    growthMonitoring: [
      ['yes', 'mother_and_child_handbook', ['opv_3', 'pcv_3'], '', ['penta_2']],
      [['36_months']],
      ['yes'],
      ['no'],
      ['yes', 'nhif']
    ],
    immunization: [
      ['yes', 'yes'],
      ['yes', 'mother_and_child_handbook', ['opv_3', 'pcv_3', 'penta_3', 'ipv', 'rota_1', 'rota_3', 'measles_18_months'], '', ['penta_2']],
      ['6_months'],
      ['yes'],
      ['yes'],
      ['yes', 'nhif']
    ]
  },
  overFiveAssessmentScenarios: {
    hasDangerSignsReferral: [
      ['yes', 'other', 'others'],
      ['blah']
    ],
    hasOtherDangerSignsReferral: [
      ['yes', 'other', 'others'],
      ['blah']
    ],
    hasOtherDangerSignsReferralForWithCareGiver: [
      ['yes', 'mother', 'other', 'others'],
      ['blah']
    ],
    hasSignsSymptomsReferral: [
      ['yes', 'difficulty_in_breathing'],
      ['blah']
    ],
    hasFeverReferral: (daysOfFever, hasTakenAL) => [
      ['yes', 'fever'],
      [daysOfFever].concat(daysOfFever > 1 ? [] : [hasTakenAL]),
      ['no', 'patient_prefers_another_source', '']
    ],

    hasMalariaReferral: [
      ['yes', 'mother', 'fever'],
      ['2', 'no'],
      ['positive'],
      ['no', 'none'],
      ['no', 'none'],
      ['no'],
      ['no'],
      ['no'],
      ['no', 'patient_prefers_another_source', 'no', 'patient_prefers_another_source']
    ],
    hasTBSigns: [
      ['yes', 'mother', 'cough_of_any_duration'],
      ['no', 'chest_pain'],
      ['no', 'none'],
      ['no'],
      ['no'],
      ['no'],
      []
    ],
    hasDiarrhoea: [
      ['yes', 'mother', 'diarrhoea'],
      ['14', 'yes'],
      ['no', 'patient_prefers_another_source', 'no', 'patient_prefers_another_source']
    ],
    hasHypertension: [
      ['no'],
      ['no', 'none'],
      ['yes'],
      ['yes', 'yes'],
      ['no', 'dizziness', 140, 90],
      ['yes'],
      ['none', 'none'],
      ['no'],
      ['no'],
      ['blah']
    ],
    hasDiabetes: [
      ['no'],
      ['no', 'none'],
      ['yes'],
      ['yes', 'yes'],
      ['no', 'dizziness', 140, 90],
      ['yes'],
      ['none', 'none'],
      ['no'],
      ['no'],
      ['blah']
    ],
    subSequentHasHypertension: [
      ['no'],
      ['no', 'none'],
      ['yes'],
      ['yes'],
      ['no', 140, 90],
      ['yes'],
      ['none', 'none'],
      ['no'],
      ['no'],
      ['blah']
    ],
    subSequentHasDiabetes: [
      ['no'],
      ['no', 'none'],
      ['yes'],
      ['yes'],
      ['no', 140, 90],
      ['yes'],
      ['none', 'none'],
      ['no'],
      ['no'],
      ['blah']
    ],
    hasMentalHealth: [
      ['no'],
      ['no', 'none'],
      ['yes'],
      ['yes', 'yes'],
      ['yes', 'yes', 138, 80],
      ['yes'],
      ['lack_of_sleep', 'none'],
      ['no'],
      ['no'],
      ['blah']
    ],
    hasSGBVSigns: [
      ['no'],
      ['no', 'none'],
      ['yes'],
      ['yes', 'yes'],
      ['yes', 'yes', 138, 80],
      ['yes'],
      ['none', 'none'],
      ['yes', '', 'yes'],
      ['no'],
      ['blah']
    ],
    isNotSick: [
      ['no'],
      ['yes', 'yes']
    ],
    hasInvalidMRDT: [
      ['yes', 'fever'],
      ['2', 'no'],
      ['invalid', 'invalid'],
      ['no', 'none'],
      ['no'],
      ['no', 'none'],
      ['no', 'none', 100, 100],
      ['no'],
      ['none', 'none'],
      ['no'],
      ['no'],
      ['no', 'patient_prefers_another_source']
    ],
    hasNoMRDTDone: [
      ['yes', 'fever'],
      ['2', 'no'],
      ['not_done'],
      ['no', 'none'],
      ['no'],
      ['no', 'none'],
      ['no', 'none', 100, 100],
      ['no'],
      ['none', 'none'],
      ['no'],
      ['no'],
      ['no', 'patient_prefers_another_source']
    ]
  },
  defaulterFollowUpScenarios: {
    notAvailable: (days) => [['no', getDate(days)]],
    availableDidClinicVisit: [['yes', 'art,tb', 'yes', 'link_facility']],
    availableNoClinicVisitNeedsClinicVisit: [['yes', 'art,tb', 'no', 'default reason', 'yes', 'yes'], ['link_facility']],
    availableNoClinicVisitNeedsClinicVisitPNC: [['yes', 'tb,pnc', 'no', 'default reason', 'yes', 'yes'], ['link_facility']],
    availableNoClinicVisitNeedsNoClinicVisit: [['yes', 'art,tb', 'yes', 'link_facility']],
  },
  personRegistrationScenarios: {
    default: (dob) => [
      ['Janet', '', 'Fonda', 'female', 'calendar', dob, 'yes', 'yes', '44', '44', 'suna-west', 'wiga', 'airbase', 'yes', '+254712323423', '', 'national_id', '12345678', 'yes', 'Jane', 'aunt', 'Nairobi', '+254712323423', '', '', 'spouse', 'no', 'no', 'no', 'no', 'no']
    ],
    defaultNoPhone: (dob) => [
      ['Janet', '', 'Fonda', 'female', 'calendar', dob, 'yes', 'yes', '44', '44', 'suna-west', 'wiga', 'airbase', 'no', 'national_id', '12345678', 'yes', 'Jane', 'aunt', 'Nairobi', '+254712323423', '', '', 'spouse', 'no', 'no', 'no', 'no', 'no']
    ],
    withMembers: (age, days = -20) => [
      [2, 'Doe', 'male', 'calendar', getDate(days), 'birth_certificate', 'QWER56WE', 'child', 'no', 'no', 'no', 'Jane', 'female', 'approx', age, 0, '', '', 'national_id', 'QWER56WE', 'spouse', 'no', 'no', 'yes', 'no']
    ],
    femaleOnFp: (dob) => [
      ['Janet', '', 'Fonda', 'female', 'calendar', dob, 'yes', 'yes', '44', '44', 'suna-west', 'wiga', 'airbase', 'yes', '+254712323423', '', 'national_id', '12345678', 'yes', 'Jane', 'aunt', 'Nairobi', '+254712323423', '', '', 'spouse', 'no', 'no', 'no', 'no', 'yes']
    ],
    overFiveUnderTenFemale: (dob, sex = 'female') => [
      ['Baby', '', 'Janet', sex, 'calendar', dob, 'yes', 'yes', '44', '44', 'suna-west', 'wiga', 'airbase', 'birth_certificate', '12345678', 'yes', 'Jane', 'aunt', 'Nairobi', '+254712323423', '', '', 'child', 'no', 'no', 'no', 'no']
    ],
    overFiveUnderTenMale: (dob) => [
      ['Baby', '', 'Janet', 'male', 'calendar', dob, 'yes', 'yes', '44', '44', 'suna-west', 'wiga', 'airbase', 'birth_certificate', '12345678', 'yes', 'Jane', 'aunt', 'Nairobi', '+254712323423', '', '', 'child', 'no', 'no', 'no', 'no']
    ],
    under6Month: (dob) => [
      ['Baby', '', 'Janet', 'female', 'calendar', dob, 'yes', 'yes', '44', '44', 'suna-west', 'wiga', 'airbase', 'birth_certificate', '12345678', 'yes', 'Jane', 'aunt', 'Nairobi', '+254712323423', '', '', 'child', 'no', 'no', 'no', 'yes']
    ],
    under1: (dob) => [
      ['Baby', '', 'Janet', 'female', 'calendar', dob, 'yes', 'yes', '44', '44', 'suna-west', 'wiga', 'airbase', 'birth_certificate', '12345678', 'yes', 'Jane', 'aunt', 'Nairobi', '+254712323423', '', '', 'child', 'no', 'no', 'no', 'yes', 'green']
    ],
    over1Under5Yr: (dob) => [
      ['Baby', '', 'Janet', 'female', 'calendar', dob, 'yes', 'yes', '44', '44', 'suna-west', 'wiga', 'airbase', 'birth_certificate', '12345678', 'yes', 'Jane', 'aunt', 'Nairobi', '+254712323423', '', '', 'child', 'no', 'no', 'no', 'green']
    ],
    man: (dob) => [
      ['John', '', 'Fonda', 'male', 'calendar', dob, 'yes', 'yes', '44', '44', 'suna-west', 'wiga', 'airbase', 'yes', '+254712323423', '', 'national_id', '12345678', 'yes', 'Jane', 'aunt', 'Nairobi', '+254712323423', '', '', 'sibling', 'no', 'no']
    ],
    intersex: (dob) => [
      ['Jane', '', 'Fonda', 'intersex', 'calendar', dob, 'yes', 'yes', '44', '44', 'suna-west', 'wiga', 'airbase', 'yes', '+254712323423', '', 'national_id', '12345678', 'yes', 'Jane', 'aunt', 'Nairobi', '+254712323423', '', '', 'sibling', 'no', 'no', 'no', 'no', 'no']
    ],
    elderly: (age, sex = 'female') => [
      ['Janet', '', 'Fonda', sex, 'approx', age, 0, 'yes', 'yes', '44', '44', 'suna-west', 'wiga', 'airbase', 'yes', '+254712323423', '', 'national_id', '12345678', 'yes', 'Jane', 'aunt', 'Nairobi', '+254712323423', '', '', 'spouse', 'no', 'no']
    ],
    newborn: (days = -1) => [
      ['Baby', '', 'Janet', 'male', 'calendar', getDate(days), 'yes', 'yes', '44', '44', 'suna-west', 'wiga', 'airbase', 'birth_certificate', '12345678', 'yes', 'Jane', 'aunt', 'Nairobi', '+254712323423', '', '', 'child', 'no', 'no', 'no', 'no']
    ],
    female_delivered_last_42_days: (dob) => [
      ['Janet', 'female', 'calendar', dob, '', '', 'national_id', '12345678', 'spouse', 'no', 'no', 'no', 'yes', 'no']
    ],
    foreigner: (dob) =>
      [
        'First', '', 'Last', 'male', 'calendar', dob, 'no', 'AL', 'no', 'AL', 1, 'changamwe', 'port-reitz',
        'village', 'yes', '+254712323423', '', 'national_id', '32434354', 'yes', 'Next of Kin', 'spouse', 'Kin Residence', '+254712323423', '', '', 'spouse', 'no', 'no',
      ]
  },
  getDate,
  DateTime,
  deathReviewScenarios: {
    notConfirmed: [
      ['no']
    ],
    healthFacility: [
      ['yes', 'health_facility', getDate(-10)]
    ],
    homeMale: [
      ['yes', 'home', getDate(-10), 'unknown']
    ],
    homeFemale: [
      ['yes', 'home', getDate(-5), 'sudden_death', 'no', 'no']
    ],
    homeFemalePregnant: [
      ['yes', 'home', getDate(-10), 'pregnancy_and_childbirth', 'yes']
    ],
    inTheFuture: [
      ['yes', 'home', getDate(3), 'unknown']
    ]
  },
  postnatalServiceNewbornScenarios: {
    default: (initial = true, source = 'contact') => [
      initial ? (source === 'task' ? ['yes', 'father', 'health_facility'] : ['father', 'health_facility']) : ['yes', 'father'],
      ['none', 'yes', ['exclusive_breastfeeding', 'sleep_under_net'], 'yes'],
      ['yes', 'nhif']
    ],
    withDangerSigns: (initial = true) => [
      initial ? ['father', 'health_facility'] : ['yes', 'father'],
      [['fever', 'convulsed', 'not_moving'], 40, 'yes'],
      ['yes', 'nhif']
    ],
    withImmunizationDefault: (initial = true) => [
      initial ? ['father', 'health_facility'] : ['yes', 'father'],
      ['none', 'no', ['exclusive_breastfeeding', 'sleep_under_net'], 'yes'],
      ['yes', 'nhif']
    ],
    notAvailable: [
      ['no', 'father'],
      ['yes', 'nhif']
    ]
  },
  communityEventScenarios: {
    default: (eventDate) => [
      ['community_dialogue', getDate(eventDate), 11, 11, 22]
    ],
    numAttendeesEdits: (numAttendees = 3, numMales = 1, numFemales = 2) => [
      ['community_dialogue', getDate(-3), numMales, numFemales, numAttendees]
    ]
  },
  commoditiesOrderEventScenarios: {
    default: [

      [
        ['commodities', 'equipment'],
        ['malaria', 'child_health', 'repro_maternal', 'wash', 'ncds', 'others', 'non_pharma'],
        ['rdts', 'act_6', 'act_12', 'act_18', 'act_24'],
        ['dt_250', 'ors_zinc', 'ors_sachets', 'zinc_sulphate', 'albendazole', 'tetra_eye', 'paracetamol_120'],
        ['mebendazole', 'coc', 'prog', 'depo_im', 'depo_sc', 'preg_strip'],
        ['chlorine'],
        ['paracetamol_500'],
        ['gluc_strips'],
        ['bandages', 'povi', 'strap', 'gloves', 'envelopes'],
        ['glucometer', 'backpack', 'badge', 'flashlight', 'salter', 'color_salter', 'weighing_scale', 'first_aid', 'bp', 'thermometer', 'resp_timer', 'muac_tape_adults', 'muac_tape_children',
          'family_muac_tape', 'moh_514', 'moh_521', 'moh_100', 'comm_daily_register', 'phone', 'safety_box', 'others']
      ],
      [...Array((5 * 3)).fill('1')],
      [...Array((7 * 3)).fill('1')],
      [...Array((6 * 3)).fill('1')],
      [...Array((1 * 3)).fill('1')],
      [...Array((1 * 3)).fill('1')],
      [...Array((1 * 3)).fill('1')],
      [...Array((5 * 3)).fill('1')],
      [...Array((21 * 3)).fill('1'), '2 forceps']
    ]
  },
  commoditySuppliedScenarios: {
    default: [
      [
        ['commodities', 'equipment'],
        ['malaria', 'child_health', 'repro_maternal', 'wash', 'ncds', 'others', 'non_pharma'],
        ['rdts', 'act_6', 'act_12', 'act_18', 'act_24'],
        ['dt_250', 'ors_zinc', 'ors_sachets', 'zinc_sulphate', 'albendazole', 'tetra_eye', 'paracetamol_120'],
        ['mebendazole', 'coc', 'prog', 'depo_im', 'depo_sc', 'preg_strip'],
        ['chlorine'],
        ['paracetamol_500'],
        ['gluc_strips'],
        ['bandages', 'povi', 'strap', 'gloves', 'envelopes'],
        ['glucometer', 'backpack', 'badge', 'flashlight', 'salter', 'color_salter', 'weighing_scale', 'first_aid', 'bp', 'thermometer', 'resp_timer', 'muac_tape_adults', 'muac_tape_children',
          'family_muac_tape', 'moh_514', 'moh_521', 'moh_100', 'comm_daily_register', 'phone', 'safety_box', 'others']
      ],
      [...Array((5)).fill('1')],
      [...Array((7)).fill('1')],
      [...Array((6)).fill('1')],
      [...Array((1)).fill('1')],
      [...Array((1)).fill('1')],
      [...Array((1)).fill('1')],
      [...Array((5)).fill('1')],
      [...Array((20)).fill('1'), 'forceps', 2]
    ],
    stockOut: [
      []
    ]
  },
  commodityCountScenarios: {
    default: [
      [],
      ['1', '1'],
      [...Array.from({ length: childHealthProducts.length }, () => [100, 12, '']).flat()],
      [...Array.from({ length: reproProducts.length }, () => [100, 12, '']).flat()],
      [...Array.from({ length: washProducts.length }, () => [100, 12, '']).flat()],
      [...Array.from({ length: ncdsProducts.length }, () => [100, 12, '']).flat()],
      [...Array.from({ length: otherProducts.length }, () => [100, 12, '']).flat()],
      [...Array.from({ length: nonPharmaProducts.length }, () => [100, 12, '']).flat()],
      [...Array.from({ length: equipments.length - 1 }, () => [100, 12, '']).flat(), 'something', 500],
      []
    ]
  },
  commodityReceivedScenarios: {
    default: [
      [],
      [...Array((5)).fill('yes')],
      [...Array((7)).fill('yes')],
      [...Array((6)).fill('yes')],
      [...Array((1)).fill('yes')],
      [...Array((1)).fill('yes')],
      [...Array((1)).fill('yes')],
      [...Array((5)).fill('yes')],
      [...Array((22)).fill('yes')]
    ],
    stockOut: [
      []
    ]
  },
  commodityReturnedScenarios: {
    default: [
      [],
      ['yes']
    ],
    stockOut: [
      []
    ]
  },
  chuSupervisionScenarios: {
    default: [
      ['annual'],
      ['60', 'This is a decent performance', 'yes'],
      ['1', getDate(-30), '1', '15', getDate(-30), '13', '5', 'Over 5 vaccinations', getDate(-25), '5'],
      ['Frequesnt follow up SMS', 'done', 'Poor network'],
      ['7', '5', 'Managing infant diarrhea', '5', '3', '4', '1', 'Trip to benchmark in other facility', 'Motivation of CHVs is making this program a success'],
      [['chc_training', 'certificates', 'other'], 'Plates and cups as extra motivation', '3', '3', '1', 'T-Shirts as motivation', 'Comment on motivation', '3', '12'],
      ['yes'],
      ['yes', 'yes', 'yes', 'yes', 'Utilize the info this way'],
      ['yes', 'yes'],
      ['1', '60', '60', 'Responses and recommendations'],
      ['10000', '10000', '7000', '5000', '10000', '10000', '7000', '5000', '10000', '10000', '7000', '5000', '10000', '10000', '7000', '5000', 'World Bank', '10000', '10000', '7000', '5000', 'Applying to Bill & Melinda Gates foundation'],
      [['ambulance', 'motorbike', 'bicycle', 'other'], 'tuktuk', '5', '5', '5', '5', 'some transport comments here', 'yes', 'yes', ['phone', 'other'], 'walkie talkie'],
      ['yes', '2', '5', '5', '5', '5', 'we need more supplies'],
      ['1', '2', '1', '3', '1', 'action point is supervision visit needs follow up 1']
    ],
    defaultAfter: (uniqueMarker = 2) => [
      ['yes'],
      ['annual'],
      ['60', 'This is a decent performance', 'yes'],
      ['1', getDate(-30), '1', '15', getDate(-30), '13', '5', 'Over 5 vaccinations', getDate(-25), '5'],
      ['Frequesnt follow up SMS', 'done', 'Poor network'],
      ['7', '5', 'Managing infant diarrhea', '5', '3', '4', '1', 'Trip to benchmark in other facility', 'Motivation of CHVs is making this program a success'],
      [['chc_training', 'certificates', 'other'], 'Plates and cups as extra motivation', '3', '3', '1', 'T-Shirts as motivation', 'Comment on motivation', '3', '12'],
      ['yes'],
      ['yes', 'yes', 'yes', 'yes', 'Utilize the info this way'],
      ['yes', 'yes'],
      ['1', '60', '60', 'Responses and recommendations'],
      ['10000', '10000', '7000', '5000', '10000', '10000', '7000', '5000', '10000', '10000', '7000', '5000', '10000', '10000', '7000', '5000', 'World Bank', '10000', '10000', '7000', '5000', 'Applying to Bill & Melinda Gates foundation'],
      [['ambulance', 'motorbike', 'bicycle', 'other'], 'tuktuk', '5', '5', '5', '5', 'some transport comments here', 'yes', 'yes', ['phone', 'other'], 'walkie talkie'],
      ['yes', '2', '5', '5', '5', '5', 'we need more supplies'],
      ['1', '2', '1', '3', '1', 'action point is supervision visit needs follow up '.concat(uniqueMarker)]
    ],
    moreResponsesThanNeeded: [
      ['should_be_yes_or_no', 'The meeting went well'],
      ['annual'],
      ['60', 'This is a decent performance', 'yes'],
      ['1', getDate(-30), '1', '15', getDate(-30), '13', '5', 'Over 5 vaccinations', getDate(-25), '5'],
      ['Frequesnt follow up SMS', 'done', 'Poor network'],
      ['7', '5', 'Managing infant diarrhea', '5', '3', '4', '1', 'Trip to benchmark in other facility', 'Motivation of CHVs is making this program a success'],
      [['chc_training', 'certificates', 'other'], 'Plates and cups as extra motivation', '3', '3', '1', 'T-Shirts as motivation', 'Comment on motivation', '3', '12'],
      ['yes'],
      ['yes', 'yes', 'yes', 'yes', 'Utilize the info this way'],
      ['yes', 'yes'],
      ['1', '60', '60', 'Responses and recommendations'],
      ['10000', '10000', '7000', '5000', '10000', '10000', '7000', '5000', '10000', '10000', '7000', '5000', '10000', '10000', '7000', '5000', 'World Bank', '10000', '10000', '7000', '5000', 'Applying to Bill & Melinda Gates foundation'],
      [['ambulance', 'motorbike', 'bicycle', 'other'], 'tuktuk', '5', '5', '5', '5', 'some transport comments here', 'yes', 'yes', ['phone', 'other'], 'walkie talkie'],
      ['yes', '2', '5', '5', '5', '5', 'we need more supplies'],
      ['1', '2', '1', '3', '1', 'action point is supervision visit needs follow up']
    ],
    incorrectDate: [
      ['annual'],
      ['60', 'This is a decent performance', 'yes'],
      ['1', getDate(30), '1', '15', getDate(-30), '13', '5', 'Over 5 vaccinations', getDate(-25), '5'],
      ['Frequesnt follow up SMS', 'done', 'Poor network'],
      ['7', '5', 'Managing infant diarrhea', '5', '3', '4', '1', 'Trip to benchmark in other facility', 'Motivation of CHVs is making this program a success'],
      [['chc_training', 'certificates', 'other'], 'Plates and cups as extra motivation', '3', '3', '1', 'T-Shirts as motivation', 'Comment on motivation', '3', '12'],
      ['yes'],
      ['yes', 'yes', 'yes', 'yes', 'Utilize the info this way'],
      ['yes', 'yes'],
      ['1', '60', '60', 'Responses and recommendations'],
      ['10000', '10000', '7000', '5000', '10000', '10000', '7000', '5000', '10000', '10000', '7000', '5000', '10000', '10000', '7000', '5000', 'World Bank', '10000', '10000', '7000', '5000', 'Applying to Bill & Melinda Gates foundation'],
      [['ambulance', 'motorbike', 'bicycle', 'other'], 'tuktuk', '5', '5', '5', '5', 'some transport comments here', 'yes', 'yes', ['phone', 'other'], 'walkie talkie'],
      ['yes', '2', '5', '5', '5', '5', 'we need more supplies'],
      ['1', '2', '1', '3', '1', 'action point is supervision visit needs follow up']
    ]
  },
  chaSupervisionScenarios: {
    default: (eventDate) => [
      [eventDate]
    ]
  },
  chvSupervisionScenarios: {
    notAvailable: (eventDate) => [
      ['no', eventDate]
    ],
    available: [
      ['yes', ['stock_check', 'assessment']],
      ['no', ['uniform_badge', 'charged_phone'], 'yes'],
      [['nutrition', 'immunization', 'wash'], ['check_for_muac_usage', 'check_for_muac_interpretation'], ['education_on_importance_of_immunization', 'defaulter_tracing_or_follow_up'], ['use_of_latrines', 'refusal_disposal']],
      ['no comment'],
      ['other comment']
    ]
  },
  chaSupervisionCalendarScenarios: {
    notAvailable: (eventDate) => [
      ['no', eventDate]
    ],
    default: (whenSupervise) => [
      [whenSupervise]
    ]
  },
  chaVerbalAutopsyScenarios: {
    default: [
      ['yes']
    ],
    planned: (eventDate) => [
      ['yes'], eventDate
    ],
    notPlanned: (eventDate) => [
      ['no', 'yes', eventDate]
    ]
  },
  unmuteScenarios: {
    confirmedUnmute: [
      ['moved_back']
    ]
  },
  sgbvScenarios: {
    none: [
      ['no']
    ],
    observed: [
      ['yes', 'some', 'no']
    ],
    referred: [
      ['yes', 'several', 'yes']
    ]
  },
  commodityReturnScenarios: {
    default: [
      ['commodities', 'malaria', 'rdts'],
      ['excess', 10, 5, 5]
    ],
    stockOut: [
      []
    ]
  },
  commodityDiscrepancyScenarios: {
    default: [
      [],
      [...Array((5)).fill('yes')],
      [...Array((7)).fill('yes')],
      [...Array((6)).fill('yes')],
      ['no', 0],
      [...Array((1)).fill('yes')],
      [...Array((1)).fill('yes')],
      [...Array((5)).fill('yes')],
      [...Array((22)).fill('yes')]
    ],
    stockOut: [
      []
    ]
  },
  commodityDiscrepancyResolutionScenarios: {
    default: [
      [5]
    ]
  },
  cebsScenarios: {
    chvSignalReporting: [
      ['public_event_of_concern', 'Food poisoning at Kids Excellence School.']
    ],
    chaSignalReporting: [
      ['child_weak_legs_arms'],
      [
        getDate(-1), // health_threat_start_datetime
        '10:00', // health_threat_start_datetime
        '1', // approx_no_people_affected
        '1', // approx_no_people_dead
        'health_care_worker', // signal_source
        '', // additional_details
        getDate(-1), // verification_date
        '10:00', // verification_time
        'yes', // threat_exists
        getDate(-1), // scdsc_informed_date
        '10:00', // scdsc_informed_time
        'yes' // signal_referred_to_animal_health
      ]
    ],
    chaSignalReportingDateInFuture: [
      ['child_weak_legs_arms'],
      [
        getDate(1),
        '10:00',
        '1',
        '1',
        'health_care_worker',
        '',
        getDate(1),
        '10:00',
        'yes',
        getDate(1),
        '10:00',
        'yes'
      ]
    ],
    chaSignalReportingNotAnOngoingThreat: [
      ['child_weak_legs_arms'],
      [
        getDate(-1),
        '10:00',
        '1',
        '1',
        'health_care_worker',
        '',
        getDate(-1),
        '10:00',
        'no'
      ]
    ],
    signalVerification: [
      [
        '',
        'yes',
        'child_weak_legs_arms',
        'yes',
        getDate(-1),
        '10:00',
        '1',
        '1',
        'health_care_worker',
        '',
        getDate(-1),
        '10:00',
        'yes',
        getDate(-1),
        '10:00',
        'yes'
      ]
    ]
  },
  socioEconomicSurveyScenarios: {
    personUnder14: (dob) => [
      ['none', 'child', 'female', dob, 'yes', 'no', 'no', 'visual', 'no', 'at_school', 'ecd_or_none', 'full_time_student']
    ],
    personOver14: (dob) => [
      ['national_id', '89761212', 'sibling', 'female', dob, 'married_monogamous', ...Array(4).fill('no'), 'none', 'left_school', 'form_4', 'worked_own_or_family_business_agriculture', 'no']
    ],
    household: [
      [],
      ['bamba', 'bamba primary', '20', '7', 'rural', 'kanyumbuni'],
      ['5', 'yes', 'constructed', 'iron_sheets', 'stone', 'cement', 'none'],
      ['piped', 'septic_tank'],
      ['lpg', 'solar'],
      [['mobile_phone', 'bicycle'], ['indigenous_cattle', 'goats', 'chicken'], '1', '0', 'fair'],
      ['no', 'yes', 'give directly', 'cash', '55000']
    ],
    householdVillageNameError: [
      [],
      ['bamba', 'bamba primary', '20', '7', 'rural', 'kanyumbuni 1'],
      ['5', 'yes', 'constructed', 'iron_sheets', 'stone', 'cement', 'none'],
      ['piped', 'septic_tank'],
      ['lpg', 'solar'],
      [['mobile_phone', 'bicycle'], ['indigenous_cattle', 'goats', 'chicken'], '1', '0', 'fair'],
      ['no', 'yes', 'give directly', 'cash', '55000']
    ],
    householdProgrammeNameError: [
      [],
      ['bamba', 'bamba primary', '20', '7', 'rural', 'kanyumbuni'],
      ['5', 'yes', 'constructed', 'iron_sheets', 'stone', 'cement', 'none'],
      ['piped', 'septic_tank'],
      ['lpg', 'solar'],
      [['mobile_phone', 'bicycle'], ['indigenous_cattle', 'goats', 'chicken'], '1', '0', 'fair'],
      ['no', 'yes', 'give directly $', 'cash', '55000']
    ],
  }
};
