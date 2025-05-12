import "dotenv/config"; // Load environment variables
import express from "express";
import basicAuth from "express-basic-auth";
import getFitbitSleepData from "./get_fitbit_sleep_data.js"; // Use .js extension for ES modules

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
