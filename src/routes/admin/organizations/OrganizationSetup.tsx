import * as orgActions from '../../../actions/organizations';
import * as listActions from '../../../actions/lists';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeadingDeprecated, Modal, Input, Field, Dropdown, Button } from '@ncent-holdings/ux-components';
import { twMerge } from 'tailwind-merge';
import ScrollVisibleElement from '../../../components/ScrollVisibleElement/ScrollVisibleElement';
import { Industry } from '../../../types/Industry';

export const Organizations: React.FC = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [cancelVisible, setCancelVisible] = useState(false);

  const [handleRequired, setHandleRequired] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const [orgName, setOrgName] = useState('');
  const [domainName, setDomainName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [industry, setIndustry] = useState('');
  const [keywords, setKeywords] = useState('');

  const [address1Missing, setAddress1Missing] = useState(false);
  const [countryMissing, setCountryMissing] = useState(false);
  const [cityMissing, setCityMissing] = useState(false);
  const [stateNameMissing, setStateNameMissing] = useState(false);
  const [postalCodeMissing, setPostalCodeMissing] = useState(false);

  const [orgError, setOrgError] = useState('');
  const [domainError, setDomainError] = useState('');

  const [industryList, setIndustryList] = useState<Industry[]>([]);

  useEffect(() => {
    loadIndustryList();
  }, []);

  const loadIndustryList = async () => {
    const newList = await listActions.getSortedIndustryList(true);

    const industryMap = newList.map((industry: string, idx: number) => ({
      id: `val${idx}`,
      label: industry,
      value: industry,
    }));

    setIndustryList(industryMap);
  };

  const hideDuplicateModal = async () => {
    setShowDuplicateModal(false);
    setHandleRequired(true);
  };

  const handleConfirmOrg = async (org: string) => {
    const { isValid, errorText } = await orgActions.validateOrgName(org);
    if (!isValid && errorText === 'Organization name is already in use.') {
      setHandleRequired(true);
      setShowDuplicateModal(true);
      setOrgError('');
      setDomainError('');
    } else if (!isValid) {
      setOrgError(errorText ?? 'Organization name error!');
      setHandleRequired(false);
    } else {
      setOrgError('');
      setHandleRequired(false);
      setDomainError('');
    }

    setDomainName(
      org
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s/g, '-'),
    );
    handleConfirmDomain(
      org
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s/g, '-'),
    );

    return isValid;
  };

  const handleConfirmDomain = async (domain: string) => {
    const { isValid, errorText } = await orgActions.validateOrgHandle(domain?.toLowerCase());
    if (!isValid) {
      setDomainError(errorText ?? 'Organization handle error!');
      setHandleRequired(true);
    } else {
      setDomainError('');
    }

    return isValid;
  };

  const handleCancel = async () => {
    setCancelVisible(false);

    navigate('/organizations');

    return true;
  };

  const handleFinish = async () => {
    try {
      if (!address1) {
        setAddress1Missing(true);
      }

      if (!country) {
        setCountryMissing(true);
      }

      if (!city) {
        setCityMissing(true);
      }

      if (!stateName) {
        setStateNameMissing(true);
      }

      if (!postalCode) {
        setPostalCodeMissing(true);
      }

      if (address1 && country && city && stateName && postalCode) {
        await orgActions.createOrg({
          name: orgName,
          handle: domainName,
          address1,
          address2,
          country,
          city,
          state: stateName,
          postal_code: postalCode,
          industry,
          keywords,
        });

        navigate('/organizations');
      }
    } catch (err) {
      console.error('Error creating new org: ', { err });
    }

    return true;
  };

  const showCancel = async () => {
    setCancelVisible(true);

    return true;
  };

  const hideCancel = async () => {
    setCancelVisible(false);

    return true;
  };

  const updateOrgName = (evt: React.SyntheticEvent) => {
    const { value: newValue } = evt.target as HTMLInputElement;

    setOrgName(newValue);

    handleConfirmOrg(newValue);
  };

  const updateDomainName = (evt: React.SyntheticEvent) => {
    const { value: newValue } = evt.target as HTMLInputElement;

    setDomainName(newValue?.toLowerCase());

    handleConfirmDomain(newValue);
  };

  const updateAddress1 = (evt: React.SyntheticEvent) => {
    const { value: newValue } = evt.target as HTMLInputElement;

    setAddress1(newValue);
    setAddress1Missing(false);

    // handleConfirmAddress1(newValue);
  };

  const updateAddress2 = (evt: React.SyntheticEvent) => {
    const { value: newValue } = evt.target as HTMLInputElement;

    setAddress2(newValue);

    // handleConfirmAddress2(newValue);
  };

  const updateCountry = (evt: React.SyntheticEvent) => {
    const { value: newValue } = evt.target as HTMLInputElement;

    setCountry(newValue);
    setCountryMissing(false);

    // handleConfirmCountry(newValue);
  };

  const updateCity = (evt: React.SyntheticEvent) => {
    const { value: newValue } = evt.target as HTMLInputElement;

    setCity(newValue);
    setCityMissing(false);

    // handleConfirmCity(newValue);
  };

  const updateStateName = (evt: React.SyntheticEvent) => {
    const { value: newValue } = evt.target as HTMLInputElement;

    setStateName(newValue);
    setStateNameMissing(false);
    // handleConfirmStateName(newValue);
  };

  const updatePostalCode = (evt: React.SyntheticEvent) => {
    const { value: newValue } = evt.target as HTMLInputElement;

    setPostalCode(newValue);
    setPostalCodeMissing(false);
    // handleConfirmPostalCode(newValue);
  };

  const updateIndustry = (items: { id: string; value: string; label?: string }[]) => {
    if (items.length == 0) {
      return;
    }

    setIndustry(items[0]?.value);

    // handleConfirmIndustry(newValue);
  };

  const updateKeywords = (evt: React.SyntheticEvent) => {
    const { value: newValue } = evt.target as HTMLInputElement;

    setKeywords(newValue);

    // handleConfirmKeywords(newValue);
  };

  const nextPage = async () => {
    setCurrentPage(2);

    return true;
  };

  const prevPage = async () => {
    setCurrentPage(1);

    return true;
  };

  const renderFirstPage = () => {
    return (
      <div id="Frame 8293">
        <ScrollVisibleElement scrollTitle="Add an organization">
          <HeadingDeprecated heading="Add an organization" />
        </ScrollVisibleElement>
        <div className="h-[3.25rem]" />
        <div className="flex w-full max-w-[46rem] flex-col gap-[0px] p-0">
          <form noValidate>
            <Field htmlFor="organizationName" label="Organization name" labelSize="small" errorMsg={orgError}>
              <Input
                id="organizationName"
                inputSize="large"
                name="organizationName"
                onChange={updateOrgName}
                placeholder="e.g. Delos"
                value={orgName || ''}
                required
                type="text"
                tooltip={
                  <div>
                    This will be the name of your organization in WellCube. Your URL will be https://wellcube.com/
                    {domainName ? domainName : '[handle]'}
                  </div>
                }
              />
            </Field>

            <Field
              fieldClass={twMerge(`${handleRequired ? 'visible' : 'hidden'}`)}
              htmlFor="domainName"
              label="Unique organization handle"
              errorMsg={domainError}
            >
              <Input
                id="domainName"
                inputSize="large"
                name="domainName"
                onChange={updateDomainName}
                placeholder="Unique organization handle"
                value={domainName || ''}
                required
                type="text"
                tooltip={
                  <div>
                    This will be your organization handle in WellCube. Your URL will be https://wellcube.com/
                    {domainName ? domainName : '[handle]'}
                  </div>
                }
              />
            </Field>

            <div className="mt-[30px] flex gap-8 p-0">
              <Button variant="inverse" label="CANCEL" size="large" onClick={showCancel} className="min-w-[120px]" />

              <Button
                variant="primary"
                type="submit"
                label="NEXT"
                size="large"
                onClick={nextPage}
                disabled={!(orgName && domainName && !orgError && !domainError) || false}
                className="min-w-[120px]"
              />
            </div>
          </form>

          <Modal onClose={hideCancel} open={cancelVisible}>
            <div>
              <h1 className="mb-6 text-[1.5rem] font-semibold leading-[1.25] tracking-[-.0625rem]">Are you sure?</h1>
              <div className="mb-4">
                Cancelling now will delete your inputs. Click below to proceed with cancelling.
              </div>
              <div className="mt-12 flex items-center justify-center gap-3">
                <Button variant="primary" label="CONFIRM CANCEL" size="large" onClick={handleCancel} />
              </div>
            </div>
          </Modal>

          <Modal onClose={hideDuplicateModal} open={showDuplicateModal} showCloseButton={false}>
            <div className="center px-6 text-h3">Duplicate organization name</div>
            <p className="p-6 text-h4">
              An organization named <span className="font-bold">{orgName}</span> already exists. Please contact your
              client to see if their account should be set up as a site within{' '}
              <span className="font-bold">{orgName}</span>
            </p>
            <p className="px-6 pt-1 text-h4">
              If you wish to proceed with <span className="font-bold">{orgName}</span>, you must specify a unique
              display name
            </p>
            <div className="flex gap-8 pl-6 pt-12">
              <Button variant="primary" label="I UNDERSTAND" size="medium" onClick={hideDuplicateModal} />
            </div>
          </Modal>
        </div>
      </div>
    );
  };

  const renderSecondPage = () => {
    return (
      <div id="Frame 8282" className="bg-white-background">
        <ScrollVisibleElement scrollTitle="Add an organization">
          <HeadingDeprecated heading="Add an organization" />
        </ScrollVisibleElement>
        <div className="h-[52px]" />
        <p className="text-h2">Details</p>
        <div className="flex w-full max-w-[576px] flex-col gap-[0px] p-0">
          <Field
            fieldClass="mt-[48px] p-0"
            htmlFor="addressLine1"
            label="Address line 1 *"
            errorMsg={address1Missing ? 'Address line 1 is required' : ''}
          >
            <Input
              id="addressLine1"
              inputSize="large"
              name="addressLine1"
              onChange={updateAddress1}
              placeholder="Address line 1"
              value={address1 || ''}
              required
              type="text"
              hasError={address1Missing}
            />
          </Field>

          <Field fieldClass="mt-[32px] p-0" htmlFor="addressLine2" label="Address line 2" errorMsg={''}>
            <Input
              id="addressLine2"
              inputSize="large"
              name="addressLine2"
              onChange={updateAddress2}
              placeholder="Address line 2"
              value={address2 || ''}
              type="text"
            />
          </Field>

          <Field
            fieldClass="mt-[32px] p-0"
            htmlFor="country"
            label="Country / Region *"
            errorMsg={countryMissing ? 'Country is required' : ''}
          >
            <Input
              id="country"
              inputSize="large"
              name="country"
              onChange={updateCountry}
              placeholder="Country"
              value={country || ''}
              required
              type="text"
              hasError={countryMissing}
            />
          </Field>

          <Field
            fieldClass="mt-[32px] p-0"
            htmlFor="city"
            label="City *"
            errorMsg={cityMissing ? 'City is required' : ''}
          >
            <Input
              id="city"
              inputSize="large"
              name="city"
              onChange={updateCity}
              placeholder="City"
              value={city || ''}
              required
              type="text"
              hasError={cityMissing}
            />
          </Field>

          <Field
            fieldClass="mt-[32px] p-0"
            htmlFor="state"
            label="State *"
            errorMsg={stateNameMissing ? 'State is required' : ''}
          >
            <Input
              id="state"
              inputSize="large"
              name="state"
              onChange={updateStateName}
              placeholder="State"
              value={stateName || ''}
              required
              type="text"
              hasError={stateNameMissing}
            />
          </Field>

          <Field
            fieldClass="mt-[32px] p-0"
            htmlFor="postalCode"
            label="ZIP / Postal Code *"
            errorMsg={postalCodeMissing ? 'ZIP / Postal Code is required' : ''}
          >
            <Input
              id="postalCode"
              inputSize="large"
              name="postalCode"
              onChange={updatePostalCode}
              placeholder="Enter your ZIP / Postal Code"
              value={postalCode || ''}
              required
              type="text"
              hasError={postalCodeMissing}
            />
          </Field>

          <div className="mt-[32px]">
            <Dropdown
              label="Industry"
              classNames={{
                container: () => 'mt-[8px] p-0',
              }}
              size="large"
              options={industryList}
              placeholder="Select your industry"
              handleSelection={updateIndustry}
              isMulti={false}
            />
          </div>

          <Field fieldClass="mt-[32px] p-0" htmlFor="keywords" label="Key words" errorMsg={''}>
            <Input
              id="keywords"
              inputSize="large"
              name="keywords"
              onChange={updateKeywords}
              placeholder="Enter key words"
              value={keywords || ''}
              type="text"
              tooltip={
                <div>
                  Use key words to describe the organization. You will be able to filter and search for organizations by
                  key words.
                </div>
              }
            />
          </Field>

          <div className="mt-[30px] flex gap-8 p-0">
            <Button variant="inverse" label="BACK" size="large" onClick={prevPage} className="min-w-[120px]" />

            <Button
              variant="primary"
              type="submit"
              label="FINISH"
              size="large"
              onClick={handleFinish}
              className="min-w-[120px]"
            />
          </div>
        </div>
      </div>
    );
  };

  if (currentPage == 1) {
    return renderFirstPage();
  } else {
    return renderSecondPage();
  }
};

export default Organizations;
