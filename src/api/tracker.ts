import type { LoginResponse, TasksResponse, UserInfo } from '@/types/tracker';

const BASE = import.meta.env.VITE_TRACKER_API_BASE_URL ?? '';

export class TrackerApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}

function getAuthHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = await response.json();
      detail = body.detail ?? detail;
    } catch {
      // ignore parse errors
    }
    throw new TrackerApiError(response.status, detail);
  }
  return response.json() as Promise<T>;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${BASE}/tracker-api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse<LoginResponse>(response);
}

export async function fetchUsers(token: string): Promise<UserInfo[]> {
  const response = await fetch(`${BASE}/tracker-api/v1/users`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse<UserInfo[]>(response);
}

export async function fetchTasks(
  token: string,
  params: { from: string; to: string; user?: string; sync?: boolean },
): Promise<TasksResponse> {
  const search = new URLSearchParams({ from: params.from, to: params.to });
  if (params.sync) {
    search.set('sync', 'true');
  }
  if (params.user && params.user !== 'all') {
    search.set('user', params.user);
  }
  const response = await fetch(`${BASE}/tracker-api/v1/tasks?${search.toString()}`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse<TasksResponse>(response);
}
