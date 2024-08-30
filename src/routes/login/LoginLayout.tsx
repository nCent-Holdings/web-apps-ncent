import React from 'react';
import { useLocation } from 'react-router-dom';
import IconOrnament from '@components/icons/IconOrnament';

const REGISTER_ROUTES = {
  SALES_MANAGER: '/register/sales-manager',
  NEW_USER: '/register/new-user',
};

const REGISTER_BOX_MESSAGES = {
  [REGISTER_ROUTES.SALES_MANAGER]: 'Address the needs of your evolved workspace with WellCube.',
  [REGISTER_ROUTES.NEW_USER]: 'Welcome to the WellCube portal. Manage your clients within.',
};

export const LoginLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { pathname } = useLocation();
  const registerBoxMessage = REGISTER_BOX_MESSAGES[pathname];

  const renderIndoorsOptimizedBox = () => {
    return (
      <div className="relative left-[20%] top-[15%] z-10 aspect-square w-full max-w-[6.8em] text-[48px]">
        <div className="absolute inset-[.74em] -z-10 rounded-[0.9em] backdrop-blur-[0.06em]"></div>
        <div className="mt-[.8em] text-[1em] font-semibold leading-[1.25em] text-white">
          Indoors,
          <br />
          optimized.
        </div>
        <div className="mx-auto mt-[2.2em] max-w-[12.5em] text-base font-light tracking-[.02em] text-white">
          {registerBoxMessage}
        </div>
        <IconOrnament />
      </div>
    );
  };

  return (
    <div className="min-w-screen flex min-h-screen flex-col items-center justify-center">
      <div className="relative flex min-h-screen w-full">
        <div className="flex flex-1 justify-center rounded-tr-3xl bg-white-background pb-[73px] pt-[160px]">
          {children}
        </div>
        <div className="relative -z-10 hidden flex-1 flex-col lg:flex">
          {registerBoxMessage && renderIndoorsOptimizedBox()}
          <div className="absolute -left-[20px] bottom-0 right-0 top-0">
            <img
              alt="Office desk"
              src="/images/OfficeDesk.jpg"
              width="646"
              height="1077"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
