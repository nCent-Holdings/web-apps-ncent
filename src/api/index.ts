import { CredentialsManager } from '@ncent-holdings/user-gateway-client';
import createCloudAPI, { CloudAPI } from './CloudAPI';
import createCoreAPI, { CoreAPI } from './CoreAPI';
import createCognitoAPI, { CognitoAPI } from './CognitoAPI';
import createS3API, { S3API } from './S3API';

export interface API {
  cloudAPI: CloudAPI;
  coreAPI: CoreAPI;
  cognitoAPI: CognitoAPI;
  s3API: S3API;
}

interface CreateAPIParams {
  cloudBackendHttpUrl: string;
  internetUgwWsUrl: string;
  productId: string;
  appName: string;
  userPoolId: string;
  clientId: string;
  awsS3Region: string;
  credentialsManager: CredentialsManager;
}

export default function createAPI({
  cloudBackendHttpUrl,
  internetUgwWsUrl,
  productId,
  appName,
  userPoolId,
  clientId,
  awsS3Region,
  credentialsManager,
}: CreateAPIParams): API {
  return {
    cloudAPI: createCloudAPI({ cloudBackendHttpUrl }),
    coreAPI: createCoreAPI({
      internetUgwWsUrl,
      productId,
      appName,
      credentialsManager,
    }),
    cognitoAPI: createCognitoAPI({ userPoolId, clientId }),
    s3API: createS3API({ region: awsS3Region }),
  };
}
