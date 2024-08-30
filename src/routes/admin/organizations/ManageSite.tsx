import LIVR from 'livr';
import * as siteActions from '../../../actions/sites';

import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Accordion,
  Field,
  Input,
  Missing,
  Complete,
  Incomplete,
  FileDropper,
  Modal,
  Button,
  Heading,
  Dropdown,
} from '@ncent-holdings/ux-components';

import OpenInput from '../../../components/OpenInput/OpenInput';
import { SiteDescription, SiteLocation, SiteDetails } from '@src/types/OrganizationSite';

import { OrgSiteModel } from '@src/api-types/models';
import { s3API } from '@src/apiSingleton';
import ScrollVisibleElement from '../../../components/ScrollVisibleElement/ScrollVisibleElement';
import { useSite } from '@src/api-hooks/sites/sitesApi';
import clsx from 'clsx';
import { useOrganizationFromHandle } from '@src/features/useOrganizationFromHandle';
import { Option } from '@src/routes/client/users/types';
import { Timezone } from '@src/api-types/wellcube';

const TIMEZONE_DATA: Record<string, Timezone> = {
  'America/New_York': {
    rawOffset: -18000,
    timeZoneId: 'America/New_York',
    timeZoneName: 'Eastern Standart Time',
  },
  'America/Chicago': {
    rawOffset: -21600,
    timeZoneId: 'America/Chicago',
    timeZoneName: 'Central Standart Time',
  },
  'America/Phoenix': {
    rawOffset: -25200,
    timeZoneId: 'America/Phoenix',
    timeZoneName: 'Mountain Standart Time',
  },
  'America/Los_Angeles': {
    rawOffset: -28800,
    timeZoneId: 'America/Los_Angeles',
    timeZoneName: 'Pacific Standart Time',
  },
};

const TIMEZONE_OPTIONS = [
  { id: 'America/New_York', value: 'America/New_York', label: 'United States - EST' },
  { id: 'America/Chicago', value: 'America/Chicago', label: 'United States - CST' },
  { id: 'America/Phoenix', value: 'America/Phoenix', label: 'United States - MST' },
  { id: 'America/Los_Angeles', value: 'America/Los_Angeles', label: 'United States - PST' },
];

const FORM_STATUS = {
  MISSING: 'missing',
  INCOMPLETE: 'incomplete',
  COMPLETE: 'complete',
};

const INITIAL_STATE = {
  SITE_META: {
    siteId: '',
    name: '',
    handle: '',
  },
  LOCATION: {
    address1: '',
    address2: '',
    country: '',
    city: '',
    state: '',
    postal_code: '',
    timezone: '',
  },
  DETAILS: {
    site_type: '',
    property_interest: '',
    year_of_construction: '',
    construction_materials: '',
    keywords: '',
  },
  DESCRIPTION: {
    description: '',
    files: [],
  },
};

const INITIAL_VALIDATION = {
  LOCATION: {
    address1: '',
    address2: '',
    country: '',
    city: '',
    state: '',
    postal_code: '',
    timezone: '',
  },
  DETAILS: {
    site_type: '',
    property_interest: '',
    year_of_construction: '',
    construction_materials: '',
    keywords: '',
  },
  DESCRIPTION: {
    description: '',
    files: '',
  },
};

const locationValidator = new LIVR.Validator({
  address1: ['required', 'string'],
  address2: ['string'],
  country: ['required', 'string'],
  city: ['required', 'string'],
  state: ['required', 'string'],
  postal_code: ['required', 'string'],
  timezone: ['required', 'string'],
});

const detailValidator = new LIVR.Validator({
  site_type: ['required', 'string'],
  property_interest: 'string',
  year_of_construction: 'string',
  construction_materials: 'string',
  keywords: 'string',
});

export const ManageSite: React.FC = () => {
  const { siteHandle: existingSiteHandle = '' } = useParams<'siteHandle'>();

  const { orgId, orgHandle } = useOrganizationFromHandle();
  const { site: siteData } = useSite(orgId, existingSiteHandle, { skip: !existingSiteHandle });

  const [isPopulated, setIsPopulated] = useState(false);

  useEffect(() => {
    // If no handle was passed we're creating a new site, skip this population
    if (!existingSiteHandle) {
      return;
    }

    // If there isn't any site data (e.g. siteList array is empty), we can't populate anything
    // Should this show an error?
    if (!siteData) return;

    if (!isPopulated) populateExistingSite(siteData);
  }, [siteData]);

  const populateExistingSite = (existingSite: OrgSiteModel) => {
    const existingData = existingSite['wellcube/site'];

    // TODO: Find a better way to do this, this seems stupid
    // -- maybe a hook for the whole form that gets imported into specific components for the UI?

    setSiteMeta({
      siteId: existingSite.id,
      name: existingSite.name,
      handle: existingData?.handle || '',
    });

    if (existingData) {
      setLocationForm({
        address1: existingData.address1,
        address2: existingData.address2,
        country: existingData.country,
        city: existingData.city,
        state: existingData.state,
        postal_code: existingData.postal_code,
        timezone: existingData.timezone.timeZoneId,
      });

      setSavedLocation({
        address1: existingData.address1,
        address2: existingData.address2,
        country: existingData.country,
        city: existingData.city,
        state: existingData.state,
        postal_code: existingData.postal_code,
        timezone: existingData.timezone.timeZoneId,
      });

      setDetailsForm({
        property_interest: existingData.property_interest,
        site_type: existingData.site_type,
        year_of_construction: existingData.year_of_construction,
        keywords: existingData.keywords,
        construction_materials: existingData.construction_materials,
      });

      setSavedDetails({
        property_interest: existingData.property_interest,
        site_type: existingData.site_type,
        year_of_construction: existingData.year_of_construction,
        keywords: existingData.keywords,
        construction_materials: existingData.construction_materials,
      });

      setDescriptionForm({
        description: existingData.description,
        files: existingData.asset_list.map((asset) => ({ ...asset, file: asset.file as File })),
      });
      setSavedDescription({
        description: existingData.description,
        files: existingData.asset_list.map((asset) => ({ ...asset, file: asset.file as File })),
      });
    }

    setFormStatus({
      location: FORM_STATUS.COMPLETE,
      details: FORM_STATUS.COMPLETE,
      description: FORM_STATUS.COMPLETE,
    });

    setIsPopulated(true);
  };

  const [expandedId, setExpandedId] = useState('');

  const [unsaved, setUnsaved] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [siteMeta, setSiteMeta] = useState(INITIAL_STATE.SITE_META);

  const [siteNameError, setSiteNameError] = useState('');
  const [siteHandleError, setSiteHandleError] = useState('');

  const [locValidation, setLocValidation] = useState<Partial<typeof INITIAL_VALIDATION.LOCATION>>({});
  const [detValidation, setDetValidation] = useState<Partial<typeof INITIAL_VALIDATION.DETAILS>>({});
  const [descValidation, setDescValidation] = useState<Partial<typeof INITIAL_VALIDATION.DESCRIPTION>>({});

  const [formStatus, setFormStatus] = useState<{
    location: string;
    details: string;
    description: string;
  }>({
    location: FORM_STATUS.MISSING,
    details: FORM_STATUS.MISSING,
    description: FORM_STATUS.MISSING,
  });

  const validateSiteForm = async (): Promise<boolean> => {
    const validName = await handleConfirmSiteName(siteMeta.name);
    if (!validName) {
      console.warn('Name is not valid!');
      return false;
    }

    const validHandle = await handleConfirmSiteHandle(siteMeta.handle);
    if (!validHandle) {
      console.warn('Handle is not valid');
      return false;
    }

    // Validate Location
    const validLoc = validateLocationForm();
    if (!validLoc) return false;

    // Validate Property
    const validDet = validateDetailsForm();
    if (!validDet) return false;

    const validDesc = validateDescriptionForm();
    if (!validDesc) return false;

    return true;
  };

  const handleConfirmSiteName = async (siteName: string) => {
    const { isValid, errorText } = await siteActions.validateSiteName(orgId, siteName, siteMeta.siteId);

    if (!isValid) {
      setSiteNameError(errorText ?? 'Site name error!');
    } else {
      const derivedSiteHandle = siteName
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
      setSiteMeta({ ...siteMeta, handle: derivedSiteHandle });

      await handleConfirmSiteHandle(derivedSiteHandle);

      setSiteNameError('');
    }

    return isValid;
  };

  const handleConfirmSiteHandle = async (siteHandle: string) => {
    const { isValid, errorText } = await siteActions.validateSiteHandle(orgId, siteHandle, siteData?.id);
    if (!isValid) {
      setSiteHandleError(errorText ?? 'Site handle error!');
    } else {
      setSiteHandleError('');
    }

    return isValid;
  };

  const [savedLocation, setSavedLocation] = useState<SiteLocation>({
    ...INITIAL_STATE.LOCATION,
  });

  const getErrorMessage = (error: string, label: string) => {
    if (error === 'REQUIRED') {
      return `${label} is required.`;
    } else {
      return `${error}`;
    }
  };

  const handleSaveLocation = () => {
    setSavedLocation({ ...locationForm });
    const validLocation = validateLocationForm();

    setFormStatus({
      ...formStatus,
      location: validLocation ? FORM_STATUS.COMPLETE : FORM_STATUS.INCOMPLETE,
    });

    setHasSubmitted(true);
    setUnsaved(false);

    if (validLocation) {
      setExpandedId('');
      setHasSubmitted(false);
    }
  };

  const [savedDetails, setSavedDetails] = useState<SiteDetails>({
    ...INITIAL_STATE.DETAILS,
  });
  const handleSaveDetails = () => {
    setSavedDetails({ ...detailsForm });
    const validDetails = validateDetailsForm();

    setFormStatus({
      ...formStatus,
      details: validDetails ? FORM_STATUS.COMPLETE : FORM_STATUS.INCOMPLETE,
    });

    setHasSubmitted(true);
    setUnsaved(false);

    if (validDetails) {
      setExpandedId('');
      setHasSubmitted(false);
    }
  };

  const [savedDescription, setSavedDescription] = useState<SiteDescription>({
    ...INITIAL_STATE.DESCRIPTION,
  });

  const handleSaveDescription = () => {
    setSavedDescription({ ...descriptionForm });
    const validDesc = validateDescriptionForm();

    setFormStatus({
      ...formStatus,
      description: validDesc ? FORM_STATUS.COMPLETE : FORM_STATUS.INCOMPLETE,
    });

    setHasSubmitted(true);
    setUnsaved(false);

    if (validDesc) {
      setExpandedId('');
      setHasSubmitted(false);
    }
  };

  const [locationForm, setLocationForm] = useState<SiteLocation>(INITIAL_STATE.LOCATION);
  const [detailsForm, setDetailsForm] = useState<SiteDetails>(INITIAL_STATE.DETAILS);
  const [descriptionForm, setDescriptionForm] = useState<SiteDescription>(INITIAL_STATE.DESCRIPTION);

  const [modalMeta, setModalMeta] = useState({
    open: false,
    prompt: '',
    confirmText: 'CONFIRM',
    onConfirm: () => {
      /* do nothing */
    },
    dismissText: 'CANCEL',
    onDismiss: () => {
      /* do nothing */
    },
  });

  const expandAccordion = useCallback(
    (accordionId: string) => {
      if (!unsaved) {
        setExpandedId(accordionId);
        setUnsaved(false);
      }

      if (accordionId && unsaved) {
        setModalMeta({
          open: true,
          prompt: 'You have unsaved changes. Would you like to discard them?',
          confirmText: 'DISCARD',
          onConfirm: () => {
            setExpandedId(accordionId);
            setUnsaved(false);
            setModalMeta({ ...modalMeta, open: false });
          },
          dismissText: 'CANCEL',
          onDismiss: () => {
            setModalMeta({ ...modalMeta, open: false });
          },
        });
      }
    },
    [unsaved, savedLocation, savedDetails, savedDescription],
  );

  const collapseAccordion = useCallback(() => {
    if (!unsaved) {
      setExpandedId('');

      setLocationForm({ ...savedLocation });
      setDetailsForm({ ...savedDetails });
      setDescriptionForm({ ...savedDescription });

      setHasSubmitted(false);
      setUnsaved(false);
    } else {
      setModalMeta({
        open: true,
        prompt: 'You have unsaved changes. Would you like to discard them?',
        confirmText: 'DISCARD',
        onConfirm: () => {
          setExpandedId('');

          setLocationForm({ ...savedLocation });
          setDetailsForm({ ...savedDetails });
          setDescriptionForm({ ...savedDescription });

          setUnsaved(false);
          setHasSubmitted(false);
          setModalMeta({ ...modalMeta, open: false });
        },
        dismissText: 'CANCEL',
        onDismiss: () => {
          setModalMeta({ ...modalMeta, open: false });
        },
      });
    }
  }, [unsaved, savedLocation, savedDetails, savedDescription]);

  const validateLocationForm = (): boolean => {
    const validLoc = locationValidator.validate(locationForm);

    if (!validLoc) {
      const errors = locationValidator.getErrors();

      console.warn('Location is not valid!', { errors });
      setLocValidation({ ...errors });

      return false;
    } else {
      setLocValidation({ ...INITIAL_VALIDATION.LOCATION });
      return true;
    }
  };

  const validateDetailsForm = (): boolean => {
    const validProp = detailValidator.validate(detailsForm);

    if (!validProp) {
      const errors = detailValidator.getErrors();

      setDetValidation({ ...errors });

      console.warn('Details are not valid!', { errors });
      return false;
    } else {
      setDetValidation({ ...INITIAL_VALIDATION.DETAILS });
      return true;
    }

    // return true;
  };

  const validateDescriptionForm = (): boolean => {
    // Validate Description
    // const validDesc = descValidator.validate(descValidator);
    // if (!validDesc) {
    //   console.warn('Description is not valid!', { errors: descValidator.getErrors() });
    //   return false;
    // }

    const completeDesc = (formStatus.description = FORM_STATUS.COMPLETE);

    if (!completeDesc) {
      console.warn('Description is not complete!');
      return false;
    }

    return true;
  };

  const updateLocationForm = (evt: React.SyntheticEvent) => {
    const { name: fieldName, value: newValue } = evt.target as HTMLInputElement;
    setLocationForm({
      ...locationForm,
      [fieldName]: newValue,
    });

    if (hasSubmitted) validateLocationForm();

    setUnsaved(true);
  };

  const updateTimezone = ([option]: Option[]) => {
    if (option) {
      setLocationForm({
        ...locationForm,
        timezone: option.value,
      });

      if (hasSubmitted) validateLocationForm();

      setUnsaved(true);
    }
  };

  const updateDetailsForm = (evt: React.SyntheticEvent) => {
    const { name: fieldName, value: newValue } = evt.target as HTMLInputElement;

    setDetailsForm({
      ...detailsForm,
      [fieldName]: newValue,
    });

    if (hasSubmitted) validateDetailsForm();

    setUnsaved(true);
  };

  const updateDescriptionForm = (evt: React.SyntheticEvent) => {
    const { name: fieldName, value: newValue } = evt.target as HTMLInputElement;

    const maxChars = 1000;
    if (newValue.length >= maxChars) {
      setDescValidation({
        ...descValidation,
        description: `Description cannot exceed ${maxChars} characters`,
      });
    } else {
      setDescValidation({
        ...descValidation,
        description: '',
      });
    }

    setDescriptionForm({
      ...descriptionForm,
      [fieldName]: newValue,
    });

    if (hasSubmitted) validateDescriptionForm();

    setUnsaved(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'missing':
        return <Missing />;
      case 'incomplete':
        return <Incomplete />;
      case 'complete':
        return <Complete />;
      default:
        return <div>{status}</div>;
    }
  };

  const navigate = useNavigate();
  const handleSaveSite = async () => {
    const formIsValid = await validateSiteForm();
    setHasSubmitted(true);

    if (!formIsValid) {
      console.warn('Form is not valid!');
      return;
    }

    const siteData = {
      ...savedLocation,
      ...savedDetails,
      name: siteMeta.name,
      handle: siteMeta.handle,
      timezone: TIMEZONE_DATA[savedLocation.timezone],
      description: savedDescription.description,
      asset_list: savedDescription.files.map((file) => ({
        ...file,
        file: {
          name: file.file.name,
          size: file.file.size,
          type: file.file.type,
        },
      })),
    };

    if (siteMeta.siteId) {
      try {
        await siteActions.updateSite(siteMeta.siteId, siteData);
      } catch (err) {
        console.error('Error saving existing site: ', { err });

        throw err;
      }
    } else {
      try {
        await siteActions.createSite(orgId, siteData);
      } catch (err) {
        console.error('Error creating new site: ', { err });

        throw err;
      }
    }

    navigate(`../${orgHandle}`);
  };

  const handleCancelNewSite = () => {
    let prompt;
    if (siteMeta.siteId) {
      prompt = `Any changes you made to the '${siteMeta.name}' site will be lost.`;
    } else {
      prompt = 'Any information you have entered for this site will be lost.';
    }

    setModalMeta({
      open: true,
      prompt,
      confirmText: 'DISCARD',
      onConfirm: () => {
        navigate(`../${orgHandle}`);
      },
      dismissText: 'CANCEL',
      onDismiss: () => {
        setModalMeta({ ...modalMeta, open: false });
      },
    });
  };

  const renderLocationAccordion = () => {
    const { location: locationStatus } = formStatus;

    let btnText = 'ADD LOCATION';
    if (locationStatus === FORM_STATUS.INCOMPLETE) {
      btnText = 'COMPLETE LOCATION';
    } else if (locationStatus === FORM_STATUS.COMPLETE) {
      btnText = 'EDIT LOCATION';
    }

    const { address1, address2, city, state, postal_code } = savedLocation;

    let subheading = 'Input site location details';
    if (address1) {
      subheading = `${address1}`;
      subheading += address2 ? `, ${address2}` : '';
      subheading += city ? `, ${city}` : '';
      subheading += state ? `, ${state}` : '';
      subheading += postal_code ? `, ${postal_code}` : '';
    }

    return (
      <Accordion
        icon={getStatusIcon(locationStatus)}
        heading="Location"
        subheading={subheading}
        buttonText={btnText}
        expanded={expandedId === 'location'}
        onExpand={() => expandAccordion('location')}
        onChange={() => {
          /* do nothing */
        }}
      >
        <div className="mb-8">
          <Field
            htmlFor="address1"
            label="Physical address line 1 *"
            errorMsg={locValidation.address1 && getErrorMessage(locValidation.address1, 'Physical address line 1')}
          >
            <Input
              type="text"
              id="address1"
              name="address1"
              placeholder="Address line 1"
              value={locationForm.address1}
              onChange={updateLocationForm}
              hasError={!!locValidation.address1}
            />
          </Field>
        </div>
        <div className="mb-8">
          <Field
            htmlFor="address2"
            label="Physical address line 2"
            errorMsg={locValidation.address2 && getErrorMessage(locValidation.address2, 'Physical address line 2')}
          >
            <Input
              type="text"
              id="address2"
              name="address2"
              placeholder="Address line 2"
              value={locationForm.address2}
              onChange={updateLocationForm}
              hasError={!!locValidation.address2}
            />
          </Field>
        </div>
        <div className="mb-8">
          <Field
            htmlFor="country"
            label="Country / Region *"
            errorMsg={locValidation.country && getErrorMessage(locValidation.country, 'Country / Region')}
          >
            <Input
              type="text"
              id="country"
              name="country"
              placeholder="Country / region"
              value={locationForm.country}
              onChange={updateLocationForm}
              hasError={!!locValidation.country}
            />
          </Field>
        </div>
        <div className="mb-8">
          <Field
            htmlFor="city"
            label="City *"
            className="mb-8"
            errorMsg={locValidation.city && getErrorMessage(locValidation.city, 'City')}
          >
            <Input
              type="text"
              id="city"
              name="city"
              placeholder="City"
              value={locationForm.city}
              onChange={updateLocationForm}
              hasError={!!locValidation.city}
            />
          </Field>
        </div>
        <div className="mb-8">
          <Field
            htmlFor="state"
            label="State *"
            className="mb-8"
            errorMsg={locValidation.state && getErrorMessage(locValidation.state, 'State')}
          >
            <Input
              type="text"
              id="state"
              name="state"
              placeholder="State"
              value={locationForm.state}
              onChange={updateLocationForm}
              hasError={!!locValidation.state}
            />
          </Field>
        </div>
        <div className="mb-8">
          <Field
            htmlFor="postal_code"
            label="ZIP / Postal code *"
            errorMsg={locValidation.postal_code && getErrorMessage(locValidation.postal_code, 'Postal Code')}
          >
            <Input
              type="text"
              id="postal_code"
              name="postal_code"
              placeholder="ZIP / Postal code"
              value={locationForm.postal_code}
              onChange={updateLocationForm}
              hasError={!!locValidation.postal_code}
            />
          </Field>
        </div>
        <div>
          <Field
            htmlFor="timezone"
            label="Timezone *"
            errorMsg={locValidation.timezone && getErrorMessage(locValidation.timezone, 'Timezone')}
          >
            <Dropdown
              inputId="timezone"
              classNames={{
                container: () => 'mt-[8px] p-0',
              }}
              value={TIMEZONE_OPTIONS.find((option) => option.id === locationForm.timezone)}
              options={TIMEZONE_OPTIONS}
              placeholder="Select a Timezone"
              handleSelection={updateTimezone}
              isMulti={false}
            />
          </Field>
        </div>
        <div className="flex gap-4 pt-12">
          <Button
            variant="secondary"
            label="Cancel"
            size="medium"
            onClick={collapseAccordion}
            className="min-w-[140px]"
          />
          <Button variant="primary" label="Save" size="medium" onClick={handleSaveLocation} className="min-w-[140px]" />
        </div>
      </Accordion>
    );
  };

  const renderDetailsAccordion = () => {
    const { details: detailStatus } = formStatus;
    let editText = 'ADD DETAILS';
    if (detailStatus === FORM_STATUS.INCOMPLETE) {
      editText = 'COMPLETE DETAILS';
    } else if (detailStatus === FORM_STATUS.COMPLETE) {
      editText = 'EDIT DETAILS';
    }

    return (
      <Accordion
        icon={getStatusIcon(detailStatus)}
        heading="Property characteristics"
        subheading="Input site type, ownership model, keywords"
        buttonText={editText}
        expanded={expandedId === 'site-details'}
        onExpand={() => expandAccordion('site-details')}
        onChange={() => {
          /* do nothing */
        }}
      >
        <div
          className={clsx(
            'mb-8',
            '[&.radio-item]:text-[.875rem] [&_.radio-item]:flex [&_.radio-item]:items-center [&_.radio-item]:py-1 [&_.radio-item]:text-[.875rem] [&_.radio-item]:font-medium [&_.radio-item]:leading-[1.25] [&_.radio-item]:text-[#475467] [&_.radio-item_label]:cursor-pointer',
            '[&_.radio-item_label]:ml-2 ',
          )}
        >
          <fieldset onChange={updateDetailsForm} className="mb-8">
            <legend className="mb-2 text-[.875rem] font-medium leading-[1.15]">Site type *</legend>
            <div className="radio-item">
              <input
                type="radio"
                id="type-office"
                name="site_type"
                value="office"
                checked={detailsForm.site_type === 'office'}
              />
              <label htmlFor="type-office">Office</label>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                id="type-building"
                name="site_type"
                value="building"
                checked={detailsForm.site_type === 'building'}
              />
              <label htmlFor="type-building">Building</label>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                id="type-campus"
                name="site_type"
                value="campus"
                checked={detailsForm.site_type === 'campus'}
              />
              <label htmlFor="type-campus">Campus</label>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                id="type-other"
                name="site_type"
                value="other"
                checked={detailsForm.site_type === 'other'}
              />
              <label htmlFor="type-other">Other</label>
            </div>
            <>
              {!!detValidation.site_type && (
                <div className="text-alert-error">{getErrorMessage(detValidation.site_type, 'Site type')}</div>
              )}
            </>
          </fieldset>
          <fieldset onChange={updateDetailsForm} className="mb-8">
            <legend className="mb-2 text-[.875rem] font-medium leading-[1.15]">Property interest</legend>
            <div className="radio-item">
              <input
                type="radio"
                id="prop-owned"
                name="property_interest"
                value="owned"
                checked={detailsForm.property_interest === 'owned'}
              />
              <label htmlFor="prop-owned">Owned</label>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                id="prop-leased"
                name="property_interest"
                value="leased"
                checked={detailsForm.property_interest === 'leased'}
              />
              <label htmlFor="prop-leased">Leased</label>
            </div>
            <>
              {!!detValidation.property_interest && (
                <div className="text-alert-error">
                  {getErrorMessage(detValidation.property_interest, 'Property interest')}
                </div>
              )}
            </>
          </fieldset>
        </div>
        <div className="mb-8">
          <Field
            htmlFor="year_of_construction"
            label="Date of site construction"
            errorMsg={
              detValidation.year_of_construction &&
              getErrorMessage(detValidation.year_of_construction, 'Date of site construction')
            }
          >
            <Input
              type="text"
              id="year_of_construction"
              name="year_of_construction"
              placeholder="e.g. Enter the year"
              value={detailsForm.year_of_construction}
              onChange={updateDetailsForm}
              hasError={!!detValidation.year_of_construction}
            />
          </Field>
        </div>
        <div className="mb-8">
          <Field
            htmlFor="construction_materials"
            label="Construction materials"
            errorMsg={
              detValidation.construction_materials &&
              getErrorMessage(detValidation.construction_materials, 'Construction materials')
            }
          >
            <Input
              type="text"
              id="construction_materials"
              name="construction_materials"
              placeholder="e.g. concrete, drywall, structural steel"
              value={detailsForm.construction_materials}
              onChange={updateDetailsForm}
            />
          </Field>
        </div>
        <div>
          <Field
            htmlFor="keywords"
            label="Key words"
            errorMsg={detValidation.keywords && getErrorMessage(detValidation.keywords, 'Keywords')}
          >
            <Input
              type="text"
              id="keywords"
              name="keywords"
              placeholder="e.g. mid-size, CA, small business"
              value={detailsForm.keywords}
              onChange={updateDetailsForm}
            />
          </Field>
        </div>
        <div className="flex gap-4 pt-12">
          <Button
            variant="secondary"
            label="Cancel"
            size="medium"
            onClick={collapseAccordion}
            className="min-w-[140px]"
          />
          <Button variant="primary" label="Save" size="medium" onClick={handleSaveDetails} className="min-w-[140px]" />
        </div>
      </Accordion>
    );
  };

  const handleUploadFile = async (fileInfo: { assetName: string; file: File }) => {
    try {
      let siteFile: File;
      try {
        console.log('Trying to rename file...', {
          file: fileInfo.file,
          newName: `${siteMeta.siteId}_${fileInfo.file.name}`,
        });

        siteFile = new File([fileInfo.file], `${siteMeta.siteId}_${fileInfo.file.name}`, {
          type: fileInfo.file.type,
          lastModified: fileInfo.file.lastModified,
        });

        console.log('Successfully renamed file: ', { siteFile });
      } catch (err) {
        console.error('Error converting file: ', { err });
        throw err;
      }

      let uploadResult: any;
      try {
        console.log('Trying to upload file!: ', { uploadResult });
        uploadResult = await s3API.siteFile.uploadFile(siteFile);
        console.log('Uploaded file!: ', { uploadResult });
      } catch (err) {
        console.error('Error uploading file: ', { err });
        throw err;
      }

      console.log('UPLOAD RESULT: ', { uploadResult });

      // TODO: Fix this - this feel bad
      const updatedList = [
        ...descriptionForm.files,
        {
          ...fileInfo,
          url: '',
          s3FilePath: uploadResult.s3FilePath,
        },
      ];

      setDescriptionForm({
        ...descriptionForm,
        files: updatedList,
      });

      setSavedDescription({
        ...savedDescription,
        files: updatedList,
      });
    } catch (err) {
      throw new Error('File upload failed, please try again.');
    }
  };

  const handleDeleteFile = async (fileInfo: { assetName: string; file: File }) => {
    try {
      const deleteResult = await s3API.siteFile.deleteFile(fileInfo.file);
      console.log(`Delete Result: `, { deleteResult });
    } catch (err) {
      throw new Error('File upload failed, please try again.');
    }

    // Update file list to remove specified file
    // TODO Fix this - this feels bad
    const filteredList = savedDescription.files.filter((currFile) => {
      return currFile.file !== fileInfo.file;
    });

    setDescriptionForm({
      ...descriptionForm,
      files: filteredList,
    });

    setSavedDescription({
      ...descriptionForm,
      files: filteredList,
    });
  };

  const renderDescriptionAccordion = () => {
    const { description: descStatus } = formStatus;
    let editText = 'ADD DESCRIPTION';
    if (descStatus === FORM_STATUS.INCOMPLETE) {
      editText = 'COMPLETE DESCRIPTION';
    } else if (descStatus === FORM_STATUS.COMPLETE) {
      editText = 'EDIT DESCRIPTION';
    }

    return (
      <Accordion
        icon={getStatusIcon(descStatus)}
        heading="Site description"
        subheading="Upload site assets"
        buttonText={editText}
        expanded={expandedId === 'site-desc'}
        onExpand={() => expandAccordion('site-desc')}
        onChange={() => {
          /* do nothing */
        }}
      >
        <div className="mb-8">
          <Field label="Site description" htmlFor="description">
            <Input
              type="text"
              id="description"
              maxLength={1000}
              name="description"
              placeholder="e.g. Primary floor of open plan office of 4000 sq. feet, offices around the perimeter and desks in the middle"
              value={descriptionForm.description}
              onChange={updateDescriptionForm}
            />
          </Field>
          <div className="text-alert-error">
            {descValidation.description && getErrorMessage(descValidation.description, 'Description')}
          </div>
        </div>
        <Field label="Upload assets" htmlFor="filedropper">
          <>
            <div className="mb-6 text-[.875rem] font-medium text-[#475467]">
              Details about the site will enable the best installation experience. Support your description by adding
              media, e.g., images, floor plans, or other diagrams.
            </div>

            <FileDropper
              fileList={descriptionForm.files}
              prompt="Add image to site description"
              onSaveFile={handleUploadFile}
              onDeleteFile={handleDeleteFile}
              allowedTypes={['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'application/pdf']}
              allowedTypesPrompt="SVG, PNG, JPG, GIF or PDF"
              maxFilesize={50000000}
              showValidation
              filenamePrompt="Please provide a descriptive name for your image."
              showFilename
            />
          </>
        </Field>
        <div className="flex gap-4 pt-12">
          <Button
            variant="secondary"
            label="Cancel"
            size="medium"
            onClick={collapseAccordion}
            className="min-w-[140px]"
          />
          <Button
            variant="primary"
            label="Save"
            size="medium"
            onClick={handleSaveDescription}
            className="min-w-[140px]"
          />
        </div>
      </Accordion>
    );
  };

  const renderPrimaryActions = () => {
    if (expandedId) return <></>;

    const canSaveSite =
      siteMeta.name &&
      !siteNameError &&
      siteMeta.handle &&
      !siteHandleError &&
      formStatus.details === FORM_STATUS.COMPLETE &&
      formStatus.location === FORM_STATUS.COMPLETE &&
      formStatus.description === FORM_STATUS.COMPLETE;

    return (
      <div className="flex gap-4">
        <Button
          variant="secondary"
          size="medium"
          label="CANCEL"
          onClick={handleCancelNewSite}
          className="min-w-[140px]"
        />
        <Button
          variant="primary"
          size="medium"
          label={siteMeta.siteId ? 'SAVE' : 'SAVE NEW SITE'}
          disabled={!canSaveSite}
          onClick={handleSaveSite}
          className="min-w-[140px]"
        />
      </div>
    );
  };

  const renderConfirmModal = () => {
    return (
      <Modal
        onClose={() => {
          /* do nothing */
        }}
        open={modalMeta.open}
        showCloseButton={false}
      >
        <h1 className="mb-6 text-[1.5rem] font-semibold leading-[1.25] tracking-[-.0625rem]">Are you sure?</h1>
        <div>{modalMeta.prompt}</div>

        <div className="mt-12 flex items-center justify-center gap-3">
          <Button
            size="large"
            variant="secondary"
            className="min-w-[140px]"
            label={modalMeta.dismissText}
            onClick={modalMeta.onDismiss}
          />
          <Button
            variant="primary"
            size="large"
            className="min-w-[140px]"
            label={modalMeta.confirmText}
            onClick={modalMeta.onConfirm}
          />
        </div>
      </Modal>
    );
  };

  const pageTitle = siteMeta.siteId ? 'Edit site' : 'Create a site';

  return (
    <div className="mx-[2.5rem] max-w-[576px]">
      <ScrollVisibleElement scrollTitle={pageTitle}>
        <Heading heading={pageTitle} className="mb-8" />
      </ScrollVisibleElement>
      {!siteMeta.siteId && (
        <div className=" mb-8 mt-6 text-[1rem] leading-[1.25] tracking-[-0.01rem] text-black-soft">
          Sites allow you to create spaces and group devices within a specific location, campus, building, office, or
          floor of an organization. There may be many sites within an organization.
        </div>
      )}
      <div className="mb-8">
        <OpenInput
          id="site-name"
          name="site-name"
          label="Site name"
          placeholder="Type a site name"
          errorText={siteNameError}
          hasError={siteNameError !== ''}
          onChange={(evt) => setSiteMeta({ ...siteMeta, name: evt.target.value })}
          onConfirm={handleConfirmSiteName}
          value={siteMeta.name}
        />
      </div>
      <div className="mb-12">
        <OpenInput
          id="site-handle"
          name="site-handle"
          label="Unique site handle"
          placeholder="Type a site handle"
          errorText={siteHandleError}
          hasError={siteHandleError !== ''}
          onChange={(evt) => setSiteMeta({ ...siteMeta, handle: evt.target.value })}
          onConfirm={handleConfirmSiteHandle}
          value={siteMeta.handle}
        />
      </div>
      {renderLocationAccordion()}
      <div className="h-8 w-full" />
      {renderDetailsAccordion()}
      <div className="h-8 w-full" />
      {renderDescriptionAccordion()}
      <div className="h-12" />
      {renderPrimaryActions()}
      {renderConfirmModal()}
    </div>
  );
};

export default ManageSite;
