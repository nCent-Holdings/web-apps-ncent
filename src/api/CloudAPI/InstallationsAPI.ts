import { Installation, LocalAccount } from './models';

import BaseAPI from './BaseAPI';

class InstallationsAPI extends BaseAPI {
  async list(
    params: {
      connected?: boolean;
      search?: string;
      productId?: string;
      productIsPrimary?: boolean;
    } = {},
  ): Promise<Array<Installation & { localAccounts: Array<LocalAccount> }>> {
    return this.apiClient.get('installations', params);
  }
}

export default InstallationsAPI;
