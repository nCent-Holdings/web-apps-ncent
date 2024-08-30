import { useEffect, useReducer } from 'react';
import { ActionModal, ModalState } from '../types';

import * as organizationsCoreAPI from '../../../../../actions/organizations';

import { defaultModalState, organizationModalReducer } from '../reducers/organizationReducer';

type useDeleteOrganizationProps = {
  org: {
    id: string;
    orgName: string;
  };
  onConfirmDelete: () => void;
  onDismissDelete: () => void;
};

export const useDeleteOrganization = ({
  org,
  onConfirmDelete,
  onDismissDelete,
}: useDeleteOrganizationProps): ModalState => {
  const [modalState, dispatchModal] = useReducer(organizationModalReducer, defaultModalState);

  const openDeleteModal = async () => {
    const orgSitesCount = await organizationsCoreAPI.countOrgSites(org.id);

    let action: ActionModal | undefined = undefined;
    const payload: ActionModal['payload'] = {
      orgName: org.orgName,
      onConfirm: onConfirmDelete,
      onDismiss: onDismissDelete,
    };

    if (orgSitesCount) {
      action = { type: 'delete-organization-has-sites', payload };
    } else {
      action = { type: 'delete-organization-no-sites', payload };
    }

    if (action) {
      dispatchModal(action);
    }
  };

  useEffect(() => {
    openDeleteModal();
  }, [org]);

  return modalState;
};
