import { SensorData } from '../../types/SensorMapping';
import BaseAPI from './BaseAPI';

class SensorMappingAPI extends BaseAPI {
  async addExternalSensor(spaceId: string, sensorData: SensorData, installationId: string): Promise<void> {
    try {
      await this.multiInstallationClient.executeNVA(
        {
          noun: `id=${spaceId}`,
          verb: 'wellcube/sensor_mapping/add_external_sensor',
          adverb: {
            ...sensorData,
            enabled: true,
          },
        },
        installationId,
      );

      console.log('Added sensor mapping successfully!');
    } catch (err) {
      console.error('Error adding sensor mapping: ', { err });
      throw Error(`Error adding sensor mapping: ${err}`);
    }
  }

  async updateSensorPollutant(spaceId: string, sensorData: SensorData, installationId: string): Promise<void> {
    try {
      await this.multiInstallationClient.executeNVA(
        {
          noun: `id=${spaceId}`,
          verb: 'wellcube/sensor_mapping/update_sensor_pollutant',
          adverb: sensorData,
        },
        installationId,
      );

      console.log('Updated sensor mapping successfully!');
    } catch (err) {
      console.error('Error updating sensor mapping: ', { err });
      throw Error(`Error updating sensor mapping: ${err}`);
    }
  }

  async removeExternalSensor(spaceId: string, sensorData: SensorData, installationId: string): Promise<void> {
    try {
      await this.multiInstallationClient.executeNVA(
        {
          noun: `id=${spaceId}`,
          verb: 'wellcube/sensor_mapping/remove_external_sensor',
          adverb: sensorData,
        },
        installationId,
      );

      console.log('Removed sensor mapping successfully!');
    } catch (err) {
      console.error('Error removing sensor mapping: ', { err });
      throw Error(`Error removing sensor mapping: ${err}`);
    }
  }
}

export default SensorMappingAPI;
