------------------------------------------------------------
----------------useview_defaulter_follow_up
------------------------------------------------------------
SELECT deps_save_and_drop_dependencies('public', 'useview_defaulter_follow_up');
DROP MATERIALIZED VIEW IF EXISTS useview_defaulter_follow_up;
CREATE MATERIALIZED VIEW useview_defaulter_follow_up AS
(
  SELECT
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc#>>'{fields, patient_id}' AS patient_id,
    doc#>>'{fields, patient_age_in_years}' AS patient_age_in_years,
    doc#>>'{fields, patient_age_in_months}' AS patient_age_in_months,
    (doc#>>'{fields, anc_defaulted}')::BOOLEAN AS anc_defaulted,
    (doc#>>'{fields, imm_defaulted}')::BOOLEAN AS imm_defaulted,
    (doc#>>'{fields, tb_defaulted}')::BOOLEAN AS tb_defaulted,
    (doc#>>'{fields, hei_defaulted}')::BOOLEAN AS hei_defaulted,
    (doc#>>'{fields, art_defaulted}')::BOOLEAN AS art_defaulted,
    (doc#>>'{fields, pnc_defaulted}')::BOOLEAN AS pnc_defaulted,
    (doc#>>'{fields, growth_monitoring_defaulted}')::BOOLEAN AS growth_monitoring_defaulted,
    (doc#>>'{fields, vit_a_and_deworming_defaulted}')::BOOLEAN AS vit_a_and_deworming_defaulted,
    NULLIF(doc#>>'{fields, group_follow_up, referred_to_hf}', '')::BOOLEAN AS is_referred,
    doc#>>'{contact, _id}' AS reported_by,
    doc#>>'{contact, parent, _id}' AS reported_by_parent,
    doc#>>'{contact, parent, parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc->>'form' = 'defaulter_follow_up'
);

CREATE UNIQUE INDEX IF NOT EXISTS useview_defaulter_follow_up_uuid ON useview_defaulter_follow_up USING btree(uuid);
CREATE INDEX IF NOT EXISTS useview_defaulter_follow_up_patient_id ON useview_defaulter_follow_up USING btree(patient_id);
CREATE INDEX IF NOT EXISTS useview_defaulter_follow_up_reported ON useview_defaulter_follow_up USING btree(reported);
CREATE INDEX IF NOT EXISTS useview_defaulter_follow_up_reported_by_parent ON useview_defaulter_follow_up USING btree(reported_by_parent);
