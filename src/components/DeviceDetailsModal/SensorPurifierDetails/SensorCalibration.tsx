import React, { useEffect, useRef, useState } from 'react';
import Lottie, { LottieRef } from 'lottie-react';
import { twMerge } from 'tailwind-merge';

import successAnimation from '@assets/animations/calibration_success.json';
import errorAnimation from '@assets/animations/calibration_error.json';

import { Button } from '@ncent-holdings/ux-components';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { LONG_DATE_FORMAT } from '@components/DeviceDetailsModal/common/constants';
import { useSiteFromHandleOrLastStored } from '@src/features/useSiteFromHandleOrLastStored';

dayjs.extend(utc);
dayjs.extend(timezone);

export type SensorCalibrationProps = {
  canCalibrate: boolean;
  onCalibrate: () => void;
  calibrationStatus: string;
  lastCalibratedDate: string | undefined;
};

export const SensorCalibration = ({
  canCalibrate,
  onCalibrate,
  calibrationStatus,
  lastCalibratedDate,
}: SensorCalibrationProps) => {
  const { siteTz } = useSiteFromHandleOrLastStored();

  const calibrationRef: LottieRef | null = useRef(null);
  const errorRef: LottieRef | null = useRef(null);

  const [playingAnimation, setPlayingAnimation] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(true);

  const [calibrationAttempted, setCalibrationAttempted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorCTA, setErrorCTA] = useState(false);

  useEffect(() => {
    if (calibrationStatus === 'error') {
      setIsCalibrating(false);
      setShowError(true);
      handlePlayError();

      if (calibrationAttempted) {
        setErrorCTA(true);
      }
    } else if (calibrationStatus === 'calibrated') {
      setErrorCTA(false);
      setIsCalibrating(false);
      handlePlaySuccess();
    } else if (calibrationStatus === 'calibrating') {
      setCalibrationAttempted(true);
      startCalibrationAnimation();
    }
  }, [calibrationStatus]);

  const handleCalibrateSensors = () => {
    if (onCalibrate) {
      onCalibrate();
    }

    startCalibrationAnimation();
  };

  const startCalibrationAnimation = () => {
    setShowError(false);

    if (!calibrationRef.current) {
      console.warn('REF IS NULL!');
    } else {
      calibrationRef.current?.setDirection(1);
      calibrationRef.current?.goToAndPlay(0);

      errorRef.current?.setDirection(1);
      errorRef.current?.stop();

      setPlayingAnimation(true);
      setIsCalibrating(true);
    }
  };

  const handleSuccessFrame = () => {
    const anim = calibrationRef.current?.animationItem;

    if (!anim?.currentFrame) return;

    if (Math.floor(anim?.currentFrame) === 209 && isCalibrating) {
      console.log('[SuccessFrame] Restarting loop');
      calibrationRef.current?.goToAndPlay(0, true);
    } else if (anim?.currentFrame >= 350 && playingAnimation) {
      console.log('[SuccessFrame] Stopping animation');
      setPlayingAnimation(false);
    }
  };

  const handleErrorFrame = () => {
    const errorAnim = errorRef.current?.animationItem;
    if (!errorAnim?.currentFrame) return;

    if (Math.floor(errorAnim?.currentFrame) === 209 && isCalibrating) {
      console.log('[ErrorFrame] Restarting loop');
      errorRef.current?.goToAndPlay(0, true);
    } else if (errorAnim?.currentFrame >= 350 && playingAnimation) {
      console.log('[ErrorFrame] Stopping animation');
      setPlayingAnimation(false);
    }
  };

  const handlePlaySuccess = () => {
    console.log('[Success] Playing success.');

    errorRef.current?.stop();
    calibrationRef.current?.goToAndPlay(210, true);
  };

  const handlePlayError = () => {
    console.log('[Error] Playing error.');

    calibrationRef.current?.stop();
    errorRef.current?.goToAndPlay(210, true);
  };

  const handleStopAnimation = () => {
    setPlayingAnimation(false);
    calibrationRef.current?.stop();
    errorRef.current?.stop();
  };

  const renderLastCalibratedDate = () => {
    if (!lastCalibratedDate) {
      return <></>;
    }

    const lcDate = parseInt(lastCalibratedDate);
    const lcDay = dayjs.unix(lcDate || 0).tz(siteTz);

    return (
      <div className="flex items-center justify-center gap-x-1.5 text-xs font-medium">
        <div className="text-grey-light-500">Last calibrated</div>
        <div className="text-black-dark">{lcDay.format(LONG_DATE_FORMAT)}</div>
      </div>
    );
  };

  return (
    <>
      <div className="relative flex h-full w-full justify-center">
        <div
          className={twMerge(
            'absolute opacity-0',
            !showError && playingAnimation && 'z-10 opacity-100 transition-opacity delay-500',
            !showError && !playingAnimation && 'transition-opacity delay-500',
          )}
        >
          <Lottie
            animationData={successAnimation}
            lottieRef={calibrationRef}
            onEnterFrame={handleSuccessFrame}
            onComplete={handleStopAnimation}
            onLoopComplete={handleStopAnimation}
            loop={false}
            autoplay={false}
          />
        </div>
        <div
          className={twMerge(
            'absolute opacity-0',
            showError && playingAnimation && 'z-10 opacity-100',
            showError && !playingAnimation && 'transition-opacity delay-500',
          )}
        >
          <Lottie
            animationData={errorAnimation}
            lottieRef={errorRef}
            onEnterFrame={handleErrorFrame}
            onComplete={handleStopAnimation}
            onLoopComplete={handleStopAnimation}
            loop={false}
            autoplay={false}
          />
        </div>
        <div
          className={twMerge(
            'absolute flex h-full w-full flex-col items-center p-6 opacity-100 transition-opacity',
            lastCalibratedDate && 'justify-between',
            !lastCalibratedDate && 'justify-center',
            playingAnimation && 'opacity-0',
            !playingAnimation && 'delay-500',
          )}
        >
          <Button
            variant="primary"
            label={errorCTA ? 'Try again' : 'Calibrate sensors'}
            size="medium"
            className={twMerge(
              'visible max-w-[190px] whitespace-nowrap leading-[18px] tracking-[-0.12px] transition-all duration-500',
              playingAnimation && 'pointer-events-none min-w-0 max-w-0 border-0 p-0',
            )}
            onClick={handleCalibrateSensors}
            disabled={!canCalibrate}
          />
          {renderLastCalibratedDate()}
        </div>
      </div>
    </>
  );
};

export default SensorCalibration;
