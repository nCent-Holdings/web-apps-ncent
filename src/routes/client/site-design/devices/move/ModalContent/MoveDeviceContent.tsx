import React, { useState } from 'react';
import { DeviceModel, GatewayModel } from '../../../../../../api-types/models';
import { Button, Checkbox } from '@ncent-holdings/ux-components';

type MoveDeviceContentProps = {
  selectedDevice: DeviceModel | GatewayModel;
  onCancel: () => void;
  onOk: (retain: boolean) => void;
};

const MoveDeviceContent = ({ selectedDevice, onCancel, onOk }: MoveDeviceContentProps) => {
  const [retainExisting, setRetainExisting] = useState(false);

  const handleOk = () => onOk(retainExisting);

  return (
    <>
      <div className="mb-[45px] flex max-w-[414px] flex-col">
        <div className={'text-sm font-semibold text-grey-500'}>MOVE</div>
        <div className="mb-[42px] text-h4 font-semibold">{selectedDevice?.name}</div>
        <div className="mb-[42px] rounded-lg bg-blue-brilliant px-5 py-4 font-semibold text-white">
          TIP: Contact your Technical Sales Manager to better understand implications of moving a device.
        </div>
        <div className="mb-8">
          By default, if you move this device, it will lose its gateway assignment, necessitating reassignment. This is
          to prevent a faulty assignment resulting from relocation.
        </div>
        <div className="mb-4">If, however, you would like to override this default setting, check here to proceed.</div>
        <div className="flex items-start gap-2 leading-5">
          <div className="min-w-[20px]">
            <Checkbox
              id="retainExisting"
              isChecked={retainExisting}
              handleCheck={() => setRetainExisting(!retainExisting)}
            />
          </div>
          <p className="mt-[-2px]">
            I would like to move this space while retaining the existing gateway and device assignments.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center gap-3">
        <Button
          size="medium"
          variant="secondary"
          className="w-fit min-w-[140px] px-[22px]"
          label="Cancel"
          onClick={onCancel}
        />
        <Button
          size="medium"
          variant="primary"
          className="w-fit min-w-[140px] px-[22px]"
          label={'I understand'}
          onClick={handleOk}
        />
      </div>
    </>
  );
};

export default MoveDeviceContent;
