import { addListener, createListenerMiddleware } from '@reduxjs/toolkit';

import type { TypedStartListening, TypedAddListener } from '@reduxjs/toolkit';
import type { RootState, AppDispatch } from './store';
import { addSiteDesignListeners } from '../features/site-design/siteDesign.slice';

const listenerMiddleware = createListenerMiddleware();

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const startAppListening = listenerMiddleware.startListening as AppStartListening;
export const addAppListener = addListener as TypedAddListener<RootState, AppDispatch>;

// Feature listeners go here
addSiteDesignListeners(startAppListening);

export default listenerMiddleware;
