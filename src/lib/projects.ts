export type ProjectId = 'issue-resolver' | 'task-tracker';

export const PROJECTS: Record<
  ProjectId,
  { id: ProjectId; label: string; description: string; path: string }
> = {
  'issue-resolver': {
    id: 'issue-resolver',
    label: 'Production Issue Resolver',
    description: 'Submit incidents and receive structured diagnoses.',
    path: '/issue-resolver',
  },
  'task-tracker': {
    id: 'task-tracker',
    label: 'Daily Task Tracker',
    description: 'View AI-summarized daily work from team commits.',
    path: '/task-tracker',
  },
};

const PROJECT_STORAGE_KEY = 'selected-project';

export function getStoredProject(): ProjectId {
  const stored = sessionStorage.getItem(PROJECT_STORAGE_KEY);
  if (stored === 'issue-resolver' || stored === 'task-tracker') {
    return stored;
  }
  return 'issue-resolver';
}

export function setStoredProject(project: ProjectId) {
  sessionStorage.setItem(PROJECT_STORAGE_KEY, project);
}
