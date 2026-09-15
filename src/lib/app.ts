export const APP_NAME = 'Segmentation Hub';
export const APP_TAGLINE = 'Production diagnostics and daily task tracking in one place.';

export function pageTitle(section?: string): string {
  return section ? `${APP_NAME} · ${section}` : APP_NAME;
}
