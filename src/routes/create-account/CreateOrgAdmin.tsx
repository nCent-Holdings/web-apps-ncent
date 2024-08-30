import React, { useEffect, useState } from 'react';
import { Heading, Field, Input, Modal, Checkbox, Button, SquareLoader } from '@ncent-holdings/ux-components';
import * as LIVR from 'livr';
import clsx from 'clsx';
import { Link, useNavigate } from 'react-router-dom';
import { cognitoAPI, cloudAPI } from '../../apiSingleton';
import { useQuery } from '../../hooks/useQuery';

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
  displayName: '',
  jobTitle: '',
  mobileNumber: '',
  country: '',
  city: '',
  stateName: '',
  postalCode: '',
  agreeWithTerms: false,
};

type FormData = typeof INITIAL_FORM;

const INITIAL_FORM_ERRORS: { [key in keyof FormData]: string } = {
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
  displayName: '',
  jobTitle: '',
  mobileNumber: '',
  country: '',
  city: '',
  stateName: '',
  postalCode: '',
  agreeWithTerms: '',
};

function getFormValidator(currentPage: number): LIVR.Validator<FormData> {
  return new LIVR.Validator<FormData>({
    firstName: ['required', 'string'],
    lastName: ['required', 'string'],
    password: ['required', 'password'],
    confirmPassword: [{ equal_to_field: 'password' }],
    displayName: ['string'],
    jobTitle: ['required', 'string'],
    mobileNumber: ['required', 'phone_number'],
    country: ['string'],
    city: ['string'],
    stateName: ['string'],
    postalCode: currentPage === 1 ? ['string'] : ['required', 'us_zip_code'],
    agreeWithTerms: currentPage === 1 ? ['string'] : ['required', { one_of: [true] }],
  });
}

export const CreateOrgAdmin: React.FC = () => {
  const navigate = useNavigate();

  const queryParams = useQuery();
  const actionId = queryParams.get('actionId');

  const encodedEmail = queryParams.get('email');
  const decodedEmail = encodedEmail ? decodeURIComponent(encodedEmail) : undefined;

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formData, updateFormData] = useState({ ...INITIAL_FORM });
  const [formErrors, updateFormErrors] = useState({ ...INITIAL_FORM_ERRORS });
  const [currentPage, setCurrentPage] = useState(1);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
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

  useEffect(() => {
    setSubmitAttempted(false);
  }, [currentPage]);

  // TODO: We really need to be doing this on the back-end as well
  // when we submit the form data. On-page validation is nice but
  // useless if we're not validating the back-end too
  const validateForm = (formData: any): boolean => {
    const formValidator = getFormValidator(currentPage);
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

      if (validationErrors.password === 'REQUIRED') {
        errors.password = 'Password is required';
      } else if (validationErrors.password) {
        errors.password = validationErrors.password;
      }

      if (validationErrors.confirmPassword === 'FIELDS_NOT_EQUAL') {
        errors.confirmPassword = 'Passwords do not match';
      }

      if (validationErrors.jobTitle === 'REQUIRED') {
        errors.jobTitle = 'Job title is required';
      }

      if (validationErrors.mobileNumber === 'REQUIRED') {
        errors.mobileNumber = 'Mobile number is required';
      } else if (validationErrors.mobileNumber === 'INVALID_PHONE_NUMBER') {
        errors.mobileNumber = 'Mobile number does not appear to be a valid phone number';
      }

      if (validationErrors.country === 'REQUIRED') {
        errors.country = 'Country / Region is required';
      }

      if (validationErrors.city === 'REQUIRED') {
        errors.city = 'City is required';
      }

      if (validationErrors.stateName === 'REQUIRED') {
        errors.stateName = 'State is required';
      }

      if (validationErrors.postalCode === 'REQUIRED') {
        errors.postalCode = 'ZIP / Postal code is required';
      } else if (validationErrors.postalCode === 'INVALID_ZIP_CODE') {
        errors.postalCode = 'ZIP / Postal code does not appear to be a valid US ZIP code';
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
      const {
        firstName,
        lastName,
        password,
        jobTitle,
        mobileNumber,
        country,
        city,
        stateName,
        postalCode,
        agreeWithTerms,
      } = formData;
      await cognitoAPI.user.signUp(actionId, decodedEmail, password, {
        firstName,
        secondName: lastName,
        jobTitle,
        phone: mobileNumber,
        country,
        city,
        stateName,
        postalCode,
        agreeWithTerms: String(agreeWithTerms),
      });

      setConfirmVisible(true);
    } catch (err: Error | any) {
      setSubmitError(err.message);
    }
  };

  const showCancel = async () => {
    setCancelVisible(true);

    return true;
  };

  const hideCancel = async () => {
    setCancelVisible(false);

    return true;
  };

  const navtoLogin = async () => {
    setConfirmVisible(false);
    navigate('/login');
  };

  const handleCancel = async () => {
    setCancelVisible(false);

    navtoLogin();
  };

  const nextPage = async () => {
    setSubmitAttempted(true);
    const isValid = validateForm(formData);
    if (!isValid) {
      return;
    }

    setCurrentPage(2);

    return true;
  };

  const prevPage = async () => {
    setCurrentPage(1);

    return true;
  };

  const renderModal = () => {
    return (
      <Modal onClose={() => undefined} open={confirmVisible} showCloseButton={false}>
        <div className="mb-6 text-[1.5rem] font-semibold leading-[1.25] tracking-[-.0625rem]">Thank you!</div>
        <div>Your account has been created.</div>
        <div className="mt-12 flex items-center justify-center gap-3">
          <Button variant="primary" size="medium" label="OK" onClick={navtoLogin} />
        </div>
      </Modal>
    );
  };

  const renderFirstPage = () => {
    return (
      <div className="mx-auto max-w-[458px]">
        <Heading heading="Create your account" size="h1" />
        <p className="mt-3 text-bdy text-grey-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-brilliant">
            Sign in
          </a>
        </p>
        {/*<div className="my-9 ml-[147.5px] flex h-[29px] w-[165px] flex-row content-center items-center justify-center gap-[16px] p-0 text-[1.25rem]">*/}
        {/*  <span className="font-black-soft text-center align-baseline text-[1.5rem] leading-[1.15]">Step</span>*/}
        {/*  <i className="icon wcicon-step-number-1-enabled align-middle" />*/}
        {/*  <div className="h-[0px] w-6 border-t border-t-grey-200 "></div>*/}
        {/*  <i className="icon wcicon-step-number-2-enabled align-middle opacity-25" />*/}
        {/*</div>*/}
        <div className="mt-9 flex text-h4">Personal information</div>
        <Field htmlFor="firstName" label="First name" fieldClass="mt-[24px]" labelClass="text-grey-700">
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
        <Field htmlFor="password" label="Password" fieldClass="mt-4" labelClass="text-grey-700">
          <Input.Password
            id="password"
            type="text"
            value={formData.password}
            name="password"
            placeholder="Create a password"
            inputSize="large"
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
              Must be 8 or more characters, contain both uppercase and lowercase characters, and contain at least 1
              number and 1 special character.
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
        <Field
          htmlFor="displayName"
          label="Choose display name (optional)"
          fieldClass="mt-4"
          labelClass="text-grey-700"
        >
          <Input
            id="displayName"
            type="text"
            value={formData.displayName}
            name="displayName"
            placeholder="Optional display name (e.g. j.smith)"
            inputSize="large"
            onChange={handleFormChange}
            hasError={formErrors.displayName !== ''}
          />
        </Field>
        <p
          className={clsx(
            'mt-2 text-sm',
            formErrors.displayName !== '' && 'text-alert-error-light',
            formErrors.displayName === '' && 'text-suede-blue',
          )}
        >
          {formErrors.displayName !== '' && formErrors.displayName}
        </p>
        <Field htmlFor="jobTitle" label="Job title" fieldClass="mt-4" labelClass="text-grey-700">
          <Input
            id="jobTitle"
            type="text"
            value={formData.jobTitle}
            name="jobTitle"
            placeholder="Job title"
            inputSize="large"
            onChange={handleFormChange}
            hasError={formErrors.jobTitle !== ''}
          />
        </Field>
        <p
          className={clsx(
            'mt-2 text-sm',
            formErrors.jobTitle !== '' && 'text-alert-error-light',
            formErrors.jobTitle === '' && 'text-suede-blue',
          )}
        >
          {formErrors.jobTitle !== '' && formErrors.jobTitle}
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
            tooltip={<div>Your number will be used for support inquiries.</div>}
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
        <div className="mt-[48px] flex gap-8 p-0">
          <Button variant="inverse" size="large" label="Cancel" className="w-[213px]" onClick={showCancel} />
          <Button variant="primary" size="large" label="Next" className="w-[213px]" onClick={nextPage} />
        </div>
        <Modal onClose={hideCancel} open={cancelVisible}>
          <h1 className="mb-6 text-[1.5rem] font-semibold leading-[1.25] tracking-[-.0625rem]">Are you sure?</h1>
          <div>Cancelling now will delete your inputs. Click below to proceed with cancelling.</div>
          <div className="mt-12 flex items-center justify-center gap-3">
            <Button variant="primary" label="CONFIRM CANCEL" size="large" onClick={handleCancel} />
          </div>
        </Modal>
      </div>
    );
  };

  const renderSecondPage = () => {
    return (
      <div className="mx-auto max-w-[460px]">
        <Heading heading="Create your account" size="h1" />
        <p className="mt-3 text-bdy text-grey-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-brilliant">
            Sign in
          </a>
        </p>
        {/*<div className="ml-[147.5px] mt-16 flex h-[29px] w-[165px] flex-row content-center items-center justify-center gap-[16px] p-0">*/}
        {/*  <span className="text-card-title font-black-soft text-center align-baseline">Step</span>*/}
        {/*  <i className="icon wcicon-step-number-1-enabled align-middle" />*/}
        {/*  <div className="h-[0px] w-[24px] border-[1.5px] border-black-soft"></div>*/}
        {/*  <i className="icon wcicon-step-number-2-enabled align-middle" />*/}
        {/*</div>*/}
        <div className="mt-9 flex text-h4">Location</div>

        <Field htmlFor="country" label="Country / Region (optional)" fieldClass="mt-[24px]" labelClass="text-grey-700">
          <Input
            id="country"
            type="text"
            placeholder="County / Region (optional)"
            inputSize="large"
            value={formData.country}
            name="country"
            onChange={handleFormChange}
            hasError={formErrors.country !== ''}
          />
        </Field>
        <p
          className={clsx(
            'mt-2 text-sm',
            formErrors.country !== '' && 'text-alert-error-light',
            formErrors.country === '' && 'text-suede-blue',
          )}
        >
          {formErrors.country !== '' && formErrors.country}
        </p>

        <Field htmlFor="city" label="City (optional)" fieldClass="mt-4" labelClass="text-grey-700">
          <Input
            id="city"
            type="text"
            placeholder="City"
            inputSize="large"
            value={formData.city}
            name="city"
            onChange={handleFormChange}
            hasError={formErrors.city !== ''}
          />
        </Field>
        <p
          className={clsx(
            'mt-2 text-sm',
            formErrors.city !== '' && 'text-alert-error-light',
            formErrors.city === '' && 'text-suede-blue',
          )}
        >
          {formErrors.city !== '' && formErrors.city}
        </p>

        <Field htmlFor="stateName" label="State (optional)" fieldClass="mt-4" labelClass="text-grey-700">
          <Input
            id="stateName"
            type="text"
            placeholder="State"
            inputSize="large"
            value={formData.stateName}
            name="stateName"
            onChange={handleFormChange}
            hasError={formErrors.stateName !== ''}
          />
        </Field>
        <p
          className={clsx(
            'mt-2 text-sm',
            formErrors.stateName !== '' && 'text-alert-error-light',
            formErrors.stateName === '' && 'text-suede-blue',
          )}
        >
          {formErrors.stateName !== '' && formErrors.stateName}
        </p>

        <Field htmlFor="postalCode" label="ZIP / Postal code" fieldClass="mt-4" labelClass="text-grey-700">
          <Input
            id="postalCode"
            type="text"
            placeholder="ZIP / Postal code"
            inputSize="large"
            value={formData.postalCode}
            name="postalCode"
            onChange={handleFormChange}
            hasError={formErrors.postalCode !== ''}
          />
        </Field>
        <p
          className={clsx(
            'mt-2 text-sm',
            formErrors.postalCode !== '' && 'text-alert-error-light',
            formErrors.postalCode === '' && 'text-suede-blue',
          )}
        >
          {formErrors.postalCode !== '' && formErrors.postalCode}
        </p>

        <p className="text-body row mt-8 flex text-black-soft">
          <Checkbox id="agreeWithTerms" isChecked={formData.agreeWithTerms} handleCheck={handleAgreeWithTermsClick} />
          <span className="ml-2">{`I agree to WellCube's `}</span>
          <Link className="ml-1 text-blue-brilliant underline" to={'/terms-and-conditions'} target="blank">
            Terms and Privacy Policy.
          </Link>
        </p>
        <p className={clsx('mt-3 text-base font-medium', formErrors.agreeWithTerms !== '' && 'text-alert-error')}>
          {formErrors.agreeWithTerms !== '' && formErrors.agreeWithTerms}
        </p>

        <div className="mt-8 flex gap-8 p-0">
          <Button variant="inverse" size="large" className="w-[213px]" label="Back" onClick={prevPage} />
          <Button
            variant="primary"
            size="large"
            className="w-[213px]"
            label="Create Account"
            onClick={handleCreateAccount}
          />
        </div>
        {submitError && <div className="mb-4 text-sm text-alert-error-light">{submitError}</div>}
      </div>
    );
  };

  if (isLoading) {
    return <SquareLoader className="flex w-full flex-col items-center justify-center p-[150px]" />;
  }

  return (
    <div className="flex w-full ">
      {!isExpired ? (
        currentPage == 1 ? (
          renderFirstPage()
        ) : (
          renderSecondPage()
        )
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
      {renderModal()}
    </div>
  );
};

export default CreateOrgAdmin;
