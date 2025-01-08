import { GatewayModel, PurifierModel, SensorModel, SpaceModel } from '../api-types/models';
import { coreAPI } from '../apiSingleton';
import credentialsManager from '../credentialsManager';
import { type CreateOrUpdateSpaceDto } from '@src/api/CoreAPI/types';

export async function get(nouns: string[]): Promise<Array<SpaceModel>> {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.spaces.get([...nouns], installationId);
}

export async function getSpaceById(spaceId: string): Promise<SpaceModel> {
  const installationId = credentialsManager.getNcentInstallationId();

  const [spaceById] = await coreAPI.spaces.getById(spaceId, installationId);
  return spaceById;
}

export async function getSpaceByName(spaceName: string): Promise<Array<SpaceModel>> {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.spaces.getByName(spaceName, installationId);
}

export async function getOpenSpacesNearby(spaceId: string): Promise<Array<SpaceModel>> {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.spaces.getOpenSpacesNearby(spaceId, installationId);
}

export const validateSpaceName = async (
  parentId: string,
  spaceName: string,
): Promise<{ isValid: boolean; errorText?: string }> => {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.spaces.validateName(parentId, spaceName, installationId);
};

export const deleteSpace = async (spaceId: string): Promise<any> => {
  const installationId = credentialsManager.getNcentInstallationId();
  return coreAPI.spaces.deleteSpace(spaceId, installationId);
};

export const updateSpace = async (spaceId: string, spaceData: Partial<CreateOrUpdateSpaceDto>): Promise<SpaceModel> => {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.spaces.updateSpace(spaceId, spaceData, installationId);
};

export const createSpace = async (spaceData: CreateOrUpdateSpaceDto): Promise<SpaceModel> => {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.spaces.createSpace(spaceData, installationId);
};

export const moveSpace = async (spaceId: string, parentSpaceId: string, keepAssignments: boolean): Promise<any> => {
  const installationId = credentialsManager.getNcentInstallationId();
  return coreAPI.spaces.moveSpace(spaceId, parentSpaceId, keepAssignments, installationId);
};

export const getSpaceGateways = async (spaceId: string): Promise<GatewayModel[]> => {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.spaces.getSpaceGateways(spaceId, installationId);
};

export const getSpacesGateways = async (spacesIds: string[]): Promise<GatewayModel[]> => {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.spaces.getSpacesGateways(spacesIds, installationId);
};

export const getSpacesSensors = async (spacesIds: string[]): Promise<SensorModel[]> => {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.spaces.getSpacesSensors(spacesIds, installationId);
};

export const getSpacesPurifiers = async (spacesIds: string[]): Promise<PurifierModel[]> => {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.spaces.getSpacesPurifiers(spacesIds, installationId);
};

export const getSubspaces = async (spaceId: string): Promise<SpaceModel[]> => {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.spaces.getSubspaces(spaceId, installationId);
};
