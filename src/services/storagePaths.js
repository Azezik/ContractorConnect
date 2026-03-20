export function buildUserStorageRoot(userId) {
  return `users/${userId}`;
}

export function buildAvatarStoragePath(userId) {
  return `${buildUserStorageRoot(userId)}/avatar`;
}

export function buildJobPostStoragePath(userId, jobPostId) {
  return `${buildUserStorageRoot(userId)}/jobPosts/${jobPostId}`;
}

export function buildContractorProfileStoragePath(userId) {
  return `${buildUserStorageRoot(userId)}/contractorProfile`;
}

export function buildReportStoragePath(userId, reportId) {
  return `${buildUserStorageRoot(userId)}/reports/${reportId}`;
}

export function buildMessageAttachmentStoragePath(userId, conversationId) {
  return `${buildUserStorageRoot(userId)}/messages/${conversationId}`;
}
