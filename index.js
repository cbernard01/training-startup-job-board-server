const {promisify} = require("util");
const express = require("express")
const redis = require("redis");
const client = redis.createClient();

const gitHubCronJob = require("./worker");

const getAsync = promisify(client.get).bind(client);

const app = express();
const port = 5000;

gitHubCronJob.start();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/postings', async (req, res) => {
  const postings = await getAsync("github");
  return res.send(postings);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

