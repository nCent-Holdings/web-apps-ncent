import React from 'react';
import { PurifierModel } from '../../../api-types/models';
import DeviceDetailsSection from '../common/DeviceDetailsSection';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';
import { SHORT_DATE_FORMAT } from '../common/constants';
import deviceTooltips from '../common/DeviceTooltips';
import { useSiteFromHandleOrLastStored } from '@src/features/useSiteFromHandleOrLastStored';

type ThermalComfortProps = {
  device: PurifierModel;
};

export const ThermalComfort: React.FC<ThermalComfortProps> = ({ device }) => {
  const { siteTz } = useSiteFromHandleOrLastStored();

  const renderTemperature = () => {
    const hasError = device?.['sensor/status']?.statuses?.find((s) => s.label.toLowerCase() === 'temperature');

    const lrDay = dayjs.unix(device?.['air/temperature']?.timestamp || 0).tz(siteTz);
    const tooltipId = 'tc-temperature';

    return (
      <>
        <div className="flex w-[50%] border-r border-[#D4DFEA] pr-6">
          <div className="flex h-full w-6 flex-col justify-center">
            <div
              className={twMerge(
                'h-[46px] w-1.5 rounded-r',
                !hasError && 'invisible',
                hasError && 'visible bg-alert-error-light',
              )}
            />
          </div>
          <div className="flex flex-col justify-center py-1.5 ">
            <div className="mb-0.5 text-mini text-grey-light-500">Temperature</div>
            <div className="w-fit text-h5 font-semibold" data-tooltip-id={tooltipId}>
              {device?.['air/temperature']?.temperature} &deg;
              {device?.['air/temperature']?.units}
            </div>
            {hasError && (
              <div className="mt-[-1px] flex text-[10px] font-medium">
                <div className="mr-1 text-black-soft">Last reported</div>
                <div className="text-grey-light-500">{lrDay.format(SHORT_DATE_FORMAT)}</div>
              </div>
            )}
          </div>
        </div>
        {deviceTooltips.TemperatureTooltip(tooltipId)}
      </>
    );
  };

  const renderHumidity = () => {
    const hasError = device?.['sensor/status']?.statuses?.find((s) => s.label.toLowerCase() === 'humidity');
    const lrDay = dayjs.unix(device?.['air/humidity']?.timestamp || 0).tz(siteTz);

    const tooltipId = 'tc-humidity';

    return (
      <>
        <div className="flex w-[50%] pr-6">
          <div className="flex h-full w-6 flex-col justify-center">
            <div
              className={twMerge(
                'h-[46px] w-1.5 rounded-r',
                !hasError && 'invisible',
                hasError && 'visible bg-alert-error-light',
              )}
            />
          </div>
          <div className="flex flex-col justify-center py-1.5">
            <div className="mb-0.5 text-mini text-grey-light-500">Humidity</div>
            <div className="w-fit text-h5 font-semibold" data-tooltip-id={tooltipId}>
              {device?.['air/humidity']?.humidity} %
            </div>
            {hasError && (
              <div className="mt-[-1px] flex text-[10px] font-medium">
                <div className="mr-1 text-black-soft">Last reported</div>
                <div className="text-grey-light-500">{lrDay.format(SHORT_DATE_FORMAT)}</div>
              </div>
            )}
          </div>
        </div>
        {deviceTooltips.HumidityTooltip(tooltipId)}
      </>
    );
  };

  return (
    <DeviceDetailsSection heading="Thermal comfort" classExtend="w-full max-h-[114px] overflow-hidden">
      <div className="flex min-h-[66px] w-full flex-1">
        {renderTemperature()}
        {renderHumidity()}
      </div>
    </DeviceDetailsSection>
  );
};

export default ThermalComfort;
