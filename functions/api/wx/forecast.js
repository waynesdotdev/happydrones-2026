/* GET /api/wx/forecast?lat=54.56&lon=-1.32 → hourly (48 h) and three-hourly (7 days)
   Met Office Global Spot forecast, kept for an hour per site. */
import { json, forecastFor, DAILY_LIMIT } from "../../../lib/wxServer.js";

export async function onRequestGet({ request, env }) {
  const q = new URL(request.url).searchParams;
  const lat = Number(q.get("lat"));
  const lon = Number(q.get("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < 49 || lat > 61 || lon < -9 || lon > 3) {
    return json({ error: "place", message: "That location isn't in the UK." }, 400);
  }
  try {
    const data = await forecastFor(env, lat.toFixed(3), lon.toFixed(3));
    return json({ ...data, limit: DAILY_LIMIT });
  } catch (e) {
    const status = e.status === 429 ? 429 : e.status === 401 || e.status === 403 ? 502 : 502;
    const message = e.status === 429 ? "Today's free Met Office requests are used up. They reset at midnight."
      : e.status === 401 || e.status === 403 ? "The Met Office didn't accept the key. Check MET_OFFICE_KEY in Cloudflare and that the Global Spot plan is active."
      : "The Met Office forecast didn't load. Try again in a minute.";
    return json({ error: "upstream", message }, status);
  }
}
