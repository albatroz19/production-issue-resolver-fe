export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type CallPathRole =
  | 'ENTRY_CONTROLLER'
  | 'ENTRY_SERVICE'
  | 'PROXY_CALL'
  | 'DOWNSTREAM_CONTROLLER'
  | 'DOWNSTREAM_SERVICE';

export interface IncidentRequest {
  service: string;
  environment?: string;
  apiPath?: string;
  httpStatus?: number;
  errorMessage?: string;
  stackTrace: string;
  recentLogs?: string;
  relatedServices?: string[];
}

export interface AffectedFile {
  repo: string;
  path: string;
  lines: string;
  role?: CallPathRole;
}

export interface CallPathStep {
  repo: string;
  className: string;
  methodName: string;
  path: string;
  line: number;
  role: CallPathRole;
  snippet?: string;
}

export interface DiagnosisResponse {
  rootCause: string;
  confidence: ConfidenceLevel;
  affectedFiles: AffectedFile[];
  suggestedFix: string;
  reasoningSteps: string[];
  relatedIncidents: string[];
  environment?: string;
  indexedBranch?: string;
  indexedCommit?: string;
  downstreamService?: string;
  downstreamPath?: string;
  callPath?: CallPathStep[];
}

export class ApiError extends Error {
  readonly status: number;
  readonly detail?: string;

  constructor(message: string, status: number, detail?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}
