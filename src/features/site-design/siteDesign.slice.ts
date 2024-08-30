import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AppStartListening } from '@src/app-store/listenerMiddleware';
import { SpaceModel } from '@src/api-types/models';

const INITIAL_STATE: {
  spaces: { [key: string]: SpaceModel };
  spacesTree: {
    parentToChildren: { [key: string]: string[] };
    childToParent: { [key: string]: string };
  };
  expansionStatus: { [key: string]: boolean };
  expandDescTree: { [key: string]: boolean };
  allExpanded: boolean;

  selectedSpaceId: string;
  selectedDeviceId: string;
} = {
  spaces: {},
  spacesTree: { parentToChildren: {}, childToParent: {} },
  expansionStatus: {},
  expandDescTree: {},
  allExpanded: false,

  selectedSpaceId: '',
  selectedDeviceId: '',
};

export const siteDesignSlice = createSlice({
  name: 'site-design',
  initialState: INITIAL_STATE,
  reducers: {
    setSpaces: (state, action: PayloadAction<{ spaces: SpaceModel[] }>) => {
      const { spaces: loadedSpaces } = action.payload;

      state.spaces = {};
      state.spacesTree = { parentToChildren: {}, childToParent: {} };

      for (const space of loadedSpaces) {
        state.spaces[space.id] = space;

        const parentId = space?.['wellcube/space']?.parent_space_id || '';

        // Set default expansion state
        if (state.expansionStatus[space.id] === undefined) {
          const expandParentDesc = state.expandDescTree[parentId] === true;

          state.expansionStatus[space.id] = expandParentDesc || state.allExpanded;

          if (expandParentDesc) {
            state.expandDescTree[space.id] = true;
          }
        }

        // Add space to parent spaces children
        if (!state.spacesTree.parentToChildren[parentId]) {
          state.spacesTree.parentToChildren[parentId] = [];
        }

        state.spacesTree.parentToChildren[parentId].push(space.id);
        state.spacesTree.childToParent[space.id] = parentId;
      }

      // Cleanup missing spaces data
      const allSpaceIds = Object.keys(state.spaces);
      const loadedSpaceIds = loadedSpaces.map((space) => space.id);
      const missingSpaceIds = allSpaceIds.filter((id) => !loadedSpaceIds.includes(id));

      for (const missingId of missingSpaceIds) {
        delete state.spaces[missingId];
        delete state.expansionStatus[missingId];
        delete state.expandDescTree[missingId];
        delete state.spacesTree.parentToChildren[missingId];
        delete state.spacesTree.childToParent[missingId];
      }
    },

    updateSpace: (state, action: PayloadAction<{ space: SpaceModel }>) => {
      const { space } = action.payload;

      // Update spacesTree
      const oldParentId = state.spacesTree.childToParent[space.id] || '';
      const newParentId = space?.['wellcube/space']?.parent_space_id || '';

      if (oldParentId !== newParentId) {
        state.spacesTree.parentToChildren[oldParentId] = state.spacesTree.parentToChildren[oldParentId].filter(
          (spaceId) => spaceId !== space.id,
        );

        if (!state.spacesTree.parentToChildren[newParentId]) {
          state.spacesTree.parentToChildren[newParentId] = [];
        }
        state.spacesTree.parentToChildren[newParentId].push(space.id);

        state.spacesTree.childToParent[space.id] = newParentId;
      }

      state.spaces[space.id] = space;
    },
    addSpace: (state, action: PayloadAction<{ space: SpaceModel }>) => {
      const { space } = action.payload;

      // Add space to parent spaces children
      const parentId = space?.['wellcube/space']?.parent_space_id || '';

      if (!state.spacesTree.parentToChildren[parentId]) {
        state.spacesTree.parentToChildren[parentId] = [];
      }

      state.spacesTree.parentToChildren[parentId].push(space.id);
      state.spacesTree.childToParent[space.id] = parentId;

      state.spaces[space.id] = space;
    },
    deleteSpace: (state, action: PayloadAction<{ spaceId: string }>) => {
      const { spaceId } = action.payload;

      // Clear selected
      if (state.selectedSpaceId === spaceId) {
        state.selectedSpaceId = '';
      }

      // Filter space from parent spaces children
      const parentId = state.spacesTree.childToParent[spaceId] || '';
      const updatedParentToChildren = state.spacesTree.parentToChildren[parentId].filter((id) => id !== spaceId);

      state.spacesTree.parentToChildren[parentId] = updatedParentToChildren;

      // Clear
      delete state.spaces[spaceId];
      delete state.expansionStatus[spaceId];
      delete state.expandDescTree[spaceId];
      delete state.spacesTree.childToParent[spaceId];
    },

    expandSpace: (state, action: PayloadAction<{ spaceId: string }>) => {
      const { spaceId } = action.payload;

      state.expansionStatus[spaceId] = true;
    },
    collapseSpace: (state, action: PayloadAction<{ spaceId: string }>) => {
      const { spaceId } = action.payload;

      state.expansionStatus[spaceId] = false;
    },
    expandAll: (state) => {
      state.allExpanded = true;

      for (const [key] of Object.entries(state.expansionStatus)) {
        state.expansionStatus[key] = true;
      }
    },
    collapseAll: (state) => {
      state.allExpanded = false;

      for (const [key] of Object.entries(state.expansionStatus)) {
        state.expansionStatus[key] = false;
      }
    },
    expandDescendants: (state, action: PayloadAction<{ spaceId: string }>) => {
      const { spaceId } = action.payload;

      state.expansionStatus[spaceId] = true;
      state.expandDescTree[spaceId] = true;

      const childSpaceIds = state.spacesTree.parentToChildren[spaceId] || [];

      for (const cSpaceId of childSpaceIds) {
        state.expansionStatus[cSpaceId] = true;

        // Collapse descendants for this
        state.expandDescTree[cSpaceId] = true;
      }
    },
    collapseDescendants: (state, action: PayloadAction<{ spaceId: string }>) => {
      const { spaceId } = action.payload;

      state.expansionStatus[spaceId] = false;
      state.expandDescTree[spaceId] = false;

      const childSpaceIds = state.spacesTree.parentToChildren[spaceId] || [];

      for (const cSpaceId of childSpaceIds) {
        state.expansionStatus[cSpaceId] = false;

        // Collapse descendants for this
        state.expandDescTree[cSpaceId] = false;
      }
    },
    expandParentSpace: (state, action: PayloadAction<{ spaceId: string }>) => {
      const { spaceId } = action.payload;
      const parentSpaceId = state.spaces[spaceId]?.['wellcube/space']?.parent_space_id;

      if (parentSpaceId) {
        state.expansionStatus[parentSpaceId] = true;
      }
    },

    setSelectedSpaceId: (state, action: PayloadAction<{ spaceId?: string }>) => {
      state.selectedSpaceId = action.payload.spaceId || '';
      state.selectedDeviceId = '';
    },

    setSelectedDeviceId: (state, action: PayloadAction<{ deviceId?: string }>) => {
      state.selectedDeviceId = action.payload.deviceId || '';
      state.selectedSpaceId = '';
    },

    clear: (state) => {
      state.spaces = INITIAL_STATE.spaces;
      state.spacesTree = INITIAL_STATE.spacesTree;
      state.expansionStatus = INITIAL_STATE.expansionStatus;
      state.expandDescTree = INITIAL_STATE.expandDescTree;
      state.allExpanded = INITIAL_STATE.allExpanded;

      state.selectedSpaceId = INITIAL_STATE.selectedSpaceId;
      state.selectedDeviceId = INITIAL_STATE.selectedDeviceId;
    },
  },
});

export const siteDesignActions = siteDesignSlice.actions;

export const addSiteDesignListeners = (startListening: AppStartListening) => {
  startListening({
    actionCreator: siteDesignActions.expandDescendants,
    effect: (action, listenerApi) => {
      const { spaceId } = action.payload;

      // Get the list of descendant space IDs
      const childSpaceIds = listenerApi.getState().siteDesign.spacesTree.parentToChildren[spaceId] || [];

      // for each descendant, call expandDescendants for its children
      for (const cSpaceId of childSpaceIds) {
        listenerApi.dispatch(siteDesignActions.expandDescendants({ spaceId: cSpaceId }));
      }

      // Essentially recursively call expand descendants until we're out of child spaces
    },
  });

  startListening({
    actionCreator: siteDesignActions.collapseDescendants,
    effect: (action, listenerApi) => {
      const { spaceId } = action.payload;

      // Get the list of descendant space IDs
      const childSpaceIds = listenerApi.getState().siteDesign.spacesTree.parentToChildren[spaceId] || [];

      // for each descendant, call collapseDescendants for its children
      for (const cSpaceId of childSpaceIds) {
        listenerApi.dispatch(siteDesignActions.collapseDescendants({ spaceId: cSpaceId }));
      }
    },
  });
};

export default siteDesignSlice.reducer;
