------------------------------------------------------------
----------------useview_over_five_assessment
------------------------------------------------------------
SELECT deps_save_and_drop_dependencies('public', 'useview_over_five_assessment');
DROP MATERIALIZED VIEW IF EXISTS useview_over_five_assessment;
CREATE MATERIALIZED VIEW useview_over_five_assessment AS
(
  SELECT 
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    (doc#>>'{fields, patient_age_in_years}')::INT AS patient_age_in_years,
    doc#>>'{fields, patient_uuid}' AS patient_id,
    CASE
      WHEN
        doc#>>'{fields, group_diabetes, is_on_diabetes_medication}' = 'no'
      THEN TRUE
      ELSE FALSE
    END AS is_referred_diabetes,
    CASE
      WHEN
        doc#>>'{fields, group_hypertension, is_on_hypertension_medication}' = 'no'
      THEN TRUE
      ELSE FALSE
    END AS is_referred_hypertension,
    NULLIF(doc#>>'{fields, needs_mental_health_referral}', '')::BOOLEAN AS is_referred_mental_health,
    NULLIF(doc#>>'{fields, group_fever, has_fever}', '')::BOOLEAN AS has_fever,
    NULLIF(doc#>>'{fields, group_fever, fever_duration}', '')::INT AS fever_duration,
    doc#>>'{fields, group_malaria, rdt_result}' AS rdt_result,
    doc#>>'{fields, group_malaria, repeat_rdt_result}' AS repeat_rdt_result,
    NULLIF(doc#>>'{fields, group_summary, given_al}', '')::BOOLEAN AS given_al,
    doc#>>'{fields, group_tb, tb_symptoms}' AS tb_symptoms,
    NULLIF(doc#>>'{fields, needs_tb_referral}', '')::BOOLEAN AS is_referred_tb,
    doc#>>'{contact, _id}' AS reported_by,
    doc#>>'{contact, parent, _id}' AS reported_by_parent,
    doc#>>'{contact, parent, parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc->>'form' = 'over_five_assessment'
);
CREATE UNIQUE INDEX IF NOT EXISTS useview_over_five_assessment_uuid ON useview_over_five_assessment USING btree(uuid);
CREATE INDEX IF NOT EXISTS useview_over_five_assessment_patient_id ON useview_over_five_assessment USING btree(patient_id);
CREATE INDEX IF NOT EXISTS useview_over_five_assessment_reported ON useview_over_five_assessment USING btree(reported);
CREATE INDEX IF NOT EXISTS useview_over_five_assessment_reported_by_parent ON useview_over_five_assessment USING btree(reported_by_parent);
CREATE INDEX IF NOT EXISTS useview_over_five_assessment_has_fever ON useview_over_five_assessment USING btree(has_fever);
CREATE INDEX IF NOT EXISTS useview_over_five_assessment_fever_duration ON useview_over_five_assessment USING btree(fever_duration);
SELECT deps_restore_dependencies('public', 'useview_over_five_assessment');