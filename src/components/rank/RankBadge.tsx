
import React from 'react';
import { RankTier, rankTiers } from '@/utils/rankUtils';

interface RankBadgeProps {
  rankTier: RankTier;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RankBadge: React.FC<RankBadgeProps> = ({ 
  rankTier, 
  className = '', 
  showText = true, 
  size = 'md' 
}) => {
  const rank = rankTiers[rankTier];
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showText && (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${rank.color} text-foreground ${rank.darkColor}`}>
          {rank.name}
        </span>
      )}
    </div>
  );
};

export default RankBadge;
