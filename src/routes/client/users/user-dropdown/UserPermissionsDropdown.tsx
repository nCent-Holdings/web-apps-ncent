import React from 'react';
import useSession from '@src/api-hooks/session/useSession';
import * as orgActions from '@actions/organizations';
import * as userActions from '@actions/user';
import { Button, Dropdown } from '@ncent-holdings/ux-components';
import { twMerge } from 'tailwind-merge';
import InviteModal, { type Permission } from '@src/routes/client/users/InviteModal';
import { type User } from '@src/routes/client/users/types';

type UserPermissionsDropdown = {
  user: User;
};

export const UserPermissionsDropdown = ({ user }: UserPermissionsDropdown) => {
  const [active, setActive] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editPermission, setEditPermission] = React.useState<Permission>('site-admin');

  const { id: userId, orgId, email, permissionScope, permissionType, siteIds, status, invitationId } = user;

  const [, sessionAPI] = useSession();
  const { isDelosAdmin, isCurrentOrgAdmin } = sessionAPI.getUserPermissions();
  const isCurrentAuthorizedUser = sessionAPI.checkIfCurrentAuthorizedUser(userId);

  const closeModal = () => setIsModalOpen(false);

  function toggleEdit() {
    setActive(!active);
  }

  async function handleSelection(value: string) {
    if (value) setActive(false);
    if (value === 'organization') {
      await orgActions.addAdmin(orgId, userId);

      if (status !== 'ACTIVE' && invitationId) {
        try {
          await userActions.renewInvitation(invitationId);
        } catch (e) {
          console.error(e);
        }
      }
    }
    if (value === 'site') {
      setEditPermission('site-admin');
      setIsModalOpen(true);
    }
  }

  if (permissionType === 'external') return <span className="capitalize text-black-soft">External Collaborator</span>;

  const permissionLabel = permissionScope === 'organization' ? 'Org admin' : 'Site admin';

  return (
    <div className="flex w-[190px] items-center justify-between">
      {active ? (
        <Dropdown
          value={{
            id: permissionLabel,
            value: permissionLabel,
            label: permissionLabel,
          }}
          options={[
            { id: 'organization', value: 'organization', label: 'Org admin' },
            { id: 'site', value: 'site', label: 'Site admin' },
          ]}
          handleSelection={(options) => handleSelection(options[0]?.value)}
          classNames={{
            container: () => 'w-[150px]',
            indicatorsContainer: () => 'min-h-9 h-9',
          }}
        />
      ) : (
        <span className="capitalize text-black-soft">{permissionLabel}</span>
      )}
      {(isCurrentOrgAdmin || isDelosAdmin) && !isCurrentAuthorizedUser && (
        <Button
          size="small"
          variant={active ? 'primary' : 'inverse'}
          onClick={toggleEdit}
          label={<i className={twMerge('icon icon-16 m-2', active ? 'wcicon-xmark' : 'wcicon-pen')} />}
          className={twMerge('h-6 w-6 min-w-0 rounded p-0', !active && 'border-none !bg-transparent !shadow-none')}
        />
      )}

      {isModalOpen && email && (
        <InviteModal
          isEditMode={true}
          organizationId={orgId}
          onCancel={closeModal}
          onFailure={closeModal}
          onSuccess={closeModal}
          defaultData={{
            email: email,
            permission: editPermission,
            siteIds: siteIds,
          }}
        />
      )}
    </div>
  );
};
