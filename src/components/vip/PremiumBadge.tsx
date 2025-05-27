
import { Crown, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PremiumBadgeProps {
  isPremium: boolean;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'premium' | 'vip';
}

const PremiumBadge = ({ isPremium, size = 'md', showText = true, variant = 'premium' }: PremiumBadgeProps) => {
  if (!isPremium) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const gradients = {
    premium: 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600',
    vip: 'bg-gradient-to-r from-yellow-400 to-orange-500'
  };

  const Icon = variant === 'vip' ? Crown : Star;
  const text = variant === 'vip' ? 'VIP' : 'PREMIUM';

  return (
    <Badge
      variant="secondary"
      className={`${sizeClasses[size]} ${gradients[variant]} text-white border-none font-bold shadow-lg animate-pulse`}
    >
      <Icon className={`${iconSizes[size]} mr-1`} />
      {showText && text}
    </Badge>
  );
};

export default PremiumBadge;
