export function formatLocation(city, postalCode) {
  return [city, postalCode].filter(Boolean).join(' • ');
}
