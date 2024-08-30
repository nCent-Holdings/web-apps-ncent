export default function getErrorMessage(errorCode: string, value = '') {
  const codeToMessage: Record<string, string> = {
    REQUIRED: `The ${value} is required`,
    WRONG_EMAIL: 'The entered email is not correct',
    INVALID: `The ${value} is not valid`,
    FIELDS_NOT_EQUAL: `Passwords do not match`,
    TOO_SHORT: `The ${value} is too short`,
    AUTHENTICATION_FAILED: 'Incorrect email or password',
    TOO_MANY_ATTEMPTS: `Too many ${value} attempts. Try again later`,
    VERIFICATION_CODE_EXPIRED: 'Invalid code provided, please request a code again',

    // Login To Core error messages - Start
    NO_INSTALLATIONS: 'Not available installations for this account',
    NO_LOCAL_ACCOUNTS: 'No available local accounts for this account',
    INVALID_TOKEN: 'No available local accounts for this account',
    CONNECT_TIMEOUT: 'Server is not reachable at the moment. Try again later',
    INSTALLATION_NOT_CONNECTED: 'Server is not reachable at the moment. Try again later',
    SERVICE_UNAVAILABLE: 'Server is not reachable at the moment. Try again later',
    // Login To Core error messages - End
  };

  return codeToMessage[errorCode] || 'Some error occurred';
}
