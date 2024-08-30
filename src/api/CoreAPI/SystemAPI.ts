import BaseAPI from './BaseAPI';
import { UserModel } from '@src/api-types/models';

class SystemAPI extends BaseAPI {
  async findUserByEmail(email: string, installationId: string): Promise<UserModel | null> {
    try {
      return await this.multiInstallationClient.executeNVA(
        {
          noun: 'wellcube/system.limit=1',
          verb: 'wellcube/system/find_user',
          adverb: { email },
        },
        installationId,
      );
    } catch (error) {
      throw Error(`Error searching for a user in system: ${error}`);
    }
  }

  async addUserToOrganization(userId: string, organizationId: string, installationId: string): Promise<void> {
    try {
      await this.multiInstallationClient.executeNVA(
        {
          noun: 'wellcube/system.limit=1',
          verb: 'wellcube/system/add_user_to_org',
          adverb: { user_id: userId, organization_id: organizationId },
        },
        installationId,
      );
    } catch (error) {
      throw Error(`Error adding a user to the organization: ${error}`);
    }
  }
}

export default SystemAPI;
