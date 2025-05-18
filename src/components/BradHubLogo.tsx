
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] rounded-lg transform rotate-3 shadow-lg"></div>
        <div className="absolute inset-0 bg-[#FFD700] rounded-lg transform -rotate-3 opacity-80 shadow-lg"></div>
        <div className="absolute inset-0 flex items-center justify-center font-bold text-white">B</div>
      </div>
      
      {withText && (
        <span className={`font-bold ${textSizeClasses[size]} bg-gradient-to-r from-[#9b87f5] to-[#FFD700] bg-clip-text text-transparent`}>
          BradHub
        </span>
      )}
    </div>
  );
};

export default BradHubLogo;
