import { Badge } from '@/components/ui/badge';
import type { ConfidenceLevel } from '@/types/incident';

const confidenceConfig: Record<ConfidenceLevel, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  HIGH: { label: 'High confidence', variant: 'success' },
  MEDIUM: { label: 'Medium confidence', variant: 'warning' },
  LOW: { label: 'Low confidence', variant: 'danger' },
};

interface ConfidenceBadgeProps {
  confidence: ConfidenceLevel;
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const config = confidenceConfig[confidence];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
