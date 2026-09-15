import { AlertCircle, GitBranch, Lightbulb, ListChecks, Network, Route, Target } from 'lucide-react';

import { AffectedFilesList } from '@/components/AffectedFilesList';
import { CallPathTimeline } from '@/components/CallPathTimeline';
import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import { ReasoningSteps } from '@/components/ReasoningSteps';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import type { DiagnosisResponse } from '@/types/incident';
import { ApiError } from '@/types/incident';

interface DiagnosisResultProps {
  result: DiagnosisResponse | null;
  error: ApiError | null;
  isLoading: boolean;
}

export function DiagnosisResult({ result, error, isLoading }: DiagnosisResultProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyzing incident</CardTitle>
          <CardDescription>Analysis may take up to 60 seconds while the orchestrator runs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>{error.message}</AlertTitle>
        {error.detail && <AlertDescription>{error.detail}</AlertDescription>}
      </Alert>
    );
  }

  if (!result) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Diagnosis</CardTitle>
          <CardDescription>
            Submit an incident to see root cause, confidence, affected files, and suggested fix.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Diagnosis</CardTitle>
            <CardDescription>Structured response from the issue resolver.</CardDescription>
          </div>
          <ConfidenceBadge confidence={result.confidence} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {(result.environment || result.indexedBranch || result.downstreamPath) && (
          <section className="rounded-lg border bg-muted/40 p-4 text-sm">
            <div className="mb-2 flex items-center gap-2 font-medium">
              <GitBranch className="h-4 w-4 text-primary" />
              Environment context
            </div>
            <dl className="grid gap-2 sm:grid-cols-2">
              {result.environment && (
                <div>
                  <dt className="text-muted-foreground">Environment</dt>
                  <dd className="font-medium">{result.environment}</dd>
                </div>
              )}
              {result.indexedBranch && (
                <div>
                  <dt className="text-muted-foreground">Indexed branch</dt>
                  <dd className="font-medium">{result.indexedBranch}</dd>
                </div>
              )}
              {result.indexedCommit && (
                <div>
                  <dt className="text-muted-foreground">Indexed commit</dt>
                  <dd className="font-mono text-xs">{result.indexedCommit}</dd>
                </div>
              )}
              {result.downstreamService && (
                <div>
                  <dt className="text-muted-foreground">Downstream service</dt>
                  <dd className="font-medium">{result.downstreamService}</dd>
                </div>
              )}
            </dl>
            {result.downstreamPath && (
              <div className="mt-3 flex items-start gap-2">
                <Network className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <div className="text-muted-foreground">Downstream path</div>
                  <code className="break-all text-xs">{result.downstreamPath}</code>
                </div>
              </div>
            )}
          </section>
        )}

        <section className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Target className="h-4 w-4 text-primary" />
            Root cause
          </div>
          <p className="text-sm leading-relaxed">{result.rootCause}</p>
        </section>

        <Separator />

        <section className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Lightbulb className="h-4 w-4 text-primary" />
            Suggested fix
          </div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed">
            {result.suggestedFix}
          </div>
        </section>

        {result.callPath && result.callPath.length > 0 && (
          <>
            <Separator />
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Route className="h-4 w-4 text-primary" />
                Call path
              </div>
              <CallPathTimeline steps={result.callPath} />
            </section>
          </>
        )}

        <Separator />

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ListChecks className="h-4 w-4 text-primary" />
            Affected files
          </div>
          <AffectedFilesList files={result.affectedFiles} />
        </section>

        <Separator />

        <section className="space-y-2">
          <ReasoningSteps steps={result.reasoningSteps} />
        </section>

        <Separator />

        <section className="space-y-2">
          <div className="text-sm font-medium">Related incidents</div>
          {result.relatedIncidents.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {result.relatedIncidents.map((incident) => (
                <li key={incident}>{incident}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No related incidents found (Phase 2 feature).</p>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
