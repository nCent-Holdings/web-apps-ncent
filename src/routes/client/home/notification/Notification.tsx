import React, { useEffect, useState } from 'react';
import { Button } from '@ncent-holdings/ux-components';
import { twMerge } from 'tailwind-merge';
import { useSiteFromHandleOrLastStored } from '@src/features/useSiteFromHandleOrLastStored';

type StageData = {
  header: string;
  message: string;
  buttonLabel: string;
  handler: () => void;
};

const stageData: { [key: string]: StageData } = {
  firstSite: {
    header: "It's time to setup your first site",
    message: 'Contact your Technical Sales Manager to get started',
    buttonLabel: 'CONTACT TECHNICAL SALES',
    handler: () => (window.location.href = `mailto:your.manager@mail.com?subject=Help creating our first site`),
  },
  schedule: {
    header: "It's time to schedule the installation",
    message: 'Connect with your Installer Team today to get started',
    buttonLabel: 'CONTACT INSTALLER',
    handler: () => (window.location.href = `mailto:your.manager@mail.com?subject=Help scheduling our installation`),
  },
  installation: {
    header: 'Get ready for your installation',
    message:
      'Your installer team will be arriving on site soon to configure your WellCube system. Visit our Installation Guide to learn more.',
    buttonLabel: 'INSTALLATION GUIDE',
    handler: () => window.open('https://support.delos.com', '_blank'),
  },
  addSpace: {
    header: "It's time to create your system design",
    message: 'Contact your Technical Sales Manager to set up your site and get started with WellCube.',
    buttonLabel: 'CONTACT TECHNICAL SALES',
    handler: () => (window.location.href = `mailto:your.manager@mail.com?subject=Help creating our system design`),
  },
};

const Notification = () => {
  const { site: selectedSite, isLoading: loadingSite } = useSiteFromHandleOrLastStored();

  const [showMessage, setShowMessage] = useState(true);
  const [stage, setStage] = useState('');

  useEffect(() => {
    if (!loadingSite) {
      if (!selectedSite) setStage('firstSite');
      else if (!selectedSite?.['wellcube/spaces']?.meta.total_spaces) setStage('addSpace');
      else if (selectedSite?.['wellcube/site']?.status === 'Pending Installation') setStage('schedule');
      else if (selectedSite?.['wellcube/site']?.status === 'Scheduled') setStage('installation');
      else setStage('');
    }
  }, [selectedSite, loadingSite]);

  if (!stage) return null;

  return (
    <div
      className={twMerge(
        'relative top-[-3.5rem] mx-auto w-[656px] rounded-b-xl bg-blue-brilliant px-10 pb-12 pt-5 text-center text-white transition-all',
      )}
    >
      <p className="text-[28px] leading-[35px]">{stageData[stage]?.header}</p>
      <div
        className={twMerge(
          'flex h-full w-full flex-col items-center overflow-hidden transition-all',
          showMessage && 'max-h-[300px]',
          !showMessage && 'max-h-0',
        )}
      >
        <p className="mt-2">{stageData[stage]?.message}</p>
        <Button
          label={stageData[stage]?.buttonLabel}
          className="mt-[30px] h-10 rounded-full text-[14px] text-black"
          onClick={stageData[stage]?.handler}
        />
      </div>
      <Button
        icon={
          showMessage ? (
            <i className="icon icon-16 wcicon-chevron-up" />
          ) : (
            <i className="icon icon-16 wcicon-chevron-down" />
          )
        }
        size="small"
        variant="secondary"
        className="absolute bottom-0 left-[50%] h-auto min-w-0 translate-x-[-50%] translate-y-[50%] border-0 p-2"
        onClick={() => setShowMessage(!showMessage)}
      />
    </div>
  );
};

export default Notification;
