import { Button, Field, Input } from '@ncent-holdings/ux-components';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import * as userActions from '../../actions/user';
import Validator from '../../lib/Validator';
import { Exception, SetPasswordException, ValidationException } from '../../lib/X';

import getErrorMessage from '../../utils/getErrorMessage';

const icons = {
  email: '/icons/login/email.svg?react',
  success: '/icons/login/success.svg?react',
};

enum VIEWS {
  SET_NEW_PASSWORD,
  SUCCESS,
}

const paramsValidator = new Validator<{
  verificationCode: string;
  email: string;
}>({
  verificationCode: ['required'],
  email: ['required'],
});

const validator = new Validator<{ password: string; confirmPassword: string }>({
  password: ['required', { min_length: 8 }],
  confirmPassword: ['required', { equal_to_field: 'password' }],
});

const INITIAL_STATE = {
  newPasswordForm: {
    password: '',
    confirmPassword: '',
  },
  errors: {
    password: '',
    confirmPassword: '',
    global: '',
  },
  view: VIEWS.SET_NEW_PASSWORD,
};

export const SetNewPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [newPasswordForm, setNewPasswordForm] = useState(INITIAL_STATE.newPasswordForm);
  const [errors, setErrors] = useState(INITIAL_STATE.errors);
  const [view, setView] = useState(INITIAL_STATE.view);

  const verificationCode = searchParams.get('code') || '';
  const email = decodeURIComponent(searchParams.get('email') || '');

  const updateNewPasswordForm = (evt: React.SyntheticEvent) => {
    const { name: fieldName, value: newValue } = evt.target as HTMLInputElement;

    setNewPasswordForm({ ...newPasswordForm, [fieldName]: newValue });
    setErrors({ ...errors, [fieldName]: '' });
  };

  useEffect(() => {
    try {
      paramsValidator.validate({ verificationCode, email });
    } catch (error: any) {
      console.log('');
      navigate('/login');
    }
  }, []);

  const submitForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validFields = validator.validate(newPasswordForm);

      await userActions.setPassword(email, verificationCode, validFields.password);

      setView(VIEWS.SUCCESS);
    } catch (error: any) {
      console.log('Reset password failed', error);

      if (error instanceof ValidationException) {
        setErrors({
          ...INITIAL_STATE.errors,
          password: error.reason.password,
          confirmPassword: error.reason.confirmPassword,
        });
      } else if (error instanceof SetPasswordException) {
        setErrors({
          ...INITIAL_STATE.errors,
          global: error.reason,
        });
      } else if (error instanceof Exception) {
        setErrors({
          ...INITIAL_STATE.errors,
          global: error.code,
        });
      } else {
        setErrors({
          ...INITIAL_STATE.errors,
          global: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderSetNewPasswordView = () => (
    <div className="flex flex-col gap-12 max-sm:px-4 max-sm:pb-14 sm:w-[411px]">
      <div className="flex flex-col items-center">
        <img className="self-center max-sm:h-40" src={icons.email} />
        <p className="mt-[38px] self-center font-spezia text-h2 text-grey-900">Set new password</p>
      </div>
      <form onSubmit={submitForm} className="flex flex-col" noValidate>
        <Field
          label="New password"
          htmlFor="password"
          errorMsg={errors.password && getErrorMessage(errors.password, 'password')}
        >
          <Input.Password
            type="text"
            id="password"
            name="password"
            placeholder="Enter a password"
            value={newPasswordForm.password}
            onChange={updateNewPasswordForm}
            disabled={loading}
          />
        </Field>
        <p className="mt-3 font-spezia text-base italic text-blue-suede">
          Must be 8 or more characters and contain at least 1 special and 1 uppercase characters and 1 number.
        </p>
        <Field
          label="Confirm new password"
          labelClass="mt-7"
          htmlFor="confirmPassword"
          errorMsg={errors.confirmPassword && getErrorMessage(errors.confirmPassword, 'password')}
        >
          <Input.Password
            type="text"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Enter a password"
            value={newPasswordForm.confirmPassword}
            onChange={updateNewPasswordForm}
            disabled={loading}
          />
        </Field>
        {errors.global && (
          <div className="mt-3 font-spezia text-base text-alert-error">{getErrorMessage(errors.global)}</div>
        )}
        <div className="mt-12 w-max self-center">
          <Button
            label={<span className="w-full">{'CHANGE PASSWORD'}</span>}
            type="submit"
            variant="primary"
            size="large"
            disabled={loading}
          />
        </div>
      </form>
      <Link to="/login" className="flex flex-row items-center gap-3 self-center">
        <img src="/icons/back.svg?react" />
        <span className="font-spezia text-sm text-black-soft">Back to sign in</span>
      </Link>
    </div>
  );

  const renderSuccessView = () => (
    <div className="flex flex-col max-sm:px-4 max-sm:pb-14 sm:w-[411px]">
      <img className="self-center max-sm:h-40" src={icons.success} />
      <p className="mt-8 self-center font-spezia text-h2 text-grey-900">Password reset</p>
      <p className="mt-3 self-center text-center font-spezia text-bdy text-grey-600 sm:w-[360px]">
        Your password has been successfully reset. Click below to log in.
      </p>

      <div className="mt-[72px] flex w-[160px] flex-col self-center">
        <Button
          label={<span className="w-full">{'LOG IN'}</span>}
          onClick={() => navigate('/login')}
          variant="primary"
          size="large"
        />
      </div>
    </div>
  );

  return (
    <>
      {view === VIEWS.SET_NEW_PASSWORD && renderSetNewPasswordView()}
      {view === VIEWS.SUCCESS && renderSuccessView()}
    </>
  );
};

export default SetNewPassword;
