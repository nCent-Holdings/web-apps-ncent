import React, { useCallback, useRef, useState } from 'react';
import { Button, Heading } from '@ncent-holdings/ux-components';

import { Exception } from '../../lib/X';
import { Deferred } from '../../utils/promiseUtils';
import getErrorMessage from '../../utils/getErrorMessage';

import useSession from '../../api-hooks/session/useSession';

import LoginForm from '../../components/Login/LoginForm';
import AuthCodeForm from '../../components/Login/AuthCodeForm';
import LoginHeading from '../../components/Login/Heading';
import { Navigate } from 'react-router-dom';

enum VIEWS {
  LOGIN,
  CODE,
  SUCCEED,
  FAILURE,
  BUYER,
}

const INITIAL_STATE = {
  email: '',
  view: VIEWS.LOGIN,
  error: '',
};

export const Login: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [email, setEmail] = useState(INITIAL_STATE.email);
  const [error, setError] = useState(INITIAL_STATE.error);
  const [view, setView] = useState(INITIAL_STATE.view);
  const [, sessionAPI] = useSession();

  const requestCodeDeferred = useRef<Deferred<{
    action: 'confirm' | 'resend';
    value: any;
  }> | null>(null);
  const confirmCodeDeferred = useRef<Deferred<void> | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCodeRequested = async (error?: any): Promise<{ action: 'confirm' | 'resend'; value: any }> => {
    confirmCodeDeferred.current?.reject(error);
    requestCodeDeferred.current = new Deferred();

    setView(VIEWS.CODE);

    return requestCodeDeferred.current.promise;
  };

  const loginToCloud = useCallback(async (jwt: string) => {
    try {
      setView(VIEWS.SUCCEED);
      await sessionAPI.loginWithCloudJwt(jwt);
    } catch (error: any) {
      console.log('Login to Installation failed', error);
      setView(VIEWS.FAILURE);

      if (error instanceof Exception) {
        setError(error.code);
      } else {
        setError(error.message);
      }
    }
  }, []);

  const loginToCognito = useCallback(
    async (loginData: { email: string; password: string }) => {
      try {
        setEmail(loginData.email);

        const jwt = await sessionAPI.loginToCognito(loginData.email, loginData.password, handleCodeRequested);

        confirmCodeDeferred.current?.resolve();

        loginToCloud(jwt);
      } catch (error) {
        confirmCodeDeferred.current?.reject(error);
        throw error;
      }

      // const jwt = await sessionAPI.loginToCloud(loginData.email, loginData.password);
      // loginToCloud(jwt);
    },
    [loginToCloud],
  );

  const handleCodeEntered = useCallback(async (code: string) => {
    requestCodeDeferred.current?.resolve({ action: 'confirm', value: code });
    confirmCodeDeferred.current = new Deferred();

    return confirmCodeDeferred.current.promise;
  }, []);

  const backToLogin = () => {
    requestCodeDeferred.current?.reject('ABORTED');
    confirmCodeDeferred.current?.reject('ABORTED');
    setError('');
    setView(VIEWS.LOGIN);
  };

  const goToBuyer = () => {
    setView(VIEWS.BUYER);
  };

  const resendCode = async () => {
    try {
      requestCodeDeferred.current?.resolve({
        action: 'resend',
        value: 'resend',
      });
    } catch (error) {
      console.log('Resend Cognito code failed', error);
    }
  };

  const renderLoginForm = () => (
    <div className="flex flex-col max-sm:gap-4 max-sm:px-4 sm:gap-9 md:w-[458px]">
      <Heading heading="Sign in" subheading="Welcome to nCent" size="h1" />
      <Button
        variant="primary"
        className="mt-10 border-none hover:bg-transparent"
        label="Go to Buyer Experience"
        onClick={goToBuyer}
      />
      <LoginForm onSubmit={loginToCognito} />
    </div>
  );

  const renderAuthCodeForm = () => (
    <div className="flex flex-col items-center">
      <AuthCodeForm email={email} onSubmit={handleCodeEntered} onResendCode={resendCode} />
      <Button
        variant="outline-primary"
        className="mt-10 border-none hover:bg-transparent"
        label={
          <div className="flex flex-row items-center gap-3">
            <img src="icons/back.svg?react" />
            <span className="font-spezia text-sm normal-case text-black-soft">Back to sign in</span>
          </div>
        }
        onClick={backToLogin}
      />
    </div>
  );

  const renderAuthSucceed = () => (
    <div className="flex flex-col items-center">
      <LoginHeading icon="success" heading="Success" subheading="Taking you to your WellCube account" />
    </div>
  );

  const renderAuthFailure = () => (
    <div className="flex flex-col items-center">
      <LoginHeading icon="failure" heading="Failure" subheading={getErrorMessage(error)} />
      <Button
        variant="outline-primary"
        className="mt-10 border-none hover:bg-transparent"
        label={
          <div className="flex flex-row items-center gap-3">
            <img src="icons/back.svg?react" />
            <span className="font-spezia text-sm normal-case text-black-soft">Back to sign in</span>
          </div>
        }
        onClick={backToLogin}
      />
    </div>
  );

  if (view === VIEWS.CODE) {
    return renderAuthCodeForm();
  }

  if (view === VIEWS.SUCCEED) {
    return renderAuthSucceed();
  }

  if (view === VIEWS.FAILURE) {
    return renderAuthFailure();
  }

  if (view === VIEWS.BUYER) {
    return <Navigate to="/buyer" />;
  }

  return renderLoginForm();
};

export default Login;
