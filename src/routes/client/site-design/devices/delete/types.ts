import { WellcubeLocation } from '../../../../../api-types/wellcube';

export type DeleteActionType = 'delete-gtw-uncomm' | 'delete-gtw-comm' | 'delete-dev-uncomm' | 'delete-dev-comm';

export type ConfirmActionType = 'confirm-device-deletion';

export type DeleteActionModal =
  | {
      type: Exclude<DeleteActionType, 'delete-gtw-comm'>;
      payload: {
        isCommissioned: boolean;
        onConfirm: () => void;
        onDismiss: () => void;
      };
    }
  | {
      type: 'delete-gtw-comm';
      payload: {
        devices: { id: string; name: string; location: WellcubeLocation | undefined }[];
        onConfirm: () => void;
        onDismiss: () => void;
      };
    };

export type ConfirmActionModal = {
  type: ConfirmActionType;
  payload: { deviceName: string; onConfirm: () => void; onDismiss: () => void };
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
