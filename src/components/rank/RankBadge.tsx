
import React from 'react';
import { RankTier, rankTiers } from '@/utils/rankUtils';

interface RankBadgeProps {
  rankTier: RankTier;
  className?: string;
}

const RankBadge: React.FC<RankBadgeProps> = ({ rankTier, className = '' }) => {
  const rank = rankTiers[rankTier];
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src={rank.logoUrl} alt={`${rank.name} rank`} className="w-6 h-6" />
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${rank.color} text-foreground ${rank.darkColor}`}>
        {rank.name}
      </span>
    </div>
  );
};

export default RankBadge;
