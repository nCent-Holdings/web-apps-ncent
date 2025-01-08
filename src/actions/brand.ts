import { cloudAPI } from '../apiSingleton';
import config from '../config';

export async function create(newBrandName: string, newDomain: string): Promise<string> {
  let brandId = '';

  const apiPayload = {
    brandName: newBrandName,
    domain: newDomain,
  };

  try {
    brandId = await cloudAPI.brands.create(apiPayload);
  } catch (err) {
    console.log(err);
  }

  return brandId;
}

export async function createUser(
  newCognitoUserId: string,
  newName: string,
  newBrandId: string,
): Promise<{ manipulatorId: string; accessToken: string }> {
  const apiPayload = {
    installationId: 'e7b64ddf-72e6-4f55-83ee-bb7f1bb32931',
    manipulatorId: '46900209-0086-478d-933a-16cc2196f68c',
    accessToken: 'a6ef6239-b790-489d-ad73-a206fcb19971',
    cognitoUserId: newCognitoUserId,
    brandId: newBrandId,
    name: newName,
  };

  let data: { manipulatorId: string; accessToken: string } = {
    manipulatorId: '',
    accessToken: '',
  };

  try {
    data = await cloudAPI.brands.createUser(apiPayload);
  } catch (err) {
    console.error(err);
  }

  return {
    manipulatorId: data.manipulatorId,
    accessToken: data.accessToken,
  };
}

export async function updateAccessTokenInCognito(username: string, accessToken: string): Promise<boolean> {
  const apiPayload = {
    userPoolId: config.userPoolId,
    username: username,
    accessToken: accessToken,
  };

  try {
    await cloudAPI.brands.updateAccessToken(apiPayload);
  } catch (err) {
    console.log(err);
  }

  return true;
}

export async function userExists(username: string): Promise<boolean> {
  const apiPayload = {
    userPoolId: config.userPoolId,
    username: username,
  };

  let userExistsData = true;

  try {
    userExistsData = await cloudAPI.brands.userExists(apiPayload);
  } catch (err) {
    console.log(err);
  }

  if (userExistsData === false) return false;
  else return true;
}

export async function brandExists(brandName: string, domain: string): Promise<boolean> {
  const apiPayload = {
    brandName,
    domain,
  };

  let brandExistsData = true;

  try {
    brandExistsData = await cloudAPI.brands.brandExists(apiPayload);
  } catch (err) {
    console.log(err);
  }

  if (brandExistsData === false) return false;
  else return true;
}
