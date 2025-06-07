import "dotenv/config"; // Load environment variables
import fetch from "node-fetch";

const { REDDIT_AUTH, REDDIT_DEVICE_ID, REDDIT_USER_AGENT } = process.env;

if (!REDDIT_AUTH || !REDDIT_DEVICE_ID || !REDDIT_USER_AGENT) {
  throw new Error("Missing Reddit env vars in .env");
}

const getSubredditTopDaily = async (subreddit = "worldnews", limit = 3) => {
  const tokenRes = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      "User-Agent": REDDIT_USER_AGENT,
      Authorization: `Basic ${REDDIT_AUTH}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "https://oauth.reddit.com/grants/installed_client",
      device_id: REDDIT_DEVICE_ID,
    }),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`Token request failed: ${tokenRes.status} - ${errText}`);
  }

  const tokenJson = await tokenRes.json();
  const token = tokenJson.access_token;

  const headlinesRes = await fetch(
    `https://oauth.reddit.com/r/${subreddit}/top/.json?sort=top&t=day&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "User-Agent": REDDIT_USER_AGENT,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!headlinesRes.ok) {
    const errText = await headlinesRes.text();
    throw new Error(
      `Headlines request failed: ${headlinesRes.status} - ${errText}`
    );
  }

  const headlines = await headlinesRes.json();

  return headlines.data.children
    .map(({ data: { title, url } }) => `- [${title}](${url})`)
    .join("\r\n");
};

export default getSubredditTopDaily;
