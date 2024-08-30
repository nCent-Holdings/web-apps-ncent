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

export const deviceModalReducer = (state: ModalState, action: ActionModal): ModalState => {
  switch (action.type) {
    case 'delete-dev-uncomm': {
      // Delete uncommissioned purifiers or sensors
      const { onConfirm, onDismiss } = action.payload;

      return {
        ...defaultModalState,
        prompt: (
          <>
            Deleting will remove:
            <ul className="mt-3 list-square ps-[17px]">
              <li>device profile and settings for the selected device</li>
            </ul>
          </>
        ),
        onConfirm,
        onDismiss,
        modalType: action.type,
      };
    }
    case 'delete-dev-comm': {
      // Delete a single commissioned purifier or sensor
      const { onConfirm, onDismiss } = action.payload;

      return {
        ...defaultModalState,
        prompt: (
          <>
            Deleting will remove:
            <ul className="mt-3 list-square ps-[17px]">
              <li>device profile and settings</li>
            </ul>
            <p className="mt-3">{`Devices must be factory reset before they can be recommissioned.`}</p>
          </>
        ),
        onConfirm,
        onDismiss,
        modalType: action.type,
      };
    }
    case 'delete-gtw-uncomm': {
      // Delete uncommissioned gateway
      const { onConfirm, onDismiss } = action.payload;

      return {
        ...defaultModalState,
        prompt: (
          <>
            Deleting will remove:
            <ul className="mt-3 list-square ps-[17px]">
              <li>device profiles and settings for this gateway</li>
              <li>all device assignments to the gateway</li>
            </ul>
          </>
        ),
        onConfirm,
        onDismiss,
        modalType: action.type,
      };
    }
    case 'delete-gtw-comm': {
      // Delete commissioned gateway
      const { devices, onConfirm, onDismiss } = action.payload;

      return {
        ...defaultModalState,
        title: `Permanently delete this gateway?`,
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
                This is a commissioned gateway. Deleting will remove:
                <ul className="my-3 list-square ps-[17px]">
                  <li>all device assignments to the gateway</li>
                  <li>device profiles and settings for devices assigned to this gateway</li>
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
                      <SpaceLocation key={device.id} location={device?.location} />
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
    case 'confirm-device-deletion': {
      const { deviceName, onConfirm, onDismiss } = action.payload;

      return {
        ...defaultModalState,
        confirmText: 'I UNDERSTAND & DELETE',
        confirmPrompt: 'Please type the name of the gateway to confirm.',
        confirmValue: deviceName,
        prompt: (
          <>
            This action cannot be undone. This will permanently delete the gateway <b>{deviceName}</b> and the contents
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
