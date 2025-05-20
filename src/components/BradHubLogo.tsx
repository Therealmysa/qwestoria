import { useNavigate } from "react-router-dom";
import { Coins } from "lucide-react";

interface BradHubLogoProps {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
}

const BradHubLogo = ({ size = "md", withText = true }: BradHubLogoProps) => {
  const navigate = useNavigate();

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => navigate("/")}
    >
      <div className={`${sizeClasses[size]} relative group`}>
        {/* Coin outer glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300/40 to-amber-500 blur-[2px] group-hover:blur-[3px] transition-all duration-300"></div>

        {/* Coin base */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border border-white/20 shadow-lg"></div>

        {/* Coin inner details */}
        <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 overflow-hidden">
          {/* Coin shine effect */}
          <div className="absolute -inset-1 bg-gradient-to-tr from-white/40 via-transparent to-transparent rotate-45 transform translate-x-full animate-[shine_3s_ease-in-out_infinite]"></div>

          {/* Coin texture */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_45%,_rgba(255,255,255,0.2)_70%,_transparent_72%)] opacity-40"></div>

          {/* Coin edge highlight */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50"></div>

          {/* Coin face detail - using the Coins icon */}
          <div className="absolute inset-0 flex items-center justify-center text-amber-800">
            <Coins className="w-5 h-5" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {withText && (
        <span
          className={`font-bold ${textSizeClasses[size]} bg-gradient-to-r from-[#9b87f5] to-amber-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-[#8976e4] group-hover:to-amber-400`}
        >
          BradFlow
        </span>
      )}
    </div>
  );
};

export default BradHubLogo;
