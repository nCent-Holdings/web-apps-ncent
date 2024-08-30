import React from 'react';
import { dataNavigation } from './data';
import { Link } from 'react-router-dom';
import { useFullScreenColor } from '../../../../hooks/useFullScreenColor';

const GuidingNavigation = () => {
  const fullScreenStyle = useFullScreenColor('#F8FCFF');
  return (
    <div className="py-[3.75rem]" style={fullScreenStyle}>
      <div className="flex flex-col gap-10">
        <h2 className="text-h2">Get started</h2>
        <div className="flex justify-between">
          {dataNavigation.map((data) => (
            <div key={data.title} className="flex basis-[230px] flex-col items-center">
              <div className="mb-[.625rem]">{data.image}</div>
              <p className="my-4 text-h4 font-bold text-[#101828]">{data.title}</p>
              <p className="text-center">{data.content}</p>
              <div className="mt-6 flex items-center">
                <Link className="text-[.875rem] font-medium text-blue-brilliant" to={data.link}>
                  {'View More'}
                </Link>
                <span className="flex items-center text-blue-brilliant">
                  <i className="icon wcicon-chevron-right" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuidingNavigation;
