import { AuthenticationException, ValidationException, Exception, VerificationCodeException } from '../../lib/X';

import BaseAPI from './BaseAPI';
import { CognitoUserSession } from 'amazon-cognito-identity-js';

class SessionAPI extends BaseAPI {
  async login(
    email: string,
    password: string,
    onCodeRequested: {
      (error?: any): Promise<{ action: 'confirm' | 'resend'; value: any }>;
    },
  ): Promise<{ jwt: string }> {
    try {
      const onCodeRequestedCallback = (error?: string): Promise<{ action: 'confirm' | 'resend'; value: any }> => {
        if (error === 'invalid') {
          return onCodeRequested(new VerificationCodeException('INVALID'));
        }
        if (error === 'expired') {
          return onCodeRequested(new VerificationCodeException('EXPIRED'));
        }
        if (error) {
          return onCodeRequested(new Exception(error));
        }

        return onCodeRequested();
      };

      return await this.cognitoClient.authenticateUser(email, password, onCodeRequestedCallback);
    } catch (error: any) {
      if (error instanceof Exception) {
        throw error;
      }

      if (error.code === 'InvalidParameterException' && error.message === 'Missing required parameter USERNAME') {
        throw new ValidationException({ email: 'REQUIRED' });
      }

      if (error.code === 'NotAuthorizedException' && error.message === 'Incorrect username or password.') {
        throw new AuthenticationException({});
      }

      if (error.code === 'NotAuthorizedException' && error.message === 'Password attempts exceeded') {
        throw new AuthenticationException({
          password: 'TOO_MANY_ATTEMPTS',
        });
      }

      throw new Exception(error.message);
    }
  }

  async getCurrentSession(): Promise<CognitoUserSession | null> {
    const currentUser = await this.cognitoClient.getCurrentUser();
    return new Promise((resolve, reject) => {
      currentUser?.getSession((err: null | Error, data: null | CognitoUserSession) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}

export default SessionAPI;
