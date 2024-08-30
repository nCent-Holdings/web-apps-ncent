import React, { useState } from 'react';
import { Button, Input, Modal } from '@ncent-holdings/ux-components';

import * as spaceCoreAPI from '@src/actions/spaces';
import { SpaceModel } from '@src/api-types/models';

import { useSpaceModalInfo } from './hooks/useSpaceInfo';

interface DeleteSpacesProps {
  selectedSpace: SpaceModel;
  setIsModalOpen: (isOpen: boolean) => void;
  isOpen?: boolean;
}

const DeleteSpaces = ({ isOpen, setIsModalOpen, selectedSpace }: DeleteSpacesProps) => {
  const [confirmInputValue, setConfirmInputValue] = useState('');

  const handleOnDismiss = () => {
    setIsModalOpen(false);
    setConfirmInputValue('');
  };

  const handleOnConfirm = async () => {
    try {
      await spaceCoreAPI.deleteSpace(selectedSpace?.id);
      handleOnDismiss();
    } catch (e) {
      console.log('error on deleting space:', selectedSpace);
    }
  };

  const modalState = useSpaceModalInfo({
    space: selectedSpace,
    onConfirmDelete: handleOnConfirm,
    onDismissDelete: handleOnDismiss,
  });

  const { prompt, title, onDismiss, onConfirm, confirmText, dismissText, confirmPrompt, confirmValue, modalType } =
    modalState;

  return (
    <Modal onClose={onDismiss} open={isOpen && !!modalType} showCloseButton={true}>
      <div>
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
        <Button size="medium" variant="secondary" className="min-w-[120px]" label={dismissText} onClick={onDismiss} />
        <Button
          size="medium"
          variant="primary"
          className="min-w-[120px]"
          label={confirmText}
          onClick={onConfirm}
          disabled={!!confirmValue && confirmValue.toLowerCase() !== confirmInputValue.toLocaleLowerCase()}
        />
      </div>
    </Modal>
  );
};

export default DeleteSpaces;
