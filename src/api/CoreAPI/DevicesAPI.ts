import BaseAPI from './BaseAPI';
import { DeviceModel } from '@src/api-types/models';
import { CreateDeviceDto } from './types';

class DevicesAPI extends BaseAPI {
  async get(nouns: Array<string> = [], installationId: string): Promise<Array<DeviceModel>> {
    return this.multiInstallationClient.executeNVA(
      {
        noun: ['wellcube/device', ...nouns].join('.'),
        verb: 'get',
      },
      installationId,
    );
  }

  async getById(deviceId: string, installationId: string): Promise<Array<DeviceModel>> {
    return this.multiInstallationClient.executeNVA(
      {
        noun: `id=${deviceId}`,
        verb: 'get',
      },
      installationId,
    );
  }

  async getByName(deviceName: string, installationId: string): Promise<Array<DeviceModel>> {
    return this.get(['wellcube/device', `name==${deviceName}`], installationId);
  }

  async validateName(
    spaceId: string,
    deviceName: string,
    installationId: string,
  ): Promise<{ isValid: boolean; message: string }> {
    // Make sure the name isn't empty
    if (deviceName === '') {
      return { isValid: false, message: 'Device name cannot be empty.' };
      // Make sure the name doesn't have any invalid characters
    } else if (deviceName.length > 60) {
      return {
        isValid: false,
        message: 'Device names cannot be more than 60 characters.',
      };
    }
    // else if (false /* Contains bad characters */) {
    //   return {
    //     isValid: false,
    //     message: 'Device name contains invalid characters.',
    //   };
    // }

    const payload = {
      noun: `id=${spaceId}`,
      verb: 'wellcube/space/validate_device_name',
      adverb: {
        name: deviceName,
      },
    };

    const validationResult = await this.multiInstallationClient.executeNVA(payload, installationId);

    return validationResult;
  }

  async validateAssetId(
    siteId: string,
    assetId: string,
    installationId: string,
    maxLength = 20,
  ): Promise<{ isValid: boolean; message: string }> {
    // Make sure the name doesn't have any invalid characters
    if (assetId.length > maxLength) {
      return {
        isValid: false,
        message: `Asset ID must be ${maxLength} characters or less.`,
      };
    }

    const payload = {
      noun: `id==${siteId}`,
      verb: 'wellcube/site/validate_asset_id',
      adverb: {
        asset_id: assetId,
      },
    };

    const validationResult = await this.multiInstallationClient.executeNVA(payload, installationId);

    return validationResult;
  }

  async createDevice(spaceId: string, deviceData: CreateDeviceDto, installationId: string): Promise<DeviceModel> {
    try {
      return await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${spaceId}`,
          verb: 'wellcube/devices/create',
          adverb: deviceData,
        },
        installationId,
      );
    } catch (err) {
      console.error('Error creating new device: ', { err });
      throw Error(`Error creating new device: ${err}`);
    }
  }

  async deleteDevice(deviceId: string, installationId: string): Promise<void> {
    try {
      await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${deviceId}`,
          verb: 'wellcube/device/delete',
        },
        installationId,
      );
    } catch (err) {
      console.error(`Error deleting device (${deviceId}):`, { err });
      throw Error(`Error deleting device (${deviceId}): ${err}`);
    }
  }

  async updateDeviceName(deviceId: string, newDeviceName: string, installationId: string): Promise<DeviceModel> {
    try {
      return await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${deviceId}`,
          verb: 'wellcube/device/rename',
          adverb: {
            name: newDeviceName,
          },
        },
        installationId,
      );
    } catch (err) {
      console.error('Error updating device name: ', { err });
      throw Error(`Error updating device name: ${err}`);
    }
  }

  async updateAssetId(deviceId: string, newAssetId: string, installationId: string): Promise<DeviceModel> {
    try {
      return await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${deviceId}`,
          verb: 'wellcube/device/update_asset_id',
          adverb: {
            asset_id: newAssetId,
          },
        },
        installationId,
      );
    } catch (err) {
      console.error('Error updating assetId: ', { err });
      throw Error(`Error updating assetId: ${err}`);
    }
  }

  async updateGateway(deviceId: string, gatewayId: string, installationId: string): Promise<DeviceModel> {
    try {
      return await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${deviceId}`,
          verb: 'wellcube/device/update_gateway',
          adverb: {
            gateway_id: gatewayId,
          },
        },
        installationId,
      );
    } catch (err) {
      console.error('Error updating device gateway: ', { err });
      throw Error(`Error updating device gateway: ${err}`);
    }
  }

  async updateDeviceSetting(
    deviceId: string,
    deviceType: string,
    setting: string,
    value: boolean,
    installationId: string,
  ): Promise<DeviceModel> {
    const lcDeviceType = deviceType.toLowerCase();

    const deviceNoun = `id==${deviceId}`;
    const status = value ? 'enable' : 'disable';

    let deviceVerb = '';
    if (setting === 'noise') {
      deviceVerb = `sensor/${setting}/${status}`;
    } else {
      deviceVerb = `wellcube/${lcDeviceType}/${status}_${setting}`;
    }

    try {
      return await this.multiInstallationClient.executeNVA(
        {
          noun: deviceNoun,
          verb: deviceVerb,
        },
        installationId,
      );
    } catch (err) {
      console.error('Error updating device settings: ', { err });
      throw Error(`Error updating device settings: ${err}`);
    }
  }

  async moveDevice(
    deviceId: string,
    space_id: string,
    keepAssignments: boolean,
    installationId: string,
  ): Promise<void> {
    try {
      await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${deviceId}`,
          verb: 'wellcube/device/move',
          adverb: {
            space_id,
            keep_gateway: keepAssignments,
            keep_devices: keepAssignments,
          },
        },
        installationId,
      );
    } catch (err) {
      console.error(`Error moving device (${deviceId}):`, { err });
      throw Error(`Error moving device (${deviceId}): ${err}`);
    }
  }

  async updateFirmware(deviceId: string, firmwareType: 'MCU' | 'HRN71', installationId: string): Promise<void> {
    try {
      return this.multiInstallationClient.executeNVA(
        {
          noun: `id==${deviceId}`,
          verb: 'wellcube/firmware/upload_package',
          adverb: { id: 'latest', type: firmwareType },
        },
        installationId,
      );
    } catch (err) {
      console.error(`Error updating firmware for device (${deviceId}): `, { err });
      throw new Error(`Error updating firmware for device (${deviceId}): ${err}`);
    }
  }

  async checkFirmware(deviceId: string, installationId: string): Promise<void> {
    try {
      return this.multiInstallationClient.executeNVA(
        {
          noun: `id==${deviceId}`,
          verb: 'wellcube/firmware/check_updates',
        },
        installationId,
      );
    } catch (err) {
      console.error(`Error checking for firmware updates (${deviceId}): `, { err });
      throw new Error(`Error checking for firmware updates (${deviceId}): ${err}`);
    }
  }

  async calibrateDevice(
    deviceId: string,
    demoPayload: {
      demo_succeed: boolean;
      demo_duration: number;
    } = {
      demo_succeed: true,
      demo_duration: 15,
    },
    installationId: string,
  ): Promise<void> {
    try {
      await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${deviceId}`,
          verb: `wellcube/calibration/calibrate`,
          adverb: { ...demoPayload },
        },
        installationId,
      );
    } catch (err) {
      console.error(`Error starting calibration for device (${deviceId}): `, { err });
      throw Error(`Error starting calibration for device (${deviceId}): ${err}`);
    }
  }
}

export default DevicesAPI;
