import { useEffect, useState } from 'react';
import { subscribeToContractorProfile } from '../services/contractorProfileService';

export function useContractorProfile(profileId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) {
      setProfile(null);
      setLoading(false);
      return undefined;
    }

    const unsubscribe = subscribeToContractorProfile(profileId, (data) => {
      setProfile(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [profileId]);

  return { profile, loading };
}
