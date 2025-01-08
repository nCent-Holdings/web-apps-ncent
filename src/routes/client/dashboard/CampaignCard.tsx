// CampaignCard.tsx
import React from 'react';
import { CampaignItem } from './MockData';
import { formatNumber } from './utils';

interface CampaignCardProps {
  campaign: CampaignItem;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  return (
    <div className="shadow-sm flex h-auto w-[270px] flex-col gap-2 rounded-md border bg-white p-3">
      {/* Campaign Name (centered) */}
      <h3 className="text-lg mb-2 text-center font-bold">{campaign.name}</h3>

      {/* Top row */}
      <div className="mb-1 flex w-full items-start justify-between gap-2">
        {/* Box for Budget + Spend */}
        <div className="flex w-[55%] flex-row justify-around gap-3 border p-2">
          {/* Budget */}
          <div className="flex flex-col items-center">
            <span className="text-gray-500 text-xs">Budget</span>
            <span className="text-base">${formatNumber(campaign.budget)}</span>
          </div>
          {/* Spend */}
          <div className="flex flex-col items-center">
            <span className="text-gray-500 text-xs">Spend</span>
            <span className="text-base">${formatNumber(campaign.spend)}</span>
          </div>
        </div>
        {/* Avg Cost alone */}
        <div className="flex flex-1 flex-col items-center justify-center p-2">
          <span className="text-gray-500 text-xs">Avg Cost</span>
          <span className="text-base">${campaign.avgCost.toFixed(2)}</span>
        </div>
      </div>

      {/* Middle row: Reach + Conversions, plus Eng Rate */}
      <div className="mb-1 flex w-full items-start justify-between gap-2">
        {/* Box for Reach + Conversions */}
        <div className="flex w-[55%] flex-row justify-around gap-3 border p-2">
          <div className="flex flex-col items-center">
            <span className="text-gray-500 text-xs">Reach</span>
            <span className="text-base">{formatNumber(campaign.reach)}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-500 text-xs">Converts</span>
            <span className="text-base">{formatNumber(campaign.conversions)}</span>
          </div>
        </div>
        {/* Engagement Rate alone */}
        <div className="flex flex-1 flex-col items-center justify-center p-2">
          <span className="text-gray-500 text-xs">Engagement</span>
          <span className="text-base">{campaign.engagementRate}%</span>
        </div>
      </div>

      {/* Bottom row: 4 items in one box */}
      <div className="flex w-full flex-row flex-wrap justify-around gap-2 border p-2">
        {/* Insights */}
        <div className="flex flex-col items-center">
          <span className="text-gray-500 text-xs">Insights</span>
          <span className="text-base">{formatNumber(campaign.insights)}</span>
        </div>
        {/* Questions */}
        <div className="flex flex-col items-center">
          <span className="text-gray-500 text-xs">Questions</span>
          <span className="text-base">{formatNumber(campaign.questions)}</span>
        </div>
        {/* Clicks */}
        <div className="flex flex-col items-center">
          <span className="text-gray-500 text-xs">Clicks</span>
          <span className="text-base">{formatNumber(campaign.clicks)}</span>
        </div>
        {/* Actions */}
        <div className="flex flex-col items-center">
          <span className="text-gray-500 text-xs">Actions</span>
          <span className="text-base">{formatNumber(campaign.actions)}</span>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
