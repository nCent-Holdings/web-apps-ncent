import { OrganizationModel } from '../api-types/models';
import { cloudAPI, coreAPI } from '../apiSingleton';
import credentialsManager from '../credentialsManager';
import { type CreateOrUpdateOrganizationDto, type UpdateSalesManagerDto } from '@src/api/CoreAPI/types';

export async function invite(email: string, groupId: string): Promise<void> {
  const installationId = credentialsManager.getNcentInstallationId();

  if (!installationId) {
    return;
  }

  await cloudAPI.localAccounts.transfer({
    email,
    installationId,
    type: 'share',
    userToTransferRoleId: groupId,
    userToTransferName: email.split('@')[0].replace('.', '_'),
  });
}

export async function getFirstOrgByHandle(orgHandle?: string): Promise<OrganizationModel | undefined> {
  const installationId = credentialsManager.getNcentInstallationId();

  const [organization] = await coreAPI.organizations.get({ orgHandle }, installationId);

  return organization;
}

export const validateOrgName = async (orgName: string): Promise<{ isValid: boolean; errorText?: string }> => {
  if (orgName === '') {
    return { isValid: false, errorText: 'Organization name cannot be empty.' };
  }
  // } else if (false /* Contains bad characters */) {
  //   return {
  //     isValid: false,
  //     errorText: 'Organization name contains invalid characters.',
  //   };
  // }

  const installationId = credentialsManager.getNcentInstallationId();

  const orgList = await coreAPI.organizations.get({ orgName }, installationId);

  if (orgList.length > 0) {
    return {
      isValid: false,
      errorText: `Organization name is already in use.`,
    };
  }

  return { isValid: true };
};

export const validateOrgHandle = async (
  orgHandle: string,
  organizationId?: string,
): Promise<{ isValid: boolean; errorText?: string }> => {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.organizations.validateHandle({ orgHandle, organizationId }, installationId);
};

export async function updateOrg(orgId: string, orgData: Partial<CreateOrUpdateOrganizationDto>): Promise<void> {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.organizations.update(orgId, orgData, installationId);
}

export const createOrg = async (orgData: CreateOrUpdateOrganizationDto): Promise<any> => {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.organizations.create(orgData, installationId);
};

export const countOrgSites = async (organizationId: string): Promise<number> => {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.organizations.countOrgSites(organizationId, installationId);
};

export const deleteOrg = async (orgId: string): Promise<void> => {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.organizations.deleteOrg(orgId, installationId);
};

export const addAdmin = async (orgId: string, userId: string) => {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.organizations.addAdmin(orgId, userId, installationId);
};

export async function removeAdmin(orgId: string, userId: string): Promise<OrganizationModel> {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.organizations.removeAdmin(orgId, userId, installationId);
}

export async function updateSalesManager(
  orgId: string,
  salesManagerData: Partial<UpdateSalesManagerDto>,
): Promise<void> {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.organizations.updateSalesManager(orgId, salesManagerData, installationId);
}
