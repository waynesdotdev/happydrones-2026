"use client";
/* Password boxes with a Show/Hide button, plus a "new password" pair
   (password + confirm) that checks the length and the match as you type.
   Also: a gentle "did you mean …?" for common email typos. */
import { useState } from "react";

function Box({ id, value, onChange, autoComplete, show, invalid, describedBy }) {
  return (
    <input id={id} type={show ? "text" : "password"} autoComplete={autoComplete} autoCapitalize="off" autoCorrect="off" spellCheck={false}
      value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid || undefined} aria-describedby={describedBy} />
  );
}

function Toggle({ show, setShow, controls }) {
  return (
    <button type="button" className="ac-show" aria-pressed={show} aria-controls={controls} onClick={() => setShow(!show)}>
      {show ? "Hide" : "Show"}
    </button>
  );
}

/* One password box (sign in, current password, delete account) */
export function PasswordField({ id, label = "Password", value, onChange, autoComplete = "current-password" }) {
  const [show, setShow] = useState(false);
  return (
    <div className="t-field">
      <label htmlFor={id}>{label}</label>
      <div className="ac-pw"><Box id={id} value={value} onChange={onChange} autoComplete={autoComplete} show={show} /><Toggle show={show} setShow={setShow} controls={id} /></div>
    </div>
  );
}

export const MIN_PW = 10;
export const newPasswordProblem = (pw, confirm) =>
  pw.length < MIN_PW ? `Your password needs at least ${MIN_PW} characters.` : pw !== confirm ? "The two passwords don't match. Check them with Show." : "";

/* New password + confirm (create account, reset, change password) */
export function NewPassword({ id, label = "Password", value, confirm, onChange, onConfirm }) {
  const [show, setShow] = useState(false);
  const left = MIN_PW - value.length;
  const matchState = !confirm ? "" : confirm === value ? "ok" : value.startsWith(confirm) ? "typing" : "bad";
  return (
    <>
      <div className="t-field">
        <label htmlFor={id}>{label}</label>
        <div className="ac-pw"><Box id={id} value={value} onChange={onChange} autoComplete="new-password" show={show} describedBy={`${id}-h`} /><Toggle show={show} setShow={setShow} controls={`${id} ${id}-2`} /></div>
        <span id={`${id}-h`} className={`t-hint ${value && left <= 0 ? "ac-good" : ""}`} aria-live="polite">
          {!value ? `At least ${MIN_PW} characters. A few random words works well.` : left > 0 ? `${left} more character${left === 1 ? "" : "s"} needed` : "✓ Long enough"}
        </span>
      </div>
      <div className="t-field">
        <label htmlFor={`${id}-2`}>Type it again</label>
        <div className="ac-pw"><Box id={`${id}-2`} value={confirm} onChange={onConfirm} autoComplete="new-password" show={show} invalid={matchState === "bad"} describedBy={`${id}-m`} /></div>
        <span id={`${id}-m`} className={`t-hint ${matchState === "ok" ? "ac-good" : matchState === "bad" ? "ac-bad" : ""}`} aria-live="polite">
          {matchState === "ok" ? "✓ Passwords match" : matchState === "bad" ? "These don't match yet" : "So we know there's no typo"}
        </span>
      </div>
    </>
  );
}

/* "Did you mean …@gmail.com?" for the usual slips */
const DOMAINS = ["gmail.com", "googlemail.com", "hotmail.com", "hotmail.co.uk", "outlook.com", "live.co.uk", "yahoo.com", "yahoo.co.uk", "icloud.com", "btinternet.com", "sky.com", "aol.com", "happydrones.co.uk"];
function dist(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
  {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1); // swapped letters
  }
  return d[a.length][b.length];
}
export function emailSuggestion(email) {
  const m = String(email).trim().toLowerCase().match(/^([^\s@]+)@([^\s@]+)$/);
  if (!m || DOMAINS.includes(m[2])) return "";
  let best = "", score = 99;
  for (const dm of DOMAINS) { const s = dist(m[2], dm); if (s <= (dm.length >= 11 ? 2 : 1) && s < score) { score = s; best = dm; } }
  return best ? `${m[1]}@${best}` : "";
}
