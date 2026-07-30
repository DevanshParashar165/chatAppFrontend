import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Shield, Users, MessageSquare, PhoneCall, Layers, ShieldCheck, UserX } from "lucide-react";
import toast from "react-hot-toast";
import assets from "../assets/assets";
import { formatDistanceToNow } from "date-fns";

interface AdminUserRecord {
  _id: string;
  fullname: string;
  email: string;
  role: "user" | "admin";
  profilePic?: string;
  createdAt: string;
}

interface StatsSummary {
  totalUsers: number;
  totalMessages: number;
  totalGroups: number;
  totalCalls: number;
}

export const AdminPanel = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { axios } = authContext;

  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const { data } = await axios.get("/api/calls/admin/stats");
      if (data.success) {
        setStats(data.data.stats);
        setUsers(data.data.users);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load admin logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [axios]);

  const handleToggleRole = async (userId: string) => {
    try {
      const { data } = await axios.put(`/api/calls/admin/users/${userId}/role`);
      if (data.success) {
        toast.success(data.message);
        fetchAdminData();
      }
    } catch {
      toast.error("Role update failed");
    }
  };

  const handleBanUser = async (userId: string) => {
    const confirmBan = window.confirm("Are you sure you want to ban and permanently delete this user from the system?");
    if (!confirmBan) return;

    try {
      const { data } = await axios.delete(`/api/calls/admin/users/${userId}`);
      if (data.success) {
        toast.success("User banned successfully");
        fetchAdminData();
      }
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden p-6 text-slate-350">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
        <Shield className="w-6 h-6 text-indigo-400" />
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Admin Dashboard</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time metrics, user role permissions, and platform moderation</p>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex items-center gap-3.5">
              <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-450">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Total Users</span>
                <span className="text-lg font-bold text-white">{stats?.totalUsers || 0}</span>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex items-center gap-3.5">
              <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-450">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Messages</span>
                <span className="text-lg font-bold text-white">{stats?.totalMessages || 0}</span>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex items-center gap-3.5">
              <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-450">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Group Channels</span>
                <span className="text-lg font-bold text-white">{stats?.totalGroups || 0}</span>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex items-center gap-3.5">
              <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-450">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Calls Logged</span>
                <span className="text-lg font-bold text-white">{stats?.totalCalls || 0}</span>
              </div>
            </div>
          </div>

          {/* User management list */}
          <div className="bg-slate-900/40 border border-slate-850 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-850 flex items-center justify-between">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">User Directory</span>
              <span className="text-[10px] text-slate-500 font-semibold">{users.length} registration(s)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-850 text-slate-500">
                    <th className="px-5 py-3.5 font-semibold">User</th>
                    <th className="px-5 py-3.5 font-semibold">Role</th>
                    <th className="px-5 py-3.5 font-semibold">Joined</th>
                    <th className="px-5 py-3.5 font-semibold text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/40">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-900/20">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.profilePic || assets.avatar_icon}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover border border-slate-800"
                          />
                          <div>
                            <span className="font-semibold text-white block">{user.fullname}</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-semibold border ${
                            user.role === "admin"
                              ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                              : "bg-slate-900 border-slate-850 text-slate-400"
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500 text-[10px]">
                        {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => handleToggleRole(user._id)}
                            className="text-[10px] text-indigo-400 hover:underline cursor-pointer"
                          >
                            Toggle Role
                          </button>
                          <button
                            onClick={() => handleBanUser(user._id)}
                            className="text-[10px] text-rose-500 hover:text-rose-400 flex items-center gap-1 cursor-pointer font-medium"
                            title="Ban / Delete User"
                          >
                            <UserX className="w-3 h-3" />
                            Ban
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
