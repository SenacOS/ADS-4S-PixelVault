import { Platform } from 'react-native';

export const SCREEN_INVENTORY = Object.freeze([
  'wf01',
  'wf02',
  'wf03',
  'wf04',
  'wf05',
  'wf06',
  'wf07',
  'wf08',
  'wf09',
  'wf10-new',
  'wf10-edit',
  'wf11',
]);

export const STATE_INVENTORY = Object.freeze(['st01', 'st02', 'st03', 'st04', 'st05']);

export const DEMO_ROUTE_IDS = Object.freeze([...SCREEN_INVENTORY, ...STATE_INVENTORY]);

function getWebSearchParams() {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.location?.search) {
    return null;
  }

  return new URLSearchParams(window.location.search);
}

export function getInitialDemoRoute() {
  const requested = getWebSearchParams()?.get('screen');
  return DEMO_ROUTE_IDS.includes(requested) ? requested : 'wf01';
}

export function getEvidenceFontScale() {
  return getWebSearchParams()?.get('fontScale') === '1.3' ? 1.3 : 1;
}
