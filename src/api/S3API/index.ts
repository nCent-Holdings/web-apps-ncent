import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import SiteFileAPI from './SiteFileAPI';

export interface S3API {
  s3Client: S3Client;
  siteFile: SiteFileAPI;
}

export const createS3API = (s3ClientConfig: S3ClientConfig) => {
  const s3Client = new S3Client(s3ClientConfig);

  return {
    s3Client,
    siteFile: new SiteFileAPI({ s3Client }),
  };
};

export default createS3API;
