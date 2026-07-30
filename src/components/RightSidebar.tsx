import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { ShieldAlert, ShieldCheck, LogOut } from "lucide-react";
import toast from "react-hot-toast";

const RightSidebar = () => {
  const chatContext = useContext(ChatContext);
  const authContext = useContext(AuthContext);
  if (!chatContext || !authContext) return null;

  const { selectedUser, messages } = chatContext;
  const { authUser, logout, onlineUser, axios, checkAuth } = authContext;
  const [msgImages, setMsgImages] = useState<string[]>([]);
  const [isProcessingBlock, setIsProcessingBlock] = useState(false);

  useEffect(() => {
    setMsgImages(
      messages.filter((msg) => msg.image).map((msg) => msg.image!)
    );
  }, [messages]);

  if (!selectedUser) return null;

  // AI chat has no blocking or logouts or media
  const isAI = selectedUser.isAI || selectedUser._id === "ai_quickchat";

  // Check if selected user is blocked
  const isBlocked = authUser?.blockedUsers?.includes(selectedUser._id);

  const handleToggleBlock = async () => {
    setIsProcessingBlock(true);
    try {
      if (isBlocked) {
        await axios.post("/api/auth/unblock", { targetUserId: selectedUser._id });
        toast.success("User unblocked");
      } else {
        await axios.post("/api/auth/block", { targetUserId: selectedUser._id });
        toast.success("User blocked");
      }
      await checkAuth(); // refresh block list state in auth context
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setIsProcessingBlock(false);
    }
  };

  return (
    <div className="bg-[#8185B2]/10 text-white w-full h-full relative overflow-y-auto flex flex-col p-5">
      <div className="pt-8 flex flex-col items-center gap-2.5 text-xs font-light text-center">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt=""
          className="w-20 aspect-square rounded-full object-cover border border-slate-800"
        />
        <h1 className="text-lg font-semibold text-white flex items-center gap-2">
          {onlineUser?.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
          {selectedUser?.fullname}
        </h1>
        <p className="text-slate-400 max-w-[200px] leading-relaxed break-words">{selectedUser.bio || "No bio yet."}</p>
      </div>

      <hr className="border-slate-800/80 my-5" />

      {/* Action triggers */}
      {!isAI && (
        <div className="flex flex-col gap-2.5 mb-5">
          <button
            onClick={handleToggleBlock}
            disabled={isProcessingBlock}
            className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-all text-xs cursor-pointer border ${
              isBlocked
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
            }`}
          >
            {isBlocked ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                Unblock User
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" />
                Block User
              </>
            )}
          </button>
        </div>
      )}

      {/* Media section */}
      {!isAI && msgImages.length > 0 && (
        <div className="text-xs flex-1 min-h-0 flex flex-col">
          <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] mb-2">Media & Files</p>
          <div className="overflow-y-auto grid grid-cols-2 gap-2.5 opacity-90 custom-scrollbar max-h-[220px]">
            {msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="cursor-pointer rounded-lg border border-slate-800 overflow-hidden aspect-video bg-slate-950 flex items-center justify-center"
              >
                <img src={url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom logout trigger */}
      <button
        onClick={() => logout()}
        className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-white transition-all text-slate-300 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer mt-auto"
      >
        <LogOut className="w-4 h-4" />
        Log Out
      </button>
    </div>
  );
};

export default RightSidebar;
