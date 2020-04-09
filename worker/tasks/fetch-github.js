const {promisify} = require("util");
const fetch = require("node-fetch");
const redis = require("redis");
const client = redis.createClient();

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const baseURL = "https://jobs.github.com/positions.json"



const fetchGithub = async () => {
  let resultCount = 0, onPage = 0;
  const allPostings = [];

  // Fetch all pages
  while(true) {
    try {
      const response = await fetch(`${baseURL}?page=${onPage}`);
      const gitHubPostings = await response.json();

      resultCount = gitHubPostings.length;
      if (resultCount === 0) break;

      allPostings.push(...gitHubPostings);

      console.log("got",resultCount, "postings on page ", onPage);
      onPage++;
    } catch (err) {
      console.error(err.message);
    }
  }

  // Filter Postings
  const jrLevelPostings = allPostings.filter(posting => {
    const jobTitle = posting.title.toLocaleLowerCase();

    // logic
    return !(jobTitle.includes("senior") ||
      jobTitle.includes("manager") ||
      jobTitle.includes("sr") ||
      jobTitle.includes("architect") ||
      jobTitle.includes("sr."));
  });

  // Set in Redis
  console.log("got a total of", allPostings.length, "postings");
  console.log("filtered all postings down to", jrLevelPostings.length);
  const success = await setAsync("github", JSON.stringify(jrLevelPostings));

  console.log(success);
}

module.exports = fetchGithub;

