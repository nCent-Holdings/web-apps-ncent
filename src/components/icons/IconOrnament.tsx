import React from 'react';

export const IconOrnament = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 368 368"
        fill="none"
        style={{
          position: 'absolute',
          inset: 0,
          filter: 'drop-shadow(.25em .25em .5em rgb(0 0 0 / 0.5))',
        }}
      >
        <g clipPath="url(#a)">
          <path
            fill="#FBFDFF"
            stroke="url(#b)"
            d="M23.3652 206.56V273.698C23.3652 308.382 51.4826 336.5 86.1671 336.5H273.082C307.767 336.5 335.884 308.382 335.884 273.698V85.8014C335.884 51.1169 307.767 22.9995 273.082 22.9995H131.092V38.2011H273.082C299.371 38.2011 320.682 59.5125 320.682 85.8014V273.698C320.682 299.987 299.371 321.298 273.082 321.298H86.1671C59.8782 321.298 38.5668 299.987 38.5668 273.698V206.56H23.3652Z"
          ></path>
        </g>
        <defs>
          <linearGradient id="b" x1="369.618" y1="-146.306" x2="-5.91234" y2="-146.306" gradientUnits="userSpaceOnUse">
            <stop stopColor="#CEDCEB"></stop>
            <stop offset="1" stopColor="#fff"></stop>
          </linearGradient>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h419v420H0z"></path>
          </clipPath>
        </defs>
      </svg>
    </>
  );
};

export default IconOrnament;
