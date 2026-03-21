const STORAGE_KEY_PREFIX = 'cc_dismissed_jobs_';

export function getDismissedJobIds(userId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + userId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function dismissJob(userId, jobId) {
  const dismissed = getDismissedJobIds(userId);
  if (!dismissed.includes(jobId)) {
    dismissed.push(jobId);
    localStorage.setItem(STORAGE_KEY_PREFIX + userId, JSON.stringify(dismissed));
  }
}

export function restoreDismissedJob(userId, jobId) {
  const dismissed = getDismissedJobIds(userId).filter((id) => id !== jobId);
  localStorage.setItem(STORAGE_KEY_PREFIX + userId, JSON.stringify(dismissed));
}

export function restoreAllDismissedJobs(userId) {
  localStorage.removeItem(STORAGE_KEY_PREFIX + userId);
}
