import { useEffect, useReducer } from 'react';
import { DeleteActionModal, ModalState } from '../types';
import { defaultModalState, spaceModalReducer } from '../reducers/spacesReducer';
import * as spaceCoreAPI from '../../../../../../actions/spaces';
import * as gatewayCoreAPI from '../../../../../../actions/gateways';
import { getSpaceStats } from '../utils';
import { SpaceModel } from '@src/api-types/models';

interface useSpaceInfoProps {
  space?: SpaceModel;
  onConfirmDelete: () => void;
  onDismissDelete: () => void;
}

export const useSpaceModalInfo = ({ space, onConfirmDelete, onDismissDelete }: useSpaceInfoProps): ModalState => {
  const [modalState, dispatchModal] = useReducer(spaceModalReducer, defaultModalState);

  const handleConfirmSpaceDeletion = () => {
    if (!space) {
      return;
    }

    dispatchModal({
      type: 'confirm-space-deletion',
      payload: {
        spaceName: space.name,
        onConfirm: onConfirmDelete,
        onDismiss: onDismissDelete,
      },
    });
  };

  const openDeleteModal = async () => {
    if (!space) {
      return;
    }

    const subspaces = await spaceCoreAPI.getSubspaces(space.id);
    const gateways = await spaceCoreAPI.getSpacesGateways([space.id, ...subspaces.map((subspace) => subspace.id)]);

    const {
      hasCommSpaceDevices,
      gatewaysWithCommDevicesIds,
      hasGateways,
      hasCommissionedGateways,
      hasUncommissionedSpaceDevices,
    } = getSpaceStats(space, subspaces, gateways);

    let action: DeleteActionModal | undefined = undefined;
    const payload = {
      hasCommSpaceDevices,
      onConfirm: onConfirmDelete,
      onDismiss: onDismissDelete,
    };

    if (!hasGateways && !hasCommSpaceDevices && !hasUncommissionedSpaceDevices) {
      action = { type: 'delete-space-gtw-none-dev-none', payload };
    } else if (!hasGateways && !hasCommSpaceDevices && hasUncommissionedSpaceDevices) {
      action = { type: 'delete-space-gtw-none-dev-uncomm', payload };
    } else if (!hasGateways && hasCommSpaceDevices) {
      action = { type: 'delete-space-gtw-none-dev-comm', payload };
    } else if (hasGateways && !hasCommissionedGateways && !hasCommSpaceDevices && !hasUncommissionedSpaceDevices) {
      action = { type: 'delete-space-gtw-uncomm-dev-none', payload };
    } else if (hasGateways && !hasCommissionedGateways && !hasCommSpaceDevices && hasUncommissionedSpaceDevices) {
      action = { type: 'delete-space-gtw-uncomm-dev-uncomm', payload };
    } else if (hasGateways && !hasCommissionedGateways && hasCommSpaceDevices) {
      action = { type: 'delete-space-gtw-uncomm-dev-comm', payload };
    } else {
      const gatewaysDevices = await gatewayCoreAPI.getGatewaysDevices(gatewaysWithCommDevicesIds, {
        commissioned: true,
      });

      action = {
        type: 'delete-space-gtw-comm',
        payload: {
          devices: gatewaysDevices.map((gatewayDevice) => ({
            id: gatewayDevice.id,
            name: gatewayDevice.name,
            location: gatewayDevice?.['wellcube/location'],
          })),
          onConfirm: handleConfirmSpaceDeletion,
          onDismiss: onDismissDelete,
        },
      };
    }

    if (action) {
      dispatchModal(action);
    }
  };

  useEffect(() => {
    openDeleteModal();
  }, [space]);

  return modalState;
};
