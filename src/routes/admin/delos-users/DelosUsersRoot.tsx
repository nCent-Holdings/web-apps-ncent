import React, { useState } from 'react';

import * as userActions from '../../../actions/user';
import * as sessionActions from '../../../actions/session';
import * as emailActions from '../../../actions/email';
import { Heading, Modal, Field, Input, Button } from '@ncent-holdings/ux-components';
import ScrollVisibleElement from '../../../components/ScrollVisibleElement/ScrollVisibleElement';
import { toNameCase } from '@src/utils/stringUtils';

export const DelosUsersRoot: React.FC = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [disableSendInvite, setDisableSendInvite] = useState(true);

  const inviteSalesAdmin = async () => {
    setShowInviteModal(false);

    const authUser = sessionActions.getAuthorizedUserData();
    const inviter = authUser ? `${authUser.firstName} ${authUser.secondName}` : 'WellCube';
    const encodedRecipient = encodeURIComponent(inviteEmail);
    console.log(`About to invite user`);
    const inviteResp = await userActions.generateInvitationAction(
      inviteEmail,
      ['technical-sales-manager'], // localGroups
      'invite_sales_manager.json', // email template file
      'invitation@wellcube.io', // sender
      'WellCube Invitation', // email subject
      {
        Inviter: toNameCase(inviter),
        recipientEmailAddress: inviteEmail,
        encodedRecipientEmailAddress: encodedRecipient,
        senderEmailAddress: 'invitation@wellcube.io',
      }, // email template params
    );

    if (inviteResp) {
      setShowSuccessModal(true);
      setShowInviteModal(false);
    } else {
      setShowFailModal(true);
    }

    return true;
  };

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

  const closeSuccess = async () => {
    setShowSuccessModal(false);

    return true;
  };

  const closeFail = async () => {
    setShowFailModal(false);

    return true;
  };

  const updateInviteEmail = (evt: React.SyntheticEvent) => {
    const { value: newValue } = evt.target as HTMLInputElement;

    setInviteEmail(newValue);

    handleConfirmEmail(newValue);
  };

  const renderInviteModal = () => {
    return (
      <div>
        <Modal onClose={closeInvitation} open={showInviteModal}>
          <div className="mb-8">
            <Heading heading="Invite a sales admin user" />
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

          <Field fieldClass="mt-8" htmlFor="inviteRole" label="Assigned role">
            <Input
              id="inviteRole"
              inputSize="large"
              name="inviteRole"
              onChange={() => null}
              value="Technical sales manager"
              disabled={true}
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

          <div className="mt-1 italic text-blue-suede">Role selected will determine user permissions in WellCube.</div>

          <div className="mt-14 flex gap-8">
            <Button variant="inverse" label="CANCEL" size="large" onClick={closeInvitation} />

            <Button
              variant="primary"
              label="SEND INVITATION"
              size="large"
              onClick={inviteSalesAdmin}
              disabled={disableSendInvite}
            />
          </div>
        </Modal>

        <Modal onClose={closeSuccess} open={showSuccessModal}>
          <Heading heading="Success" />
          <div className="text-h4">Your invitation has been sent.</div>

          <div className="flex gap-8 pt-12">
            <Button variant="inverse" label="DONE ADDING USERS" size="medium" onClick={closeSuccess} />

            <Button variant="primary" label="INVITE MORE TEAM MEMBERS" size="medium" onClick={openInvitation} />
          </div>
        </Modal>

        <Modal onClose={closeFail} open={showFailModal} modalStyle="h-[356px] w-[745px]">
          <Heading heading="Fail" />
          <div className="text-h4">Your invitation was not successful.</div>
          <div className="h-[20px] text-h4"> </div>
          <div className="text-base">Please check to make sure the user does not already have a WellCube account.</div>
          <div className="flex gap-8 pt-12">
            <Button variant="inverse" label="GO TO ORGANIZATION LIST" size="medium" onClick={closeFail} />

            <Button variant="primary" label="INVITE MORE TEAM MEMBERS" size="medium" onClick={openInvitation} />
          </div>
        </Modal>

        <Button
          variant="outline-primary"
          label="Invite A Technical Sales Manager"
          size="medium"
          onClick={openInvitation}
        />
      </div>
    );
  };

  return (
    <>
      <ScrollVisibleElement scrollTitle="Delos users">
        <Heading heading="Delos users" />
      </ScrollVisibleElement>
      <div className="h-[3.25rem]" />
      <div className="flex w-full max-w-[46rem] flex-col gap-[0px] p-0">{renderInviteModal()}</div>
    </>
  );
};

export default DelosUsersRoot;
