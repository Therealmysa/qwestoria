
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
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <img 
          src={rank.logoUrl} 
          alt={`${rank.name} rank`} 
          className={`${sizeClasses[size]} ${rankTier === 'unreal' ? 'animate-pulse-slow' : ''}`} 
        />
        {rankTier === 'unreal' && (
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-400/30 to-amber-400/30 blur-md opacity-70 -z-10"></div>
        )}
      </div>
      {showText && (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${rank.color} text-foreground ${rank.darkColor}`}>
          {rank.name}
        </span>
      )}
    </div>
  );
};

export default RankBadge;
