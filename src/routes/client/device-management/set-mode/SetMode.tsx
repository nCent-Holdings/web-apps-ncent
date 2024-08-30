import { Button, Heading, Modal } from '@ncent-holdings/ux-components';
import React, { useCallback, useEffect, useState } from 'react';
import StandByIcon from './icons/standByIcon.svg?react';
import AutomaticIcon from './icons/automaticIcon.svg?react';
import ManualIcon from './icons/manualIcon.svg?react';
import ManualActiveIcon from './icons/manualActiveIcon.svg?react';
import { FanMode } from '../types';
import { PurifierIcon, SetModeProps, SpeedValues, StatusMessages } from './types';
import * as purifierCoreAPI from '../../../../actions/purifiers';
import FanSpeed from './FanSpeed';
import { usePrevious } from '../../../../hooks/usePrevious';

// import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Tooltip } from '@ncent-holdings/ux-components';
import BadgeStatus from '../../../../components/BadgeStatus/BadgeStatus';
import { Status } from '../../../../components/BadgeStatus/types';
import { dumpPurifierModel } from '../dumps';

const SetMode = ({ openSetMode, handleCloseModal, purifierData, updatePurifierData }: SetModeProps) => {
  const [selectedMode, setSelectedMode] = useState<FanMode>();
  const prevSelectedMode = usePrevious(selectedMode);
  const [fanSpeed, setFanSpeed] = useState<SpeedValues>('25');
  const [updateStatus, setUpdateStatus] = useState<Status | undefined>();
  const { fanMode } = purifierData ?? {};
  const mode = fanMode?.mode;
  const speed = fanMode?.percent?.toString() as SpeedValues;

  useEffect(() => {
    setSelectedMode(mode);
    setFanSpeed(speed);
  }, [purifierData]);

  useEffect(() => {
    const timeId = setTimeout(() => {
      setUpdateStatus(undefined);
    }, 3000);

    if (!selectedMode || selectedMode === mode) return;

    updateSetMode(selectedMode);
    return () => {
      clearTimeout(timeId);
    };
  }, [selectedMode]);

  useEffect(() => {
    if (prevSelectedMode === 'standby') {
      //Default for standby
      setFanSpeed('25');
    } else if (prevSelectedMode === 'auto') {
      setFanSpeed(speed);
    }
  }, [selectedMode, prevSelectedMode]);

  const updateFanSpeed = async (newSpeed: SpeedValues) => {
    if (!purifierData?.id) throw new Error('not id found for purifier.');

    try {
      setUpdateStatus('Saving');
      const deviceUpdated = await purifierCoreAPI.changeFanSpeedPct(purifierData?.id, newSpeed);
      const purifier = dumpPurifierModel(deviceUpdated);
      updatePurifierData(purifier);
      setUpdateStatus('Saved');
    } catch (e) {
      setUpdateStatus('Error');
      console.log('Error updating fan speed:', e);
    }
  };

  const updateSetMode = useCallback(async (newMode: FanMode) => {
    if (!purifierData?.id) throw new Error('not id found for purifier.');

    try {
      setUpdateStatus('Saving');
      const deviceUpdated = await purifierCoreAPI.setMode(purifierData?.id, newMode);
      console.log('New mode updated:', deviceUpdated);
      const purifier = dumpPurifierModel(deviceUpdated);
      updatePurifierData(purifier);
      setUpdateStatus('Saved');
    } catch (e) {
      setUpdateStatus('Error');
      console.log('Error updating setMode:', e);
    }
  }, []);

  const handleModeSelection = (event: React.SyntheticEvent, mode: FanMode) => {
    event.stopPropagation();
    setSelectedMode(mode);
  };

  const purifierIcons: PurifierIcon[] = [
    {
      mode: 'standby',
      icon: <StandByIcon fill="none" />,
      label: 'Standby',
      tooltip: 'Fan off, sensing on',
    },
    {
      mode: 'auto',
      icon: <AutomaticIcon width="0.813rem" height="0.813rem" fill="#292D32" />,
      label: 'Automatic',
      tooltip: 'Recommended Fan speed determined by sensing',
    },
    {
      mode: 'manual',
      icon: <ManualIcon fill="#292D32" width="2rem" />,
      iconActive: <ManualActiveIcon width="2rem" />,
      label: 'Manual',
      tooltip: 'Select fan speed',
    },
  ];

  const renderIcons = () => {
    return (
      <div className="my-10 flex justify-center gap-5">
        {purifierIcons.map((purifier) => {
          let iconElement;
          //Workaround, for manual svg the fill prop doesn't work
          if (purifier.mode === 'manual' && selectedMode == 'manual') {
            iconElement = purifier.iconActive;
          } else {
            iconElement = React.cloneElement(purifier.icon, {
              fill: purifier.mode === selectedMode ? '#FFFFFF' : purifier.icon.props.fill,
            });
          }

          return (
            <div className="flex flex-col items-center p-[10px]" key={purifier.mode}>
              <div
                onClick={(e) => handleModeSelection(e, purifier.mode)}
                data-tooltip-id={`${purifier.label}-tooltip`}
                className={`flex h-[62px] w-[62px] cursor-pointer  ${
                  purifier.mode === selectedMode ? 'bg-blue-brilliant shadow-icon-mode-active' : ''
                } flex-col items-center justify-center rounded-[100px] border border-solid border-blue-suede-light p-[0.938rem]`}
              >
                {iconElement}
              </div>
              <p className="mt-4 font-semibold">{purifier.label}</p>

              <Tooltip tooltipId={`${purifier.label}-tooltip`} tooltipProps={{ place: 'bottom' }}>
                <p className="font-medium" onClick={(event) => event.stopPropagation()}>
                  {purifier.tooltip}
                </p>
              </Tooltip>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Modal onClose={handleCloseModal} open={openSetMode} closeBtnExtendClass="!text-[20px]" modalStyle="max-w-[551px]">
      <div className="flex h-full flex-col">
        <Heading heading="Set Mode" />
        {renderIcons()}
        {selectedMode === 'manual' ? (
          <div className="mb-10">
            <p className="mb-[0.688rem] text-sm font-medium text-black-light">Manual option</p>
            <FanSpeed speed={fanSpeed} handleUpdateSpeed={updateFanSpeed} />
          </div>
        ) : (
          <></>
        )}
        <div className="flex w-full justify-center">
          <Button variant="primary" label="Close" size="large" onClick={handleCloseModal} className="min-w-[120px]" />
        </div>
      </div>
      {updateStatus ? (
        <div className="absolute right-[63px] top-[28px] flex items-center gap-1">
          <BadgeStatus
            status={updateStatus as Status}
            statusMessage={StatusMessages[updateStatus]}
            classExtend="text-[10px]"
          />{' '}
          <span className="text-[#D4DFEA]">|</span>
        </div>
      ) : (
        <></>
      )}
    </Modal>
  );
};

export default SetMode;
