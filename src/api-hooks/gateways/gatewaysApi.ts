import { createEntityAdapter } from '@reduxjs/toolkit';
import { UseQuerySubscriptionOptions } from '@reduxjs/toolkit/query/react/types';

import { GatewayModel } from '../../api-types/models';

import getResponseTransformer from '../getResponseTransformer';
import getQueryCacheHandlers from '../getQueryCacheHandlers';
import { nvaApi } from '../nvaApi';

type TQueryArgs = { gatewayId?: string; siteId?: string; searchNoun?: string };

function getGatewaysNoun({ gatewayId, siteId, searchNoun }: TQueryArgs): string {
  let gatewaysNoun = 'wellcube/gateway';

  if (gatewayId) {
    return `id=${gatewayId}`;
  }

  if (siteId) {
    gatewaysNoun = [gatewaysNoun, `(wellcube/device.site_id=${siteId})`].join('.');
  }

  if (searchNoun) {
    gatewaysNoun = [gatewaysNoun, `(${searchNoun})`].join('.');
  }

  return gatewaysNoun;
}

export const gatewaysAdapter = createEntityAdapter<GatewayModel>();

export const gatewaysApi = nvaApi.injectEndpoints({
  endpoints: (builder) => ({
    getGateways: builder.query({
      query: (arg) => `${getGatewaysNoun(arg)}.get`,
      transformResponse: getResponseTransformer<GatewayModel>(gatewaysAdapter),
      ...getQueryCacheHandlers<TQueryArgs, GatewayModel>({
        entityAdapter: gatewaysAdapter,
        createNoun: getGatewaysNoun,
      }),
      providesTags: ['Gateways'],
    }),
  }),
});

export const { useGetGatewaysQuery } = gatewaysApi;

export const useGateways = (arg: TQueryArgs = {}, options?: UseQuerySubscriptionOptions) => {
  const { data: gatewaysData, ...other } = useGetGatewaysQuery(arg, options);
  const gateways = gatewaysData ? gatewaysAdapter.getSelectors().selectAll(gatewaysData) : [];

  const selectById = (gatewayId: string) => {
    return gatewaysData ? gatewaysAdapter.getSelectors().selectById(gatewaysData, gatewayId) : undefined;
  };

  return { ...other, gateways, selectById };
};

export const useGateway = (gatewayId: string, options?: UseQuerySubscriptionOptions) => {
  const { data: gatewaysData, ...other } = useGetGatewaysQuery({ gatewayId }, options);
  const gateway = gatewaysData ? gatewaysAdapter.getSelectors().selectById(gatewaysData, gatewayId) : undefined;

  return { ...other, gateway };
};
