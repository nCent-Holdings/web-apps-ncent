import React, { useState } from 'react';
import { Button, Input, Field } from '@ncent-holdings/ux-components';
import getErrorMessage from '../../utils/getErrorMessage';
import Validator from '../../lib/Validator';
import { AuthenticationException, Exception, ValidationException } from '../../lib/X';
import { Link } from 'react-router-dom';

export interface LoginFormProps {
  onSubmit(loginData: { email: string; password: string }): Promise<void>;
}

const validator = new Validator<{ email: string; password: string }>({
  email: ['required', 'email'],
  password: ['required'],
});

const INITIAL_STATE = {
  loginForm: {
    email: '',
    password: '',
  },
  errors: {
    email: '',
    password: '',
    global: '',
  },
};

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(INITIAL_STATE.errors);
  const [loginForm, setLoginForm] = useState(INITIAL_STATE.loginForm);

  const updateLoginForm = (evt: React.SyntheticEvent) => {
    const { name: fieldName, value: newValue } = evt.target as HTMLInputElement;

    setLoginForm({ ...loginForm, [fieldName]: newValue });
    setErrors({ ...errors, [fieldName]: '' });
  };

  const submitForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validFields = validator.validate(loginForm);
      await onSubmit(validFields);
    } catch (error: any) {
      console.log('Login failed', error);

      if (error instanceof ValidationException) {
        setErrors({
          email: error.reason.email,
          password: error.reason.password,
          global: '',
        });
      } else if (error instanceof AuthenticationException) {
        if (error.reason.email || error.reason.password) {
          setErrors({
            email: error.reason.email || '',
            password: error.reason.password || '',
            global: '',
          });
        } else {
          setErrors({ email: '', password: '', global: error.code });
        }
      } else if (error instanceof Exception) {
        setErrors({ email: '', password: '', global: error.code });
      } else {
        setErrors({ email: '', password: '', global: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col" onSubmit={submitForm} noValidate>
      <div className="gap-8">
        <Field
          htmlFor="email"
          label="Email"
          labelClass="text-grey-700"
          errorMsg={errors.email && getErrorMessage(errors.email, 'email')}
        >
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            inputSize="large"
            value={loginForm.email}
            onChange={updateLoginForm}
            disabled={loading}
          />
        </Field>
        <Field
          htmlFor="password"
          label="Password"
          fieldClass="mt-8"
          labelClass="text-grey-700"
          errorMsg={errors.password && getErrorMessage(errors.password, 'password')}
        >
          <Input.Password
            id="password"
            name="password"
            type="text"
            placeholder="Enter your password"
            inputSize="large"
            value={loginForm.password}
            onChange={updateLoginForm}
            disabled={loading}
          />
        </Field>
        {errors.global && (
          <div className="mt-3 font-spezia text-base text-alert-error">{getErrorMessage(errors.global)}</div>
        )}
      </div>
      <div>
        <Link to="/forgot-password" className="mt-2 inline-block font-spezia text-sm font-semibold text-blue-brilliant">
          Forgot password?
        </Link>
      </div>
      <div className="mt-8 flex w-[170px] flex-col sm:mt-8">
        <Button
          label={<span className="w-full ">{'SIGN IN'}</span>}
          type="submit"
          variant="primary"
          size="large"
          disabled={loading}
        />
      </div>
    </form>
  );
};

export default LoginForm;
