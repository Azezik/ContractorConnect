function normalizeString(value) {
  return String(value || '').trim();
}

export function normalizePostalCode(value) {
  return normalizeString(value).toUpperCase().replace(/\s+/g, '');
}

function normalizeList(items = []) {
  return [...new Set(items.map((item) => normalizeString(item).toLowerCase()).filter(Boolean))];
}

function extractKeywords(description) {
  return [...new Set(
    normalizeString(description)
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length >= 4),
  )].slice(0, 20);
}

export function buildContractorMatchingProfile(values) {
  return {
    version: 1,
    location: {
      postalCode: normalizePostalCode(values.postalCode),
      radiusKm: Number(values.workRadiusKm) || null,
    },
    categories: normalizeList(values.categories),
    services: normalizeList(values.servicesOffered),
    tags: normalizeList(values.tags),
  };
}

export function buildJobMatchingProfile(values) {
  return {
    version: 1,
    location: {
      city: normalizeString(values.city),
      postalCode: normalizePostalCode(values.postalCode),
    },
    category: normalizeString(values.category).toLowerCase(),
    tags: normalizeList(values.tags),
    keywords: extractKeywords(values.description),
  };
}

export function evaluateContractorJobMatch({ contractorProfile, jobPost, distanceKm = null }) {
  const contractor = contractorProfile?.matchingProfile || buildContractorMatchingProfile(contractorProfile || {});
  const job = jobPost?.matchingProfile || buildJobMatchingProfile(jobPost || {});

  const categoryMatch = contractor.categories.includes(job.category);
  const contractorTerms = new Set([...contractor.services, ...contractor.tags]);
  const jobTerms = [...job.tags, ...job.keywords];
  const sharedTerms = [...new Set(jobTerms.filter((term) => contractorTerms.has(term)))];
  const withinDistance = distanceKm == null ? null : distanceKm <= (contractor.location.radiusKm || 0);

  const score = [
    categoryMatch ? 60 : 0,
    sharedTerms.length * 10,
    withinDistance === true ? 30 : 0,
  ].reduce((total, value) => total + value, 0);

  return {
    eligible: categoryMatch && withinDistance !== false,
    score,
    breakdown: {
      requiresDistanceLookup: withinDistance == null,
      categoryMatch,
      withinDistance,
      sharedTerms,
      contractorPostalCode: contractor.location.postalCode,
      jobPostalCode: job.location.postalCode,
      contractorRadiusKm: contractor.location.radiusKm,
    },
  };
}
