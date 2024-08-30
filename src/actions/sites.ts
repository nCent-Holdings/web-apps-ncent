import { OrgSiteModel } from '../api-types/models';
import { coreAPI } from '../apiSingleton';
import credentialsManager from '../credentialsManager';
import { CreateOrUpdateSiteDto } from '@src/api/CoreAPI/types';

export type { CreateOrUpdateSiteDto };

export async function getFirstSiteByOrgIdAndHandle(
  organizationId: string,
  siteHandle?: string,
): Promise<OrgSiteModel | undefined> {
  const installationId = credentialsManager.getWellCubeInstallationId();

  const [site] = await coreAPI.sites.get({ organizationId, siteHandle }, installationId);

  return site;
}

export const validateSiteName = async (
  organizationId: string,
  siteName: string,
  siteId: string,
): Promise<{ isValid: boolean; errorText?: string }> => {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.sites.validateName(organizationId, siteName, siteId, installationId);
};

export const validateSiteHandle = async (
  organizationId: string,
  siteHandle: string,
  siteId?: string,
): Promise<{ isValid: boolean; errorText?: string }> => {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.sites.validateHandle({ organizationId, siteHandle, siteId }, installationId);
};

export const deleteSite = async (siteId: string): Promise<OrgSiteModel> => {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.sites.deleteSite(siteId, installationId);
};

export const updateSite = async (siteId: string, siteData: Partial<CreateOrUpdateSiteDto>): Promise<OrgSiteModel> => {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.sites.updateSite(siteId, siteData, installationId);
};

export const createSite = async (organizationId: string, siteData: CreateOrUpdateSiteDto): Promise<OrgSiteModel> => {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.sites.createSite(organizationId, siteData, installationId);
};

export const addAdmin = async (siteIds: string[], userId: string) => {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.sites.addAdmin(siteIds, userId, installationId);
};

export const addExternal = async (siteIds: string[], userId: string) => {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.sites.addExternal(siteIds, userId, installationId);
};

export async function removeAdmin(siteId: string, userId: string): Promise<OrgSiteModel> {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.sites.removeAdmin(siteId, userId, installationId);
}

export async function removeExternal(siteId: string, userId: string): Promise<OrgSiteModel> {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.sites.removeExternal(siteId, userId, installationId);
}
