import React from 'react';

import { ActionModal, ModalState } from '../types';

export const defaultModalState: ModalState = {
  prompt: '',
  title: 'Are you sure?',
  confirmPrompt: '',
  confirmValue: '',
  confirmText: 'DELETE',
  dismissText: 'CANCEL',
  onConfirm: () => undefined,
  onDismiss: () => undefined,
};

export const organizationModalReducer = (state: ModalState, action: ActionModal): ModalState => {
  switch (action.type) {
    case 'delete-organization-has-sites': {
      const { onDismiss } = action.payload;

      return {
        ...defaultModalState,
        title: 'Additional action required',
        prompt: 'Before you can delete this organization profile, you must first remove all sites.',
        confirmText: 'CLOSE',
        dismissText: '',
        onConfirm: onDismiss,
        onDismiss,
        modalType: action.type,
      };
    }
    case 'delete-organization-no-sites': {
      const { orgName, onConfirm, onDismiss } = action.payload;

      return {
        ...defaultModalState,
        prompt: 'This action cannot be undone. This will permanently delete the organization record.',
        confirmText: 'I UNDERSTAND & DELETE',
        confirmPrompt: (
          <>
            {'Please type '}
            <b>{orgName}</b>
            {' to confirm deletion.'}
          </>
        ),
        confirmValue: orgName,
        onConfirm,
        onDismiss,
        modalType: action.type,
      };
    }
    default:
      return state;
  }
};
