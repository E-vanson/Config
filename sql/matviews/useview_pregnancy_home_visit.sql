------------------------------------------------------------
----------------useview_pregnancy_home_visit
------------------------------------------------------------
SELECT deps_save_and_drop_dependencies('public', 'useview_pregnancy_home_visit');
DROP MATERIALIZED VIEW IF EXISTS useview_pregnancy_home_visit cascade;
CREATE MATERIALIZED VIEW useview_pregnancy_home_visit AS
(
  SELECT
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc#>>'{fields, patient_id}' AS patient_id,
    (doc#>>'{fields, patient_age_in_years}')::INT AS patient_age_in_years,
    NULLIF(doc#>>'{fields, has_been_referred}', '')::BOOLEAN AS has_been_referred,
    NULLIF(doc#>>'{fields, marked_as_pregnant}', '')::BOOLEAN AS is_new_pregnancy,
    NULLIF(doc#>>'{fields, currently_pregnant}', '')::BOOLEAN AS is_currently_pregnant,
    NULLIF(doc#>>'{fields, anc_visits, has_started_anc}', '')::BOOLEAN AS is_counselled_anc,
    doc#>>'{contact, _id}' AS reported_by,
    doc#>>'{contact, parent, _id}' AS reported_by_parent,
    doc#>>'{contact, parent, parent, _id}' AS reported_by_parent_parent   
  FROM
    couchdb
  WHERE
    doc->>'form' = 'pregnancy_home_visit'
);

CREATE UNIQUE INDEX IF NOT EXISTS useview_pregnancy_home_visit_uuid ON useview_pregnancy_home_visit USING btree (uuid);
CREATE INDEX IF NOT EXISTS useview_pregnancy_home_visit_patient_id ON useview_pregnancy_home_visit USING btree (patient_id);
CREATE INDEX IF NOT EXISTS useview_pregnancy_home_visit_reported_by_parent ON useview_pregnancy_home_visit USING btree (reported_by_parent);
CREATE INDEX IF NOT EXISTS useview_pregnancy_home_visit_reported ON useview_pregnancy_home_visit USING btree (reported);
CREATE INDEX IF NOT EXISTS useview_pregnancy_home_visit_patient_age_in_years ON useview_pregnancy_home_visit USING btree (patient_age_in_years);
SELECT deps_restore_dependencies('public', 'useview_pregnancy_home_visit');
