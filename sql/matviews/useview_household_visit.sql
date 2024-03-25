------------------------------------------------------------
----------------useview_household_visit
------------------------------------------------------------
SELECT deps_save_and_drop_dependencies('public', 'useview_household_visit');
DROP MATERIALIZED VIEW IF EXISTS useview_household_visit;
CREATE MATERIALIZED VIEW useview_household_visit AS (
  SELECT
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc ->> 'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc->>'form'::text AS form,
    cmeta.parent_uuid AS place_id,
    doc#>>'{contact, _id}' AS reported_by,
    doc#>>'{contact, parent, _id}' AS reported_by_parent,
    doc#>>'{contact, parent, parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb 
    INNER JOIN contactview_metadata cmeta ON (doc#>>'{fields, patient_id}' = cmeta.uuid)
  WHERE
    cmeta.contact_type = 'f_client' AND 
    (doc->>'type' = 'data_record' AND doc->>'form' IS NOT NULL)
  
  UNION ALL

  SELECT
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc ->> 'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc->>'form'::TEXT AS form,
    doc#>>'{fields, place_id}' AS place_id,
    doc#>>'{contact, _id}' AS reported_by,
    doc#>>'{contact, parent, _id}' AS reported_by_parent,
    doc#>>'{contact, parent, parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc->>'form' = 'wash'
);

CREATE UNIQUE INDEX IF NOT EXISTS useview_household_visit_uuid ON useview_household_visit USING btree(uuid);
CREATE INDEX IF NOT EXISTS useview_household_visit_place_id ON useview_household_visit USING btree(place_id);
CREATE INDEX IF NOT EXISTS useview_household_visit_reported ON useview_household_visit USING btree(reported);
CREATE INDEX IF NOT EXISTS useview_household_visit_reported_by_parent ON useview_household_visit USING btree(reported_by_parent);
SELECT deps_restore_dependencies('public', 'useview_household_visit');
