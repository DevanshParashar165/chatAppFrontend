import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

function IncomingCall() {
  const chatContext = useContext(ChatContext);
  if (!chatContext) return null;
  const { incomingCall, acceptCall, rejectCall, selectedUser } = chatContext;

  if (!incomingCall) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      
      <div className="bg-zinc-900 rounded-2xl px-8 py-6 flex flex-col items-center gap-5 shadow-xl border border-zinc-700 animate-fadeIn">
        
        {/* Animated Ring */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-full bg-green-500/20 animate-ping" />
          <div className="absolute w-16 h-16 rounded-full bg-green-500/30 animate-pulse" />
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-xl">
            📞
          </div>
        </div>

        {/* Caller Info */}
        <div className="text-center">
          <p className="text-white text-lg font-semibold">
            Incoming Video Call
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {selectedUser?.fullname || "Someone"} is calling you...
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-5 mt-3">
          
          {/* Reject */}
          <button
            onClick={rejectCall}
            className="bg-red-600 hover:bg-red-700 transition px-5 py-2 rounded-full text-white font-medium"
          >
            Reject
          </button>

          {/* Accept */}
          <button
            onClick={acceptCall}
            className="bg-green-600 hover:bg-green-700 transition px-5 py-2 rounded-full text-white font-medium"
          >
            Accept
          </button>

        </div>
      </div>
    </div>
  );
}

export default IncomingCall;