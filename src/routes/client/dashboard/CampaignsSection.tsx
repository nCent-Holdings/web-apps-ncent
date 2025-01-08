// CampaignsSection.tsx
import React from 'react';
import HorizontalSlider from './HorizontalSlider';
import CampaignCard from './CampaignCard';
import { CampaignItem } from './MockData';

interface CampaignsSectionProps {
  campaigns: CampaignItem[];
}

const CampaignsSection: React.FC<CampaignsSectionProps> = ({ campaigns }) => {
  return (
    <section className="w-full py-6">
      <h2 className="text-xl mb-4 font-bold">Campaigns</h2>

      {campaigns.length === 0 ? (
        <div>No campaigns exist.</div>
      ) : (
        <HorizontalSlider>
          {campaigns.map((c) => (
            <div key={c.id} className="px-2">
              <CampaignCard campaign={c} />
            </div>
          ))}
        </HorizontalSlider>
      )}
    </section>
  );
};

export default CampaignsSection;
