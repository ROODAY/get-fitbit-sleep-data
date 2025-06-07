import "dotenv/config"; // Load environment variables
import express from "express";
import basicAuth from "express-basic-auth";
import getFitbitSleepData from "./get_fitbit_sleep_data.js"; // Use .js extension for ES modules
import getSubredditTopDaily from "./get_subreddit_top_daily.js";

const app = express();
const PORT = process.env.PORT || 3000;

const users = {
  admin: process.env.ADMIN_PASSWORD, // Load password from .env
};

app.use(
  basicAuth({
    users: users,
    challenge: true,
    unauthorizedResponse: "Unauthorized",
  })
);

app.get("/", (_, res) => {
  res.send("Hello, world!");
});

app.get("/sleep", async (req, res) => {
  const date = req.query.date;

  if (!date) {
    return res.status(400).send("Date query parameter is required.");
  }

  try {
    const sleepData = await getFitbitSleepData(date);
    res.send(sleepData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving sleep data.");
  }
});

app.get("/reddit_headlines", async (req, res) => {
  const subreddit = req.query.subreddit || "worldnews";
  const limit = parseInt(req.query.limit, 10) || 3;

  try {
    const headlines = await getSubredditTopDaily(subreddit, limit);
    res.send(headlines);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving Reddit headlines.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
