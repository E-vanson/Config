------------------------------------------------------------
----------------useview_postnatal_care_service
------------------------------------------------------------
SELECT deps_save_and_drop_dependencies('public', 'useview_postnatal_care_service');
DROP MATERIALIZED VIEW IF EXISTS useview_postnatal_care_service;
CREATE MATERIALIZED VIEW useview_postnatal_care_service AS
(
  SELECT
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc#>>'{fields, patient_id}' AS patient_id,
    (doc#>>'{fields, patient_age_in_years}')::INT AS patient_age_in_years,
    (doc#>>'{fields, group_pnc_visit, date_of_delivery}')::DATE AS date_of_delivery,
    doc#>>'{fields, place_of_birth}' AS place_of_delivery,
    (doc#>>'{fields, postnatal_care_service_count}')::INT AS pnc_service_count,
    NULLIF(doc#>>'{fields, needs_pnc_update_follow_up}', '')::BOOLEAN AS is_referred_for_pnc_services,
    doc#>>'{contact, _id}' AS reported_by,
    doc#>>'{contact, parent, _id}' AS reported_by_parent,
    doc#>>'{contact, parent, parent, _id}' AS reported_by_parent_parent   
  FROM
    couchdb
  WHERE
    doc->>'form' = 'postnatal_care_service'
);

CREATE UNIQUE INDEX IF NOT EXISTS useview_postnatal_care_service_uuid ON useview_postnatal_care_service USING btree(uuid);
CREATE INDEX IF NOT EXISTS useview_postnatal_care_service_date_of_delivery ON useview_postnatal_care_service USING btree(date_of_delivery);
CREATE INDEX IF NOT EXISTS useview_postnatal_care_service_place_of_delivery ON useview_postnatal_care_service USING btree(place_of_delivery);
CREATE INDEX IF NOT EXISTS useview_postnatal_care_service_reported ON useview_postnatal_care_service USING btree(reported);
CREATE INDEX IF NOT EXISTS useview_postnatal_care_service_patient_id ON useview_postnatal_care_service USING btree(patient_id);
CREATE INDEX IF NOT EXISTS useview_postnatal_care_service_reported_by_parent ON useview_postnatal_care_service USING btree(reported_by_parent);
SELECT deps_restore_dependencies('public', 'useview_postnatal_care_service');
