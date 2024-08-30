import { AuthenticationException, Exception } from '../../lib/X';

import BaseAPI from './BaseAPI';

class SessionAPI extends BaseAPI {
  async login(email: string, password: string): Promise<{ jwt: string }> {
    try {
      return await this.apiClient.post('sessions', { email, password });
    } catch (error: any) {
      if (error instanceof Exception) {
        throw error;
      }

      throw new AuthenticationException(error.fields);
    }
  }
}

export default SessionAPI;
