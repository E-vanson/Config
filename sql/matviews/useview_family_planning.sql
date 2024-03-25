------------------------------------------------------------
----------------useview_family_planning
------------------------------------------------------------
SELECT deps_save_and_drop_dependencies('public', 'useview_family_planning');
DROP MATERIALIZED VIEW IF EXISTS useview_family_planning;
CREATE MATERIALIZED VIEW useview_family_planning AS
(
  SELECT
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc ->> 'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc#>>'{fields, patient_id}' AS patient_id,
    (doc#>>'{fields, patient_age_in_years}')::INT AS patient_age_in_years,
    CASE
      WHEN doc#>>'{fields, referral_summary, referred_for_refills}' = 'yes' OR doc#>>'{fields, referral_summary, referred_for_fp_services}' = 'yes'
      THEN TRUE
      ELSE FALSE
    END AS is_referred_for_fp_services,
    CASE
      WHEN doc#>>'{fields, family_planning, is_on_fp}' = 'no' AND doc#>>'{fields, family_planning, is_pregnant}' = 'no'
      THEN TRUE
      ELSE FALSE
    END AS is_counselled_on_fp_services,
    NULLIF(doc#>>'{fields, family_planning, refilled_today}', '')::BOOLEAN AS is_provided_fp_commodities,
    doc#>>'{contact, _id}' AS reported_by,
    doc#>>'{contact, parent, _id}' AS reported_by_parent,
    doc#>>'{contact, parent, parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc->>'form' = 'family_planning'

  UNION ALL

  SELECT
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc ->> 'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc->>'_id' AS patient_id,
    (doc->>'age_in_years')::INT AS patient_age_in_years,
    NULL AS is_referred_for_fp_services,
    doc->>'using_fp' = 'no' AS is_counselled_on_fp_services,
    NULL AS is_provided_fp_commodities,
    doc#>>'{meta, created_by_person_uuid}' AS reported_by,
    doc#>>'{meta, created_by_place_uuid}' AS reported_by_parent,
    doc#>>'{parent, parent, parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc->>'contact_type' = 'f_client'
    AND doc->>'pregnant' = 'no'
);

CREATE UNIQUE INDEX IF NOT EXISTS useview_family_planning_uuid ON useview_family_planning USING btree(uuid);
CREATE INDEX IF NOT EXISTS useview_family_planning_reported ON useview_family_planning USING btree(reported);
CREATE INDEX IF NOT EXISTS useview_family_planning_patient_id ON useview_family_planning USING btree(patient_id);
CREATE INDEX IF NOT EXISTS useview_family_planning_reported_by_parent ON useview_family_planning USING btree(reported_by_parent);
CREATE INDEX IF NOT EXISTS useview_family_planning_patient_age_in_years ON useview_family_planning USING btree(patient_age_in_years);
SELECT deps_restore_dependencies('public', 'useview_family_planning');
