import React, { useState } from 'react';
import { debounce } from 'lodash';
import { useSelector } from 'react-redux';
import { Modal, RadioGroup, Radio, Divider, Field, Input, Dropdown, Button, Heading } from '@ncent-holdings/ux-components';
import siteDesignSelectors from '@src/features/site-design/siteDesign.selectors';
import * as deviceCoreAPI from '../../../../../actions/devices';
import { advTitleCase } from '@src/utils';
import { GatewayModel } from '@src/api-types/models';
import { type CreateDeviceDto } from '@src/api/CoreAPI/types';

export interface AddDeviceProps {
  open: boolean;
  onCancel: () => void;
  onSave: (deviceId: string) => void;
  siteId: string;
  spaceId: string;
  gatewayList?: GatewayModel[];
}

const AddDevice: React.FC<AddDeviceProps> = ({ open, onCancel, onSave, siteId, spaceId, gatewayList = [] }) => {
  const [deviceType, setDeviceType] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [assetId, setAssetId] = useState('');
  const [gatewayId, setGatewayId] = useState('');
  const [model, setModel] = useState('');
  const [savingDevice, setSavingDevice] = useState(false);

  const [invalidDeviceName, setInvalidDeviceName] = useState('');
  const [invalidAssetId, setInvalidAssetId] = useState('');

  const parentSpace = useSelector(siteDesignSelectors.selectSpace(spaceId || ''));

  const parentName = parentSpace?.name;

  const gatewayOptions = gatewayList.map((item) => ({
    id: item.id,
    label: `<span style='margin-top:0'>${item['wellcube/location']?.full_path} > ${item.name}</span>`,
    value: item.id,
  }));

  const handleCancel = async () => {
    setDeviceType('');
    setDeviceName('');
    setAssetId('');
    setGatewayId('');
    setModel('');
    setInvalidDeviceName('');
    setInvalidAssetId('');
    onCancel();
  };

  const handleSave = async () => {
    // save

    if (deviceType === 'sensor') {
      setModel('');
    }

    if (deviceType === 'gateway') {
      setGatewayId('');
    }

    const deviceData: CreateDeviceDto = {
      name: deviceName,
      site_id: siteId,
      asset_id: assetId,
      type: deviceType,
      model,
      gateway_id: gatewayId,
    };

    setSavingDevice(true);

    // create new space
    try {
      const createdDevice = await deviceCoreAPI.createDevice(spaceId, deviceData);

      onSave(createdDevice.id);
    } catch (err) {
      console.error(`Error creating device: ${err} `);

      onCancel();
    } finally {
      setSavingDevice(false);
    }

    setDeviceType('');
    setDeviceName('');
    setAssetId('');
    setGatewayId('');
    setModel('');
    setInvalidDeviceName('');
  };

  const checkDeviceName = async (newDeviceName: string) => {
    if (!newDeviceName) return;
    // console.log(`in CheckDeviceName with spaceId ${spaceId}`);
    const validationResult = await deviceCoreAPI.validateDeviceName(spaceId, newDeviceName);

    if (!validationResult.isValid) {
      // name is invalid
      let valMessage = validationResult.message || 'You have specified an invalid device name.';

      if (valMessage.startsWith('a device named ')) {
        valMessage = `${advTitleCase(deviceType)} names must be unique within a space.`;
      }

      setInvalidDeviceName(valMessage);
    } else if (validationResult.isValid) {
      // name is good
      setInvalidDeviceName('');
    }
  };

  const checkAssetId = async (newAssetId: string) => {
    if (!newAssetId) return;
    const validationResult = await deviceCoreAPI.validateAssetId(siteId, newAssetId);

    if (!validationResult.isValid) {
      // name is invalid
      let valMessage = validationResult.message || 'You have specified an invalid assetId .';

      //TODO:Check THIS!
      if (valMessage.startsWith('a device named ')) {
        valMessage = `${advTitleCase(deviceType)} names must be unique within a space.`;
      }

      setInvalidAssetId(valMessage);
    } else if (validationResult.isValid) {
      setInvalidAssetId('');
    }
  };

  const handleDeviceType = (newDeviceType: string) => {
    setDeviceType(newDeviceType);
  };

  const createDebouncedFunction =
    (func: (value: any) => void, delay = 1000) =>
    (value: any) =>
      debounce(func, delay)(value);

  const handleDeviceName: React.FormEventHandler = (evt: React.FormEvent<HTMLInputElement>) => {
    const { value } = evt.target as HTMLInputElement;

    setDeviceName(value);

    const debouncedCheckDeviceName = createDebouncedFunction(checkDeviceName);
    debouncedCheckDeviceName(value);
  };

  const handleAssetId: React.FormEventHandler = (evt: React.FormEvent<HTMLInputElement>) => {
    const { value } = evt.target as HTMLInputElement;

    setAssetId(value);

    const debouncedCheckAssetId = createDebouncedFunction(checkAssetId);
    debouncedCheckAssetId(value);
  };

  const handleGatewayId = (value: string) => {
    setGatewayId(value);
  };

  const handleModel = (value: string) => {
    setModel(value);
  };

  const formatGatewayOptionLabel = ({ value }: { value: string }) => {
    const item = gatewayList.filter((gw) => gw.id === value)[0];
    return (
      <span>
        {item['wellcube/location']?.full_path} {'>'}&nbsp;
        <span className="font-bold">{item.name}</span>
      </span>
    );
  };

  const saveText = savingDevice ? 'SAVING...' : 'SAVE';

  const disallowSave =
    invalidDeviceName !== '' ||
    invalidAssetId !== '' ||
    savingDevice ||
    deviceType == '' ||
    deviceName == '' ||
    (deviceType === 'sensor' && (gatewayId == '' || gatewayId == undefined)) ||
    (deviceType === 'purifier' && (gatewayId == '' || gatewayId == undefined || model == '' || model == undefined));

  const addingDeviceWithoutGateways =
    gatewayList.length === 0 && (deviceType === 'purifier' || deviceType === 'sensor');

  const renderAddDeviceContent = () => (
    <div>
      <Heading heading="Add a Device" />
      <div>
        <p className="mb-[32px] mt-[32px] text-sm">
          This device will be created in <span className="font-semibold">{parentName}</span>
        </p>

        <div className="mb-[32px]">
          <RadioGroup
            direction="horizontal"
            name={`device-type-${spaceId}`}
            value={deviceType}
            onChange={handleDeviceType}
          >
            <Radio id="gateway" value="gateway" label="Gateway" />
            <Radio id="purifier" value="purifier" label="Purifier" />
            <Radio id="sensor" value="sensor" label="Sensor" />
          </RadioGroup>
        </div>

        <Divider />

        {addingDeviceWithoutGateways ? (
          <div className="mb-[32px] mt-[32px] text-left text-h5">
            <p>Gateways must be added to this system design before any associated purifiers and sensors.</p>
            <div className="flex gap-8 pb-4 pt-8">
              <Button variant="primary" label="CANCEL" size="medium" onClick={handleCancel} />
            </div>
          </div>
        ) : (
          <div className="relative flex">
            <div className="flex w-full flex-col gap-y-8 pt-8 font-medium">
              {deviceType === 'purifier' ? (
                <Dropdown
                  label="Device model"
                  options={[
                    {
                      id: 'basic',
                      label: 'WellCube Air',
                      value: 'basic purifier',
                    },
                    {
                      id: 'advanced',
                      label: 'WellCube Air+',
                      value: 'advanced purifier',
                    },
                  ]}
                  placeholder="Select a device model"
                  handleSelection={(items) => handleModel(items[0]?.value)}
                />
              ) : (
                <></>
              )}

              {deviceType !== '' ? (
                <>
                  <Field htmlFor="deviceName" label="Device name" errorMsg={invalidDeviceName}>
                    <Input
                      id="deviceName"
                      type="text"
                      placeholder="Enter a unique name"
                      value={deviceName}
                      name="deviceName"
                      onChange={handleDeviceName}
                      hasError={invalidDeviceName !== ''}
                    />
                  </Field>
                  <Field
                    htmlFor="assetID"
                    label="Asset ID"
                    labelExtension="(Optional)"
                    labelExtensionClass="ml-2 font text-grey-500"
                    errorMsg={invalidAssetId}
                  >
                    <Input
                      id="assetID"
                      type="text"
                      placeholder="Asset ID must be unique, ie. P001, P002, S001, etc."
                      value={assetId}
                      name="assetID"
                      onChange={handleAssetId}
                      hasError={invalidAssetId !== ''}
                    />
                  </Field>
                </>
              ) : (
                <></>
              )}

              {deviceType !== '' && invalidDeviceName !== '' ? (
                <div className="mt-[8px]">
                  <a
                    href="https://support.delos.com/hc/en-us"
                    target="_blank"
                    rel="noreferrer"
                    className="text-base text-blue-brilliant"
                  >
                    Learn more
                  </a>
                </div>
              ) : (
                <></>
              )}

              {deviceType === 'purifier' || deviceType === 'sensor' ? (
                <>
                  <Dropdown
                    label="Gateway"
                    options={gatewayOptions}
                    placeholder="Select a gateway"
                    formatOptionLabel={formatGatewayOptionLabel}
                    useSearchIcon={true}
                    handleSelection={(items) => handleGatewayId(items[0]?.value)}
                    classNames={{
                      input: () => 'p-1',
                      menuList: () => 'px-3 py-1 my-1',
                      singleValue: () => 'mt-2 mb-1 flex items-center leading-[120%]',
                      placeholder: () => 'p-0 text-grey-500 font-[16px] leading-[220%] italic',
                    }}
                    menuPosition="fixed"
                    highlightSearch={true}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
      </div>
      {!addingDeviceWithoutGateways && (
        <div className="flex gap-8 pb-4 pt-8">
          <Button variant="inverse" label="CANCEL" size="large" onClick={handleCancel} className="min-w-[120px]" />

          <Button
            variant="primary"
            disabled={disallowSave}
            label={saveText}
            size="large"
            onClick={handleSave}
            className="min-w-[120px]"
          />
        </div>
      )}
    </div>
  );

  return (
    <>
      <Modal onClose={handleCancel} open={open}>
        {renderAddDeviceContent()}
      </Modal>
    </>
  );
};

export default AddDevice;
