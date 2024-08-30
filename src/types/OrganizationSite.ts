export interface OrganizationSite {
  siteId?: string;
  organizationId: string;
  siteName: string;
  siteHandle: string;
  location: SiteLocation;
  details: SiteDetails;
  description: SiteDescription;
}

export interface SiteLocation {
  address1: string;
  address2: string;
  country: string;
  city: string;
  state: string;
  postal_code: string;
  timezone: string;
}

export interface SiteDetails {
  site_type: string;
  property_interest: string;
  year_of_construction: string;
  construction_materials: string;
  keywords: string;
}

export interface SiteDescription {
  description: string;
  files: SiteFile[];
}

export interface SiteFile {
  assetName: string;
  s3FilePath: string;
  url: string;
  file: File;
}
