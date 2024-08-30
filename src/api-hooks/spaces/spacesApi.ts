import { createEntityAdapter } from '@reduxjs/toolkit';
import { UseQuerySubscriptionOptions } from '@reduxjs/toolkit/query/react/types';

import { SpaceModel } from '../../api-types/models';

import getResponseTransformer from '../getResponseTransformer';
import getQueryCacheHandlers from '../getQueryCacheHandlers';
import { nvaApi } from '../nvaApi';

type TQueryArgs = {
  spaceId?: string;
  parentSpaceId?: string;
  siteId?: string;
  searchNoun?: string;
  limit?: number;
};

function getSpacesNoun({ spaceId, siteId, parentSpaceId, searchNoun, limit }: TQueryArgs): string {
  let spacesNoun = 'wellcube/space';

  if (spaceId) {
    return `id=${spaceId}`;
  }

  if (limit) {
    spacesNoun = [spacesNoun, `limit=${limit}`].join('.');
  }

  if (siteId) {
    spacesNoun = [spacesNoun, `(wellcube/space.site_id=${siteId})`].join('.');
  }

  if (parentSpaceId !== undefined) {
    spacesNoun = [spacesNoun, `(wellcube/space.parent_space_id=${parentSpaceId})`].join('.');
  }

  if (searchNoun) {
    spacesNoun = [spacesNoun, `(${searchNoun})`].join('.');
  }

  return spacesNoun;
}

export const spacesAdapter = createEntityAdapter<SpaceModel>();

export const spacesApi = nvaApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpaces: builder.query({
      query: (arg) => `${getSpacesNoun(arg)}.get`,
      transformResponse: getResponseTransformer<SpaceModel>(spacesAdapter),
      ...getQueryCacheHandlers<TQueryArgs, SpaceModel>({
        entityAdapter: spacesAdapter,
        createNoun: getSpacesNoun,
      }),
      providesTags: ['Spaces'],
    }),
    getSiteDesignSpaces: builder.query({
      query: (arg) => `${getSpacesNoun(arg)}.get`,
      transformResponse: (data) => data as SpaceModel[],
      providesTags: ['Spaces'],
    }),
  }),
});

export const { useGetSpacesQuery, useGetSiteDesignSpacesQuery } = spacesApi;

export const useSpaces = (arg: TQueryArgs = {}, options?: UseQuerySubscriptionOptions) => {
  const { data: spacesData, ...other } = useGetSpacesQuery(arg, options);
  const spaces = spacesData ? spacesAdapter.getSelectors().selectAll(spacesData) : [];

  const selectById = (spaceId: string) => {
    return spacesData ? spacesAdapter.getSelectors().selectById(spacesData, spaceId) : undefined;
  };

  return { ...other, spaces, selectById };
};

export const useSpace = (spaceId: string, options?: UseQuerySubscriptionOptions) => {
  const { data: spacesData, ...other } = useGetSpacesQuery({ spaceId }, options);
  const space = spacesData ? spacesAdapter.getSelectors().selectById(spacesData, spaceId) : undefined;

  return { ...other, space };
};
