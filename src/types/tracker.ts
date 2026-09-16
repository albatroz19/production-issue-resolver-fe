export interface LoginResponse {
  success: boolean;
  token: string;
  username: string;
}

export interface UserInfo {
  name: string;
  email: string;
}

export interface TaskEntry {
  repo: string;
  description: string;
  tickets: string[];
  hours: number;
}

export interface DayTasks {
  date: string;
  user: string;
  entries: TaskEntry[];
}

export interface TasksResponse {
  days: DayTasks[];
}

export interface DailyChangelogResponse {
  date: string;
  commit_count: number;
  summary_markdown: string;
  report_available: boolean;
}
