------------------------------------------------------------
----------------useview_under_five_assessment
------------------------------------------------------------
SELECT deps_save_and_drop_dependencies('public', 'useview_under_five_assessment');
DROP MATERIALIZED VIEW IF EXISTS useview_under_five_assessment;
CREATE MATERIALIZED VIEW useview_under_five_assessment AS
(
  SELECT 
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc#>>'{fields, patient_id}' AS patient_id,
    (doc#>>'{fields, patient_age_in_years}')::INT AS patient_age_in_years,
    (doc#>>'{fields, patient_age_in_months}')::INT AS patient_age_in_months,
    doc#>>'{fields, malnutrition_screening, muac_color}' AS muac_color,
    CASE
      WHEN
        doc#>>'{fields, u5_assessment, u5_has_fast_breathing}' = 'true'
        OR doc#>>'{fields, u2_month_assessment, u2_has_fast_breathing}' = 'true'
      THEN TRUE
      ELSE FALSE
    END AS has_fast_breathing,
    CASE
      WHEN
        doc#>>'{fields, group_summary_no_danger_signs, r_given_amox}' = 'yes'
        OR doc#>>'{fields, group_summary_danger_signs, r_dt_given_amox}' = 'yes'
      THEN TRUE
      ELSE FALSE
    END AS gave_amox,
    NULLIF(doc#>>'{fields, u5_assessment, has_diarrhoea}', '')::BOOLEAN AS has_diarrhoea,
    CASE
      WHEN
        doc#>>'{fields, group_summary_no_danger_signs, r_given_zinc}' = 'yes'
        OR doc#>>'{fields, group_summary_danger_signs, r_dt_given_zinc}' = 'yes'
      THEN TRUE
      ELSE FALSE
    END AS gave_zinc,
    CASE
      WHEN
        doc#>>'{fields, group_summary_no_danger_signs, r_given_ors}' = 'yes'
        OR doc#>>'{fields, group_summary_danger_signs, r_dt_given_ors}' = 'yes'
      THEN TRUE
      ELSE FALSE
    END AS gave_ors,
    CASE
      WHEN
        doc#>>'{fields, u2_month_assessment, has_fever}' = 'yes'
        OR doc#>>'{fields, u5_assessment, has_fever}' = 'yes'
      THEN TRUE
      ELSE FALSE
    END AS has_fever,
    (CASE
      WHEN
        doc#>>'{fields, u5_assessment, fever_duration}' = 'more_14'
      THEN '14'
      ELSE NULLIF(doc#>>'{fields, u5_assessment, fever_duration}', '')
    END)::INT AS fever_duration,
    doc#>>'{fields, malaria_screening, malaria_test_result}' AS rdt_result,
    doc#>>'{fields, malaria_screening, repeat_malaria_test_result}' AS repeat_rdt_result,
    NULLIF(doc#>>'{fields, group_summary_no_danger_signs, r_given_al}', '')::BOOLEAN AS gave_al,
    NULLIF(doc#>>'{fields, needs_tb_referral}', '')::BOOLEAN AS needs_tb_referral,
    doc#>>'{contact, _id}' AS reported_by,
    doc#>>'{contact, parent, _id}' AS reported_by_parent,
    doc#>>'{contact, parent,parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc->>'form' = 'u5_assessment'

  UNION ALL

  SELECT 
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc->>'_id' AS patient_id,
    (doc->>'age_in_years')::INT AS patient_age_in_years,
    (doc->>'age_in_months')::INT AS patient_age_in_months,
    doc->>'muac_colour' AS muac_color,
    NULL AS has_fast_breathing,
    NULL AS gave_amox,
    NULL AS has_diarrhoea,
    NULL AS gave_zinc,
    NULL AS gave_ors,
    NULL AS has_fever,
    NULL AS fever_duration,
    NULL AS rdt_result,
    NULL AS repeat_rdt_result,
    NULL AS gave_al,
    NULL AS needs_tb_referral,
    doc#>>'{meta, created_by_person_uuid}' AS reported_by,
    doc#>>'{meta, created_by_place_uuid}' AS reported_by_parent,
    doc#>>'{parent, parent, parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc->>'contact_type' = 'f_client'
    AND NULLIF(doc->>'age_in_months', '')::INT <= 60
);
CREATE UNIQUE INDEX IF NOT EXISTS useview_under_five_assessment_uuid ON useview_under_five_assessment USING btree(uuid);
CREATE INDEX IF NOT EXISTS useview_under_five_assessment_patient_id ON useview_under_five_assessment USING btree(patient_id);
CREATE INDEX IF NOT EXISTS useview_under_five_assessment_patient_age_in_months ON useview_under_five_assessment USING btree(patient_age_in_months);
CREATE INDEX IF NOT EXISTS useview_under_five_assessment_reported ON useview_under_five_assessment USING btree(reported);
CREATE INDEX IF NOT EXISTS useview_under_five_assessment_reported_by_parent ON useview_under_five_assessment USING btree(reported_by_parent);
SELECT deps_restore_dependencies('public', 'useview_under_five_assessment');
