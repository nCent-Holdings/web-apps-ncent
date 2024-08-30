import { MultiInstallationClient } from '@ncent-holdings/user-gateway-client';

class BaseAPI {
  multiInstallationClient: MultiInstallationClient;
  wellcubeApiNoun: string;

  constructor({ multiInstallationClient }: { multiInstallationClient: MultiInstallationClient }) {
    if (!multiInstallationClient) {
      throw new Error('"multiInstallationClient" is required!');
    }

    this.multiInstallationClient = multiInstallationClient;
    this.wellcubeApiNoun = 'thing.wellcube/api';
  }
}

export default BaseAPI;
