import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import listenerMiddleware from './listenerMiddleware';
import { useDispatch } from 'react-redux';

import { apiKeysApi } from '../api-hooks/api-keys/apiKeysApi';
import { nvaApi } from '@src/api-hooks/nvaApi';

const preloadedState = {};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(nvaApi.middleware, apiKeysApi.middleware);
  },
  devTools: {
    name: 'web-apps-wellcube',
  },
  preloadedState,
  // Specify enhancers here
  enhancers: [],
});

// if (process.env.NODE_ENV !== 'production' && (module as any).hot) {
//   (module as any).hot.accept([], () => store.replaceReducer(rootReducer));
// }

export function resetApp() {
  store.dispatch(nvaApi.util.resetApiState());
  store.dispatch(apiKeysApi.util.resetApiState());
}

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
