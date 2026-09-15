import { CalendarDays, Layers, SearchCode } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { APP_NAME, APP_TAGLINE, pageTitle } from '@/lib/app';
import { getStoredProject, PROJECTS, setStoredProject, type ProjectId } from '@/lib/projects';
import { cn } from '@/lib/utils';

const PROJECT_ICONS: Record<ProjectId, typeof SearchCode> = {
  'issue-resolver': SearchCode,
  'task-tracker': CalendarDays,
};

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectId>(getStoredProject());
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = pageTitle();
  }, []);

  const handleProjectSelect = (project: ProjectId) => {
    setSelectedProject(project);
    setStoredProject(project);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(username, password);
      setStoredProject(selectedProject);
      navigate(PROJECTS[selectedProject].path, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Layers className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{APP_NAME}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{APP_TAGLINE}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.values(PROJECTS) as (typeof PROJECTS)[ProjectId][]).map((project) => {
            const Icon = PROJECT_ICONS[project.id];
            const isSelected = selectedProject === project.id;
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => handleProjectSelect(project.id)}
                className={cn(
                  'rounded-xl border p-4 text-left transition-colors',
                  isSelected
                    ? 'border-primary bg-primary/5 ring-2 ring-primary'
                    : 'border-border bg-card hover:bg-muted/50',
                )}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="font-medium">{project.label}</span>
                </div>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </button>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Use your user ID and password to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="username">User ID</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in…' : `Continue to ${PROJECTS[selectedProject].label}`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
