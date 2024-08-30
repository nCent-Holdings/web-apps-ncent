import { twMerge } from 'tailwind-merge';
import React, { useMemo } from 'react';
import { match } from 'ts-pattern';

import IconModeManual from '@components/icons/IconModeManual';
import IconModeStandby from '@components/icons/IconModeStandby';
import { FanMode } from '@src//routes/client/device-management/types';

export const ModeButton = ({
  mode,
  onClick,
  isActive = false,
}: {
  mode: FanMode;
  isActive?: boolean;
  onClick: (mode: FanMode) => void;
}) => {
  const handleClick = () => {
    onClick(mode);
  };

  const modeIcon = useMemo(() => {
    return match(mode)
      .with('auto', () => {
        return (
          <div
            className={twMerge(
              'text-[16.8px] font-medium leading-[175%] text-black-light-soft',
              isActive && 'text-white',
            )}
          >
            A
          </div>
        );
      })
      .with('manual', () => {
        return <IconModeManual height="23" width="23" color={isActive ? '#FFF' : undefined} />;
        // return <div>M</div>;
      })
      .with('standby', () => {
        return <IconModeStandby height="22" width="22" color={isActive ? '#FFF' : undefined} />;
      })
      .otherwise(() => <div></div>);
  }, [mode, isActive]);

  const modeLabel = useMemo(() => {
    return match(mode)
      .with('auto', () => <span>Automatic</span>)
      .with('manual', () => <span>Manual</span>)
      .with('standby', () => <span>Standby</span>)
      .otherwise(() => <span>Unknown</span>);
  }, [mode]);

  return (
    <div
      data-testid={`mode-btn-${mode}`}
      data-active={isActive}
      className={twMerge(
        'flex h-[42px] cursor-pointer items-center gap-x-2 text-bdy font-semibold text-grey-400',
        'transition-all',
        isActive && 'text-black-light-soft',
      )}
      onClick={handleClick}
    >
      <div
        className={twMerge(
          'flex h-[42px] w-[42px] items-center justify-center rounded-full border border-blue-suede-light bg-white',
          'transition-all',
          isActive && 'border-blue-brilliant bg-blue-brilliant text-white shadow-mode-button',
        )}
      >
        {modeIcon}
      </div>
      <div>{modeLabel}</div>
    </div>
  );
};
