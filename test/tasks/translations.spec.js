const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const extractTranslationStrings = fileName => {
  const matches = fs.readFileSync(path.join(__dirname, '../..', fileName)).toString().matchAll(/label\s?:\s?'(.+?)'/g);
  return [...matches].map(match => match[1]);
};

const inBuiltTranslationKeys = [
  'targets.this_month.subtitle',
  'targets.all_time.subtitle',
  'Contact',
  'contact.parent',
  'contact.age',
  'contact.sex',
  'External ID',
  'patient_id'
];


describe('translations', () => {
  it('confirm all translations exist', () => {
    const tasks = require('../../tasks');
    const expectedTaskKeys = _.flatten([
      ...tasks.map(task => task.title),
      ...tasks.map(task => task.actions.map(action => action.label)),
      ...tasks.map(task => task.priority && task.priority.label),
    ]);

    const targets = require('../../targets');
    const expectedTargetKeys = [
      ...targets.map(target => target.translation_key),
      ...targets.map(target => target.subtitle_translation_key)
    ];

    const expectedContactSummaryKeys = [
      ...extractTranslationStrings('contact-summary.templated.js'),
      ...extractTranslationStrings('contact-summary-extras.js')
    ];

    const expectedKeys = Array.from(new Set([...expectedTaskKeys, ...expectedTargetKeys, ...expectedContactSummaryKeys].filter(x => x)));
    const pathToTranslations = path.join(__dirname, '../../translations/messages-en.properties');
    const rawTranslations = fs.readFileSync(pathToTranslations).toString();

    const translationKeys = {};
    for (const translation of rawTranslations.split('\n')) {
      const [key, value] = translation.split('=', 2);
      expect(key.endsWith(' '), `key '${key}' should have no trailing whitespace`).to.be.false;
      if (key.match(/\s/)) {
        expect(key.match(/^(\w+(?:\\\s)?)+$/), `key '${key}' should have spaces escaped with a backslash`).to.not.equal(null);
      }

      expect(translationKeys[key.replace(/\\\s/g, ' ')], key).to.be.undefined;
      translationKeys[key.replace(/\\\s/g, ' ')] = value;
    }

    const undefinedKeys = expectedKeys.filter(key => !translationKeys[key] && !inBuiltTranslationKeys.includes(key));
    if (undefinedKeys.length > 0) {
      // eslint-disable-next-line no-console
      console.error(undefinedKeys);
      expect(undefinedKeys).to.have.property('length', 0);
    }
  });
});
