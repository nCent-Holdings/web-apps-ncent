import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Button, Heading } from '@ncent-holdings/ux-components';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { coreAPI } from '../../apiSingleton';
import { get12Hour, getPeriod, get24Hour, getUpdated12HourTime } from '../../utils/timeUtils';

const LEARN_MORE_URL = 'https://support.delos.com/hc/en-us';

interface FleetSettingsModalProps {
  siteId?: string;
  siteSchedule: {
    days: string[];
    time_start: string;
    time_end: string;
  };
  onClose: () => void;
  isOpen: boolean;
}

const DAY_OPTS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const FleetSettingsModal = ({ siteId, siteSchedule, onClose, isOpen }: FleetSettingsModalProps) => {
  const [allowSave, setAllowSave] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [activeDays, setActiveDays] = useState(siteSchedule.days);

  const [startTime, setStartTime] = useState(siteSchedule.time_start ? get12Hour(siteSchedule.time_start) : '');
  const [startPeriod, setStartPeriod] = useState(siteSchedule.time_start ? getPeriod(siteSchedule.time_start) : 'am');

  const [endTime, setEndTime] = useState(siteSchedule.time_end ? get12Hour(siteSchedule.time_end) : '');
  const [endPeriod, setEndPeriod] = useState(siteSchedule.time_end ? getPeriod(siteSchedule.time_end) : 'am');

  useEffect(() => {
    setActiveDays(siteSchedule.days);

    setStartTime(siteSchedule.time_start ? get12Hour(siteSchedule.time_start) : '');
    setStartPeriod(siteSchedule.time_start ? getPeriod(siteSchedule.time_start) : 'am');

    setEndTime(siteSchedule.time_end ? get12Hour(siteSchedule.time_end) : '');
    setEndPeriod(siteSchedule.time_end ? getPeriod(siteSchedule.time_end) : 'am');
  }, [siteSchedule]);

  // Memoize 24-hour times
  const startTime24 = useMemo(() => {
    if (!startTime || !startPeriod) return '';

    return get24Hour(startTime, startPeriod);
  }, [startTime, startPeriod]);

  const endTime24 = useMemo(() => {
    if (!endTime || !endPeriod) return '';

    return get24Hour(endTime, endPeriod);
  }, [endTime, endPeriod]);

  useEffect(() => {
    setSaveError('');

    if (!startTime24) {
      setAllowSave(false);
      return;
    } else if (!endTime24) {
      setAllowSave(false);
      return;
    }

    if (startTime24 && endTime24 && startTime24 >= endTime24) {
      setAllowSave(false);
      setSaveError('Your scheduled end time must be after your scheduled start time.');
      return;
    }
    const isStartValid24HourTime = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(startTime24);

    if (!isStartValid24HourTime) {
      setAllowSave(false);
      setSaveError('Your scheduled start time is not valid.');
      return;
    }

    const isEndValid24HourTime = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(endTime24);

    if (!isEndValid24HourTime) {
      setAllowSave(false);
      setSaveError('Your scheduled end time is not valid.');
      return;
    }

    if (!siteId) {
      setAllowSave(false);
    } else if (!siteSchedule.days.every((day) => activeDays.includes(day))) {
      setAllowSave(true);
    } else if (siteSchedule.days.length !== activeDays.length) {
      setAllowSave(true);
    } else if (startTime24 !== siteSchedule.time_start) {
      setAllowSave(true);
    } else if (endTime24 !== siteSchedule.time_end) {
      setAllowSave(true);
    } else {
      setAllowSave(false);
    }
  }, [siteId, activeDays, startTime24, endTime24]);

  useEffect(() => {
    setSaveError('');
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleSave = async () => {
    if (!siteId) {
      return;
    }

    // Save schedule!
    try {
      await coreAPI.sites.setActiveSchedule({
        siteId,
        days: activeDays,
        time_start: startTime24,
        time_end: endTime24,
      });

      onClose();
    } catch (err: any) {
      const { message: errorMsg } = err as Error;

      setSaveError(errorMsg || 'An error occurred while saving the schedule.');
    }
  };

  const handleSelectDay = (day: string) => {
    if (activeDays.includes(day)) {
      const updActive = activeDays.filter((ad) => ad !== day);
      setActiveDays(updActive);
    } else {
      const updActive = [...activeDays, day];
      setActiveDays(updActive);
    }
  };

  const handleChangeStartTime = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value: newTime } = evt.target;

    // Get the updated value
    const updValue = getUpdated12HourTime(startTime, newTime);

    // If the updated value is null, don't update
    if (updValue === null) return;

    setStartTime(updValue);
  };

  const handleChangeStartPeriod = (evt: ChangeEvent<HTMLSelectElement>) => {
    const { value } = evt.target;

    setStartPeriod(value);
  };

  const handleChangeEndTime = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value: newTime } = evt.target;

    // Get the updated value
    const updValue = getUpdated12HourTime(endTime, newTime);

    // If the updated value is null, don't update
    if (updValue === null) return;

    setEndTime(updValue);
  };

  const handleChangeEndPeriod = (evt: ChangeEvent<HTMLSelectElement>) => {
    const { value } = evt.target;

    setEndPeriod(value);
  };

  const dayButtons = DAY_OPTS.map((day) => {
    const isSelected = activeDays.includes(day);

    return (
      <Button
        key={`btn_${day}`}
        variant="inverse"
        size="medium"
        label={day}
        onClick={() => handleSelectDay(day)}
        className={twMerge(
          'h-[46px] w-[46px] rounded-full text-[12px] font-medium leading-[1.5] tracking-[-0.12px]',
          isSelected && '!border-2 !border-black !bg-white-background',
        )}
      />
    );
  });

  return (
    // TODO: Re-examine / revise so that we don't need to use ! for the custom modal styling
    <>
      <Heading heading="Automated scheduling" />
      <div className="py-8 text-[1rem] leading-[1.5] text-grey-600">
        Create a profile for your site&apos;s typical schedule of operations by selecting when the site is usually
        active and occupied. Selecting days and hours below will help optimize and automate your WellCube system.{' '}
        <Link to={LEARN_MORE_URL} className="text-blue-brilliant underline" target="_blank">
          Learn more
        </Link>{' '}
        about WellCube&apos;s automation capabilities.
      </div>
      <div className="border-b border-b-blue-light-suede" />
      <div className="flex py-8">
        <div>
          <div className="text-h4 text-grey-700">Days</div>
          <div className="">Site is typically active and occupied</div>
          <div className="h-8"></div>
          <div className="flex gap-5">{dayButtons}</div>
        </div>
        <div className="mr-10 w-10 border-r border-r-blue-light-suede" />
        <div>
          <div className="text-h4 text-grey-700">Hours</div>
          <div className="text-bdy text-grey-600">Site is typically active and occupied</div>
          <div className="h-8"></div>
          <div className="flex items-center justify-between">
            <div className="flex gap-[3px]">
              <input
                data-test-id="start-time"
                className={twMerge(
                  'max-w-[85px] rounded-l-xl border-[1.5px] border-[#DEEBF6] bg-white-light p-[15px] pr-[11px]',
                )}
                placeholder="HH:MM"
                value={startTime}
                onChange={handleChangeStartTime}
                style={{
                  boxShadow:
                    '0px 2px 2px 0px rgba(200, 212, 226, 0.35) inset, 2px 2px 4px 0px rgba(177, 197, 213, 0.35) inset',
                }}
              />
              <select
                data-test-id="start-period"
                className={twMerge(
                  'max-w-[65px] rounded-r-xl border-[1.5px] border-[#DEEBF6] bg-white-light px-2 py-[15px]',
                )}
                value={startPeriod}
                onChange={handleChangeStartPeriod}
                style={{
                  boxShadow:
                    '0px 2px 2px 0px rgba(200, 212, 226, 0.35) inset, 2px 2px 4px 0px rgba(177, 197, 213, 0.35) inset',
                }}
              >
                <option value="am">AM</option>
                <option value="pm">PM</option>
              </select>
            </div>
            <div className="mx-[3] flex w-[48px] items-center justify-center">to</div>
            <div className="flex gap-[3px]">
              <input
                data-test-id="end-time"
                className={twMerge(
                  'max-w-[85px] rounded-l-xl border-[1.5px] border-[#DEEBF6] bg-white-light p-[15px] pr-[11px]',
                )}
                placeholder="HH:MM"
                value={endTime}
                onChange={handleChangeEndTime}
                style={{
                  boxShadow:
                    '0px 2px 2px 0px rgba(200, 212, 226, 0.35) inset, 2px 2px 4px 0px rgba(177, 197, 213, 0.35) inset',
                }}
              />
              <select
                data-test-id="end-period"
                className={twMerge(
                  'max-w-[65px] rounded-r-xl border-[1.5px] border-[#DEEBF6] bg-white-light px-2 py-[15px]',
                )}
                value={endPeriod}
                onChange={handleChangeEndPeriod}
                style={{
                  boxShadow:
                    '0px 2px 2px 0px rgba(200, 212, 226, 0.35) inset, 2px 2px 4px 0px rgba(177, 197, 213, 0.35) inset',
                }}
              >
                <option value="am">AM</option>
                <option value="pm">PM</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-b-blue-light-suede" />
      <div className="pt-4 text-bdy text-alert-error">{saveError}</div>
      <div className="flex gap-5 pt-4">
        <Button
          label="Cancel"
          variant="inverse"
          size="large"
          onClick={handleClose}
          className="min-w-[120px] !bg-white-background"
        />
        <Button
          label="Save"
          variant="primary"
          size="large"
          onClick={handleSave}
          disabled={!allowSave}
          className="min-w-[120px]"
        />
      </div>
    </>
  );
};

export default FleetSettingsModal;
