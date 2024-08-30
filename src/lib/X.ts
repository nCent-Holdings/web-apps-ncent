export class Exception extends Error {
  code: string;
  reason?: any;

  constructor(code: string, reason?: any) {
    super(code);

    this.code = code;
    this.reason = reason;
  }
}

export class ValidationException extends Exception {
  constructor(fields: object) {
    super('FORMAT_ERROR', fields);
  }
}

export class AuthenticationException extends Exception {
  reason: { email?: string; password?: string };

  constructor({ email = '', password = '' }: { email?: string; password?: string }) {
    super('AUTHENTICATION_FAILED');

    this.reason = { email, password };
  }
}

export class VerificationCodeException extends Exception {
  declare code: 'INVALID' | 'EXPIRED';
}

export class SetPasswordException extends Exception {
  constructor(reason: string) {
    super('SET_PASSWORD_FAILED', reason);
  }
}
