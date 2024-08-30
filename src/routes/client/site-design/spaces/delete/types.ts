import { WellcubeLocation } from '../../../../../api-types/wellcube';

type DeleteActionType =
  | 'delete-space-gtw-none-dev-none'
  | 'delete-space-gtw-none-dev-uncomm'
  | 'delete-space-gtw-none-dev-comm'
  | 'delete-space-gtw-uncomm-dev-none'
  | 'delete-space-gtw-uncomm-dev-uncomm'
  | 'delete-space-gtw-uncomm-dev-comm'
  | 'delete-space-gtw-comm';

export type ConfirmActionType = 'confirm-space-deletion';

export type DeleteActionModal =
  | {
      type: Exclude<DeleteActionType, 'delete-space-gtw-comm'>;
      payload: {
        hasCommSpaceDevices: boolean;
        onConfirm: () => void;
        onDismiss: () => void;
      };
    }
  | {
      type: 'delete-space-gtw-comm';
      payload: {
        devices: { id: string; name: string; location: WellcubeLocation | undefined }[];
        onConfirm: () => void;
        onDismiss: () => void;
      };
    };

export type ConfirmActionModal = {
  type: ConfirmActionType;
  payload: {
    spaceName: string;
    onConfirm: () => void;
    onDismiss: () => void;
  };
};

export type ActionModal = DeleteActionModal | ConfirmActionModal;

export type ModalState = {
  prompt?: string | JSX.Element;
  title?: string;
  confirmPrompt?: string;
  confirmValue?: string;
  confirmText?: string;
  dismissText?: string;
  onConfirm: () => void;
  onDismiss: () => void;
  modalType?: DeleteActionType | ConfirmActionType;
};
