import { jwtDecode } from 'jwt-decode';
import { CloudUser } from '../api/CloudAPI/models';
import { cloudAPI, coreAPI, cognitoAPI } from '../apiSingleton';
import config from '../config';
import credentialsManager from '../credentialsManager';
import { Exception } from '../lib/X';
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
  console.log('Fetch product id');

  const [product] = await cloudAPI.products.list({ name: config.productId });

  if (!product) {
    throw new Exception('NO_PRODUCTS');
  }

  console.log('Fetch product id - success', product);

  console.log('Fetch product installations');

  const [installation] = await cloudAPI.installations.list({
    productId: product.id,
    productIsPrimary: true,
  });

  if (!installation) {
    throw new Exception('NO_INSTALLATIONS');
  }

  console.log('Fetch product installations - success', installation);

  console.log('Fetch local accounts');

  const { localAccounts } = installation;

  let localAccount = localAccounts.find((la) => la.isPrimary);

  // If there isn't a primary local account, fall back and use the first listed
  if (!localAccount && localAccounts.length) {
    localAccount = localAccounts[0];
  }

  if (!localAccount) {
    throw new Exception('NO_LOCAL_ACCOUNTS');
  }

  console.log('Fetch local accounts - success', localAccount);

  console.log('Connect to InternetUGW');

  await coreAPI.multiInstallationClient.connect();

  credentialsManager.set(localAccount.installationId, {
    installationId: localAccount.installationId,
    manipulatorId: localAccount.localUserId,
    accessToken: localAccount.localUserToken,
  });

  console.log('Connect to InternetUGW - success');

  console.log('Validate manipulator credentials');
  const userState = await coreAPI.manipulators.validateCredentials(
    localAccount.localUserId,
    localAccount.localUserToken,
    localAccount.installationId,
  );

  credentialsManager.setWellCubeCoreId(localAccount.installationId);

  console.log('Validate manipulator credentials - success', userState);

  console.log('Load hubs credentials');
  await loadHubsCredentials(product.id);
  console.log('Load hubs credentials - success', credentialsManager.getAll());

  console.log('Enable listenings');
  try {
    await coreAPI.multiInstallationClient.enableListenings();
  } catch (e: any) {
    if (e.message !== 'CLIENT_ALREADY_REGISTERED') throw e;
  }
  const listenings = await coreAPI.multiInstallationClient.listenToInstallations([localAccount.installationId]);
  console.log('Enable listenings - success', listenings);

  const wcRoles = await coreAPI.manipulators.getGroups(localAccount.localUserId, localAccount.installationId);
  const mappedRoles = wcRoles.map((role: { id: string; name: string }) => role.name);

  credentialsManager.setWellCubeRoles(mappedRoles);

  return localAccount.installationId;
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
  return credentialsManager.getWellCubeRoles();
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
