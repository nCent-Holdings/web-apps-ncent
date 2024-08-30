import { Exception, ValidationException, SetPasswordException } from '../../lib/X';

import BaseAPI from './BaseAPI';
import { ClientMetadata } from 'amazon-cognito-identity-js';

class UserAPI extends BaseAPI {
  async signUp(actionId: string, email: string, password: string, clientMetadata: ClientMetadata): Promise<any> {
    try {
      return await this.cognitoClient.signUp(actionId, email, password, clientMetadata);
    } catch (error: any) {
      if (error instanceof Exception) {
        throw error;
      }

      throw new Exception(error.message);
    }
  }

  async resetPassword(email: string, clientMetadata: { domain: string; product: string }): Promise<void> {
    try {
      return await this.cognitoClient.resetPassword(email, clientMetadata);
    } catch (error: any) {
      if (error instanceof Exception) {
        throw error;
      }

      if (error.code === 'InvalidParameterException') {
        throw new ValidationException({ email: 'WRONG_EMAIL' });
      }

      throw new Exception(error.message);
    }
  }

  async setPassword(email: string, verificationCode: string, newPassword: string): Promise<void> {
    try {
      return await this.cognitoClient.setPassword(email, verificationCode, newPassword);
    } catch (error: any) {
      if (error instanceof Exception) {
        throw error;
      }
      if (error.code === 'InvalidParameterException') {
        throw new ValidationException({ password: 'INVALID' });
      }
      if (error.code === 'InvalidPasswordException') {
        throw new ValidationException({ password: 'INVALID' });
      }
      if (error.code === 'ExpiredCodeException') {
        throw new SetPasswordException('VERIFICATION_CODE_EXPIRED');
      }
      if (error.code === 'LimitExceededException') {
        throw new SetPasswordException('TOO_MANY_ATTEMPTS');
      }

      throw new Exception(error.message);
    }
  }
}

export default UserAPI;
