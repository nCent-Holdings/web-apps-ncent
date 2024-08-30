import { S3Client } from '@aws-sdk/client-s3';

class BaseAPI {
  s3Client: S3Client;

  constructor({ s3Client }: { s3Client: S3Client }) {
    this.s3Client = s3Client;
  }
}

export default BaseAPI;
