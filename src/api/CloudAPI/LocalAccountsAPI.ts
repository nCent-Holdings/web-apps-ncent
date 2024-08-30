import BaseAPI from './BaseAPI';

class LocalAccountsAPI extends BaseAPI {
  async transfer(params: {
    email: string;
    installationId: string;
    userToTransferRoleId: string;
    userToTransferName: string;
    type: string;
  }): Promise<void> {
    return this.apiClient.post('/local-accounts/transfer', params);
  }
}

export default LocalAccountsAPI;
