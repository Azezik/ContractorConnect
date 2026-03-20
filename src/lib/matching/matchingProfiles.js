function normalizeString(value) {
  return String(value || '').trim();
}

export function normalizePostalCode(value) {
  return normalizeString(value).toUpperCase().replace(/\s+/g, '');
}

export function normalizePostalPrefix(value) {
  return normalizePostalCode(value).slice(0, 3);
}

function normalizeCategory(value) {
  return normalizeString(value).toLowerCase();
}

function normalizeList(items = []) {
  return [...new Set(items.map((item) => normalizeString(item).toLowerCase()).filter(Boolean))];
}

function extractKeywords(...sources) {
  return [...new Set(
    sources
      .map((source) => normalizeString(source).toLowerCase())
      .join(' ')
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length >= 4),
  )].slice(0, 30);
}

function normalizeLocation({ postalCode, city = '', maxRadiusKm = null, coordinates = null }) {
  const normalizedPostalCode = normalizePostalCode(postalCode);

  return {
    postalCode: normalizedPostalCode,
    postalPrefix: normalizePostalPrefix(normalizedPostalCode),
    city: normalizeString(city),
    coordinates,
    maxRadiusKm: Number(maxRadiusKm) || null,
  };
}

export function buildContractorMatchingProfile(values = {}) {
  const categoryKeys = normalizeList(values.categories);
  const serviceKeys = normalizeList(values.servicesOffered);
  const tagKeys = normalizeList(values.tags);

  return {
    version: 2,
    entityType: 'contractor',
    accountType: 'contractor',
    location: normalizeLocation({
      postalCode: values.postalCode,
      city: values.city,
      maxRadiusKm: values.workRadiusKm,
      coordinates: values.coordinates || null,
    }),
    categoryKeys,
    serviceKeys,
    tagKeys,
    keywordKeys: extractKeywords(values.businessName, values.displayName, values.bio, serviceKeys.join(' '), tagKeys.join(' ')),
    constraints: {
      availabilityStatus: normalizeCategory(values.availabilityStatus) || null,
      budget: null,
      timeline: null,
    },
  };
}

export function buildJobMatchingProfile(values = {}) {
  const categoryKey = normalizeCategory(values.category);
  const tagKeys = normalizeList(values.tags);
  const titleKeywords = extractKeywords(values.title);
  const descriptionKeywords = extractKeywords(values.description);
  const keywordKeys = [...new Set([...titleKeywords, ...descriptionKeywords, ...tagKeys])].slice(0, 30);

  return {
    version: 2,
    entityType: 'job',
    accountType: 'customer',
    location: normalizeLocation({
      postalCode: values.postalCode,
      city: values.city,
      coordinates: values.coordinates || null,
    }),
    categoryKeys: categoryKey ? [categoryKey] : [],
    serviceKeys: [...new Set([...tagKeys, ...titleKeywords])].slice(0, 20),
    tagKeys,
    keywordKeys,
    constraints: {
      availabilityStatus: null,
      budget: normalizeString(values.budget) || null,
      timeline: normalizeString(values.timeline) || null,
    },
  };
}

export function getMatchingProfile(entity = {}, entityType) {
  if (entity?.matchingProfile?.version >= 2) {
    return entity.matchingProfile;
  }

  if (entityType === 'contractor') {
    return buildContractorMatchingProfile(entity);
  }

  return buildJobMatchingProfile(entity);
}
