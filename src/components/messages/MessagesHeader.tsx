
import { MessageSquare } from "lucide-react";

const MessagesHeader = () => {
  return (
    <div className="relative z-10 h-20 flex-shrink-0 p-4 border-b border-slate-700/50 bg-slate-800/90 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-2xl">
          <MessageSquare className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
            Messagerie
          </h1>
          <p className="text-sm text-slate-400">Restez connecté avec vos amis</p>
        </div>
      </div>
    </div>
  );
};

export default MessagesHeader;
