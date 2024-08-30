import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { SpaceModel } from '@src/api-types/models';

const INITIAL_STATE: {
  searchSpacesIds: string[];

  // TODO: Remove
  spaces: { [key: string]: SpaceModel };
} = {
  searchSpacesIds: [],
  spaces: {},
};

export const dmSlice = createSlice({
  name: 'device-management',
  initialState: INITIAL_STATE,
  reducers: {
    setSearchSpacesIds: (state, action: PayloadAction<{ spacesIds: string[] }>) => {
      state.searchSpacesIds = action.payload.spacesIds;
    },
    setSpaces: (state, action: PayloadAction<{ spaces: SpaceModel[] }>) => {
      const { spaces: loadedSpaces } = action.payload;

      state.spaces = {};

      for (const space of loadedSpaces) {
        state.spaces[space.id] = space;
      }
    },
  },
});

export const dmActions = dmSlice.actions;

export default dmSlice.reducer;
