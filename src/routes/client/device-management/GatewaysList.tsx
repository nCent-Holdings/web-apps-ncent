import React from 'react';
import { SortingState } from '@tanstack/react-table';
import { GatewayModel } from '../../../api-types/models';

import DevicesListBase from './DevicesListBase';
import { columns } from './GatewayColsDef';

import { Gateway, DEVICE_TYPE } from './types';

import { cleanGateways } from './utils';
import { dumpGatewayModel } from './dumps';

export type GatewaysListProps = {
  gateways: GatewayModel[];
  loading?: boolean;
  emptyMessage?: React.ReactNode;
  sorting: SortingState;
  onSortChange: (newSorting: SortingState) => void;
  onClickCard?: (...args: any[]) => void;
};

const GatewaysList: React.FC<GatewaysListProps> = ({
  gateways,
  loading,
  emptyMessage,
  sorting,
  onSortChange,
  onClickCard,
}) => {
  const gatewaysData: Gateway[] = gateways.map(dumpGatewayModel);

  const cleanGatewaysData = cleanGateways(gatewaysData);

  return (
    <DevicesListBase<Gateway>
      data={cleanGatewaysData}
      columns={columns}
      deviceType={DEVICE_TYPE.GATEWAY}
      loading={loading}
      emptyMessage={emptyMessage}
      sorting={sorting}
      onSortChange={onSortChange}
      onClickCard={onClickCard}
    />
  );
};

export default React.memo(GatewaysList);
