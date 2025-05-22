
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
  logoUrl: string;
  minPoints: number;
}

export const rankTiers: Record<RankTier, RankInfo> = {
  bronze: {
    name: 'Bronze',
    color: 'bg-amber-600/20',
    darkColor: 'dark:text-amber-300',
    logoUrl: 'https://i.imgur.com/1F1ncvo.png',
    minPoints: 0
  },
  silver: {
    name: 'Silver',
    color: 'bg-gray-300/30',
    darkColor: 'dark:text-gray-300',
    logoUrl: 'https://i.imgur.com/kGQWK4b.png',
    minPoints: 100
  },
  gold: {
    name: 'Gold',
    color: 'bg-amber-400/20',
    darkColor: 'dark:text-amber-300',
    logoUrl: 'https://i.imgur.com/G7VI9OZ.png',
    minPoints: 250
  },
  platinum: {
    name: 'Platinum',
    color: 'bg-cyan-300/30',
    darkColor: 'dark:text-cyan-300',
    logoUrl: 'https://i.imgur.com/xQkBeWH.png',
    minPoints: 500
  },
  diamond: {
    name: 'Diamond',
    color: 'bg-blue-300/30',
    darkColor: 'dark:text-blue-300',
    logoUrl: 'https://i.imgur.com/iDIOoTB.png',
    minPoints: 1000
  },
  elite: {
    name: 'Elite',
    color: 'bg-purple-300/30',
    darkColor: 'dark:text-purple-300',
    logoUrl: 'https://i.imgur.com/S2kXnss.png',
    minPoints: 1500
  },
  champion: {
    name: 'Champion',
    color: 'bg-red-400/30',
    darkColor: 'dark:text-red-300',
    logoUrl: 'https://i.imgur.com/nvVnCSn.png',
    minPoints: 2000
  },
  unreal: {
    name: 'Unreal',
    color: 'bg-gradient-to-r from-purple-400/30 to-amber-400/30',
    darkColor: 'dark:text-gradient-to-r dark:from-purple-300 dark:to-amber-300',
    logoUrl: 'https://i.imgur.com/KJC7fZf.png',
    minPoints: 3000
  }
};

export const getRankByPoints = (points: number): RankTier => {
  // Sort tiers by minimum points in descending order
  const sortedTiers = Object.entries(rankTiers).sort((a, b) => 
    b[1].minPoints - a[1].minPoints
  );

  // Find the highest tier the user qualifies for
  for (const [tier, info] of sortedTiers) {
    if (points >= info.minPoints) {
      return tier as RankTier;
    }
  }

  return 'bronze'; // Default to bronze if something goes wrong
};

// We're moving the RankBadge component to its own file, so remove it from here
