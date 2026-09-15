import { KeyRound, SearchCode } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface HeaderProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
}

export function Header({ apiKey, onApiKeyChange }: HeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <SearchCode className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Production Issue Resolver</h1>
            <p className="text-sm text-muted-foreground">
              Submit incident details and receive a structured diagnosis from the Java orchestrator.
            </p>
          </div>
        </div>

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
            onChange={(event) => onApiKeyChange(event.target.value)}
            autoComplete="off"
          />
        </div>
      </div>
    </header>
  );
}
