import React from 'react';
import { StatusLabel } from '@ncent-holdings/ux-components';

import { AssociatedDevicesTableProps } from './types';

export const AssociatedDevicesTable = (props: AssociatedDevicesTableProps) => {
  const { associatedDevices, associatedSensors, associatedPurifiers } = props;

  const hasDevicesDetails = associatedSensors.commissioned || associatedPurifiers.commissioned;

  const headerClasses = 'text-left text-sm text-black-soft font-semibold';
  const countClasses = 'pr-2 text-sm text-black-soft font-medium';
  const labelClasses = 'pr-2 text-sm text-grey-600 font-medium';

  return (
    <table>
      <thead>
        {hasDevicesDetails ? (
          <tr>
            <th className={headerClasses} colSpan={3}>{`${associatedDevices.total} Total devices`}</th>
          </tr>
        ) : (
          <tr>
            <th className={headerClasses}>{associatedDevices.total}</th>
            <th className={headerClasses} colSpan={2}>
              {'Total devices'}
            </th>
          </tr>
        )}
      </thead>
      <tbody className="[&>tr:first-child_td]:pt-1">
        {associatedSensors.commissioned ? (
          <tr>
            <td className={countClasses}>{associatedSensors.commissioned}</td>
            <td className={labelClasses}>{`Sensors`}</td>
            <td className={labelClasses}>
              {associatedSensors.offline ? (
                <StatusLabel status="error" label={`${associatedSensors.offline} offline`} size={6} />
              ) : null}
            </td>
          </tr>
        ) : null}
        {associatedPurifiers.commissioned ? (
          <tr>
            <td className={countClasses}>{associatedPurifiers.commissioned}</td>
            <td className={labelClasses}>{`Purifiers`}</td>
            <td className={labelClasses}>
              {associatedPurifiers.offline ? (
                <StatusLabel status="error" label={`${associatedPurifiers.offline} offline`} size={6} />
              ) : null}
            </td>
          </tr>
        ) : null}
        {associatedDevices.uncommissioned ? (
          <tr>
            <td className={countClasses}>{associatedDevices.uncommissioned}</td>
            <td className={labelClasses} colSpan={2}>{`Uncommissioned`}</td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
};

export default AssociatedDevicesTable;
