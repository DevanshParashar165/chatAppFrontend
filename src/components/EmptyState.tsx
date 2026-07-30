import React from "react";
import { MessageSquare, Sparkles } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900/10">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl animate-pulse" />
        <div className="w-20 h-20 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-center text-indigo-400 shadow-xl shadow-slate-950/50">
          <MessageSquare className="w-10 h-10" />
        </div>
        <div className="absolute top-[-5px] right-[-5px] w-6 h-6 rounded-full bg-indigo-600 border-2 border-slate-950 flex items-center justify-center text-[10px] text-white">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-200 mb-2">Welcome to Your Workspace</h3>
      <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-6">
        Select a conversational partner from DMs list, join a workspace group, or ask AI assistant to get started.
      </p>

      <div className="flex gap-3 text-xs text-slate-500 bg-slate-900/30 px-4 py-2.5 rounded-full border border-slate-800/40">
        <span>💡 Press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Esc</kbd> to exit call</span>
        <span>•</span>
        <span>Click Avatar to edit profile</span>
      </div>
    </div>
  );
};
export default EmptyState;
