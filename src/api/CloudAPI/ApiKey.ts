import BaseAPI from './BaseAPI';
import { ApiKeyRequest, ApiKeyResponse } from './models';

class ApiKeyAPI extends BaseAPI {
  async create(payload: ApiKeyRequest): Promise<ApiKeyResponse> {
    try {
      const apiResult = await this.apiClient.post(
        'wellcube/api',
        { ...{ body: payload }, operation_type: 'create' },
        false,
      );
      const apiKeyResponse = JSON.parse(apiResult);

      return apiKeyResponse;
    } catch (err) {
      console.error('APIkey creation error: ', { err });

      throw err;
    }
  }

  async get(params: ApiKeyRequest): Promise<ApiKeyResponse> {
    try {
      const apiResult = await this.apiClient.get('wellcube/api', params);
      const apiKeyResponse = JSON.parse(apiResult);

      return apiKeyResponse;
    } catch (err) {
      console.error('APIkey get error:', err);
      throw err;
    }
  }

  async update(payload: ApiKeyRequest): Promise<ApiKeyResponse> {
    try {
      console.log('payload update:', payload);

      const apiResult = await this.apiClient.post(
        'wellcube/api',
        { ...{ body: payload }, operation_type: 'update' },
        false,
      );
      const apiKeyResponse = JSON.parse(apiResult);
      console.log('apikeyresponse update:', apiKeyResponse);

      return apiKeyResponse;
    } catch (err) {
      console.error('APIkey creation error: ', { err });

      throw err;
    }
  }

  async delete(payload: Pick<ApiKeyRequest, 'api_key' | 'user_id'>): Promise<ApiKeyResponse> {
    try {
      const apiResult = await this.apiClient.post(
        'wellcube/api',
        { ...{ body: payload }, operation_type: 'delete' },
        false,
      );
      const apiKeyResponse = JSON.parse(apiResult);

      return apiKeyResponse;
    } catch (err) {
      console.error('APIKey delete error:', err);
      throw err;
    }
  }
}

export default ApiKeyAPI;
