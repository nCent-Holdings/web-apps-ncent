import {
  Button,
  Dropdown,
  Field,
  Heading,
  Input,
  Modal,
  OvalLoader,
  Radio,
  RadioGroup,
} from '@ncent-holdings/ux-components';
import React, { useEffect, useState } from 'react';
import * as emailActions from '@src/actions/email';
import * as userActions from '@src/actions/user';
import * as systemActions from '@src/actions/system';
import * as siteActions from '@src/actions/sites';
import * as organizationActions from '@src/actions/organizations';
import * as sessionActions from '@src/actions/session';
import useSession from '@src/api-hooks/session/useSession';
import { useSites } from '@src/api-hooks/sites/sitesApi';
import { type UserModel } from '@src/api-types/models';
import { type DefaultEditData, type Option } from './types';
import { useOrganizationFromHandle } from '@src/features/useOrganizationFromHandle';
import { toNameCase } from '@src/utils/stringUtils';

type InviteModalProps = {
  organizationId: string;
  onSuccess: () => void;
  onFailure: () => void;
  onCancel: () => void;
  isEditMode?: boolean;
  defaultData?: DefaultEditData;
};

export type Permission = 'org-admin' | 'site-admin' | 'site-external';

function isOfTypePermission(string: string): string is Permission {
  return ['org-admin', 'site-admin', 'site-external'].includes(string);
}

const InviteModal = ({
  organizationId,
  onSuccess,
  onFailure,
  onCancel,
  isEditMode = false,
  defaultData = { email: '', permission: 'org-admin', siteIds: [] },
}: InviteModalProps) => {
  const [permission, setPermission] = useState<Permission>(defaultData.permission);
  const [emailError, setEmailError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(!!defaultData.email.length);
  const [inviteEmail, setInviteEmail] = useState(defaultData.email);
  const [selectedSites, setSelectedSites] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { sites } = useSites({ organizationId: organizationId }, { skip: !organizationId });

  const [, sessionAPI] = useSession();
  const { isDelosAdmin, isSomeOrgAdmin } = sessionAPI.getUserPermissions();
  const { orgName } = useOrganizationFromHandle();

  const authUser = sessionActions.getAuthorizedUserData();

  useEffect(() => {
    if (defaultData.siteIds.length) {
      setSelectedSites(
        sites
          .filter((site) => defaultData.siteIds.includes(site.id))
          .map((site) => ({
            id: site.id,
            value: site.id,
            label: site.name,
          })),
      );
    }
  }, []);

  const handleConfirmEmail = async (email: string) => {
    const { isValid, errorText } = await emailActions.validateEmail(email);
    if (!isValid) {
      setEmailError(errorText ?? 'Email address error!');
    } else {
      setEmailError('');
    }

    setIsEmailValid(isValid);

    return isValid;
  };

  const updateInviteEmail = (evt: React.SyntheticEvent) => {
    const { value: newValue } = evt.target as HTMLInputElement;

    setInviteEmail(newValue);

    handleConfirmEmail(newValue);
  };

  const handleSelectSite = (values: Option[]) => {
    setSelectedSites(values);
  };

  const handleRadioChange = (value: string) => {
    if (isOfTypePermission(value)) setPermission(value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const existingUser = await systemActions.findUserByEmail(inviteEmail);

    try {
      let response;

      if (existingUser) {
        response = await inviteExistingUser(existingUser);
      } else {
        response = await inviteNewUser();
      }

      if (!response) onFailure();
      else onSuccess();
    } catch (err) {
      onFailure();
    }

    setIsLoading(false);
  };

  const inviteNewUser = async () => {
    const encodedRecipient = encodeURIComponent(inviteEmail);
    const inviter = authUser ? `${authUser.firstName} ${authUser.secondName}` : 'WellCube';

    const localGroups =
      permission === 'org-admin'
        ? [`org-admin_${organizationId}`]
        : selectedSites.map((item: Option) => `${permission}_${item.id}`);

    const nvaSites =
      permission === 'org-admin'
        ? { [organizationId]: 'wellcube-organization' }
        : {
            [organizationId]: 'wellcube-organization',
            ...Object.fromEntries(selectedSites.map((item: Option) => [item.id, 'wellcube-site'])),
          };

    // create action
    const response = await userActions.generateInvitationAction(
      inviteEmail,
      localGroups, // localGroups
      `invite_${permission.replace('-', '_')}.json`, // email template file
      'invitation@wellcube.io', // sender
      'WellCube Invitation', // email subject
      // email template params
      {
        Inviter: toNameCase(inviter),
        recipientEmailAddress: inviteEmail,
        encodedRecipientEmailAddress: encodedRecipient,
        senderEmailAddress: 'invitation@wellcube.io',
      },
      {
        sites: nvaSites,
      }, // local state - to be set on user's NVA object
    );

    return response;
  };

  const inviteExistingUser = async (user: UserModel) => {
    // Initially add user to organization to make it reachable for organization
    await systemActions.addUserToOrganization(user.id, organizationId);

    const selectedSitesIds = selectedSites.map((item: Option) => item.id);

    let response;

    switch (permission) {
      case 'org-admin':
        response = await organizationActions.addAdmin(organizationId, user.id);
        break;
      case 'site-admin':
        response = await siteActions.addAdmin(selectedSitesIds, user.id);
        break;
      case 'site-external':
        response = await siteActions.addExternal(selectedSitesIds, user.id);
        break;
      default:
        throw new Error('Invalid permission');
    }

    const userData = user['wellcube/user'];
    const shouldRenewInvitation = userData?.status !== 'ACTIVE' && userData?.invitation.id;

    if (shouldRenewInvitation) {
      try {
        await userActions.renewInvitation(userData.invitation.id);
      } catch (error) {
        console.error('Error renew invitation for existing user', error);
      }
    } else {
      await userActions.sendNotificationEmail(
        inviteEmail,
        'update_user_access.json',
        'invitation@wellcube.io',
        'WellCube Access Update',
        {
          orgName,
          userName: toNameCase(`${userData?.first_name} ${userData?.second_name}`),
          siteName: `${selectedSites.map((item: Option) => item.label)}`,
          recipientEmailAddress: inviteEmail,
          senderEmailAddress: 'invitation@wellcube.io',
        },
      );
    }

    return response;
  };

  const renderSelectedSites = () => {
    return (
      <div className="mt-8">
        <p className="mb-[10px] italic">Selected sites</p>
        <div className="flex flex-wrap gap-3">
          {selectedSites.map((site) => (
            <div key={site.id} className="flex items-center rounded bg-blue-water px-2 py-1">
              {site.label}
              <i
                className="icon icon-16 wcicon-xmark m-1 cursor-pointer"
                onClick={() => setSelectedSites(selectedSites.filter((item) => item.id !== site.id))}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Modal onClose={onCancel} open={true} modalStyle="w-[770px] max-w-none">
      <Heading heading={isEditMode ? 'Edit a user' : 'Invite a user'} />
      <div className="mt-8 text-base font-[400] text-blue-suede">
        Start by selecting the level of permission for this user
      </div>
      {isEditMode ? (
        <RadioGroup
          name="permission"
          value={permission}
          onChange={handleRadioChange}
          direction="horizontal"
          className="mt-8 border-b border-b-[#d4dfea] pb-8"
        >
          <Radio id="siteOption" value="site-admin" label="Site admin" />
        </RadioGroup>
      ) : (
        <RadioGroup
          name="permission"
          value={permission}
          onChange={handleRadioChange}
          direction="horizontal"
          className="mt-8 border-b border-b-[#d4dfea] pb-8"
        >
          {(isDelosAdmin || isSomeOrgAdmin) && <Radio id="orgOption" value="org-admin" label="Org admin" />}
          <Radio id="siteOption" value="site-admin" label="Site admin" />
          <Radio id="externalOption" value="site-external" label="External collaborator" />
        </RadioGroup>
      )}
      <div className="mt-8 flex gap-8">
        <Field fieldClass="w-[50%]" htmlFor="inviteEmail" label="Email" errorMsg={emailError}>
          <form noValidate>
            <Input
              id="inviteEmail"
              value={inviteEmail}
              disabled={isEditMode}
              inputSize="large"
              name="inviteEmail"
              onChange={updateInviteEmail}
              placeholder="Enter new user email"
              required
              type="text"
            />
          </form>
        </Field>
        {['site-admin', 'site-external'].includes(permission) && (
          <Field fieldClass="w-[50%]" htmlFor="sites" label="Sites">
            <form noValidate>
              <Dropdown
                placeholder="Give access to one or more sites"
                options={sites.map((item) => ({
                  id: item.id,
                  value: item.id,
                  label: item.name,
                }))}
                handleSelection={handleSelectSite}
                size="large"
                isMulti
                value={selectedSites}
                menuLayoutEffect={true}
              />
            </form>
          </Field>
        )}
      </div>

      <>{['site-admin', 'site-external'].includes(permission) && !!selectedSites.length && renderSelectedSites()}</>

      <div className="flex justify-center gap-8 pt-12">
        <Button variant="inverse" label="CANCEL" onClick={onCancel} disabled={isLoading} className="w-[142px]" />

        <Button
          variant="primary"
          label="SAVE"
          onClick={handleSubmit}
          disabled={
            !permission ||
            !isEmailValid ||
            (['site-admin', 'site-external'].includes(permission) && !selectedSites.length) ||
            isLoading
          }
          className="w-[142px]"
          iconRight={true}
          icon={isLoading && <OvalLoader className={'max-w-5 max-h-5'} />}
        />
      </div>
    </Modal>
  );
};

export default InviteModal;
