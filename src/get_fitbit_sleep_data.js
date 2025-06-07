import { promises as fs } from "fs";
import path from "node:path";
import { fileURLToPath } from "url"; // Import fileURLToPath to resolve __dirname
import moment from "moment";
import fetch, { Headers } from "node-fetch"; // Import fetch and Headers from node-fetch

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use this for getting a new refresh token
// https://dev.fitbit.com/build/reference/web-api/troubleshooting-guide/oauth2-tutorial/
const refreshTokenFilePath = path.resolve(
  __dirname,
  "fitbit_refresh_token.secret"
);

async function get_access_token() {
  const refreshToken = await fs.readFile(refreshTokenFilePath, "utf-8");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "refresh_token");
  urlencoded.append("client_id", "23PVBP");
  urlencoded.append("refresh_token", refreshToken);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  const response = await fetch(
    "https://api.fitbit.com/oauth2/token",
    requestOptions
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch access token: ${response.statusText}`);
  }

  const data = await response.json();
  await fs.writeFile(refreshTokenFilePath, `${data.refresh_token}`);
  return data.access_token;
}

async function getFitbitSleepData(date) {
  const access_token = await get_access_token();

  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  myHeaders.append("authorization", `Bearer ${access_token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const response = await fetch(
    `https://api.fitbit.com/1.2/user/-/sleep/date/${date}.json`,
    requestOptions
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch sleep data: ${response.statusText}`);
  }

  const data = await response.json();
  const mainSleepData = data.sleep.find((sleep) => sleep.isMainSleep);

  if (!mainSleepData) {
    throw new Error("No main sleep data found for the given date.");
  }

  return [
    `\t- Efficiency: ${mainSleepData.efficiency}`,
    `\t- Time in bed: ${Math.floor(mainSleepData.timeInBed / 60)} hours, ${
      mainSleepData.timeInBed % 60
    } minutes`,
    `\t- Time asleep: ${Math.floor(mainSleepData.minutesAsleep / 60)} hours, ${
      mainSleepData.minutesAsleep % 60
    } minutes`,
    `\t- Sleep start: ${moment.utc(mainSleepData.startTime).format("h:mm a")}`,
    `\t- Sleep end: ${moment.utc(mainSleepData.endTime).format("h:mm a")}`,
  ].join("\r\n");
}

export default getFitbitSleepData;
