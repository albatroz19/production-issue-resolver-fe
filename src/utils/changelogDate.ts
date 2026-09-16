/** Daily changelog uses the tracker &quot;To&quot; date (commits from 00:00 IST through now when that day is today). */
export function changelogReportDate(_fromDate: string, toDate: string): string {
  return toDate;
}
