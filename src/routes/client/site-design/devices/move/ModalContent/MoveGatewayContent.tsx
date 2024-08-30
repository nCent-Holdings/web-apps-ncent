import React, { useEffect, useState } from 'react';
import { DeviceModel, GatewayModel } from '../../../../../../api-types/models';
import { Button, Checkbox } from '@ncent-holdings/ux-components';
import { getGatewayDevices } from '../../../../../../actions/gateways';

type MoveGatewayContentProps = {
  selectedDevice: DeviceModel | GatewayModel;
  onCancel: () => void;
  onOk: (retain: boolean) => void;
};

const MoveGatewayContent = ({ selectedDevice, onCancel, onOk }: MoveGatewayContentProps) => {
  const [retainExisting, setRetainExisting] = useState(false);
  const [affectedDevices, setAffectedDevices] = useState<DeviceModel[]>([]);

  useEffect(() => {
    fetchDevices();
  }, [selectedDevice]);

  const fetchDevices = async () => {
    const devices = await getGatewayDevices(selectedDevice.id);
    setAffectedDevices(devices);
  };

  const handleOk = () => onOk(retainExisting);

  return (
    <>
      <div className="mb-[45px] flex flex-col">
        <div className={'text-sm font-semibold text-grey-500'}>MOVE</div>
        <div className="mb-[42px] text-h4 font-semibold">{selectedDevice?.name}</div>
        <div className="mb-[42px] rounded-lg bg-blue-brilliant px-5 py-4 font-semibold text-white">
          TIP: Contact your Technical Sales Manager to better understand implications of moving a gateway.
        </div>
        <div className="flex h-[308px]">
          <div className="mr-8 w-[434px]">
            <div className="mb-8">
              By default, if you move this gateway, it will lose its assignment to other devices, necessitating
              reassignment. This is to prevent a faulty assignment resulting from relocation.
            </div>
            <div className="mb-4">
              If, however, you would like to override this default setting, check here to proceed.
            </div>
            <div className="flex items-start gap-2 leading-5">
              <div className="min-w-[20px]">
                <Checkbox
                  id="retainExisting"
                  isChecked={retainExisting}
                  handleCheck={() => setRetainExisting(!retainExisting)}
                />
              </div>
              <p className="mt-[-2px]">
                I would like to move this gateway while retaining the existing device assignments.
              </p>
            </div>
          </div>
          <div className="h-full w-px bg-blue-light-suede"></div>
          <div className="ml-8 flex h-full w-[400px] flex-col">
            <p className="mb-5 font-semibold">The following devices will be affected:</p>
            {!affectedDevices.length ? (
              <p>No devices will be impacted.</p>
            ) : (
              <div className="overflow-auto rounded-lg border border-grey-400 bg-white px-4">
                {affectedDevices.map((item) => {
                  const { full_path = '', top_space = '' } = item['wellcube/location'] || {};
                  const spaceString = full_path === top_space ? `${full_path} >` : `${top_space} > ...`;
                  return (
                    <div
                      key={item.id}
                      className="w-full overflow-hidden text-ellipsis border-b border-grey-400 py-4 last:border-b-0"
                    >
                      <span className="text-sm font-medium">{spaceString}</span>{' '}
                      <span className="font-bold">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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

export default MoveGatewayContent;
