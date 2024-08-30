import { createEntityAdapter } from '@reduxjs/toolkit';
import { UseQuerySubscriptionOptions } from '@reduxjs/toolkit/query/react/types';

import { OrgSiteModel } from '../../api-types/models';

import getResponseTransformer from '../getResponseTransformer';
import getQueryCacheHandlers from '../getQueryCacheHandlers';
import { nvaApi } from '../nvaApi';

type TQueryArgs = {
  siteId?: string;
  siteHandle?: string;
  organizationId?: string;
  searchNoun?: string;
};

function getSitesNoun({ siteId, siteHandle, organizationId, searchNoun }: TQueryArgs): string {
  let sitesNoun = 'wellcube/site';

  if (siteId) {
    return `id=${siteId}`;
  }

  if (siteHandle) {
    sitesNoun = [sitesNoun, `(wellcube/site.handle==${siteHandle})`].join('.');
  }

  if (organizationId) {
    sitesNoun = [sitesNoun, `(wellcube/site.organization_id=${organizationId})`].join('.');
  }

  if (searchNoun) {
    sitesNoun = [sitesNoun, `(${searchNoun})`].join('.');
  }

  return sitesNoun;
}

export const sitesAdapter = createEntityAdapter<OrgSiteModel>();

export const sitesApi = nvaApi.injectEndpoints({
  endpoints: (builder) => ({
    getSites: builder.query({
      query: (arg) => `${getSitesNoun(arg)}.get`,
      transformResponse: getResponseTransformer<OrgSiteModel>(sitesAdapter),
      ...getQueryCacheHandlers<TQueryArgs, OrgSiteModel>({
        entityAdapter: sitesAdapter,
        createNoun: getSitesNoun,
      }),
      providesTags: ['Sites'],
    }),
  }),
});

export const { useGetSitesQuery } = sitesApi;

export const useSites = (arg: TQueryArgs = {}, options?: UseQuerySubscriptionOptions) => {
  const { data: sitesData, ...other } = useGetSitesQuery(arg, options);
  const sites = sitesData ? sitesAdapter.getSelectors().selectAll(sitesData) : [];

  const selectById = (siteId: string) => {
    return sitesData ? sitesAdapter.getSelectors().selectById(sitesData, siteId) : undefined;
  };

  return { ...other, sites, selectById };
};

export const useSite = (organizationId: string, siteHandle: string, options?: UseQuerySubscriptionOptions) => {
  const { data: sitesData, ...other } = useGetSitesQuery({ organizationId, siteHandle }, options);
  const sites = sitesData ? sitesAdapter.getSelectors().selectAll(sitesData) : [];
  const site = sites.length ? sites[0] : undefined;

  return { ...other, site };
};
