import React, { useMemo } from 'react';
import { PurifierModel } from '../../../api-types/models';
import DeviceDetailsSection from '../common/DeviceDetailsSection';
import { EnhancedSensingDisplay } from '@ncent-holdings/ux-components';
import DecorationOccupied from './DecorationOccupied';
import DecorationVacant from './DecorationVacant';
import { calculatePercentage } from '../../../utils/mathUtils';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import { SHORT_DATE_FORMAT } from '../common/constants';
import deviceTooltips from '../common/DeviceTooltips';
import { useSiteFromHandleOrLastStored } from '@src/features/useSiteFromHandleOrLastStored';

type EnhancedSensingProps = {
  device: PurifierModel;
};

export const EnhancedSensing: React.FC<EnhancedSensingProps> = ({ device }) => {
  const { siteTz } = useSiteFromHandleOrLastStored();

  const lightLevel = useMemo(() => {
    const rawVal = device['sensor/light']?.brightness || 0;

    let calcVal = 0;
    if (rawVal > 1000) {
      calcVal = 100;
    } else if (rawVal > 0) {
      calcVal = calculatePercentage(
        {
          minRaw: 0,
          maxRaw: 1000,
          targetMin: 300,
          targetMax: 500,
          targetVal: 50,
        },
        rawVal,
      );
    }

    let lightError = undefined;
    const hasLightError = device['sensor/status']?.statuses.some((s) => s.label.toLowerCase() === 'light');
    if (hasLightError) {
      const lrDate = dayjs.unix(device['sensor/light']?.brightness_ts || 0).tz(siteTz);

      lightError = (
        <>
          <div className="text-[10px] font-semibold uppercase">Last reported</div>
          <div className="text-[10px] font-semibold uppercase text-grey-light-500">
            {lrDate.format(SHORT_DATE_FORMAT)}
          </div>
        </>
      );
    }

    return {
      label: `${rawVal} Lux`,
      value: calcVal,
      color: 'light',
      error: lightError,
    };
  }, [device['sensor/light'], device['sensor/status']]);

  // Linear range between 2,700 and 6,5000
  const lightTemp = useMemo(() => {
    const rawVal = device['sensor/light']?.temperature || 0;

    let calcVal = 0;

    if (rawVal > 6500) {
      calcVal = 100;
    } else if (rawVal > 2700) {
      calcVal = (100 * (rawVal - 2700)) / (6500 - 2700);
    }

    let lightError = undefined;
    const hasLightError = device['sensor/status']?.statuses.some((s) => s.label.toLowerCase() === 'light');
    if (hasLightError) {
      const lrDate = dayjs.unix(device['sensor/light']?.temperature_ts || 0).tz(siteTz);

      lightError = (
        <>
          <div className="text-[10px] font-semibold uppercase">Last reported</div>
          <div className="text-[10px] font-semibold uppercase text-grey-light-500">
            {lrDate.format(SHORT_DATE_FORMAT)}
          </div>
        </>
      );
    }

    return {
      label: `${rawVal} K`,
      value: calcVal,
      color: 'temperature',
      error: lightError,
    };
  }, [device['sensor/light'], device['sensor/status']]);

  const noise = useMemo(() => {
    const rawVal = device['sensor/noise']?.intensity || 0;
    const fixedVal = rawVal.toFixed(1);

    let calcVal = 0;
    if (rawVal > 120) {
      calcVal = 100;
    } else if (rawVal > 0) {
      calcVal = calculatePercentage(
        {
          minRaw: 0,
          maxRaw: 120,
          targetMin: 30,
          targetMax: 50,
          targetVal: 50,
        },
        rawVal,
      );
    }

    let noiseError = undefined;
    const hasNoiseError = device['sensor/status']?.statuses.some((s) => s.label.toLowerCase() === 'noise');
    if (hasNoiseError) {
      const lrDate = dayjs.unix(device['sensor/noise']?.intensity_ts || 0).tz(siteTz);

      noiseError = (
        <>
          <div className="text-[10px] font-semibold uppercase">Last reported</div>
          <div className="text-[10px] font-semibold uppercase text-grey-light-500">
            {lrDate.format(SHORT_DATE_FORMAT)}
          </div>
        </>
      );
    }

    return {
      label: `${fixedVal} dBA`,
      value: calcVal,
      color: 'noise',
      error: noiseError,
    };
  }, [device['sensor/noise'], device['sensor/status']]);

  const occupancy = useMemo(() => {
    const hasOccError = device['sensor/status']?.statuses.some((s) => s.label.toLowerCase() === 'occupancy');

    let occError = undefined;
    if (hasOccError) {
      const lrDate = dayjs.unix(device['sensor/occupancy']?.occupied_ts || 0).tz(siteTz);

      occError = (
        <div>
          <div className="text-[10px] font-semibold uppercase">Last reported</div>
          <div className="text-[10px] font-semibold uppercase text-grey-light-500">
            {lrDate.format(SHORT_DATE_FORMAT)}
          </div>
          <div className="mt-1 h-1.5 w-[83px] rounded bg-alert-error-light" />
        </div>
      );
    }

    return {
      occupied: device['sensor/occupancy']?.occupied || 0,
      people: device['sensor/occupancy']?.people || 0,
      error: occError,
    };
  }, [device['sensor/occupancy'], device['sensor/status']]);

  return (
    <DeviceDetailsSection heading="Enhanced sensing" classExtend="w-full h-[184px] overflow-hidden">
      <div className="flex flex-1">
        <div className="max-h-[137px] w-[123px] border-r border-[#D4DFEA]">
          <div className="flex flex-1 flex-col items-center py-3">
            <EnhancedSensingDisplay
              title="Light level"
              label={lightLevel.label}
              value={lightLevel.value}
              color="light"
              error={lightLevel.error}
              TooltipComponent={deviceTooltips.LightLevelTooltip()}
            />
          </div>
        </div>
        <div className="w-[123px] border-r border-[#D4DFEA]">
          <div className="flex flex-1 flex-col items-center py-3">
            <EnhancedSensingDisplay
              title="Color Temp"
              label={lightTemp.label}
              value={lightTemp.value}
              color="temperature"
              error={lightTemp.error}
              TooltipComponent={deviceTooltips.ColorTempTooltip()}
            />
          </div>
        </div>
        <div className="w-[123px] border-r border-[#D4DFEA]">
          <div className="flex flex-1 flex-col items-center py-3">
            <EnhancedSensingDisplay
              title="Ambient Noise"
              label={noise.label}
              value={noise.value}
              color="noise"
              error={noise.error}
              TooltipComponent={deviceTooltips.AmbientNoiseTooltip()}
            />
          </div>
        </div>
        <div className="w-[123px]">
          <div className="flex flex-1 flex-col items-center py-3 text-center" data-tooltip-id="enhs-occupancy">
            <div
              className={twMerge(
                'text-grey-light-500',
                !occupancy.error && 'mb-6 text-mini',
                occupancy.error && 'mb-1 text-mini',
              )}
            >
              Occupancy
            </div>
            <div className={twMerge(!occupancy.error && 'mb-1.5', occupancy.error && 'mb-1')}>
              {occupancy.occupied ? <DecorationOccupied /> : <DecorationVacant />}
            </div>
            <div className="text-sm font-semibold text-black-soft">{occupancy.occupied ? 'Occupied' : 'Vacant'}</div>
            {occupancy.error != null && occupancy.error}
          </div>
          {deviceTooltips.OccupancyTooltip('enhs-occupancy')}
        </div>
      </div>
    </DeviceDetailsSection>
  );
};

export default EnhancedSensing;
