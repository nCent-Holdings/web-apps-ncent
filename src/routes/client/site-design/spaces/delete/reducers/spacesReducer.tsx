import React from 'react';

import { ActionModal, ModalState } from '../types';
import List from '../../../../../../components/List/List';
import SpaceLocation from '../../../../../../components/SpaceLocation/SpaceLocation';

export const defaultModalState: ModalState = {
  prompt: '',
  title: 'Permanently delete this?',
  confirmPrompt: '',
  confirmValue: '',
  confirmText: 'DELETE',
  dismissText: 'CANCEL',
  onConfirm: () => undefined,
  onDismiss: () => undefined,
};

export const spaceModalReducer = (state: ModalState, action: ActionModal): ModalState => {
  switch (action.type) {
    case 'delete-space-gtw-none-dev-none': {
      // Delete a space with no devices
      const { onConfirm, onDismiss } = action.payload;

      return {
        ...defaultModalState,
        prompt: (
          <>
            Deleting will remove:
            <ul className="mt-3 list-square ps-[17px]">
              <li>the selected space</li>
              <li>all subspaces in the selected space</li>
            </ul>
          </>
        ),
        onConfirm,
        onDismiss,
        modalType: action.type,
      };
    }
    case 'delete-space-gtw-none-dev-uncomm': {
      // Delete a space with uncommissioned purifiers or sensors
      const { onConfirm, onDismiss } = action.payload;

      return {
        ...defaultModalState,
        prompt: (
          <>
            Deleting will remove:
            <ul className="mt-3 list-square ps-[17px]">
              <li>the selected space</li>
              <li>all subspaces in the selected space</li>
              <li>device profiles and settings for the devices located in this space or any deleted subspace</li>
            </ul>
          </>
        ),
        onConfirm,
        onDismiss,
        modalType: action.type,
      };
    }
    case 'delete-space-gtw-none-dev-comm': {
      // Delete spaces with commissioned purifiers or sensors
      const { onConfirm, onDismiss } = action.payload;

      return {
        ...defaultModalState,
        prompt: (
          <>
            Deleting will remove:
            <ul className="mt-3 list-square ps-[17px]">
              <li>the selected space</li>
              <li>all subspaces in the selected space</li>
              <li>device profiles and settings for devices located within the space and subspaces</li>
            </ul>
            <p className="mt-3">{`Devices must be factory reset before they can be recommissioned.`}</p>
          </>
        ),
        onConfirm,
        onDismiss,
        modalType: action.type,
      };
    }
    case 'delete-space-gtw-uncomm-dev-none': {
      // Delete space with uncommissioned gateway with no other devices
      const { onConfirm, onDismiss } = action.payload;

      return {
        ...defaultModalState,
        prompt: (
          <>
            Deleting will remove:
            <ul className="mt-3 list-square ps-[17px]">
              <li>the selected space</li>
              <li>all subspaces in the selected space</li>
              <li>the gateway in the space</li>
              <li>all device assignments to the gateway</li>
            </ul>
          </>
        ),
        onConfirm,
        onDismiss,
        modalType: action.type,
      };
    }
    case 'delete-space-gtw-uncomm-dev-comm': // Delete a space with uncommissioned gateway and (commissioned) devices
    case 'delete-space-gtw-uncomm-dev-uncomm': {
      // Delete a space with uncommissioned gateway and (uncommissioned) devices
      const { onConfirm, onDismiss } = action.payload;

      return {
        ...defaultModalState,
        prompt: (
          <>
            Deleting will remove:
            <ul className="mt-3 list-square ps-[17px]">
              <li>the selected space</li>
              <li>all subspaces in the selected space</li>
              <li>the gateway in the space</li>
              <li>all device assignments to the gateway</li>
              <li>device profiles and settings for the devices located in any deleted space or subspace</li>
            </ul>
          </>
        ),
        onConfirm,
        onDismiss,
        modalType: action.type,
      };
    }
    case 'delete-space-gtw-comm': {
      // Delete a space with a commissioned gateway
      const { devices, onConfirm, onDismiss } = action.payload;

      return {
        ...defaultModalState,
        title: `Permanently delete this space?`,
        confirmText: 'I UNDERSTAND',
        prompt: (
          <div className="mt-4">
            <div className="w-full rounded-lg bg-blue-brilliant px-5 py-4">
              <span className="text-base font-semibold text-white-light">
                {`ATTENTION: To keep devices online and connected, you must reassign them to another gateway before you delete this one or you'll need to factory reset all devices.`}
              </span>
            </div>

            <div className="mt-[42px] flex flex-row">
              <div className="w-1/2 pr-8">
                This space contains a commissioned gateway. Deleting will remove:
                <ul className="my-3 list-square ps-[17px]">
                  <li>the selected space</li>
                  <li>any subspaces in the selected space</li>
                  <li>the gateway in the space</li>
                  <li>all device assignments to this gateway</li>
                  <li>device profiles and settings for the devices located in any deleted space or subspace</li>
                </ul>
                {`Devices must be factory reset before they can be recommissioned.`}
              </div>

              <div className="w-1/2 border-l border-blue-suede-light pl-8">
                <span className="text-body font-semibold text-black-dark">
                  The following devices are connected to the affected gateway:
                </span>

                {devices.length > 0 ? (
                  <List
                    className="mt-5 max-h-[268px] overflow-x-hidden overscroll-none"
                    data={devices.map((device) => (
                      <SpaceLocation key={device.id} location={device.location} />
                    ))}
                  />
                ) : (
                  <p>
                    <br></br>
                    No devices will be impacted.
                  </p>
                )}
              </div>
            </div>
          </div>
        ),
        onConfirm,
        onDismiss,
        modalType: action.type,
      };
    }
    case 'confirm-space-deletion': {
      const { spaceName, onConfirm, onDismiss } = action.payload;

      return {
        ...defaultModalState,
        confirmText: 'I UNDERSTAND & DELETE',
        confirmPrompt: 'Please type the name of the space to confirm.',
        confirmValue: spaceName,
        prompt: (
          <>
            This action cannot be undone. This will permanently delete the space <b>{spaceName}</b> and the contents
            just described.
          </>
        ),
        onConfirm,
        onDismiss,
        modalType: action.type,
      };
    }
    default:
      return state;
  }
};
