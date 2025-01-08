import { coreAPI } from '../apiSingleton';
import credentialsManager from '../credentialsManager';
import { DeviceModel, GatewayModel } from '../api-types/models';

export const getGateways = async (siteId: string): Promise<Array<GatewayModel>> => {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.gateways.getGateways(siteId, installationId);
};

export const getGatewayDevices = async (
  gatewayId: string,
  params?: { commissioned?: boolean },
): Promise<Array<DeviceModel>> => {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.gateways.getGatewayDevices(gatewayId, params, installationId);
};

export const getGatewaysDevices = async (
  gatewaysIds: string[],
  params?: { commissioned?: boolean },
): Promise<Array<DeviceModel>> => {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.gateways.getGatewaysDevices(gatewaysIds, params, installationId);
};
