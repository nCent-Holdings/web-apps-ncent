import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Modal, RadioGroup, Radio, Divider, Field, Input, Heading, Button } from '@ncent-holdings/ux-components';
import * as spaceCoreAPI from '../../../../../actions/spaces';
import { twMerge } from 'tailwind-merge';
import { parseImperialLength } from '@src/utils';
import RoomSelector from '../RoomSelector';
import siteDesignSelectors from '@src/features/site-design/siteDesign.selectors';
import { useSiteFromHandleOrLastStored } from '@src/features/useSiteFromHandleOrLastStored';
import clsx from 'clsx';
import { type CreateOrUpdateSpaceDto } from '@src/api/CoreAPI/types';

export interface AddSpaceProps {
  open: boolean;
  onCancel: () => void;
  onSave: (spaceId: string) => void;
  maxDepth?: number;
  parentSpaceId?: string; // if null, will create a top level space
  editId?: string;
}

const AddSpace: React.FC<AddSpaceProps> = ({ open, onCancel, onSave, maxDepth = 5, parentSpaceId = '', editId }) => {
  const [spaceType, setSpaceType] = useState('');
  const [spaceName, setSpaceName] = useState('');
  const [squareFootage, setSquareFootage] = useState('');
  const [ceilingHeight, setCeilingHeight] = useState('');
  const [parsedCeilingHeight, setParsedCeilingHeight] = useState('');
  const [roomType, setRoomType] = useState('');
  const [layout, setLayout] = useState('');
  const [operableWindows, setOperableWindows] = useState('');
  const [vents, setVents] = useState('');
  const [maxOccupancy, setMaxOccupancy] = useState('');
  const [loading, setLoading] = useState(false);
  const [invalidSpaceName, setInvalidSpaceName] = useState('');
  const [invalidSquareFootage, setInvalidSquareFootage] = useState('');
  const [invalidCeilingHeight, setInvalidCeilingHeight] = useState('');
  const [invalidMaxOccupancy, setInvalidMaxOccupancy] = useState('');
  const [creatingSpace, setCreatingSpace] = useState(false);

  const endOfFormRef = useRef<HTMLDivElement | null>(null);

  const { site: parentSite } = useSiteFromHandleOrLastStored();
  const parentSpace = useSelector(siteDesignSelectors.selectSpace(parentSpaceId));
  const parentName = parentSpace ? parentSpace?.name : parentSite?.name || '';
  const parentDetails = parentSpace && parentSpace['wellcube/space']?.details;
  const parentDepth = parentSpace ? parentSpace['wellcube/space']?.depth : 0;
  const parentType = parentDetails ? parentDetails.type : 'site';

  const siteId = parentSite?.id || '';
  const isOnlyRoomOption = parentType === 'floor' || parentType === 'room';

  useEffect(() => {
    if (isOnlyRoomOption && parentSpaceId && open) {
      setSpaceType('room');
    }
  }, [isOnlyRoomOption, parentSpaceId, open]);

  useEffect(() => {
    if (invalidMaxOccupancy) {
      endOfFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    return () => {
      endOfFormRef.current = null;
    };
  }, [invalidMaxOccupancy]);

  useEffect(() => {
    if (isOnlyRoomOption && spaceType == 'room') {
      setCeilingHeight(parentDetails?.ceiling_height || '');
      setParsedCeilingHeight(parentDetails?.ceiling_height || '');
    }
  }, [spaceType]);

  useEffect(() => {
    if (spaceType == 'room') {
      setRoomType(roomType);
    }
  }, [loading]);

  const loadValues = async (id: string) => {
    setLoading(true);

    const loadedSpace = await spaceCoreAPI.getSpaceById(id);

    const wcSpaceName = loadedSpace.name;
    const details = loadedSpace['wellcube/space']?.details;

    if (details) {
      setSpaceType(details.type);
      setRoomType(details.room_type);
      setSpaceName(wcSpaceName);
      setSquareFootage(details.square_footage);
      setCeilingHeight(details.ceiling_height);
      setParsedCeilingHeight(details.ceiling_height);
      setLayout(details.layout?.toLowerCase());
      setOperableWindows(details.operable_windows?.toLowerCase());
      setVents(details.vents?.toLowerCase());
      setMaxOccupancy(details.max_occupancy?.toString() || '');
    }

    setLoading(false);
  };

  useEffect(() => {
    if (editId && editId !== '') {
      loadValues(editId);
    }
  }, [editId]);

  const handleCancel = async () => {
    if (editId && editId !== '') {
      resetValidationErrors();
      loadValues(editId);
    } else {
      resetForm();
    }

    onCancel();
  };

  const handleSave = async () => {
    // save
    let spaceId = editId && editId !== '' ? editId : '';

    const spaceData: CreateOrUpdateSpaceDto = {
      name: spaceName,
      site_id: siteId,
      parent_space_id: parentSpace ? parentSpace.id : '',
      type: spaceType,
      room_type: roomType,
      square_footage: squareFootage,
      ceiling_height: parsedCeilingHeight,
      layout,
      operable_windows: operableWindows,
      vents,
      max_occupancy: maxOccupancy === '' ? 0 : Number(maxOccupancy),
    };

    if (spaceId) {
      // update existing space
      try {
        await spaceCoreAPI.updateSpace(spaceId, spaceData);
      } catch (err) {
        console.log('Update space error: ', err);
      }
    } else {
      setCreatingSpace(true);

      // create new space
      try {
        const createdSpace = await spaceCoreAPI.createSpace(spaceData);

        spaceId = createdSpace.id;
      } catch (err) {
        console.log('Create space error: ', err);
      } finally {
        setCreatingSpace(false);
      }

      resetForm();
    }

    onSave(spaceId);
  };

  const checkSpaceName = async (newSpaceName: string) => {
    if (editId && editId !== '' && newSpaceName === '') {
      setInvalidSpaceName('Spaces require a name');
    }

    if (!newSpaceName) return;

    if (newSpaceName.length > 60) {
      setInvalidSpaceName('Space names should be 60 characters or less');
      return;
    }

    const validationResult = await spaceCoreAPI.validateSpaceName(parentSpace?.id || siteId, newSpaceName);

    if (!validationResult.isValid && invalidSpaceName === '') {
      // name is invalid
      setInvalidSpaceName('Space names must be unique at the same space level');
    } else if (validationResult.isValid && invalidSpaceName !== '') {
      // name is good
      setInvalidSpaceName('');
    }
  };

  const handleSpaceType = (newSpaceType: string) => {
    console.log(newSpaceType);

    setSpaceType(newSpaceType);
  };

  const handleSpaceName: React.FormEventHandler = (evt: React.FormEvent<HTMLInputElement>) => {
    const { value } = evt.target as HTMLInputElement;

    setSpaceName(value);

    checkSpaceName(value);
  };

  const handleSquareFootage: React.FormEventHandler = (evt: React.FormEvent<HTMLInputElement>) => {
    const { value } = evt.target as HTMLInputElement;

    setSquareFootage(value);

    if (!value) {
      setInvalidSquareFootage('');
      return;
    }

    const numberValue = Number(value);
    if (!Number.isInteger(numberValue)) {
      setInvalidSquareFootage('Square footage must be an integer');
      return;
    }

    if (numberValue === 0) {
      setInvalidSquareFootage('Square footage must be non-zero');
      return;
    }

    // if the number passes the validation, reset invalidSquareFootage and set the state
    setInvalidSquareFootage('');
  };

  const handleCeilingHeight: React.FormEventHandler = (evt: React.FormEvent<HTMLInputElement>) => {
    const { value } = evt.target as HTMLInputElement;

    setCeilingHeight(value);

    if (!value) return;

    const parsedHeight = parseImperialLength(value);

    console.log(`Got ceiling height of ${value} (${parsedHeight} feet)`);

    if (parsedHeight === null) {
      setInvalidCeilingHeight('Invalid ceiling height');
      setParsedCeilingHeight('');
    } else if (parsedHeight < 6) {
      setInvalidCeilingHeight('Ceiling height must be at least 6 feet');
      setParsedCeilingHeight('');
    } else {
      setInvalidCeilingHeight('');
      setParsedCeilingHeight(parsedHeight.toString());
    }
  };

  const handleChangeMaxOccupancy: React.FormEventHandler = (evt) => {
    const { value } = evt.target as HTMLInputElement;

    setMaxOccupancy(value);

    if (!value) {
      setInvalidMaxOccupancy('');
      return;
    }

    const numberValue = Number(value);

    if (!Number.isInteger(numberValue)) {
      setInvalidMaxOccupancy('Must be a Number');
      return;
    }

    setInvalidMaxOccupancy('');
  };

  if (loading) {
    return <></>;
  }

  const resetValidationErrors = () => {
    setInvalidSpaceName('');
    setInvalidSquareFootage('');
    setInvalidCeilingHeight('');
    setInvalidMaxOccupancy('');
  };

  const resetForm = () => {
    setSpaceType('');
    setRoomType('');
    setSpaceName('');
    setSquareFootage('');
    setCeilingHeight('');
    setParsedCeilingHeight('');
    setLayout('');
    setOperableWindows('');
    setVents('');
    setMaxOccupancy('');
    resetValidationErrors();
  };

  const saveText = creatingSpace ? 'SAVING...' : 'SAVE';
  const disallowSave =
    creatingSpace ||
    spaceType == '' ||
    spaceName == '' ||
    invalidMaxOccupancy !== '' ||
    invalidSpaceName !== '' ||
    invalidSquareFootage !== '' ||
    invalidCeilingHeight !== '';

  const renderAddSpaceContent = () => (
    <div>
      <Heading heading={editId ? 'Complete space' : isOnlyRoomOption ? 'Add a Room ' : 'Add a space'} />

      <div className="pr-2">
        <p className="mb-[2rem] mt-[2rem] text-[1.25rem] leading-[1.25] tracking-[-0.0625rem] text-[#475467]">
          This will be created in <span className="font-semibold">{parentName}</span>
        </p>

        <div className="mb-[2rem] text-[1.25rem] font-semibold leading-[1.25] tracking-[-0.0625rem] text-[#475467]">
          {!isOnlyRoomOption && (
            <RadioGroup
              direction="horizontal"
              name={`space-type-${parentSpace?.id || siteId}-${editId && editId !== '' ? editId : 'add'}`}
              value={spaceType}
              onChange={handleSpaceType}
            >
              {parentType === 'site' && <Radio id="building" value="building" label="Building" />}
              <Radio id="floor" value="floor" label="Floor" />
              <Radio id="room" value="room" label="Room" />
            </RadioGroup>
          )}
        </div>

        <Divider />

        <div className="relative flex">
          <div
            className={clsx(
              'flex flex-col gap-y-8 [&>*:first-child]:mt-10',
              spaceType === 'room' ? 'w-[49%]' : 'w-full',
            )}
          >
            {spaceType == 'room' && (
              <RoomSelector
                id="modalRoomSelector"
                value={roomType}
                handleSelection={(options) => setRoomType(options[0]?.value)}
              />
            )}

            {spaceType !== '' ? (
              <Field htmlFor="spaceName" label="Space name" errorMsg={invalidSpaceName}>
                <Input
                  id="spaceName"
                  type="text"
                  placeholder="Enter unique name"
                  value={spaceName}
                  name="spaceName"
                  onChange={handleSpaceName}
                  hasError={invalidSpaceName !== ''}
                />
              </Field>
            ) : (
              <></>
            )}

            {spaceType === 'floor' || spaceType === 'room' ? (
              <>
                <div className="flex w-full space-x-4">
                  <Field
                    htmlFor="squareFootage"
                    label="Square footage"
                    fieldClass="w-1/2 pr-6"
                    errorMsg={invalidSquareFootage}
                  >
                    <Input
                      id="squareFootage"
                      type="text"
                      placeholder="000 sq ft"
                      value={squareFootage}
                      name="squareFootage"
                      onChange={handleSquareFootage}
                      hasError={invalidSquareFootage !== ''}
                      hasIssue={squareFootage === '' && Boolean(editId && editId !== '')}
                    />
                  </Field>
                  <Field
                    htmlFor="ceilingHeight"
                    label="Ceiling height"
                    fieldClass="w-1/2"
                    errorMsg={invalidCeilingHeight}
                  >
                    <Input
                      id="ceilingHeight"
                      type="text"
                      placeholder={'00\' 00"'}
                      value={ceilingHeight}
                      name="ceilingHeight"
                      onChange={handleCeilingHeight}
                      hasError={invalidCeilingHeight !== ''}
                      hasIssue={ceilingHeight === '' && Boolean(editId && editId !== '')}
                    />
                  </Field>
                </div>

                <div className="mt-4 gap-[12px] rounded-[16px] bg-[#DEEBF2] p-[20px]">
                  <span className="font-spezia text-sm font-medium italic leading-5 text-blue-suede">
                    Before commissioning, you must provide dimensions. If you don&apos;t have accurate measurements now,
                    you&apos;ll be able to complete this space later.
                  </span>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>

          {spaceType === 'room' && (
            <>
              <div
                className="absolute right-[45%] top-[30px] border-r border-[#C1DBEA]"
                style={{ height: spaceType === 'room' ? '75%' : '81%' }}
              />
              <div className="ml-[12%] mt-10 flex w-[39%] flex-col space-y-[30px]">
                {/* Right column */}
                <div
                  className={twMerge(
                    'block ',
                    (!layout || layout.length < 1) &&
                      Boolean(editId && editId !== '') &&
                      'w-full rounded-2xl bg-[#FFFBF2] py-[8px] pl-[8px] pr-0 shadow-com-input-issue -outline-offset-1 [border:1px_solid_#DEEBF6]',
                  )}
                >
                  <Field htmlFor="layout" label="Layout">
                    <RadioGroup
                      direction="vertical"
                      name={`layout-${parentSpace?.id || siteId}-${editId && editId !== '' ? editId : 'add'}`}
                      value={layout}
                      onChange={setLayout}
                      className="gap-0"
                    >
                      <Radio id="layout-open-as" value="open" label="Open" />
                      <Radio id="layout-enclosed-as" value="enclosed" label="Enclosed" />
                    </RadioGroup>
                  </Field>
                </div>

                <Field htmlFor="operableWindows" label="Operable windows (optional)">
                  <RadioGroup
                    direction="vertical"
                    name={`operableWindows-${parentSpace?.id || siteId}-${editId && editId !== '' ? editId : 'add'}`}
                    value={operableWindows}
                    onChange={setOperableWindows}
                    className="gap-0"
                  >
                    <Radio id="windows-yes-as" value="yes" label="Yes" />
                    <Radio id="windows-no-as" value="no" label="No" />
                  </RadioGroup>
                </Field>

                <Field htmlFor="vents" label="HVAC vents (optional)">
                  <RadioGroup
                    direction="vertical"
                    name={`vents-${parentSpace?.id || siteId}-${editId && editId !== '' ? editId : 'add'}`}
                    value={vents}
                    onChange={setVents}
                    className="gap-0"
                  >
                    <Radio id="vents-yes-as" value="yes" label="Yes" />
                    <Radio id="vents-no-as" value="no" label="No" />
                  </RadioGroup>
                </Field>

                <Field htmlFor="maxOccupancy" label="Max occupancy (optional)" errorMsg={invalidMaxOccupancy}>
                  <Input
                    id="maxOccupancy"
                    type="text"
                    placeholder={'Enter maximum'}
                    value={maxOccupancy}
                    name="maxOccupancy"
                    onChange={handleChangeMaxOccupancy}
                    hasError={invalidMaxOccupancy !== ''}
                  />
                </Field>
                <div ref={endOfFormRef}></div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex gap-8 pb-4 pt-8">
        <Button variant="inverse" label="CANCEL" size="medium" onClick={handleCancel} className="min-w-[9rem]" />

        <Button
          variant="primary"
          disabled={disallowSave}
          label={saveText}
          size="medium"
          onClick={handleSave}
          className="min-w-[9rem]"
        />
      </div>
    </div>
  );

  const renderMaxDepthContent = () => (
    <>
      <div className="mb-[1.8125rem] flex max-w-[29.375rem] flex-col items-center">
        <div className={'mb-8 text-center text-h3 font-semibold text-black-soft'}>
          You cannot add a space at this level
        </div>
        <div className={'text-center text-[16px] leading-[24px] text-grey-600'}>
          You can create no more than {maxDepth} levels of spaces. Review your system design plan and make the necessary
          adjustments.
        </div>
      </div>
      <div className="flex max-w-[470px] items-center justify-center gap-[49px]">
        <Button size="medium" variant="primary" label="Close" onClick={handleCancel} />
      </div>
    </>
  );

  return (
    <>
      <Modal onClose={handleCancel} open={open} maxWidth="md">
        {parentDepth! >= maxDepth ? renderMaxDepthContent() : renderAddSpaceContent()}
      </Modal>
    </>
  );
};

export default AddSpace;
