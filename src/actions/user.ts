import { cloudAPI, cognitoAPI, coreAPI } from '../apiSingleton';
import config from '../config';
import { UserModel } from '@src/api-types/models';
import credentialsManager from '@src/credentialsManager';

export async function resetPassword(email: string): Promise<void> {
  const domain = window.location.origin;

  return cognitoAPI.user.resetPassword(email, {
    domain,
    product: config.productId,
  });
}

export async function setPassword(email: string, verificationCode: string, newPassword: string): Promise<void> {
  return cognitoAPI.user.setPassword(email, verificationCode, newPassword);
}

export async function getUser(nouns?: string[]) {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.users.get(nouns, installationId);
}

export const generateInvitationAction = async (
  email: string,
  localGroups: string[],
  templateKey: string,
  sender: string,
  subject: string,
  params: object,
  localState: TObject = {},
  payload: TObject = {},
): Promise<boolean> => {
  let success = true;

  const emailTemplate = {
    bucket: 'templates-wellcube-prod',
    key: `email_templates/${templateKey}`,
    sender,
    subject,
    params,
  };

  const apiPayload = {
    data: {
      email,
      emailTemplate,
      product: 'wellcube',
      localGroups: ['wellcube-users', ...localGroups],
      localState,
      payload,
    },
  };
  console.log(`About to inviteToProduct with apiPayload: ${JSON.stringify(apiPayload)}`);
  try {
    await cloudAPI.users.inviteToProduct(apiPayload);

    // if (response?.data?.error?.code === 'NOT_UNIQUE') {
    //   console.log('Invitation sent to existing user');
    //   success = false;
    // }
  } catch (err) {
    console.log(err);
    success = false;
  }

  return success;
};

export async function renewInvitation(invitationId: string) {
  return cloudAPI.users.renewInvitation(invitationId);
}

export const sendNotificationEmail = async (
  email: string,
  templateKey: string,
  sender: string,
  subject: string,
  params: object,
): Promise<void> => {
  const template = {
    bucket: 'templates-wellcube-prod',
    key: `email_templates/${templateKey}`,
    recipients: [email],
    sender,
    subject,
    params,
  };

  await cloudAPI.aws.sendEmail(template);
};

export async function updateUser(userId: string, newState: TObject): Promise<UserModel> {
  const installationId = credentialsManager.getWellCubeInstallationId();

  return coreAPI.users.updateUser(userId, newState, installationId);
}

export async function toggleNotification(userId: string, toggleId: string): Promise<UserModel> {
  const installationId = credentialsManager.getWellCubeInstallationId();
  return coreAPI.users.toggleNotification(userId, toggleId, installationId);
}

export async function phoneUserValidate(
  userId: string,
  phone: string,
): Promise<{ isValid: boolean; errorMessage?: string }> {
  const installationId = credentialsManager.getWellCubeInstallationId();
  return coreAPI.users.validatePhoneNumber(userId, phone, installationId);
}
