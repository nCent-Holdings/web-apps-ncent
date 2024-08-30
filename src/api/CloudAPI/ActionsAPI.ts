import BaseAPI from './BaseAPI';

class ActionsAPI extends BaseAPI {
  get(actionId: string) {
    return this.apiClient.get(`actions/${actionId}`);
  }
}

export default ActionsAPI;
