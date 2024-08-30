import { useEffect, useReducer } from 'react';
import { DeleteActionModal, ModalState } from '../types';
import { defaultModalState, deviceModalReducer } from '../reducers/devicesReducer';
import { DeviceModel, GatewayModel } from '../../../../../../api-types/models';
import * as gatewayCoreAPI from '../../../../../../actions/gateways';
import { isCommissioned as isDeviceCommissioned } from '../../../../../../utils';

interface useSpaceInfoProps {
  device?: DeviceModel | GatewayModel;
  onConfirmDelete: () => void;
  onDismissDelete: () => void;
}

export const useDeviceModalInfo = ({ device, onConfirmDelete, onDismissDelete }: useSpaceInfoProps): ModalState => {
  const [modalState, dispatchModal] = useReducer(deviceModalReducer, defaultModalState);

  const handleConfirmDeviceDeletion = () => {
    if (!device) {
      return;
    }

    dispatchModal({
      type: 'confirm-device-deletion',
      payload: {
        deviceName: device.name,
        onConfirm: onConfirmDelete,
        onDismiss: onDismissDelete,
      },
    });
  };

  const openDeleteModal = async () => {
    if (!device) {
      return;
    }

    const isGateway = 'wellcube/gateway' in device;
    const isCommissioned = isDeviceCommissioned(device);

    let action: DeleteActionModal | undefined = undefined;
    const payload = {
      isCommissioned,
      onConfirm: onConfirmDelete,
      onDismiss: onDismissDelete,
    };

    if (!isGateway && !isCommissioned) {
      action = { type: 'delete-dev-uncomm', payload };
    } else if (!isGateway && isCommissioned) {
      action = { type: 'delete-dev-comm', payload };
    } else if (isGateway && !isCommissioned) {
      action = { type: 'delete-gtw-uncomm', payload };
    } else {
      const gatewayDevices = await gatewayCoreAPI.getGatewayDevices(device.id, {
        commissioned: true,
      });

      action = {
        type: 'delete-gtw-comm',
        payload: {
          onConfirm: handleConfirmDeviceDeletion,
          onDismiss: onDismissDelete,
          devices: gatewayDevices.map((gatewayDevice) => ({
            id: gatewayDevice.id,
            name: gatewayDevice.name,
            location: gatewayDevice?.['wellcube/location'],
          })),
        },
      };
    }

    if (action) {
      dispatchModal(action);
    }
  };

  useEffect(() => {
    openDeleteModal();
  }, [device]);

  return modalState;
};
