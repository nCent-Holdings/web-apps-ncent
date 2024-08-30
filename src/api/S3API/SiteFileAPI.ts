import { cloudAPI } from '../../apiSingleton';
import { cognitoAPI } from '../../apiSingleton';

import BaseAPI from './BaseAPI';

import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { S3Credentials } from '../CloudAPI/models';

class SiteFileAPI extends BaseAPI {
  async _getS3Credentials(): Promise<S3Credentials> {
    // Try to get the user's current cognito session
    const currentSession = await cognitoAPI.session.getCurrentSession();
    // If it was null, we can't proceed
    if (currentSession == null) {
      throw new Error('Error retrieving user session');
    }

    // Otherwise, fetch the idToken JWT for the current session
    const idToken = currentSession.getIdToken().getJwtToken();

    // Try to exchange the users's id token with S3 credentials
    return await cloudAPI.aws.exchangeTokenForS3Credentials(idToken);
  }

  _getS3Client(s3Credentials: S3Credentials): S3Client {
    return new S3Client({
      region: 'us-east-2',
      credentials: {
        expiration: s3Credentials.aws_credentials.expiration,
        accessKeyId: s3Credentials.aws_credentials.access_key_id,
        secretAccessKey: s3Credentials.aws_credentials.secret_access_key,
        sessionToken: s3Credentials.aws_credentials.session_token,
      },
    });
  }

  _getS3FilePath(s3Credentials: S3Credentials, fileName: string): string {
    // Folder from s3Credentials has a trailing slash
    return `${s3Credentials.s3_folder}${fileName}`;
  }

  async uploadFile(file: File): Promise<{ uploadResult: PutObjectCommandOutput; s3FilePath: string }> {
    // Get S3 Credentials
    const s3Credentials = await this._getS3Credentials();

    try {
      // Try to upload the file
      const s3Client = this._getS3Client(s3Credentials);
      const s3FilePath = this._getS3FilePath(s3Credentials, file.name);

      const uploadParams: PutObjectCommandInput = {
        Bucket: s3Credentials.s3_bucket,
        Key: s3FilePath,
        Body: file,
        ContentType: file.type,
      };

      const putCommand = new PutObjectCommand(uploadParams);

      const uploadResult = await s3Client.send(putCommand);

      return { uploadResult, s3FilePath };
    } catch (err) {
      console.error('Error uploading file to S3: ', { err });
      throw err;
    }
  }

  async deleteFile(file: File): Promise<{ deleteResult: DeleteObjectCommandOutput; s3FilePath: string }> {
    const s3Credentials = await this._getS3Credentials();
    const s3Client = this._getS3Client(s3Credentials);

    const filePath = this._getS3FilePath(s3Credentials, file.name);

    try {
      // Try to delete the file
      const bucketParams = { Bucket: s3Credentials.s3_bucket, Key: filePath };

      const deleteCommand = new DeleteObjectCommand(bucketParams);

      const deleteResult = await s3Client.send(deleteCommand);

      return { deleteResult, s3FilePath: filePath };
    } catch (err) {
      console.error('Error deleting file from S3: ', { err });
      throw err;
    }
  }

  // TODO: Multipart upload?
}

export default SiteFileAPI;
