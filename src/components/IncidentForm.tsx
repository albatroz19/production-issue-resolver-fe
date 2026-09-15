import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { Textarea } from '@/components/ui/textarea';
import { demoTestCases } from '@/lib/demoIncident';
import { parseApiUrl } from '@/lib/parseApiUrl';
import type { IncidentRequest } from '@/types/incident';

const incidentSchema = z.object({
  service: z.string().trim().min(1, 'Service is required'),
  environment: z.string().optional(),
  apiPath: z.string().optional(),
  httpStatus: z.union([z.coerce.number().int().positive(), z.literal('')]).optional(),
  errorMessage: z.string().optional(),
  stackTrace: z.string().trim().min(1, 'Stack trace is required'),
  recentLogs: z.string().optional(),
  relatedServices: z.array(z.string()),
});

type IncidentFormValues = z.infer<typeof incidentSchema>;

interface IncidentFormProps {
  isLoading: boolean;
  onSubmit: (request: IncidentRequest) => Promise<void>;
  onClearResult: () => void;
}

const emptyValues: IncidentFormValues = {
  service: '',
  environment: 'dev',
  apiPath: '',
  httpStatus: '',
  errorMessage: '',
  stackTrace: '',
  recentLogs: '',
  relatedServices: [],
};

export function IncidentForm({ isLoading, onSubmit, onClearResult }: IncidentFormProps) {
  const [relatedServiceInput, setRelatedServiceInput] = useState('');
  const [apiUrlInput, setApiUrlInput] = useState('');
  const [selectedTestCaseId, setSelectedTestCaseId] = useState(demoTestCases[0].id);

  const form = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentSchema),
    defaultValues: emptyValues,
  });

  const relatedServices = form.watch('relatedServices');

  useEffect(() => {
    const subscription = form.watch(() => onClearResult());
    return () => subscription.unsubscribe();
  }, [form, onClearResult]);

  const addRelatedService = () => {
    const value = relatedServiceInput.trim();
    if (!value || relatedServices.includes(value)) {
      return;
    }

    form.setValue('relatedServices', [...relatedServices, value], { shouldDirty: true });
    setRelatedServiceInput('');
  };

  const removeRelatedService = (service: string) => {
    form.setValue(
      'relatedServices',
      relatedServices.filter((item) => item !== service),
      { shouldDirty: true },
    );
  };

  const loadDemo = (caseId = demoTestCases[0].id) => {
    const testCase = demoTestCases.find((item) => item.id === caseId) ?? demoTestCases[0];
    setSelectedTestCaseId(testCase.id);

    form.reset({
      ...testCase.request,
      httpStatus: testCase.request.httpStatus ?? '',
      relatedServices: testCase.request.relatedServices ?? [],
    });
    onClearResult();
  };

  const clearForm = () => {
    form.reset(emptyValues);
    setRelatedServiceInput('');
    onClearResult();
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    const request: IncidentRequest = {
      service: values.service,
      environment: values.environment || undefined,
      apiPath: values.apiPath || undefined,
      httpStatus: values.httpStatus === '' ? undefined : values.httpStatus,
      errorMessage: values.errorMessage || undefined,
      stackTrace: values.stackTrace,
      recentLogs: values.recentLogs || undefined,
      relatedServices: values.relatedServices,
    };

    await onSubmit(request);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident details</CardTitle>
        <CardDescription>
          Provide the service context, stack trace, and optional logs for diagnosis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="apiUrl">Paste API URL (optional)</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="apiUrl"
                placeholder="https://adams-dev-api.tataplay.com/ad-management-service/api/v1/campaign-ch-100?offset=0&limit=10000"
                value={apiUrlInput}
                onChange={(event) => setApiUrlInput(event.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const parsed = parseApiUrl(apiUrlInput);
                  if (!parsed) {
                    return;
                  }
                  if (parsed.environment) {
                    form.setValue('environment', parsed.environment);
                  }
                  if (parsed.service) {
                    form.setValue('service', parsed.service);
                  }
                  if (parsed.apiPath) {
                    form.setValue('apiPath', parsed.apiPath);
                  }
                  if (parsed.service === 'ad-management-service' && !relatedServices.includes('campaign-management-service')) {
                    form.setValue('relatedServices', [...relatedServices, 'campaign-management-service']);
                  }
                  onClearResult();
                }}
              >
                Parse URL
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Auto-fills environment, service, and API path from a dev/uat/prod Adams API URL.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="service">Service *</Label>
              <Input id="service" placeholder="ad-management-service" {...form.register('service')} />
              {form.formState.errors.service && (
                <p className="text-sm text-destructive">{form.formState.errors.service.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Environment</Label>
              <Select
                value={form.watch('environment') || 'dev'}
                onValueChange={(value) => form.setValue('environment', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dev">dev</SelectItem>
                  <SelectItem value="uat">uat</SelectItem>
                  <SelectItem value="prod">prod</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="apiPath">API path</Label>
              <Input
                id="apiPath"
                placeholder="/api/v1/campaign-ch-100/multi-channel/filler-slots"
                {...form.register('apiPath')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="httpStatus">HTTP status</Label>
              <Input id="httpStatus" type="number" placeholder="500" {...form.register('httpStatus')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="errorMessage">Error message</Label>
              <Input id="errorMessage" placeholder="NullPointerException" {...form.register('errorMessage')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stackTrace">Stack trace *</Label>
            <Textarea
              id="stackTrace"
              rows={8}
              className="font-mono text-xs"
              placeholder="Paste the full Java stack trace..."
              {...form.register('stackTrace')}
            />
            {form.formState.errors.stackTrace && (
              <p className="text-sm text-destructive">{form.formState.errors.stackTrace.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="recentLogs">Recent logs</Label>
            <Textarea
              id="recentLogs"
              rows={4}
              className="font-mono text-xs"
              placeholder="Optional recent log lines..."
              {...form.register('recentLogs')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relatedServices">Related services</Label>
            <div className="flex gap-2">
              <Input
                id="relatedServices"
                placeholder="campaign-management-service"
                value={relatedServiceInput}
                onChange={(event) => setRelatedServiceInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addRelatedService();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={addRelatedService}>
                Add
              </Button>
            </div>
            {relatedServices.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {relatedServices.map((service) => (
                  <button
                    key={service}
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full border bg-muted px-3 py-1 text-xs"
                    onClick={() => removeRelatedService(service)}
                  >
                    {service}
                    <Trash2 className="h-3 w-3 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Load test case</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Select
                  value={selectedTestCaseId}
                  onValueChange={(value) => loadDemo(value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="sm:min-w-[280px]">
                    <SelectValue placeholder="Choose a test case" />
                  </SelectTrigger>
                  <SelectContent>
                    {demoTestCases.map((testCase) => (
                      <SelectItem key={testCase.id} value={testCase.id}>
                        {testCase.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">
                {demoTestCases.find((item) => item.id === selectedTestCaseId)?.description
                  ?? 'Pick a preset to auto-fill the form, then click Analyze incident.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                Analyze incident
              </Button>
              <Button type="button" variant="outline" onClick={() => loadDemo()} disabled={isLoading}>
                Load golden case
              </Button>
              <Button type="button" variant="ghost" onClick={clearForm} disabled={isLoading}>
                Clear
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
