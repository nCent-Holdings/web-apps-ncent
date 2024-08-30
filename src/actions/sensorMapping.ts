import { coreAPI } from '../apiSingleton';
import credentialsManager from '../credentialsManager';
import { SensorData } from '../types/SensorMapping';

export async function addSensor(spaceId: string, sensorData: SensorData): Promise<void> {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.sensorMapping.addExternalSensor(spaceId, sensorData, installationId);
}

export async function updateSensor(spaceId: string, sensorData: SensorData): Promise<void> {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.sensorMapping.updateSensorPollutant(spaceId, sensorData, installationId);
}

export async function removeSensor(spaceId: string, sensorData: SensorData): Promise<void> {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.sensorMapping.removeExternalSensor(spaceId, sensorData, installationId);
}
