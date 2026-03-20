import { useEffect, useState } from 'react';
import { subscribeToActiveJobs } from '../services/jobPostService';

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToActiveJobs((items) => {
      setJobs(items);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { jobs, loading };
}
