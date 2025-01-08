// InsightCard.tsx
import React from 'react';
import { InsightItem } from './MockData';
import { formatNumber } from './utils';

interface InsightCardProps {
  insight: InsightItem;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  return (
    <div className="shadow-sm flex h-auto w-[270px] flex-col gap-2 rounded-md border bg-white p-3">
      <h3 className="text-lg mb-2 text-center font-bold">Insight #{insight.id}</h3>

      {/* Top row */}
      <div className="mb-1 flex w-full items-start justify-between gap-2">
        {/* Box for Spend */}
        <div className="flex w-[45%] flex-row items-center justify-center border p-2">
          <div className="flex flex-col items-start">
            <span className="text-gray-500 text-xs">Spend</span>
            <span className="text-base">${formatNumber(insight.spend)}</span>
          </div>
        </div>

        {/* Consumers no box */}
        <div className="bg-gray-50 flex flex-1 flex-col items-center justify-center p-2 ">
          <span className="text-gray-500 text-xs"># Consumers</span>
          <span className="text-base">{formatNumber(insight.consumers)}</span>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex w-full items-start justify-between gap-2">
        {/* Box for Reach + Converts */}
        <div className="flex w-[45%] flex-row justify-center gap-3 border p-2">
          <div className="flex flex-col items-center">
            <span className="text-gray-500 text-xs">Reach</span>
            <span className="text-base">{formatNumber(insight.reach)}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-500 text-xs">Converts</span>
            <span className="text-base">{formatNumber(insight.converts)}</span>
          </div>
        </div>

        {/* Engagement Rate alone */}
        <div className="bg-gray-50 flex flex-1 flex-col items-center justify-center p-2 ">
          <span className="text-gray-500 text-xs">Engagement Rate</span>
          <span className="text-base">{insight.engagementRate}%</span>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
