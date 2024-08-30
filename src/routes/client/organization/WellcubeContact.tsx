import React from 'react';

type DetailsProps = {
  key: string;
  title: string;
  value: string;
};

interface AccountDetailsProps {
  data: DetailsProps[];
}

const WellcubeContact = ({ data }: AccountDetailsProps) => {
  return (
    <>
      <div className="rounded-lg border border-white-background bg-white p-8">
        <div className="mb-10 flex">
          <span className="text-h3 text-black-soft">Wellcube contact</span>
        </div>
        <div className="ml-[-3rem] mt-[-1rem] flex max-w-[40rem] flex-col ">
          {data.map((item) => (
            <div key={item.title} className="ml-[3rem] w-[16rem]">
              <div className="item mt-4">
                <div className="text-form-hint mb-1 flex text-[.75em] font-medium text-[#427596]">{item.title}</div>

                <span className="text-[1rem] font-semibold leading-[1.25]">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default React.memo(WellcubeContact);
