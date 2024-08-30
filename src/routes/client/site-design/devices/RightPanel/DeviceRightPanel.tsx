import React, { useState } from 'react';
import DeviceProfile from './DeviceProfile';
import DeviceInfo from './DeviceInfo';
import { DeviceModel } from '../../../../../api-types/models';
import DeviceSettings from './DeviceSettings/DeviceSettings';
import { Status } from '../../../../../components/BadgeStatus/types';

interface DeviceRightPanelProps {
  device?: DeviceModel;
}

export const DeviceRightPanel = ({ device }: DeviceRightPanelProps) => {
  const [updateStatus, setUpdateStatus] = useState('');

  const handleUpdateStatus = (status: Status | '') => {
    setUpdateStatus(status);
  };

  return (
    <>
      <DeviceProfile device={device} updateStatus={updateStatus} handleUpdateStatus={handleUpdateStatus} />
      <DeviceSettings device={device} handleUpdateStatus={handleUpdateStatus} />
      <DeviceInfo device={device} />
    </>
  );
};

export default DeviceRightPanel;
