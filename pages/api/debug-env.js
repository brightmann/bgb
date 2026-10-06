import { getCloudflareContext } from "@opennextjs/cloudflare";

// TEMPORARY diagnostic — returns only booleans/error text, never secret values.
function getToken() {
  try {
    const { env } = getCloudflareContext();
    if (env && typeof env.GITHUB_TOKEN === "string" && env.GITHUB_TOKEN) {
      return env.GITHUB_TOKEN;
    }
  } catch (_) {}
  return process.env.GITHUB_TOKEN;
}

export default async function handler(req, res) {
  let viaContext = false;
  let contextError = null;
  try {
    const { env } = getCloudflareContext();
    viaContext = !!(env && env.GITHUB_TOKEN);
  } catch (e) {
    contextError = String((e && e.message) || e).slice(0, 200);
  }
  const token = getToken();
  let apiOk = false;
  let apiError = null;
  let hasUser = false;
  if (token) {
    try {
      const r = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ query: '{ user(login: "brightmann") { login } }' }),
      });
      const data = await r.json();
      apiOk = r.ok && !data.errors;
      hasUser = !!(data.data && data.data.user);
      if (!apiOk) apiError = JSON.stringify(data).slice(0, 300);
    } catch (e) {
      apiError = String((e && e.message) || e).slice(0, 200);
    }
  }
  res.status(200).json({ viaContext, contextError, viaProcessEnv: !!process.env.GITHUB_TOKEN, hasToken: !!token, apiOk, hasUser, apiError });
}

