import { createEntityAdapter } from '@reduxjs/toolkit';
import { UseQuerySubscriptionOptions } from '@reduxjs/toolkit/query/react/types';

import { SensorModel } from '../../api-types/models';

import getResponseTransformer from '../getResponseTransformer';
import getQueryCacheHandlers from '../getQueryCacheHandlers';
import { nvaApi } from '../nvaApi';

type TQueryArgs = { sensorId?: string; siteId?: string; gatewayId?: string; searchNoun?: string };

function getSensorsNoun({ sensorId, siteId, gatewayId, searchNoun }: TQueryArgs): string {
  let sensorsNoun = 'wellcube/sensor';

  if (sensorId) {
    return `id=${sensorId}`;
  }

  if (siteId) {
    sensorsNoun = [sensorsNoun, `(wellcube/device.site_id=${siteId})`].join('.');
  }

  if (gatewayId) {
    sensorsNoun = [sensorsNoun, `(wellcube/device.gateway_id=${gatewayId})`].join('.');
  }

  if (searchNoun) {
    sensorsNoun = [sensorsNoun, `(${searchNoun})`].join('.');
  }

  return sensorsNoun;
}

export const sensorsAdapter = createEntityAdapter<SensorModel>();

export const sensorsApi = nvaApi.injectEndpoints({
  endpoints: (builder) => ({
    getSensors: builder.query({
      query: (arg) => `${getSensorsNoun(arg)}.get`,
      transformResponse: getResponseTransformer<SensorModel>(sensorsAdapter),
      ...getQueryCacheHandlers<TQueryArgs, SensorModel>({
        entityAdapter: sensorsAdapter,
        createNoun: getSensorsNoun,
      }),
      providesTags: ['Sensors'],
    }),
  }),
});

export const { useGetSensorsQuery } = sensorsApi;

export const useSensors = (arg: TQueryArgs = {}, options?: UseQuerySubscriptionOptions) => {
  const { data: sensorsData, ...other } = useGetSensorsQuery(arg, options);
  const sensors = sensorsData ? sensorsAdapter.getSelectors().selectAll(sensorsData) : [];

  const selectById = (sensorId: string) => {
    return sensorsData ? sensorsAdapter.getSelectors().selectById(sensorsData, sensorId) : undefined;
  };

  return { ...other, sensors, selectById };
};

export const useSensor = (sensorId: string, options?: UseQuerySubscriptionOptions) => {
  const { data: sensorsData, ...other } = useGetSensorsQuery({ sensorId }, options);
  const sensor = sensorsData ? sensorsAdapter.getSelectors().selectById(sensorsData, sensorId) : undefined;

  return { ...other, sensor };
};
