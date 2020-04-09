const CronJob = require("cron").CronJob;

const fetchGithub = require("./tasks/fetch-github");




const gitHubCronJob = new CronJob("*/1 * * * * ", function() {
  fetchGithub();
}, null, true, 'America/Los_Angeles');

module.exports = gitHubCronJob;
