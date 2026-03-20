import { useState } from 'react';

export function useAsyncState(initialState = false) {
  const [loading, setLoading] = useState(initialState);
  const [error, setError] = useState('');

  function start() {
    setLoading(true);
    setError('');
  }

  function fail(message) {
    setLoading(false);
    setError(message);
  }

  function succeed() {
    setLoading(false);
    setError('');
  }

  return { loading, error, start, fail, succeed, setError };
}
