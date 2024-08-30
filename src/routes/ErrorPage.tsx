import React, { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorImg from '../assets/illustration404.svg?react';
import { Button } from '@ncent-holdings/ux-components';
import { useAppNav } from '@src/contexts/AppNavContext/AppNavContext';

export const ErrorPage = () => {
  const navigate = useNavigate();
  const appNav = useAppNav();

  const handleReturnHome = () => {
    navigate('/');
  };

  useLayoutEffect(() => {
    appNav.hideLeftNav();

    return () => appNav.expandLeftNav();
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center " id="error-page">
      <ErrorImg />
      <h2 className=" mt-8 max-w-[25rem] text-center text-[2.5rem] text-h2 font-semibold leading-[1.25] tracking-[-.125rem]">
        <span className="sm:inline-block">The page you&apos;re</span>{' '}
        <span className="sm:inline-block">looking for doesn&apos;t exist.</span>
      </h2>
      <p className="my-5 text-[1.5rem] leading-[1.25] tracking-[-.0625rem] text-[#475467]">
        Take a deep breath and return home.
      </p>
      <div className="mt-7">
        <Button variant="primary" label="Home" size="large" onClick={handleReturnHome} className="min-w-[120px]" />
      </div>
    </div>
  );
};

export default ErrorPage;
