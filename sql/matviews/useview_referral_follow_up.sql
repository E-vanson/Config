------------------------------------------------------------
----------------useview_referral_follow_up
------------------------------------------------------------
SELECT deps_save_and_drop_dependencies('public', 'useview_referral_follow_up');
DROP MATERIALIZED VIEW IF EXISTS useview_referral_follow_up;
CREATE MATERIALIZED VIEW useview_referral_follow_up AS
(
  SELECT
    doc->>'_id'::TEXT AS uuid,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc#>>'{fields, patient_id}' AS patient_id,
    doc#>>'{fields, patient_age_in_years}' AS patient_age_in_years,
    doc#>>'{fields, patient_age_in_months}' AS patient_age_in_months,
    fp.is_referred_for_fp_services AS was_referred_for_fp_services,
    anc.has_been_referred AS was_referred_for_anc_services,
    pnc.is_referred_for_pnc_services AS was_referred_for_pnc_services,
    defaulter.imm_defaulted AS was_defaulter_immunization,
    defaulter.art_defaulted AS was_defaulter_art,
    defaulter.hei_defaulted AS was_defaulter_hei,
    defaulter.tb_defaulted AS was_defaulter_tb,
    over_five.is_referred_tb AS was_referred_tb_case,
    under_five.needs_tb_referral AS was_referred_tb_contact,
    NULLIF(doc#>>'{fields, is_available_and_completed_visit}', '')::BOOLEAN AS is_available_and_completed_visit,
    doc#>>'{contact, _id}' AS reported_by,
    doc#>>'{contact, parent, _id}' AS reported_by_parent,
    doc#>>'{contact, parent, parent, _id}' AS reported_by_parent_parent   
  FROM
    couchdb referral
    LEFT JOIN useview_family_planning fp ON (doc#>>'{fields, inputs, source_id}' = fp.uuid)
    LEFT JOIN useview_pregnancy_home_visit anc ON (doc#>>'{fields, inputs, source_id}' = anc.uuid)
    LEFT JOIN useview_postnatal_care_service pnc ON (doc#>>'{fields, inputs, source_id}' = pnc.uuid)
    LEFT JOIN useview_defaulter_follow_up defaulter ON (doc#>>'{fields, inputs, source_id}' = defaulter.uuid)
    LEFT JOIN useview_under_five_assessment under_five ON (doc#>>'{fields, inputs, source_id}' = under_five.uuid)
    LEFT JOIN useview_over_five_assessment over_five ON (doc#>>'{fields, inputs, source_id}' = over_five.uuid)
  WHERE
    doc->>'form' = 'referral_follow_up'
);

CREATE UNIQUE INDEX IF NOT EXISTS useview_referral_follow_up_uuid ON useview_referral_follow_up USING btree(uuid);
CREATE INDEX IF NOT EXISTS useview_referral_follow_up_patient_id ON useview_referral_follow_up USING btree(patient_id);
CREATE INDEX IF NOT EXISTS useview_referral_follow_up_reported ON useview_referral_follow_up USING btree(reported);
CREATE INDEX IF NOT EXISTS useview_referral_follow_up_reported_by_parent ON useview_referral_follow_up USING btree(reported_by_parent);
SELECT deps_restore_dependencies('public', 'useview_referral_follow_up');
