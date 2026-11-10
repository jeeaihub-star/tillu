import { StoredReport } from '../types';

const STORAGE_KEY = 'tillu.reports.v1';

export function getLocalReports(): StoredReport[] {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as StoredReport[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalReport(report: Record<string, unknown>): void {
  const reports = getLocalReports();
  reports.unshift({
    ...report,
    id: 'rep_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    timestamp: new Date().toISOString(),
  } as StoredReport);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports.slice(0, 100)));
}

export function deleteLocalReport(id: string): void {
  const reports = getLocalReports().filter((report) => report.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}
