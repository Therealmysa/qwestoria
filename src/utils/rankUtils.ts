
export type RankTier = 
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond'
  | 'elite'
  | 'champion'
  | 'unreal';

interface RankInfo {
  name: string;
  color: string;
  darkColor: string;
  minPoints: number;
}

export const rankTiers: Record<RankTier, RankInfo> = {
  bronze: {
    name: 'Bronze',
    color: 'bg-amber-600/20',
    darkColor: 'dark:text-amber-300',
    minPoints: 0
  },
  silver: {
    name: 'Silver',
    color: 'bg-gray-300/30',
    darkColor: 'dark:text-gray-300',
    minPoints: 100
  },
  gold: {
    name: 'Gold',
    color: 'bg-amber-400/20',
    darkColor: 'dark:text-amber-300',
    minPoints: 250
  },
  platinum: {
    name: 'Platinum',
    color: 'bg-cyan-300/30',
    darkColor: 'dark:text-cyan-300',
    minPoints: 500
  },
  diamond: {
    name: 'Diamond',
    color: 'bg-blue-300/30',
    darkColor: 'dark:text-blue-300',
    minPoints: 1000
  },
  elite: {
    name: 'Elite',
    color: 'bg-purple-300/30',
    darkColor: 'dark:text-purple-300',
    minPoints: 1500
  },
  champion: {
    name: 'Champion',
    color: 'bg-red-400/30',
    darkColor: 'dark:text-red-300',
    minPoints: 2000
  },
  unreal: {
    name: 'Unreal',
    color: 'bg-gradient-to-r from-purple-400/30 to-amber-400/30',
    darkColor: 'dark:text-gradient-to-r dark:from-purple-300 dark:to-amber-300',
    minPoints: 3000
  }
};

export const getRankByPoints = (points: number): RankTier => {
  const sortedTiers = Object.entries(rankTiers).sort((a, b) => 
    b[1].minPoints - a[1].minPoints
  );

  for (const [tier, info] of sortedTiers) {
    if (points >= info.minPoints) {
      return tier as RankTier;
    }
  }

  return 'bronze';
};
