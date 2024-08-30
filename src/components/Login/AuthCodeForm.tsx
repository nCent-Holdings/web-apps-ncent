import React, { useRef, useState } from 'react';
import { Button, ButtonProps } from '@ncent-holdings/ux-components';

import { VerificationCodeException, AuthenticationException } from '../../lib/X';

import Heading, { HeadingProps } from './Heading';
import AuthCodeInput, { AuthCodeInputRef } from './AuthCodeInput';

const ERRORS = {
  EXPIRED: 'EXPIRED',
  INVALID: 'INVALID',
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
};

export interface AuthCodeFormProps {
  email: string;
  onSubmit(code: string): Promise<void>;
  onResendCode(): Promise<void>;
}

export const AuthCodeForm: React.FC<AuthCodeFormProps> = ({ email, onSubmit, onResendCode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const authCodeInputRef = useRef<AuthCodeInputRef>();

  const submitForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (authCodeInputRef.current) {
      submitCode(authCodeInputRef.current.getCode());
    }
  };

  const resetForm = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    setError('');
    authCodeInputRef.current?.reset();

    // This timeout is required to wait for AuthCodeInput be rerendered
    // and "disabled" attribute was set to false for inputs
    setTimeout(() => {
      authCodeInputRef.current?.focus();
    }, 100);
  };

  const submitCode = async (code: string) => {
    try {
      setLoading(true);
      await onSubmit(code);
    } catch (error: any) {
      console.log('Submit code failed', error);

      if (error instanceof VerificationCodeException) {
        setError(error.code);
      } else if (error instanceof AuthenticationException) {
        setError(error.code);
      } else {
        setError(ERRORS.INVALID);
      }
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    onResendCode();
  };

  const getHeadingProps = (errorCode: string): HeadingProps => {
    const headingProps: Record<string, HeadingProps> = {
      [ERRORS.INVALID]: {
        icon: 'failure',
        heading: 'Incorrect code',
        subheading: `Enter the authentication code we sent to ${email}`,
      },
      [ERRORS.EXPIRED]: {
        icon: 'expired',
        heading: 'You have entered an expired code.',
        subheading: `Click on Resend Code below to receive a new one.`,
      },
      [ERRORS.AUTHENTICATION_FAILED]: {
        icon: 'failure',
        heading: 'You have exceeded the number of allowed attempts',
        subheading: `Please return to sign-in page and log in again.`,
      },
      '': {
        icon: 'email',
        heading: 'Check your email',
        subheading: `Enter the authentication code we sent to ${email}`,
      },
    };

    return headingProps[errorCode];
  };

  const getButtonProps = (errorCode: string): ButtonProps => {
    const buttonProps: Record<string, ButtonProps> = {
      [ERRORS.INVALID]: {
        label: 'TRY AGAIN',
        type: 'reset',
      },
      [ERRORS.EXPIRED]: {
        label: 'SUBMIT',
        type: 'button',
        disabled: true,
      },
      [ERRORS.AUTHENTICATION_FAILED]: {
        label: 'TRY AGAIN',
        type: 'button',
        disabled: true,
      },
      '': {
        label: 'SUBMIT',
        type: 'submit',
        disabled: loading,
      },
    };

    return buttonProps[errorCode];
  };

  return (
    <form className="flex w-[470px] flex-col items-center max-sm:w-[348px]" onSubmit={submitForm} onReset={resetForm}>
      <Heading {...getHeadingProps(error)} />

      <AuthCodeInput
        disabled={loading || !!error}
        error={error}
        onEntered={submitCode}
        authCodeInputRef={authCodeInputRef}
      />
      <div className="mt-10">
        <Button {...getButtonProps(error)} variant="primary" size="large" />
      </div>
      <span className="font-spezia text-sm text-grey-600 max-sm:mt-8 sm:mt-16">
        {`Didn't receive the email? `}
        <Button
          className="inline border-none p-0 font-spezia font-bold normal-case hover:bg-transparent hover:text-blue-brilliant"
          label="Resend code"
          onClick={resendCode}
          variant="outline-primary"
        />
      </span>
    </form>
  );
};

export default AuthCodeForm;
