--
-- Name: echis_khis_data_set_element_mapping; Type: TABLE; Schema: public; Owner: -
--
DROP TABLE IF EXISTS echis_khis_data_set_element_mapping;
CREATE TABLE echis_khis_data_set_element_mapping (
  id SERIAL PRIMARY KEY NOT NULL,
  khis_data_set_uid VARCHAR(20) NOT NULL,
  khis_data_element_uid VARCHAR(20) NOT NULL,
 	echis_name VARCHAR(100) NOT NULL,
 	description VARCHAR(400) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO echis_khis_data_set_element_mapping(khis_data_set_uid, echis_name, khis_data_element_uid, description)
VALUES
('ovtKPo15xAg', 'count_new_households_visited_safe_water_new_visit', 'OXgWwVp4SLi', 'Total number of NEW households visited in the month accessing safe water (New Visit)'),
('ovtKPo15xAg', 'count_households_hand_washing_facilities_new_visit', 'zhwGF3FDj8B', 'Total number of households with hand washing facilities e.g. leaky tins in use (New visit)'),
('ovtKPo15xAg', 'count_households_functional_latrines_new_visit', 'b16FHzbfVUe', 'Total number of households with functional latrines (New visit)'),
('ovtKPo15xAg', 'count_newborns_within_48_hours_of_delivery', 'NjcDm9nopWu', 'Total number of new-borns visited at home within 48 hours of delivery'),
('ovtKPo15xAg', 'count_children_12_59_months_dewormed', 'vAkP6k0yZDk', 'Total number of children 12-59 months dewormed'),
('ovtKPo15xAg', 'count_pregnant_women_referred_to_health_facility', 'VrpxWLhfIr6', 'Total number of pregnant women Referred  to health facility'),
('ovtKPo15xAg', 'count_new_deliveries_at_health_facility', 'fdsnixQkKCY', 'Total number of New deliveries that took place in Health Facility'),
('ovtKPo15xAg', 'count_children_0_11_months_referred_immunization', 'ZkAL6i7sS2S', 'Total number of mmunization defaulters traced and referred'),
('ovtKPo15xAg', 'count_persons_referred_hts', 'zbYf5G3P7Fv', 'Total number of clients referred for HIV Testing Services (HTS)'),
('ovtKPo15xAg', 'count_persons_referred_comprehensive_geriatric_services', 'hYPcrC46URl', 'Total number of Older persons  (60 years  or more) referred for routine health check ups'),
('ovtKPo15xAg', 'count_persons_referred_diabetes', 'umcBUHyhuTc', 'Total number of persons with Diabetes'),
('ovtKPo15xAg', 'count_persons_referred_cancer', 'SnP5Qr06tLy', 'Total number of persons with cancer'),
('ovtKPo15xAg', 'count_persons_referred_mental_illness', 'd0XSdWwIlCU', 'Total number of persons with Mental Illness'),
('ovtKPo15xAg', 'count_persons_referred_hypertension', 'v9HafndlV8q', 'Total number of persons with Hypertension'),
('ovtKPo15xAg', 'count_defaulters_immunization_referred', 'KHfPfnhSjmA', 'Total number of mmunization defaulters traced and referred'),
('ovtKPo15xAg', 'count_deaths_12_59_months', 'sXPwrF8r04E', 'Record of all deaths between 12 - 59 months of age'),
('ovtKPo15xAg', 'count_deaths_maternal', 'Gx1XLLsvwAZ', 'Record of all deaths of women during pregnancy or child birth or within 42 days after delivery'),
('ovtKPo15xAg', 'count_households_visited_new_visit', 'LGsW5FyZFwZ', 'Total number of households visited by CHVs in the month(New Visit)'),
('ovtKPo15xAg', 'count_households_visited_revisit', 'vGvOtbvhclF', 'Total number of households visited in the month by CHVs(Revisit)'),
('ovtKPo15xAg', 'count_households_new_visit_upto_date_insurance', 'z9qwgod3UiG', 'Total number of households visited in the Month with upto date health insuarance(New Visit)'),
('ovtKPo15xAg', 'count_households_new_visit_upto_date_insurance_uhc', 'd0zEtbkJnel', 'Total number of households visited in the Month with upto date health insuarance-UHC (New Visit)'),
('ovtKPo15xAg', 'count_households_new_visit_upto_date_insurance_nhif', 'xXhZ15pqy4p', 'Total number of households visited in the Month with upto date health insuarance-NHIF (New Visit)'),
('ovtKPo15xAg', 'count_households_new_visit_upto_date_insurance_others', 'KiKtdZ5rV5d', 'Total number of households visited in the Month with upto date health insuarance-OTHERS (New Visit)'),
('ovtKPo15xAg', 'count_households_new_visit_refuse_disposal', 'lhkXObzaWr3', 'Total number of households with Refuse disposal facility (New visit)'),
('ovtKPo15xAg', 'count_women_15_49_years_counselled_fp', 'qNoOzWtEpuD', 'Total number of women (15-49 yrs) counselled on FP methods'),
('ovtKPo15xAg', 'count_women_15_49_years_provided_fp', 'bbrNRV9zwVa', 'Total number of women between 15 - 49 years provided with family planning commodities by CHVs'),
('ovtKPo15xAg', 'count_women_15_49_years_referred_fp', 'TLKNYG2xGad', 'Total Number of women  15-49yrs Referred for   FP Services'),
('ovtKPo15xAg', 'count_women_pregnant', 'NvUUbEhFVcO', 'Total Number of women who are pregnant'),
('ovtKPo15xAg', 'count_women_pregnant_underage', 'h9VcGyaQkfZ', 'Total Number of under-age pregnancies (under 18 years)'),
('ovtKPo15xAg', 'count_women_pregnant_counselled_anc', 'LHd6A9RtHRF', 'Total number of pregnant women counselled on ANC services'),
('ovtKPo15xAg', 'count_new_deliveries', 'jx879BUZ39L', 'Total number of New deliveries that took place in  C.U'),
('ovtKPo15xAg', 'count_new_deliveries_at_home', 'X9d8oaBHDqx', 'Total number of New deliveries that took place at Home'),
('ovtKPo15xAg', 'count_new_deliveries_underage', 'vB85yqSN4gx', 'Total number of New under-age Deliveries (10-19 years) in the month'),
('ovtKPo15xAg', 'count_new_mothers_visited_within_48_hours_of_delivery', 'tuIDKhqDdcB', 'Total number of new mothers visited within 48 hrs of delivery'),
('ovtKPo15xAg', 'count_new_deliveries_at_home_referred_pnc', 'JrdSl1ADdBC', 'Total Home deliveries referred for Post Natal Care (PNC) Services'),
('ovtKPo15xAg', 'count_children_6_59_months_malnutrition_severe', 'idiiaWIh2qi', 'Total number of children (6-59 months) with MUAC (Red) indicating  severe malnutrition'),
('ovtKPo15xAg', 'count_children_6_59_months_malnutrition_moderate', 'ekh0oJidJ38', 'Total number of children (6-59 months) with MUAC (Yellow) indicating  moderate malnutrition'),
('ovtKPo15xAg', 'count_children_6_59_months_referred_vitamin_a', 'ksINuMMr419', 'Total number of children (6-59 months) referred for Vitamin A supplementation'),
('ovtKPo15xAg', 'count_children_0_59_months_referred_delayed_milestones', 'dmU5MIrpsP7', 'Total number of children with delayed milestones referred'),
('ovtKPo15xAg', 'count_defaulters_art_referred', 'TfmOlLMrQc6', 'Total number of ART defaulters in the month (From CCC clinic)'),
('ovtKPo15xAg', 'count_defaulters_hei_referred', 'yHBk3iXClvx', 'Total number of HIV exposed infant defaulters in the month (from MCH)'),
('ovtKPo15xAg', 'count_defaulters_art_traced_referred', 'q90IMsLpFO4', 'Total number of ART defaulters traced and referred'),
('ovtKPo15xAg', 'count_defaulters_hei_traced_referred', 'rdJBPSOGJlA', 'Total number of HIV exposed infant defaulters traced and referred'),
('ovtKPo15xAg', 'count_persons_screened_tb', 'NjCLHbMeaNw', 'Total number of persons screened for TB'),
('ovtKPo15xAg', 'count_persons_presumptive_tb_referred', 'eLMPka37L2p', 'Total number of presumptive TB persons referred for TB diagnosis'),
('ovtKPo15xAg', 'count_persons_presumptive_tb_referred_confirmed', 'HHyDcD7IjqT', 'Total number of bacteriologically confirmed TB cases (From TB clinic)'),
('ovtKPo15xAg', 'count_persons_presumptive_tb_referred_confirmed_referred', 'siQaAwG3fiQ', 'Total number of presumptive TB contacts of bacteriologically confirmed TB cases referred for Screening'),
('ovtKPo15xAg', 'count_cases_tb_confirmed_0_59_months', 'RhriKmKbHuH', 'Total number of children <5 years TB contacts of bacteriologically confirmed TB cases referred for IPT'),
('ovtKPo15xAg', 'count_treatment_interruptors_tb', 'XP1JclLpKdP', 'Total number of TB Treatment Interruptersin the Month (TB clinic)'),
('ovtKPo15xAg', 'count_treatment_interrupters_tb_traced', 'mOoe88OmCct', 'Total number of TB Treatment Interrupters traced'),
('ovtKPo15xAg', 'count_women_15_49_years_referred_fp_completed', 'RivX8a7SDU3', 'Total number of persons referred for FP Services reaching health facility'),
('ovtKPo15xAg', 'count_women_pregnant_referred_anc_completed', 'wYD1JE3Tgsu', 'Total number of pregnabt women reaching health facility'),
('ovtKPo15xAg', 'count_women_referred_pnc_completed', 'vyCCWAqAP5x', 'Total number of mothers referred for post natal services reaching health facility'),
('ovtKPo15xAg', 'count_defaulters_immunization_referred_completed', 'XDgpSRb8Ofv', 'Total number of referred immunization defaulters reaching health facility'),
('ovtKPo15xAg', 'count_persons_referred_hts_completed', 'QAKpLg7iZEJ', 'Total number referred for Hiv testing services reaching health facility'),
('ovtKPo15xAg', 'count_defaulters_art_referred_completed', 'iJpuwr4Hqj1', 'Total number referred ART Defaulters reaching health facility'),
('ovtKPo15xAg', 'count_defaulters_hei_referred_completed', 'r1ed7zn2Q0a', 'Total number referred HIV exposed infant defaulter reaching health facility'),
('ovtKPo15xAg', 'count_routine_checkup_referred_completed', 'ylvw7Y1OB1H', 'Total number referred  for routine check up for older persons reaching health facility'),
('ovtKPo15xAg', 'count_persons_presumptive_tb_referred_completed', 'HC2a1iMVGPv', 'Total number referred presumptive TB casesreaching health facility'),
('ovtKPo15xAg', 'count_persons_presumptive_tb_contacts_referred_completed', 'Qr3F0zbsMmN', 'Total number referred presumptive TB contacts reaching health facility'),
('ovtKPo15xAg', 'count_cases_tb_0_59_months_ipt_referred_completed', 'RlDNgxU0gn3', 'Total number referred  under 5 child Tb contacts for Isoniazid Preventive Therapy reaching health facility'),
('ovtKPo15xAg', 'count_treatment_interruptors_tb_referred_completed', 'RKBTMciF0Tk', 'Total number referred TB INTERRUPTORS reaching health facility'),
('ovtKPo15xAg', 'count_cases_0_59_months_fever_lt_7_days', 'gpYrkLhO4wB', 'Total number of under 5 years cases with fever for less than 7 days'),
('ovtKPo15xAg', 'count_cases_0_59_months_fever_lt_7_days_rdt', 'RXgNfdYSJPh', 'Total number of under 5 years cases with fever for less than 7 days with RDT done'),
('ovtKPo15xAg', 'count_cases_0_59_months_fever_lt_7_days_rdt_positive', 'eUakxWsxkcq', 'Total number of under 5 years cases with fever for less than 7 days with (RDT +ve)  results'),
('ovtKPo15xAg', 'count_cases_0_59_months_fever_lt_7_days_rdt_positive_act', 'V9SqzZHKoP7', 'Total number of under 5 years Malaria Cases (RDT +ve) treated with ACT'),
('ovtKPo15xAg', 'count_cases_2_59_months_fast_breathing', 'WBTvg49kJHr', 'Total number of children aged 2-59 months  presenting with fast breathing'),
('ovtKPo15xAg', 'count_cases_2_59_months_fast_breathing_amoxycillin', 'wMQolZyIR5P', 'Total number of children aged 2-59 months presenting with fast breathing treated with Amoxycillin(DT)'),
('ovtKPo15xAg', 'count_cases_2_59_months_diarrhea', 'V00z4bQRaqe', 'Total number of cases  of diarrhoea identified in children 2-59 months age'),
('ovtKPo15xAg', 'count_cases_2_59_months_diarrhea_zinc_ors', 'AR3WCfcKDwX', 'Total number of children of 2-59 months with diarrhoea treated with Zinc and ORS'),
('ovtKPo15xAg', 'count_cases_gte_60_months_fever_lt_7_days', 'YCWGGPn7tdl', 'Total number of under 5 years cases with fever for less than 7 days'),
('ovtKPo15xAg', 'count_cases_gte_60_months_fever_lt_7_days_rdt', 'ZAsCMIJLkvj', 'Total number of under 5 years cases with fever for less than 7 days with RDT done'),
('ovtKPo15xAg', 'count_cases_gte_60_months_fever_lt_7_days_rdt_positive', 'QfBRPj1q0W1', 'Total number of under 5 years cases with fever for less than 7 days with (RDT +ve)  results'),
('ovtKPo15xAg', 'count_cases_gte_60_months_fever_lt_7_days_rdt_positive_act', 'oVxxa344TPs', 'Total number of under 5 years Malaria Cases (RDT +ve) treated with ACT'),
('ovtKPo15xAg', 'count_deaths_0_28_days', 'bWTVzXQoxpt', 'Record of all deaths between zero to 28 days of age'),
('ovtKPo15xAg', 'count_deaths_29_days_11_months', 'I9yVwu1FWu6', 'Record of all deaths between zero to 11 months of age'),
('ovtKPo15xAg', 'count_deaths_6_59_years', 'jBYvAmDdyfY', 'Record of all deaths 6-59 years(not maternal)'),
('ovtKPo15xAg', 'count_deaths_gt_60_years', 'zW17XEoFhAN', 'Record of all deaths 60 years and above'),
('ovtKPo15xAg', 'count_households', 'rdcZ1ni3jrD', 'Total number of Households'),
('ovtKPo15xAg', 'count_community_dialogue_days', 'Y0ZpWnkp4v9', 'Total number of community dialogue days held'),
('ovtKPo15xAg', 'count_community_action_days', 'ybfaTwL9yBA', 'Total number of community Action Days held'),
('ovtKPo15xAg', 'count_community_monthly_meetings', 'aod6Gz2QUg2', 'Total number of community units monthly meetings held');


CREATE OR REPLACE FUNCTION refresh_matviews()
RETURNS INTEGER
LANGUAGE plpgsql
AS $function$
DECLARE
  matview RECORD;
BEGIN
  RAISE NOTICE 'Refreshing base metaviews';
  -- other matviews rely on contactview_metadata, which is a matview
  -- so load this first
  REFRESH MATERIALIZED VIEW CONCURRENTLY contactview_metadata;
  FOR matview IN SELECT matviewname, schemaname FROM pg_catalog.pg_matviews LOOP
    IF matview.matviewname = 'contactview_metadata' THEN
      -- this one is already done, skip it.
      CONTINUE;
    END IF;
    RAISE NOTICE 'Refreshing %', matview.matviewname;
    EXECUTE format('REFRESH MATERIALIZED VIEW CONCURRENTLY %s', CONCAT(matview.schemaname, '.', matview.matviewname));
  END LOOP;
  RAISE NOTICE 'Materialized views refreshed.';
  RETURN 1;
END;
$function$
;

CREATE OR REPLACE FUNCTION f_cast_isots(text)
RETURNS TIMESTAMP AS
$$SELECT to_timestamp($1::bigint/1000)::TIMESTAMP WITHOUT TIME ZONE $$  -- adapt to your needs
LANGUAGE sql IMMUTABLE
;

CREATE OR REPLACE FUNCTION f_cast_dtts(text)
RETURNS TIMESTAMP AS
$$SELECT $1::TIMESTAMP WITHOUT TIME ZONE $$  -- adapt to your needs
LANGUAGE sql IMMUTABLE
;

-- Function to handle view dependencies: hierarchy, order of dropping and creating views, and grants
DROP TABLE IF EXISTS deps_saved_ddl
;
CREATE TABLE deps_saved_ddl
(
  deps_id serial PRIMARY KEY,
  deps_view_schema varchar(255),
  deps_view_name varchar(255),
  deps_ddl_to_run text
)
;

CREATE OR REPLACE FUNCTION deps_save_and_drop_dependencies(p_view_schema varchar, p_view_name varchar) RETURNS void AS
$$
declare
  v_curr record;
begin
for v_curr in
(
  select obj_schema, obj_name, obj_type from
  (
  with recursive recursive_deps(obj_schema, obj_name, obj_type, depth) as
  (
    select p_view_schema, p_view_name, null::varchar, 0
    union
    select dep_schema::varchar, dep_name::varchar, dep_type::varchar, recursive_deps.depth + 1 from
    (
      select ref_nsp.nspname ref_schema, ref_cl.relname ref_name,
    rwr_cl.relkind dep_type,
      rwr_nsp.nspname dep_schema,
      rwr_cl.relname dep_name
      from pg_depend dep
      join pg_class ref_cl on dep.refobjid = ref_cl.oid
      join pg_namespace ref_nsp on ref_cl.relnamespace = ref_nsp.oid
      join pg_rewrite rwr on dep.objid = rwr.oid
      join pg_class rwr_cl on rwr.ev_class = rwr_cl.oid
      join pg_namespace rwr_nsp on rwr_cl.relnamespace = rwr_nsp.oid
      where dep.deptype = 'n'
      and dep.classid = 'pg_rewrite'::regclass
    ) deps
    join recursive_deps on deps.ref_schema = recursive_deps.obj_schema and deps.ref_name = recursive_deps.obj_name
    where (deps.ref_schema != deps.dep_schema or deps.ref_name != deps.dep_name)
  )
  select obj_schema, obj_name, obj_type, depth
  from recursive_deps
  where depth > 0
  ) t
  group by obj_schema, obj_name, obj_type
  order by max(depth) desc
) loop

  insert into deps_saved_ddl(deps_view_schema, deps_view_name, deps_ddl_to_run)
  select p_view_schema, p_view_name, 'COMMENT ON ' ||
  case
  when c.relkind = 'v' then 'VIEW'
  when c.relkind = 'm' then 'MATERIALIZED VIEW'
  else ''
  end
  || ' ' || n.nspname || '.' || c.relname || ' IS ''' || replace(d.description, '''', '''''') || ''';'
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  join pg_description d on d.objoid = c.oid and d.objsubid = 0
  where n.nspname = v_curr.obj_schema and c.relname = v_curr.obj_name and d.description is not null;

  insert into deps_saved_ddl(deps_view_schema, deps_view_name, deps_ddl_to_run)
  select p_view_schema, p_view_name, 'COMMENT ON COLUMN ' || n.nspname || '.' || c.relname || '.' || a.attname || ' IS ''' || replace(d.description, '''', '''''') || ''';'
  from pg_class c
  join pg_attribute a on c.oid = a.attrelid
  join pg_namespace n on n.oid = c.relnamespace
  join pg_description d on d.objoid = c.oid and d.objsubid = a.attnum
  where n.nspname = v_curr.obj_schema and c.relname = v_curr.obj_name and d.description is not null;

  insert into deps_saved_ddl(deps_view_schema, deps_view_name, deps_ddl_to_run)
  select p_view_schema, p_view_name, 'GRANT ' || privilege_type || ' ON ' || table_schema || '.' || table_name || ' TO ' || grantee
  from information_schema.role_table_grants
  where table_schema = v_curr.obj_schema and table_name = v_curr.obj_name;

  if v_curr.obj_type = 'v' then
    insert into deps_saved_ddl(deps_view_schema, deps_view_name, deps_ddl_to_run)
    select p_view_schema, p_view_name, 'CREATE VIEW ' || v_curr.obj_schema || '.' || v_curr.obj_name || ' AS ' || view_definition
    from information_schema.views
    where table_schema = v_curr.obj_schema and table_name = v_curr.obj_name;
  elsif v_curr.obj_type = 'm' then
    insert into deps_saved_ddl(deps_view_schema, deps_view_name, deps_ddl_to_run)
    select p_view_schema, p_view_name, 'CREATE MATERIALIZED VIEW ' || v_curr.obj_schema || '.' || v_curr.obj_name || ' AS ' || definition
    from pg_matviews
    where schemaname = v_curr.obj_schema and matviewname = v_curr.obj_name;
  end if;

  execute 'DROP ' ||
  case
    when v_curr.obj_type = 'v' then 'VIEW'
    when v_curr.obj_type = 'm' then 'MATERIALIZED VIEW'
  end
  || ' ' || v_curr.obj_schema || '.' || v_curr.obj_name;

  end loop;
end;
$$
LANGUAGE plpgsql
;

CREATE OR REPLACE FUNCTION deps_restore_dependencies(p_view_schema varchar, p_view_name varchar) RETURNS void AS
$$
declare
  v_curr record;
begin
for v_curr in
(
  select deps_ddl_to_run
  from deps_saved_ddl
  where deps_view_schema = p_view_schema and deps_view_name = p_view_name
  order by deps_id desc
) loop
  execute v_curr.deps_ddl_to_run;
end loop;
delete from deps_saved_ddl
where deps_view_schema = p_view_schema and deps_view_name = p_view_name;
end;
$$
LANGUAGE plpgsql
;

CREATE OR REPLACE FUNCTION is_date(s varchar) RETURNS boolean AS $$
begin
  if s is null then
    return false;
  end if;
  perform to_date(s, 'yyyy-mm-dd');
  return true;
exception when others then
  return false;
end;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS safe_divide(NUMERIC,NUMERIC,int)
;
CREATE OR REPLACE FUNCTION safe_divide(numerator NUMERIC, denominator NUMERIC, round_dec int) RETURNS FLOAT AS $$
    SELECT 
      CASE 
        WHEN denominator = 0 THEN 0 
        ELSE round(100*(numerator / (denominator)::FLOAT)::NUMERIC, round_dec)::FLOAT
      END;
$$ LANGUAGE SQL IMMUTABLE
;

CREATE OR REPLACE FUNCTION dedupe_array(arr anyarray)
RETURNS anyarray AS $body$ SELECT ARRAY( SELECT DISTINCT UNNEST($1) ) $body$ LANGUAGE SQL IMMUTABLE
;

CREATE OR REPLACE FUNCTION calculate_dob_from_months(months INTEGER, reported_date BIGINT)
RETURNS DATE AS $$
DECLARE
  dob DATE;
BEGIN
  SELECT (to_timestamp((reported_date / 1000)::DOUBLE PRECISION) - CAST(months || ' months' AS INTERVAL))::DATE INTO dob;
  RETURN dob;
END;
$$ LANGUAGE plpgsql;


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


------------------------------------------------------------
----------------useview_over_five_assessment
------------------------------------------------------------
SELECT deps_save_and_drop_dependencies('public', 'useview_over_five_assessment');
DROP MATERIALIZED VIEW IF EXISTS useview_over_five_assessment;
CREATE MATERIALIZED VIEW useview_over_five_assessment AS
(
  SELECT 
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    (doc#>>'{fields, patient_age_in_years}')::INT AS patient_age_in_years,
    doc#>>'{fields, patient_uuid}' AS patient_id,
    CASE
      WHEN
        doc#>>'{fields, group_diabetes, is_on_diabetes_medication}' = 'no'
      THEN TRUE
      ELSE FALSE
    END AS is_referred_diabetes,
    CASE
      WHEN
        doc#>>'{fields, group_hypertension, is_on_hypertension_medication}' = 'no'
      THEN TRUE
      ELSE FALSE
    END AS is_referred_hypertension,
    NULLIF(doc#>>'{fields, needs_mental_health_referral}', '')::BOOLEAN AS is_referred_mental_health,
    NULLIF(doc#>>'{fields, group_fever, has_fever}', '')::BOOLEAN AS has_fever,
    NULLIF(doc#>>'{fields, group_fever, fever_duration}', '')::INT AS fever_duration,
    doc#>>'{fields, group_malaria, rdt_result}' AS rdt_result,
    doc#>>'{fields, group_malaria, repeat_rdt_result}' AS repeat_rdt_result,
    NULLIF(doc#>>'{fields, group_summary, given_al}', '')::BOOLEAN AS given_al,
    doc#>>'{fields, group_tb, tb_symptoms}' AS tb_symptoms,
    NULLIF(doc#>>'{fields, needs_tb_referral}', '')::BOOLEAN AS is_referred_tb,
    doc#>>'{contact, _id}' AS reported_by,
    doc#>>'{contact, parent, _id}' AS reported_by_parent,
    doc#>>'{contact, parent, parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc->>'form' = 'over_five_assessment'
);
CREATE UNIQUE INDEX IF NOT EXISTS useview_over_five_assessment_uuid ON useview_over_five_assessment USING btree(uuid);
CREATE INDEX IF NOT EXISTS useview_over_five_assessment_patient_id ON useview_over_five_assessment USING btree(patient_id);
CREATE INDEX IF NOT EXISTS useview_over_five_assessment_reported ON useview_over_five_assessment USING btree(reported);
CREATE INDEX IF NOT EXISTS useview_over_five_assessment_reported_by_parent ON useview_over_five_assessment USING btree(reported_by_parent);
CREATE INDEX IF NOT EXISTS useview_over_five_assessment_has_fever ON useview_over_five_assessment USING btree(has_fever);
CREATE INDEX IF NOT EXISTS useview_over_five_assessment_fever_duration ON useview_over_five_assessment USING btree(fever_duration);
SELECT deps_restore_dependencies('public', 'useview_over_five_assessment');

------------------------------------------------------------
----------------useview_over_five_assessment
------------------------------------------------------------
SELECT deps_save_and_drop_dependencies('public', 'useview_over_five_assessment');
DROP MATERIALIZED VIEW IF EXISTS useview_over_five_assessment;
CREATE MATERIALIZED VIEW useview_over_five_assessment AS
(
  SELECT 
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    (doc#>>'{fields, patient_age_in_years}')::INT AS patient_age_in_years,
    doc#>>'{fields, patient_uuid}' AS patient_id,
    CASE
      WHEN
        doc#>>'{fields, group_diabetes, is_on_diabetes_medication}' = 'no'
      THEN TRUE
      ELSE FALSE
    END AS is_referred_diabetes,
    CASE
      WHEN
        doc#>>'{fields, group_hypertension, is_on_hypertension_medication}' = 'no'
      THEN TRUE
      ELSE FALSE
    END AS is_referred_hypertension,
    NULLIF(doc#>>'{fields, needs_mental_health_referral}', '')::BOOLEAN AS is_referred_mental_health,
    NULLIF(doc#>>'{fields, group_fever, has_fever}', '')::BOOLEAN AS has_fever,
    NULLIF(doc#>>'{fields, group_fever, fever_duration}', '')::INT AS fever_duration,
    doc#>>'{fields, group_malaria, rdt_result}' AS rdt_result,
    doc#>>'{fields, group_malaria, repeat_rdt_result}' AS repeat_rdt_result,
    NULLIF(doc#>>'{fields, group_summary, given_al}', '')::BOOLEAN AS given_al,
    doc#>>'{fields, group_tb, tb_symptoms}' AS tb_symptoms,
    NULLIF(doc#>>'{fields, needs_tb_referral}', '')::BOOLEAN AS is_referred_tb,
    doc#>>'{contact, _id}' AS reported_by,
    doc#>>'{contact, parent, _id}' AS reported_by_parent,
    doc#>>'{contact, parent, parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc->>'form' = 'over_five_assessment'
);
CREATE UNIQUE INDEX IF NOT EXISTS useview_over_five_assessment_uuid ON useview_over_five_assessment USING btree(uuid);
CREATE INDEX IF NOT EXISTS useview_over_five_assessment_patient_id ON useview_over_five_assessment USING btree(patient_id);
CREATE INDEX IF NOT EXISTS useview_over_five_assessment_reported ON useview_over_five_assessment USING btree(reported);
CREATE INDEX IF NOT EXISTS useview_over_five_assessment_reported_by_parent ON useview_over_five_assessment USING btree(reported_by_parent);
CREATE INDEX IF NOT EXISTS useview_over_five_assessment_has_fever ON useview_over_five_assessment USING btree(has_fever);
CREATE INDEX IF NOT EXISTS useview_over_five_assessment_fever_duration ON useview_over_five_assessment USING btree(fever_duration);
SELECT deps_restore_dependencies('public', 'useview_over_five_assessment');

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


------------------------------------------------------------
----------------useview_family_planning
------------------------------------------------------------
SELECT deps_save_and_drop_dependencies('public', 'useview_family_planning');
DROP MATERIALIZED VIEW IF EXISTS useview_family_planning;
CREATE MATERIALIZED VIEW useview_family_planning AS
(
  SELECT
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc ->> 'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc#>>'{fields, patient_id}' AS patient_id,
    (doc#>>'{fields, patient_age_in_years}')::INT AS patient_age_in_years,
    CASE
      WHEN doc#>>'{fields, referral_summary, referred_for_refills}' = 'yes' OR doc#>>'{fields, referral_summary, referred_for_fp_services}' = 'yes'
      THEN TRUE
      ELSE FALSE
    END AS is_referred_for_fp_services,
    CASE
      WHEN doc#>>'{fields, family_planning, is_on_fp}' = 'no' AND doc#>>'{fields, family_planning, is_pregnant}' = 'no'
      THEN TRUE
      ELSE FALSE
    END AS is_counselled_on_fp_services,
    NULLIF(doc#>>'{fields, family_planning, refilled_today}', '')::BOOLEAN AS is_provided_fp_commodities,
    doc#>>'{contact, _id}' AS reported_by,
    doc#>>'{contact, parent, _id}' AS reported_by_parent,
    doc#>>'{contact, parent, parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc->>'form' = 'family_planning'

  UNION ALL

  SELECT
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc ->> 'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc->>'_id' AS patient_id,
    (doc->>'age_in_years')::INT AS patient_age_in_years,
    NULL AS is_referred_for_fp_services,
    doc->>'using_fp' = 'no' AS is_counselled_on_fp_services,
    NULL AS is_provided_fp_commodities,
    doc#>>'{meta, created_by_person_uuid}' AS reported_by,
    doc#>>'{meta, created_by_place_uuid}' AS reported_by_parent,
    doc#>>'{parent, parent, parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc->>'contact_type' = 'f_client'
    AND doc->>'pregnant' = 'no'
);

CREATE UNIQUE INDEX IF NOT EXISTS useview_family_planning_uuid ON useview_family_planning USING btree(uuid);
CREATE INDEX IF NOT EXISTS useview_family_planning_reported ON useview_family_planning USING btree(reported);
CREATE INDEX IF NOT EXISTS useview_family_planning_patient_id ON useview_family_planning USING btree(patient_id);
CREATE INDEX IF NOT EXISTS useview_family_planning_reported_by_parent ON useview_family_planning USING btree(reported_by_parent);
CREATE INDEX IF NOT EXISTS useview_family_planning_patient_age_in_years ON useview_family_planning USING btree(patient_age_in_years);
SELECT deps_restore_dependencies('public', 'useview_family_planning');


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


------------------------------------------------------------
----------------useview_immunization
------------------------------------------------------------
SELECT deps_save_and_drop_dependencies('public', 'useview_immunization');
DROP MATERIALIZED VIEW IF EXISTS useview_immunization;
CREATE MATERIALIZED VIEW useview_immunization AS
(
  SELECT
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc#>>'{fields, patient_id}' AS patient_id,
    (doc#>>'{fields, patient_age_in_years}')::INT AS patient_age_in_years,
    (doc#>>'{fields, patient_age_in_months}')::INT AS patient_age_in_months,
    NULLIF(doc#>>'{fields, group_summary, r_child_dewormed}', '')::BOOLEAN AS is_dewormed,
    doc#>>'{fields, group_vitamin_a, vitamin_a_doses_given}' IN ('none', 'no') AS is_referred_vitamin_a,
    NULLIF(doc#>>'{fields, needs_immunization_follow_up}', '')::BOOLEAN AS is_referred_immunization,
    NULLIF(doc#>>'{fields, needs_growth_monitoring_follow_up}', '')::BOOLEAN AS is_referred_growth_monitoring,
    doc#>>'{contact, _id}' AS reported_by,
    doc#>>'{contact, parent, _id}' AS reported_by_parent,
    doc#>>'{contact, parent, parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc->>'form' = 'immunization_service'
    AND doc#>>'{fields, inputs, contact, date_of_birth}' <> ''

  UNION ALL

  SELECT 
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc#>>'{fields, patient_id}' AS patient_id,
    (doc#>>'{fields, patient_age_in_years}')::INT AS patient_age_in_years,
    (doc#>>'{fields, patient_age_in_months}')::INT AS patient_age_in_months,
    NULLIF(doc#>>'{fields, group_summary_no_danger_signs, r_dewormed_child}', '')::BOOLEAN AS is_dewormed,
    doc#>>'{fields, vit_a_group, vit_a_received}' IN ('none', 'no') AS is_referred_vitamin_a,
    NULLIF(doc#>>'{fields, needs_immunization_referral}', '')::BOOLEAN AS is_referred_immunization,
    NULLIF(doc#>>'{fields, needs_growth_monitoring_referral}', '')::BOOLEAN AS is_referred_growth_monitoring,
    doc#>>'{contact,_id}' AS reported_by,
    doc#>>'{contact,parent,_id}' AS reported_by_parent,
    doc#>>'{contact,parent,parent,_id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc->>'form' = 'u5_assessment'

  UNION ALL

  SELECT
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc#>>'{fields, patient_id}' AS patient_id,
    (doc#>>'{fields, patient_age_in_years}')::INT AS patient_age_in_years,
    (doc#>>'{fields, patient_age_in_months}')::INT AS patient_age_in_months,
    NULL AS is_dewormed,
    NULL AS is_referred_vitamin_a,
    NULLIF(doc#>>'{fields, needs_immunization_follow_up}', '')::BOOLEAN AS is_referred_for_immunization,
    NULL AS is_referred_growth_monitoring,
    doc#>>'{contact, _id}' AS reported_by,
    doc#>>'{contact, parent, _id}' AS reported_by_parent,
    doc#>>'{contact, parent, parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc ->> 'form' = 'postnatal_care_service_newborn'

  UNION ALL

  SELECT
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc->>'_id'::TEXT AS patient_id,
    (doc->>'age_in_years')::INT AS patient_age_in_years,
    (doc->>'age_in_months')::INT AS patient_age_in_months,
    NULL AS is_dewormed,
    NULL AS is_referred_vitamin_a,
    CASE
      WHEN doc->>'needs_immunization_follow_up' = 'yes' OR doc->>'imm_upto_date' = 'no'
      THEN TRUE
      ELSE FALSE
    END AS is_referred_for_immunization,
    NULL AS is_referred_growth_monitoring,
    doc#>>'{meta, created_by_person_uuid}' AS reported_by,
    doc#>>'{meta, created_by_place_uuid}' AS reported_by_parent,
    doc#>>'{parent, parent, parent, _id}' AS reported_by_parent_parent
  FROM
    couchdb
  WHERE
    doc->>'contact_type' = 'f_client'
    AND (doc->>'created_by_doc' <> '' OR NULLIF(doc->>'age_in_months', '')::INTEGER <= 60)
);

CREATE UNIQUE INDEX IF NOT EXISTS useview_immunization_uuid ON useview_immunization USING btree(uuid);
CREATE INDEX IF NOT EXISTS useview_immunization_patient_id ON useview_immunization USING btree(patient_id);
CREATE INDEX IF NOT EXISTS useview_immunization_reported_by_parent ON useview_immunization USING btree(reported_by_parent);
CREATE INDEX IF NOT EXISTS useview_immunization_reported ON useview_immunization USING btree(reported);
CREATE INDEX IF NOT EXISTS useview_immunization_patient_age_in_months ON useview_immunization USING btree(patient_age_in_months);
SELECT deps_restore_dependencies('public', 'useview_immunization');

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


------------------------------------------------------------
----------------useview_pregnancy_home_visit
------------------------------------------------------------
SELECT deps_save_and_drop_dependencies('public', 'useview_pregnancy_home_visit');
DROP MATERIALIZED VIEW IF EXISTS useview_pregnancy_home_visit cascade;
CREATE MATERIALIZED VIEW useview_pregnancy_home_visit AS
(
  SELECT
    doc->>'_id' AS uuid,
    to_timestamp((NULLIF(doc->>'reported_date', '')::BIGINT / 1000)::DOUBLE PRECISION) AS reported,
    doc#>>'{fields, patient_id}' AS patient_id,
    (doc#>>'{fields, patient_age_in_years}')::INT AS patient_age_in_years,
    NULLIF(doc#>>'{fields, has_been_referred}', '')::BOOLEAN AS has_been_referred,
    NULLIF(doc#>>'{fields, marked_as_pregnant}', '')::BOOLEAN AS is_new_pregnancy,
    NULLIF(doc#>>'{fields, currently_pregnant}', '')::BOOLEAN AS is_currently_pregnant,
    NULLIF(doc#>>'{fields, anc_visits, has_started_anc}', '')::BOOLEAN AS is_counselled_anc,
    doc#>>'{contact, _id}' AS reported_by,
    doc#>>'{contact, parent, _id}' AS reported_by_parent,
    doc#>>'{contact, parent, parent, _id}' AS reported_by_parent_parent   
  FROM
    couchdb
  WHERE
    doc->>'form' = 'pregnancy_home_visit'
);

CREATE UNIQUE INDEX IF NOT EXISTS useview_pregnancy_home_visit_uuid ON useview_pregnancy_home_visit USING btree (uuid);
CREATE INDEX IF NOT EXISTS useview_pregnancy_home_visit_patient_id ON useview_pregnancy_home_visit USING btree (patient_id);
CREATE INDEX IF NOT EXISTS useview_pregnancy_home_visit_reported_by_parent ON useview_pregnancy_home_visit USING btree (reported_by_parent);
CREATE INDEX IF NOT EXISTS useview_pregnancy_home_visit_reported ON useview_pregnancy_home_visit USING btree (reported);
CREATE INDEX IF NOT EXISTS useview_pregnancy_home_visit_patient_age_in_years ON useview_pregnancy_home_visit USING btree (patient_age_in_years);
SELECT deps_restore_dependencies('public', 'useview_pregnancy_home_visit');


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


------------------------------------------------------------
----------------get_moh_515_community_events_data(TEXT,TEXT,TEXT,BOOLEAN,BOOLEAN)
------------------------------------------------------------
DROP FUNCTION IF EXISTS get_moh_515_community_events_data(TEXT,TEXT,TEXT,BOOLEAN,BOOLEAN,BOOLEAN);

CREATE OR REPLACE FUNCTION get_moh_515_community_events_data
(
  param_facility_group_by TEXT,
  param_num_units TEXT DEFAULT '12',
  param_interval_unit TEXT DEFAULT 'months',
  param_include_current BOOLEAN DEFAULT 'true',
  single_interval BOOLEAN DEFAULT 'false'
)
RETURNS TABLE(
  chu_uuid TEXT,
  chu_code TEXT,
  chu_name TEXT,
  period_start DATE,
  period TEXT,
  period_start_epoch NUMERIC,
  facility_join_field TEXT,
  count_community_dialogue_days NUMERIC,
  count_community_action_days NUMERIC,
  count_community_monthly_meetings NUMERIC
) AS

$BODY$

WITH period_CTE AS
(
  SELECT generate_series(
    date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval), 
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)
      ELSE                  
        CASE
            WHEN param_include_current 
            THEN now() 
            ELSE now() - ('1 ' || param_interval_unit)::interval
        END
    END,            
    ('1 '||param_interval_unit)::interval
  )::DATE AS start
)

SELECT

  CASE
    WHEN param_facility_group_by = 'chu'
    THEN place_period.chu_uuid
    ELSE 'All'
  END AS _chu_uuid,
  CASE
    WHEN param_facility_group_by = 'chu'
    THEN place_period.chu_code
    ELSE 'All'
  END AS _chu_code,
  CASE
    WHEN param_facility_group_by = 'chu'
    THEN place_period.chu_name
    ELSE 'All'
  END AS _chu_name,
  place_period.period_start AS _period_start,
  concat(date_part('year', place_period.period_start)::TEXT, lpad(date_part('month', place_period.period_start)::TEXT,2,'0')) AS period,
  date_part('epoch',place_period.period_start)::NUMERIC AS _period_start_epoch,
  CASE
    WHEN param_facility_group_by = 'chu'
      THEN place_period.chu_uuid
    ELSE 'All'
  END AS _facility_join_field,
  
  SUM(COALESCE(community_events.count_community_dialogue_days, 0)) AS count_community_dialogue_days,
  SUM(COALESCE(community_events.count_community_action_days, 0)) AS count_community_action_days,
  SUM(COALESCE(community_events.count_community_monthly_meetings, 0)) AS count_community_monthly_meetings
FROM
  (
    SELECT
      chu_uuid,
      chu_code,
      chu_name,
      period_CTE.start AS period_start
    FROM
      period_CTE,
      chv_hierarchy
    GROUP BY
      chu_uuid,
      chu_code,
      chu_name,
      period_CTE.start
    
  ) AS place_period

LEFT JOIN
  (
  SELECT
    place_id,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, event_date)::DATE
    END AS reported_month,
    COUNT(uuid) FILTER ( WHERE event_types ~ 'community_dialogue' ) AS count_community_dialogue_days,
    COUNT(uuid) FILTER ( WHERE event_types ~ 'community_action_days' ) AS count_community_action_days,
    COUNT(uuid) FILTER ( WHERE event_types ~ 'monthly_cu_meetings' ) AS count_community_monthly_meetings
  FROM
    useview_community_events
  WHERE
    event_date >= (date_trunc(param_interval_unit,now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    place_id
  ) AS community_events
ON (place_period.period_start = community_events.reported_month
AND place_period.chu_uuid = community_events.place_id)

GROUP BY 
    _chu_uuid,
    _chu_code,
    _chu_name,
    _period_start,
    _facility_join_field
ORDER BY
    _chu_uuid,
    _chu_code,
    _chu_name,
    _period_start
$BODY$
LANGUAGE 'sql' STABLE;


------------------------------------------------------------
----------------get_moh_515_data(TEXT,TEXT,TEXT,BOOLEAN,BOOLEAN)
------------------------------------------------------------
DROP FUNCTION IF EXISTS get_moh_515_data(TEXT,TEXT,TEXT,BOOLEAN,BOOLEAN);

CREATE OR REPLACE FUNCTION get_moh_515_data
(
  param_facility_group_by TEXT,
  param_num_units TEXT DEFAULT '12',
  param_interval_unit TEXT DEFAULT 'months',
  param_include_current BOOLEAN DEFAULT 'false',
  single_interval BOOLEAN DEFAULT 'false'
)
RETURNS TABLE(
  chu_uuid TEXT,
  chu_code TEXT,
  chu_name TEXT,
  chv_area_uuid TEXT,
  chv_area_name TEXT,
  period_start DATE,
  period TEXT,
  period_start_epoch NUMERIC,
  facility_join_field TEXT,
  count_new_households_visited_safe_water_new_visit NUMERIC,
  count_households_hand_washing_facilities_new_visit NUMERIC,
  count_households_functional_latrines_new_visit NUMERIC,
  count_newborns_within_48_hours_of_delivery NUMERIC,
  count_children_12_59_months_dewormed NUMERIC,
  count_pregnant_women_referred_to_health_facility NUMERIC,
  count_new_deliveries_at_health_facility NUMERIC,
  count_children_0_11_months_referred_immunization NUMERIC,
  count_persons_referred_hts NUMERIC,
  count_persons_referred_comprehensive_geriatric_services NUMERIC,
  count_persons_referred_diabetes NUMERIC,
  count_persons_referred_cancer NUMERIC,
  count_persons_referred_mental_illness NUMERIC,
  count_persons_referred_hypertension NUMERIC,
  count_defaulters_immunization_referred NUMERIC,
  count_deaths_12_59_months NUMERIC,
  count_deaths_maternal NUMERIC,
  count_households_visited_new_visit NUMERIC,
  count_households_visited_revisit NUMERIC,
  count_households_new_visit_upto_date_insurance NUMERIC,
  count_households_new_visit_upto_date_insurance_uhc NUMERIC,
  count_households_new_visit_upto_date_insurance_nhif NUMERIC,
  count_households_new_visit_upto_date_insurance_others NUMERIC,
  count_households_new_visit_refuse_disposal NUMERIC,
  count_women_15_49_years_counselled_fp NUMERIC,
  count_women_15_49_years_provided_fp NUMERIC,
  count_women_15_49_years_referred_fp NUMERIC,
  count_women_pregnant NUMERIC,
  count_women_pregnant_underage NUMERIC,
  count_women_pregnant_counselled_anc NUMERIC,
  count_new_deliveries NUMERIC,
  count_new_deliveries_at_home NUMERIC,
  count_new_deliveries_underage NUMERIC,
  count_new_mothers_visited_within_48_hours_of_delivery NUMERIC,
  count_new_deliveries_at_home_referred_pnc NUMERIC,
  count_children_6_59_months_malnutrition_severe NUMERIC,
  count_children_6_59_months_malnutrition_moderate NUMERIC,
  count_children_6_59_months_referred_vitamin_a NUMERIC,
  count_children_0_59_months_referred_delayed_milestones NUMERIC,
  count_defaulters_art_referred NUMERIC,
  count_defaulters_hei_referred NUMERIC,
  count_defaulters_art_traced_referred NUMERIC,
  count_defaulters_hei_traced_referred NUMERIC,
  count_persons_screened_tb NUMERIC,
  count_persons_presumptive_tb_referred NUMERIC,
  count_persons_presumptive_tb_referred_confirmed NUMERIC,
  count_persons_presumptive_tb_referred_confirmed_referred NUMERIC,
  count_cases_tb_confirmed_0_59_months NUMERIC,
  count_treatment_interruptors_tb NUMERIC,
  count_treatment_interrupters_tb_traced NUMERIC,
  count_women_15_49_years_referred_fp_completed NUMERIC,
  count_women_pregnant_referred_anc_completed NUMERIC,
  count_women_referred_pnc_completed NUMERIC,
  count_defaulters_immunization_referred_completed NUMERIC,
  count_persons_referred_hts_completed NUMERIC,
  count_defaulters_art_referred_completed NUMERIC,
  count_defaulters_hei_referred_completed NUMERIC,
  count_routine_checkup_referred_completed NUMERIC,
  count_persons_presumptive_tb_referred_completed NUMERIC,
  count_persons_presumptive_tb_contacts_referred_completed NUMERIC,
  count_cases_tb_0_59_months_ipt_referred_completed NUMERIC,
  count_treatment_interruptors_tb_referred_completed NUMERIC,
  count_cases_0_59_months_fever_lt_7_days NUMERIC,
  count_cases_0_59_months_fever_lt_7_days_rdt NUMERIC,
  count_cases_0_59_months_fever_lt_7_days_rdt_positive NUMERIC,
  count_cases_0_59_months_fever_lt_7_days_rdt_positive_act NUMERIC,
  count_cases_2_59_months_fast_breathing NUMERIC,
  count_cases_2_59_months_fast_breathing_amoxycillin NUMERIC,
  count_cases_2_59_months_diarrhea NUMERIC,
  count_cases_2_59_months_diarrhea_zinc_ors NUMERIC,
  count_cases_gte_60_months_fever_lt_7_days NUMERIC,
  count_cases_gte_60_months_fever_lt_7_days_rdt NUMERIC,
  count_cases_gte_60_months_fever_lt_7_days_rdt_positive NUMERIC,
  count_cases_gte_60_months_fever_lt_7_days_rdt_positive_act NUMERIC,
  count_deaths_0_28_days NUMERIC,
  count_deaths_29_days_11_months NUMERIC,
  count_deaths_6_59_years NUMERIC,
  count_deaths_gt_60_years NUMERIC,
  count_households NUMERIC
) AS

$BODY$

WITH period_CTE AS
(
  SELECT generate_series(
    date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval), 
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)
      ELSE                  
        CASE
            WHEN param_include_current 
            THEN now() 
            ELSE now() - ('1 ' || param_interval_unit)::interval
        END
    END,            
    ('1 '||param_interval_unit)::interval
  )::DATE AS start
)

SELECT

  CASE
    WHEN param_facility_group_by = 'chv_area' OR param_facility_group_by = 'chu'
    THEN place_period.chu_uuid
    ELSE 'All'
  END AS _chu_uuid,
  CASE
    WHEN param_facility_group_by = 'chv_area' OR param_facility_group_by = 'chu'
    THEN place_period.chu_code
    ELSE 'All'
  END AS _chu_code,
  CASE
    WHEN param_facility_group_by = 'chv_area' OR param_facility_group_by = 'chu'
    THEN place_period.chu_name
    ELSE 'All'
  END AS _chu_name,
  CASE
    WHEN param_facility_group_by = 'chv_area'
    THEN place_period.chv_area_uuid
    ELSE 'All'
  END AS _chv_area_uuid,
  CASE
    WHEN param_facility_group_by = 'chv_area'
    THEN place_period.chv_area_name
    ELSE 'All'
  END AS _chv_area_name,
  place_period.period_start AS _period_start,
  concat(date_part('year', place_period.period_start)::TEXT, lpad(date_part('month', place_period.period_start)::TEXT,2,'0')) AS period,
  date_part('epoch',place_period.period_start)::NUMERIC AS _period_start_epoch,
  CASE
    WHEN param_facility_group_by = 'chv_area'
      THEN place_period.chv_area_uuid
    WHEN param_facility_group_by = 'chu'
      THEN place_period.chu_uuid
    ELSE 'All'
  END AS _facility_join_field,
  
  /* Start retrieving all counts/percents */
  SUM(COALESCE(wash_and_insurance.count_new_households_visited_safe_water_new_visit, 0)) AS count_new_households_visited_safe_water_new_visit,
  SUM(COALESCE(wash_and_insurance.count_households_hand_washing_facilities_new_visit, 0)) AS count_households_hand_washing_facilities_new_visit,
  SUM(COALESCE(wash_and_insurance.count_households_functional_latrines_new_visit, 0)) AS count_households_functional_latrines_new_visit,
  SUM(COALESCE(newborns.count_newborns_within_48_hours_of_delivery, 0)) AS count_newborns_within_48_hours_of_delivery,
  SUM(COALESCE(immunization.count_children_12_59_months_dewormed, 0)) AS count_children_12_59_months_dewormed,
  SUM(COALESCE(pregnancy_home_visit.count_pregnant_women_referred_to_health_facility, 0)) AS count_pregnant_women_referred_to_health_facility,
  SUM(COALESCE(postnatal_care_service.count_new_deliveries_at_health_facility, 0)) AS count_new_deliveries_at_health_facility,
  SUM(COALESCE(immunization.count_children_0_11_months_referred_immunization, 0)) AS count_children_0_11_months_referred_immunization,
  SUM(COALESCE(over_five_assessment.count_persons_referred_hts, 0)) AS count_persons_referred_hts,
  SUM(COALESCE(over_five_assessment.count_persons_referred_comprehensive_geriatric_services, 0)) AS count_persons_referred_comprehensive_geriatric_services,
  SUM(COALESCE(over_five_assessment.count_persons_referred_diabetes, 0)) AS count_persons_referred_diabetes,
  SUM(COALESCE(over_five_assessment.count_persons_referred_cancer, 0)) AS count_persons_referred_cancer,
  SUM(COALESCE(over_five_assessment.count_persons_referred_mental_illness, 0)) AS count_persons_referred_mental_illness,
  SUM(COALESCE(over_five_assessment.count_persons_referred_hypertension, 0)) AS count_persons_referred_hypertension,
  SUM(COALESCE(defaulter_follow_up.count_defaulters_immunization_referred, 0)) AS count_defaulters_immunization_referred,
  SUM(COALESCE(deaths.count_deaths_12_59_months, 0)) AS count_deaths_12_59_months,
  SUM(COALESCE(deaths.count_deaths_maternal, 0)) AS count_deaths_maternal,
  SUM(COALESCE(wash_and_insurance.count_households_visited_new_visit, 0)) AS count_households_visited_new_visit,
  SUM(COALESCE(household_visit.count_households_visited_revisit, 0)) AS count_households_visited_revisit,
  SUM(COALESCE(wash_and_insurance.count_households_new_visit_upto_date_insurance, 0)) AS count_households_new_visit_upto_date_insurance,
  SUM(COALESCE(wash_and_insurance.count_households_new_visit_upto_date_insurance_uhc, 0)) AS count_households_new_visit_upto_date_insurance_uhc,
  SUM(COALESCE(wash_and_insurance.count_households_new_visit_upto_date_insurance_nhif, 0)) AS count_households_new_visit_upto_date_insurance_nhif,
  SUM(COALESCE(wash_and_insurance.count_households_new_visit_upto_date_insurance_others, 0)) AS count_households_new_visit_upto_date_insurance_others,
  SUM(COALESCE(wash_and_insurance.count_households_new_visit_refuse_disposal, 0)) AS count_households_new_visit_refuse_disposal,
  SUM(COALESCE(family_planning.count_women_15_49_years_counselled_fp, 0)) AS count_women_15_49_years_counselled_fp,
  SUM(COALESCE(family_planning.count_women_15_49_years_provided_fp, 0)) AS count_women_15_49_years_provided_fp,
  SUM(COALESCE(family_planning.count_women_15_49_years_referred_fp, 0)) AS count_women_15_49_years_referred_fp,
  SUM(COALESCE(pregnancy_home_visit.count_women_pregnant, 0)) AS count_women_pregnant,
  SUM(COALESCE(pregnancy_home_visit.count_women_pregnant_underage, 0)) AS count_women_pregnant_underage,
  SUM(COALESCE(pregnancy_home_visit.count_women_pregnant_counselled_anc, 0)) AS count_women_pregnant_counselled_anc,
  SUM(COALESCE(postnatal_care_service.count_new_deliveries, 0)) AS count_new_deliveries,
  SUM(COALESCE(postnatal_care_service.count_new_deliveries_at_home, 0)) AS count_new_deliveries_at_home,
  SUM(COALESCE(postnatal_care_service.count_new_deliveries_underage, 0)) AS count_new_deliveries_underage,
  SUM(COALESCE(postnatal_care_service.count_new_mothers_visited_within_48_hours_of_delivery, 0)) AS count_new_mothers_visited_within_48_hours_of_delivery,
  SUM(COALESCE(postnatal_care_service.count_new_deliveries_at_home_referred_pnc, 0)) AS count_new_deliveries_at_home_referred_pnc,
  SUM(COALESCE(under_five_assessment.count_children_6_59_months_malnutrition_severe, 0)) AS count_children_6_59_months_malnutrition_severe,
  SUM(COALESCE(under_five_assessment.count_children_6_59_months_malnutrition_moderate, 0)) AS count_children_6_59_months_malnutrition_moderate,
  SUM(COALESCE(immunization.count_children_6_59_months_referred_vitamin_a, 0)) AS count_children_6_59_months_referred_vitamin_a,
  SUM(COALESCE(immunization.count_children_0_59_months_referred_delayed_milestones, 0)) AS count_children_0_59_months_referred_delayed_milestones,
  0 AS count_defaulters_art_referred,
  0 AS count_defaulters_hei_referred,
  SUM(COALESCE(defaulter_follow_up.count_defaulters_art_traced_referred, 0)) AS count_defaulters_art_traced_referred,
  SUM(COALESCE(defaulter_follow_up.count_defaulters_hei_traced_referred, 0)) AS count_defaulters_hei_traced_referred,
  SUM(COALESCE(over_five_assessment.count_persons_screened_tb, 0)) AS count_persons_screened_tb,
  SUM(COALESCE(over_five_assessment.count_persons_presumptive_tb_referred, 0)) AS count_persons_presumptive_tb_referred,
  0 AS count_persons_presumptive_tb_referred_confirmed,
  0 AS count_persons_presumptive_tb_referred_confirmed_referred,
  0 AS count_cases_tb_confirmed_0_59_months,
  0 AS count_treatment_interruptors_tb,
  SUM(COALESCE(defaulter_follow_up.count_treatment_interrupters_tb_traced, 0)) AS count_treatment_interrupters_tb_traced,
  SUM(COALESCE(referral_follow_up.count_women_15_49_years_referred_fp_completed, 0)) AS count_women_15_49_years_referred_fp_completed,
  SUM(COALESCE(referral_follow_up.count_women_pregnant_referred_anc_completed, 0)) AS count_women_pregnant_referred_anc_completed,
  SUM(COALESCE(referral_follow_up.count_women_referred_pnc_completed, 0)) AS count_women_referred_pnc_completed,
  SUM(COALESCE(referral_follow_up.count_defaulters_immunization_referred_completed, 0)) AS count_defaulters_immunization_referred_completed,
  0 AS count_persons_referred_hts_completed,
  SUM(COALESCE(referral_follow_up.count_defaulters_art_referred_completed, 0)) AS count_defaulters_art_referred_completed,
  SUM(COALESCE(referral_follow_up.count_defaulters_hei_referred_completed, 0)) AS count_defaulters_hei_referred_completed,
  0 AS count_routine_checkup_referred_completed,
  SUM(COALESCE(referral_follow_up.count_persons_presumptive_tb_referred_completed, 0)) AS count_persons_presumptive_tb_referred_completed,
  SUM(COALESCE(referral_follow_up.count_persons_presumptive_tb_contacts_referred_completed, 0)) AS count_persons_presumptive_tb_contacts_referred_completed,
  SUM(COALESCE(under_five_assessment.count_cases_tb_0_59_months_ipt_referred_completed, 0)) AS count_cases_tb_0_59_months_ipt_referred_completed,
  SUM(COALESCE(referral_follow_up.count_treatment_interruptors_tb_referred_completed, 0)) AS count_treatment_interruptors_tb_referred_completed,
  SUM(COALESCE(under_five_assessment.count_cases_0_59_months_fever_lt_7_days, 0)) AS count_cases_0_59_months_fever_lt_7_days,
  SUM(COALESCE(under_five_assessment.count_cases_0_59_months_fever_lt_7_days_rdt, 0)) AS count_cases_0_59_months_fever_lt_7_days_rdt,
  SUM(COALESCE(under_five_assessment.count_cases_0_59_months_fever_lt_7_days_rdt_positive, 0)) AS count_cases_0_59_months_fever_lt_7_days_rdt_positive,
  SUM(COALESCE(under_five_assessment.count_cases_0_59_months_fever_lt_7_days_rdt_positive_act, 0)) AS count_cases_0_59_months_fever_lt_7_days_rdt_positive_act,
  SUM(COALESCE(under_five_assessment.count_cases_2_59_months_fast_breathing, 0)) AS count_cases_2_59_months_fast_breathing,
  SUM(COALESCE(under_five_assessment.count_cases_2_59_months_fast_breathing_amoxycillin, 0)) AS count_cases_2_59_months_fast_breathing_amoxycillin,
  SUM(COALESCE(under_five_assessment.count_cases_2_59_months_diarrhea, 0)) AS count_cases_2_59_months_diarrhea,
  SUM(COALESCE(under_five_assessment.count_cases_2_59_months_diarrhea_zinc_ors, 0)) AS count_cases_2_59_months_diarrhea_zinc_ors,
  SUM(COALESCE(over_five_assessment.count_cases_gte_60_months_fever_lt_7_days, 0)) AS count_cases_gte_60_months_fever_lt_7_days,
  SUM(COALESCE(over_five_assessment.count_cases_gte_60_months_fever_lt_7_days_rdt, 0)) AS count_cases_gte_60_months_fever_lt_7_days_rdt,
  SUM(COALESCE(over_five_assessment.count_cases_gte_60_months_fever_lt_7_days_rdt_positive, 0)) AS count_cases_gte_60_months_fever_lt_7_days_rdt_positive,
  SUM(COALESCE(over_five_assessment.count_cases_gte_60_months_fever_lt_7_days_rdt_positive_act, 0)) AS count_cases_gte_60_months_fever_lt_7_days_rdt_positive_act,
  SUM(COALESCE(deaths.count_deaths_0_28_days, 0)) AS count_deaths_0_28_days,
  SUM(COALESCE(deaths.count_deaths_29_days_11_months, 0)) AS count_deaths_29_days_11_months,
  SUM(COALESCE(deaths.count_deaths_6_59_years, 0)) AS count_deaths_6_59_years,
  SUM(COALESCE(deaths.count_deaths_gt_60_years, 0)) AS count_deaths_gt_60_years,
  SUM(COALESCE(households.count_households, 0)) AS count_households
  /* End retrieval */
FROM /*combination of hierarchy level and time-periods we are grouping by (last 12 mo by default, by branch)*/
  (
    SELECT
      chu_uuid,
      chu_code,
      chu_name,
      chv_area_uuid,
      chv_area_name,
      period_CTE.start AS period_start
    FROM
      period_CTE,
      chv_hierarchy
    GROUP BY
      chu_uuid,
      chu_code,
      chu_name,
      chv_area_uuid,
      chv_area_name,
      period_CTE.start
    
  ) AS place_period

LEFT JOIN /* Death Information metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    COUNT(patient_id) FILTER ( WHERE patient_age_in_days < 28 ) AS count_deaths_0_28_days,
    COUNT(patient_id) FILTER ( WHERE patient_age_in_days >= 28 AND patient_age_in_months < 12 ) AS count_deaths_29_days_11_months,
    COUNT(patient_id) FILTER ( WHERE patient_age_in_months BETWEEN 12 AND 60 ) AS count_deaths_12_59_months,
    COUNT(patient_id) FILTER ( WHERE death_type = 'maternal' ) AS count_deaths_maternal,
    COUNT(patient_id) FILTER ( WHERE patient_age_in_years > 5 AND patient_age_in_years < 60 AND death_type <> 'maternal' ) AS count_deaths_6_59_years,
    COUNT(patient_id) FILTER ( WHERE patient_age_in_years > 60 ) AS count_deaths_gt_60_years,
    COUNT(patient_id) AS count_death
  FROM
    useview_death
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS deaths
ON (place_period.period_start = deaths.reported_month
AND place_period.chv_area_uuid = deaths.reported_by_parent)

LEFT JOIN /* Household Information metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    COUNT(DISTINCT place_id) FILTER ( WHERE has_access_to_safe_water IS TRUE AND is_new_visit IS TRUE ) AS count_new_households_visited_safe_water_new_visit,
    COUNT(DISTINCT place_id) FILTER ( WHERE has_functional_handwashing_facility IS TRUE AND is_new_visit IS TRUE ) AS count_households_hand_washing_facilities_new_visit,
    COUNT(DISTINCT place_id) FILTER ( WHERE has_functional_latrine IS TRUE AND is_new_visit IS TRUE ) AS count_households_functional_latrines_new_visit,            
    COUNT(DISTINCT place_id) FILTER ( WHERE is_new_visit IS TRUE ) AS count_households_visited_new_visit,
    COUNT(DISTINCT place_id) FILTER ( WHERE has_upto_date_insurance_cover IS TRUE AND is_new_visit IS TRUE ) AS count_households_new_visit_upto_date_insurance,
    0 AS count_households_new_visit_upto_date_insurance_uhc,
    COUNT(DISTINCT place_id) FILTER ( WHERE specific_insurance_cover ~ 'nhif' AND is_new_visit IS TRUE ) AS count_households_new_visit_upto_date_insurance_nhif,
    COUNT(DISTINCT place_id) FILTER ( WHERE specific_insurance_cover ~ 'other' AND is_new_visit IS TRUE ) AS count_households_new_visit_upto_date_insurance_others,
    COUNT(DISTINCT place_id) FILTER ( WHERE has_functional_refuse_disposal_facility IS TRUE AND is_new_visit IS TRUE ) AS count_households_new_visit_refuse_disposal
  FROM
    useview_wash_and_insurance
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS wash_and_insurance
ON (place_period.period_start = wash_and_insurance.reported_month
AND place_period.chv_area_uuid = wash_and_insurance.reported_by_parent)

LEFT JOIN /* Household Information metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    COUNT(DISTINCT place_id) AS count_households_visited_revisit    
  FROM
      useview_household_visit
  WHERE
      reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS household_visit
ON (place_period.period_start = household_visit.reported_month
AND place_period.chv_area_uuid = household_visit.reported_by_parent)

LEFT JOIN /* Delivery metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    COUNT(DISTINCT patient_id) FILTER ( WHERE place_of_delivery = 'health_facility' ) AS count_new_deliveries_at_health_facility,
    COUNT(DISTINCT patient_id) FILTER ( WHERE pnc_service_count = 1 ) AS count_new_deliveries,
    COUNT(DISTINCT patient_id) FILTER ( WHERE place_of_delivery = 'home' ) AS count_new_deliveries_at_home,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_years >= 10 AND patient_age_in_years < 20 ) AS count_new_deliveries_underage,
    COUNT(DISTINCT patient_id) FILTER ( WHERE pnc_service_count = 1 AND (reported::DATE - date_of_delivery::DATE)::INT <= 1 ) AS count_new_mothers_visited_within_48_hours_of_delivery,
    COUNT(DISTINCT patient_id) FILTER ( WHERE is_referred_for_pnc_services IS TRUE ) AS count_new_deliveries_at_home_referred_pnc
  FROM
    useview_postnatal_care_service
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS postnatal_care_service
ON (place_period.period_start = postnatal_care_service.reported_month
AND place_period.chv_area_uuid = postnatal_care_service.reported_by_parent)

LEFT JOIN /* Management and Treatment <5years metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months BETWEEN 6 AND 59 AND muac_color = 'red' ) AS count_children_6_59_months_malnutrition_severe,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months BETWEEN 6 AND 59 AND muac_color = 'yellow' ) AS count_children_6_59_months_malnutrition_moderate,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months < 60 AND fever_duration < 7 ) AS count_cases_0_59_months_fever_lt_7_days,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months < 60 AND fever_duration < 7 AND (rdt_result <> 'not_done' OR repeat_rdt_result <> 'not_done') ) AS count_cases_0_59_months_fever_lt_7_days_rdt,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months < 60 AND fever_duration < 7 AND (rdt_result = 'positive' OR repeat_rdt_result = 'positive') ) AS count_cases_0_59_months_fever_lt_7_days_rdt_positive,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months < 60 AND fever_duration < 7 AND (rdt_result = 'positive' OR repeat_rdt_result = 'positive') AND gave_al IS TRUE ) AS count_cases_0_59_months_fever_lt_7_days_rdt_positive_act,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months BETWEEN 2 AND 59 AND has_fast_breathing IS TRUE ) AS count_cases_2_59_months_fast_breathing,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months BETWEEN 2 AND 59 AND has_fast_breathing IS TRUE AND gave_amox IS TRUE ) AS count_cases_2_59_months_fast_breathing_amoxycillin,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months BETWEEN 2 AND 59 AND has_diarrhoea IS TRUE ) AS count_cases_2_59_months_diarrhea,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months BETWEEN 2 AND 59 AND has_diarrhoea IS TRUE AND gave_zinc IS TRUE AND gave_ors IS TRUE ) AS count_cases_2_59_months_diarrhea_zinc_ors,
    0 AS count_cases_tb_0_59_months_ipt_referred_completed
  FROM
    useview_under_five_assessment
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS under_five_assessment
ON (place_period.period_start = under_five_assessment.reported_month
AND place_period.chv_area_uuid = under_five_assessment.reported_by_parent)

LEFT JOIN /* Management and Treatment > 5years metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    0 AS count_persons_referred_hts,
    0 AS count_persons_referred_cancer,
    COUNT(DISTINCT patient_id) FILTER ( WHERE is_referred_diabetes IS TRUE ) AS count_persons_referred_diabetes,
    COUNT(DISTINCT patient_id) FILTER ( WHERE is_referred_mental_health IS TRUE ) AS count_persons_referred_mental_illness,
    COUNT(DISTINCT patient_id) FILTER ( WHERE is_referred_hypertension IS TRUE ) AS count_persons_referred_hypertension,
    COUNT(DISTINCT patient_id) FILTER ( WHERE tb_symptoms <> 'none' AND tb_symptoms <> '' ) AS count_persons_screened_tb,
    COUNT(DISTINCT patient_id) FILTER ( WHERE is_referred_tb IS TRUE ) AS count_persons_presumptive_tb_referred,
    COUNT(DISTINCT patient_id) FILTER ( WHERE has_fever IS TRUE AND fever_duration < 7 ) AS count_cases_gte_60_months_fever_lt_7_days,
    COUNT(DISTINCT patient_id) FILTER ( WHERE has_fever IS TRUE AND fever_duration < 7 AND (rdt_result <> 'not_done' OR repeat_rdt_result <> 'not_done') ) AS count_cases_gte_60_months_fever_lt_7_days_rdt,
    COUNT(DISTINCT patient_id) FILTER ( WHERE has_fever IS TRUE AND fever_duration < 7 AND (rdt_result = 'positive' OR repeat_rdt_result = 'positive') ) AS count_cases_gte_60_months_fever_lt_7_days_rdt_positive,
    COUNT(DISTINCT patient_id) FILTER ( WHERE has_fever IS TRUE AND fever_duration < 7 AND (rdt_result = 'positive' OR repeat_rdt_result = 'positive') AND given_al IS TRUE ) AS count_cases_gte_60_months_fever_lt_7_days_rdt_positive_act,
    0 AS count_persons_referred_comprehensive_geriatric_services
  FROM
    useview_over_five_assessment
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS over_five_assessment
ON (place_period.period_start = over_five_assessment.reported_month
AND place_period.chv_area_uuid = over_five_assessment.reported_by_parent)

LEFT JOIN /* ANC metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    COUNT(DISTINCT patient_id) FILTER ( WHERE (is_currently_pregnant IS TRUE OR is_new_pregnancy IS TRUE) AND has_been_referred IS TRUE ) AS count_pregnant_women_referred_to_health_facility,
    COUNT(DISTINCT patient_id) FILTER ( WHERE is_currently_pregnant IS TRUE OR is_new_pregnancy IS TRUE ) AS count_women_pregnant,
    COUNT(DISTINCT patient_id) FILTER ( WHERE (is_currently_pregnant IS TRUE OR is_new_pregnancy IS TRUE) AND patient_age_in_years < 18 ) AS count_women_pregnant_underage,
    COUNT(DISTINCT patient_id) FILTER ( WHERE (is_currently_pregnant IS TRUE OR is_new_pregnancy IS TRUE) AND is_counselled_anc IS TRUE ) AS count_women_pregnant_counselled_anc
  FROM
    useview_pregnancy_home_visit
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS pregnancy_home_visit
ON (place_period.period_start = pregnancy_home_visit.reported_month
AND place_period.chv_area_uuid = pregnancy_home_visit.reported_by_parent)

LEFT JOIN /* Fp metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_years BETWEEN 15 AND 49 AND is_counselled_on_fp_services IS TRUE ) AS count_women_15_49_years_counselled_fp,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_years BETWEEN 15 AND 49 AND is_provided_fp_commodities IS TRUE ) AS count_women_15_49_years_provided_fp,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_years BETWEEN 15 AND 49 AND is_referred_for_fp_services IS TRUE ) AS count_women_15_49_years_referred_fp
  FROM
    useview_family_planning
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS family_planning
ON (place_period.period_start = family_planning.reported_month
AND place_period.chv_area_uuid = family_planning.reported_by_parent)

LEFT JOIN /* Immunization service metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months BETWEEN 12 AND 59 AND is_dewormed IS TRUE ) AS count_children_12_59_months_dewormed,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months < 12 AND is_referred_immunization IS TRUE ) AS count_children_0_11_months_referred_immunization,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months BETWEEN 6 AND 59 AND is_referred_vitamin_a IS TRUE ) AS count_children_6_59_months_referred_vitamin_a,
    COUNT(DISTINCT patient_id) FILTER ( WHERE patient_age_in_months < 60 AND is_referred_growth_monitoring IS TRUE ) AS count_children_0_59_months_referred_delayed_milestones
  FROM
    useview_immunization
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS immunization
ON (place_period.period_start = immunization.reported_month
AND place_period.chv_area_uuid = immunization.reported_by_parent)

LEFT JOIN /* Defaulter metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    COUNT(DISTINCT patient_id) FILTER ( WHERE imm_defaulted IS TRUE AND is_referred IS TRUE ) AS count_defaulters_immunization_referred,
    COUNT(DISTINCT patient_id) FILTER ( WHERE art_defaulted IS TRUE AND is_referred IS TRUE ) AS count_defaulters_art_traced_referred,
    COUNT(DISTINCT patient_id) FILTER ( WHERE hei_defaulted IS TRUE AND is_referred IS TRUE ) AS count_defaulters_hei_traced_referred,
    COUNT(DISTINCT patient_id) FILTER ( WHERE tb_defaulted IS TRUE AND is_referred IS TRUE ) AS count_treatment_interrupters_tb_traced
  FROM
    useview_defaulter_follow_up
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS defaulter_follow_up
ON (place_period.period_start = defaulter_follow_up.reported_month
AND place_period.chv_area_uuid = defaulter_follow_up.reported_by_parent)

LEFT JOIN /* Referral follow up metrics */
  (
  SELECT
    reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,    
    COUNT(DISTINCT patient_id) FILTER ( WHERE was_referred_for_fp_services IS TRUE AND is_available_and_completed_visit IS TRUE ) AS count_women_15_49_years_referred_fp_completed,
    COUNT(DISTINCT patient_id) FILTER ( WHERE was_referred_for_anc_services IS TRUE AND is_available_and_completed_visit IS TRUE ) AS count_women_pregnant_referred_anc_completed,
    COUNT(DISTINCT patient_id) FILTER ( WHERE was_referred_for_pnc_services IS TRUE AND is_available_and_completed_visit IS TRUE ) AS count_women_referred_pnc_completed,
    COUNT(DISTINCT patient_id) FILTER ( WHERE was_defaulter_immunization IS TRUE AND is_available_and_completed_visit IS TRUE ) AS count_defaulters_immunization_referred_completed,
    COUNT(DISTINCT patient_id) FILTER ( WHERE was_defaulter_art IS TRUE AND is_available_and_completed_visit IS TRUE ) AS count_defaulters_art_referred_completed,
    COUNT(DISTINCT patient_id) FILTER ( WHERE was_defaulter_hei IS TRUE AND is_available_and_completed_visit IS TRUE ) AS count_defaulters_hei_referred_completed,
    COUNT(DISTINCT patient_id) FILTER ( WHERE was_referred_tb_case IS TRUE AND is_available_and_completed_visit IS TRUE ) AS count_persons_presumptive_tb_referred_completed,
    COUNT(DISTINCT patient_id) FILTER ( WHERE was_referred_tb_contact IS TRUE AND is_available_and_completed_visit IS TRUE ) AS count_persons_presumptive_tb_contacts_referred_completed,
    COUNT(DISTINCT patient_id) FILTER ( WHERE was_defaulter_tb IS TRUE AND is_available_and_completed_visit IS TRUE ) AS count_treatment_interruptors_tb_referred_completed
  FROM
    useview_referral_follow_up
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS referral_follow_up
ON (place_period.period_start = referral_follow_up.reported_month
AND place_period.chv_area_uuid = referral_follow_up.reported_by_parent)

LEFT JOIN /* Newborns visited within 48 hours metrics */
  (
  SELECT
    chv_area_id AS reported_by_parent,
    CASE
      WHEN single_interval
      THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
      ELSE date_trunc(param_interval_unit, reported)::DATE
    END AS reported_month,
    COUNT(DISTINCT uuid) FILTER ( WHERE (reported::DATE - date_of_birth::DATE)::INT <= 1 ) AS count_newborns_within_48_hours_of_delivery
  FROM
    useview_population_demographics
  WHERE
    reported >= (date_trunc(param_interval_unit, now()) - (param_num_units||' '||param_interval_unit)::interval)
  GROUP BY
    reported_month,
    reported_by_parent
  ) AS newborns
ON (place_period.period_start = newborns.reported_month
AND place_period.chv_area_uuid = newborns.reported_by_parent)

LEFT JOIN /* Fields calculating population metrics */      
  (
  SELECT
    reported_by_parent,
    reported_month,
    SUM(count_households) over (partition by reported_by_parent order by reported_month) AS count_households
  FROM(
    SELECT
      data_series.chv_area_id AS reported_by_parent,
      CASE
        WHEN single_interval
          THEN date_trunc(param_interval_unit, now() - (param_num_units||' '||param_interval_unit)::interval)::DATE
          ELSE date_trunc(param_interval_unit, data_series.date)::DATE
      END AS reported_month,
      COUNT(DISTINCT household_id) AS count_households
    FROM
     (
      SELECT 
        date,
        chv_area_id
      FROM generate_series(
        (SELECT MIN(date_trunc(param_interval_unit, household_reported_date))::DATE FROM useview_population_demographics), 
        date_trunc(param_interval_unit, now())::DATE, 
        (1 ||' '||param_interval_unit)::interval
        ) AS date
          CROSS JOIN (SELECT DISTINCT chv_area_id FROM useview_population_demographics) AS population
        ) AS data_series
        LEFT JOIN useview_population_demographics ON data_series.date = date_trunc(param_interval_unit, household_reported_date)::DATE
        AND useview_population_demographics.chv_area_id = data_series.chv_area_id
      GROUP BY
        reported_month,
        data_series.chv_area_id
    ) AS demographics
  ) AS households
ON (place_period.period_start = households.reported_month
AND place_period.chv_area_uuid = households.reported_by_parent)

GROUP BY 
  _chu_uuid,
  _chu_code,
  _chu_name,
  _chv_area_uuid,
  _chv_area_name,
  _period_start,
  _facility_join_field
ORDER BY
  _chu_uuid,
  _chu_code,
  _chu_name,
  _period_start
$BODY$
LANGUAGE 'sql' STABLE;

DROP FUNCTION IF EXISTS get_transformed_moh_515_data(TEXT,TEXT,TEXT,BOOLEAN);
CREATE FUNCTION get_transformed_moh_515_data
(
  param_facility_group_by TEXT,
  param_num_units TEXT DEFAULT '12',
  param_interval_unit TEXT DEFAULT 'months',
  param_include_current BOOLEAN DEFAULT 'false'
)
RETURNS TABLE(
  "dataSet" TEXT,
  "dataElement" TEXT,
  period TEXT,
  "orgUnit" TEXT,
  value NUMERIC
)
AS $BODY$
WITH data_transformation AS (
  SELECT 
    chu_code AS orgUnit,
    period AS period,
    unnest(array[
    'count_new_households_visited_safe_water_new_visit',
    'count_households_hand_washing_facilities_new_visit',
    'count_households_functional_latrines_new_visit',
    'count_newborns_within_48_hours_of_delivery',
    'count_children_12_59_months_dewormed',
    'count_pregnant_women_referred_to_health_facility',
    'count_new_deliveries_at_health_facility',
    'count_children_0_11_months_referred_immunization',
    'count_persons_referred_hts',
    'count_persons_referred_comprehensive_geriatric_services',
    'count_persons_referred_diabetes',
    'count_persons_referred_cancer',
    'count_persons_referred_mental_illness',
    'count_persons_referred_hypertension',
    'count_defaulters_immunization_referred',
    'count_deaths_12_59_months',
    'count_deaths_maternal',
    'count_households_visited_new_visit',
    'count_households_visited_revisit',
    'count_households_new_visit_upto_date_insurance',
    'count_households_new_visit_upto_date_insurance_uhc',
    'count_households_new_visit_upto_date_insurance_nhif',
    'count_households_new_visit_upto_date_insurance_others',
    'count_households_new_visit_refuse_disposal',
    'count_women_15_49_years_counselled_fp',
    'count_women_15_49_years_provided_fp',
    'count_women_15_49_years_referred_fp',
    'count_women_pregnant',
    'count_women_pregnant_underage',
    'count_women_pregnant_counselled_anc',
    'count_new_deliveries',
    'count_new_deliveries_at_home',
    'count_new_deliveries_underage',
    'count_new_mothers_visited_within_48_hours_of_delivery',
    'count_new_deliveries_at_home_referred_pnc',
    'count_children_6_59_months_malnutrition_severe',
    'count_children_6_59_months_malnutrition_moderate',
    'count_children_6_59_months_referred_vitamin_a',
    'count_children_0_59_months_referred_delayed_milestones',
    'count_defaulters_art_referred',
    'count_defaulters_hei_referred',
    'count_defaulters_art_traced_referred',
    'count_defaulters_hei_traced_referred',
    'count_persons_screened_tb',
    'count_persons_presumptive_tb_referred',
    'count_persons_presumptive_tb_referred_confirmed',
    'count_persons_presumptive_tb_referred_confirmed_referred',
    'count_cases_tb_confirmed_0_59_months',
    'count_treatment_interruptors_tb',
    'count_treatment_interrupters_tb_traced',
    'count_women_15_49_years_referred_fp_completed',
    'count_women_pregnant_referred_anc_completed',
    'count_women_referred_pnc_completed',
    'count_defaulters_immunization_referred_completed',
    'count_persons_referred_hts_completed',
    'count_defaulters_art_referred_completed',
    'count_defaulters_hei_referred_completed',
    'count_routine_checkup_referred_completed',
    'count_persons_presumptive_tb_referred_completed',
    'count_persons_presumptive_tb_contacts_referred_completed',
    'count_cases_tb_0_59_months_ipt_referred_completed',
    'count_treatment_interruptors_tb_referred_completed',
    'count_cases_0_59_months_fever_lt_7_days',
    'count_cases_0_59_months_fever_lt_7_days_rdt',
    'count_cases_0_59_months_fever_lt_7_days_rdt_positive',
    'count_cases_0_59_months_fever_lt_7_days_rdt_positive_act',
    'count_cases_2_59_months_fast_breathing',
    'count_cases_2_59_months_fast_breathing_amoxycillin',
    'count_cases_2_59_months_diarrhea',
    'count_cases_2_59_months_diarrhea_zinc_ors',
    'count_cases_gte_60_months_fever_lt_7_days',
    'count_cases_gte_60_months_fever_lt_7_days_rdt',
    'count_cases_gte_60_months_fever_lt_7_days_rdt_positive',
    'count_cases_gte_60_months_fever_lt_7_days_rdt_positive_act',
    'count_deaths_0_28_days',
    'count_deaths_29_days_11_months',
    'count_deaths_6_59_years',
    'count_deaths_gt_60_years',
    'count_households',
    'count_community_dialogue_days',
    'count_community_action_days',
    'count_community_monthly_meetings']
    ) AS echis_name,
    unnest(array[
    count_new_households_visited_safe_water_new_visit,
    count_households_hand_washing_facilities_new_visit,
    count_households_functional_latrines_new_visit,
    count_newborns_within_48_hours_of_delivery,
    count_children_12_59_months_dewormed,
    count_pregnant_women_referred_to_health_facility,
    count_new_deliveries_at_health_facility,
    count_children_0_11_months_referred_immunization,
    count_persons_referred_hts,
    count_persons_referred_comprehensive_geriatric_services,
    count_persons_referred_diabetes,
    count_persons_referred_cancer,
    count_persons_referred_mental_illness,
    count_persons_referred_hypertension,
    count_defaulters_immunization_referred,
    count_deaths_12_59_months,
    count_deaths_maternal,
    count_households_visited_new_visit,
    count_households_visited_revisit,
    count_households_new_visit_upto_date_insurance,
    count_households_new_visit_upto_date_insurance_uhc,
    count_households_new_visit_upto_date_insurance_nhif,
    count_households_new_visit_upto_date_insurance_others,
    count_households_new_visit_refuse_disposal,
    count_women_15_49_years_counselled_fp,
    count_women_15_49_years_provided_fp,
    count_women_15_49_years_referred_fp,
    count_women_pregnant,
    count_women_pregnant_underage,
    count_women_pregnant_counselled_anc,
    count_new_deliveries,
    count_new_deliveries_at_home,
    count_new_deliveries_underage,
    count_new_mothers_visited_within_48_hours_of_delivery,
    count_new_deliveries_at_home_referred_pnc,
    count_children_6_59_months_malnutrition_severe,
    count_children_6_59_months_malnutrition_moderate,
    count_children_6_59_months_referred_vitamin_a,
    count_children_0_59_months_referred_delayed_milestones,
    count_defaulters_art_referred,
    count_defaulters_hei_referred,
    count_defaulters_art_traced_referred,
    count_defaulters_hei_traced_referred,
    count_persons_screened_tb,
    count_persons_presumptive_tb_referred,
    count_persons_presumptive_tb_referred_confirmed,
    count_persons_presumptive_tb_referred_confirmed_referred,
    count_cases_tb_confirmed_0_59_months,
    count_treatment_interruptors_tb,
    count_treatment_interrupters_tb_traced,
    count_women_15_49_years_referred_fp_completed,
    count_women_pregnant_referred_anc_completed,
    count_women_referred_pnc_completed,
    count_defaulters_immunization_referred_completed,
    count_persons_referred_hts_completed,
    count_defaulters_art_referred_completed,
    count_defaulters_hei_referred_completed,
    count_routine_checkup_referred_completed,
    count_persons_presumptive_tb_referred_completed,
    count_persons_presumptive_tb_contacts_referred_completed,
    count_cases_tb_0_59_months_ipt_referred_completed,
    count_treatment_interruptors_tb_referred_completed,
    count_cases_0_59_months_fever_lt_7_days,
    count_cases_0_59_months_fever_lt_7_days_rdt,
    count_cases_0_59_months_fever_lt_7_days_rdt_positive,
    count_cases_0_59_months_fever_lt_7_days_rdt_positive_act,
    count_cases_2_59_months_fast_breathing,
    count_cases_2_59_months_fast_breathing_amoxycillin,
    count_cases_2_59_months_diarrhea,
    count_cases_2_59_months_diarrhea_zinc_ors,
    count_cases_gte_60_months_fever_lt_7_days,
    count_cases_gte_60_months_fever_lt_7_days_rdt,
    count_cases_gte_60_months_fever_lt_7_days_rdt_positive,
    count_cases_gte_60_months_fever_lt_7_days_rdt_positive_act,
    count_deaths_0_28_days,
    count_deaths_29_days_11_months,
    count_deaths_6_59_years,
    count_deaths_gt_60_years,
    count_households,
    count_community_dialogue_days,
    count_community_action_days,
    count_community_monthly_meetings
    ]
    ) AS value
  FROM
  (
    SELECT
      *
    FROM
      get_moh_515_data(param_facility_group_by, param_num_units, param_interval_unit, param_include_current) AS serviceData
      LEFT JOIN (
        SELECT
          chu_uuid AS cu_uuid,
          chu_code AS cu_code,
          period_start AS period_start_date,
          count_community_dialogue_days,
          count_community_action_days,
          count_community_monthly_meetings
        FROM
          get_moh_515_community_events_data(param_facility_group_by, param_num_units, param_interval_unit, param_include_current)
        ) AS eventsData ON (serviceData.chu_uuid=eventsData.cu_uuid AND serviceData.period_start = eventsData.period_start_date)
      ) AS aggregated
)
SELECT
  khis.khis_data_set_uid AS dataSet,
  khis.khis_data_element_uid AS dataElement,
  period,
  orgUnit,
  value
FROM
  data_transformation AS data
  LEFT JOIN echis_khis_data_set_element_mapping AS khis ON khis.echis_name = data.echis_name
$BODY$
LANGUAGE sql STABLE;


