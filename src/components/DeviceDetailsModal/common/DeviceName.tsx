import React, { useLayoutEffect, useRef, useState } from 'react';
import { Tooltip } from '@ncent-holdings/ux-components';
import { twMerge } from 'tailwind-merge';

type DeviceNameProps = {
  name: string;
  model: string | undefined;
  classExtend?: string | undefined;
  modelClassExtend?: string;
};

export const DeviceName: React.FC<DeviceNameProps> = ({ name, model, classExtend, modelClassExtend }) => {
  const [nameString, setNameString] = useState(name.replace(/([a-z])([A-Z])/g, '$1\u200B$2').replace(/_/g, '$&\u200B'));
  const spanRef = useRef<HTMLElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const divh = divRef.current ? divRef.current.clientHeight + 1 : undefined;
    const spanh = spanRef.current?.offsetHeight;

    if (spanh && divh && spanh > divh) {
      setNameString(nameString.replace(/\W*(\s|\u200B)([^\s\u200B])*$/, '...'));
    }
  }, [name, nameString]);

  return (
    <>
      <div className={twMerge('mb-1.5 text-mini font-medium', modelClassExtend)}>{model || 'Unknown'}</div>
      <div
        className={twMerge(
          'line-clamp-2 w-full text-[1.125rem] font-semibold leading-[1.15] text-blue-brilliant',
          classExtend,
        )}
        data-tooltip-id={`${name}_${model}`}
        ref={divRef}
      >
        <span className="text-grey-900" ref={spanRef}>
          {name}
        </span>
      </div>
      <Tooltip tooltipId={`${name}_${model}`} singleLine tooltipProps={{ place: 'bottom-start' }}>
        {name}
      </Tooltip>
    </>
  );
};

export default DeviceName;
