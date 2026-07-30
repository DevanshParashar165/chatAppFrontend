import React from "react";

export const SkeletonLoader = ({ type = "sidebar" }: { type?: "sidebar" | "chat" }) => {
  if (type === "sidebar") {
    return (
      <div className="flex flex-col gap-4 w-full p-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-full bg-slate-800/80" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-4 bg-slate-800/80 rounded w-1/3" />
              <div className="h-3 bg-slate-800/50 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full p-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`flex gap-3 max-w-[70%] ${i % 2 === 0 ? "self-end flex-row-reverse" : "self-start"}`}
        >
          <div className="w-8 h-8 rounded-full bg-slate-800/80 flex-shrink-0" />
          <div className="flex flex-col gap-2">
            <div className="h-10 bg-slate-800/60 rounded-2xl w-48 p-3" />
            <div className="h-2 bg-slate-800/40 rounded w-12 self-end" />
          </div>
        </div>
      ))}
    </div>
  );
};
export default SkeletonLoader;
