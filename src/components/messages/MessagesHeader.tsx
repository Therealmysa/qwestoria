
import { MessageSquare } from "lucide-react";

const MessagesHeader = () => {
  return (
    <div className="relative z-10 h-20 flex-shrink-0 p-4 border-b border-white/15 bg-black/20 backdrop-blur-2xl">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-8 w-8 text-blue-400 animate-glow" />
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400">
          Messagerie
        </h1>
      </div>
    </div>
  );
};

export default MessagesHeader;
