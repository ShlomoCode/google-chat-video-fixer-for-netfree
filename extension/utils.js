export async function getInstallationUUID() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'getInstallationUUID' }, (response) => {
      resolve(response.installationUUID);
    });
  });
}

export function generateUUID() {
  return crypto.randomUUID();
}
