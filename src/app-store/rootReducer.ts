import { combineReducers } from '@reduxjs/toolkit';

import { devicesApi } from '../api-hooks/devices/devicesApi';
import { gatewaysApi } from '../api-hooks/gateways/gatewaysApi';
import { organizationsApi } from '../api-hooks/organizations/organizationsApi';
import { purifiersApi } from '../api-hooks/purifiers/purifiersApi';
import { sensorsApi } from '../api-hooks/sensors/sensorsApi';
import { sitesApi } from '../api-hooks/sites/sitesApi';
import { spacesApi } from '../api-hooks/spaces/spacesApi';
import { usersApi } from '../api-hooks/users/usersApi';
import { apiKeysApi } from '../api-hooks/api-keys/apiKeysApi';

import dmReducers from '../features/device-management/dm.slice';
import siteDesignReducers from '../features/site-design/siteDesign.slice';

const rootReducer = combineReducers({
  deviceManagement: dmReducers,
  siteDesign: siteDesignReducers,

  [devicesApi.reducerPath]: devicesApi.reducer,
  [gatewaysApi.reducerPath]: gatewaysApi.reducer,
  [organizationsApi.reducerPath]: organizationsApi.reducer,
  [purifiersApi.reducerPath]: purifiersApi.reducer,
  [sensorsApi.reducerPath]: sensorsApi.reducer,
  [sitesApi.reducerPath]: sitesApi.reducer,
  [spacesApi.reducerPath]: spacesApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [apiKeysApi.reducerPath]: apiKeysApi.reducer,
});

export default rootReducer;
