
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
    lg: "w-12 h-12"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };
  
  return (
    <div 
      className="flex items-center gap-2 cursor-pointer" 
      onClick={() => navigate("/")}
    >
      <div className={`${sizeClasses[size]} relative`}>
        {/* Coin outer glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#f1c40f]/40 to-[#f1c40f] blur-[2px]"></div>
        
        {/* Coin base */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#f9ca24] to-[#f0932b] border border-white/20 shadow-lg"></div>
        
        {/* Coin inner highlight */}
        <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#ffeb3b] via-[#f1c40f] to-[#e67e22] overflow-hidden">
          {/* Coin shine effect */}
          <div className="absolute -inset-1 bg-gradient-to-tr from-white/40 via-transparent to-transparent rotate-45 transform translate-x-full animate-[shine_3s_ease-in-out_infinite]"></div>
          
          {/* Coin face detail - using the Coins icon */}
          <div className="absolute inset-0 flex items-center justify-center text-white/90">
            <Coins className="w-5 h-5" strokeWidth={2.5} />
          </div>
        </div>
      </div>
      
      {withText && (
        <span className={`font-bold ${textSizeClasses[size]} bg-gradient-to-r from-[#9b87f5] to-[#f1c40f] bg-clip-text text-transparent`}>
          BradHub
        </span>
      )}
    </div>
  );
};

export default BradHubLogo;
