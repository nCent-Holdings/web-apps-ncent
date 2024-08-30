import React from 'react';
import { Tooltip } from '@ncent-holdings/ux-components';

export const AQITooltip = (tooltipId?: string) => (
  <Tooltip
    tooltipId={tooltipId || 'aqi-tooltip'}
    title="WellCube Air Quality Index"
    link={{
      text: 'Learn more',
      href: 'https://www.delos.com',
    }}
    tooltipProps={{
      place: 'bottom',
    }}
  >
    <div className="mb-4">
      <div className="flex items-center">
        <div className="px-2 text-[10px]">&#9642;</div>
        <div>Good: 0-33</div>
      </div>
      <div className="flex items-center">
        <div className="px-2 text-[10px]">&#9642;</div>
        <div>Fair: 34-66</div>
      </div>
      <div className="flex items-center">
        <div className="px-2 text-[10px]">&#9642;</div>
        <div>Poor: 67-100</div>
      </div>
    </div>
    <div>
      Constant exposure to Poor AQI may have long-
      <br />
      term health impacts.
    </div>
  </Tooltip>
);

export const CO2Tooltip = (tooltipId?: string) => (
  <Tooltip
    tooltipId={tooltipId ?? 'co2-tooltip'}
    title="CO2"
    link={{
      text: 'Learn more',
      href: 'https://www.delos.com',
    }}
    tooltipProps={{
      place: 'left',
    }}
  >
    <div className="flex items-center">
      <div className="px-2 text-[10px]">&#9642;</div>
      <div>Good: 0-1,000 ppm</div>
    </div>
    <div className="flex items-center">
      <div className="px-2 text-[10px]">&#9642;</div>
      <div>Fair: 1,000-2,000 ppm</div>
    </div>
    <div className="flex items-center">
      <div className="px-2 text-[10px]">&#9642;</div>
      <div>Poor: &gt;2,000ppm</div>
    </div>
  </Tooltip>
);

export const PM25Tooltip = (tooltipId?: string) => (
  <Tooltip
    tooltipId={tooltipId ?? 'pm25-tooltip'}
    title="Particulate Matter PM 2.5"
    link={{
      text: 'Learn more',
      href: 'https://www.delos.com',
    }}
    tooltipProps={{
      place: 'left',
    }}
  >
    <div className="flex items-center">
      <div className="px-2 text-[10px]">&#9642;</div>
      <div>Good: 0-15 µg/m³</div>
    </div>
    <div className="flex items-center">
      <div className="px-2 text-[10px]">&#9642;</div>
      <div>Fair: 15-55 µg/m³</div>
    </div>
    <div className="flex items-center">
      <div className="px-2 text-[10px]">&#9642;</div>
      <div>Poor: &gt; 55 µg/m³</div>
    </div>
  </Tooltip>
);

export const TVOCTooltip = (tooltipId?: string) => (
  <Tooltip
    tooltipId={tooltipId || 'tvoc-tooltip'}
    title="TVOC"
    link={{
      text: 'Learn more',
      href: 'https://www.delos.com',
    }}
    tooltipProps={{
      place: 'left',
    }}
  >
    <div className="flex items-center">
      <div className="px-2 text-[10px]">&#9642;</div>
      <div>Good: 0-1,000 µg/m³</div>
    </div>
    <div className="flex items-center">
      <div className="px-2 text-[10px]">&#9642;</div>
      <div>Fair: 1,000-10,000 µg/m³</div>
    </div>
    <div className="flex items-center">
      <div className="px-2 text-[10px]">&#9642;</div>
      <div>Poor: &gt; 10,000 µg/m³</div>
    </div>
  </Tooltip>
);

export const LightLevelTooltip = (tooltipId?: string) => (
  <Tooltip
    tooltipId={tooltipId ?? 'enhs-light-level'}
    title="Light Level"
    link={{
      text: 'Learn more',
      href: 'https://www.delos.com',
    }}
    tooltipProps={{
      place: 'top-start',
    }}
  >
    <div className="flex items-center">
      <div className="px-2 text-[10px]">&#9642;</div>
      <div>Relax: &lt; 300 Lux</div>
    </div>
    <div className="flex items-center">
      <div className="px-2 text-[10px]">&#9642;</div>
      <div>Focus: 300 to 500 Lux</div>
    </div>
    <div className="flex items-center">
      <div className="px-2 text-[10px]">&#9642;</div>
      <div>Energizing: &gt; 500 Lux</div>
    </div>
  </Tooltip>
);
export const ColorTempTooltip = (tooltipId?: string) => (
  <Tooltip
    tooltipId={tooltipId ?? 'enhs-color-temp'}
    title="Color Temp"
    link={{
      text: 'Learn more',
      href: 'https://www.delos.com',
    }}
    tooltipProps={{
      place: 'top',
    }}
  >
    <div className="mb-4">
      <div className="flex items-center">
        <div className="px-2 text-[10px]">&#9642;</div>
        <div>Relax: &lt;3000 Kelvin</div>
      </div>
      <div className="flex items-center">
        <div className="px-2 text-[10px]">&#9642;</div>
        <div>Focus: 3000 - 4000 Kelvin</div>
      </div>
      <div className="flex items-center">
        <div className="px-2 text-[10px]">&#9642;</div>
        <div>Energizing: &gt; 4000 Kelvin</div>
      </div>
    </div>
    <div>
      Optimizing color temp to align with
      <br />
      natural sunlight can help improve
      <br />
      employee health and productivity.
    </div>
  </Tooltip>
);

export const AmbientNoiseTooltip = (tooltipId?: string) => (
  <Tooltip
    tooltipId={tooltipId || 'enhs-ambient-noise'}
    title="Ambient Noise"
    link={{
      text: 'Learn more',
      href: 'https://www.delos.com',
    }}
    tooltipProps={{
      place: 'top',
    }}
  >
    <div className="mb-4">
      <div className="flex items-center">
        <div className="px-2 text-[10px]">&#9642;</div>
        <div>Optimal: &lt; 45 dBA</div>
      </div>
      <div className="flex items-center">
        <div className="px-2 text-[10px]">&#9642;</div>
        <div>Suboptimal: &gt; 45 dBA</div>
      </div>
    </div>
    <div>
      Noise levels are important for
      <br />
      understanding employee productivity
      <br />
      and indoor environmental quality.
    </div>
  </Tooltip>
);

export const OccupancyTooltip = (tooltipId?: string) => (
  <Tooltip
    tooltipId={tooltipId || 'enhs-occupancy'}
    title="Occupancy"
    link={{
      text: 'Learn more',
      href: 'https://www.delos.com',
    }}
    tooltipProps={{
      place: 'top-end',
    }}
  >
    Measuring occupancy may help explain
    <br />
    changes in spatial utilization and indoor
    <br />
    environmental quality.
  </Tooltip>
);

export const TemperatureTooltip = (tooltipId?: string) => (
  <Tooltip
    tooltipId={tooltipId || 'tc-temperature'}
    tooltipProps={{
      place: 'bottom-start',
    }}
    link={{
      text: 'Learn more',
      href: 'https://www.delos.com',
    }}
    title="Temperature"
  >
    Temperature helps predict the risk of materials
    <br />
    off-gassing as well as occupant comfort.
  </Tooltip>
);

export const HumidityTooltip = (tooltipId?: string) => (
  <Tooltip
    tooltipId={tooltipId ?? 'tc-humidity'}
    tooltipProps={{
      place: 'bottom',
    }}
    link={{
      text: 'Learn more',
      href: 'https://www.delos.com',
    }}
    title="Humidity"
  >
    Monitoring humidity levels may help
    <br />
    anticipate potential mold growth.
  </Tooltip>
);

export const ConnectivityTooltip = (tooltipId?: string) => (
  <Tooltip
    tooltipId={tooltipId ?? 'dd-connectivity'}
    tooltipProps={{
      place: 'bottom',
    }}
  >
    Device connectivity
  </Tooltip>
);

export const PowerConsumptionTooltip = (tooltipId?: string) => (
  <Tooltip
    tooltipId={tooltipId ?? 'dd-power-consumption'}
    tooltipProps={{
      place: 'bottom-start',
    }}
  >
    Current consumption
  </Tooltip>
);

export const FilterLifeTooltip = (tooltipId?: string) => (
  <Tooltip
    tooltipId={tooltipId ?? 'dd-filter-life'}
    tooltipProps={{
      place: 'bottom-start',
    }}
  >
    Remaining filter life
  </Tooltip>
);

export const SensorErrorTooltip = (tooltipId?: string) => (
  <Tooltip
    tooltipId={tooltipId ?? 'dd-sensor-error'}
    tooltipProps={{
      place: 'top-start',
    }}
  >
    One or more sensors not reporting
  </Tooltip>
);

export default {
  AQITooltip,
  PM25Tooltip,
  TVOCTooltip,
  CO2Tooltip,
  LightLevelTooltip,
  ColorTempTooltip,
  AmbientNoiseTooltip,
  OccupancyTooltip,
  TemperatureTooltip,
  HumidityTooltip,
  ConnectivityTooltip,
  PowerConsumptionTooltip,
  FilterLifeTooltip,
  SensorErrorTooltip,
};
