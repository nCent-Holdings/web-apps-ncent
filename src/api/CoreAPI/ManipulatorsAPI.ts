import { Exception } from '../../lib/X';
import BaseAPI from './BaseAPI';

class ManipulatorsAPI extends BaseAPI {
  async validateCredentials(manipulatorId: string, accessToken: string, installationId: string): Promise<any> {
    try {
      return await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${manipulatorId}`,
          verb: 'darwin/manipulator/check',
          adverb: { token: accessToken },
        },
        installationId,
      );
    } catch (error: any) {
      if (error.code && error.reason) {
        throw new Exception(error.code, error.reason);
      }
      if (error.code) {
        throw new Exception(error.code);
      }

      throw new Error(error.message);
    }
  }

  async getGroups(manipulatorId: string, installationId: string): Promise<{ id: string; name: string }[]> {
    try {
      return await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${manipulatorId}`,
          verb: 'darwin/manipulator/get_groups',
          adverb: { name: 'name' },
        },
        installationId,
      );
    } catch (error: any) {
      if (error.code && error.reason) {
        throw new Exception(error.code, error.reason);
      }

      if (error.code) {
        throw new Exception(error.code);
      }

      throw new Error(error.message);
    }
  }
}

export default ManipulatorsAPI;
