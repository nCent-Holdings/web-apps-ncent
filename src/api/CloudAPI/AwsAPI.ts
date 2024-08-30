import BaseAPI from './BaseAPI';
import { EmailTemplate, S3Credentials } from './models';

class AwsAPI extends BaseAPI {
  async exchangeTokenForS3Credentials(idToken: string, productName?: string): Promise<S3Credentials> {
    console.log('Attempting to exchange Cognito Token for S3 Credentials...');

    try {
      const exchangeResult = await this.apiClient.post(
        'aws/exchange-token-for-credentials',
        { idToken, productName: productName ?? 'wellcube' },
        false,
      );

      console.log('Exchanged Credentials successfully!');
      console.log('Attempting to parse credential payload...');

      const s3CredentialsResponse = JSON.parse(exchangeResult.Payload);

      return JSON.parse(s3CredentialsResponse.body);
    } catch (err) {
      console.error('Error exchanging credentials: ', { err });

      throw err;
    }
  }

  async sendEmail(template: EmailTemplate): Promise<void> {
    try {
      await this.apiClient.post('aws/send-email', { template }, false);

      console.log('Email successfully sent');
    } catch (err) {
      console.error('Error sending email: ', { err });

      throw err;
    }
  }
}

export default AwsAPI;
