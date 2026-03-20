import { evaluateContractorJobMatch } from './matchEngine';

export function buildContractorJobFeed({ contractorProfile, jobs = [] }) {
  const evaluatedJobs = jobs.map((job) => {
    const match = evaluateContractorJobMatch({
      contractorProfile,
      jobPost: job,
    });

    return {
      job,
      match,
    };
  });

  const eligibleMatches = evaluatedJobs
    .filter(({ match }) => match.eligible)
    .sort((left, right) => right.match.score - left.match.score);

  return {
    results: eligibleMatches,
    summary: {
      activeJobCount: jobs.length,
      eligibleJobCount: eligibleMatches.length,
      ineligibleJobCount: evaluatedJobs.length - eligibleMatches.length,
    },
  };
}
