import React from 'react';
import { match, P } from 'ts-pattern';
import { SpItem } from '@ncent-holdings/ux-components';

import siteDesignSelectors from '@src/features/site-design/siteDesign.selectors';
import { siteDesignActions } from '@src/features/site-design/siteDesign.slice';

import DeviceIcon from '../../DeviceIcon/DeviceIcon';
import { useDispatch, useSelector } from 'react-redux';
import { DeviceModel } from '../../../api-types/models';
import { getLongName } from '../../../utils/productNames';
import { WellcubeDevice } from '../../../api-types/wellcube';

interface SpaceDeviceId {
  device: DeviceModel;
}

type DeviceStatus = 'incomplete' | 'commissioned' | 'complete';

const SpaceDevice = ({ device }: SpaceDeviceId) => {
  const dispatch = useDispatch();

  const getDeviceStatus = (deviceInfo?: WellcubeDevice): DeviceStatus =>
    match(deviceInfo)
      .with({ gateway_id: '', device_type: P.not('gateway') }, () => 'incomplete')
      .otherwise(() => 'commissioned') as DeviceStatus;

  const deviceInfo = device?.['wellcube/device'];

  const status = getDeviceStatus(deviceInfo);

  const selectedDeviceId = useSelector(siteDesignSelectors.selectSelectedDeviceId);
  const isSelected = selectedDeviceId === device.id;

  const handleSelectDevice = () => {
    if (isSelected) {
      dispatch(siteDesignActions.setSelectedDeviceId({}));
    } else {
      dispatch(siteDesignActions.setSelectedDeviceId({ deviceId: device.id }));
    }
  };

  const productName = getLongName(deviceInfo?.model || '');

  return (
    <SpItem
      itemId={deviceInfo?.asset_id}
      itemState={status}
      itemTitle={device?.name}
      itemModel={productName}
      itemSelected={isSelected}
      itemIcon={
        <DeviceIcon deviceType={deviceInfo?.device_type} connectivity={deviceInfo?.status} containerClassName="mr-4" />
      }
      onSelectItem={handleSelectDevice}
      checkboxAttributes={{
        'data-keep-right-panel': true,
      }}
    />
  );
};

export default SpaceDevice;
