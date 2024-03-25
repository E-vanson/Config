------------------------------------------------------------
----------------useview_wash_and_insurance
------------------------------------------------------------
SELECT deps_save_and_drop_dependencies('public', 'useview_wash_and_insurance');
DROP MATERIALIZED VIEW IF EXISTS useview_wash_and_insurance;
CREATE MATERIALIZED VIEW useview_wash_and_insurance AS (
  SELECT
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc->>'_id' AS place_id,
    NULLIF(doc->>'has_functional_latrine', '')::BOOLEAN AS has_functional_latrine,
    NULLIF(doc->>'has_functional_handwashing_facility', '')::BOOLEAN AS has_functional_handwashing_facility,
    NULLIF(doc->>'uses_treated_water', '')::BOOLEAN AS has_access_to_safe_water,
    NULLIF(doc->>'has_functional_refuse_disposal_facility', '')::BOOLEAN AS has_functional_refuse_disposal_facility,
    NULLIF(doc->>'has_upto_date_insurance_cover', '')::BOOLEAN AS has_upto_date_insurance_cover,
    doc->>'specific_insurance_cover' AS specific_insurance_cover,
    TRUE AS is_new_visit,
    doc#>>'{meta, created_by_person_uuid}' AS reported_by,
    doc#>>'{parent, _id}' AS reported_by_parent,
    doc#>>'{parent, parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc->>'contact_type' = 'e_household'
  
  UNION ALL

  SELECT
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc#>>'{fields, place_id}' AS place_id,
    NULLIF(doc#>>'{fields, group_wash, has_functional_latrine}', '')::BOOLEAN AS has_functional_latrine,
    NULLIF(doc->>'{fields, group_wash, has_functional_handwash_facility}', '')::BOOLEAN AS has_functional_handwashing_facility,
    NULLIF(doc->>'{fields, group_wash, uses_safe_water}', '')::BOOLEAN AS has_access_to_safe_water,
    NULLIF(doc->>'{fields, group_wash, has_functional_refuse_disposal_site}', '')::BOOLEAN AS has_functional_refuse_disposal_facility,
    NULLIF(doc->>'{fields, insurance, has_upto_date_insurance}', '')::BOOLEAN AS has_upto_date_insurance_cover,
    doc->>'{fields, insurance, insurance_cover}' AS specific_insurance_cover,
    FALSE AS is_new_visit,
    doc#>>'{contact, _id}' AS reported_by,
    doc#>>'{contact, parent, _id}' AS reported_by_parent,
    doc#>>'{contact, parent, parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc->>'form' = 'wash'
);

CREATE UNIQUE INDEX IF NOT EXISTS useview_wash_and_insurance_uuid ON useview_wash_and_insurance USING btree(uuid);
CREATE INDEX IF NOT EXISTS useview_wash_and_insurance_place_id ON useview_wash_and_insurance USING btree(place_id);
CREATE INDEX IF NOT EXISTS useview_wash_and_insurance_reported ON useview_wash_and_insurance USING btree(reported);
CREATE INDEX IF NOT EXISTS useview_wash_and_insurance_reported_by_parent ON useview_wash_and_insurance USING btree(reported_by_parent);
SELECT deps_restore_dependencies('public', 'useview_wash_and_insurance');
