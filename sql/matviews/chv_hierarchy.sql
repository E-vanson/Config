------------------------------------------------------------
----------------chv_hierarchy
------------------------------------------------------------
SELECT deps_save_and_drop_dependencies('public', 'chv_hierarchy');
DROP MATERIALIZED VIEW IF EXISTS chv_hierarchy;
CREATE MATERIALIZED VIEW IF NOT EXISTS chv_hierarchy AS
(
  SELECT
    chv.doc->>'name'::TEXT AS name,
    chv.doc->>'_id'::TEXT AS uuid,
    chv.doc->>'external_id'::TEXT AS chv_code,
    chv.doc->>'sex'::TEXT AS sex,
    chv.doc->>'phone'::TEXT AS phone,
    chv_area.doc->>'_id'::TEXT AS chv_area_uuid,
    chv_area.doc->>'name'::TEXT AS chv_area_name,
    chv_area.doc->>'link_facility_code'::TEXT AS link_facility_code,
    chv_area.doc->>'link_facility_name'::TEXT AS link_facility_name,
    chu.doc->>'_id'::TEXT AS chu_uuid,
    chu.doc->>'code'::TEXT AS chu_code,
    chu.doc->>'name'::TEXT AS chu_name,
    cha.doc->>'name'::TEXT AS cha,
    cha.doc->>'phone'::TEXT AS cha_phone,
    sub_county.doc->>'_id'::TEXT AS sub_county_uuid,
    sub_county.doc->>'name'::TEXT AS sub_county_name,
    sub_county_contact.doc->>'name'::TEXT AS sub_county_focal_person,
    sub_county_contact.doc->>'phone'::TEXT AS sub_county_focal_person_phone,
    county.doc->>'name'::TEXT AS county,
    county_contact.doc->>'name'::TEXT AS county_focal_person,
    county_contact.doc->>'phone'::TEXT AS county_focal_person_phone,
    to_timestamp((NULLIF(chv.doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported
  FROM
    raw_contacts chv
    LEFT JOIN raw_contacts chv_area ON ((chv.doc#>>'{parent, _id}')::TEXT = (chv_area.doc->>'_id')::TEXT)
    LEFT JOIN raw_contacts chu ON ((chv_area.doc#>>'{parent, _id}')::TEXT = (chu.doc->>'_id')::TEXT)
    LEFT JOIN raw_contacts cha ON ((chu.doc#>>'{contact, _id}')::TEXT = (cha.doc->>'_id')::TEXT)
    LEFT JOIN raw_contacts sub_county ON ((chu.doc#>>'{parent, _id}')::TEXT = (sub_county.doc->>'_id')::TEXT)
    LEFT JOIN raw_contacts sub_county_contact ON ((sub_county.doc#>>'{contact, _id}')::TEXT = (sub_county_contact.doc->>'_id')::TEXT)
    LEFT JOIN raw_contacts county ON ((sub_county.doc#>>'{parent, _id}')::TEXT = (county.doc->>'_id')::TEXT)
    LEFT JOIN raw_contacts county_contact ON ((county.doc#>>'{contact, _id}')::TEXT = (county_contact.doc->>'_id')::TEXT)
  WHERE
    chv.doc->>'contact_type' = 'person' AND chv.doc#>>'{parent, parent, parent, parent, _id}' != ''
);  

CREATE UNIQUE INDEX IF NOT EXISTS chv_hierarchy_uuid ON chv_hierarchy USING btree(uuid);
CREATE INDEX IF NOT EXISTS chv_hierarchy_parent_uuid ON chv_hierarchy USING btree(chv_area_uuid);
CREATE INDEX IF NOT EXISTS chv_hierarchy_parent_parent_uuid ON chv_hierarchy USING btree(chu_uuid);

SELECT deps_restore_dependencies('public', 'chv_hierarchy');
