import createAPI from './api';
import requestErrorHandler from './api/handlers/requestErrorHandler';
import credentialsManager from './credentialsManager';
import config from './config';

const api = createAPI({
  cloudBackendHttpUrl: config.cloudBackendHttpUrl,
  internetUgwWsUrl: config.internetUgwWsUrl,
  productId: config.productId,
  appName: config.appName,
  userPoolId: config.userPoolId,
  clientId: config.clientId,
  awsS3Region: config.awsS3Region,
  credentialsManager,
});

export const cloudAPI = api.cloudAPI;
export const coreAPI = api.coreAPI;
export const cognitoAPI = api.cognitoAPI;
export const s3API = api.s3API;

cloudAPI.apiClient.onRequestError(requestErrorHandler);

export default api;
