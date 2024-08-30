import CognitoClient, { CognitoData } from './CognitoClient';

import SessionAPI from './SessionAPI';
import UserAPI from './UserAPI';

export interface CognitoAPI {
  cognitoClient: CognitoClient;
  session: SessionAPI;
  user: UserAPI;
}

export default function createCognitoAPI(cognitoData: CognitoData): CognitoAPI {
  const cognitoClient = new CognitoClient(cognitoData);

  return {
    cognitoClient,
    session: new SessionAPI({ cognitoClient }),
    user: new UserAPI({ cognitoClient }),
  };
}
