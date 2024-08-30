import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
  ClientMetadata,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

export interface CognitoData {
  userPoolId: string;
  clientId: string;
}

class CognitoClient {
  private _cognitoUserPool: CognitoUserPool;

  constructor({ userPoolId, clientId }: CognitoData) {
    this._cognitoUserPool = new CognitoUserPool({
      UserPoolId: userPoolId,
      ClientId: clientId,
    });
  }

  authenticateUser(
    username: string,
    password: string,
    onCodeRequestedCallback: (error?: string) => Promise<{ action: 'confirm' | 'resend'; value: any }>,
  ): Promise<{ jwt: string }> {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this._cognitoUserPool,
    });
    cognitoUser.setAuthenticationFlowType('CUSTOM_AUTH');

    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authDetails, {
        onSuccess(data: CognitoUserSession): void {
          const jwt = data.getIdToken().decodePayload().nvaJWT;

          resolve({ jwt });
        },
        onFailure(error) {
          reject(error);
        },
        async customChallenge(challengeParameters) {
          const { action, value } = await onCodeRequestedCallback(challengeParameters.errorCause);

          cognitoUser.sendCustomChallengeAnswer(value, this, { action, value });
        },
      });
    });
  }

  async resetPassword(username: string, clientMetadata: ClientMetadata): Promise<void> {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this._cognitoUserPool,
    });

    return await new Promise((resolve, reject) => {
      cognitoUser.forgotPassword(
        {
          onSuccess(): void {
            resolve();
          },
          onFailure(error) {
            reject(error);
          },
        },
        clientMetadata,
      );
    });
  }

  async setPassword(username: string, verificationCode: string, newPassword: string): Promise<void> {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this._cognitoUserPool,
    });

    return await new Promise((resolve, reject) => {
      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess(): void {
          resolve();
        },
        onFailure(error) {
          reject(error);
        },
      });
    });
  }

  async signUp(actionId: string, email: string, password: string, clientMetadata: ClientMetadata): Promise<any> {
    await new Promise((resolve, reject) => {
      const userAttributes = [new CognitoUserAttribute({ Name: 'email', Value: email })];

      this._cognitoUserPool.signUp(
        email,
        password,
        userAttributes,
        [],
        (error, result) => {
          if (error) {
            console.error('An error occurred creating the user: ', { error });
            reject(error);
          } else {
            console.log('USER CREATED SUCCESSFULLY!: ', { result });
            resolve(result);
          }
        },
        { actionId, ...clientMetadata },
      );
    });
  }

  async getCurrentUser(): Promise<CognitoUser | null> {
    return this._cognitoUserPool.getCurrentUser();
  }
}

export default CognitoClient;
