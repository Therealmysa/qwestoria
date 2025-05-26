
import { MessageSquare } from "lucide-react";

const MessagesHeader = () => {
  return (
    <div className="relative z-10 h-20 flex-shrink-0 p-4 border-b border-white/15 bg-black/20 backdrop-blur-2xl">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-8 w-8 text-[#9b87f5] animate-glow" />
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-600">
          Messagerie
        </h1>
      </div>
    </div>
  );
};

export default MessagesHeader;
