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
