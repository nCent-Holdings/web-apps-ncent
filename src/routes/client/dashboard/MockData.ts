// MockData.ts
export interface CampaignItem {
  id: string;
  name: string;
  budget: number;
  spend: number;
  avgCost: number; // changed from avgCostPerConversion
  reach: number;
  conversions: number;
  engagementRate: number;
  insights: number;
  questions: number;
  clicks: number;
  actions: number;
}

export interface InsightItem {
  id: string;
  spend: number;
  consumers: number;
  reach: number;
  converts: number;
  engagementRate: number;
}

export const dummyCampaigns: CampaignItem[] = [
  {
    id: 'c1',
    name: 'Holiday Sale',
    budget: 2000,
    spend: 1400,
    avgCost: 5.5,
    reach: 12000,
    conversions: 300,
    engagementRate: 25,
    insights: 5,
    questions: 10,
    clicks: 450,
    actions: 80,
  },
  {
    id: 'c2',
    name: 'Spring Launch',
    budget: 3500,
    spend: 1200,
    avgCost: 4.2,
    reach: 9800,
    conversions: 150,
    engagementRate: 20,
    insights: 3,
    questions: 4,
    clicks: 320,
    actions: 50,
  },
  {
    id: 'c3',
    name: 'Brand Awareness',
    budget: 5000,
    spend: 2000,
    avgCost: 6.1,
    reach: 20000,
    conversions: 410,
    engagementRate: 18,
    insights: 8,
    questions: 6,
    clicks: 1100,
    actions: 120,
  },
  {
    id: 'c4',
    name: 'Summer Promo',
    budget: 4000,
    spend: 1700,
    avgCost: 4.9,
    reach: 15000,
    conversions: 280,
    engagementRate: 22,
    insights: 6,
    questions: 3,
    clicks: 330,
    actions: 65,
  },
  {
    id: 'c5',
    name: 'Autumn Focus',
    budget: 2500,
    spend: 900,
    avgCost: 3.7,
    reach: 9500,
    conversions: 130,
    engagementRate: 24,
    insights: 4,
    questions: 5,
    clicks: 280,
    actions: 55,
  },
  {
    id: 'c6',
    name: 'VIP Campaign',
    budget: 6000,
    spend: 3400,
    avgCost: 7.2,
    reach: 25000,
    conversions: 500,
    engagementRate: 17,
    insights: 10,
    questions: 12,
    clicks: 720,
    actions: 150,
  },
];

export const dummyInsights: InsightItem[] = [
  {
    id: 'Weekend Runner',
    spend: 250,
    consumers: 3000,
    reach: 4000,
    converts: 200,
    engagementRate: 15,
  },
  {
    id: 'Midnight Reader',
    spend: 180,
    consumers: 2800,
    reach: 3500,
    converts: 150,
    engagementRate: 20,
  },
  {
    id: 'Smarthome Enthusiast',
    spend: 320,
    consumers: 5000,
    reach: 6200,
    converts: 350,
    engagementRate: 18,
  },
  {
    id: 'Strange Insight',
    spend: 410,
    consumers: 7200,
    reach: 10000,
    converts: 1280,
    engagementRate: 19,
  },
  {
    id: 'Even Stranger',
    spend: 150,
    consumers: 2500,
    reach: 3300,
    converts: 180,
    engagementRate: 22,
  },
  {
    id: 'Odd Insight',
    spend: 500,
    consumers: 9000,
    reach: 12000,
    converts: 600,
    engagementRate: 16,
  },
];
