import React, { useEffect, useState } from 'react';
import Fan25Icon from './icons/fan25Icon.svg?react';
import Fan50Icon from './icons/fan50Icon.svg?react';
import Fan75Icon from './icons/fan75Icon.svg?react';
import Fan100Icon from './icons/fan100Icon.svg?react';
import { FanSpeedIcon, FanSpeedProps, SpeedValues } from './types';
import { Radio, RadioGroup } from '@ncent-holdings/ux-components';

const fanSpeedIcons: FanSpeedIcon[] = [
  {
    speed: '25',
    icon: <Fan25Icon />,
    label: 'Low',
  },
  {
    speed: '50',
    icon: <Fan50Icon />,
    label: 'Medium',
  },
  {
    speed: '75',
    icon: <Fan75Icon />,
    label: 'High',
  },
  {
    speed: '100',
    icon: <Fan100Icon />,
    label: 'Turbo',
  },
];

const FanSpeed = ({ speed, handleUpdateSpeed }: FanSpeedProps) => {
  const [selectedSpeed, setSelectedSpeed] = useState<SpeedValues>('25');
  const [isNewSpeed, setIsNewSpeed] = useState(false);

  const handleChangeSpeed = (newSpeed: string) => {
    setIsNewSpeed(true);
    setSelectedSpeed(newSpeed as SpeedValues);
  };

  useEffect(() => {
    setSelectedSpeed(speed);
  }, [speed]);

  useEffect(() => {
    if (isNewSpeed) {
      handleUpdateSpeed(selectedSpeed);
    }
  }, [selectedSpeed]);

  return (
    <RadioGroup
      direction="horizontal"
      name="layout-radio"
      value={selectedSpeed}
      onChange={() => {
        /* DO NOTHING */
      }}
      className="gap-0"
    >
      <div className="flex flex-wrap gap-3">
        {fanSpeedIcons.map((fan) => {
          return (
            <div
              key={fan.speed}
              onClick={() => handleChangeSpeed(fan.speed)}
              className={`flex h-[58px] cursor-pointer ${
                selectedSpeed === fan.speed ? 'bg-[#ECF4FA]' : ''
              }  basis-[143px] items-center gap-[6px] rounded-xl border-[1.5px] border-solid border-grey-100 px-2 py-4`}
            >
              {fan.icon}
              <span className="text-[0.875rem] font-semibold text-grey-700">{fan.label}</span>
              <div className="ml-auto cursor-pointer">
                <Radio id={fan.label} value={fan.speed} label="" labelClass="text-sm cursor-pointer" />
              </div>
            </div>
          );
        })}
      </div>
    </RadioGroup>
  );
};

export default FanSpeed;
