------------------------------------------------------------
----------------useview_death
------------------------------------------------------------
SELECT deps_save_and_drop_dependencies('public', 'useview_death');
DROP MATERIALIZED VIEW IF EXISTS useview_death;
CREATE MATERIALIZED VIEW useview_death AS
(
  WITH death_review AS (
    SELECT
      DISTINCT ON (doc#>>'{fields, patient_id}')
      *
    FROM
      couchdb
    WHERE
      doc->>'form' = 'death_review'
      AND doc#>>'{fields, group_review, dead}' = 'yes'
    ORDER BY
      doc#>>'{fields, patient_id}',
      doc->>'reported_date' DESC
  )
  SELECT
    death_report.doc->>'_id' AS uuid,
    to_timestamp((NULLIF(death_report.doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    death_report.doc#>>'{fields, patient_id}' AS patient_id,
    (death_report.doc#>>'{fields, patient_age_in_years}')::INT  AS patient_age_in_years,
    (death_report.doc#>>'{fields, patient_age_in_months}')::INT  AS patient_age_in_months,
    (death_report.doc#>>'{fields, patient_age_in_days}')::INT  AS patient_age_in_days,
    (death_report.doc#>>'{fields, group_death, date_of_death}')::DATE AS date_of_death,
    death_report.doc#>>'{fields, group_death, place_of_death}' AS place_of_death,
    death_report.doc#>>'{fields, death_type}' AS death_type,
    death_report.doc#>>'{contact, _id}' AS reported_by,
    death_report.doc#>>'{contact, parent, _id}' AS reported_by_parent,
    death_report.doc#>>'{contact, parent, parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb death_report
    INNER JOIN death_review ON (death_report.doc->>'_id' = death_review.doc#>>'{fields, inputs, source_id}')
  WHERE
    death_report.doc ->> 'form' = 'death_report'
);

CREATE UNIQUE INDEX IF NOT EXISTS useview_death_uuid ON useview_death USING btree(uuid);
CREATE INDEX IF NOT EXISTS useview_death_reported ON useview_death USING btree(reported);
CREATE INDEX IF NOT EXISTS useview_death_death_type ON useview_death USING btree(death_type);
CREATE INDEX IF NOT EXISTS useview_death_reported_by_parent ON useview_death USING btree(reported_by_parent);
CREATE INDEX IF NOT EXISTS useview_death_patient_age_in_days ON useview_death USING btree(patient_age_in_days);
CREATE INDEX IF NOT EXISTS useview_death_patient_age_in_months ON useview_death USING btree(patient_age_in_months);
CREATE INDEX IF NOT EXISTS useview_death_patient_age_in_years ON useview_death USING btree(patient_age_in_years);
SELECT deps_restore_dependencies('public', 'useview_death');
