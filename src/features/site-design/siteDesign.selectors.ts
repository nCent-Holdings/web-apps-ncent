import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@src/app-store/store';

const selectSelectedSpaceId = (state: RootState) => state.siteDesign.selectedSpaceId;
const selectSelectedDeviceId = (state: RootState) => state.siteDesign.selectedDeviceId;

const selectTopLevelSpaces = createSelector(
  (state: RootState) => state.siteDesign.spaces,
  (spaces) => {
    return Object.values(spaces).filter((space) => {
      return space['wellcube/space']?.depth === 1;
    });
  },
);

const selectChildSpacesIds = (spaceId: string) => (state: RootState) => {
  const spaceToChildSpaces = state.siteDesign.spacesTree.parentToChildren;

  return spaceToChildSpaces[spaceId] || [];
};

const selectSpace = (spaceId: string) => (state: RootState) => {
  return state.siteDesign.spaces[spaceId] || undefined;
};

const selectIsSelectedSpaceId = (spaceId: string) => (state: RootState) => {
  return state.siteDesign.selectedSpaceId === spaceId;
};

const selectExpansionStatus = (spaceId: string) => (state: RootState) => {
  return state.siteDesign.expansionStatus[spaceId] === true;
};

const selectHasExternalSensorsMapped = (spaceId: string) => (state: RootState) => {
  const spaces = state.siteDesign.spaces;
  const sensorsMap = spaces[spaceId]?.['wellcube/sensor_mapping']?.sensors_map || {};

  for (const sensorId of Object.keys(sensorsMap)) {
    if (!sensorsMap[sensorId].local) {
      return true;
    }
  }

  return false;
};

// TODO: createSelector???
const selectAreAllDescExpanded = (topSpaceId: string) => (state: RootState) => {
  const expansionStatus = state.siteDesign.expansionStatus;
  const spaceToChildSpaces = state.siteDesign.spacesTree.parentToChildren;

  let allAreExpanded = true;

  const stack: string[] = [topSpaceId];

  while (stack.length > 0 && allAreExpanded === true) {
    const spaceId = stack.pop() as string;

    if (expansionStatus[spaceId] !== true) {
      allAreExpanded = false;
    }

    const childIds = spaceToChildSpaces[spaceId] || [];

    stack.push(...childIds);
  }

  return allAreExpanded;
};

const selectOverallExpandStatus = createSelector(
  (state: RootState) => state.siteDesign.expansionStatus,
  // If there are any collapsed
  (expansionStatus) => {
    const expArr = Object.values(expansionStatus);

    const hasCollapsed = expArr.some((exp) => exp !== true);
    const hasExpanded = expArr.some((exp) => exp === true);

    let aggStatus;
    if (hasCollapsed && hasExpanded) {
      aggStatus = 'mixed';
    } else if (hasCollapsed) {
      aggStatus = 'collapsed';
    } else {
      aggStatus = 'expanded';
    }

    return aggStatus;
  },
);

export default {
  selectTopLevelSpaces,
  selectChildSpacesIds,
  selectSpace,
  selectHasExternalSensorsMapped,

  selectExpansionStatus,
  selectAreAllDescExpanded,
  selectOverallExpandStatus,

  selectIsSelectedSpaceId,
  selectSelectedSpaceId,
  selectSelectedDeviceId,
};
