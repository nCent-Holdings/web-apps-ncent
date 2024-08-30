import React, { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { match } from 'ts-pattern';
import IconRadioSelected from '@components/icons/IconRadioSelected';
import { FAN_SPEED, FanCfm } from '@src/routes/client/device-management/types';

interface FanSpeedButtonProps {
  speed: FanCfm;
  isActive?: boolean;
  disabled?: boolean;
  onClick: (speed: number) => void;
}

export const FanSpeedButton = ({ speed = FAN_SPEED.LOW, onClick, isActive, disabled = false }: FanSpeedButtonProps) => {
  const speedLabel = useMemo(() => {
    return match(speed)
      .with(FAN_SPEED.LOW, () => <span>Low</span>)
      .with(FAN_SPEED.MEDIUM, () => <span>Medium</span>)
      .with(FAN_SPEED.HIGH, () => <span>High</span>)
      .with(FAN_SPEED.TURBO, () => <span>Turbo</span>)
      .otherwise(() => <span>Unknown</span>);
  }, [speed]);

  const handleClick = () => {
    if (disabled) {
      return;
    }

    onClick(speed);
  };

  return (
    <div
      className={twMerge(
        'flex cursor-pointer items-center gap-x-2.5 transition-all',
        disabled && 'pointer-events-none',
      )}
      onClick={handleClick}
    >
      <div className={twMerge('relative h-[22px] w-[22px] rounded-full border border-grey-200 p-[1.5px]')}>
        <div
          className={twMerge(
            'absolute flex items-center justify-center rounded-full opacity-0',
            'transition-all',
            isActive && 'opacity-100',
          )}
        >
          <IconRadioSelected />
        </div>
      </div>
      <div className={twMerge('text-sm font-medium text-black-light-soft', disabled && 'text-grey-400')}>
        {speedLabel}
      </div>
    </div>
  );
};

export default FanSpeedButton;
