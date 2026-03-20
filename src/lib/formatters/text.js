export function truncateText(text = '', max = 140) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export function slugifyTag(tag = '') {
  return tag.trim().toLowerCase();
}
