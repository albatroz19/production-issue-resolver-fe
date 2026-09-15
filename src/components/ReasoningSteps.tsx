import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ReasoningStepsProps {
  steps: string[];
}

export function ReasoningSteps({ steps }: ReasoningStepsProps) {
  if (steps.length === 0) {
    return <p className="text-sm text-muted-foreground">No reasoning steps returned.</p>;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="reasoning" className="border-none">
        <AccordionTrigger className="py-2 hover:no-underline">
          Reasoning steps ({steps.length})
        </AccordionTrigger>
        <AccordionContent>
          <ol className="space-y-3 pl-1">
            {steps.map((step, index) => (
              <li key={index} className="flex gap-3 text-sm leading-relaxed">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
