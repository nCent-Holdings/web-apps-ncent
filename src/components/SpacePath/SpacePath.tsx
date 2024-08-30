import React from 'react';
import clsx from 'clsx';
import { SpacePathProps } from './types';

export const SpacePath = ({
  fullPath,
  pathSeparator = <i className="icon wcicon-chevron-right" />,
  truncatedSeparator = <span className="text-blue-brilliant">{'...'}</span>,
  truncated = false,
  classExtendWrapper,
  classExtendRow,
}: SpacePathProps) => {
  const separator = ' > ';
  let fullPathArr: Array<string | React.ReactNode> = fullPath.split(separator);

  if (truncated && fullPathArr.length > 2) {
    fullPathArr = [fullPathArr.shift() as string, truncatedSeparator, fullPathArr.pop() as string];
  }

  const fullPathDivs = fullPathArr.map((loc: string | React.ReactNode, locIdx: number) => {
    const isLast = locIdx + 1 >= fullPathArr.length;
    const locKey = typeof loc === 'string' ? `${loc}_${locIdx}` : `${locIdx}`;

    return (
      <div
        className={clsx('flex min-w-0 items-center', isLast && 'font-semibold', classExtendRow && `${classExtendRow}`)}
        key={locKey}
      >
        <div className="truncate">{loc}</div>
        {!isLast && <>{pathSeparator}</>}
      </div>
    );
  });

  return (
    <div
      className={clsx(
        'flex flex-wrap initial:font-medium initial:text-black-soft',
        classExtendWrapper && `${classExtendWrapper}`,
      )}
    >
      {fullPathDivs}
    </div>
  );
};

export default SpacePath;
