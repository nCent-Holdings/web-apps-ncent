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
  appName: 'path',

  // Cognito data
  userPoolId: 'us-east-1_alZhAG2N5',
  clientId: '1d8g6iq93b2cfq9v9vjc7ju82c',

  // S3 Config
  awsS3Region: 'us-east-1',

  // DEMO DATA
  demoUserJwt: '',
};

export default config;
