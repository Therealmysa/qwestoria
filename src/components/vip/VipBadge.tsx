
import { Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VipBadgeProps {
  isVip: boolean;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const VipBadge = ({ isVip, size = 'md', showText = true }: VipBadgeProps) => {
  if (!isVip) return null;

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

  return (
    <Badge
      variant="secondary"
      className={`${sizeClasses[size]} bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none font-semibold`}
    >
      <Crown className={`${iconSizes[size]} mr-1`} />
      {showText && 'VIP'}
    </Badge>
  );
};

export default VipBadge;
