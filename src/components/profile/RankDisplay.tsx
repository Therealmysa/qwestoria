
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getRankByPoints, rankTiers, RankTier } from "@/utils/rankUtils";

interface RankDisplayProps {
  points: number;
}

const RankDisplay: React.FC<RankDisplayProps> = ({ points }) => {
  const currentRank = getRankByPoints(points);
  
  // Find next rank tier
  const rankKeys = Object.keys(rankTiers) as RankTier[];
  const currentRankIndex = rankKeys.indexOf(currentRank);
  const nextRankKey = currentRankIndex < rankKeys.length - 1 ? rankKeys[currentRankIndex + 1] : null;
  const nextRank = nextRankKey ? rankTiers[nextRankKey] : null;
  
  // Calculate progress percentage
  let progressPercentage = 100;
  if (nextRank) {
    const currentMin = rankTiers[currentRank].minPoints;
    const nextMin = nextRank.minPoints;
    const range = nextMin - currentMin;
    const userProgress = points - currentMin;
    progressPercentage = Math.min(Math.floor((userProgress / range) * 100), 100);
  }
  
  const currentRankInfo = rankTiers[currentRank];
  
  return (
    <Card className="card-enhanced shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">Niveau Actuel</h3>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img 
                src={currentRankInfo.logoUrl} 
                alt={`${currentRankInfo.name} rank`} 
                className="w-20 h-20 mx-auto animate-pulse-slow"
              />
              <div className={`absolute -inset-1 rounded-full ${currentRankInfo.color} blur-md opacity-70 -z-10`}></div>
            </div>
          </div>
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${currentRankInfo.color} font-bold text-lg`}>
            {currentRankInfo.name}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Score actuel</span>
            <span className="font-bold">{points} points</span>
          </div>
          
          {nextRank && (
            <>
              <Progress value={progressPercentage} className="h-2" />
              
              <div className="flex justify-between items-center text-sm">
                <span>Prochain niveau: {nextRank.name}</span>
                <span>{points}/{nextRank.minPoints} points</span>
              </div>
              
              <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                <span>Progress</span>
                <span>{progressPercentage}%</span>
              </div>
            </>
          )}
          
          {!nextRank && (
            <div className="text-center mt-4 py-2 bg-gradient-to-r from-amber-100/30 to-purple-100/30 dark:from-amber-900/30 dark:to-purple-900/30 rounded-md">
              <span className="font-medium">Niveau maximum atteint!</span>
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="font-medium mb-3">Niveaux disponibles</h4>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(rankTiers).map(([key, rank]) => (
              <div 
                key={key} 
                className={`flex flex-col items-center p-2 rounded ${currentRank === key ? 'bg-secondary/70 ring-1 ring-primary/20' : ''}`}
              >
                <img src={rank.logoUrl} alt={rank.name} className="w-8 h-8" />
                <span className="text-xs mt-1">{rank.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RankDisplay;
