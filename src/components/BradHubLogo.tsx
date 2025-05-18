
import { useNavigate } from "react-router-dom";

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
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#9b87f5]/40 to-[#9b87f5] blur-[2px]"></div>
        
        {/* Coin base */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#b09eff] to-[#7654d3] border border-white/20 shadow-lg"></div>
        
        {/* Coin inner highlight */}
        <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#c8bcff] via-[#9b87f5] to-[#7654d3] overflow-hidden">
          {/* Coin shine effect */}
          <div className="absolute -inset-1 bg-gradient-to-tr from-white/40 via-transparent to-transparent rotate-45 transform translate-x-full animate-[shine_3s_ease-in-out_infinite]"></div>
          
          {/* Coin face detail */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-bold text-white drop-shadow-md">B</span>
          </div>
        </div>
      </div>
      
      {withText && (
        <span className={`font-bold ${textSizeClasses[size]} bg-gradient-to-r from-[#9b87f5] to-[#a990ff] bg-clip-text text-transparent`}>
          BradHub
        </span>
      )}
    </div>
  );
};

export default BradHubLogo;
