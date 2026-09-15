import { useCallback, useState } from 'react';

import { analyzeIncident } from '@/api/incidents';
import type { DiagnosisResponse, IncidentRequest } from '@/types/incident';
import { ApiError } from '@/types/incident';

const API_KEY_STORAGE_KEY = 'poc-api-key';

export function getStoredApiKey(): string {
  return sessionStorage.getItem(API_KEY_STORAGE_KEY) ?? '';
}

export function setStoredApiKey(value: string) {
  if (value) {
    sessionStorage.setItem(API_KEY_STORAGE_KEY, value);
  } else {
    sessionStorage.removeItem(API_KEY_STORAGE_KEY);
  }
}

export function useAnalyzeIncident() {
  const [result, setResult] = useState<DiagnosisResponse | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyze = useCallback(async (request: IncidentRequest, apiKey?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const diagnosis = await analyzeIncident(request, apiKey);
      setResult(diagnosis);
      return diagnosis;
    } catch (err) {
      const apiError =
        err instanceof ApiError
          ? err
          : new ApiError(
              err instanceof Error && err.message
                ? err.message
                : 'Unexpected error during analysis.',
              0,
              'Check that the Java backend is running on port 8099 and the frontend dev server is started with npm run dev.',
            );
      setError(apiError);
      setResult(null);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    error,
    isLoading,
    analyze,
    reset,
  };
}
