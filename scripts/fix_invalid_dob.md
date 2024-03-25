### Fix for contact documents affected by https://github.com/moh-kenya/config-echis-2.0/issues/555

Get all contacts with dob_method = "approx"

```
curl -X POST --header "Content-Type: application/json" --data '{"selector": { "contact_type": { "$eq": "f_client" }, "dob_method": { "$eq": "approx"} }, "limit": 1000000 }' https://$user:$password@$instance_url/medic/\_find > contacts.json
```

Filter out docs with the pattern `yyyy-00-dd`

```
jq '[.docs[] | select(.date_of_birth | test("^\\d{4}-00-\\d{2}"))] | sort_by(.reported_date)' contacts.json > dob_error.json
```

With dob_method = "approx", the month in the `date_of_birth` will always be equal to the month in the `reported_date` so we can safely replace the month `-00-` in `yyyy-00-dd` using grep or find and replace in your code editor. After correcting the `date_of_birth` in the contacts in `dob_error.json`, we prepare the file for upload by wrapping the json array in a `docs` json object as described in https://docs.couchdb.org/en/stable/api/database/bulk-api.html#db-bulk-docs

Then we post the fixed documents back to the server

```
curl -X POST --header "Content-Type: application/json" --data-binary "@./dob_error.json" https://$user:$passsword@$instance_url/medic/_bulk_docs > results.txt
```

Go through the request response in `results.txt` to make sure the update request for was successful for all docs
