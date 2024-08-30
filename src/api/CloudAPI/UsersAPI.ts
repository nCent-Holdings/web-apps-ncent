import BaseAPI from './BaseAPI';

class UsersAPI extends BaseAPI {
  inviteToProduct(payload: object) {
    return this.apiClient.post('users/product-invitations', payload, false);
  }

  renewInvitation(inviteId: string, payload: object = {}) {
    return this.apiClient.post(`users/product-invitations/${inviteId}/renew`, payload);
  }
}

export default UsersAPI;
