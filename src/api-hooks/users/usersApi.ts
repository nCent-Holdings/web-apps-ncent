import { createEntityAdapter } from '@reduxjs/toolkit';
import { UseQuerySubscriptionOptions } from '@reduxjs/toolkit/query/react/types';

import { UserModel } from '../../api-types/models';

import getResponseTransformer from '../getResponseTransformer';
import getQueryCacheHandlers from '../getQueryCacheHandlers';
import { nvaApi } from '../nvaApi';

type TQueryArgs = { userId?: string; permissionsOrgId?: string; permissionsType?: 'admin' | 'external' };

function getUsersNoun({ userId, permissionsOrgId, permissionsType }: TQueryArgs): string {
  let usersNoun = `user.wellcube/user`;

  if (userId) {
    return `id=${userId}`;
  }

  if (permissionsOrgId) {
    usersNoun = [usersNoun, `(wellcube/user_permissions.permissions.organization_id==${permissionsOrgId})`].join('.');
  }

  if (permissionsType) {
    usersNoun = [usersNoun, `(wellcube/user_permissions.permissions.type==${permissionsType})`].join('.');
  }

  return usersNoun;
}

export const usersAdapter = createEntityAdapter<UserModel>();

export const usersApi = nvaApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (args) => `${getUsersNoun(args)}.get`,
      transformResponse: getResponseTransformer<UserModel>(usersAdapter),
      ...getQueryCacheHandlers<TQueryArgs, UserModel>({
        entityAdapter: usersAdapter,
        createNoun: getUsersNoun,
      }),
      providesTags: ['Users'],
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;

export const useUsers = (arg: TQueryArgs = {}, options?: UseQuerySubscriptionOptions) => {
  const { data: usersData, ...other } = useGetUsersQuery(arg, options);
  const users = usersData ? usersAdapter.getSelectors().selectAll(usersData) : [];

  const selectById = (userId: string) => {
    return usersData ? usersAdapter.getSelectors().selectById(usersData, userId) : undefined;
  };

  return { ...other, users, selectById };
};

export const useUser = (userId: string, options?: UseQuerySubscriptionOptions) => {
  const { data: usersData, ...other } = useGetUsersQuery({ userId }, options);
  const user = usersData ? usersAdapter.getSelectors().selectById(usersData, userId) : undefined;

  return { ...other, user };
};
