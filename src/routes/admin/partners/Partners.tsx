import React from 'react';
import { Heading } from '@ncent-holdings/ux-components';
import ScrollVisibleElement from '../../../components/ScrollVisibleElement/ScrollVisibleElement';

export const Partners = () => {
  return (
    <>
      <ScrollVisibleElement scrollTitle="Partners">
        <Heading heading="Partners" />
      </ScrollVisibleElement>
      <div className="h-[3.25rem]" />
      <div className="flex w-full max-w-[46rem] flex-col gap-[0px] p-0">PARTNERS PAGE CONTENT GOES HERE</div>
    </>
  );
};

export default Partners;
