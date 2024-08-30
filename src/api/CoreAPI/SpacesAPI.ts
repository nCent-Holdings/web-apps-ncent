import BaseAPI from './BaseAPI';
import { GatewayModel, PurifierModel, SensorModel, SpaceModel } from '@src/api-types/models';
import { type CreateOrUpdateSpaceDto } from '@src/api/CoreAPI/types';

class SpacesAPI extends BaseAPI {
  async get(nouns: Array<string> = [], installationId: string): Promise<Array<SpaceModel>> {
    return this.multiInstallationClient.executeNVA(
      {
        noun: ['wellcube/space', ...nouns].join('.'),
        verb: 'get',
      },
      installationId,
    );
  }

  async getById(spaceId: string, installationId: string): Promise<Array<SpaceModel>> {
    return this.get([`id=${spaceId}`], installationId);
  }

  async getByName(spaceName: string, installationId: string): Promise<Array<SpaceModel>> {
    return this.get(['wellcube/space', `name==${spaceName}`], installationId);
  }

  async getOpenSpacesNearby(spaceId: string, installationId: string): Promise<Array<SpaceModel>> {
    return this.multiInstallationClient.executeNVA(
      {
        noun: `id=${spaceId}`,
        verb: 'wellcube/space/get_open_spaces_nearby',
      },
      installationId,
    );
  }

  async validateName(
    parentId: string,
    spaceName: string,
    installationId: string,
  ): Promise<{ isValid: boolean; errorText?: string }> {
    // Make sure the name isn't empty
    if (spaceName === '') {
      return { isValid: false, errorText: 'Space name cannot be empty.' };
      // Make sure the name doesn't have any invalid characters
    }
    // else if (false /* Contains bad characters */) {
    //   return {
    //     isValid: false,
    //     errorText: 'Space name contains invalid characters.',
    //   };
    // }

    const validationResult = await this.multiInstallationClient.executeNVA(
      {
        noun: `id=${parentId}`,
        verb: 'wellcube/spaces/validate_space_name',
        adverb: {
          name: spaceName,
        },
      },
      installationId,
    );

    return { isValid: validationResult };
  }

  async updateSpace(
    spaceId: string,
    spaceData: Partial<CreateOrUpdateSpaceDto>,
    installationId: string,
  ): Promise<SpaceModel> {
    try {
      return await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${spaceId}`,
          verb: 'wellcube/space/update',
          adverb: spaceData,
        },
        installationId,
      );
    } catch (err) {
      console.error('Error updating space: ', { err });
      throw Error(`Error updating space: ${err}`);
    }
  }

  async createSpace(spaceData: CreateOrUpdateSpaceDto, installationId: string): Promise<SpaceModel> {
    const parentId = spaceData['parent_space_id'] || spaceData['site_id'];

    try {
      return await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${parentId}`,
          verb: 'wellcube/spaces/create',
          adverb: spaceData,
        },
        installationId,
      );
    } catch (err) {
      console.error('Error creating new space: ', { err });
      throw Error(`Error creating new space: ${err}`);
    }
  }

  async deleteSpace(spaceId: string, installationId: string): Promise<any> {
    try {
      return await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${spaceId}`,
          verb: 'wellcube/space/delete',
        },
        installationId,
      );
    } catch (err) {
      console.error(`Error deleting space (${spaceId}):`, { err });
      throw Error(`Error deleting space (${spaceId}): ${err}`);
    }
  }

  async moveSpace(
    spaceId: string,
    parent_space_id: string,
    keepAssignments: boolean,
    installationId: string,
  ): Promise<any> {
    try {
      return await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${spaceId}`,
          verb: 'wellcube/space/move',
          adverb: {
            parent_space_id,
            keep_gateway: keepAssignments,
            keep_devices: keepAssignments,
          },
        },
        installationId,
      );
    } catch (err) {
      console.error(`Error moving device (${spaceId}):`, { err });
      throw Error(`Error moving device (${spaceId}): ${err}`);
    }
  }

  async getSpaceGateways(spaceId: string, installationId: string): Promise<GatewayModel[]> {
    return this.multiInstallationClient.executeNVA(
      {
        noun: `wellcube/gateway.(wellcube/device.space_id=${spaceId})`,
        verb: 'get',
      },
      installationId,
    );
  }

  async getSpacesGateways(spacesIds: string[], installationId: string): Promise<GatewayModel[]> {
    const spacesNoun = spacesIds.map((spaceId) => `(wellcube/device.space_id=${spaceId})`).join('|');

    return this.multiInstallationClient.executeNVA(
      {
        noun: `(wellcube/gateway).(${spacesNoun})`,
        verb: 'get',
      },
      installationId,
    );
  }

  async getSpacesSensors(spacesIds: string[], installationId: string): Promise<SensorModel[]> {
    const spacesNoun = spacesIds.map((spaceId) => `(wellcube/device.space_id=${spaceId})`).join('|');

    return this.multiInstallationClient.executeNVA(
      {
        noun: `(wellcube/sensor).(${spacesNoun})`,
        verb: 'get',
      },
      installationId,
    );
  }

  async getSpacesPurifiers(spacesIds: string[], installationId: string): Promise<PurifierModel[]> {
    const spacesNoun = spacesIds.map((spaceId) => `(wellcube/device.space_id=${spaceId})`).join('|');

    return this.multiInstallationClient.executeNVA(
      {
        noun: `(wellcube/purifier).(${spacesNoun})`,
        verb: 'get',
      },
      installationId,
    );
  }

  async getSubspaces(spaceId: string, installationId: string): Promise<SpaceModel[]> {
    return this.multiInstallationClient.executeNVA(
      {
        noun: `id=${spaceId}`,
        verb: 'get_child_spaces',
        adverb: {
          include_subspaces: true,
          name: 'name',
          'wellcube/devices': 'wellcube/devices',
        },
      },
      installationId,
    );
  }
}

export default SpacesAPI;
