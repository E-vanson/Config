------------------------------------------------------------
----------------contactview_metadata
------------------------------------------------------------
SELECT deps_save_and_drop_dependencies('public', 'contactview_metadata');
DROP MATERIALIZED VIEW IF EXISTS contactview_metadata;
CREATE MATERIALIZED VIEW contactview_metadata AS
(
  SELECT
    doc->>'_id' AS uuid,
    doc->>'name'::TEXT AS name,
    doc->>'contact_type'::TEXT AS contact_type,
    doc#>>'{contact,_id}'::TEXT[] AS contact_uuid,
    doc#>>'{parent,_id}'::TEXT[] AS parent_uuid,
    doc->>'notes'::TEXT AS notes,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    NULLIF((doc->>'muted'),'') as muted
  FROM
    raw_contacts
);

CREATE UNIQUE INDEX IF NOT EXISTS contactview_metadata_uuid ON contactview_metadata USING btree(uuid);
CREATE INDEX IF NOT EXISTS contactview_metadata_contact_uuid ON contactview_metadata USING btree(contact_uuid);
CREATE INDEX IF NOT EXISTS contactview_metadata_parent_uuid ON contactview_metadata USING btree(parent_uuid);
CREATE INDEX IF NOT EXISTS contactview_metadata_contact_type ON contactview_metadata USING btree(contact_type);
SELECT deps_restore_dependencies('public', 'contactview_metadata');
