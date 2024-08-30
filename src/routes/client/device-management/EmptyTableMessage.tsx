import { Button } from '@ncent-holdings/ux-components';
import React from 'react';

export type EmptyTableMessageProps = {
  type: 'no-search-match' | 'no-devices';
  devices: string;
  onClearSearch?: () => void;
  onContactManager?: () => void;
};

const EmptyTableMessage: React.FC<EmptyTableMessageProps> = ({ type, devices, onClearSearch, onContactManager }) => {
  return type === 'no-search-match' ? (
    <div className="flex w-full flex-col items-center justify-center p-[80px]">
      <p className="mb-[24px] text-h4 font-semibold text-grey-900">Your search matches no {devices}</p>
      <Button variant="primary" label="CLEAR SEARCH" size="large" onClick={onClearSearch} />
    </div>
  ) : (
    <div className="flex w-full flex-col items-center justify-center p-[80px]">
      <p className="mb-[24px] text-h4 font-semibold text-grey-900">Your site has no {devices} yet</p>
      <p className="mb-[40px] text-grey-600">
        Contact your Technical Sales Manager to arrange System design and Installation.
      </p>
      <Button variant="primary" label="CONTACT TECHNICAL SALES" size="large" onClick={onContactManager} />
    </div>
  );
};

export default EmptyTableMessage;
