import React from 'react';
import ScrollVisibleElement from '../../../components/ScrollVisibleElement/ScrollVisibleElement';
import { Heading } from '@ncent-holdings/ux-components';

export const TermsAndConditions = () => {
  return (
    <>
      <ScrollVisibleElement scrollTitle="Terms and conditions">
        <Heading heading="Terms and conditions" />
      </ScrollVisibleElement>
      <div className="h-[3.25rem]" />
      <div className="flex w-full max-w-[46rem] flex-col gap-[0px] p-0">
        T&C content goes here, could also be an external link directly
      </div>
    </>
  );
};

export default TermsAndConditions;
