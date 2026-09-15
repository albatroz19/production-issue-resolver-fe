import type { DiagnosisResponse, IncidentRequest } from '@/types/incident';
import { ApiError } from '@/types/incident';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export async function analyzeIncident(
  request: IncidentRequest,
  apiKey?: string,
): Promise<DiagnosisResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['X-POC-API-KEY'] = apiKey;
  }

  let response: Response;

  try {
    response = await fetch(`${BASE}/api/v1/incidents/analyze`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network request failed';
    throw new ApiError(
      message === 'Failed to fetch'
        ? 'Cannot reach the backend API. Start Java on port 8099 and use npm run dev for the frontend.'
        : message,
      0,
    );
  }

  if (response.ok) {
    return response.json() as Promise<DiagnosisResponse>;
  }

  const body = await response.text();
  let detail: string | undefined;

  try {
    const parsed = JSON.parse(body) as { detail?: string; message?: string };
    detail = parsed.detail ?? parsed.message;
  } catch {
    detail = body || undefined;
  }

  switch (response.status) {
    case 400:
      throw new ApiError('Invalid incident request. Check required fields.', 400, detail);
    case 401:
      throw new ApiError('Missing or invalid API key.', 401, detail);
    case 503:
      throw new ApiError('Python agent unavailable. Start the Python peer or disable orchestration.', 503, detail);
    default:
      throw new ApiError(`Request failed with status ${response.status}.`, response.status, detail);
  }
}
