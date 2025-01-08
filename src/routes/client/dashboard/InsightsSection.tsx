// InsightsSection.tsx
import React from 'react';
import HorizontalSlider from './HorizontalSlider';
import InsightCard from './InsightCard';
import { InsightItem } from './MockData';

interface InsightsSectionProps {
  insights: InsightItem[];
}

const InsightsSection: React.FC<InsightsSectionProps> = ({ insights }) => {
  return (
    <section className="w-full py-6">
      <h2 className="text-2xl mb-4 font-bold">Insights</h2>

      {insights.length === 0 ? (
        <div>No insights exist.</div>
      ) : (
        <HorizontalSlider>
          {insights.map((i) => (
            <div key={i.id} className="px-2">
              <InsightCard insight={i} />
            </div>
          ))}
        </HorizontalSlider>
      )}
    </section>
  );
};

export default InsightsSection;
