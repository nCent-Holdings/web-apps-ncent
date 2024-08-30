/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Field, Input, Modal, Radio, RadioGroup } from '@ncent-holdings/ux-components';
import SpaceLocation from '../SpaceLocation';
import { useSelector } from 'react-redux';
import { twMerge } from 'tailwind-merge';
import * as spaceCoreAPI from '../../actions/spaces';
import useIdleTracker from '../../hooks/useIdleTracker';
import clsx from 'clsx';
import { parseImperialLength, advTitleCase } from '@src/utils';
import SensorMapping from './SensorMapping';
import RoomSelector, { Option } from '@src/routes/client/site-design/spaces/RoomSelector';
import SpaceSensorMapping from '@src/routes/client/site-design/spaces/SpaceSensorMapping';
import siteDesignSelectors from '@src/features/site-design/siteDesign.selectors';
import { SpaceModel } from '@src/api-types/models';
import CollapseSectionHeader from '../CollapseSection/CollapseSectionHeader';
import { type CreateOrUpdateSpaceDto } from '@src/api/CoreAPI/types';

// 3 seconds
const INPUT_SAVE_DELAY = 3;
// 1 second
const SAVE_NOTIFICATION_DELAY = 1000;

export const SpacePanel = ({ selectedSpace }: { selectedSpace: SpaceModel }) => {
  const hasExternalSensorsMapped = useSelector(siteDesignSelectors.selectHasExternalSensorsMapped(selectedSpace.id));

  const { idleSeconds, startIdleTracker, stopIdleTracker } = useIdleTracker();

  const spaceInfo = selectedSpace?.['wellcube/space'];
  const sensorMapping = selectedSpace?.['wellcube/sensor_mapping'];
  const siteId = spaceInfo?.site_id || '';
  const spaceLayout = spaceInfo?.details?.layout || '';
  const parentSpaceId = spaceInfo?.parent_space_id || '';
  const spaceType = spaceInfo?.details?.type || '';

  const [showProfile, setShowProfile] = useState(true);
  const handleToggleProfile = () => {
    setShowProfile((show) => !show);
  };

  const [saveStatus, setSaveStatus] = useState('idle');
  const [pendingSave, setPendingSave] = useState(false);
  const [showCustomSensorModal, setShowCustomSensorModal] = useState(false);
  const [isCustomSensorConfirmed, setIsCustomSensorConfirmed] = useState(false);
  const [tempLayoutVal, setTempLayoutVal] = useState('open');

  useEffect(() => {
    if (selectedSpace) {
      setSpaceName(selectedSpace.name);
      setRoomType(spaceInfo?.details?.room_type);
      setCeilingHeight(spaceInfo?.details?.ceiling_height || '');
      setSquareFootage(spaceInfo?.details?.square_footage?.toLowerCase());
      setOperableWindows(spaceInfo?.details?.operable_windows?.toLowerCase() || '');
      setLayout(spaceInfo?.details?.layout?.toLowerCase() || '');
      setVents(spaceInfo?.details?.vents?.toLowerCase() || '');
      setMaxOccupancy(spaceInfo?.details?.max_occupancy?.toString() || '');
    }
  }, [selectedSpace.id]);

  useEffect(() => {
    startIdleTracker();

    return () => {
      stopIdleTracker();
      setIsCustomSensorConfirmed(false);
    };
  }, []);

  useEffect(() => {
    if (isCustomSensorConfirmed) {
      setLayout(tempLayoutVal);
      setPendingSave(true);
    }
  }, [isCustomSensorConfirmed, tempLayoutVal]);

  useEffect(() => {
    if (!pendingSave) {
      return;
    }

    if (idleSeconds >= INPUT_SAVE_DELAY) {
      if (saveStatus !== 'idle') {
        console.warn(`Cannot save - save status is '${saveStatus}'`);
        return;
      } else {
        console.log('SAVING SPACE');
        handleSaveSpace();
      }
    } else {
      console.log('Idle seconds: ', { idleSeconds });
      return;
    }
  }, [idleSeconds]);

  const handleSaveSpace = async () => {
    if (!selectedSpace) {
      return;
    }

    if (
      invalidSpaceName !== '' ||
      invalidSquareFootage !== '' ||
      invalidCeilingHeight !== '' ||
      invalidMaxOccupancy !== ''
    ) {
      console.warn(`Cannot save - there is an active field error`);
      return;
    }

    setSaveStatus('saving');
    // await save
    const spaceData: Partial<CreateOrUpdateSpaceDto> = {
      name: spaceName.trim(),
      site_id: selectedSpace['wellcube/space']?.site_id || '',
      parent_space_id: selectedSpace['wellcube/space']?.parent_space_id || '',
      type: spaceType,
      room_type: roomType,
      square_footage: squareFootage,
      ceiling_height: parsedCeilingHeight,
      layout,
      operable_windows: operableWindows,
      vents,
      max_occupancy: maxOccupancy === '' ? undefined : Number(maxOccupancy),
    };

    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
    setSaveStatus('saved');
    setPendingSave(false);
    setTimeout(() => {
      setSaveStatus('idle');
    }, SAVE_NOTIFICATION_DELAY);

    try {
      await spaceCoreAPI.updateSpace(selectedSpace.id, spaceData);
      setSaveStatus('saved');
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setPendingSave(false);
      setTimeout(() => {
        setSaveStatus('idle');
      }, SAVE_NOTIFICATION_DELAY);
    }
  };

  const [spaceName, setSpaceName] = useState(selectedSpace.name);
  const [invalidSpaceName, setInvalidSpaceName] = useState('');

  const handleChangeSpaceName: React.FormEventHandler = async (evt) => {
    const { value: updVal } = evt.target as HTMLInputElement;
    setSpaceName(updVal);

    if (updVal.length > 60) {
      setInvalidSpaceName('Space names should be 60 characters or less');
      setPendingSave(false);
      return;
    }

    const sameName = updVal === selectedSpace.name;

    const validationResult = await spaceCoreAPI.validateSpaceName(parentSpaceId || siteId, updVal.trim());
    const validName = updVal?.length > 0 && validationResult.isValid;

    if (sameName) {
      setInvalidSpaceName('');
    } else if (!validName) {
      setInvalidSpaceName(validationResult.errorText ?? 'Space names must be unique at the same space level');
    } else if (validName && invalidSpaceName) {
      setInvalidSpaceName('');
    }

    if (sameName) {
      setPendingSave(false);
    } else if (validName && !pendingSave && saveStatus !== 'saving') {
      setPendingSave(true);
      // if the name is not valid, clear the pending save flag
    } else if (!validName) {
      setPendingSave(false);
    }
  };

  const handleBlurSpaceName = async () => {
    // If the value hasn't been changed, don't waste any time and just short-circuit
    if (spaceName === selectedSpace.name) {
      return;
    }

    if (spaceName.length > 60) {
      setInvalidSpaceName('Space names should be 60 characters or less');
      return;
    }

    const validationResult = await spaceCoreAPI.validateSpaceName(parentSpaceId || siteId, spaceName.trim());
    const validName = spaceName?.length > 0 && validationResult.isValid;

    if (!validName) {
      setInvalidSpaceName(validationResult.errorText ?? invalidSpaceName ?? 'Space name is not valid');
      return; // Short-circuit, we don't want to save if the name is invalid
    } else if (validName && invalidSpaceName) {
      setInvalidSpaceName('');
    }

    console.log('SAVE SPACE ONBLUR');
    // If the name is valid and there isn't a pending save, trigger a save
    if (validName && saveStatus !== 'saving') {
      handleSaveSpace();
    }
  };

  const [roomType, setRoomType] = useState(spaceInfo?.details?.room_type);

  const handleRoomType = (options: Option[]) => {
    const room_type = options[0]?.value;

    if (room_type) {
      setRoomType(room_type);

      setPendingSave(true);
      startIdleTracker();
    }
  };

  const handleBlur = (fieldValue: any, checkValue: any) => {
    // If the value hasn't been changed, don't waste any time and just short-circuit
    if (fieldValue === checkValue) {
      return;
    }

    // do not save space if square footage has been set to an invalid value
    if (!Number.isInteger(Number(squareFootage))) {
      setInvalidSquareFootage('Square footage must be an integer');
      return;
    }

    if (Number(squareFootage) === 0) {
      setInvalidSquareFootage('Square footage must be non-zero');
      return;
    } else {
      setInvalidSquareFootage('');
    }

    // do not save space if ceiling height has been set to an invalid value
    const parsedHeight = parseImperialLength(ceilingHeight);

    if (parsedHeight === null) {
      setInvalidCeilingHeight('Invalid ceiling height');
      setParsedCeilingHeight('');
      return;
    } else if (parsedHeight < 6) {
      setInvalidCeilingHeight('Ceiling height must be at least 6 feet');
      setParsedCeilingHeight('');
      return;
    } else {
      setInvalidCeilingHeight('');
      setParsedCeilingHeight(parsedHeight.toString());
    }

    handleSaveSpace();
  };

  const [squareFootage, setSquareFootage] = useState(spaceInfo?.details?.square_footage);
  const [invalidSquareFootage, setInvalidSquareFootage] = useState('');
  const handleChangeSquareFootage = (evt: React.FormEvent<HTMLInputElement>) => {
    const { value: updVal } = evt.target as HTMLInputElement;

    setSquareFootage(updVal);

    const numberValue = Number(updVal);
    if (!Number.isInteger(numberValue)) {
      setInvalidSquareFootage('Square footage must be an integer');
      return;
    }

    if (numberValue === 0) {
      setInvalidSquareFootage('Square footage must be non-zero');
      return;
    }

    // if the number passes the validation, reset invalidSquareFootage
    setInvalidSquareFootage('');

    setPendingSave(true);
    startIdleTracker();
  };

  const [ceilingHeight, setCeilingHeight] = useState(spaceInfo?.details?.ceiling_height || '');
  const [parsedCeilingHeight, setParsedCeilingHeight] = useState(spaceInfo?.details?.ceiling_height);
  const [invalidCeilingHeight, setInvalidCeilingHeight] = useState('');
  const handleChangeCeilingHeight: React.FormEventHandler = (evt) => {
    const { value: updVal } = evt.target as HTMLInputElement;

    setCeilingHeight(updVal);

    const parsedHeight = parseImperialLength(updVal);

    if (parsedHeight === null) {
      setInvalidCeilingHeight('Invalid ceiling height');
    } else if (parsedHeight < 6) {
      setInvalidCeilingHeight('Ceiling height must be at least 6 feet');
    } else {
      setInvalidCeilingHeight('');
      setParsedCeilingHeight(parsedHeight.toString());

      setPendingSave(true);
      startIdleTracker();
    }
  };

  const [maxOccupancy, setMaxOccupancy] = useState(spaceInfo?.details?.max_occupancy?.toString() || '');
  const [invalidMaxOccupancy, setInvalidMaxOccupancy] = useState('');
  const handleChangeMaxOccupancy: React.FormEventHandler = (evt) => {
    const { value: updVal } = evt.target as HTMLInputElement;

    setMaxOccupancy(updVal);

    if (!updVal) {
      setInvalidMaxOccupancy('');
      return;
    }

    const numberValue = Number(updVal);

    if (!Number.isInteger(numberValue)) {
      setInvalidMaxOccupancy('Must be a Number');
      return;
    }

    setInvalidMaxOccupancy('');

    setPendingSave(true);
    startIdleTracker();
  };

  const handleMaxOccupancyBlur = () => {
    const max_occupancy = spaceInfo?.details?.max_occupancy;
    if (invalidMaxOccupancy || (!max_occupancy && !maxOccupancy) || maxOccupancy === max_occupancy?.toString()) return;

    handleSaveSpace();
  };

  const handleConfirmCustomSensor = () => {
    setIsCustomSensorConfirmed(true);
    setShowCustomSensorModal(false);
  };

  const [layout, setLayout] = useState(spaceInfo?.details?.layout || '');
  const handleChangeLayout = async (updVal: any) => {
    if (hasExternalSensorsMapped && layout === 'open' && updVal === 'enclosed') {
      setShowCustomSensorModal(true);
      setTempLayoutVal(updVal);
      return;
    }

    setPendingSave(true);
    setLayout(updVal);
  };

  const [operableWindows, setOperableWindows] = useState(spaceInfo?.details?.operable_windows || '');
  const handleChangeWindows = async (updVal: any) => {
    console.log('UPD WINDOWS: ', { updVal });

    setPendingSave(true);
    setOperableWindows(updVal);
  };

  const [vents, setVents] = useState(spaceInfo?.details?.vents || '');
  const handleChangeVents = async (updVal: any) => {
    console.log('UPD VENTS: ', { updVal });

    setPendingSave(true);
    setVents(updVal);
  };

  useEffect(() => {
    if (pendingSave) {
      handleSaveSpace();
    }
  }, [layout, operableWindows, vents]);

  const handleKeyDown = async (evt: React.KeyboardEvent<HTMLInputElement>, handlerFn: () => void) => {
    if (evt.key === 'Enter') {
      handlerFn();
    }
  };

  return (
    <div className="isolate flex flex-1 flex-col bg-white-light">
      <div className="sticky top-0 z-[1] min-h-[var(--titleonscroll-height)] bg-white px-5 py-3 shadow-[0_1px_0_#D4DFE9]">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-blue-suede">{advTitleCase(spaceType)}</div>
          <div
            className={clsx(
              'rounded px-2 py-1 text-mini transition-all',
              saveStatus === 'idle' && 'opacity-0 transition-none',
              saveStatus === 'saving' && 'bg-[#D1E9FF] text-blue-brilliant',
              saveStatus === 'saved' && 'bg-green-success-50 text-green-success',
            )}
          >
            {advTitleCase(saveStatus)}
          </div>
        </div>
        <div className="line-clamp-2 text-h4 font-semibold">{selectedSpace?.name}</div>
        {spaceInfo?.setup?.status === 'incomplete' && (
          <>
            <div className="h-2" />
            <div className="w-fit rounded-sm bg-yellow-incomplete/[0.29] px-2 py-1 text-[0.625rem] text-yellow-dark">
              Incomplete
            </div>
            <div className="h-2" />
            <div className="text-sm font-[500] text-grey-500">
              You must provide the required information highlighted below, before this space will appear in the
              Installation App.
            </div>
          </>
        )}
      </div>

      <CollapseSectionHeader header="Profile" handleToggleProfile={handleToggleProfile} showProfile={showProfile} />

      <div className={twMerge(!showProfile && 'hidden')}>
        <div className="flex flex-col justify-between border-b border-b-[#D4DFEA] bg-[#F9FCFF] px-5 py-2">
          <div className="text-[12px] font-medium text-blue-suede">LOCATION</div>
          <div className="h-1" />
          <div className="text-sm font-semibold text-grey-500">
            <SpaceLocation location={selectedSpace?.['wellcube/location']} />
          </div>
        </div>
        <div className="flex flex-col gap-y-6 px-5 [&>*:first-child]:mt-6 [&>*:last-child]:mb-6">
          <Field htmlFor="spaceName" label="Space name" errorMsg={invalidSpaceName}>
            <Input
              id="spaceName"
              type="text"
              placeholder="Enter unique name"
              value={spaceName}
              name="spaceName"
              onChange={handleChangeSpaceName}
              onKeyDown={(evt) => handleKeyDown(evt, () => handleBlurSpaceName())}
              onBlur={handleBlurSpaceName}
              hasError={invalidSpaceName !== ''}
            />
          </Field>
          {spaceType === 'room' && (
            <RoomSelector value={roomType} handleSelection={handleRoomType} placeholderClass="text-[14px]" />
          )}

          {!!spaceType && spaceType !== 'building' && (
            <>
              <Field htmlFor="squareFootage" label="Square footage" errorMsg={invalidSquareFootage}>
                <Input
                  id="squareFootage"
                  type="text"
                  placeholder="000 sq ft"
                  value={squareFootage}
                  name="squareFootage"
                  onChange={handleChangeSquareFootage}
                  onKeyDown={(evt) =>
                    handleKeyDown(evt, () => handleBlur(squareFootage, spaceInfo?.details?.square_footage))
                  }
                  onBlur={() => handleBlur(squareFootage, spaceInfo?.details?.square_footage)}
                  hasIssue={!squareFootage || squareFootage === '0'}
                  hasError={invalidSquareFootage !== ''}
                />
              </Field>
              <Field htmlFor="ceilingHeight" label="Ceiling height" errorMsg={invalidCeilingHeight}>
                <Input
                  id="ceilingHeight"
                  type="text"
                  placeholder={'00\' 00"'}
                  value={ceilingHeight}
                  name="ceilingHeight"
                  onChange={handleChangeCeilingHeight}
                  onKeyDown={(evt) =>
                    handleKeyDown(evt, () => handleBlur(ceilingHeight, spaceInfo?.details?.ceiling_height))
                  }
                  onBlur={() => handleBlur(ceilingHeight, spaceInfo?.details?.ceiling_height)}
                  hasIssue={!ceilingHeight || ceilingHeight === '0'}
                  hasError={invalidCeilingHeight !== ''}
                />
              </Field>
            </>
          )}
          {spaceType !== 'building' && spaceType !== 'floor' && (
            <>
              <Field htmlFor="maxOccupancy" label="Max occupancy (optional)" errorMsg={invalidMaxOccupancy}>
                <Input
                  id="maxOccupancy"
                  type="text"
                  placeholder={'Enter maximum'}
                  value={maxOccupancy}
                  name="maxOccupancy"
                  onChange={handleChangeMaxOccupancy}
                  onKeyDown={(evt) => handleKeyDown(evt, () => handleMaxOccupancyBlur())}
                  onBlur={handleMaxOccupancyBlur}
                  hasError={invalidMaxOccupancy !== ''}
                />
              </Field>

              <div
                className={twMerge(
                  !(layout?.length > 0) && 'w-full rounded-lg border border-[#FFA800] bg-[#FFFBF2] px-5 py-4 pr-0',
                )}
              >
                <Field htmlFor="layout" label="Layout">
                  <RadioGroup
                    direction="vertical"
                    name="layout-radio"
                    value={layout}
                    onChange={handleChangeLayout}
                    className="gap-0"
                  >
                    <Radio
                      id="layout-open"
                      value="open"
                      label="Open"
                      labelClass=" text-[.875rem] font-[400] text-[#475467] leading-[1.5] font-spezia"
                    />
                    <Radio
                      id="layout-enclosed"
                      value="enclosed"
                      label="Enclosed"
                      labelClass=" text-[.875rem] font-[400] text-[#475467] leading-[1.5] font-spezia"
                    />
                  </RadioGroup>
                </Field>
              </div>

              <Field htmlFor="operableWindows" label="Operable windows (optional)">
                <RadioGroup
                  direction="vertical"
                  name="operableWindows-radio"
                  value={operableWindows}
                  onChange={handleChangeWindows}
                  className="gap-0"
                >
                  <Radio
                    id="windows-yes"
                    value="yes"
                    label="Yes"
                    labelClass=" text-[.875rem] font-[400] text-[#475467] leading-[1.5] font-spezia"
                  />
                  <Radio
                    id="windows-no"
                    value="no"
                    label="No"
                    labelClass=" text-[.875rem] font-[400] text-[#475467] leading-[1.5] font-spezia"
                  />
                </RadioGroup>
              </Field>

              <Field htmlFor="vents" label="HVAC vents (optional)">
                <RadioGroup
                  direction="vertical"
                  name="vents-radio"
                  value={vents}
                  onChange={handleChangeVents}
                  className="gap-0"
                >
                  <Radio
                    id="vents-yes"
                    value="yes"
                    label="Yes"
                    labelClass=" text-[.875rem] font-[400] text-[#475467] leading-[1.5] font-spezia"
                  />
                  <Radio
                    id="vents-no"
                    value="no"
                    label="No"
                    labelClass=" text-[.875rem] font-[400] text-[#475467] leading-[1.5] font-spezia"
                  />
                </RadioGroup>
              </Field>
            </>
          )}
        </div>
      </div>
      {sensorMapping && (
        <SensorMapping sensorMapping={sensorMapping} spaceId={selectedSpace.id} spaceLayout={spaceLayout} />
      )}
      {showCustomSensorModal && (
        <Modal onClose={() => setShowCustomSensorModal(false)} open={showCustomSensorModal} showCloseButton={true}>
          <SpaceSensorMapping
            handleOnCancel={() => setShowCustomSensorModal(false)}
            handleOnConfirm={handleConfirmCustomSensor}
          />
        </Modal>
      )}
    </div>
  );
};

export default SpacePanel;
