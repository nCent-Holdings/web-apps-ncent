import CognitoClient from './CognitoClient';

class BaseAPI {
  cognitoClient: CognitoClient;

  constructor({ cognitoClient }: { cognitoClient: CognitoClient }) {
    this.cognitoClient = cognitoClient;
  }
}

export default BaseAPI;
