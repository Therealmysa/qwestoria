
import { MessageSquare } from "lucide-react";

const MessagesHeader = () => {
  return (
    <div className="relative z-10 h-20 flex-shrink-0 p-4 border-b border-white/15 dark:border-white/15 border-gray-200 bg-black/20 dark:bg-black/20 bg-white/80 backdrop-blur-2xl">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-8 w-8 text-blue-400 dark:text-blue-400 text-blue-600 animate-glow" />
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 dark:from-blue-400 dark:via-blue-500 dark:to-cyan-400">
          Messagerie
        </h1>
      </div>
    </div>
  );
};

export default MessagesHeader;
