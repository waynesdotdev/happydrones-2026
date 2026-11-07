/* GET /api/wx/kp → NOAA planetary K-index forecast (GPS conditions), kept for 3 hours. */
import { json, kpForecast } from "../../../lib/wxServer.js";

export async function onRequestGet({ env }) {
  try { return json(await kpForecast(env)); }
  catch { return json({ list: [], error: "kp" }); }
}
