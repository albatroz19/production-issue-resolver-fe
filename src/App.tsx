import { useEffect, useState } from 'react';

import { DiagnosisResult } from '@/components/DiagnosisResult';
import { Header } from '@/components/Header';
import { IncidentForm } from '@/components/IncidentForm';
import { getStoredApiKey, setStoredApiKey, useAnalyzeIncident } from '@/hooks/useAnalyzeIncident';
import type { IncidentRequest } from '@/types/incident';

function App() {
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
    <div className="min-h-screen bg-background">
      <Header apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-2 lg:px-6">
        <IncidentForm isLoading={isLoading} onSubmit={handleSubmit} onClearResult={reset} />
        <DiagnosisResult result={result} error={error} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default App;
