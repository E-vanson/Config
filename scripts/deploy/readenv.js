/* eslint-disable indent */
/* eslint-disable no-console */
/**
 replaces values in base_settings.json in the format env.NAME with the environment variable NAME
*/
const fs = require('fs');
const path = require('path');

const settingsPath = path.join(process.cwd(), 'app_settings', 'base_settings.json');
let settings = fs.readFileSync(settingsPath).toString();
let matches = 0;
settings = settings.replace(/env\.(\w+)/g, (match, envVar) => {
    matches++;
    if (process.env[envVar]) {
        console.info('replacing', match);
        return process.env[envVar];
    } else {
        throw new Error(`found ${match} in ${settingsPath} but ${envVar} is missing in env. Did you forget to set your environment variables?`);
    }
});
if (matches > 0) {
    console.info('writing settings');
    fs.writeFileSync(settingsPath, settings);
    console.info('done');
} else {
    console.info('did not find any placeholder env variables in app settings');
}


