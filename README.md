# eCHIS v2.0

This repository contains configuration files for eCHIS, powered by the [Community Health Toolkit](https://docs.communityhealthtoolkit.org/) and based on the [Kenya Community Health Policy 2020-2030](https://www.health.go.ke/wp-content/uploads/2020/07/Kenya-Community-Health-Policy-Signed.pdf).

It is currently deployed on Community Health Toolkit (CHT) [version 3.17.0](https://docs.communityhealthtoolkit.org/core/releases/3.17.0/) and **there are no Postgres databases setup yet**.

## Deployment Process

We deploy to the various instances below using [cht-conf](https://github.com/medic/cht-conf).

### Testing Environment

- The testing environment can be accessed on [chis-training.health.go.ke](https://chis-training.health.go.ke). Admin credentials are on 1password.

- You may use the following Community Health Promoter credentials to experience their functionality.

```
user: test_chv
password: P@55w0rd
```

- We deploy changes every night off the [training branch](https://github.com/moh-kenya/config-echis-2.0/tree/training) and communicate to involved parties to sync and farmiliarize themselves with the changes. After a pull request is merged, another is created to merge the changes to the training branch, which has all tasks showing on the User Interface immediately to allow users to check the expected behavior.

### Development Environment

- The staging environment can be accessed on [chis-staging.health.go.ke](https://chis-staging.health.go.ke). Admin credentials are on 1password.

- A playground for App Developers, changes are pushed from the [staging branch](https://github.com/moh-kenya/config-echis-2.0/tree/staging) that merges changes in development from different developers to prevent overwriting each other's on the instance in the process of testing.

### Production Environment

- The production environment can be accessed on [echis.health.go.ke](https://echis.health.go.ke). Admin credentials are on 1password.

- The deployment branch is [main](https://github.com/moh-kenya/config-echis-2.0/tree/main) and changes are deployed every Tuesday night, except for live-site incidents.

## Support Structure

- The Ministry of Health of Kenya is the custodian of the echis and as such, support requests shall be escalated from the IT focal people to Medic, where need be.

- With Migori County having gone live on December 09, 2022 in Nyatike Sub-County and December 16, 2022 in Awendo Sub-County, the structure is as follows:

`Community Health Promoter(CHP) -> Community Health Assistant(CHA) -> Sub County Focal Person -> County Focal Person -> Ministry Contact Person/Medic Project Manager`

- Support requests shall be communicated Email, Slack (#mo-kenya channel) or [Github](https://github.com/moh-kenya/config-echis-2.0)

## Documentation

The following resources can be accessed for reference:

- #moh-kenya Slack channel
- Design spec (including tasks nitty gritty): https://docs.google.com/spreadsheets/d/1cowY7uIR7bMCHTVQV8YxcRRolAYTy-Zd/edit#gid=621827796
- In-app analytics spec: https://docs.google.com/spreadsheets/d/1OKs68EAkp72BEkAi0wPMAmql7NBJIem8vm7UYq3ts5c/edit#gid=826078097
- Migori County User Data LIVE Sheet available on Google Drive (search `User Data LIVE Sheet`)

## Emergency contacts

In case of emergency attention besides the usual support (especially during the festive break), contact **Derick or Kitsao or Irene** (in that order) via Slack or Email or Phone call.

## Contributing

You should first familiarize yourself with the Community Health Toolkit Application [tutorials](https://docs.communityhealthtoolkit.org/apps/tutorials/) before getting started.

First time contributor?

- Check out our [coding style guide](https://docs.communityhealthtoolkit.org/contribute/code/style-guide/).
- Issues labeled [help wanted](https://github.com/moh-kenya/config-echis-2.0/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) are a great place to start.

Looking for other ways to help? You can also:

- Review or add a translation
- Find and mark duplicate issues
- Try to reproduce issues and help with troubleshooting
- Or share a new idea or question with us!

## Modifying Forms

Generally, each form is created and edited as an [XLSForm](http://xlsform.org) file, which is an Excel spreadsheet file that uses a special notation, and can also be opened with Libreoffice, Google Sheets, or your favourite Office tool. The XLSForm is later converted into an [XForm](https://opendatakit.github.io/xforms-spec/) XML file to upload to the instance. The forms are categorized into app forms (action or task forms such as pregnancy registration, delivery report) and contact forms (Place or Person forms).

To edit app forms, see `./forms/app/*.xlsx`. To edit contact forms, see `./forms/contact/*.xlsx`.

**NB:** if you are using couch2pg to create a read-only replicate of your data in PostgreSQL, it’s important to remember that changes to forms may require changes to your queries or views in PostgreSQL.

### Adding a new question

Each question is defined in a row in XLSForm with a type such as: text, integer, select_one, select_multiple. (See the [XLSForm documentation](https://xlsform.org/en/#question-types) for a full list of types).

Example:

| type | name       | label:en                                |
| ---- | ---------- | --------------------------------------- |
| date | u_lmp_date | Please enter the start date of the LMP. |

To add a new question, simply add a new row.

### Adding a new page of questions

To add a new page, you need to add a group. The group starts with a row that has type “begin group” and ends with type “end group”. The "name" field for the "begin group" row is used as the page title. The "name" field in the “end group” row is not shown in the form, but can help provide clarity for large forms and those with nested groups.

More information: https://xlsform.org/en/#grouping-questions

### Removing questions

You can remove a question by removing the row specific to that question in XLS form. However, you should first ensure that no other row depends on it.

For example, before removing a question that asks for the date of birth (DOB) for a user, you need to make sure that DOB is not used anywhere else (to calculate the age of the user, etc). Without the original row, all rows depending on it will fail.

The question being removed may also be used outsie of forms in the configuration, such as in Tasks, Targets or Contact-summary. One easy way to find the usage of the question is by searching the configuration for its name.

### Adding choice questions

Instructions are same [as adding a new question](#adding-a-new-question), except note that you need to add your new choice options in the "choices" sheet.

## Tasks

Tasks are calculated and shown at run-time, i.e. when the app is loaded or reloaded. Once calculated, they are not stored anywhere and are re-calculated when any user visits the app next time.

Tasks are defined inside the file `tasks.js`.

A Task can apply to certain contacts or contacts with specific reports with specific properties that are defined in `appliesIf` function of the task. The criteria for resolving/clearing the Task is defined in the `resolvedIf` function.

The following conditions need to be satisfied for a Task to show:

- `appliesIf` results to true
- `resolvedIf` results to false
- Current day/time falls in the time window

For more information: [Tasks documentation](https://docs.communityhealthtoolkit.org/apps/features/tasks/).

### Changing the time window

The time period for which a Task can appear is called "time window". There are three settings that affect the time window:

1. `dueDate`: The date at which the Task is marked as due
2. `start`: Number of days before the due date from which the Task will start appearing
3. `end`: Number of days after the due date from which the Task will stop appearing

For example, if start = 6, end = 7, the Tasks will show for a total of 6 + 1 + 7 = 14 days i.e. 2 weeks.
It is easy to change the start and end days of the time window. Changing a dueDate, however, requires some calculation based on other factors such as reported date or LMP date.

## Targets

The Targets are configured inside the file `targets.js`.

For more information: [Targets documentation](https://docs.communityhealthtoolkit.org/apps/features/targets/).

### Editing a goal

To edit a goal, change the `goal` value. This value is an integer that can range from 0-100, where `-1` means no goal.

In the above example setting it to `75` would change the goal to be 75% of deliveries being in a health facility.

## Contact Summary Profiles

Condition cards are defined inside the `cards` section of the `contact-summary-templated.js` file.

To add a condition card, add it to the "cards" section.
To add a field inside an existing condition card, add it to the "fields" section of that card.
You can remove the fields or condition cards that you don't want to show by deleting the whole code block belonging to that field/card.

For more information: [Condition Cards documentation](https://docs.communityhealthtoolkit.org/apps/reference/contact-page/#condition-cards)

## Tests

### Set Up

```
npm install
pip install --user --no-cache sqlfluff
```

### Application code

```
npm test
```

### SQL

```
npm run sqlint
```
