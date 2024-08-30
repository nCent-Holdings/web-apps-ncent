import { WellcubeSite } from '@src/api-types/models';
import { Timezone, WellcubeOrganization, WellcubeSpace, WellcubeSpaceDetails } from '@src/api-types/wellcube';

export type CreateDeviceDto = {
  name: string;
  type: string;
  site_id?: string;
  asset_id?: string;
  model?: string;
  gateway_id?: string;
};

export type CreateOrUpdateSiteDto = {
  name: string;
  handle: WellcubeSite['handle'];

  address1: WellcubeSite['address1'];
  address2: WellcubeSite['address2'];
  country: WellcubeSite['country'];
  city: WellcubeSite['city'];
  state: WellcubeSite['state'];
  postal_code: WellcubeSite['postal_code'];
  timezone: Timezone;

  site_type: WellcubeSite['site_type'];
  property_interest: WellcubeSite['property_interest'];
  year_of_construction: WellcubeSite['year_of_construction'];
  construction_materials: WellcubeSite['construction_materials'];
  keywords: WellcubeSite['keywords'];

  description: WellcubeSite['description'];
  asset_list: WellcubeSite['asset_list'];

  status?: WellcubeSite['status'];
};

export type CreateOrUpdateOrganizationDto = {
  name: string;

  address1: WellcubeOrganization['address1'];
  address2: WellcubeOrganization['address2'];
  country: WellcubeOrganization['country'];
  city: WellcubeOrganization['city'];
  state: WellcubeOrganization['state'];
  postal_code: WellcubeOrganization['postal_code'];
  industry: WellcubeOrganization['industry'];
  keywords: WellcubeOrganization['keywords'];
  handle: WellcubeOrganization['handle'];
};

export type CreateOrUpdateSpaceDto = {
  name: string;
  parent_space_id: WellcubeSpace['parent_space_id'];
  site_id: WellcubeSpace['site_id'];

  type: WellcubeSpaceDetails['type'];
  room_type: WellcubeSpaceDetails['room_type'];
  square_footage: WellcubeSpaceDetails['square_footage'];
  ceiling_height: WellcubeSpaceDetails['ceiling_height'];
  layout: WellcubeSpaceDetails['layout'];
  operable_windows: WellcubeSpaceDetails['operable_windows'];
  vents: WellcubeSpaceDetails['vents'];
  max_occupancy: WellcubeSpaceDetails['max_occupancy'];
};

export type UpdateSalesManagerDto = {
  sales_name: WellcubeOrganization['sales_name'];
  sales_email: WellcubeOrganization['sales_email'];
  sales_phone_number: WellcubeOrganization['sales_phone_number'];
};
