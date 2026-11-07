/* GET /api/wx/me → 200 if signed in (the middleware checks), plus today's request count. */
import { json, usedToday, DAILY_LIMIT } from "../../../lib/wxServer.js";

export async function onRequestGet({ env }) {
  return json({ ok: true, used: await usedToday(env), limit: DAILY_LIMIT });
}
