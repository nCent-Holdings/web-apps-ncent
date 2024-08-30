import { Button, Field, Heading, Input } from '@ncent-holdings/ux-components';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import * as userActions from '../../actions/user';
import Validator from '../../lib/Validator';
import { ValidationException } from '../../lib/X';

import getErrorMessage from '../../utils/getErrorMessage';

const validator = new Validator<{ email: string }>({
  email: ['required', 'email'],
});

enum VIEWS {
  FORGOT_PASSWORD,
  PASSWORD_RECOVERY,
}

export const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [view, setView] = useState(VIEWS.FORGOT_PASSWORD);

  const updateEmail = (evt: React.SyntheticEvent) => {
    const { value: newValue } = evt.target as HTMLInputElement;

    setEmail(newValue);
    setError('');
  };

  const resendEmail = async () => {
    try {
      await userActions.resetPassword(email);
    } catch (error: any) {
      console.log('Resend code failed', error);
    }
  };

  const submitForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validFields = validator.validate({ email });

      await userActions.resetPassword(validFields.email);

      setView(VIEWS.PASSWORD_RECOVERY);
    } catch (error: any) {
      console.log('Reset password failed', error);

      if (error instanceof ValidationException) {
        setError(error.reason.email);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderForgotPasswordView = () => (
    <>
      <Heading size="h1" heading="Forgot your password?" subheading="We'll email you instructions to reset it" />
      <form onSubmit={submitForm} className="mt-9 flex flex-col" noValidate>
        <Field
          label="Email"
          htmlFor="email"
          errorMsg={error && getErrorMessage(error, 'email')}
          labelClass="text-grey-700"
        >
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            inputSize="large"
            value={email}
            onChange={updateEmail}
            disabled={loading}
          />
        </Field>
        <div className="my-8 w-max">
          <Button
            label={<span className="w-[180px]">{'RESET PASSWORD'}</span>}
            type="submit"
            variant="primary"
            size="large"
            disabled={loading}
          />
        </div>
      </form>
    </>
  );

  const renderRecoveryPasswordView = () => (
    <>
      <Heading heading="Password recovery" size="h1" />
      <p className="font-spezia text-bdy text-black-soft">
        {`If there's an account associated with the email address `}
        <span className="font-bold">{email}</span>
        {`, you'll receive an email shortly.`}
      </p>
      <p className="font-spezia text-bdy text-black-soft">
        {' '}
        {`If you don't see the email in a few minutes, please check your Spam/Junk folder.`}
      </p>
      <div className="h-[72px] w-full" />
      <span className="my-8 font-spezia text-bdy text-grey-600 ">
        {`Didn't receive the email? `}
        <Button
          className="text-lg inline border-none p-0 font-spezia font-bold normal-case text-blue-brilliant hover:bg-transparent hover:text-blue-brilliant"
          label="Click to resend."
          onClick={resendEmail}
          variant="outline-primary"
        />
      </span>
    </>
  );

  return (
    <div className="flex flex-col max-sm:px-4 sm:w-[458px]">
      {view === VIEWS.FORGOT_PASSWORD && renderForgotPasswordView()}
      {view === VIEWS.PASSWORD_RECOVERY && renderRecoveryPasswordView()}

      <Link to="/login" className="flex flex-row items-center gap-3">
        <img src="icons/back.svg?react" />
        <span className="font-spezia text-sm text-black-soft">Back to sign in</span>
      </Link>
    </div>
  );
};

export default ForgotPassword;
