import React, { useCallback, useState } from 'react';
import { Button, Heading } from '@ncent-holdings/ux-components';
import { v4 as uuidv4 } from 'uuid';

import {
  // "Gen 2" imports
  signIn,
  signUp,
  confirmSignUp,
  fetchAuthSession,
  confirmSignIn,
  signOut,
  getCurrentUser,
} from 'aws-amplify/auth';

import QRCode from 'qrcode';

import { Exception } from '../../lib/X';
import getErrorMessage from '../../utils/getErrorMessage';
import useSession from '../../api-hooks/session/useSession';

import LoginForm from '../../components/Login/LoginForm';
import LoginHeading from '../../components/Login/Heading';
import SignupForm from '../../components/Signup/SignupForm';

import * as brandActions from '../../actions/brand';

/* Sign-in Steps for TOTP (unchanged) */
const STEP_DONE = 'DONE';
const STEP_MFA_SELECTION = 'CONTINUE_SIGN_IN_WITH_MFA_SELECTION';
const STEP_TOTP_SETUP = 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP';
const STEP_TOTP_CODE = 'CONFIRM_SIGN_IN_WITH_TOTP_CODE';

/* Additional Sign-Up Steps we might see */
const STEP_CONFIRM_SIGN_UP = 'CONFIRM_SIGN_UP';
// 'DONE' might also appear if the user pool is set to auto-confirm or auto-verify

/* Views in our single-component approach */
enum VIEWS {
  TOP,
  LOGIN,
  MFA_SETUP, // TOTP enrollment
  MFA_CODE, // TOTP code
  SIGNUP, // user sign-up flow
  SIGNUP_CONFIRM, // user must confirm sign-up
  SUCCEED,
  SIGNUP_SUCCEED,
  FAILURE,
}

const INITIAL_STATE = {
  email: '',
  view: VIEWS.TOP,
  error: '',
};

export const Login: React.FC = () => {
  const [email, setEmail] = useState(INITIAL_STATE.email);
  const [error, setError] = useState(INITIAL_STATE.error);
  const [view, setView] = useState(INITIAL_STATE.view);

  // TOTP data (unchanged)
  const [totpSecret, setTotpSecret] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [mfaCode, setMfaCode] = useState('');

  // For custom backend auth after Cognito
  const [, sessionAPI] = useSession();

  // For storing the email used in sign-up (for confirmSignUp)
  const [signupEmail, setSignupEmail] = useState('');
  // We'll store a code typed by the user in confirmSignUp
  const [signupCode, setSignupCode] = useState('');

  const [brandName, setBrandName] = useState('');
  const [domainName, setDomainName] = useState('');
  const [cognitoUserId, setCognitoUserId] = useState('');
  const [userName, setUserName] = useState('');

  // -----------
  // loginToCloud
  // -----------
  const loginToCloud = useCallback(
    async (cognitoJwt: string) => {
      try {
        setView(VIEWS.SUCCEED);
        await sessionAPI.loginWithCloudJwt(cognitoJwt);
      } catch (error: any) {
        console.log('Login to custom system failed', error);
        setView(VIEWS.FAILURE);

        if (error instanceof Exception) {
          setError(error.code);
        } else {
          setError(error.message);
        }
      }
    },
    [sessionAPI],
  );

  // -----------
  // SIGN IN FLOW
  // -----------
  const handleSignIn = async ({ email, password }: { email: string; password: string }) => {
    setEmail(email);
    setError('');

    try {
      // first, if a user is already logged in, log them out:
      try {
        const { username } = await getCurrentUser();
        console.log(`Logging out user ${username} prior to signin`);
        await signOut();
      } catch (e) {
        console.log('No user currently logged in');
      }

      const output = await signIn({ username: email, password });
      const step = output?.nextStep?.signInStep || STEP_DONE;
      console.log('SignIn => signInStep:', step, ' output:', output);

      if (step === STEP_DONE) {
        // fully signed in
        const session = await fetchAuthSession();
        const jwt = session.tokens?.idToken?.toString() || '';
        loginToCloud(jwt);
      } else if (step === STEP_MFA_SELECTION) {
        await pickTOTP();
      } else if (step === STEP_TOTP_SETUP) {
        await startTOTPSetup(output);
      } else if (step === STEP_TOTP_CODE) {
        setView(VIEWS.MFA_CODE);
      } else {
        console.log('Unhandled step =>', step);
        setView(VIEWS.FAILURE);
      }
    } catch (err: any) {
      console.error('SignIn error =>', err);
      setError(err.message || 'Sign in failed');
      setView(VIEWS.FAILURE);
    }
  };

  // TOTP selection
  const pickTOTP = async () => {
    try {
      const output = await confirmSignIn({ challengeResponse: 'TOTP' });
      const step = output?.nextStep?.signInStep || STEP_DONE;
      if (step === STEP_DONE) {
        const session = await fetchAuthSession();
        const jwt = session.tokens?.idToken?.toString() || '';
        loginToCloud(jwt);
      } else if (step === STEP_TOTP_SETUP) {
        await startTOTPSetup(output);
      } else if (step === STEP_TOTP_CODE) {
        setView(VIEWS.MFA_CODE);
      } else {
        console.log('Unhandled step after pickTOTP =>', step);
        setView(VIEWS.FAILURE);
      }
    } catch (err: any) {
      console.error('pickTOTP error =>', err);
      setError(err.message || 'MFA selection failed');
      setView(VIEWS.FAILURE);
    }
  };

  // TOTP Setup
  const startTOTPSetup = async (signInOutput: any) => {
    const secret = signInOutput?.nextStep?.totpSetupDetails?.sharedSecret || '';
    setTotpSecret(secret);

    const otpauthUrl = `otpauth://totp/nCent:${email}?secret=${secret}&issuer=nCent Brand Portal`;

    try {
      const dataUrl = await QRCode.toDataURL(otpauthUrl);
      setQrCodeDataUrl(dataUrl);
    } catch (qrErr: any) {
      console.error('QR code generation failed =>', qrErr);
      setQrCodeDataUrl('');
    }
    setView(VIEWS.MFA_SETUP);
  };

  const handleConfirmTOTPSetup = async () => {
    try {
      const output = await confirmSignIn({ challengeResponse: totpCode });
      const step = output?.nextStep?.signInStep || STEP_DONE;
      if (step === STEP_TOTP_CODE) {
        setView(VIEWS.MFA_CODE);
      } else if (step === STEP_DONE) {
        const session = await fetchAuthSession();
        const jwt = session.tokens?.idToken?.toString() || '';
        loginToCloud(jwt);
      } else if (step === STEP_MFA_SELECTION) {
        await pickTOTP();
      } else {
        console.log('Unhandled step =>', step);
        setView(VIEWS.FAILURE);
      }
    } catch (err: any) {
      console.error('Confirm TOTP setup error =>', err);
      setError(err.message || 'Invalid TOTP code');
      setView(VIEWS.FAILURE);
    }
  };

  const handleConfirmMfaCode = async () => {
    try {
      const output = await confirmSignIn({ challengeResponse: mfaCode });
      const step = output?.nextStep?.signInStep || STEP_DONE;
      if (step === STEP_DONE) {
        console.log('In Login/handleConfirmMfaCode, about to login to cloud...');
        const session = await fetchAuthSession();
        const jwt = session.tokens?.idToken?.toString() || '';
        loginToCloud(jwt);
      } else {
        console.log('Unhandled step after TOTP code =>', step);
        setView(VIEWS.FAILURE);
      }
    } catch (err: any) {
      console.error('handleConfirmMfaCode error =>', err);
      setError(err.message || 'Invalid TOTP code');
      setView(VIEWS.FAILURE);
    }
  };

  // -----------
  // SIGN UP FLOW
  // -----------
  const goToSignup = () => {
    setError('');
    setView(VIEWS.SIGNUP);
  };

  const handleSignup = async (data: {
    email: string;
    password: string;
    name: string;
    title: string;
    companyName: string;
    domain: string;
  }) => {
    setError('');
    try {
      const { email, password, name, title, companyName, domain } = data;

      // Sign up with "Gen 2" style => using "options.userAttributes"
      const { isSignUpComplete, nextStep, userId } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email, // standard attribute
            name, // standard attribute if your user pool has "name"
            'custom:title': title, // custom attribute
            'custom:companyName': companyName, // custom attribute
          },
        },
      });

      console.log('SignUp => userId:', userId, ' isSignUpComplete:', isSignUpComplete, ' nextStep:', nextStep);

      setBrandName(companyName);
      setDomainName(domain);
      setCognitoUserId(userId || uuidv4());
      setUserName(name);

      if (nextStep?.signUpStep === STEP_CONFIRM_SIGN_UP) {
        // The user pool wants us to confirm sign-up (email code, SMS code, etc.)
        setSignupEmail(email);
        setView(VIEWS.SIGNUP_CONFIRM);
      } else if (nextStep?.signUpStep === STEP_DONE || isSignUpComplete) {
        // If the pool automatically confirms them, sign-up is done
        setView(VIEWS.SIGNUP_SUCCEED);
      } else {
        // Default fallback
        console.log('Unhandled signUp step =>', nextStep?.signUpStep);
        setView(VIEWS.SIGNUP_SUCCEED);
      }
    } catch (err: any) {
      console.error('SignUp error =>', err);
      setError(err.message || 'Sign up failed');
      setView(VIEWS.FAILURE);
    }
  };

  const handleConfirmSignup = async () => {
    setError('');
    try {
      // `confirmationCode` is the 6-digit code from user’s email or SMS
      // We pass `username` as the email we stored from sign-up
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: signupEmail,
        confirmationCode: signupCode,
      });

      console.log('ConfirmSignUp => isSignUpComplete:', isSignUpComplete, ' nextStep:', nextStep);

      if (isSignUpComplete || nextStep?.signUpStep === STEP_DONE) {
        // The user is now confirmed => success
        // now we can create the brand and the user in NVA
        console.log(`Creating brand: ${brandName} with domain ${domainName}`);

        const brandId = await brandActions.create(brandName, domainName);

        console.log(`Created brand ID ${brandId}`);

        const { manipulatorId, accessToken } = await brandActions.createUser(cognitoUserId, userName, brandId);

        console.log(`Created local user with manipulatorId ${manipulatorId} and accessToken ${accessToken}`);

        await brandActions.updateAccessTokenInCognito(signupEmail, accessToken);

        // finally, move on to the success screen
        setView(VIEWS.SIGNUP_SUCCEED);
      } else {
        console.log('Unhandled confirmSignUp step =>', nextStep?.signUpStep);
        setView(VIEWS.FAILURE);
      }
    } catch (err: any) {
      console.error('ConfirmSignUp error =>', err);
      setError(err.message || 'Confirm sign-up failed');
      setView(VIEWS.FAILURE);
    }
  };

  // -----------
  // Rendering
  // -----------
  const goToLogin = () => {
    setError('');
    setView(VIEWS.LOGIN);
  };

  const renderLoginTop = () => (
    <div className="items-left flex flex-col">
      <Heading heading="Sign in" subheading="Please sign in or create a new account" size="h1" />
      <Button variant="primary" className="mt-10" label="Sign in" onClick={goToLogin} />
      <Button variant="primary" className="mt-10" label="Create a new account" onClick={goToSignup} />
    </div>
  );

  const renderLoginForm = () => (
    <div className="flex flex-col max-sm:gap-4 max-sm:px-4 sm:gap-9 md:w-[458px]">
      <Heading heading="Sign in" subheading="Welcome to nCent" size="h1" />
      <LoginForm onSubmit={handleSignIn} />
    </div>
  );

  // --- TOTP MFA Setup
  const renderMfaSetup = () => (
    <div className="ml-[40px] mr-[10px] flex flex-col items-center">
      <Heading
        heading="One-Time Password Setup"
        subheading="Please open your authenticator app (Google Authenticator, Microsoft Authenticator, 1Password, etc), and then scan the QR code below to set up your one-time password service with nCent."
        size="h2"
      />

      {totpSecret && false && (
        <div style={{ margin: '10px 0' }}>
          <strong>Secret Key:</strong> {totpSecret}
        </div>
      )}

      {qrCodeDataUrl && <img src={qrCodeDataUrl} alt="TOTP QR Code" style={{ margin: '20px 0' }} />}

      <div>Enter the code from your Authenticator app below, then click the &quot;CONFIRM SETUP&quot; button</div>
      <input
        type="text"
        placeholder=" 6-digit code"
        value={totpCode}
        onChange={(e) => setTotpCode(e.target.value)}
        className="mt-3 border"
      />
      <Button variant="primary" className="mt-4" label="Confirm Setup" onClick={handleConfirmTOTPSetup} />

      <Button variant="outline-primary" className="mt-10" label="Back to Login" onClick={goToLogin} />
    </div>
  );

  // --- TOTP MFA Code
  const renderMfaCodeForm = () => (
    <div className="flex flex-col items-center">
      <Heading heading="Enter One-Time Password" subheading="Open your Authenticator app" size="h2" />
      <input
        type="text"
        placeholder="6-digit code"
        value={mfaCode}
        onChange={(e) => setMfaCode(e.target.value)}
        className="mt-3 border"
      />
      <Button variant="primary" className="mt-4" label="Confirm Code" onClick={handleConfirmMfaCode} />
      <Button variant="outline-primary" className="mt-4" label="Back to sign in" onClick={goToLogin} />
    </div>
  );

  // --- SIGNUP
  const renderSignupForm = () => <SignupForm onSubmit={handleSignup} />;

  // --- SIGNUP CONFIRM CODE
  const renderSignupConfirm = () => (
    <div className="flex flex-col items-center gap-4">
      <Heading heading="Confirm Sign-Up" subheading={`Check ${signupEmail} for a code`} size="h2" />
      <input
        type="text"
        placeholder="Enter code"
        value={signupCode}
        onChange={(e) => setSignupCode(e.target.value)}
        className="mt-3 border"
      />
      <Button variant="primary" label="Confirm" onClick={handleConfirmSignup} />
      <Button variant="outline-primary" label="Back to sign in" onClick={goToLogin} />
    </div>
  );

  // --- SUCCEED
  const renderAuthSucceed = () => (
    <div className="flex flex-col items-center">
      <LoginHeading icon="success" heading="Success" subheading="Taking you to your account" />
    </div>
  );

  // --- SIGNUP_SUCCEED
  const renderSignupSucceed = () => (
    <div className="flex flex-col items-center">
      <LoginHeading
        icon="success"
        heading="Success"
        subheading="Your account has been created.  You can now sign in with your new account"
      />
      <Button variant="outline-primary" className="mt-10" label="Sign In" onClick={goToLogin} />
    </div>
  );

  // --- FAILURE
  const renderAuthFailure = () => (
    <div className="flex flex-col items-center">
      <LoginHeading icon="failure" heading="Failure" subheading={getErrorMessage(error)} />
      <Button variant="outline-primary" className="mt-10" label="Back to sign in" onClick={goToLogin} />
    </div>
  );

  // Decide which view to render
  if (view === VIEWS.MFA_SETUP) {
    return renderMfaSetup();
  }
  if (view === VIEWS.MFA_CODE) {
    return renderMfaCodeForm();
  }
  if (view === VIEWS.SIGNUP) {
    return renderSignupForm();
  }
  if (view === VIEWS.SIGNUP_CONFIRM) {
    return renderSignupConfirm();
  }
  if (view === VIEWS.SIGNUP_SUCCEED) {
    return renderSignupSucceed();
  }
  if (view === VIEWS.SUCCEED) {
    return renderAuthSucceed();
  }
  if (view === VIEWS.FAILURE) {
    return renderAuthFailure();
  }
  if (view === VIEWS.TOP) {
    return renderLoginTop();
  }

  // default => VIEWS.LOGIN
  return renderLoginForm();
};

export default Login;
