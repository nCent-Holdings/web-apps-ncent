import { createApi } from '@reduxjs/toolkit/query/react';
import nvaBaseQuery from './nvaBaseQuery';

export const nvaApi = createApi({
  reducerPath: 'nvaCache',
  baseQuery: nvaBaseQuery,
  endpoints: () => ({}),
  tagTypes: ['Devices', 'Gateways', 'Organizations', 'Purifiers', 'Sensors', 'Sites', 'Spaces', 'Users'],
});
