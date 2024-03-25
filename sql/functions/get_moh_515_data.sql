------------------------------------------------------------
----------------get_moh_515_data(TEXT,TEXT,TEXT,BOOLEAN,BOOLEAN)
------------------------------------------------------------
DROP FUNCTION IF EXISTS get_moh_515_data(TEXT,TEXT,TEXT,BOOLEAN,BOOLEAN);

CREATE OR REPLACE FUNCTION get_moh_515_data
(
  param_facility_group_by TEXT,
  param_num_units TEXT DEFAULT '12',
  param_interval_unit TEXT DEFAULT 'months',
  param_include_current BOOLEAN DEFAULT 'false',
  single_interval BOOLEAN DEFAULT 'false'
)
RETURNS TABLE(
  chu_uuid TEXT,
  chu_code TEXT,
  chu_name TEXT,
  chv_area_uuid TEXT,
  chv_area_name TEXT,
  period_start DATE,
  period TEXT,
  period_start_epoch NUMERIC,
  facility_join_field TEXT,
  count_new_households_visited_safe_water_new_visit NUMERIC,
  count_households_hand_washing_facilities_new_visit NUMERIC,
  count_households_functional_latrines_new_visit NUMERIC,
  count_newborns_within_48_hours_of_delivery NUMERIC,
  count_children_12_59_months_dewormed NUMERIC,
  count_pregnant_women_referred_to_health_facility NUMERIC,
  count_new_deliveries_at_health_facility NUMERIC,
  count_children_0_11_months_referred_immunization NUMERIC,
  count_persons_referred_hts NUMERIC,
  count_persons_referred_comprehensive_geriatric_services NUMERIC,
  count_persons_referred_diabetes NUMERIC,
  count_persons_referred_cancer NUMERIC,
  count_persons_referred_mental_illness NUMERIC,
  count_persons_referred_hypertension NUMERIC,
  count_defaulters_immunization_referred NUMERIC,
  count_deaths_12_59_months NUMERIC,
  count_deaths_maternal NUMERIC,
  count_households_visited_new_visit NUMERIC,
  count_households_visited_revisit NUMERIC,
  count_households_new_visit_upto_date_insurance NUMERIC,
  count_households_new_visit_upto_date_insurance_uhc NUMERIC,
  count_households_new_visit_upto_date_insurance_nhif NUMERIC,
  count_households_new_visit_upto_date_insurance_others NUMERIC,
  count_households_new_visit_refuse_disposal NUMERIC,
  count_women_15_49_years_counselled_fp NUMERIC,
  count_women_15_49_years_provided_fp NUMERIC,
  count_women_15_49_years_referred_fp NUMERIC,
  count_women_pregnant NUMERIC,
  count_women_pregnant_underage NUMERIC,
  count_women_pregnant_counselled_anc NUMERIC,
  count_new_deliveries NUMERIC,
  count_new_deliveries_at_home NUMERIC,
  count_new_deliveries_underage NUMERIC,
  count_new_mothers_visited_within_48_hours_of_delivery NUMERIC,
  count_new_deliveries_at_home_referred_pnc NUMERIC,
  count_children_6_59_months_malnutrition_severe NUMERIC,
  count_children_6_59_months_malnutrition_moderate NUMERIC,
  count_children_6_59_months_referred_vitamin_a NUMERIC,
  count_children_0_59_months_referred_delayed_milestones NUMERIC,
  count_defaulters_art_referred NUMERIC,
  count_defaulters_hei_referred NUMERIC,
  count_defaulters_art_traced_referred NUMERIC,
  count_defaulters_hei_traced_referred NUMERIC,
  count_persons_screened_tb NUMERIC,
  count_persons_presumptive_tb_referred NUMERIC,
  count_persons_presumptive_tb_referred_confirmed NUMERIC,
  count_persons_presumptive_tb_referred_confirmed_referred NUMERIC,
  count_cases_tb_confirmed_0_59_months NUMERIC,
  count_treatment_interruptors_tb NUMERIC,
  count_treatment_interrupters_tb_traced NUMERIC,
  count_women_15_49_years_referred_fp_completed NUMERIC,
  count_women_pregnant_referred_anc_completed NUMERIC,
  count_women_referred_pnc_completed NUMERIC,
  count_defaulters_immunization_referred_completed NUMERIC,
  count_persons_referred_hts_completed NUMERIC,
  count_defaulters_art_referred_completed NUMERIC,
  count_defaulters_hei_referred_completed NUMERIC,
  count_routine_checkup_referred_completed NUMERIC,
  count_persons_presumptive_tb_referred_completed NUMERIC,
  count_persons_presumptive_tb_contacts_referred_completed NUMERIC,
  count_cases_tb_0_59_months_ipt_referred_completed NUMERIC,
  count_treatment_interruptors_tb_referred_completed NUMERIC,
  count_cases_0_59_months_fever_lt_7_days NUMERIC,
  count_cases_0_59_months_fever_lt_7_days_rdt NUMERIC,
  count_cases_0_59_months_fever_lt_7_days_rdt_positive NUMERIC,
  count_cases_0_59_months_fever_lt_7_days_rdt_positive_act NUMERIC,
  count_cases_2_59_months_fast_breathing NUMERIC,
  count_cases_2_59_months_fast_breathing_amoxycillin NUMERIC,
  count_cases_2_59_months_diarrhea NUMERIC,
  count_cases_2_59_months_diarrhea_zinc_ors NUMERIC,
  count_cases_gte_60_months_fever_lt_7_days NUMERIC,
  count_cases_gte_60_months_fever_lt_7_days_rdt NUMERIC,
  count_cases_gte_60_months_fever_lt_7_days_rdt_positive NUMERIC,
  count_cases_gte_60_months_fever_lt_7_days_rdt_positive_act NUMERIC,
  count_deaths_0_28_days NUMERIC,
  count_deaths_29_days_11_months NUMERIC,
  count_deaths_6_59_years NUMERIC,
  count_deaths_gt_60_years NUMERIC,
  count_households NUMERIC
) AS

$BODY$

WITH period_CTE AS
(
  SELECT generate_series(
    date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval), 
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)
      ELSE                  
        CASE
            WHEN param_include_current 
            THEN now() 
            ELSE now() - ('1 ' || param_interval_unit)::interval
        END
    END,            
    ('1 '||param_interval_unit)::interval
  )::DATE AS start
)

SELECT

  CASE
    WHEN param_facility_group_by = 'chv_area' OR param_facility_group_by = 'chu'
    THEN place_period.chu_uuid
    ELSE 'All'
  END AS _chu_uuid,
  CASE
    WHEN param_facility_group_by = 'chv_area' OR param_facility_group_by = 'chu'
    THEN place_period.chu_code
    ELSE 'All'
  END AS _chu_code,
  CASE
    WHEN param_facility_group_by = 'chv_area' OR param_facility_group_by = 'chu'
    THEN place_period.chu_name
    ELSE 'All'
  END AS _chu_name,
  CASE
    WHEN param_facility_group_by = 'chv_area'
    THEN place_period.chv_area_uuid
    ELSE 'All'
  END AS _chv_area_uuid,
  CASE
    WHEN param_facility_group_by = 'chv_area'
    THEN place_period.chv_area_name
    ELSE 'All'
  END AS _chv_area_name,
  place_period.period_start AS _period_start,
  concat(date_part('year', place_period.period_start)::TEXT, lpad(date_part('month', place_period.period_start)::TEXT,2,'0')) AS period,
  date_part('epoch',place_period.period_start)::NUMERIC AS _period_start_epoch,
  CASE
    WHEN param_facility_group_by = 'chv_area'
      THEN place_period.chv_area_uuid
    WHEN param_facility_group_by = 'chu'
      THEN place_period.chu_uuid
    ELSE 'All'
  END AS _facility_join_field,
  
  /* Start retrieving all counts/percents */
  SUM(COALESCE(wash_and_insurance.count_new_households_visited_safe_water_new_visit, 0)) AS count_new_households_visited_safe_water_new_visit,
  SUM(COALESCE(wash_and_insurance.count_households_hand_washing_facilities_new_visit, 0)) AS count_households_hand_washing_facilities_new_visit,
  SUM(COALESCE(wash_and_insurance.count_households_functional_latrines_new_visit, 0)) AS count_households_functional_latrines_new_visit,
  SUM(COALESCE(newborns.count_newborns_within_48_hours_of_delivery, 0)) AS count_newborns_within_48_hours_of_delivery,
  SUM(COALESCE(immunization.count_children_12_59_months_dewormed, 0)) AS count_children_12_59_months_dewormed,
  SUM(COALESCE(pregnancy_home_visit.count_pregnant_women_referred_to_health_facility, 0)) AS count_pregnant_women_referred_to_health_facility,
  SUM(COALESCE(postnatal_care_service.count_new_deliveries_at_health_facility, 0)) AS count_new_deliveries_at_health_facility,
  SUM(COALESCE(immunization.count_children_0_11_months_referred_immunization, 0)) AS count_children_0_11_months_referred_immunization,
  SUM(COALESCE(over_five_assessment.count_persons_referred_hts, 0)) AS count_persons_referred_hts,
  SUM(COALESCE(over_five_assessment.count_persons_referred_comprehensive_geriatric_services, 0)) AS count_persons_referred_comprehensive_geriatric_services,
  SUM(COALESCE(over_five_assessment.count_persons_referred_diabetes, 0)) AS count_persons_referred_diabetes,
  SUM(COALESCE(over_five_assessment.count_persons_referred_cancer, 0)) AS count_persons_referred_cancer,
  SUM(COALESCE(over_five_assessment.count_persons_referred_mental_illness, 0)) AS count_persons_referred_mental_illness,
  SUM(COALESCE(over_five_assessment.count_persons_referred_hypertension, 0)) AS count_persons_referred_hypertension,
  SUM(COALESCE(defaulter_follow_up.count_defaulters_immunization_referred, 0)) AS count_defaulters_immunization_referred,
  SUM(COALESCE(deaths.count_deaths_12_59_months, 0)) AS count_deaths_12_59_months,
  SUM(COALESCE(deaths.count_deaths_maternal, 0)) AS count_deaths_maternal,
  SUM(COALESCE(wash_and_insurance.count_households_visited_new_visit, 0)) AS count_households_visited_new_visit,
  SUM(COALESCE(household_visit.count_households_visited_revisit, 0)) AS count_households_visited_revisit,
  SUM(COALESCE(wash_and_insurance.count_households_new_visit_upto_date_insurance, 0)) AS count_households_new_visit_upto_date_insurance,
  SUM(COALESCE(wash_and_insurance.count_households_new_visit_upto_date_insurance_uhc, 0)) AS count_households_new_visit_upto_date_insurance_uhc,
  SUM(COALESCE(wash_and_insurance.count_households_new_visit_upto_date_insurance_nhif, 0)) AS count_households_new_visit_upto_date_insurance_nhif,
  SUM(COALESCE(wash_and_insurance.count_households_new_visit_upto_date_insurance_others, 0)) AS count_households_new_visit_upto_date_insurance_others,
  SUM(COALESCE(wash_and_insurance.count_households_new_visit_refuse_disposal, 0)) AS count_households_new_visit_refuse_disposal,
  SUM(COALESCE(family_planning.count_women_15_49_years_counselled_fp, 0)) AS count_women_15_49_years_counselled_fp,
  SUM(COALESCE(family_planning.count_women_15_49_years_provided_fp, 0)) AS count_women_15_49_years_provided_fp,
  SUM(COALESCE(family_planning.count_women_15_49_years_referred_fp, 0)) AS count_women_15_49_years_referred_fp,
  SUM(COALESCE(pregnancy_home_visit.count_women_pregnant, 0)) AS count_women_pregnant,
  SUM(COALESCE(pregnancy_home_visit.count_women_pregnant_underage, 0)) AS count_women_pregnant_underage,
  SUM(COALESCE(pregnancy_home_visit.count_women_pregnant_counselled_anc, 0)) AS count_women_pregnant_counselled_anc,
  SUM(COALESCE(postnatal_care_service.count_new_deliveries, 0)) AS count_new_deliveries,
  SUM(COALESCE(postnatal_care_service.count_new_deliveries_at_home, 0)) AS count_new_deliveries_at_home,
  SUM(COALESCE(postnatal_care_service.count_new_deliveries_underage, 0)) AS count_new_deliveries_underage,
  SUM(COALESCE(postnatal_care_service.count_new_mothers_visited_within_48_hours_of_delivery, 0)) AS count_new_mothers_visited_within_48_hours_of_delivery,
  SUM(COALESCE(postnatal_care_service.count_new_deliveries_at_home_referred_pnc, 0)) AS count_new_deliveries_at_home_referred_pnc,
  SUM(COALESCE(under_five_assessment.count_children_6_59_months_malnutrition_severe, 0)) AS count_children_6_59_months_malnutrition_severe,
  SUM(COALESCE(under_five_assessment.count_children_6_59_months_malnutrition_moderate, 0)) AS count_children_6_59_months_malnutrition_moderate,
  SUM(COALESCE(immunization.count_children_6_59_months_referred_vitamin_a, 0)) AS count_children_6_59_months_referred_vitamin_a,
  SUM(COALESCE(immunization.count_children_0_59_months_referred_delayed_milestones, 0)) AS count_children_0_59_months_referred_delayed_milestones,
  0 AS count_defaulters_art_referred,
  0 AS count_defaulters_hei_referred,
  SUM(COALESCE(defaulter_follow_up.count_defaulters_art_traced_referred, 0)) AS count_defaulters_art_traced_referred,
  SUM(COALESCE(defaulter_follow_up.count_defaulters_hei_traced_referred, 0)) AS count_defaulters_hei_traced_referred,
  SUM(COALESCE(over_five_assessment.count_persons_screened_tb, 0)) AS count_persons_screened_tb,
  SUM(COALESCE(over_five_assessment.count_persons_presumptive_tb_referred, 0)) AS count_persons_presumptive_tb_referred,
  0 AS count_persons_presumptive_tb_referred_confirmed,
  0 AS count_persons_presumptive_tb_referred_confirmed_referred,
  0 AS count_cases_tb_confirmed_0_59_months,
  0 AS count_treatment_interruptors_tb,
  SUM(COALESCE(defaulter_follow_up.count_treatment_interrupters_tb_traced, 0)) AS count_treatment_interrupters_tb_traced,
  SUM(COALESCE(referral_follow_up.count_women_15_49_years_referred_fp_completed, 0)) AS count_women_15_49_years_referred_fp_completed,
  SUM(COALESCE(referral_follow_up.count_women_pregnant_referred_anc_completed, 0)) AS count_women_pregnant_referred_anc_completed,
  SUM(COALESCE(referral_follow_up.count_women_referred_pnc_completed, 0)) AS count_women_referred_pnc_completed,
  SUM(COALESCE(referral_follow_up.count_defaulters_immunization_referred_completed, 0)) AS count_defaulters_immunization_referred_completed,
  0 AS count_persons_referred_hts_completed,
  SUM(COALESCE(referral_follow_up.count_defaulters_art_referred_completed, 0)) AS count_defaulters_art_referred_completed,
  SUM(COALESCE(referral_follow_up.count_defaulters_hei_referred_completed, 0)) AS count_defaulters_hei_referred_completed,
  0 AS count_routine_checkup_referred_completed,
  SUM(COALESCE(referral_follow_up.count_persons_presumptive_tb_referred_completed, 0)) AS count_persons_presumptive_tb_referred_completed,
  SUM(COALESCE(referral_follow_up.count_persons_presumptive_tb_contacts_referred_completed, 0)) AS count_persons_presumptive_tb_contacts_referred_completed,
  SUM(COALESCE(under_five_assessment.count_cases_tb_0_59_months_ipt_referred_completed, 0)) AS count_cases_tb_0_59_months_ipt_referred_completed,
  SUM(COALESCE(referral_follow_up.count_treatment_interruptors_tb_referred_completed, 0)) AS count_treatment_interruptors_tb_referred_completed,
  SUM(COALESCE(under_five_assessment.count_cases_0_59_months_fever_lt_7_days, 0)) AS count_cases_0_59_months_fever_lt_7_days,
  SUM(COALESCE(under_five_assessment.count_cases_0_59_months_fever_lt_7_days_rdt, 0)) AS count_cases_0_59_months_fever_lt_7_days_rdt,
  SUM(COALESCE(under_five_assessment.count_cases_0_59_months_fever_lt_7_days_rdt_positive, 0)) AS count_cases_0_59_months_fever_lt_7_days_rdt_positive,
  SUM(COALESCE(under_five_assessment.count_cases_0_59_months_fever_lt_7_days_rdt_positive_act, 0)) AS count_cases_0_59_months_fever_lt_7_days_rdt_positive_act,
  SUM(COALESCE(under_five_assessment.count_cases_2_59_months_fast_breathing, 0)) AS count_cases_2_59_months_fast_breathing,
  SUM(COALESCE(under_five_assessment.count_cases_2_59_months_fast_breathing_amoxycillin, 0)) AS count_cases_2_59_months_fast_breathing_amoxycillin,
  SUM(COALESCE(under_five_assessment.count_cases_2_59_months_diarrhea, 0)) AS count_cases_2_59_months_diarrhea,
  SUM(COALESCE(under_five_assessment.count_cases_2_59_months_diarrhea_zinc_ors, 0)) AS count_cases_2_59_months_diarrhea_zinc_ors,
  SUM(COALESCE(over_five_assessment.count_cases_gte_60_months_fever_lt_7_days, 0)) AS count_cases_gte_60_months_fever_lt_7_days,
  SUM(COALESCE(over_five_assessment.count_cases_gte_60_months_fever_lt_7_days_rdt, 0)) AS count_cases_gte_60_months_fever_lt_7_days_rdt,
  SUM(COALESCE(over_five_assessment.count_cases_gte_60_months_fever_lt_7_days_rdt_positive, 0)) AS count_cases_gte_60_months_fever_lt_7_days_rdt_positive,
  SUM(COALESCE(over_five_assessment.count_cases_gte_60_months_fever_lt_7_days_rdt_positive_act, 0)) AS count_cases_gte_60_months_fever_lt_7_days_rdt_positive_act,
  SUM(COALESCE(deaths.count_deaths_0_28_days, 0)) AS count_deaths_0_28_days,
  SUM(COALESCE(deaths.count_deaths_29_days_11_months, 0)) AS count_deaths_29_days_11_months,
  SUM(COALESCE(deaths.count_deaths_6_59_years, 0)) AS count_deaths_6_59_years,
  SUM(COALESCE(deaths.count_deaths_gt_60_years, 0)) AS count_deaths_gt_60_years,
  SUM(COALESCE(households.count_households, 0)) AS count_households
  /* End retrieval */
FROM /*combination of hierarchy level and time-periods we are grouping by (last 12 mo by default, by branch)*/
  (
    SELECT
      chu_uuid,
      chu_code,
      chu_name,
      chv_area_uuid,
      chv_area_name,
      period_CTE.start AS period_start
    FROM
      period_CTE,
      chv_hierarchy
    GROUP BY
      chu_uuid,
      chu_code,
      chu_name,
      chv_area_uuid,
      chv_area_name,
      period_CTE.start
    
  ) AS place_period

LEFT JOIN /* Death Information metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    COUNT(patient_id) FILTER ( WHERE patient_age_in_days < 28 ) AS count_deaths_0_28_days,
    COUNT(patient_id) FILTER ( WHERE patient_age_in_days >= 28 AND patient_age_in_months < 12 ) AS count_deaths_29_days_11_months,
    COUNT(patient_id) FILTER ( WHERE patient_age_in_months BETWEEN 12 AND 60 ) AS count_deaths_12_59_months,
    COUNT(patient_id) FILTER ( WHERE death_type = 'maternal' ) AS count_deaths_maternal,
    COUNT(patient_id) FILTER ( WHERE patient_age_in_years > 5 AND patient_age_in_years < 60 AND death_type <> 'maternal' ) AS count_deaths_6_59_years,
    COUNT(patient_id) FILTER ( WHERE patient_age_in_years > 60 ) AS count_deaths_gt_60_years,
    COUNT(patient_id) AS count_death
  FROM
    useview_death
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS deaths
ON (place_period.period_start = deaths.reported_month
AND place_period.chv_area_uuid = deaths.reported_by_parent)

LEFT JOIN /* Household Information metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    COUNT(DISTINCT place_id) FILTER ( WHERE has_access_to_safe_water IS TRUE AND is_new_visit IS TRUE ) AS count_new_households_visited_safe_water_new_visit,
    COUNT(DISTINCT place_id) FILTER ( WHERE has_functional_handwashing_facility IS TRUE AND is_new_visit IS TRUE ) AS count_households_hand_washing_facilities_new_visit,
    COUNT(DISTINCT place_id) FILTER ( WHERE has_functional_latrine IS TRUE AND is_new_visit IS TRUE ) AS count_households_functional_latrines_new_visit,            
    COUNT(DISTINCT place_id) FILTER ( WHERE is_new_visit IS TRUE ) AS count_households_visited_new_visit,
    COUNT(DISTINCT place_id) FILTER ( WHERE has_upto_date_insurance_cover IS TRUE AND is_new_visit IS TRUE ) AS count_households_new_visit_upto_date_insurance,
    0 AS count_households_new_visit_upto_date_insurance_uhc,
    COUNT(DISTINCT place_id) FILTER ( WHERE specific_insurance_cover ~ 'nhif' AND is_new_visit IS TRUE ) AS count_households_new_visit_upto_date_insurance_nhif,
    COUNT(DISTINCT place_id) FILTER ( WHERE specific_insurance_cover ~ 'other' AND is_new_visit IS TRUE ) AS count_households_new_visit_upto_date_insurance_others,
    COUNT(DISTINCT place_id) FILTER ( WHERE has_functional_refuse_disposal_facility IS TRUE AND is_new_visit IS TRUE ) AS count_households_new_visit_refuse_disposal
  FROM
    useview_wash_and_insurance
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS wash_and_insurance
ON (place_period.period_start = wash_and_insurance.reported_month
AND place_period.chv_area_uuid = wash_and_insurance.reported_by_parent)

LEFT JOIN /* Household Information metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    COUNT(DISTINCT place_id) AS count_households_visited_revisit    
  FROM
      useview_household_visit
  WHERE
      reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS household_visit
ON (place_period.period_start = household_visit.reported_month
AND place_period.chv_area_uuid = household_visit.reported_by_parent)

LEFT JOIN /* Delivery metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    COUNT(DISTINCT patient_id) FILTER ( WHERE place_of_delivery = 'health_facility' ) AS count_new_deliveries_at_health_facility,
    COUNT(DISTINCT patient_id) FILTER ( WHERE pnc_service_count = 1 ) AS count_new_deliveries,
    COUNT(DISTINCT patient_id) FILTER ( WHERE place_of_delivery = 'home' ) AS count_new_deliveries_at_home,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_years >= 10 AND patient_age_in_years < 20 ) AS count_new_deliveries_underage,
    COUNT(DISTINCT patient_id) FILTER ( WHERE pnc_service_count = 1 AND (reported::DATE - date_of_delivery::DATE)::INT <= 1 ) AS count_new_mothers_visited_within_48_hours_of_delivery,
    COUNT(DISTINCT patient_id) FILTER ( WHERE is_referred_for_pnc_services IS TRUE ) AS count_new_deliveries_at_home_referred_pnc
  FROM
    useview_postnatal_care_service
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS postnatal_care_service
ON (place_period.period_start = postnatal_care_service.reported_month
AND place_period.chv_area_uuid = postnatal_care_service.reported_by_parent)

LEFT JOIN /* Management and Treatment <5years metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months BETWEEN 6 AND 59 AND muac_color = 'red' ) AS count_children_6_59_months_malnutrition_severe,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months BETWEEN 6 AND 59 AND muac_color = 'yellow' ) AS count_children_6_59_months_malnutrition_moderate,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months < 60 AND fever_duration < 7 ) AS count_cases_0_59_months_fever_lt_7_days,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months < 60 AND fever_duration < 7 AND (rdt_result <> 'not_done' OR repeat_rdt_result <> 'not_done') ) AS count_cases_0_59_months_fever_lt_7_days_rdt,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months < 60 AND fever_duration < 7 AND (rdt_result = 'positive' OR repeat_rdt_result = 'positive') ) AS count_cases_0_59_months_fever_lt_7_days_rdt_positive,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months < 60 AND fever_duration < 7 AND (rdt_result = 'positive' OR repeat_rdt_result = 'positive') AND gave_al IS TRUE ) AS count_cases_0_59_months_fever_lt_7_days_rdt_positive_act,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months BETWEEN 2 AND 59 AND has_fast_breathing IS TRUE ) AS count_cases_2_59_months_fast_breathing,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months BETWEEN 2 AND 59 AND has_fast_breathing IS TRUE AND gave_amox IS TRUE ) AS count_cases_2_59_months_fast_breathing_amoxycillin,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months BETWEEN 2 AND 59 AND has_diarrhoea IS TRUE ) AS count_cases_2_59_months_diarrhea,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months BETWEEN 2 AND 59 AND has_diarrhoea IS TRUE AND gave_zinc IS TRUE AND gave_ors IS TRUE ) AS count_cases_2_59_months_diarrhea_zinc_ors,
    0 AS count_cases_tb_0_59_months_ipt_referred_completed
  FROM
    useview_under_five_assessment
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS under_five_assessment
ON (place_period.period_start = under_five_assessment.reported_month
AND place_period.chv_area_uuid = under_five_assessment.reported_by_parent)

LEFT JOIN /* Management and Treatment > 5years metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    0 AS count_persons_referred_hts,
    0 AS count_persons_referred_cancer,
    COUNT(DISTINCT patient_id) FILTER ( WHERE is_referred_diabetes IS TRUE ) AS count_persons_referred_diabetes,
    COUNT(DISTINCT patient_id) FILTER ( WHERE is_referred_mental_health IS TRUE ) AS count_persons_referred_mental_illness,
    COUNT(DISTINCT patient_id) FILTER ( WHERE is_referred_hypertension IS TRUE ) AS count_persons_referred_hypertension,
    COUNT(DISTINCT patient_id) FILTER ( WHERE tb_symptoms <> 'none' AND tb_symptoms <> '' ) AS count_persons_screened_tb,
    COUNT(DISTINCT patient_id) FILTER ( WHERE is_referred_tb IS TRUE ) AS count_persons_presumptive_tb_referred,
    COUNT(DISTINCT patient_id) FILTER ( WHERE has_fever IS TRUE AND fever_duration < 7 ) AS count_cases_gte_60_months_fever_lt_7_days,
    COUNT(DISTINCT patient_id) FILTER ( WHERE has_fever IS TRUE AND fever_duration < 7 AND (rdt_result <> 'not_done' OR repeat_rdt_result <> 'not_done') ) AS count_cases_gte_60_months_fever_lt_7_days_rdt,
    COUNT(DISTINCT patient_id) FILTER ( WHERE has_fever IS TRUE AND fever_duration < 7 AND (rdt_result = 'positive' OR repeat_rdt_result = 'positive') ) AS count_cases_gte_60_months_fever_lt_7_days_rdt_positive,
    COUNT(DISTINCT patient_id) FILTER ( WHERE has_fever IS TRUE AND fever_duration < 7 AND (rdt_result = 'positive' OR repeat_rdt_result = 'positive') AND given_al IS TRUE ) AS count_cases_gte_60_months_fever_lt_7_days_rdt_positive_act,
    0 AS count_persons_referred_comprehensive_geriatric_services
  FROM
    useview_over_five_assessment
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS over_five_assessment
ON (place_period.period_start = over_five_assessment.reported_month
AND place_period.chv_area_uuid = over_five_assessment.reported_by_parent)

LEFT JOIN /* ANC metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    COUNT(DISTINCT patient_id) FILTER ( WHERE (is_currently_pregnant IS TRUE OR is_new_pregnancy IS TRUE) AND has_been_referred IS TRUE ) AS count_pregnant_women_referred_to_health_facility,
    COUNT(DISTINCT patient_id) FILTER ( WHERE is_currently_pregnant IS TRUE OR is_new_pregnancy IS TRUE ) AS count_women_pregnant,
    COUNT(DISTINCT patient_id) FILTER ( WHERE (is_currently_pregnant IS TRUE OR is_new_pregnancy IS TRUE) AND patient_age_in_years < 18 ) AS count_women_pregnant_underage,
    COUNT(DISTINCT patient_id) FILTER ( WHERE (is_currently_pregnant IS TRUE OR is_new_pregnancy IS TRUE) AND is_counselled_anc IS TRUE ) AS count_women_pregnant_counselled_anc
  FROM
    useview_pregnancy_home_visit
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS pregnancy_home_visit
ON (place_period.period_start = pregnancy_home_visit.reported_month
AND place_period.chv_area_uuid = pregnancy_home_visit.reported_by_parent)

LEFT JOIN /* Fp metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_years BETWEEN 15 AND 49 AND is_counselled_on_fp_services IS TRUE ) AS count_women_15_49_years_counselled_fp,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_years BETWEEN 15 AND 49 AND is_provided_fp_commodities IS TRUE ) AS count_women_15_49_years_provided_fp,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_years BETWEEN 15 AND 49 AND is_referred_for_fp_services IS TRUE ) AS count_women_15_49_years_referred_fp
  FROM
    useview_family_planning
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS family_planning
ON (place_period.period_start = family_planning.reported_month
AND place_period.chv_area_uuid = family_planning.reported_by_parent)

LEFT JOIN /* Immunization service metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months BETWEEN 12 AND 59 AND is_dewormed IS TRUE ) AS count_children_12_59_months_dewormed,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months < 12 AND is_referred_immunization IS TRUE ) AS count_children_0_11_months_referred_immunization,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months BETWEEN 6 AND 59 AND is_referred_vitamin_a IS TRUE ) AS count_children_6_59_months_referred_vitamin_a,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months < 60 AND is_referred_growth_monitoring IS TRUE ) AS count_children_0_59_months_referred_delayed_milestones
  FROM
    useview_immunization
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS immunization
ON (place_period.period_start = immunization.reported_month
AND place_period.chv_area_uuid = immunization.reported_by_parent)

LEFT JOIN /* Defaulter metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    COUNT(DISTINCT patient_id) FILTER ( WHERE imm_defaulted IS TRUE AND is_referred IS TRUE ) AS count_defaulters_immunization_referred,
    COUNT(DISTINCT patient_id) FILTER ( WHERE art_defaulted IS TRUE AND is_referred IS TRUE ) AS count_defaulters_art_traced_referred,
    COUNT(DISTINCT patient_id) FILTER ( WHERE hei_defaulted IS TRUE AND is_referred IS TRUE ) AS count_defaulters_hei_traced_referred,
    COUNT(DISTINCT patient_id) FILTER ( WHERE tb_defaulted IS TRUE AND is_referred IS TRUE ) AS count_treatment_interrupters_tb_traced
  FROM
    useview_defaulter_follow_up
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS defaulter_follow_up
ON (place_period.period_start = defaulter_follow_up.reported_month
AND place_period.chv_area_uuid = defaulter_follow_up.reported_by_parent)

LEFT JOIN /* Referral follow up metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,    
    COUNT(DISTINCT patient_id) FILTER ( WHERE was_referred_for_fp_services IS TRUE AND is_available_and_completed_visit IS TRUE ) AS count_women_15_49_years_referred_fp_completed,
    COUNT(DISTINCT patient_id) FILTER ( WHERE was_referred_for_anc_services IS TRUE AND is_available_and_completed_visit IS TRUE ) AS count_women_pregnant_referred_anc_completed,
    COUNT(DISTINCT patient_id) FILTER ( WHERE was_referred_for_pnc_services IS TRUE AND is_available_and_completed_visit IS TRUE ) AS count_women_referred_pnc_completed,
    COUNT(DISTINCT patient_id) FILTER ( WHERE was_defaulter_immunization IS TRUE AND is_available_and_completed_visit IS TRUE ) AS count_defaulters_immunization_referred_completed,
    COUNT(DISTINCT patient_id) FILTER ( WHERE was_defaulter_art IS TRUE AND is_available_and_completed_visit IS TRUE ) AS count_defaulters_art_referred_completed,
    COUNT(DISTINCT patient_id) FILTER ( WHERE was_defaulter_hei IS TRUE AND is_available_and_completed_visit IS TRUE ) AS count_defaulters_hei_referred_completed,
    COUNT(DISTINCT patient_id) FILTER ( WHERE was_referred_tb_case IS TRUE AND is_available_and_completed_visit IS TRUE ) AS count_persons_presumptive_tb_referred_completed,
    COUNT(DISTINCT patient_id) FILTER ( WHERE was_referred_tb_contact IS TRUE AND is_available_and_completed_visit IS TRUE ) AS count_persons_presumptive_tb_contacts_referred_completed,
    COUNT(DISTINCT patient_id) FILTER ( WHERE was_defaulter_tb IS TRUE AND is_available_and_completed_visit IS TRUE ) AS count_treatment_interruptors_tb_referred_completed
  FROM
    useview_referral_follow_up
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS referral_follow_up
ON (place_period.period_start = referral_follow_up.reported_month
AND place_period.chv_area_uuid = referral_follow_up.reported_by_parent)

LEFT JOIN /* Newborns visited within 48 hours metrics */
  (
  SELECT
    chv_area_id AS reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    COUNT(DISTINCT uuid) FILTER ( WHERE (reported::DATE - date_of_birth::DATE)::INT <= 1 ) AS count_newborns_within_48_hours_of_delivery
  FROM
    useview_population_demographics
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS newborns
ON (place_period.period_start = newborns.reported_month
AND place_period.chv_area_uuid = newborns.reported_by_parent)

LEFT JOIN /* Fields calculating population metrics */      
  (
  SELECT
    reported_by_parent,
    reported_month,
    SUM(count_households) over (partition by reported_by_parent order by reported_month) AS count_households
  FROM(
    SELECT
      data_series.chv_area_id AS reported_by_parent,
      CASE
        WHEN single_interval
          THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
          ELSE date_trunc(param_interval_unit, data_series.date)::DATE
      END AS reported_month,
      COUNT(DISTINCT household_id) AS count_households
    FROM
     (
      SELECT 
        date,
        chv_area_id
      FROM generate_series(
        (SELECT MIN(date_trunc(param_interval_unit, household_reported_date))::DATE FROM useview_population_demographics), 
        date_trunc(param_interval_unit, now())::DATE, 
        (1 ||' '||param_interval_unit)::interval
        ) AS date
          CROSS JOIN (SELECT DISTINCT chv_area_id FROM useview_population_demographics) AS population
        ) AS data_series
        LEFT JOIN useview_population_demographics ON data_series.date = date_trunc(param_interval_unit, household_reported_date)::DATE
        AND useview_population_demographics.chv_area_id = data_series.chv_area_id
      GROUP BY
        reported_month,
        data_series.chv_area_id
    ) AS demographics
  ) AS households
ON (place_period.period_start = households.reported_month
AND place_period.chv_area_uuid = households.reported_by_parent)

GROUP BY 
  _chu_uuid,
  _chu_code,
  _chu_name,
  _chv_area_uuid,
  _chv_area_name,
  _period_start,
  _facility_join_field
ORDER BY
  _chu_uuid,
  _chu_code,
  _chu_name,
  _period_start
$BODY$
LANGUAGE 'sql' STABLE;