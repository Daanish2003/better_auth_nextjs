import { useState } from 'react';

export const useAuthState = () => {
  const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

  const resetState = () => {
    setError('');
    setSuccess('');
    setLoading(false);
  };

  return { error, setError, success, setSuccess, loading, setLoading, resetState };
};
