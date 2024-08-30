import React, { useState } from 'react';
import { Button, Input, Modal } from '@ncent-holdings/ux-components';

import * as organizationsCoreAPI from '../../../../actions/organizations';

import { useDeleteOrganization } from './hooks/useDeleteOrganization';

type DeleteOrganizationProps = {
  org: {
    id: string;
    orgName: string;
  };
  isOpen?: boolean;
  onDelete?: () => void;
  onClose?: () => void;
};

const DeleteOrganization = ({ org, isOpen, onDelete, onClose }: DeleteOrganizationProps) => {
  const [confirmInputValue, setConfirmInputValue] = useState('');

  const handleOnClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleOnDelete = async () => {
    await organizationsCoreAPI.deleteOrg(org.id);

    if (onDelete) {
      onDelete();
    }

    handleOnClose();
  };

  const modalState = useDeleteOrganization({
    org,
    onConfirmDelete: handleOnDelete,
    onDismissDelete: handleOnClose,
  });

  const { title, prompt, confirmPrompt, confirmValue, confirmText, dismissText, onDismiss, onConfirm, modalType } =
    modalState;

  return (
    <Modal open={isOpen && !!modalType} onClose={onDismiss} showCloseButton>
      <div className="mb-[36px]">
        <div className={'mb-6 text-[1.5rem] font-semibold leading-[1.25] tracking-[-.0625rem]'}>{title}</div>

        <div>{prompt}</div>

        {confirmValue && (
          <>
            <p className="text-body mt-3 text-black-dark">{confirmPrompt}</p>

            <Input
              id={'confirm-value'}
              type="text"
              placeholder="Enter the organization name"
              classes="mt-9"
              onChange={(e) => setConfirmInputValue((e.target as HTMLInputElement).value)}
              value={confirmInputValue}
            />
          </>
        )}
      </div>

      <div className="flex w-full items-center justify-center gap-3">
        {dismissText ? (
          <Button
            size="medium"
            variant="secondary"
            className="w-fit min-w-[140px] px-[22px]"
            label={dismissText}
            onClick={onDismiss}
          />
        ) : null}

        <Button
          size="medium"
          variant="primary"
          className="w-fit min-w-[140px] px-[22px]"
          label={confirmText}
          onClick={onConfirm}
          disabled={!!confirmValue && confirmValue !== confirmInputValue}
        />
      </div>
    </Modal>
  );
};

export default DeleteOrganization;
