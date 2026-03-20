import { getMatchingProfile } from './matchingProfiles';

function overlap(left = [], right = []) {
  const rightTerms = new Set(right);
  return [...new Set(left.filter((term) => rightTerms.has(term)))];
}

function readTimestampValue(value) {
  if (!value) return null;
  if (typeof value?.toDate === 'function') return value.toDate().getTime();
  if (value instanceof Date) return value.getTime();
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function calculateFreshnessScore(createdAt) {
  const createdAtMs = readTimestampValue(createdAt);
  if (!createdAtMs) return 0;

  const daysOld = Math.max(0, (Date.now() - createdAtMs) / (1000 * 60 * 60 * 24));
  if (daysOld <= 3) return 10;
  if (daysOld <= 7) return 6;
  if (daysOld <= 14) return 3;
  return 0;
}

function evaluateLocationEligibility(contractorLocation = {}, jobLocation = {}) {
  const contractorPostalCode = contractorLocation.postalCode;
  const contractorPostalPrefix = contractorLocation.postalPrefix;
  const jobPostalCode = jobLocation.postalCode;
  const jobPostalPrefix = jobLocation.postalPrefix;

  if (!contractorPostalCode || !jobPostalCode) {
    return {
      eligible: false,
      score: 0,
      reason: 'missing_postal_code',
      label: 'Missing postal code',
    };
  }

  if (contractorPostalCode === jobPostalCode) {
    return {
      eligible: true,
      score: 40,
      reason: 'exact_postal_match',
      label: 'Exact postal match',
    };
  }

  if (contractorPostalPrefix && contractorPostalPrefix === jobPostalPrefix) {
    return {
      eligible: true,
      score: 25,
      reason: 'postal_prefix_match',
      label: 'Nearby postal area',
    };
  }

  return {
    eligible: false,
    score: 0,
    reason: 'outside_service_area',
    label: 'Outside service area',
  };
}

export function evaluateContractorJobMatch({ contractorProfile, jobPost }) {
  const contractor = getMatchingProfile(contractorProfile, 'contractor');
  const job = getMatchingProfile(jobPost, 'job');

  const categoryOverlap = overlap(contractor.categoryKeys, job.categoryKeys);
  const serviceOverlap = overlap(contractor.serviceKeys, job.serviceKeys);
  const tagOverlap = overlap(contractor.tagKeys, job.tagKeys);
  const keywordOverlap = overlap(contractor.keywordKeys, job.keywordKeys);
  const location = evaluateLocationEligibility(contractor.location, job.location);

  const categoryEligible = categoryOverlap.length > 0;
  const eligible = location.eligible && categoryEligible;

  const score = eligible
    ? [
      location.score,
      categoryOverlap.length ? 35 : 0,
      Math.min(serviceOverlap.length * 8, 24),
      Math.min(tagOverlap.length * 4, 12),
      Math.min(keywordOverlap.length * 2, 8),
      calculateFreshnessScore(jobPost?.createdAt),
    ].reduce((total, value) => total + value, 0)
    : 0;

  return {
    eligible,
    score,
    reasons: {
      location: location.reason,
      category: categoryEligible ? 'category_match' : 'category_mismatch',
    },
    highlights: {
      locationLabel: location.label,
      categoryOverlap,
      serviceOverlap,
      tagOverlap,
      keywordOverlap,
    },
    breakdown: {
      location,
      categoryEligible,
      contractorLocation: contractor.location,
      jobLocation: job.location,
      contractorCategoryKeys: contractor.categoryKeys,
      jobCategoryKeys: job.categoryKeys,
    },
  };
}
