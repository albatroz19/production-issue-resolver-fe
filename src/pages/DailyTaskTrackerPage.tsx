import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  downloadDailyChangelog,
  fetchTasks,
  fetchUsers,
  generateDailyChangelog,
  TrackerApiError,
} from '@/api/tracker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import type { DayTasks, UserInfo } from '@/types/tracker';
import { changelogReportDate } from '@/utils/changelogDate';

function todayBounds(): { from: string; to: string } {
  const now = new Date();
  const fmt = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const today = fmt(now);
  return { from: today, to: today };
}

function formatDate(dateStr: string) {
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function DailyTaskTrackerPage() {
  const { token } = useAuth();
  const defaults = useMemo(() => todayBounds(), []);
  const [fromDate, setFromDate] = useState(defaults.from);
  const [toDate, setToDate] = useState(defaults.to);
  const [selectedUser, setSelectedUser] = useState('all');
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [days, setDays] = useState<DayTasks[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [isDownloadingChangelog, setIsDownloadingChangelog] = useState(false);
  const [isGeneratingChangelog, setIsGeneratingChangelog] = useState(false);
  const [changelogError, setChangelogError] = useState<string | null>(null);
  const [changelogSuccess, setChangelogSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setIsLoadingUsers(true);
    fetchUsers(token)
      .then((userList) => {
        if (!cancelled) setUsers(userList);
      })
      .catch(() => {
        if (!cancelled) setUsers([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingUsers(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const loadTasks = useCallback(
    async (sync = false) => {
      if (!token) return;
      setIsLoadingTasks(true);
      setError(null);
      try {
        const tasks = await fetchTasks(token, {
          from: fromDate,
          to: toDate,
          user: selectedUser,
          sync,
        });
        setDays(tasks.days);
      } catch (err) {
        const message =
          err instanceof TrackerApiError ? err.detail : 'Failed to load tasks';
        setError(message);
        setDays([]);
      } finally {
        setIsLoadingTasks(false);
      }
    },
    [token, fromDate, toDate, selectedUser],
  );

  useEffect(() => {
    loadTasks(false);
  }, [loadTasks]);

  const isLoading = isLoadingUsers || isLoadingTasks;

  const reportDate = changelogReportDate(fromDate, toDate);

  const handleGenerateChangelog = async () => {
    if (!token) return;
    setIsGeneratingChangelog(true);
    setChangelogError(null);
    setChangelogSuccess(null);
    try {
      const result = await generateDailyChangelog(token, reportDate, true);
      setChangelogSuccess(
        `Report generated for ${result.date} (${result.commit_count} commit${result.commit_count === 1 ? '' : 's'}). Downloading…`,
      );
      await downloadDailyChangelog(token, reportDate);
    } catch (err) {
      const message =
        err instanceof TrackerApiError
          ? err.detail
          : 'Failed to generate daily report';
      setChangelogError(message);
    } finally {
      setIsGeneratingChangelog(false);
    }
  };

  const handleDownloadChangelog = async () => {
    if (!token) return;
    setIsDownloadingChangelog(true);
    setChangelogError(null);
    try {
      await downloadDailyChangelog(token, reportDate);
    } catch (err) {
      const message =
        err instanceof TrackerApiError
          ? err.detail
          : 'Failed to download changelog';
      if (err instanceof TrackerApiError && err.status === 404) {
        setChangelogError(
          `No report yet for ${reportDate}. Use Generate daily report to build it from commits through now.`,
        );
      } else {
        setChangelogError(message);
      }
    } finally {
      setIsDownloadingChangelog(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 lg:px-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Changelog uses the &quot;To&quot; date ({reportDate}): commits from 00:00 IST through
              now when that day is today. Nightly cron at 00:00 IST refreshes the previous day.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              disabled={isGeneratingChangelog || isDownloadingChangelog}
              onClick={() => handleGenerateChangelog()}
            >
              {isGeneratingChangelog ? 'Generating…' : 'Generate daily report'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isDownloadingChangelog || isGeneratingChangelog}
              onClick={() => handleDownloadChangelog()}
            >
              {isDownloadingChangelog ? 'Downloading…' : 'Download report'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isLoadingTasks}
              onClick={() => loadTasks(true)}
            >
              Sync from CodeCommit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>User</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser} disabled={isLoadingUsers}>
              <SelectTrigger>
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.email || user.name} value={user.name}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="from-date">From</Label>
            <Input
              id="from-date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="to-date">To</Label>
            <Input
              id="to-date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {changelogSuccess && (
        <Card className="border-emerald-500/40">
          <CardContent className="pt-6 text-sm text-emerald-700 dark:text-emerald-400">
            {changelogSuccess}
          </CardContent>
        </Card>
      )}

      {changelogError && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6 text-sm text-destructive">{changelogError}</CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : days.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            No tasks found for the selected filters.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {days.map((day) => (
            <Card key={`${day.date}-${day.user}`}>
              <CardHeader>
                <CardTitle className="text-base">{formatDate(day.date)}</CardTitle>
                <CardDescription>{day.user}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {day.entries.map((entry, index) => (
                  <div
                    key={`${entry.repo}-${index}`}
                    className="rounded-lg border bg-muted/30 p-4"
                  >
                    <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {entry.repo}
                    </div>
                    <p className="text-sm">{entry.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {entry.tickets.map((ticket) => (
                        <Badge key={ticket} variant="secondary">{ticket}</Badge>
                      ))}
                      <span className="text-xs text-muted-foreground">{entry.hours}h</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
