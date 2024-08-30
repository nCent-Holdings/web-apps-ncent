import React from 'react';

export const IconModeStandby = ({
  color = '#292D32',
  width = '23',
  height = '22',
}: {
  color?: string;
  width?: string;
  height?: string;
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 23 22" fill="none">
      <path
        d="M16.9398 16.6317C15.4174 17.7774 13.5324 18.3348 11.6317 18.2013C9.73102 18.0678 7.94247 17.2523 6.59516 15.905C5.24785 14.5577 4.43242 12.7692 4.29891 10.8685C4.1654 8.96776 4.72278 7.08278 5.86851 5.56035C6.75072 4.39373 7.93616 3.49157 9.2957 2.95215C8.9845 4.36297 9.03368 5.82945 9.43869 7.21626C9.84371 8.60306 10.5915 9.86551 11.6131 10.8871C12.6347 11.9087 13.8971 12.6565 15.2839 13.0615C16.6707 13.4665 18.1372 13.5157 19.548 13.2045C19.0086 14.564 18.1065 15.7495 16.9398 16.6317Z"
        fill="white"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default IconModeStandby;
