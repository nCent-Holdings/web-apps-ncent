import React, { useState } from 'react';
import ScrollVisibleElement from '../../../components/ScrollVisibleElement/ScrollVisibleElement';
import { Button, Dropdown, Heading } from '@ncent-holdings/ux-components';
import CustomDatePicker from './CustomDatePicker';

type Option = {
  id: string;
  value: string;
  label?: string;
};

export const ClientReporting = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [range, setRange] = useState<Option>();
  const [frequency, setFrequency] = useState<Option>();

  function handleSelectRange(options: Option[]) {
    setRange(options[0]);

    if (options[0]?.value !== '1') {
      setStartDate(null);
      setEndDate(null);
    }
  }

  function handleSelectFrequency(options: Option[]) {
    setFrequency(options[0]);
  }

  return (
    <>
      <ScrollVisibleElement scrollTitle="Reporting">
        <Heading heading="Reporting" />
      </ScrollVisibleElement>
      <div className="h-[3.25rem]" />
      <div className="max-w-[977px] rounded-xl border border-[#d4dfea] bg-white p-11 pb-24">
        <p className="text-h4 font-semibold">Export a report</p>
        <p className="border-b border-[#d4dfea] py-9 text-grey-600">
          Download a CSV-formatted report of the data captured by your WellCube system.
        </p>
        <p className="mb-3 mt-9 text-h5 text-grey-700">Time period</p>
        <p className="mb-9 text-grey-600">Select the time period for your report</p>
        <Dropdown
          options={[
            { id: '1', value: '1', label: 'Specific date range' },
            { id: '2', value: '2', label: 'Year-to-date' },
            { id: '3', value: '3', label: 'All time' },
          ]}
          handleSelection={handleSelectRange}
          containerClassExtend="max-w-[602px]"
          value={range}
        />
        <div className="mt-9 flex max-w-[602px] justify-between">
          <div>
            <div className="mb-3">From</div>
            <CustomDatePicker
              value={startDate}
              onChange={setStartDate}
              disabled={range?.value !== '1'}
              inputClasses="w-[288px]"
            />
          </div>
          <div>
            <div className="mb-3">To</div>
            <CustomDatePicker
              value={endDate}
              onChange={setEndDate}
              disabled={range?.value !== '1'}
              inputClasses="w-[288px]"
            />
          </div>
        </div>

        <p className="mb-3 mt-9 border-t border-[#d4dfea] pt-9 text-h5 text-grey-700">Reporting frequency</p>
        <p className="mb-9 text-grey-600">
          Your WellCube system collects thousands of data points daily. To limit the volume of data in your report,
          select a period to see data averages.
        </p>
        <Dropdown
          options={[
            { id: '1', value: '1', label: 'No averages (minute-by-minute)' },
            { id: '2', value: '2', label: 'Hourly averages' },
            { id: '3', value: '3', label: 'Daily averages' },
          ]}
          handleSelection={handleSelectFrequency}
          containerClassExtend="max-w-[602px]"
          value={frequency}
        />

        <Button label="Download CSV" className="mt-9" variant="primary" />
      </div>
    </>
  );
};

export default ClientReporting;
