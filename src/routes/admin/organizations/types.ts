export type Org = {
  id: string;
  orgName: string;
  orgHandle: string;
  location: string;
  technicalSales: string;
};

export type BOType = {
  values: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
};
