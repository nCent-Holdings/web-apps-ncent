import React, { useEffect, useState } from 'react';
import CollapseSection from '../CollapseSection/CollapseSection';
import * as sensorMappingCoreApi from '../../actions/sensorMapping';
import * as spacesCoreApi from '../../actions/spaces';
import { SensorMappingSection } from './SensorMappingSection';
import { useDevices } from '@src/api-hooks/devices/devicesApi';
import { getExternalDevicesNoun, filterAndDumpDevicesForPollutant } from './utils';
import { SpaceModel } from '../../api-types/models';

type SensorMappingProps = {
  sensorMapping?: SpaceModel['wellcube/sensor_mapping'];
  spaceId: string;
  spaceLayout: string;
};

const orderedSections: { type: keyof SpaceModel['wellcube/sensor_mapping']['pollutants']; title: string }[] = [
  { type: 'co2', title: 'Carbon dioxide (CO2)' },
  { type: 'pm25', title: 'Particulate matter (PM)' },
  { type: 'tvoc', title: 'tVOC' },
  { type: 'occupancy', title: 'Occupancy' },
  { type: 'humidity', title: 'Humidity' },
  { type: 'temperature', title: 'Temperature' },
  { type: 'noise', title: 'Noise' },
  { type: 'light', title: 'Light' },
];

export const SensorMapping: React.FC<SensorMappingProps> = ({ sensorMapping, spaceId, spaceLayout }) => {
  const [openSpacesNearbyLoading, setOpenSpacesNearbyLoading] = useState<boolean>(true);
  const [openSpacesNearbyIds, setOpenSpacesNearbyIds] = useState<string[]>([]);
  const sensorsMap = sensorMapping?.sensors_map || {};

  const externalDevicesNoun = getExternalDevicesNoun(sensorsMap);

  const { devices: internalDevices } = useDevices({ spaceId });

  const { devices: externalDevices } = useDevices({ searchNoun: externalDevicesNoun }, { skip: !externalDevicesNoun });

  useEffect(() => {
    setOpenSpacesNearbyIds([]);

    async function fetchNearbySpaces() {
      setOpenSpacesNearbyLoading(true);

      try {
        const spaces = await spacesCoreApi.getOpenSpacesNearby(spaceId);

        setOpenSpacesNearbyIds(spaces.map(({ id }: SpaceModel) => id));
      } finally {
        setOpenSpacesNearbyLoading(false);
      }
    }

    fetchNearbySpaces();
  }, [spaceId, spaceLayout]);

  const handleToggleChange = async (pollutant: string, id: string, enabled: boolean): Promise<void> => {
    await sensorMappingCoreApi.updateSensor(spaceId, {
      pollutant,
      sensor_id: id,
      enabled,
    });
  };

  const handleAddSensor = async (pollutant: string, id: string): Promise<void> => {
    await sensorMappingCoreApi.addSensor(spaceId, {
      pollutant,
      sensor_id: id,
    });
  };

  const handleRemoveSensor = async (pollutant: string, id: string): Promise<void> => {
    await sensorMappingCoreApi.removeSensor(spaceId, {
      pollutant,
      sensor_id: id,
    });
  };

  const renderMappingSections = () => {
    return orderedSections.map((section) => {
      const pollutant = sensorMapping?.pollutants?.[section.type];

      if (!pollutant) {
        return null;
      }

      const _internalDevices = filterAndDumpDevicesForPollutant(internalDevices, pollutant, sensorsMap);
      const _externalDevices = filterAndDumpDevicesForPollutant(externalDevices, pollutant, sensorsMap);

      return (
        <SensorMappingSection
          key={section.type}
          title={section.title}
          pollutant={pollutant}
          internalDevices={_internalDevices}
          externalDevices={_externalDevices}
          onSensorAdd={handleAddSensor}
          onSensorUpdate={handleToggleChange}
          onSensorRemove={handleRemoveSensor}
          openSpacesNearbyIds={openSpacesNearbyIds}
        />
      );
    });
  };

  return (
    <CollapseSection sectionName="Sensor mapping">
      {!openSpacesNearbyLoading ? renderMappingSections() : null}
    </CollapseSection>
  );
};

export default React.memo(SensorMapping);
