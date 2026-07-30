import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { Shield, ShieldAlert, Download, Trash2, Settings, UserMinus } from "lucide-react";
import toast from "react-hot-toast";
import assets from "../assets/assets";

interface BlockedUser {
  _id: string;
  fullname: string;
  email: string;
  profilePic?: string;
}

export const SettingsPanel = () => {
  const authContext = useContext(AuthContext);
  const chatContext = useContext(ChatContext);
  if (!authContext || !chatContext) return null;

  const { axios, checkAuth, logout } = authContext;
  const { messages } = chatContext;

  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchBlocked = async () => {
    try {
      const { data } = await axios.get("/api/auth/blocked");
      if (data.success && data.data?.blockedUsers) {
        setBlockedUsers(data.data.blockedUsers);
      }
    } catch (err) {
      console.error("Failed to load blocked list", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocked();
  }, [axios]);

  const handleUnblock = async (targetUserId: string) => {
    try {
      await axios.post("/api/auth/unblock", { targetUserId });
      toast.success("User unblocked");
      fetchBlocked();
      await checkAuth(); // sync list in auth
    } catch {
      toast.error("Failed to unblock user");
    }
  };

  // Export chats
  const handleExportChats = () => {
    if (messages.length === 0) {
      toast.error("No active messages loaded to export");
      return;
    }

    try {
      const chatLog = JSON.stringify(messages, null, 2);
      const blob = new Blob([chatLog], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `chat_log_export_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Chat log exported successfully");
    } catch {
      toast.error("Export failed");
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    const doubleCheck = window.confirm(
      "DANGER: Are you absolutely sure you want to permanently delete your account? This action is irreversible!"
    );
    if (!doubleCheck) return;

    setDeleting(true);
    try {
      await axios.delete("/api/auth/delete-account");
      toast.success("Account deleted successfully");
      await logout();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden p-6 text-slate-300">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
        <Settings className="w-6 h-6 text-indigo-400" />
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">System Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage block lists, export chat backups, and account settings</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
        {/* Blocked Users Block */}
        <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Blocked Contacts</h3>
          </div>

          {loading ? (
            <div className="h-20 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border border-indigo-500/20 border-t-indigo-500 animate-spin" />
            </div>
          ) : blockedUsers.length === 0 ? (
            <p className="text-xs text-slate-500">No blocked users.</p>
          ) : (
            <div className="space-y-3">
              {blockedUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between bg-slate-950/40 border border-slate-900 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user.profilePic || assets.avatar_icon}
                      alt={user.fullname}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-semibold text-white">{user.fullname}</p>
                      <p className="text-[10px] text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnblock(user._id)}
                    className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-350 cursor-pointer border border-indigo-500/20 hover:border-indigo-500/40 px-2.5 py-1 rounded"
                  >
                    <UserMinus className="w-3 h-3" />
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Data Portability */}
        <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Download className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Chat Data Export</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Download a portable JSON archive of the messages loaded in your current active workspace chat session.
          </p>
          <button
            onClick={handleExportChats}
            className="flex items-center gap-2 bg-indigo-650 hover:bg-indigo-600 active:scale-95 transition-all text-white text-xs font-semibold px-4 py-2 rounded-lg shadow cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Messages
          </button>
        </div>

        {/* Danger zone */}
        <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-semibold text-rose-400">Danger Zone</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Permanently delete your user profile and remove your credentials from the server. This action is final.
          </p>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="flex items-center gap-2 bg-rose-650 hover:bg-rose-600 active:scale-95 transition-all text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow cursor-pointer border border-rose-600/30"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? "Deleting Account..." : "Permanently Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
