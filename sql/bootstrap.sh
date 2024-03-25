#!/bin/sh

touch bootstrap.sql

> bootstrap.sql

# Utility tables
cat tables/dhis2_base_schema.sql >> bootstrap.sql

# Utility functions
printf "\n\n" >> bootstrap.sql
cat functions/utility_functions.sql >> bootstrap.sql


printf "\n\n" >> bootstrap.sql

# Copy matviews
for view in matviews/contactview_metadata.sql matviews/chv_hierarchy.sql matviews/over_five_assessment.sql matviews/over_five_assessment.sql matviews/useview*.sql
do
  cat $view >> bootstrap.sql
  printf "\n\n" >> bootstrap.sql
done

# Copy moh 515 functions
for dataFunction in functions/get_moh_515_community_events_data.sql functions/get_moh_515_data.sql functions/get_transformed_moh_515_data.sql
do
  cat $dataFunction >> bootstrap.sql
  printf "\n\n" >> bootstrap.sql
done