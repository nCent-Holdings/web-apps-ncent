import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as emailActions from '../../../../actions/email';
import * as sessionActions from '../../../../actions/session';
import * as userActions from '../../../../actions/user';
import dayjs from 'dayjs';
import { Heading, Button, Modal, Input, Field } from '@ncent-holdings/ux-components';

import Container from '../../../../components/Layout/Container/Container';
import Tabs, { TabData } from '../../../../components/Tabs';
import AccountDetails from './AccountDetails';
import * as orgActions from '../../../../actions/organizations';
import * as listActions from '../../../../actions/lists';

const CREATED_ON_FORMAT = 'MM/DD/YYYY';

import ScrollVisibleElement from '../../../../components/ScrollVisibleElement/ScrollVisibleElement';
import ErrorPage from '../../../ErrorPage';
import DeleteOrganization from '../delete/DeleteOrganization';
import Sites from '../../../../components/OrganizationProfile/Sites';
import HeadQuarters from '../../../../components/OrganizationProfile/HeadQuarters';
import { twMerge } from 'tailwind-merge';
import EditSection, { type EditSectionItem } from '@src/components/EditSection';
import { useOrganizationFromHandle } from '@src/features/useOrganizationFromHandle';
import { arrayToObject, toNameCase } from '@src/utils';

export const OrganizationProfile: React.FC = () => {
  const { organization, orgHandle, isLoading: loadingOrg } = useOrganizationFromHandle();

  const [industryList, setIndustryList] = useState<string[]>([]);

  useEffect(() => {
    loadIndustryList();
  }, []);

  const loadIndustryList = async () => {
    const newList = await listActions.getSortedIndustryList(true);

    setIndustryList(newList);
  };

  const navigate = useNavigate();
  const orgLink = `/${orgHandle}`;

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [disableSendInvite, setDisableSendInvite] = useState(true);

  const organizationData = organization?.['wellcube/organization'];

  const intSecs = parseInt(organizationData?.created_at || '0');
  const crDate = new Date(0).setUTCSeconds(intSecs);
  const formattedCrDate = organizationData?.created_at ? dayjs(crDate).format(CREATED_ON_FORMAT) : '';

  const authUser = sessionActions.getAuthorizedUserData();

  const inviter = authUser ? `${authUser.firstName} ${authUser.secondName}` : 'WellCube';

  const handleConfirmEmail = async (email: string) => {
    const { isValid, errorText } = await emailActions.validateEmail(email);
    if (!isValid) {
      setEmailError(errorText ?? 'Email address error!');
    } else {
      setEmailError('');
    }

    setDisableSendInvite(!isValid);

    return isValid;
  };

  const handleConfirmDomain = async (domain: string): Promise<{ isValid: boolean; errorMessage?: string }> => {
    const { isValid, errorText } = await orgActions.validateOrgHandle(domain?.toLowerCase(), organization?.id);

    if (domain === orgHandle) return { isValid: true };

    return { isValid, errorMessage: errorText || 'Organization handle error!' };
  };

  const inviteOrgAdmin = async () => {
    console.log(`Organization Profile: Inviting new Org Admin for ${orgHandle}`);
    setShowInviteModal(false);

    if (!organization) {
      return;
    }

    const encodedRecipient = encodeURIComponent(inviteEmail);

    // create action
    const inviteResp = await userActions.generateInvitationAction(
      inviteEmail,
      [`org-admin_${organization.id}`], // localGroups
      'invite_org_admin.json', // email template file
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
        sites: {
          [organization.id]: 'wellcube-organization',
        },
      }, // local state - to be set on user's NVA object
    );

    if (inviteResp) {
      setShowSuccessModal(true);
    } else {
      setShowFailModal(true);
    }

    return true;
  };

  const openInvitation = async () => {
    setShowSuccessModal(false);
    setShowFailModal(false);
    setShowInviteModal(true);

    return true;
  };

  const closeInvitation = async () => {
    setShowInviteModal(false);

    return true;
  };

  // const openSuccess = async () => {
  //   setShowInviteModal(false);
  //   setShowSuccessModal(true);

  //   return true;
  // };

  const closeSuccess = async () => {
    setShowSuccessModal(false);

    return true;
  };

  const closeFail = async () => {
    setShowFailModal(false);

    return true;
  };

  const openDelete = async () => {
    setShowDeleteModal(true);

    return true;
  };

  const handleDelete = () => {
    navigate('../');
  };

  const closeDelete = async () => {
    setShowDeleteModal(false);

    return true;
  };

  const updateInviteEmail = (evt: React.SyntheticEvent) => {
    const { value: newValue } = evt.target as HTMLInputElement;

    setInviteEmail(newValue);

    handleConfirmEmail(newValue);
  };

  const inviteSubheadingText = `An email will be sent so the recipient can create an account in ${orgHandle}.`;

  const orgDetailsData: EditSectionItem[] = useMemo(() => {
    return [
      {
        key: 'name',
        title: 'Organization name',
        value: organization?.name || '',
      },
      {
        key: 'handle',
        title: 'Unique Domain',
        value: orgHandle || '',
        startAdornment: `${window.location.host}/`,
        validate: handleConfirmDomain,
      },
      {
        key: 'industry',
        title: 'Industry',
        value: organizationData?.industry || '',
        type: 'dropdown',
        options: industryList,
      },
    ];
  }, [organization?.name, orgHandle, organizationData?.industry, industryList]);

  const handleOnEdit = useCallback(
    async (editedItems: { key: string; value: string }[]) => {
      if (!organization) {
        return;
      }

      const updatedOrgData = arrayToObject(editedItems);

      await orgActions.updateOrg(organization.id, updatedOrgData);

      if (updatedOrgData.handle) {
        navigate(`/organizations/${updatedOrgData.handle}`);
      }
    },
    [organization],
  );

  const handleOnEditWellcubeContact = useCallback(
    async (editedItems: { key: string; value: string }[]) => {
      if (organization) {
        await orgActions.updateSalesManager(organization.id, arrayToObject(editedItems));
      }
    },
    [organization],
  );

  const tabs: TabData[] = [
    {
      label: 'HEADQUARTERS',
      content: <HeadQuarters data={organizationData} onEdit={handleOnEdit} />,
    },
    {
      label: 'WELLCUBE CONTACT',
      content: <AccountDetails data={organizationData} onEdit={handleOnEditWellcubeContact} />,
    },
    {
      label: 'SITES',
      content: <Sites orgId={organization?.id} admin />,
    },
  ];

  if (loadingOrg) {
    return <>...</>;
  } else if (!organization) {
    return <ErrorPage />;
  }

  return (
    <>
      <div className="flex min-w-[700px]">
        <ScrollVisibleElement scrollTitle="Organization profile">
          <Heading heading="Organization profile" />
          <div className="mt-3 text-bdy font-semibold tracking-[-0.03125rem] text-blue-suede">
            Created on: {formattedCrDate}
          </div>
        </ScrollVisibleElement>

        <div className="ml-auto flex gap-4 pt-2">
          <Button variant="inverse" label="Invite An Organization Admin" size="small" onClick={openInvitation} />
          <NavLink to={orgLink}>
            <Button variant="inverse" label="Access Client View" size="small" />
          </NavLink>

          <div className="ml-auto flex gap-3">
            <Button
              size="small"
              variant="inverse"
              label={<i className="icon icon-16 wcicon-trash -mx-1" />}
              onClick={openDelete}
            />
          </div>
          <Modal onClose={closeInvitation} open={showInviteModal} maxWidth="md">
            <div className="mb-8">
              <Heading heading="Invite a user to this organization's team" />
              <div className="pt-1 text-base font-[400] text-blue-suede">{inviteSubheadingText}</div>
            </div>
            <Field htmlFor="inviteEmail" label="Email" errorMsg={emailError}>
              <form noValidate>
                <Input
                  id="inviteEmail"
                  inputSize="large"
                  name="inviteEmail"
                  onChange={updateInviteEmail}
                  placeholder="Enter new user email"
                  required
                  type="text"
                />
              </form>
            </Field>

            <Field fieldClass="pt-8 pr-5 pb-2" htmlFor="inviteRole" label="Assigned role">
              <Input
                id="inviteRole"
                inputSize="large"
                name="inviteRole"
                onChange={() => null}
                value="Organization admin"
                readOnly={true}
                required
                type="text"
                tooltip={
                  <div>
                    To learn more about different roles, read this{' '}
                    <a href="https://www.hubspot.com" rel="noreferrer" target="_blank">
                      help desk article
                    </a>
                    .
                  </div>
                }
              />
            </Field>

            <div className="mt-1 italic text-blue-suede">
              Role selected will determine user permissions in WellCube.
            </div>

            <div className="flex gap-8 pt-12">
              <Button variant="inverse" label="CANCEL" size="large" onClick={closeInvitation} />

              <Button
                variant="primary"
                label="SEND INVITATION"
                size="large"
                onClick={inviteOrgAdmin}
                disabled={disableSendInvite}
              />
            </div>
          </Modal>
          <Modal onClose={closeSuccess} open={showSuccessModal} maxWidth="md">
            <Heading heading="Success" />
            <div className="text-h4">Your invitation has been sent.</div>

            <div className="flex gap-8 pt-12">
              <Button variant="inverse" label="GO TO ORGANIZATION LIST" size="medium" onClick={closeSuccess} />

              <Button label="INVITE MORE TEAM MEMBERS" size="medium" onClick={openInvitation} />
            </div>
          </Modal>
          <Modal onClose={closeFail} open={showFailModal} maxWidth="md">
            <Heading heading="Fail" />
            <div className="text-h4">Your invitation was not successful.</div>
            <div className="h-[20px] text-h4"> </div>
            <div className="text-base">
              Please check to make sure the user does not already have a WellCube account.
            </div>
            <div className="flex gap-8 pt-12">
              <Button variant="inverse" label="GO TO ORGANIZATION LIST" size="medium" onClick={closeFail} />

              <Button label="INVITE MORE TEAM MEMBERS" size="medium" onClick={openInvitation} />
            </div>
          </Modal>
        </div>
      </div>
      <EditSection data={orgDetailsData} onEdit={handleOnEdit} />
      <Container className={twMerge('relative isolate mt-8 border-t border-t-[#D4DFEA] pt-8')}>
        <div className="relative [&_.com-tabs-panel]:relative [&_.com-tabs-panel]:z-[1] [&_.com-tabs-tabs]:relative [&_.com-tabs-tabs]:z-[2]">
          <Tabs tabs={tabs} />
        </div>
      </Container>

      <DeleteOrganization
        isOpen={showDeleteModal}
        org={{
          id: organization.id,
          orgName: organization.name,
        }}
        onDelete={handleDelete}
        onClose={closeDelete}
      />
    </>
  );
};

export default OrganizationProfile;
