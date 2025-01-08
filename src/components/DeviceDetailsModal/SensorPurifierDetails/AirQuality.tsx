import React, { useMemo } from 'react';
import { PurifierModel, SensorModel } from '../../../api-types/models';
import { AQIMeter } from '@ncent-holdings/ux-components';
import DeviceDetailsSection from '../common/DeviceDetailsSection';
import dayjs from 'dayjs';

import './aqi_meter.css';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

import { SHORT_DATE_FORMAT } from '../common/constants';
import deviceTooltips from '../common/DeviceTooltips';
import { useSiteFromHandleOrLastStored } from '@src/features/useSiteFromHandleOrLastStored';

type AirQualityProps = {
  device: PurifierModel | SensorModel;
};

export const AirQuality: React.FC<AirQualityProps> = ({ device }: AirQualityProps) => {
  const hasCO2 = device['air/co2'] != null;
  const { siteTz } = useSiteFromHandleOrLastStored();

  const renderSiteTime = () => {
    const today = dayjs.utc().tz(siteTz);

    return (
      <>
        <div className="mb-2.5 text-mini text-grey-light-500">Site time</div>
        <div className="text-h5 font-semibold">{today.format('dddd')}</div>
        <div className="mt-1 text-mini text-grey-light-500">{today.format(SHORT_DATE_FORMAT)}</div>
      </>
    );
  };

  const renderPollutant = () => {
    return <div></div>;
  };

  // Based on the Delos AQI score (DAQI)
  const aqiScore = hasCO2 ? device['sensor/aqi']?.daqi.daqi_score : undefined;

  const aqiError = useMemo(() => {
    let lrDay = dayjs.unix(-1);

    const aqiErrors =
      device['sensor/status']?.statuses
        .filter((s: { label: string }) => {
          return ['tvoc', 'co2', 'pm25'].includes(s.label.toLowerCase());
        })
        .map((s: { label: string }) => s.label.toLowerCase()) || [];

    if (aqiErrors.includes('tvoc')) {
      lrDay = dayjs.unix(device['air/tvoc']?.timestamp || 0).tz(siteTz);
    } else if (aqiErrors.includes('co2')) {
      lrDay = dayjs.unix(device['air/co2']?.timestamp || 0).tz(siteTz);
    } else if (aqiErrors.includes('pm25')) {
      lrDay = dayjs.unix(device['air/pm25']?.timestamp || 0).tz(siteTz);
    }

    if (aqiErrors.length > 0) {
      return (
        <div className="flex text-[10px] font-medium">
          <div className="mr-1 text-black-soft">Last reported</div>
          <div className="text-grey-light-500">{lrDay.format(SHORT_DATE_FORMAT)}</div>
        </div>
      );
    } else {
      return undefined as unknown as JSX.Element;
    }
  }, [device]);

  return (
    <DeviceDetailsSection heading="Air quality" classExtend="w-full h-[320px] overflow-hidden">
      <div className="flex w-full flex-1">
        <div className="flex w-[292px] flex-col border-r border-[#D4DFEA] px-6 py-3">
          {renderSiteTime()}
          <div className="flex flex-1 items-center justify-center">
            <AQIMeter value={aqiScore} error={aqiError} TooltipComponent={deviceTooltips.AQITooltip()} />
          </div>
        </div>
        <div className="flex-1 last:border-none [&>*]:border-b [&>*]:border-[#D4DFEA]">
          {renderPollutant()}
          {renderPollutant()}
          {hasCO2 && renderPollutant()}
        </div>
      </div>
    </DeviceDetailsSection>
  );
};

export default AirQuality;
