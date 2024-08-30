import { Dispatch, createEntityAdapter } from '@reduxjs/toolkit';
import { UseQuerySubscriptionOptions } from '@reduxjs/toolkit/query/react/types';

import { DeviceModel } from '../../api-types/models';

import getResponseTransformer from '../getResponseTransformer';
import { nvaApi } from '../nvaApi';
import getQueryCacheHandlers from '../getQueryCacheHandlers';

type TQueryArgs = {
  deviceId?: string;
  siteId?: string;
  spaceId?: string;
  gatewayId?: string;
  searchNoun?: string;
};

type MoveArgs = {
  deviceId: string;
  spaceId: string;
  keepAssignments: boolean;
};

function getDevicesNoun({ deviceId, siteId, spaceId, gatewayId, searchNoun }: TQueryArgs): string {
  let devicesNoun = 'wellcube/device';

  if (deviceId) {
    return `id=${deviceId}`;
  }

  if (siteId) {
    devicesNoun = [devicesNoun, `(wellcube/device.site_id=${siteId})`].join('.');
  }

  if (spaceId) {
    devicesNoun = [devicesNoun, `(wellcube/device.space_id=${spaceId})`].join('.');
  }

  if (gatewayId) {
    devicesNoun = [devicesNoun, `(wellcube/device.gateway_id=${gatewayId})`].join('.');
  }

  if (searchNoun) {
    devicesNoun = [devicesNoun, `(${searchNoun})`].join('.');
  }

  return devicesNoun;
}

export const devicesAdapter = createEntityAdapter<DeviceModel>();

export const devicesApi = nvaApi.injectEndpoints({
  endpoints: (builder) => ({
    getDevices: builder.query({
      query: (arg) => `${getDevicesNoun(arg)}.get`,
      transformResponse: getResponseTransformer<DeviceModel>(devicesAdapter),
      ...getQueryCacheHandlers<TQueryArgs, DeviceModel>({
        entityAdapter: devicesAdapter,
        createNoun: getDevicesNoun,
        handleDataUpdate: invalidateQueryTag,
      }),
      providesTags: ['Devices'],
    }),
    moveDevice: builder.mutation<DeviceModel, MoveArgs>({
      query: (arg) => ({
        noun: `wellcube/device.id==${arg.deviceId}`,
        verb: 'wellcube/device/move',
        adverb: {
          space_id: arg.spaceId,
          keep_gateway: arg.keepAssignments,
          keep_devices: arg.keepAssignments,
        },
      }),
      invalidatesTags: ['Devices'],
    }),
  }),
});

function invalidateQueryTag(dispatch: Dispatch, obj: DeviceModel, arg: TQueryArgs) {
  const oldSpace = arg.spaceId;
  const newSpace = obj['wellcube/device']?.space_id;

  if (oldSpace && oldSpace !== newSpace) {
    dispatch(devicesApi.util.invalidateTags(['Devices']));
  }
}

export const { useGetDevicesQuery, useMoveDeviceMutation } = devicesApi;

export const useDevices = (arg: TQueryArgs = {}, options?: UseQuerySubscriptionOptions) => {
  const { data: devicesData, ...other } = useGetDevicesQuery(arg, options);
  const devices = devicesData ? devicesAdapter.getSelectors().selectAll(devicesData) : [];

  const selectById = (deviceId: string) => {
    return devicesData ? devicesAdapter.getSelectors().selectById(devicesData, deviceId) : undefined;
  };

  return { ...other, devices, selectById };
};

export const useDevice = (deviceId: string, options?: UseQuerySubscriptionOptions) => {
  const { data: devicesData, ...other } = useGetDevicesQuery({ deviceId }, options);
  const device = devicesData ? devicesAdapter.getSelectors().selectById(devicesData, deviceId) : undefined;

  return { ...other, device };
};
