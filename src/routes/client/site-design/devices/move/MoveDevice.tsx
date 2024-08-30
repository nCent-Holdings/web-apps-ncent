import React, { useEffect, useState } from 'react';
import { Modal } from '@ncent-holdings/ux-components';

import { DeviceModel, GatewayModel } from '../../../../../api-types/models';
import MoveDeviceContent from './ModalContent/MoveDeviceContent';
import MoveGatewayContent from './ModalContent/MoveGatewayContent';
import SelectLocation from './ModalContent/SelectLocation';
import { useMoveDeviceMutation } from '@src/api-hooks/devices/devicesApi';

interface MoveDeviceProps {
  selectedDevice: DeviceModel | GatewayModel;
  onClose: () => void;
  isOpen?: boolean;
}

const MoveDevice = ({ isOpen, onClose, selectedDevice }: MoveDeviceProps) => {
  const [isGateway, setIsGateway] = useState(false);
  const [selectLocation, setSelectLocation] = useState(false);
  const [retainExisting, setRetainExisting] = useState(false);

  const [moveDevice] = useMoveDeviceMutation();

  useEffect(() => {
    if (selectedDevice?.['wellcube/device']?.device_type === 'gateway') setIsGateway(true);
    else setIsGateway(false);
  }, [selectedDevice]);

  const handleConfirm = (checkboxValue: boolean) => {
    setRetainExisting(checkboxValue);
    setSelectLocation(true);
  };

  const handleSubmit = async (selectedSpace: string) => {
    try {
      await moveDevice({
        deviceId: selectedDevice.id,
        spaceId: selectedSpace,
        keepAssignments: retainExisting,
      });

      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  const renderContent = () => {
    if (!selectLocation && isGateway) {
      return <MoveGatewayContent selectedDevice={selectedDevice} onCancel={onClose} onOk={handleConfirm} />;
    } else if (!selectLocation && !isGateway) {
      return <MoveDeviceContent selectedDevice={selectedDevice} onCancel={onClose} onOk={handleConfirm} />;
    } else if (selectLocation) {
      return (
        <SelectLocation
          selectedDevice={selectedDevice}
          isGateway={isGateway}
          retain={retainExisting}
          onCancel={onClose}
          onOk={handleSubmit}
        />
      );
    } else return <div>...</div>;
  };

  return (
    <Modal
      maxWidth={!selectLocation && !isGateway ? 'sm' : 'lg'}
      onClose={onClose}
      open={isOpen}
      showCloseButton={true}
    >
      {renderContent()}
    </Modal>
  );
};

export default MoveDevice;
