interface Config {
  cloudBackendHttpUrl: string;
  internetUgwWsUrl: string;
  productId: string;
  appName: string;

  // Cognito data
  userPoolId: string;
  clientId: string;

  // S3 Config
  awsS3Region: string;

  // Demo Data
  demoUserJwt: string;
}

const config: Config = {
  cloudBackendHttpUrl: 'https://cloud.dev.ncent-path.com/api/v1',
  internetUgwWsUrl: 'wss://user-gateway.dev.ncent-path.com',
  productId: 'path',
  appName: 'ncent',

  // Cognito data
  userPoolId: 'us-east-2_OEUcpqpQQ',
  clientId: '52ogd2jsni4lvfe1drtf45qhek',

  // S3 Config
  awsS3Region: 'us-east-2',

  // DEMO DATA
  demoUserJwt: '',
};

export default config;
