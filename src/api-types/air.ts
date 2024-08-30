/* eslint-disable @typescript-eslint/no-empty-interface */

/**
 * DON'T EDIT THIS FILE!
 * It's auto-generated from Darwin_capabilities repo
 */

export interface AirAqi {}

export interface AirCleaning {
  capacity: number[];
}

export interface AirCo {
  co: number;
  aqi: number;
  aqi_description: string;
  thresholds: Thresholds;
}

export interface Thresholds {}

export interface AirCo2 {
  co2: number;
  aqi: number;
  aqi_description: string;
  pollutant_description: string;
  description: string;
  descriptions: string[];
  units: string;
  daqi: string;
  color_code: string;
  thresholds: Thresholds;
  default_maximum: number;
  maximum: number;
  timestamp: number;
}

export interface AirHumidity {
  humidity: number;
  thresholds: Thresholds;
  timestamp: number;
}

export interface AirNo2 {
  no2: number;
  score: number;
  score_description: string;
  thresholds: Thresholds;
}

export interface AirO3 {
  o3: number;
  aqi: number;
  aqi_description: string;
  thresholds: Thresholds;
}

export interface AirPm10 {
  pm10: number;
  aqi: number;
  aqi_description: string;
  pollutant_description: string;
  description: string;
  descriptions: string[];
  color_code: string;
  daqi: string;
  units: string;
  thresholds: Thresholds;
  default_maximum: number;
  maximum: number;
}

export interface AirPm25 {
  pm25: number;
  aqi: number;
  aqi_description: string;
  pollutant_description: string;
  description: string;
  descriptions: string[];
  units: string;
  daqi: string;
  color_code: string;
  thresholds: Thresholds;
  default_maximum: number;
  maximum: number;
  timestamp: number;
}

export interface AirPm25Remediation {
  signal: number[];
  history: History;
  trigger: number;
  thresh: number;
}

export interface History {
  last: number;
  max: number;
  data: any[];
  interval: number;
}

export interface AirPollen {
  fullname: string;
  index: number;
  color: string;
  category: string;
  in_season: boolean;
}

export interface AirPollutant {
  fullname: string;
  index: number;
  color: string;
  category: string;
  concentration: number;
  units: string;
}

export interface AirQuality {
  fullname: string;
  index: number;
  color: string;
  category: string;
  dominant: string;
}

export interface AirScore {}

export interface AirSo2 {
  so2: number;
  aqi: number;
  aqi_description: string;
  thresholds: Thresholds;
}

export interface AirTemperature {
  temperature: number;
  units: string;
  timestamp: number;
}

export interface AirThresholds {}

export interface AirTvoc {
  tvoc: number;
  daqi: string;
  units: string;
  aqi: number;
  aqi_description: string;
  pollutant_description: string;
  description: string;
  descriptions: string[];
  color_code: string;
  thresholds: Thresholds;
  default_maximum: number;
  maximum: number;
  timestamp: number;
}
