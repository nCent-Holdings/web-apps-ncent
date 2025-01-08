import { DeviceModel } from '../api-types/models';
import { coreAPI } from '../apiSingleton';
import credentialsManager from '../credentialsManager';
import { SpeedValues } from '../routes/client/device-management/set-mode/types';
import { FanCfm, FanMode } from '../routes/client/device-management/types';

export const setMode = async (deviceId: string, newMode: FanMode): Promise<DeviceModel> => {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.purifiers.setMode(deviceId, newMode, installationId);
};

export const changeFanSpeedCfm = async (deviceId: string, newFanCfm: FanCfm): Promise<DeviceModel> => {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.purifiers.changeFanSpeedCfm(deviceId, newFanCfm, installationId);
};

export const changeFanSpeedPct = async (deviceId: string, newFanSpeed: SpeedValues): Promise<DeviceModel> => {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.purifiers.changeFanSpeedPct(deviceId, newFanSpeed, installationId);
};
