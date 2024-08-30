import React, { useState } from 'react';

export enum AUTH_STATUSES {
  AUTHORIZED,
  NOT_AUTHORIZED,
}

const INITIAL_VALUE = {
  authStatus: AUTH_STATUSES.NOT_AUTHORIZED,
  setAuthStatus: (value: AUTH_STATUSES): void => console.log('Set authStatus', { value }),
};

export const SessionContext = React.createContext(INITIAL_VALUE);

SessionContext.displayName = 'SessionContext';

export const SessionProvider = (props: React.PropsWithChildren) => {
  const [authStatus, setAuthStatus] = useState(INITIAL_VALUE.authStatus);

  return <SessionContext.Provider value={{ authStatus, setAuthStatus }}>{props.children}</SessionContext.Provider>;
};
