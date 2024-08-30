import React, { useEffect } from 'react';
import { DeviceDetailsProps } from './common/types';
import DeviceDetails from '@components/DeviceDetailsModal/DeviceDetails';
import { Modal } from '@ncent-holdings/ux-components';

export const DeviceDetailsModal: React.FC<DeviceDetailsProps> = ({ deviceId, onClose }) => {
  useEffect(() => {
    console.log('Device ID: ', { deviceId });
  }, [deviceId]);

  return (
    <Modal
      open={deviceId !== ''}
      onClose={onClose}
      showCloseButton={false}
      onClickOutside={onClose}
      maxWidth="lg"
      modalStyle="max-w-[853px]"
      innerStyle="p-[1.25rem]"
    >
      <>{deviceId && <DeviceDetails deviceId={deviceId} onClose={onClose} />}</>
    </Modal>
  );
};

export default DeviceDetailsModal;
