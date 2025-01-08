import { coreAPI } from '@src/apiSingleton';
import { resetApp } from '@src/app-store/store';
import credentialsManager from '@src/credentialsManager';

export function registerReconnectHandler() {
  coreAPI.multiInstallationClient.onConnected(async () => {
    const installationId = credentialsManager.getNcentInstallationId();
    await coreAPI.multiInstallationClient.enableListenings();
    if (installationId) await coreAPI.multiInstallationClient.listenToInstallations([installationId]);

    resetApp();
  });
}
