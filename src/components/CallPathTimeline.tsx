import { ArrowDown, Code2 } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import type { CallPathStep } from '@/types/incident';

const ROLE_LABELS: Record<CallPathStep['role'], string> = {
  ENTRY_CONTROLLER: 'AMS controller',
  ENTRY_SERVICE: 'AMS service',
  PROXY_CALL: 'Proxy call',
  DOWNSTREAM_CONTROLLER: 'CMS controller',
  DOWNSTREAM_SERVICE: 'CMS service',
};

interface CallPathTimelineProps {
  steps: CallPathStep[];
}

export function CallPathTimeline({ steps }: CallPathTimelineProps) {
  if (steps.length === 0) {
    return <p className="text-sm text-muted-foreground">No call path traced.</p>;
  }

  return (
    <div className="space-y-0">
      {steps.map((step, index) => (
        <div key={`${step.repo}-${step.path}-${step.line}-${step.role}`} className="relative">
          {index > 0 && (
            <div className="flex justify-center py-2">
              <ArrowDown className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <div className="rounded-lg border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{ROLE_LABELS[step.role]}</Badge>
              <span className="font-medium text-sm">
                {step.className}.{step.methodName}
              </span>
              <span className="text-xs text-muted-foreground">line {step.line}</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <span className="font-medium">{step.repo}</span>
              <span className="mx-1">·</span>
              <code className="break-all">{step.path}</code>
            </div>
            {step.snippet && (
              <Accordion type="single" collapsible className="mt-3">
                <AccordionItem value="snippet" className="border-none">
                  <AccordionTrigger className="py-2 text-xs hover:no-underline">
                    <span className="flex items-center gap-2">
                      <Code2 className="h-3.5 w-3.5" />
                      View code snippet
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <pre className="max-h-64 overflow-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
                      {step.snippet}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
