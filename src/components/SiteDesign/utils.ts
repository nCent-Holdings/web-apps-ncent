import { DeviceModel, SpaceModel } from '@src/api-types/models';

type TSensorsMap = SpaceModel['wellcube/sensor_mapping']['sensors_map'];

export function getExternalDevicesNoun(sensorsMap: TSensorsMap): string {
  const sensorsIds: string[] = [];

  for (const sensorId of Object.keys(sensorsMap)) {
    if (!sensorsMap[sensorId].local) {
      sensorsIds.push(sensorId);
    }
  }

  return sensorsIds.map((sensorId) => `(id=${sensorId})`).join('|');
}

export function getDevicesNounFromSpacesIds(spacesIds: string[]): string {
  return spacesIds.map((spaceId) => `(wellcube/device.space_id=${spaceId})`).join('|');
}

export function filterAndDumpDevicesForPollutant(devices: DeviceModel[], pollutant: string, sensorsMap: TSensorsMap) {
  const filteredDevices = devices.filter((device) => {
    return sensorsMap[device.id] && pollutant in sensorsMap[device.id].pollutant_enabled;
  });

  const dumpedDevices = filteredDevices.map((device) => ({
    id: device.id,
    name: device.name,
    fullPath: device['wellcube/location']?.full_path || '',
    local: sensorsMap[device.id].local,
    enabled: sensorsMap[device.id].pollutant_enabled[pollutant],
  }));

  return dumpedDevices;
}
