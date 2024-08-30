type ActionType = 'delete-organization-has-sites' | 'delete-organization-no-sites';

export type ActionModal = {
  type: ActionType;
  payload: {
    orgName: string;
    onConfirm: () => void;
    onDismiss: () => void;
  };
};

export type ModalState = {
  title?: string;
  prompt?: string | JSX.Element;
  confirmPrompt?: string | JSX.Element;
  confirmValue?: string;
  confirmText?: string;
  dismissText?: string;
  onConfirm: () => void;
  onDismiss: () => void;
  modalType?: ActionType;
};
