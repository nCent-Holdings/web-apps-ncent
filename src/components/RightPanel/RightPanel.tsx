import React from 'react';
import { useAppNav } from '@src/contexts/AppNavContext/AppNavContext';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const RightPanel = () => {
  const appNav = useAppNav();

  return (
    <>
      {/* Backdrop */}
      <div
        data-test-id="rpanel-backdrop"
        className={twMerge(
          'fixed inset-0 bg-black-soft p-8 opacity-[0.15] mix-blend-multiply',
          appNav.rightPanelState === 'overlay' && 'visible',
          appNav.rightPanelState !== 'overlay' && 'invisible',
        )}
      ></div>
      <div
        className={clsx(
          'fixed bottom-0 right-0 top-[var(--topnav-height)] flex-[0_0_auto] ',
          // !appNav.isRightPanelVisible && 'hidden',
        )}
      >
        <div
          className={twMerge(
            'absolute bottom-0 right-0 top-0 isolate  flex h-[calc(100vh-var(--topnav-height))] flex-col overflow-y-auto border-l border-l-[#C1DBEA] bg-white',
            '[.l0.r1_&]:w-[var(--right-panel-width)] [.l0.r2_&]:w-[var(--right-panel-width-full)] [.l1.r1_&]:w-[var(--right-panel-width)] [.l1.r2_&]:w-[var(--right-panel-width-full)]',
            'transition-all',
            !appNav.isRightPanelVisible && 'pointer-events-none w-0',
          )}
        >
          {appNav.rightPanelContent}
        </div>
      </div>
    </>
  );
};

export default RightPanel;
