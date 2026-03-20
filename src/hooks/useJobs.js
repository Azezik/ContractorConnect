import { useEffect, useState } from 'react';
import { subscribeToActiveJobs } from '../services/jobPostService';

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    const unsubscribe = subscribeToActiveJobs(
      (items) => {
        setJobs(items);
        setLoading(false);
      },
      (subscriptionError) => {
        setJobs([]);
        setError(subscriptionError?.message || 'We could not load jobs right now.');
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  return { jobs, loading, error };
}
