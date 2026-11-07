/* POST /api/wx/logout → clears the session cookie. */
import { json, clearCookie } from "../../../lib/wxServer.js";

export async function onRequestPost() {
  return json({ ok: true }, 200, { "set-cookie": clearCookie });
}
