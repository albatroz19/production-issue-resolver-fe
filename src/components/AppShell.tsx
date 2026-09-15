import { Layers, LogOut } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { pageTitle } from '@/lib/app';
import { PROJECTS, type ProjectId } from '@/lib/projects';
import { cn } from '@/lib/utils';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { logout, username } = useAuth();
  const location = useLocation();
  const activeProject: ProjectId = location.pathname.startsWith('/task-tracker')
    ? 'task-tracker'
    : 'issue-resolver';
  const project = PROJECTS[activeProject];

  useEffect(() => {
    document.title = pageTitle(project.label);
  }, [project.label]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Segmentation Hub
                </p>
                <h1 className="text-xl font-semibold tracking-tight">{project.label}</h1>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {username && (
                <span className="text-sm text-muted-foreground">Signed in as {username}</span>
              )}
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2">
            {(Object.values(PROJECTS) as (typeof PROJECTS)[ProjectId][]).map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                  activeProject === item.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-foreground hover:bg-muted',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
