import { DeviceModel, GatewayModel } from '../../api-types/models';
import BaseAPI from './BaseAPI';

class GatewaysAPI extends BaseAPI {
  async getGateways(siteId: string, installationId: string): Promise<Array<GatewayModel>> {
    return await this.multiInstallationClient.executeNVA(
      {
        noun: `wellcube/gateway.(wellcube/device.site_id==${siteId})`,
        verb: 'get',
      },
      installationId,
    );
  }

  async getGatewayDevices(
    gatewayId: string,
    params: { commissioned?: boolean } = {},
    installationId: string,
  ): Promise<Array<DeviceModel>> {
    const devicesNounParts = ['wellcube/device', `gateway_id==${gatewayId}`];

    if (params.commissioned === true) {
      devicesNounParts.push(`(wellcube/device.status!=uncommissioned)`);
    } else if (params.commissioned === false) {
      devicesNounParts.push(`(wellcube/device.status==uncommissioned)`);
    }

    const devicesNoun = devicesNounParts.join('.');

    return await this.multiInstallationClient.executeNVA(
      {
        noun: devicesNoun,
        verb: 'get',
      },
      installationId,
    );
  }

  async getGatewaysDevices(
    gatewaysIds: string[],
    params: { commissioned?: boolean } = {},
    installationId: string,
  ): Promise<Array<DeviceModel>> {
    const gatewaysNoun = gatewaysIds.map((gatewayId) => `(gateway_id=${gatewayId})`).join('|');

    const devicesNounParts = ['(wellcube/device)', `(${gatewaysNoun})`];

    if (params.commissioned === true) {
      devicesNounParts.push(`(wellcube/device.status!=uncommissioned)`);
    } else if (params.commissioned === false) {
      devicesNounParts.push(`(wellcube/device.status==uncommissioned)`);
    }

    const devicesNoun = devicesNounParts.join('.');

    return await this.multiInstallationClient.executeNVA(
      {
        noun: devicesNoun,
        verb: 'get',
      },
      installationId,
    );
  }
}

export default GatewaysAPI;
