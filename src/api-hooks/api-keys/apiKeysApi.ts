import { createApi } from '@reduxjs/toolkit/query/react';

import cloudBeBaseQuery from '@src/api-hooks/cloudBeBaseQuery';
import { ApiKeyRequest, ApiKeyResponse } from '@src/api/CloudAPI/models';

export const apiKeysApi = createApi({
  reducerPath: 'cacheApiKeys',
  baseQuery: cloudBeBaseQuery,
  endpoints: (builder) => ({
    getApiKeys: builder.query({
      query: (arg: ApiKeyRequest) => ({ query: 'wellcube/api', params: arg }),
      transformResponse: (response): ApiKeyResponse => JSON.parse(response),
    }),
  }),
});

export const { useGetApiKeysQuery } = apiKeysApi;
