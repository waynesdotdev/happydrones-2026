/* Reads the online roof reports in /content/reports at build time.
   One .json file per report; see content/reports/README.txt. */
import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "content", "reports");

export function getReports() {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")));
}
export const getReport = (id) => getReports().find((r) => r.id === id) || null;
