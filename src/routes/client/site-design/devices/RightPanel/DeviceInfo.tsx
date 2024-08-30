import React from 'react';
import CollapseSection from '../../../../../components/CollapseSection/CollapseSection';
import { DeviceModel } from '../../../../../api-types/models';

interface DeviceInfoProps {
  device?: DeviceModel;
}

export const DeviceInfo = ({ device }: DeviceInfoProps) => {
  const deviceInfo = device?.['wellcube/device'];

  const renderInfo = (label: string, value?: string) => {
    return (
      <div>
        <label className="text-[0.875rem] font-medium text-[#667085]">{label}</label>
        <p className="mt-1 text-[1rem] leading-[1.25] tracking-[-0.01rem] text-[#16181C]">{value || 'N/A'}</p>
      </div>
    );
  };

  return (
    <div>
      <CollapseSection sectionName="Device Info">
        <div className="flex flex-col gap-y-8 px-5 py-6">
          {deviceInfo?.status == 'uncommissioned' ? (
            <>
              <p>Once this device is commissioned, you can return here to find device information.</p>
            </>
          ) : (
            <>
              {renderInfo('Device Model #', deviceInfo?.model)}
              {renderInfo('Device Serial #', deviceInfo?.serial_number)}
              {renderInfo('Network ID', deviceInfo?.network_id)}
              {renderInfo('Thread Network ID', deviceInfo?.thread_network_id)}
              {renderInfo('Device Firmware version(s)', deviceInfo?.firmware_version)}
            </>
          )}
        </div>
      </CollapseSection>
    </div>
  );
};

export default DeviceInfo;
