import { MultiInstallationClient, CredentialsManager } from '@ncent-holdings/user-gateway-client';

import ListsAPI from './ListsAPI';
import ManipulatorsAPI from './ManipulatorsAPI';
import OrganizationsAPI from './OrganizationsAPI';
import SitesAPI from './SitesAPI';
import SpacesAPI from './SpacesAPI';
import uxSessionStorage from './utils/uxSessionStorage';
import DevicesAPI from './DevicesAPI';
import GatewaysAPI from './GatewaysAPI';
import PurifierAPI from './PurifierAPI';
import SensorMappingAPI from './SensorMappingAPI';
import UserAPI from './UserAPI';
import BrandAPI from './BrandAPI';
import SystemAPI from './SystemAPI';

export interface CoreAPI {
  multiInstallationClient: MultiInstallationClient;
  manipulators: ManipulatorsAPI;
  organizations: OrganizationsAPI;
  sites: SitesAPI;
  spaces: SpacesAPI;
  lists: ListsAPI;
  devices: DevicesAPI;
  gateways: GatewaysAPI;
  purifiers: PurifierAPI;
  sensorMapping: SensorMappingAPI;
  users: UserAPI;
  brands: BrandAPI;
  system: SystemAPI;
}

export default function createCoreAPI({
  internetUgwWsUrl,
  productId,
  appName,
  credentialsManager,
}: {
  internetUgwWsUrl: string;
  productId: string;
  appName: string;
  credentialsManager: CredentialsManager;
}): CoreAPI {
  const multiInstallationClient = new MultiInstallationClient({
    productId,
    appName,
    deviceId: 'browser',
    sourceTranslator: productId,
    storage: uxSessionStorage,
    credentialsManager,
    internetUgwWsUrl,
  });

  return {
    multiInstallationClient,

    lists: new ListsAPI({ multiInstallationClient }),
    manipulators: new ManipulatorsAPI({ multiInstallationClient }),
    organizations: new OrganizationsAPI({ multiInstallationClient }),
    sites: new SitesAPI({ multiInstallationClient }),
    spaces: new SpacesAPI({ multiInstallationClient }),
    devices: new DevicesAPI({ multiInstallationClient }),
    gateways: new GatewaysAPI({ multiInstallationClient }),
    purifiers: new PurifierAPI({ multiInstallationClient }),
    sensorMapping: new SensorMappingAPI({ multiInstallationClient }),
    users: new UserAPI({ multiInstallationClient }),
    brands: new BrandAPI({ multiInstallationClient }),
    system: new SystemAPI({ multiInstallationClient }),
  };
}
