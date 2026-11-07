/* Weather check: every /api/wx/* request needs the passcode cookie,
   except signing in. Also stops search engines indexing anything here. */
import { isSignedIn, json } from "../../../lib/wxServer.js";

export async function onRequest(context) {
  const { request, env, next } = context;
  const path = new URL(request.url).pathname.replace(/\/$/, "");
  if (path.endsWith("/api/wx/login") || path.endsWith("/api/wx/logout")) return next();
  if (!env.WEATHER_PIN || !env.MET_OFFICE_KEY) return json({ error: "setup", message: "The weather check isn't set up on Cloudflare yet (MET_OFFICE_KEY or WEATHER_PIN missing)." }, 503);
  if (!(await isSignedIn(request, env))) return json({ error: "signin" }, 401);
  return next();
}
