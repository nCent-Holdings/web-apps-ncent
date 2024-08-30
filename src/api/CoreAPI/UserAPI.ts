import BaseAPI from './BaseAPI';
import { UserModel } from '@src/api-types/models';

class UserAPI extends BaseAPI {
  async get(nouns: Array<string> = [], installationId: string): Promise<Array<UserModel>> {
    return this.multiInstallationClient.executeNVA(
      {
        noun: ['wellcube/user', ...nouns].join('.'),
        verb: 'get',
      },
      installationId,
    );
  }

  async getById(userId: string, installationId: string): Promise<Array<UserModel>> {
    return this.multiInstallationClient.executeNVA(
      {
        noun: `id=${userId}`,
        verb: 'get',
      },
      installationId,
    );
  }

  async toggleNotification(userId: string, toggleId: string, installationId: string): Promise<UserModel> {
    const userNoun = `id==${userId}`;

    try {
      const response = await this.multiInstallationClient.executeNVA(
        {
          noun: userNoun,
          verb: `wellcube/user/toggle_notification`,
          adverb: {
            id: toggleId,
          },
        },
        installationId,
      );

      return response;
    } catch (err: any) {
      throw Error(`Error on toggle notification: ${err.reason}`);
    }
  }

  async validatePhoneNumber(
    userId: string,
    phoneNumber: string,
    installationId: string,
  ): Promise<{ isValid: boolean; errorMessage?: string }> {
    const userNoun = `id==${userId}`;

    try {
      await this.multiInstallationClient.executeNVA(
        {
          noun: userNoun,
          verb: `wellcube/user/validate_phone_number`,
          adverb: {
            value: phoneNumber,
          },
        },
        installationId,
      );

      return { isValid: true };
    } catch (err: any) {
      return {
        isValid: false,
        errorMessage: typeof err === 'string' ? err : err.message,
      };
    }
  }

  async updateUser(userId: string, newState: TObject, installationId: string): Promise<UserModel> {
    const userNoun = `id==${userId}`;

    // TODO: Add wellcube/user/update verb
    const nva = Object.entries(newState).map(([key, value]) => ({
      noun: userNoun,
      verb: `wellcube/user/set_${key}`,
      adverb: { value },
    }));

    const updatedUser = await this.multiInstallationClient.executeNVA(nva, installationId);

    return updatedUser;
  }
}

export default UserAPI;
