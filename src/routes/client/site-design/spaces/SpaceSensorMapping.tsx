import { Button } from '@ncent-holdings/ux-components';
import React from 'react';

interface SpaceSensorMappingProps {
  handleOnConfirm: () => void;
  handleOnCancel: () => void;
}

export const SpaceSensorMapping = ({ handleOnConfirm, handleOnCancel }: SpaceSensorMappingProps) => {
  return (
    <>
      <div className="mb-[49px]">
        <div className="mb-6 text-center text-[32px] font-semibold leading-[38px] text-black-soft">Are you sure?</div>
        <div className="mb- text-center text-[16px] leading-[24px] text-grey-600">
          <p className="text-left text-black">
            This will alter sensor mapping that has been defined to improve system operation and reporting.
          </p>
          <p className="mt-4 text-left text-black">
            If you confirm this change, the system will reset custom sensor mapping back to its original state.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Button size="medium" variant="secondary" label="Cancel" className="w-[140px]" onClick={handleOnCancel} />
        <Button size="medium" variant="primary" label="Confirm" className="w-[140px]" onClick={handleOnConfirm} />
      </div>
    </>
  );
};

export default SpaceSensorMapping;
