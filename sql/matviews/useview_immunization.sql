------------------------------------------------------------
----------------useview_immunization
------------------------------------------------------------
SELECT deps_save_and_drop_dependencies('public', 'useview_immunization');
DROP MATERIALIZED VIEW IF EXISTS useview_immunization;
CREATE MATERIALIZED VIEW useview_immunization AS
(
  SELECT
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc#>>'{fields, patient_id}' AS patient_id,
    (doc#>>'{fields, patient_age_in_years}')::INT AS patient_age_in_years,
    (doc#>>'{fields, patient_age_in_months}')::INT AS patient_age_in_months,
    NULLIF(doc#>>'{fields, group_summary, r_child_dewormed}', '')::BOOLEAN AS is_dewormed,
    doc#>>'{fields, group_vitamin_a, vitamin_a_doses_given}' IN ('none', 'no') AS is_referred_vitamin_a,
    NULLIF(doc#>>'{fields, needs_immunization_follow_up}', '')::BOOLEAN AS is_referred_immunization,
    NULLIF(doc#>>'{fields, needs_growth_monitoring_follow_up}', '')::BOOLEAN AS is_referred_growth_monitoring,
    doc#>>'{contact, _id}' AS reported_by,
    doc#>>'{contact, parent, _id}' AS reported_by_parent,
    doc#>>'{contact, parent, parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc->>'form' = 'immunization_service'
    AND doc#>>'{fields, inputs, contact, date_of_birth}' <> ''

  UNION ALL

  SELECT 
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc#>>'{fields, patient_id}' AS patient_id,
    (doc#>>'{fields, patient_age_in_years}')::INT AS patient_age_in_years,
    (doc#>>'{fields, patient_age_in_months}')::INT AS patient_age_in_months,
    NULLIF(doc#>>'{fields, group_summary_no_danger_signs, r_dewormed_child}', '')::BOOLEAN AS is_dewormed,
    doc#>>'{fields, vit_a_group, vit_a_received}' IN ('none', 'no') AS is_referred_vitamin_a,
    NULLIF(doc#>>'{fields, needs_immunization_referral}', '')::BOOLEAN AS is_referred_immunization,
    NULLIF(doc#>>'{fields, needs_growth_monitoring_referral}', '')::BOOLEAN AS is_referred_growth_monitoring,
    doc#>>'{contact,_id}' AS reported_by,
    doc#>>'{contact,parent,_id}' AS reported_by_parent,
    doc#>>'{contact,parent,parent,_id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc->>'form' = 'u5_assessment'

  UNION ALL

  SELECT
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc#>>'{fields, patient_id}' AS patient_id,
    (doc#>>'{fields, patient_age_in_years}')::INT AS patient_age_in_years,
    (doc#>>'{fields, patient_age_in_months}')::INT AS patient_age_in_months,
    NULL AS is_dewormed,
    NULL AS is_referred_vitamin_a,
    NULLIF(doc#>>'{fields, needs_immunization_follow_up}', '')::BOOLEAN AS is_referred_for_immunization,
    NULL AS is_referred_growth_monitoring,
    doc#>>'{contact, _id}' AS reported_by,
    doc#>>'{contact, parent, _id}' AS reported_by_parent,
    doc#>>'{contact, parent, parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc ->> 'form' = 'postnatal_care_service_newborn'

  UNION ALL

  SELECT
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc->>'_id'::TEXT AS patient_id,
    (doc->>'age_in_years')::INT AS patient_age_in_years,
    (doc->>'age_in_months')::INT AS patient_age_in_months,
    NULL AS is_dewormed,
    NULL AS is_referred_vitamin_a,
    CASE
      WHEN doc->>'needs_immunization_follow_up' = 'yes' OR doc->>'imm_upto_date' = 'no'
      THEN TRUE
      ELSE FALSE
    END AS is_referred_for_immunization,
    NULL AS is_referred_growth_monitoring,
    doc#>>'{meta, created_by_person_uuid}' AS reported_by,
    doc#>>'{meta, created_by_place_uuid}' AS reported_by_parent,
    doc#>>'{parent, parent, parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc->>'contact_type' = 'f_client'
    AND (doc->>'created_by_doc' <> '' OR NULLIF(doc->>'age_in_months', '')::INTEGER <= 60)
);

CREATE UNIQUE INDEX IF NOT EXISTS useview_immunization_uuid ON useview_immunization USING btree(uuid);
CREATE INDEX IF NOT EXISTS useview_immunization_patient_id ON useview_immunization USING btree(patient_id);
CREATE INDEX IF NOT EXISTS useview_immunization_reported_by_parent ON useview_immunization USING btree(reported_by_parent);
CREATE INDEX IF NOT EXISTS useview_immunization_reported ON useview_immunization USING btree(reported);
CREATE INDEX IF NOT EXISTS useview_immunization_patient_age_in_months ON useview_immunization USING btree(patient_age_in_months);
SELECT deps_restore_dependencies('public', 'useview_immunization');