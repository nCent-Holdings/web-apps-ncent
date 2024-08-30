import React from 'react';
import { SquareLoader } from '@ncent-holdings/ux-components';
import useDelayUnmount from '@src/hooks/useDelayUnmount';
import { twMerge } from 'tailwind-merge';

type LoaderOverlayProps = {
  loading: boolean;
  colSpan?: number;
  delay?: number;
  children: React.ReactNode;
};

export const LoaderOverlay = ({ loading, colSpan, delay = 300, children }: LoaderOverlayProps) => {
  const shouldRenderLoading = useDelayUnmount(loading, delay);

  if (colSpan) {
    return shouldRenderLoading ? (
      <tr className={twMerge(!loading ? 'animate-fade-out' : '')} style={{ animationDuration: `${delay}ms` }}>
        <td colSpan={colSpan}>
          <SquareLoader className="flex w-full flex-col items-center justify-center p-[150px]" />
        </td>
      </tr>
    ) : (
      children
    );
  }

  return shouldRenderLoading ? (
    <div className={twMerge(!loading ? 'animate-fade-out' : '')} style={{ animationDuration: `${delay}ms` }}>
      <SquareLoader className="flex w-full flex-col items-center justify-center p-[150px]" />
    </div>
  ) : (
    <div className="animate-fade-in" style={{ animationDuration: `${delay}ms` }}>
      {children}
    </div>
  );
};

export default LoaderOverlay;
