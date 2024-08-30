import { createEntityAdapter } from '@reduxjs/toolkit';
import { UseQuerySubscriptionOptions } from '@reduxjs/toolkit/query/react/types';

import { PurifierModel } from '../../api-types/models';

import getResponseTransformer from '../getResponseTransformer';
import getQueryCacheHandlers from '../getQueryCacheHandlers';
import { nvaApi } from '../nvaApi';

type TQueryArgs = { purifierId?: string; siteId?: string; gatewayId?: string; searchNoun?: string };

function getPurifiersNoun({ purifierId, siteId, gatewayId, searchNoun }: TQueryArgs): string {
  let purifiersNoun = 'wellcube/purifier';

  if (purifierId) {
    return `id=${purifierId}`;
  }

  if (siteId) {
    purifiersNoun = [purifiersNoun, `(wellcube/device.site_id=${siteId})`].join('.');
  }

  if (gatewayId) {
    purifiersNoun = [purifiersNoun, `(wellcube/device.gateway_id=${gatewayId})`].join('.');
  }

  if (searchNoun) {
    purifiersNoun = [purifiersNoun, `(${searchNoun})`].join('.');
  }

  return purifiersNoun;
}

export const purifiersAdapter = createEntityAdapter<PurifierModel>();

export const purifiersApi = nvaApi.injectEndpoints({
  endpoints: (builder) => ({
    getPurifiers: builder.query({
      query: (arg) => `${getPurifiersNoun(arg)}.get`,
      transformResponse: getResponseTransformer<PurifierModel>(purifiersAdapter),
      ...getQueryCacheHandlers<TQueryArgs, PurifierModel>({
        entityAdapter: purifiersAdapter,
        createNoun: getPurifiersNoun,
      }),
      providesTags: ['Purifiers'],
    }),
  }),
});

export const { useGetPurifiersQuery } = purifiersApi;

export const usePurifiers = (arg: TQueryArgs = {}, options?: UseQuerySubscriptionOptions) => {
  const { data: purifiersData, ...other } = useGetPurifiersQuery(arg, options);
  const purifiers = purifiersData ? purifiersAdapter.getSelectors().selectAll(purifiersData) : [];

  const selectById = (purifierId: string) => {
    return purifiersData ? purifiersAdapter.getSelectors().selectById(purifiersData, purifierId) : undefined;
  };

  return { ...other, purifiers, selectById };
};

export const usePurifier = (purifierId: string, options?: UseQuerySubscriptionOptions) => {
  const { data: purifiersData, ...other } = useGetPurifiersQuery({ purifierId }, options);
  const purifier = purifiersData ? purifiersAdapter.getSelectors().selectById(purifiersData, purifierId) : undefined;

  return { ...other, purifier };
};
