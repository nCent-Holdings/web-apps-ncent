import { UserModel } from '../api-types/models';
import { coreAPI } from '../apiSingleton';
import credentialsManager from '../credentialsManager';

export async function findUserByEmail(email: string): Promise<UserModel | null> {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.system.findUserByEmail(email, installationId);
}

export async function addUserToOrganization(userId: string, organizationId: string): Promise<void> {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.system.addUserToOrganization(userId, organizationId, installationId);
}
