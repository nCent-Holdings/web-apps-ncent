import { DeviceModel } from '../../api-types/models';
import { SpeedValues } from '../../routes/client/device-management/set-mode/types';
import { FanCfm, FanMode } from '../../routes/client/device-management/types';
import BaseAPI from './BaseAPI';

class PurifierAPI extends BaseAPI {
  async setMode(deviceId: string, newMode: FanMode, installationId: string): Promise<DeviceModel> {
    const purifierNoun = `id==${deviceId}`;

    try {
      const setModeResult = await this.multiInstallationClient.executeNVA(
        {
          noun: purifierNoun,
          verb: 'wellcube/purifier/change_fan_mode',
          adverb: {
            mode: newMode,
          },
        },
        installationId,
      );

      return setModeResult;
    } catch (err) {
      throw Error(`Error updating purifier mode: ${err}`);
    }
  }

  async changeFanSpeedCfm(deviceId: string, newCfm: FanCfm, installationId: string): Promise<DeviceModel> {
    const purifierNoun = `id==${deviceId}`;

    try {
      return await this.multiInstallationClient.executeNVA(
        {
          noun: purifierNoun,
          verb: 'wellcube/purifier/change_fan_speed',
          adverb: {
            cfm: newCfm,
          },
        },
        installationId,
      );
    } catch (err) {
      throw new Error(`Error changing fan speed: ${err}`);
    }
  }

  async changeFanSpeedPct(deviceId: string, newSpeed: SpeedValues, installationId: string): Promise<DeviceModel> {
    const purifierNoun = `id==${deviceId}`;

    try {
      const fanSpeedResult = await this.multiInstallationClient.executeNVA(
        {
          noun: purifierNoun,
          verb: 'wellcube/purifier/change_fan_speed',
          adverb: {
            percent: newSpeed,
          },
        },
        installationId,
      );

      return fanSpeedResult;
    } catch (err) {
      throw Error(`Error updating purifier mode: ${err}`);
    }
  }
}

export default PurifierAPI;
