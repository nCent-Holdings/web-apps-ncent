import { createEntityAdapter } from '@reduxjs/toolkit';
import { UseQuerySubscriptionOptions } from '@reduxjs/toolkit/query/react/types';

import { OrganizationModel } from '../../api-types/models';

import getResponseTransformer from '../getResponseTransformer';
import getQueryCacheHandlers from '../getQueryCacheHandlers';
import { nvaApi } from '../nvaApi';

type TQueryArgs = { orgHandle?: string };

function getOrganizationsNoun({ orgHandle }: TQueryArgs): string {
  let organizationsNoun = 'wellcube/organization.(wellcube/organization.deleted_at==)';

  if (orgHandle) {
    organizationsNoun = [organizationsNoun, `(wellcube/organization.handle==${orgHandle})`].join('.');
  }

  return organizationsNoun;
}

export const organizationsAdapter = createEntityAdapter<OrganizationModel>();

export const organizationsApi = nvaApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizations: builder.query({
      query: (arg) => `${getOrganizationsNoun(arg)}.get`,
      transformResponse: getResponseTransformer<OrganizationModel>(organizationsAdapter),
      ...getQueryCacheHandlers<TQueryArgs, OrganizationModel>({
        entityAdapter: organizationsAdapter,
        createNoun: getOrganizationsNoun,
        removeOnUpdate: (organization: OrganizationModel) => !!organization['wellcube/organization']?.deleted_at,
      }),
      providesTags: ['Organizations'],
    }),
  }),
});

export const { useGetOrganizationsQuery } = organizationsApi;

export const useOrganizations = (arg: TQueryArgs = {}, options?: UseQuerySubscriptionOptions) => {
  const { data: organizationsData, ...other } = useGetOrganizationsQuery(arg, options);
  const organizations = organizationsData ? organizationsAdapter.getSelectors().selectAll(organizationsData) : [];

  const selectById = (organizationId: string) => {
    return organizationsData
      ? organizationsAdapter.getSelectors().selectById(organizationsData, organizationId)
      : undefined;
  };

  return { ...other, organizations, selectById };
};

export const useOrganization = (orgHandle: string, options?: UseQuerySubscriptionOptions) => {
  const { data: organizationsData, ...other } = useGetOrganizationsQuery({ orgHandle }, options);
  const organizations = organizationsData ? organizationsAdapter.getSelectors().selectAll(organizationsData) : [];
  const organization = organizations.length ? organizations[0] : undefined;

  return { ...other, organization };
};
