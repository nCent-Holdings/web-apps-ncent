export interface ApiKey {
  apiKey?: string;
  dateCreated?: string;
  note?: string;
  monthlyCalls?: string;
  action?: string;
}

export type Steps = 'INITIAL' | 'NOTE' | 'NEW_KEY' | 'LOADING';
