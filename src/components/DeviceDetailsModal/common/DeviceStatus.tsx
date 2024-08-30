import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { twMerge } from 'tailwind-merge';
import { LONG_DATE_FORMAT } from './constants';
import IconError from './IconError';
import IconReporting from './IconReporting';
import deviceTooltips from '../common/DeviceTooltips';
import { useSiteFromHandleOrLastStored } from '@src/features/useSiteFromHandleOrLastStored';

dayjs.extend(utc);
dayjs.extend(timezone);

type DeviceStatusProps = {
  lastReportedTimestamp?: number;
  connectivity?: string;
  sensorStatus?: any[];
  classExtend?: string;
};

export const DeviceStatus: React.FC<DeviceStatusProps> = ({
  lastReportedTimestamp = 0,
  connectivity,
  sensorStatus,
  classExtend,
}) => {
  const { siteTz } = useSiteFromHandleOrLastStored();
  const lastReportedMs = `${lastReportedTimestamp}`.length > 10 ? lastReportedTimestamp / 1000 : lastReportedTimestamp;
  const lastReportedDay = dayjs.unix(lastReportedMs || 0).tz(siteTz);

  let statusText = 'Reporting';
  let hasError = false;

  if (connectivity === 'offline') {
    hasError = true;
    statusText = 'Device offline';
  } else if (sensorStatus && sensorStatus.length > 1) {
    hasError = true;
    statusText = 'Multiple sensor errors';
  } else if (sensorStatus && sensorStatus.length === 1) {
    hasError = true;

    const errorLabel = sensorStatus?.[0]?.label;

    const lowerError = errorLabel.toLowerCase();
    if (lowerError === 'unknown' || lowerError == 'reporting') {
      statusText = 'Not reporting';
    } else {
      statusText = `${errorLabel} not reporting`;
    }
  }

  /*
  Determine Status

  Sensor offline
    'Device offline'
  CO2/TVOC/PM offline:
    '{pollutant} not reporting'
  Multiple sensors:
    'Multiple not reporting'
  Offline:
    'Not reporting'
  */

  return (
    <>
      <div className={twMerge('flex h-full w-6 flex-col justify-center', classExtend && `${classExtend}`)}>
        <div
          className={twMerge(
            'h-[86px] w-1.5 rounded-r transition-all',
            !hasError && 'bg-alert-ok-light',
            hasError && 'bg-alert-error-light',
          )}
        />
      </div>
      <div>
        <div data-tooltip-id="dd-sensor-status">
          <div className="mb-0.5 text-mini text-grey-light-500">Sensor status</div>
          {hasError && deviceTooltips.SensorErrorTooltip('dd-sensor-status')}
          <div className="mb-2.5 flex text-sm text-black-soft">
            {!hasError && (
              <div className="mr-1 flex items-center justify-center text-alert-ok-light">
                <IconReporting />
              </div>
            )}
            {hasError && (
              <div className="mr-1 flex items-center justify-center text-alert-error-light">
                <IconError />
              </div>
            )}
            <div className="flex text-sm font-medium text-black-soft">{!hasError ? 'Reporting' : statusText}</div>
          </div>
        </div>
        <div className="mb-0.5 text-mini text-grey-light-500">Last reported</div>
        <div className="flex text-sm font-medium text-black-soft">
          {lastReportedDay.format(LONG_DATE_FORMAT) || 'Unknown'}
        </div>
      </div>
    </>
  );
};

export default DeviceStatus;
