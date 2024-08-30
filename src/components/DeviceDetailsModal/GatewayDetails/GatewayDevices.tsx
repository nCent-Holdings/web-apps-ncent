import React, { useMemo, useRef, useState } from 'react';
import { GatewayModel } from '@src/api-types/models';
import { useSensors } from '@src/api-hooks/sensors/sensorsApi';
import { usePurifiers } from '@src/api-hooks/purifiers/purifiersApi';
import { dumpGatewayModel, dumpPurifierModel, dumpSensorModel } from '@src/routes/client/device-management/dumps';
import GatewayDevice from './GatewayDevice';
import IconDanger from '../../icons/IconDanger';
import IconTickCircle from '../../icons/IconTickCircle';
import { OvalLoader } from '@ncent-holdings/ux-components';
import { alphaSort } from '@src/utils/stringUtils';

type GatewayDevicesProps = {
  gateway: GatewayModel;
};

import './styles.css';
import { twMerge } from 'tailwind-merge';
import { useSiteFromHandleOrLastStored } from '@src/features/useSiteFromHandleOrLastStored';

export const GatewayDevices: React.FC<GatewayDevicesProps> = ({ gateway }: GatewayDevicesProps) => {
  const gatewayModel = dumpGatewayModel(gateway);

  const [scrollDevices, setScrollDevices] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const canScroll = (scrollRef.current?.clientHeight || 0) < (scrollRef.current?.scrollHeight || 0);

  const { siteId: selectedSiteId } = useSiteFromHandleOrLastStored();

  const gatewayId = gateway.id;

  const queryArg = { siteId: selectedSiteId, gatewayId };

  const { sensors: sensorList, isLoading: loadingSensors } = useSensors(queryArg);
  const { purifiers: purifierList, isLoading: loadingPurifiers } = usePurifiers(queryArg);

  const scrollShadows = useMemo(() => {
    let shadows;

    if (scrollRef.current == null) {
      shadows = { top: false, bottom: false };
    } else {
      const currTop = scrollRef.current.scrollTop;
      const cliHeight = scrollRef.current.clientHeight;
      const scrHeight = scrollRef.current.scrollHeight;

      if (!canScroll) {
        shadows = { top: false, bottom: false };
      } else if (currTop === 0) {
        shadows = { top: false, bottom: true };
      } else if (Math.round(currTop + cliHeight) >= scrHeight) {
        shadows = { top: true, bottom: false };
      } else {
        shadows = { top: true, bottom: true };
      }
    }

    return shadows;
  }, [scrollRef.current?.scrollTop, loadingSensors, loadingPurifiers, scrollDevices]);

  const dumpedSensors = sensorList.map((s) => ({
    dump: dumpSensorModel(s),
    orig: s,
  }));
  const dumpedPurifiers = purifierList.map((p) => ({
    dump: dumpPurifierModel(p),
    orig: p,
  }));

  const sensors = useMemo(() => {
    return {
      opt: dumpedSensors
        .filter((s) => !s.dump.isAttentionRequired)
        .sort((a, b) => alphaSort(a.dump.name.toLowerCase(), b.dump.name.toLowerCase())),
      attn: dumpedSensors
        .filter((s) => s.dump.isAttentionRequired)
        .sort((a, b) => alphaSort(a.dump.name.toLowerCase(), b.dump.name.toLowerCase())),
    };
  }, [dumpedSensors]);

  const purifiers = useMemo(() => {
    return {
      opt: dumpedPurifiers
        .filter((p) => !p.dump.isAttentionRequired)
        .sort((a, b) => alphaSort(a.dump.name.toLowerCase(), b.dump.name.toLowerCase())),
      attn: dumpedPurifiers
        .filter((p) => p.dump.isAttentionRequired)
        .sort((a, b) => alphaSort(a.dump.name.toLowerCase(), b.dump.name.toLowerCase())),
    };
  }, [dumpedPurifiers]);

  const loading = useMemo(() => {
    return loadingSensors || loadingPurifiers;
  }, [loadingSensors, loadingPurifiers]);

  const renderAttentionRequired = () => {
    if (sensors.attn.length === 0 && purifiers.attn.length === 0) {
      return <></>;
    }

    return (
      <div className="relative flex flex-1 flex-col">
        <div
          className={twMerge(
            'absolute right-0 top-0 z-50 mr-[-12px] h-full w-[12px]',
            canScroll && 'visible',
            !canScroll && 'invisible',
          )}
          id="gw-device-shadow"
        />
        <div className="flex flex-1 flex-col bg-white-soft-light">
          <div className="flex items-center gap-x-1.5 px-6 pb-5 pt-4 text-bdy font-semibold text-grey-900">
            <div className="h-4 w-4">
              <IconDanger />
            </div>
            <div>Attention required ({sensors.attn.length + purifiers.attn.length})</div>
          </div>
          <div className="h-[6px] w-full rounded-tl bg-alert-issue-medium" />
        </div>
        {sensors.attn.length > 0 && (
          <div className="flex flex-1 flex-col">
            <div className="border-b border-card-stroke bg-grey-light-50 px-6 py-3 text-sm font-medium text-grey-light-900">
              Sensor
            </div>
            {sensors.attn.map((s) => (
              <GatewayDevice
                key={s.dump.id}
                connectivity={s.dump.connectivity}
                isAttentionRequired={s.dump.isAttentionRequired}
                location={s.orig?.['wellcube/location']}
                name={s.dump.name}
                deviceId={s.dump.id}
              />
            ))}
          </div>
        )}
        {purifiers.attn.length > 0 && (
          <div className="flex flex-1 flex-col">
            <div className="border-b border-card-stroke bg-grey-light-50 px-6 py-3 text-sm font-medium text-grey-light-900">
              Purifier
            </div>
            {purifiers.attn.map((p) => (
              <GatewayDevice
                key={p.dump.id}
                deviceId={p.dump.id}
                connectivity={p.dump.connectivity}
                isAttentionRequired={p.dump.isAttentionRequired}
                location={p.orig?.['wellcube/location']}
                name={p.dump.name}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderOperatingOptimally = () => {
    if (sensors.opt.length === 0 && purifiers.opt.length === 0) {
      return <></>;
    }

    return (
      <div className="relative flex flex-1 flex-col">
        <div
          className={twMerge(
            'absolute right-0 top-0 z-50 mr-[-12px] h-full w-[12px]',
            canScroll && 'visible',
            !canScroll && 'invisible',
          )}
          id="gw-device-shadow"
        />
        <div className="flex flex-1 flex-col bg-white-soft-light">
          <div className="flex items-center  gap-x-1.5 px-6 pb-5 pt-4 text-bdy font-semibold text-grey-900">
            <div className="h-4 w-4">
              <IconTickCircle />
            </div>
            <div>Operating optimally ({sensors.opt.length + purifiers.opt.length})</div>
          </div>
          <div className="h-[6px] w-full rounded-tl bg-alert-ok-medium" />
        </div>
        {sensors.opt.length > 0 && (
          <div className="flex flex-1 flex-col">
            <div className="border-b border-card-stroke bg-grey-light-50 px-6 py-3 text-sm font-medium text-grey-light-900">
              Sensor
            </div>
            {sensors.opt.map((s) => (
              <GatewayDevice
                key={s.dump.id}
                connectivity={s.dump.connectivity}
                isAttentionRequired={s.dump.isAttentionRequired}
                location={s.orig?.['wellcube/location']}
                name={s.dump.name}
                deviceId={s.dump.id}
              />
            ))}
          </div>
        )}
        {purifiers.opt.length > 0 && (
          <div className="flex flex-1 flex-col">
            <div className="border-b border-card-stroke bg-grey-light-50 px-6 py-3 text-sm font-medium text-grey-light-900">
              Purifier
            </div>
            {purifiers.opt.map((p) => (
              <GatewayDevice
                key={p.dump.id}
                connectivity={p.dump.connectivity}
                isAttentionRequired={p.dump.isAttentionRequired}
                location={p.orig?.['wellcube/location']}
                name={p.dump.name}
                deviceId={p.dump.id}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleScroll = (evt: React.UIEvent<HTMLDivElement>) => {
    setScrollDevices(evt.currentTarget?.scrollTop || 0);
  };

  const noDevices = !loading && !sensorList?.length && !purifierList?.length;

  return (
    <div className={twMerge('flex flex-1 flex-col items-center', noDevices && 'justify-center')}>
      {loading && sensorList.length === 0 && purifierList.length === 0 && <OvalLoader />}
      {noDevices && <div>No assigned devices</div>}
      {(!loading || sensorList.length > 0 || purifierList.length > 0) && (
        <div
          className={twMerge(
            'relative w-full max-w-[492px] overflow-y-auto overflow-x-hidden transition-all',
            canScroll && 'rounded-b-xl',
            gatewayModel?.connectivity === 'offline' && 'max-h-[592px]',
            gatewayModel?.connectivity !== 'offline' && 'max-h-[611px]',
          )}
          id="gw-device-list"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          <div
            className={twMerge(
              'sticky left-0 top-0 z-40 mt-[-100px] h-[100px] w-full bg-gradient-to-b transition-all',
              scrollShadows.top && 'from-white to-transparent',
              !scrollShadows.top && 'z-[-1] from-transparent to-transparent',
            )}
          />
          {renderAttentionRequired()}
          {renderOperatingOptimally()}
          {/*<div className="sticky bottom-0 left-0 z-40 bg-[#F0F]/10 w-full h-[30px] mt-[-30px]" />*/}
          <div
            className={twMerge(
              'sticky bottom-0 left-0 z-40 mt-[-100px] h-[100px] w-full bg-gradient-to-b transition-all',
              scrollShadows.bottom && 'from-transparent to-white',
              !scrollShadows.bottom && 'z-[-1] from-transparent to-transparent',
            )}
          />
        </div>
      )}
    </div>
  );
};

export default GatewayDevices;
