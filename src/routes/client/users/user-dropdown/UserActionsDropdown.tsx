import React from 'react';
import useSession from '@src/api-hooks/session/useSession';
import useOutsideClickHandler from '@src/hooks/useOutsideClickHandler';
import * as orgActions from '@actions/organizations';
import * as siteActions from '@actions/sites';
import * as userActions from '@actions/user';
import { Button, Heading, Modal, OvalLoader } from '@ncent-holdings/ux-components';
import { type User } from '@src/routes/client/users/types';
import { twMerge } from 'tailwind-merge';
import { useOrganizationFromHandle } from '@src/features/useOrganizationFromHandle';
import { toNameCase } from '@src/utils/stringUtils';

type UserActionsDropdownProps = {
  user: User;
};

type ModalDataProperties = {
  title: string;
  message: string;
  okLabel: string;
  cancelLabel: string;
  onOk: () => void;
};

type ModalType = 'remove' | 'renew';

const FALLBACK_EMAIL = 'wellcube@delos.com';

export const UserActionsDropdown = ({ user }: UserActionsDropdownProps) => {
  const [isDropdownShown, setIsDropdownShown] = React.useState(false);
  const [modalTypeShown, setModalTypeShown] = React.useState<ModalType | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const wrappedDropdownRef = React.useRef(null);
  const { orgName, tsmEmail = FALLBACK_EMAIL } = useOrganizationFromHandle();

  const { id: userId, orgId, siteId, permissionScope, permissionType, invitationId, status } = user;

  const [, sessionAPI] = useSession();
  const isCurrentAuthorizedUser = sessionAPI.checkIfCurrentAuthorizedUser(userId);
  const { isDelosAdmin, isCurrentOrgAdmin, isCurrentSiteAdmin } = sessionAPI.getUserPermissions(siteId);
  const disabledActions = !(isDelosAdmin || isCurrentOrgAdmin || isCurrentSiteAdmin);

  useOutsideClickHandler(wrappedDropdownRef, () => setIsDropdownShown(false));

  if (isCurrentAuthorizedUser) return;

  const handleCloseModal = () => setModalTypeShown(null);

  const handleRemoveAccess = async () => {
    setIsLoading(true);
    if (permissionScope === 'organization') await orgActions.removeAdmin(orgId, userId);
    if (permissionScope === 'site' && permissionType === 'admin') await siteActions.removeAdmin(siteId, userId);
    if (permissionScope === 'site' && permissionType === 'external') await siteActions.removeExternal(siteId, userId);

    if (user.email) {
      const scope = user.siteIds.length <= 1 ? 'org' : 'site';
      await userActions.sendNotificationEmail(
        user.email,
        `remove_${scope}_access.json`,
        'invitation@wellcube.io',
        'WellCube Access Removal',
        {
          userName: toNameCase(`${user.firstName} ${user.secondName}`),
          orgName: orgName,
          siteName: user.siteName,
          orgAdminEmailAddress: tsmEmail,
          tsmEmailAddress: tsmEmail,
          recipientEmailAddress: user.email,
          senderEmailAddress: 'invitation@wellcube.io',
        },
      );
    }

    setIsLoading(false);
    handleCloseModal();
  };

  const handleRenewInvitation = async () => {
    if (!invitationId) return;

    setIsLoading(true);
    try {
      await userActions.renewInvitation(invitationId);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }

    handleCloseModal();
  };

  const handleOpenModal = (type: ModalType) => () => setModalTypeShown(type);

  const renderDropdown = () => {
    const renderDropdownItem = (label: string, onClick?: () => void) => (
      <>
        <div
          className="cursor-pointer py-[10px] text-left text-[0.75rem] text-black-light-soft hover:text-blue-brilliant"
          onClick={onClick}
        >
          {label}
        </div>
      </>
    );
    return (
      <div
        ref={wrappedDropdownRef}
        className="absolute right-[-17px] top-10 z-[9] w-[152px] rounded-[8px] border border-[#D4DFEA] bg-white px-5 py-[10px] shadow-com-wc-tooltip"
      >
        {status?.toLowerCase() !== 'active' && renderDropdownItem('Renew invitation', handleOpenModal('renew'))}
        {renderDropdownItem('Remove access', handleOpenModal('remove'))}
        <span className="absolute right-5 top-[-8px] z-[10] h-[15px] w-[15px] rotate-45 border-l border-t border-[#D4DFEA] bg-white" />
      </div>
    );
  };

  const modalData: Record<ModalType, ModalDataProperties> = {
    remove: {
      title: 'Remove access',
      message: `Are you sure you want to delete this user's ${permissionScope} access?`,
      okLabel: 'DELETE',
      cancelLabel: 'CANCEL',
      onOk: handleRemoveAccess,
    },
    renew: {
      title: 'Invite details',
      message: 'This invitation will apply to all sites within the organization that the user is assigned to.',
      okLabel: 'SEND',
      cancelLabel: 'CANCEL',
      onOk: handleRenewInvitation,
    },
  };

  return (
    <>
      <button
        className={twMerge(
          'flex w-full cursor-pointer items-center justify-center',
          disabledActions && 'cursor-not-allowed opacity-40',
        )}
        onClick={() => setIsDropdownShown(!isDropdownShown)}
        disabled={disabledActions}
      >
        <div className="relative">
          <i className="icon icon-24 wcicon-dots-vertical font-bold" />
          {isDropdownShown && renderDropdown()}
        </div>
      </button>

      {modalTypeShown && (
        <Modal
          onClose={handleCloseModal}
          open={Boolean(modalTypeShown)}
          innerStyle={twMerge('relative h-auto bg-white-soft p-0')}
          closeBtnExtendClass="right-[20px] top-[20px]"
        >
          <div className="flex h-full flex-col p-[48px] pb-[64px]">
            <Heading heading={modalData[modalTypeShown].title} />
            <p className="mt-6 text-[#272B32]">{modalData[modalTypeShown].message}</p>
            <div className="mt-[48px] flex w-full justify-center gap-3">
              <div className="w-[140px]">
                <Button
                  size="medium"
                  className="w-full"
                  onClick={handleCloseModal}
                  variant="secondary"
                  label={modalData[modalTypeShown].cancelLabel}
                />
              </div>
              <div className="w-[140px]">
                <Button
                  size="medium"
                  className="w-full"
                  onClick={modalData[modalTypeShown].onOk}
                  variant="primary"
                  label={modalData[modalTypeShown].okLabel}
                  iconRight
                  icon={isLoading && <OvalLoader className={'max-w-5 max-h-5'} />}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
