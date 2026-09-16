import type {
  DailyChangelogResponse,
  LoginResponse,
  TasksResponse,
  UserInfo,
} from '@/types/tracker';

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

export async function generateDailyChangelog(
  token: string,
  date: string,
  sync = true,
): Promise<DailyChangelogResponse> {
  const search = new URLSearchParams({
    date,
    sync: sync ? 'true' : 'false',
  });
  const response = await fetch(
    `${BASE}/tracker-api/v1/daily-changelog/run?${search.toString()}`,
    {
      method: 'POST',
      headers: getAuthHeaders(token),
    },
  );
  return handleResponse<DailyChangelogResponse>(response);
}

export async function downloadDailyChangelog(token: string, date: string): Promise<void> {
  const response = await fetch(
    `${BASE}/tracker-api/v1/daily-changelog/download?date=${encodeURIComponent(date)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = await response.json();
      detail = body.detail ?? detail;
    } catch {
      // ignore
    }
    throw new TrackerApiError(response.status, detail);
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `daily_changelog_${date}.md`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
