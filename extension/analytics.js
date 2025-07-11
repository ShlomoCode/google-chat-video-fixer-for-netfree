import { SERVER_HOST } from './config.js';
import { getInstallationUUID } from './utils.js';

export async function sendEvent(type) {
  try {
    const installationUUID = await getInstallationUUID();
    fetch(`${SERVER_HOST}/api/event`, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, installationUUID }),
    });
  } catch {}
}
