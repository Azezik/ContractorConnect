import { useEffect, useState } from 'react';
import { getJobPost } from '../services/jobPostService';

export function useJobDetails(jobId) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const response = await getJobPost(jobId);
      if (active) {
        setJob(response);
        setLoading(false);
      }
    }

    if (jobId) load();

    return () => {
      active = false;
    };
  }, [jobId]);

  return { job, loading };
}
