import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Button, Modal, Input } from '@ncent-holdings/ux-components';

import * as deviceCoreAPI from '../../../../../actions/devices';

import { useDeviceModalInfo } from './hooks/useDeviceInfo';
import { DeviceModel, GatewayModel } from '../../../../../api-types/models';

interface DeleteDevicesProps {
  selectedDevice: DeviceModel | GatewayModel;
  setIsModalOpen: (isOpen: boolean) => void;
  isOpen?: boolean;
}

const DeleteDevices = ({ isOpen, setIsModalOpen, selectedDevice }: DeleteDevicesProps) => {
  const [confirmInputValue, setConfirmInputValue] = useState('');

  const handleOnDismiss = () => {
    setIsModalOpen(false);
    setConfirmInputValue('');
  };

  const handleOnConfirm = async () => {
    try {
      await deviceCoreAPI.deleteDevice(selectedDevice?.id);
      handleOnDismiss();
    } catch (e) {
      console.log('error on deleting device:', selectedDevice);
    }
  };

  const modalState = useDeviceModalInfo({
    device: selectedDevice,
    onConfirmDelete: handleOnConfirm,
    onDismissDelete: handleOnDismiss,
  });

  const { prompt, title, onDismiss, onConfirm, confirmText, dismissText, confirmPrompt, confirmValue, modalType } =
    modalState;

  return (
    <Modal onClose={onDismiss} open={isOpen && !!modalType} showCloseButton={true}>
      <div className={twMerge('', modalType === 'delete-gtw-comm' && 'max-w-[960px]')}>
        <h1 className={'mb-6 text-[1.5rem] font-semibold leading-[1.25] tracking-[-.0625rem]'}>{title}</h1>

        <div>{prompt}</div>

        {confirmValue && (
          <>
            <p className="mt-3">{confirmPrompt}</p>
            <Input
              id={'confirm-value'}
              type="text"
              placeholder="Enter the phrase above to confirm"
              classes="mt-8"
              onChange={(e) => setConfirmInputValue((e.target as HTMLInputElement).value)}
              value={confirmInputValue}
            />
          </>
        )}
      </div>

      <div className="mt-12 flex items-center justify-center gap-3">
        <Button
          size="medium"
          variant="secondary"
          className="w-fit min-w-[140px] px-[22px]"
          label={dismissText}
          onClick={onDismiss}
        />
        <Button
          size="medium"
          variant="primary"
          className="w-fit min-w-[140px] px-[22px]"
          label={confirmText}
          onClick={onConfirm}
          disabled={!!confirmValue && confirmValue.toLowerCase() !== confirmInputValue.toLocaleLowerCase()}
        />
      </div>
    </Modal>
  );
};

export default DeleteDevices;
