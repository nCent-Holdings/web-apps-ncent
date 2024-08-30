import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';
import { RootState } from '@src/app-store/store';
import { groupBy } from '@src/utils/objectUtils';

const SEPARATOR = ':';
const DIRECT_DEVICES_NAME = 'DirectDevices';
const DIRECT_DEVICES_EXP = DIRECT_DEVICES_NAME + SEPARATOR; //Eg: DirectDevices:XXXX

const selectSearchSpacesIds = (state: RootState) => state.deviceManagement.searchSpacesIds;

const selectFilteredSearchSpacesIds = createSelector(selectSearchSpacesIds, (spacesIds) => {
  return spacesIds
    .map((spaceId) => {
      if (spaceId.includes(DIRECT_DEVICES_EXP)) {
        return spaceId.split(DIRECT_DEVICES_EXP)[1];
      }

      return spaceId;
    })
    .filter((value, index, self) => self.indexOf(value) === index)
    .join(',');
});

// TODO: Refactor
const selectSpacesObject = (state: RootState) => state.deviceManagement.spaces;

const selectList = createSelector(selectSpacesObject, (spacesObj) => Object.values(spacesObj));

const selectSpacesDetail = createSelector(selectList, (spaces) => {
  return spaces.map((space) => {
    return {
      name: space.name,
      id: space.id,
      ...space?.['wellcube/spaces'],
      ...space?.['wellcube/space'],
    };
  });
});

const selectSpaceChildrens = createSelector(selectSpacesDetail, (spaces) => {
  const createGroupedObject = (obj: any) => {
    return {
      id: obj.id,
      label: `${obj.name} ${obj?.meta?.total_spaces ? `(${obj?.meta?.total_spaces})` : ''} `,
      parentId: obj.parent_space_id,
      depth: obj.depth,
      children: [],
      iconColor: '#667085',
      classNameCustomLabel: 'text-base font text-black-soft',
      classNameCustomContainer:
        obj.depth === 1
          ? 'bg-white-background mb-1 border-b border-blue-suede-light' //bg-[#DBE8F2]
          : '',
    };
  };

  return groupBy(spaces, 'parent_space_id', createGroupedObject, (obj) => obj.depth === 1);
});

const selectFullSpaces = createSelector(selectSpaceChildrens, selectSpacesObject, (spacesGrouped, spacesObj) => {
  const addDirectDevices = (data: any) => {
    return _.map(data, (space) => {
      if (space.children && space.children.length > 0) {
        //If not direct devices found , skip Add this aditional node
        const spaceDevices = spacesObj[space.id]['wellcube/devices'];
        if (!spaceDevices || spaceDevices?.meta.total === 0) return space;

        const existingDirectDevices = space.children.some((child: any) => child.label.includes(DIRECT_DEVICES_NAME));

        if (!existingDirectDevices) {
          const directDevices = {
            id: `${DIRECT_DEVICES_EXP}${space.id}`,
            label: '-Direct devices',
            parentId: space.id,
            depth: space.depth + 1,
            children: [],
            classNameCustomLabel: 'text-base font-medium text-black-light',
          };
          const newChildren = [directDevices, ...space.children];
          space.children = addDirectDevices(newChildren);
        }
        space.children = addDirectDevices(space.children);
      }
      return space;
    });
  };

  return addDirectDevices(spacesGrouped);
});

const selectTopLevelSpaces = createSelector(selectList, (spaces) =>
  spaces.filter((space) => space['wellcube/space']?.depth === 1),
);

const selectFullOrderedSpaces = createSelector(selectFullSpaces, (spaces) => {
  return _.orderBy(spaces, [(space) => space?.label?.toLowerCase()]);
});

export default {
  selectSearchSpacesIds,
  selectFilteredSearchSpacesIds,
  selectFullOrderedSpaces,
  selectTopLevelSpaces,
};
