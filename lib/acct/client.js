/* Browser helper for the account and admin pages: calls /api/acct and /api/admin. */
export async function api(path, data, method) {
  const r = await fetch(path, {
    method: method || (data ? "POST" : "GET"),
    headers: data ? { "content-type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "same-origin",
  });
  const j = await r.json().catch(() => ({}));
  if (r.status === 404 && !j.error) return { error: "offline", message: "Accounts only work on the live website (they run on Cloudflare, not on npm run dev)." };
  return r.ok ? j : { error: j.error || "error", message: j.message || "Something went wrong.", status: r.status };
}
export const STATUS = {
  awaiting_signature: ["Sign the agreement", "warn"], awaiting_payment: ["Waiting for payment", "warn"], requested: ["Booked, date to confirm", "info"], confirmed: ["Confirmed: it\u2019s a go", "good"],
  delivered: ["Delivered", "good"], cancel_requested: ["Cancellation requested", "warn"], cancelled: ["Cancelled", "muted"],
};
export const longDate = (d) => (d ? new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "");
export const when = (t) => (t ? new Date(t * 1000).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "");
