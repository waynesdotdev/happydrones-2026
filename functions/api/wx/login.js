/* POST /api/wx/login {pin} → sets the session cookie.
   Five wrong tries from one connection locks it out for 15 minutes. */
import { json, safeEqual, sessionToken, sessionCookie } from "../../../lib/wxServer.js";

export async function onRequestPost({ request, env }) {
  if (!env.WEATHER_PIN || !env.MET_OFFICE_KEY) return json({ error: "setup" }, 503);
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const failKey = `fail:${ip}`;
  const fails = env.WEATHER_KV ? Number((await env.WEATHER_KV.get(failKey)) || 0) : 0;
  if (fails >= 5) return json({ error: "locked", message: "Too many wrong tries. Wait 15 minutes." }, 429);

  let pin = "";
  try { pin = String((await request.json()).pin || ""); } catch { /* bad body */ }
  if (!safeEqual(pin, String(env.WEATHER_PIN))) {
    if (env.WEATHER_KV) await env.WEATHER_KV.put(failKey, String(fails + 1), { expirationTtl: 900 });
    return json({ error: "wrong", left: Math.max(0, 4 - fails) }, 401);
  }
  if (env.WEATHER_KV && fails) await env.WEATHER_KV.delete(failKey);
  return json({ ok: true }, 200, { "set-cookie": sessionCookie(await sessionToken(env)) });
}
