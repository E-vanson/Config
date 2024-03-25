------------------------------------------------------------
----------------useview_community_events
------------------------------------------------------------
SELECT deps_save_and_drop_dependencies('public', 'useview_community_events');
DROP MATERIALIZED VIEW IF EXISTS useview_community_events;
CREATE MATERIALIZED VIEW IF NOT EXISTS useview_community_events AS
(
  SELECT
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc#>>'{fields, event_information, event_types}' AS event_types,
    doc#>>'{fields, event_information, other_event}' AS event_types_other,
    (doc#>>'{fields, event_information, event_date}')::DATE AS event_date,
    doc#>>'{fields, place_id}' AS place_id,
    doc#>>'{contact, _id}' AS reported_by,
    doc#>>'{contact, parent, _id}' AS reported_by_parent,
    doc#>>'{contact, parent, parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc->>'form' = 'community_event'
);

CREATE UNIQUE INDEX IF NOT EXISTS useview_community_event_uuid ON useview_community_events USING btree(uuid);
CREATE INDEX IF NOT EXISTS useview_community_event_type ON useview_community_events USING btree(event_types);
CREATE INDEX IF NOT EXISTS useview_community_event_date ON useview_community_events USING btree(event_date);
CREATE INDEX IF NOT EXISTS useview_community_event_place_id ON useview_community_events USING btree(place_id);
SELECT deps_restore_dependencies('public', 'useview_community_events');
