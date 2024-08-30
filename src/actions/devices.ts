import { CreateDeviceDto } from '@src/api/CoreAPI/types';
import { DeviceModel } from '../api-types/models';
import { coreAPI } from '../apiSingleton';
import credentialsManager from '../credentialsManager';

export const updateGateway = async (deviceId: string, gatewayId: string): Promise<DeviceModel> => {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.devices.updateGateway(deviceId, gatewayId, installationId);
};

export async function get(nouns: string[]): Promise<Array<DeviceModel>> {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.devices.get([...nouns], installationId);
}

export async function getDeviceById(deviceId: string): Promise<DeviceModel> {
  const installationId = credentialsManager.getWellCubeInstallationId();

  const [deviceById] = await coreAPI.devices.getById(deviceId, installationId);
  return deviceById;
}

export async function getDeviceByName(deviceName: string): Promise<Array<DeviceModel>> {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.devices.getByName(deviceName, installationId);
}

export const validateDeviceName = async (
  spaceId: string,
  deviceName: string,
): Promise<{ isValid: boolean; message?: string }> => {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.devices.validateName(spaceId, deviceName, installationId);
};

export const validateAssetId = async (
  siteId: string,
  assetId: string,
  maxLength = 20,
): Promise<{ isValid: boolean; message?: string }> => {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.devices.validateAssetId(siteId, assetId, installationId, maxLength);
};

export const deleteDevice = async (deviceId: string): Promise<void> => {
  const installationId = credentialsManager.getWellCubeInstallationId();
  return coreAPI.devices.deleteDevice(deviceId, installationId);
};

export const createDevice = async (spaceId: string, deviceData: CreateDeviceDto): Promise<DeviceModel> => {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.devices.createDevice(spaceId, deviceData, installationId);
};

export const updateDeviceName = async (deviceId: string, deviceName: string): Promise<DeviceModel> => {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.devices.updateDeviceName(deviceId, deviceName, installationId);
};

export const updateAssetId = async (deviceId: string, assetId: string): Promise<DeviceModel> => {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.devices.updateAssetId(deviceId, assetId, installationId);
};

export const updateDeviceSetting = async (
  deviceId: string,
  model: string,
  { name: settingName, value }: { name: string; value: boolean },
): Promise<DeviceModel> => {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.devices.updateDeviceSetting(deviceId, model, settingName, value, installationId);
};

export const moveDevice = async (deviceId: string, spaceId: string, keepAssignments: boolean): Promise<void> => {
  const installationId = credentialsManager.getWellCubeInstallationId();
  return coreAPI.devices.moveDevice(deviceId, spaceId, keepAssignments, installationId);
};

export const calibrateDevice = async (
  deviceId: string,
  demoPayload?: {
    demo_succeed: boolean;
    demo_duration: number;
  },
): Promise<void> => {
  const installationId = credentialsManager.getWellCubeInstallationId();
  return coreAPI.devices.calibrateDevice(deviceId, demoPayload, installationId);
};

export const updateFirmware = async (deviceId: string, firmwareType: 'MCU' | 'HRN71'): Promise<void> => {
  const installationId = credentialsManager.getWellCubeInstallationId();
  return coreAPI.devices.updateFirmware(deviceId, firmwareType, installationId);
};

export const checkFirmware = async (deviceId: string) => {
  const installationId = credentialsManager.getWellCubeInstallationId();
  return coreAPI.devices.checkFirmware(deviceId, installationId);
};
