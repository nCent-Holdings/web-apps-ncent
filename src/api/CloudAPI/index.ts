import ApiClient from './ApiClient';
import ApiKeyAPI from './ApiKey';

import AwsAPI from './AwsAPI';
import InstallationsAPI from './InstallationsAPI';
import LocalAccountsAPI from './LocalAccountsAPI';
import ProductsAPI from './ProductsAPI';
import SessionAPI from './SessionAPI';
import UsersAPI from './UsersAPI';
import BrandsAPI from './BrandsAPI';
import ActionsAPI from './ActionsAPI';

export interface CloudAPI {
  apiClient: ApiClient;
  aws: AwsAPI;
  installations: InstallationsAPI;
  localAccounts: LocalAccountsAPI;
  products: ProductsAPI;
  session: SessionAPI;
  apiKey: ApiKeyAPI;
  users: UsersAPI;
  brands: BrandsAPI;
  actions: ActionsAPI;
}

export default function createCloudAPI({ cloudBackendHttpUrl }: { cloudBackendHttpUrl: string }): CloudAPI {
  const apiClient = new ApiClient(cloudBackendHttpUrl);

  return {
    apiClient,
    aws: new AwsAPI({ apiClient }),
    installations: new InstallationsAPI({ apiClient }),
    localAccounts: new LocalAccountsAPI({ apiClient }),
    products: new ProductsAPI({ apiClient }),
    session: new SessionAPI({ apiClient }),
    apiKey: new ApiKeyAPI({ apiClient }),
    users: new UsersAPI({ apiClient }),
    brands: new BrandsAPI({ apiClient }),
    actions: new ActionsAPI({ apiClient }),
  };
}
