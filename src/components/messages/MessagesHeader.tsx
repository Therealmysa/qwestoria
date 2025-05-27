
import { MessageSquare } from "lucide-react";

const MessagesHeader = () => {
  return (
    <div className="relative z-10 h-20 flex-shrink-0 p-4 border-b border-white/15 bg-black/20 backdrop-blur-2xl">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-8 w-8 text-[#9b87f5] animate-glow" />
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-amber-500 dark:from-white dark:via-[#f1c40f] dark:to-[#9b87f5]">
          Messagerie
        </h1>
      </div>
    </div>
  );
};

export default MessagesHeader;
