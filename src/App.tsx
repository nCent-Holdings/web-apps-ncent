import React, { useCallback, useState } from 'react';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-2_OEUcpqpQQ',
      userPoolClientId: '52ogd2jsni4lvfe1drtf45qhek',
    },
  },
});

import { Splash } from './routes/common';
import appRouter from './routes/AppRouter';

import useSession from './api-hooks/session/useSession';
import { registerReconnectHandler } from './actions/connection';

function App() {
  const [initialized, setInitialized] = useState(false);
  const [, sessionAPI] = useSession();

  const restore = useCallback(async () => {
    try {
      await sessionAPI.restore();
      registerReconnectHandler();
    } catch (error) {
      console.log('Restore failed', error);
    } finally {
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    restore();
  }, []);

  if (!initialized) {
    return <Splash />;
  }

  return <RouterProvider router={appRouter} />;
}

export default App;
