import { jwtDecode } from 'jwt-decode';
import { CloudUser } from '../api/CloudAPI/models';
import { cloudAPI, coreAPI, cognitoAPI } from '../apiSingleton';
import credentialsManager from '../credentialsManager';
import lastSiteStorage from '@src/utils/lastSiteStorage';

const CLOUD_JWT_STORAGE_KEY = 'cloud_auth'; // Keep the same key as in ux-framework

export async function restore(): Promise<string> {
  await restoreCloud();
  return await loginToCore();
}

async function restoreCloud() {
  const storedJWT = localStorage.getItem(CLOUD_JWT_STORAGE_KEY);
  if (!storedJWT) {
    throw new Error('RESTORE_FAILED');
  }

  const jwt = JSON.parse(storedJWT);

  cloudAPI.apiClient.setAuthToken(jwt);
}

export async function loginToCognito(
  email: string,
  password: string,
  onCodeRequested: {
    (error?: any): Promise<{ action: 'confirm' | 'resend'; value: any }>;
  },
): Promise<string> {
  console.log('Login in to Cognito');

  const { jwt } = await cognitoAPI.session.login(email, password, onCodeRequested);

  console.log('Login in to Cognito - success');

  return jwt;
}

export async function loginToCloud(email: string, password: string): Promise<string> {
  console.log('Login in to Cloud BE');

  const { jwt } = await cloudAPI.session.login(email, password);

  console.log('Login in to Cloud BE - success');

  return jwt;
}

async function loginToCore(): Promise<string> {
  const jwt = cloudAPI.apiClient.getAuthToken();
  const decodedJwt = jwtDecode(jwt);

  const installationId = credentialsManager.getNcentInstallationId() || 'e7b64ddf-72e6-4f55-83ee-bb7f1bb32931';
  const manipulatorId = decodedJwt.sub || '';
  const accessToken = (decodedJwt as any)['custom:accessToken'];

  console.log('Connect to InternetUGW');

  await coreAPI.multiInstallationClient.connect();

  credentialsManager.set(installationId, {
    installationId: installationId,
    manipulatorId: manipulatorId,
    accessToken: accessToken,
  });

  console.log('Connect to InternetUGW - success');

  console.log('Validate manipulator credentials');
  const userState = await coreAPI.manipulators.validateCredentials(manipulatorId, accessToken, installationId);

  credentialsManager.setNcentCoreId(installationId);

  console.log('Validate manipulator credentials - success', userState);

  // console.log('Load hubs credentials');
  // await loadHubsCredentials(product.id);
  // console.log('Load hubs credentials - success', credentialsManager.getAll());

  console.log('Enable listenings');
  try {
    await coreAPI.multiInstallationClient.enableListenings();
  } catch (e: any) {
    if (e.message !== 'CLIENT_ALREADY_REGISTERED') throw e;
  }
  const listenings = await coreAPI.multiInstallationClient.listenToInstallations([installationId]);
  console.log('Enable listenings - success', listenings);

  const wcRoles = await coreAPI.manipulators.getGroups(manipulatorId, installationId);
  const mappedRoles = wcRoles.map((role: { id: string; name: string }) => role.name);

  credentialsManager.setNcentRoles(mappedRoles);

  return installationId;
}

export async function logout(): Promise<void> {
  credentialsManager.clear();
  lastSiteStorage.clear();
  localStorage.removeItem(CLOUD_JWT_STORAGE_KEY);
  cloudAPI.apiClient.clear();

  // await coreAPI.multiInstallationClient.clear()
  await coreAPI.multiInstallationClient.disconnect();
}

export function setCloudJwt(cloudJwt: string) {
  localStorage.setItem(CLOUD_JWT_STORAGE_KEY, JSON.stringify(cloudJwt));
}

export function getAuthorizedUserData(): CloudUser {
  return jwtDecode(cloudAPI.apiClient.getAuthToken());
}

export function getUserRoles(): string[] {
  return credentialsManager.getNcentRoles();
}

export async function loadHubsCredentials(productId: string): Promise<void> {
  const installations = await cloudAPI.installations.list({ productId });

  const localAccounts = installations.map((installation) => installation.localAccounts).flat();

  for (const localAccount of localAccounts) {
    if (localAccount.isPrimary) {
      credentialsManager.set(localAccount.installationId, {
        installationId: localAccount.installationId,
        manipulatorId: localAccount.localUserId,
        accessToken: localAccount.localUserToken,
      });
    }
  }
}
