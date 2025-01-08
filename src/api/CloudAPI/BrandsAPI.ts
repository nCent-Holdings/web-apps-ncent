import BaseAPI from './BaseAPI';

class BrandsAPI extends BaseAPI {
  create(payload: object) {
    return this.apiClient.post('brands/create', payload, false);
  }

  createUser(payload: object) {
    return this.apiClient.post('local-accounts/create-brand-user', payload, false);
  }

  updateAccessToken(payload: object) {
    return this.apiClient.post('cognito/update-access-token', payload, false);
  }

  userExists(payload: object) {
    return this.apiClient.post('cognito/user-exists', payload, false);
  }

  brandExists(payload: object) {
    return this.apiClient.post('brands/brand-exists', payload, false);
  }
}

export default BrandsAPI;
