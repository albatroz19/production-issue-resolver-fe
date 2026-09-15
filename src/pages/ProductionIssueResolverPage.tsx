import { useEffect, useState } from 'react';
import { KeyRound } from 'lucide-react';

import { DiagnosisResult } from '@/components/DiagnosisResult';
import { IncidentForm } from '@/components/IncidentForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getStoredApiKey, setStoredApiKey, useAnalyzeIncident } from '@/hooks/useAnalyzeIncident';
import type { IncidentRequest } from '@/types/incident';

export function ProductionIssueResolverPage() {
  const [apiKey, setApiKey] = useState('');
  const { result, error, isLoading, analyze, reset } = useAnalyzeIncident();

  useEffect(() => {
    setApiKey(getStoredApiKey());
  }, []);

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    setStoredApiKey(value);
  };

  const handleSubmit = async (request: IncidentRequest) => {
    await analyze(request, apiKey || undefined);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 lg:px-6">
      <div className="flex justify-end">
        <div className="w-full max-w-sm space-y-2">
          <Label htmlFor="api-key" className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <KeyRound className="h-3.5 w-3.5" />
            API key (optional)
          </Label>
          <Input
            id="api-key"
            type="password"
            placeholder="X-POC-API-KEY"
            value={apiKey}
            onChange={(event) => handleApiKeyChange(event.target.value)}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <IncidentForm isLoading={isLoading} onSubmit={handleSubmit} onClearResult={reset} />
        <DiagnosisResult result={result} error={error} isLoading={isLoading} />
      </div>
    </div>
  );
}
