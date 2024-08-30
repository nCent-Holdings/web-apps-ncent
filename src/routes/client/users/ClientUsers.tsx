import React, { useState } from 'react';
import ScrollVisibleElement from '../../../components/ScrollVisibleElement/ScrollVisibleElement';
import { Button, Heading, Modal, Radio, RadioGroup } from '@ncent-holdings/ux-components';
import { TableWithGrouping } from '@src/components/Table';
import { columns } from './UsersColsDef';
import { Link } from 'react-router-dom';
import { useUsers } from '@src/api-hooks/users/usersApi';
import InviteModal from './InviteModal';
import { UserModel } from '@src/api-types/models';
import { useSites } from '@src/api-hooks/sites/sitesApi';
import { type User } from './types';
import dayjs from 'dayjs';
import { useOrganizationFromHandle } from '@src/features/useOrganizationFromHandle';

export const ClientUsers = () => {
  const [group, setGroup] = useState('internal');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);

  const { orgId: selectedOrgId } = useOrganizationFromHandle();

  const { selectById: selectSite } = useSites({ organizationId: selectedOrgId }, { skip: !selectedOrgId });

  const {
    users,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useUsers(
    {
      permissionsOrgId: selectedOrgId,
      permissionsType: group === 'internal' ? 'admin' : 'external',
    },
    { skip: !selectedOrgId },
  );

  function handleTabChange(value: string) {
    setGroup(value);
  }

  function handleInviteOpen() {
    setIsInviteOpen(true);
  }

  function handleInviteClose() {
    setIsInviteOpen(false);
  }

  const closeSuccess = async () => {
    setShowSuccessModal(false);
  };

  const closeFail = async () => {
    setShowFailModal(false);
  };

  const handleInviteSuccess = () => {
    setIsInviteOpen(false);
    setShowSuccessModal(true);
    refetchUsers();
  };

  const handleInviteFailure = () => {
    setIsInviteOpen(false);
    setShowFailModal(true);
  };

  const emptyMessage = () => (
    <div className="mx-auto my-[100px] flex max-w-[380px] flex-col items-center justify-center text-center">
      <p className="mb-6 text-h4 font-semibold">
        Your organization currently has no {group === 'internal' ? 'Users' : 'External Collaborators'}
      </p>
      <p className="mb-0 text-grey-600">Learn more about user permissions in the</p>
      <Link
        to={'https://support.delos.com/hc/en-us'}
        target="_blank"
        className=" cursor-pointer text-blue-brilliant underline"
      >
        Knowledge Base
      </Link>
    </div>
  );

  const dumpUserModel = (usersArr: UserModel[]): User[] => {
    return usersArr.reduce((acc: User[], item): User[] => {
      const userPermissions = item['wellcube/user_permissions']?.permissions;
      const currentOrgPermissions = userPermissions?.filter((perm) => perm.organization_id === selectedOrgId);
      const rows =
        currentOrgPermissions?.map((perm) => {
          const wellCubeUser = item['wellcube/user'];
          const invitation = wellCubeUser?.invitation;

          return {
            id: item.id,
            firstName: wellCubeUser?.first_name,
            secondName: wellCubeUser?.second_name,
            email: wellCubeUser?.email,
            status: invitation?.is_expired ? 'EXPIRED' : wellCubeUser?.status,
            invitationId: invitation?.id,

            permissionScope: perm.scope,
            permissionType: perm.type,
            siteId: perm.site_id || '',
            siteIds: currentOrgPermissions.filter((p) => p.scope === 'site').map((p) => p.site_id),
            orgId: perm.organization_id,
            siteName: perm.site_id ? selectSite(perm.site_id)?.name : '',
            statusDate: dayjs(invitation?.is_expired ? invitation?.expires_at : perm.status_date).format('MM/DD/YYYY'),
          };
        }) || [];

      return [...acc, ...rows];
    }, []);
  };

  return (
    <>
      <div className="relative z-[15] mb-10">
        <div className="relative z-[3] flex flex-row items-center justify-between">
          <div className="mb-3 ">
            <ScrollVisibleElement scrollTitle="Users">
              <Heading heading="Users" />
            </ScrollVisibleElement>
          </div>
          <Button
            size="small"
            variant="inverse"
            label={<span className="font-semibold">INVITE A USER</span>}
            onClick={handleInviteOpen}
          />
        </div>
        <div className="mt-8 flex flex-col gap-2">
          <RadioGroup
            direction="horizontal"
            variant="inline"
            name="view-by-radiogroup"
            value={group}
            onChange={handleTabChange}
            className="shadow-com-tab-container [&>.bg-blue-brilliant]:shadow-com-tab-selected"
          >
            <Radio key="internal" id="internal" label="INTERNAL" value="internal" />
            <Radio key="external" id="external" label="EXTERNAL" value="external" />
          </RadioGroup>
        </div>
      </div>

      <TableWithGrouping<User>
        data={dumpUserModel(users)}
        dataLoading={usersLoading}
        columns={columns}
        emptyMessage={emptyMessage()}
        isEditEnabled
        groupByColumn="id"
      />

      {isInviteOpen && (
        <InviteModal
          onCancel={handleInviteClose}
          onSuccess={handleInviteSuccess}
          onFailure={handleInviteFailure}
          organizationId={selectedOrgId}
        />
      )}

      <Modal onClose={closeSuccess} open={showSuccessModal} modalStyle="w-[500px]">
        <Heading heading="Success" />
        <div className="text-h4">Your invitation has been sent.</div>

        <div className="flex justify-center pt-12">
          <Button variant="inverse" label="Close" size="medium" onClick={closeSuccess} />
        </div>
      </Modal>
      <Modal onClose={closeFail} open={showFailModal} modalStyle="w-[500px]">
        <Heading heading="Fail" />
        <div className="text-h4">Your invitation was not successful.</div>
        <div className="flex justify-center gap-8 pt-12">
          <Button variant="inverse" label="Close" size="medium" onClick={closeFail} />
        </div>
      </Modal>
    </>
  );
};

export default ClientUsers;
