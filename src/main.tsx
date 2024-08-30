import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import './lib/registerLIVRExtraRules';

import { SessionProvider } from './api-hooks/session/Context';
import appStore from './app-store';
import App from './App';
import { Provider as AppStoreProvider } from 'react-redux';
import { AppContextProvider } from './contexts/AppContextProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <SessionProvider>
    <AppStoreProvider store={appStore}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </AppStoreProvider>
  </SessionProvider>,
);
