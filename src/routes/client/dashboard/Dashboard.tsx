// Dashboard.tsx
import React from 'react';
import CampaignsSection from './CampaignsSection';
import InsightsSection from './InsightsSection';
// Our dummy data
import { dummyCampaigns, dummyInsights } from './MockData';

export const Dashboard = () => {
  // In the future: fetch "campaigns" and "insights" from an API
  // For now, just use the dummy data we imported
  const campaigns = dummyCampaigns;
  const insights = dummyInsights;

  return (
    <>
      <div className="mx-auto w-full max-w-[84.5rem] p-4">
        <CampaignsSection campaigns={campaigns} />
        <InsightsSection insights={insights} />
      </div>
    </>
  );
};

export default Dashboard;
