import React, { useEffect, useState } from 'react';
import { Heading, Field, Input, Checkbox, Button, SquareLoader } from '@ncent-holdings/ux-components';
import * as LIVR from 'livr';
import clsx from 'clsx';
import { Link, useNavigate } from 'react-router-dom';
import { cognitoAPI, cloudAPI } from '@src/apiSingleton';
import { useQuery } from '@src/hooks/useQuery';

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
  agreeWithTerms: false,
  mobileNumber: '',
};

type FormData = typeof INITIAL_FORM;

const INITIAL_FORM_ERRORS: { [key in keyof FormData]: string } = {
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
  agreeWithTerms: '',
  mobileNumber: '',
};

const formValidator = new LIVR.Validator<FormData>({
  firstName: ['required', 'string'],
  lastName: ['required', 'string'],
  password: ['required', 'password'],
  confirmPassword: [{ equal_to_field: 'password' }],
  agreeWithTerms: ['required', { one_of: [true] }],
  mobileNumber: ['required', 'phone_number'],
});

export const CreateSalesManager: React.FC = () => {
  const navigate = useNavigate();

  const queryParams = useQuery();
  const actionId = queryParams.get('actionId');

  const encodedEmail = queryParams.get('email');
  const decodedEmail = encodedEmail ? decodeURIComponent(encodedEmail) : undefined;

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formData, updateFormData] = useState({ ...INITIAL_FORM });
  const [formErrors, updateFormErrors] = useState({ ...INITIAL_FORM_ERRORS });
  const [isExpired, setIsExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    checkInvitationExpiration();
  }, []);

  const checkInvitationExpiration = async () => {
    setIsLoading(true);
    if (actionId) {
      const resp = await cloudAPI.actions.get(actionId);
      setIsExpired(resp.isExpired);
    }
    setIsLoading(false);
  };

  const handleFormChange: React.FormEventHandler = (evt: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = evt.target as HTMLInputElement;

    updateFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAgreeWithTermsClick = () => {
    return updateFormData({
      ...formData,
      agreeWithTerms: !formData.agreeWithTerms,
    });
  };

  useEffect(() => {
    if (!submitAttempted) {
      return;
    }

    validateForm(formData);
  }, [formData]);

  // TODO: We really need to be doing this on the back-end as well
  // when we submit the form data. On-page validation is nice but
  // useless if we're not validating the back-end too
  const validateForm = (formData: any): boolean => {
    const validForm = formValidator.validate(formData);
    const errors = { ...INITIAL_FORM_ERRORS };

    if (!validForm) {
      const validationErrors = formValidator.getErrors();

      console.warn('formErrors', { validationErrors });

      if (validationErrors.firstName === 'REQUIRED') {
        errors.firstName = 'First name is required';
      }

      if (validationErrors.lastName === 'REQUIRED') {
        errors.lastName = 'Last name is required';
      }

      if (validationErrors.mobileNumber === 'REQUIRED') {
        errors.mobileNumber = 'Mobile number is required';
      } else if (validationErrors.mobileNumber === 'INVALID_PHONE_NUMBER') {
        errors.mobileNumber = 'Mobile number does not appear to be a valid phone number';
      }

      if (validationErrors.password === 'REQUIRED') {
        errors.password = 'Password is required';
      } else if (validationErrors.password) {
        errors.password = validationErrors.password;
      }

      if (validationErrors.confirmPassword === 'FIELDS_NOT_EQUAL') {
        errors.confirmPassword = 'Passwords do not match';
      }

      if (validationErrors.agreeWithTerms === 'NOT_ALLOWED_VALUE') {
        errors.agreeWithTerms = `Please agree to WellCube's Terms and Privacy Policy`;
      }
    }

    updateFormErrors(errors);

    return !!validForm;
  };

  const handleCreateAccount = async () => {
    if (!submitAttempted) {
      setSubmitAttempted(true);
    }

    const isValid = validateForm(formData);
    if (!isValid) {
      console.error('Form is not valid');
      return;
    }

    if (!actionId) {
      console.error('Action ID is null');
      setSubmitError('An error occurred creating your account. Please try again.');
      return;
    }

    if (!decodedEmail) {
      console.error('Email is empty');
      setSubmitError('An error occurred creating your account. Please try again.');
      return;
    }

    try {
      const { firstName, lastName, password, agreeWithTerms, mobileNumber } = formData;
      await cognitoAPI.user.signUp(actionId, decodedEmail, password, {
        firstName,
        secondName: lastName,
        agreeWithTerms: String(agreeWithTerms),
        phone: mobileNumber,
      });

      navigate('/', { replace: true });
    } catch (err: Error | any) {
      setSubmitError(err.message);
    }
  };

  const renderForm = () => (
    <div className="mx-auto max-w-[460px]">
      <Heading
        size="h1"
        heading="Create your account"
        subheading="Fill out the form below to set up your account as a WellCube Technical Sales Manager."
      />
      <Field htmlFor="firstName" label="First name" fieldClass="mt-9" labelClass="text-grey-700">
        <Input
          id="firstName"
          type="text"
          placeholder="Enter your first name"
          inputSize="large"
          value={formData.firstName}
          name="firstName"
          onChange={handleFormChange}
          hasError={formErrors.firstName !== ''}
        />
      </Field>
      <p
        className={clsx(
          'mt-2 text-sm',
          formErrors.firstName !== '' && 'text-alert-error-light',
          formErrors.firstName === '' && 'text-suede-blue',
        )}
      >
        {formErrors.firstName !== '' && formErrors.firstName}
      </p>
      <Field htmlFor="lastName" label="Last name" fieldClass="mt-4" labelClass="text-grey-700">
        <Input
          id="lastName"
          type="text"
          placeholder="Enter your last name"
          inputSize="large"
          value={formData.lastName}
          name="lastName"
          onChange={handleFormChange}
          hasError={formErrors.lastName !== ''}
        />
      </Field>
      <p
        className={clsx(
          'mt-2 text-sm',
          formErrors.lastName !== '' && 'text-alert-error-light',
          formErrors.lastName === '' && 'text-suede-blue',
        )}
      >
        {formErrors.lastName !== '' && formErrors.lastName}
      </p>
      <Field htmlFor="mobileNumber" label="Mobile number" fieldClass="mt-4" labelClass="text-grey-700">
        <Input.Phone
          id="mobileNumber"
          value={formData.mobileNumber}
          name="mobileNumber"
          placeholder="Mobile number"
          inputSize="large"
          onChange={handleFormChange}
          hasError={formErrors.mobileNumber !== ''}
        />
      </Field>
      <p
        className={clsx(
          'mt-2 text-sm',
          formErrors.mobileNumber !== '' && 'text-alert-error-light',
          formErrors.mobileNumber === '' && 'text-suede-blue',
        )}
      >
        {formErrors.mobileNumber !== '' && formErrors.mobileNumber}
      </p>
      <Field htmlFor="password" label="Password" fieldClass="mt-4" labelClass="text-grey-700">
        <Input.Password
          id="password"
          type="text"
          placeholder="Create a password"
          inputSize="large"
          value={formData.password}
          name="password"
          onChange={handleFormChange}
          hasError={formErrors.password !== ''}
        />
      </Field>
      <p
        className={clsx(
          'mt-2 text-sm',
          formErrors.password !== '' && 'text-alert-error-light',
          formErrors.password === '' && 'text-suede-blue',
        )}
      >
        {formErrors.password !== '' && formErrors.password}
        {formErrors.password === '' && (
          <>
            Must be 8 or more characters, contain both uppercase and lowercase characters, and contain at least 1 number
            and 1 special character.
          </>
        )}
      </p>
      <Field htmlFor="confirmPassword" label="Confirm password" fieldClass="mt-4" labelClass="text-grey-700">
        <Input.Password
          id="confirmPassword"
          type="text"
          placeholder="Please re-enter your password"
          inputSize="large"
          value={formData.confirmPassword}
          name="confirmPassword"
          onChange={handleFormChange}
          hasError={formErrors.confirmPassword !== ''}
        />
      </Field>
      <p
        className={clsx(
          'mt-2 text-sm',
          formErrors.confirmPassword !== '' && 'text-alert-error-light',
          formErrors.confirmPassword === '' && 'text-suede-blue',
        )}
      >
        {formErrors.confirmPassword !== '' && formErrors.confirmPassword}
      </p>
      <p className="text-body mt-8 flex text-black-soft">
        <Checkbox id="agreeWithTerms" isChecked={formData.agreeWithTerms} handleCheck={handleAgreeWithTermsClick} />
        <span className="ml-2">{`I agree to WellCube's `}</span>
        <Link className="ml-1 text-blue-brilliant underline" to={'/terms-and-conditions'} target="blank">
          Terms and Privacy Policy.
        </Link>
      </p>
      <p className={clsx('mt-3 text-base font-medium', formErrors.agreeWithTerms !== '' && 'text-alert-error-light')}>
        {formErrors.agreeWithTerms !== '' && formErrors.agreeWithTerms}
      </p>
      <div className="mt-8">
        <>{submitError && <div className="mb-4 text-sm text-alert-error-light">{submitError}</div>}</>
        <Button variant="primary" size="large" label="Create Account" onClick={handleCreateAccount} />
      </div>
    </div>
  );

  if (isLoading) {
    return <SquareLoader className="flex w-full flex-col items-center justify-center p-[150px]" />;
  }

  return (
    <div className="flex w-full ">
      {!isExpired ? (
        renderForm()
      ) : (
        <div className="m-auto flex w-[550px] flex-col items-center justify-center text-center">
          <img src="../icons/login/expired.svg?react" className="w-[230px]" />
          <p className="mb-4 mt-8 text-h1 font-semibold text-grey-700">Your invitation link has expired.</p>
          <p className="mb-5">
            The WellCube invitation for <span className="font-semibold">{decodedEmail}</span> is out of date
          </p>
          <p>Contact your organization&apos;s admin to request a new link to your organization or site.</p>
        </div>
      )}
    </div>
  );
};

export default CreateSalesManager;
