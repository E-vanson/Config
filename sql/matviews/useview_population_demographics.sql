------------------------------------------------------------
----------------useview_population_demographics
------------------------------------------------------------
SELECT deps_save_and_drop_dependencies('public', 'useview_population_demographics');
DROP MATERIALIZED VIEW IF EXISTS useview_population_demographics;
CREATE MATERIALIZED VIEW IF NOT EXISTS useview_population_demographics AS
(
  SELECT
    person.uuid,
    couchdb.doc->>'patient_id' AS auto_patient_id,
    person.name,
    person.reported,
    couchdb.doc->>'sex' AS sex,
    CASE
      WHEN
        is_date(COALESCE(couchdb.doc->>'dob_iso', couchdb.doc->>'date_of_birth'))
        THEN TO_DATE(COALESCE(couchdb.doc->>'dob_iso', couchdb.doc->>'date_of_birth'), 'YYYY-MM-DD')::DATE
      ELSE
        calculate_dob_from_months((couchdb.doc->>'age_in_months')::INT, (couchdb.doc->>'reported_date')::BIGINT)
    END AS date_of_birth,
    CASE
      WHEN (couchdb.doc ->> 'age_in_years' IS NOT NULL AND couchdb.doc->>'age_in_years'<>'')
        THEN (couchdb.doc ->> 'age_in_years')::INTEGER
      ELSE
        (date_part('years'::text, age(person.reported, (TO_DATE(COALESCE(couchdb.doc->>'dob_iso', couchdb.doc->>'date_of_birth'), 'YYYY-MM-DD')::DATE)::TIMESTAMP WITH TIME ZONE)))::INTEGER
    END AS age_in_years,
    chv_area.contact_uuid AS chv_id,
    household.parent_uuid AS chv_area_id,
    chv_area.parent_uuid AS chu_id,
    person.muted AS muted,
    household.uuid AS household_id,
    household.reported AS household_reported_date
  FROM
    couchdb
    LEFT JOIN contactview_metadata person ON (couchdb.doc->>'_id' = person.uuid)
    LEFT JOIN contactview_metadata household ON(household.uuid = person.parent_uuid)
    LEFT JOIN contactview_metadata chv_area ON (chv_area.uuid = household.parent_uuid)
  WHERE
    couchdb.doc->>'contact_type'='f_client'
    AND household.contact_type='e_household'
);

CREATE UNIQUE INDEX IF NOT EXISTS useview_population_demographics_person_uuid ON useview_population_demographics USING btree(uuid);
CREATE INDEX IF NOT EXISTS useview_population_demographics_chv_area_id ON useview_population_demographics USING btree(chv_area_id);
CREATE INDEX IF NOT EXISTS useview_population_demographics_reported ON useview_population_demographics USING btree(reported);
SELECT deps_restore_dependencies('public', 'useview_population_demographics');