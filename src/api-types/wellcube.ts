/* eslint-disable @typescript-eslint/no-empty-interface */

/**
 * DON'T EDIT THIS FILE!
 * It's auto-generated from caps-packs repo
 */

export interface WellcubeAPI {}

export interface WellcubeCalibration {
  status: string;
  details: string;
  status_date: string;
  last_calibrated_date: string;
}

export interface WellcubeDevice {
  space_id: string;
  gateway_id: string;
  site_id: string;
  manufacturer: string;
  model_number: string;
  serial_number: string;
  error: Error;
  luminaire_asset_gtin: string;
  device_time: string;
  device_utc_offset: string;
  device_timezone: string;
  supported_bindings: string;
  hardware_version: string;
  software_version: string;
  model: string;
  sku: string;
  asset_id: string;
  device_type: string;
  firmware_version: string;
  network_id: string;
  ip_local: string;
  ip_public: string;
  rssi: string;
  mqtt_qos: number;
  heartbeat_interval: number;
  thread_network_id: string;
  euid64: string;
  thread_pskd: string;
  thread_version: string;
  commissioning_status: CommissioningStatus;
  commissioned_by: string;
  commissioned_at: string;
  status: string;
  status_timestamp: string;
  status_history: any[];
  mcu_status: 'online' | 'offline';
  last_reported_timestamp: number;
  last_change_timestamp: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface CommissioningStatus {
  totalSteps: number;
  currentStep: number;
  error: string;
  status: string;
}

export interface Error {
  code: string;
  message: string;
  timestamp: string;
}

export interface WellcubeDevices {
  meta: WellcubeDevicesMeta;
}

export interface WellcubeDevicesMeta {
  commissioned: number;
  uncommissioned: number;
  total: number;
  online: number;
  offline: number;
  sensors: Purifiers;
  purifiers: Purifiers;
}

export interface Purifiers {
  total: number;
  online: number;
  offline: number;
  commissioned: number;
  uncommissioned: number;
}

export interface WellcubeFirmware {
  Bucket: string;
  Key: string;
  version: string;
  hash: string;
  radar_firmware: string;
  noise_firmware: string;
  mcu_firmware: string;
  mcu_fw_status: string;
  mcu_fw_date: string | number;
  mcu_has_update: boolean;
  hrn71_firmware: string;
  hrn71_fw_status: string;
  hrn71_fw_date: string | number;
  hrn71_has_update: boolean;
}

export interface WellcubeGateway {
  help_link: HelpLink;
  firmware_version: string;
}

export interface HelpLink {
  url: string;
  text: string;
}

export interface WellcubeGroup {
  base_group_id: string;
  organization_id: string;
  site_id: string;
  scope: string;
  type: string;
}

export interface WellcubeGroupBase {
  type: string;
  scope: string;
  name_prefix: string;
}

export interface WellcubeLocation {
  local_space: string;
  top_space: string;
  full_path: string;
}

export interface WellcubeMigrate {}

export interface WellcubeOrganization {
  address1: string;
  address2: string;
  country: string;
  city: string;
  state: string;
  postal_code: string;
  industry: string;
  keywords: string;
  keyword_list: any[];
  handle: string;
  sales_name: string;
  sales_email: string;
  sales_phone_number: string;
  admin_group_id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  deleted_at: string;
  deleted_by: string;
}

export interface WellcubeOrganizations {}

export interface WellcubePurifier {
  fan_speed: string;
  fan_cfm: number;
  fan_percent: number;
  fan_mode: string;
  remediation: boolean;
  filter_life: FilterLife;
  light_iaq: boolean;
  light_filter: boolean;
  allow_turbo: boolean;
}

export interface FilterLife {
  days_of_life: number;
  changed_on: number;
}

export interface WellcubeSensor {
  sampling_rate: number;
  light_iaq: boolean;
}

export interface WellcubeSite {
  admin_group_id: string;
  member_group_id: string;
  external_group_id: string;
  address1: string;
  address2: string;
  country: string;
  city: string;
  state: string;
  postal_code: string;
  site_type: string;
  status: string;
  property_interest: string;
  year_of_construction: string;
  construction_materials: string;
  keywords: string;
  keyword_list: any[];
  description: string;
  asset_list: any[];
  handle: string;
  timezone: Timezone;
  active_schedule: ActiveSchedule;
  organization_id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  refresh_time: null;
  refresh_in_progress: boolean;
}

export interface ActiveSchedule {
  days: any[];
  time_start: string;
  time_end: string;
}

export interface Timezone {
  rawOffset: number;
  timeZoneId: string;
  timeZoneName: string;
}

export interface WellcubeSites {}

export interface WellcubeSiteAssets {
  assets: Assets;
}

export interface Assets {}

export interface WellcubeSpace {
  site_id: string;
  parent_space_id: string;
  full_path: string;
  depth: number;
  setup: WellcubeSpaceSetup;
  details: WellcubeSpaceDetails;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface WellcubeSpaceDetails {
  type: string;
  custom_type: string;
  room_type: string;
  square_footage: string;
  ceiling_height: string;
  layout: string;
  operable_windows: string;
  vents: string;
  max_occupancy: number;
}

export interface WellcubeSpaceSetup {
  status: string;
}

export interface WellcubeSpaces {
  meta: WellcubeSpacesMeta;
}

export interface WellcubeSpacesMeta {
  total_spaces: number;
  total_devices: number;
  comm_devices: number;
  incomplete: number;
}

export interface WellcubeSensorMapping {
  pollutants: Pollutants;
  sensors_map: Assets;
}

export interface Pollutants {
  co2: string;
  pm25: string;
  tvoc: string;
  humidity: string;
  temperature: string;
  noise: string;
  occupancy: string;
  light: string;
}

export interface WellcubeThread {
  dataset: Assets;
  leader: boolean;
  thread_state: string;
  connected_devices: Assets;
}

export interface WellcubeDataGenerator {}

export interface WellcubeUser {
  first_name: string;
  second_name: string;
  phone_number: string;
  email: string;
  notifications: Notifications;
  status: string;
  invitation: Invitation;
}

export interface Invitation {
  id: string;
  expires_at: null;
}

export interface Notifications {
  filter_changes: boolean;
  device_online: boolean;
  device_offline: boolean;
  sensor_offline: boolean;
  acceptable_range: boolean;
}

export interface WellcubeUserPermissions {}

export interface PowerConsumption {
  power: number;
  power_ts: number;
  power_measured_min: number;
  power_measured_max: number;
  power_range_min: number;
  power_range_max: number;
  power_cumulative: number;
  units: string;
}

export interface SensorAqi {
  aqi: Aqi;
  daqi: Daqi;
}

export interface Aqi {
  aqi: string;
  aqi_score: number;
  timestamp: number;
  dominant_pollutant: string;
  dominant_concentration: number;
}

export interface Daqi {
  daqi: string;
  daqi_score: number;
  timestamp: number;
  dominant_pollutant: string;
  dominant_concentration: number;
}

export interface SensorLight {
  luminance: number;
  luminance_ts: number;
  brightness: number;
  brightness_ts: number;
  brightness_units: string;
  brightness_range_max: number;
  brightness_range_min: number;
  brightness_measured_max: number;
  brightness_measured_min: number;
  temperature: number;
  temperature_ts: number;
  brightness_red: number;
  brightness_green: number;
  brightness_blue: number;
  flicker: number;
  flicker_on: boolean;
  flicker_on_time: number;
  flicker_app_type: string;
  flicker_multi_state: string;
}

export interface SensorNoise {
  enabled: boolean;
  intensity: number;
  intensity_ts: number;
  units: string;
  intensity_measured_min: number;
  intensity_measured_max: number;
  intensity_range_min: number;
  intensity_range_max: number;
  application_type: string;
  current_calibration: number;
}

export interface SensorOccupancy {
  enabled: boolean;
  people_counting: boolean;
  occupied: boolean;
  occupied_ts: number;
  people: number;
  people_ts: number;
}

export interface SensorStatus {
  statuses: any[];
}

export interface SensorRadar {
  radar_raw_1: number;
  radar_raw_2: number;
  radar_raw_3: number;
  radar_occupancy_report_1: number;
  radar_occupancy_report_2: number;
  radar_occupancy_report_3: number;
  radar_distance_report_1: number;
  radar_distance_report_2: number;
  radar_distance_report_3: number;
  radar_approach_1: boolean;
  radar_approach_2: boolean;
  radar_approach_3: boolean;
}
