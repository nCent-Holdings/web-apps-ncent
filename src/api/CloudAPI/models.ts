export type CLOUD_ROLES = 'ADMIN' | 'USER';

export interface CloudUser {
  id: string;
  email: string;
  firstName: string;
  secondName: string;
  role: CLOUD_ROLES;
}

export interface Installation {
  id: string;
  installationId: string;
  name: string;
  connected: boolean;
  ipAddress: string | null;
  ssid: string | null;
  tags?: Array<string>;

  createdAt: string;
  updatedAt: string;
}

type VALIDATION_STATUSES = 'VALID' | 'INVALID';
export interface LocalAccount {
  id: string;
  cloudUserId: string;
  installationId: string;
  isPrimary: boolean;
  localUserId: string;
  localUserName: string;
  localUserToken: string;
  localUserGroups: Array<{
    id: string;
    name: string;
  }>;
  validationMetadata: {
    localUserId: VALIDATION_STATUSES;
    localUserToken: VALIDATION_STATUSES;
  };

  user: CloudUser;

  createdAt: string;
  updatedAt: string;
}

export interface S3CredentialsResponse {
  statusCode: number;
  body: S3Credentials;
}

export interface S3Credentials {
  aws_credentials: {
    access_key_id: string;
    secret_access_key: string;
    session_token: string;
    expiration: Date;
  };
  s3_bucket: string;
  s3_folder: string;
}

export interface Product {
  id: string;
  name: string;

  createdAt: string;
  updatedAt: string;
}

export interface ApiKeyRequest {
  api_key?: string;
  user_id?: string;
  plan_id?: string;
  site_id?: string;
  org_id?: string;
  note?: string;
  new_note?: string;
  new_plan_id?: string;
}

export interface ApiKeyResponse {
  api_key: string;
  api_key_details?: any;
  success?: boolean;
}

export interface EmailTemplate {
  bucket: string;
  key: string;
  recipients: string[];
  sender: string;
  subject: string;
  params: object;
}
