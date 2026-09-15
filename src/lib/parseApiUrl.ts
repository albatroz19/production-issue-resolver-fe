export interface ParsedApiUrl {
  environment?: string;
  service?: string;
  apiPath?: string;
}

const ENV_HOST_PATTERNS: Array<{ pattern: RegExp; environment: string }> = [
  { pattern: /adams-dev-api\.tataplay\.com/i, environment: 'dev' },
  { pattern: /adams-uat-api\.tataplay\.com/i, environment: 'uat' },
  { pattern: /adams-api\.tataplay\.com/i, environment: 'prod' },
  { pattern: /adams-dev\.tataplay\.com/i, environment: 'dev' },
  { pattern: /adams-uat\.tataplay\.com/i, environment: 'uat' },
  { pattern: /adams\.tataplay\.com/i, environment: 'prod' },
];

export function parseApiUrl(rawUrl: string): ParsedApiUrl | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(trimmed);
    const environment = ENV_HOST_PATTERNS.find((entry) => entry.pattern.test(url.hostname))?.environment;

    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts.length === 0) {
      return { environment };
    }

    const service = pathParts[0];
    const apiPath = `/${pathParts.slice(1).join('/')}${url.search}`;

    return {
      environment,
      service,
      apiPath: apiPath === '/' ? undefined : apiPath,
    };
  } catch {
    return null;
  }
}
