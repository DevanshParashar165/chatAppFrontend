import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { Plus, Search, Users, Link2, Copy, Check, LogOut, Shield } from "lucide-react";
import toast from "react-hot-toast";

export const GroupsSidebar = () => {
  const authContext = useContext(AuthContext);
  const chatContext = useContext(ChatContext);

  if (!authContext || !chatContext) return null;

  const { axios } = authContext;
  const { setSelectedUser, selectedUser } = chatContext;

  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Form states
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await axios.get("api/groups/my");
      setGroups(res.data?.data?.groups || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return toast.error("Group name is required");

    try {
      const res = await axios.post("api/groups/create", {
        name: newGroupName,
        description: newGroupDesc,
      });
      const newGroup = res.data?.data?.group;
      toast.success("Group created successfully!");
      setGroups((prev) => [newGroup, ...prev]);
      setSelectedUser({ ...newGroup, isGroup: true });
      setShowCreateModal(false);
      setNewGroupName("");
      setNewGroupDesc("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create group");
    }
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return toast.error("Invite code is required");

    try {
      const res = await axios.post(`api/groups/join/${inviteCodeInput}`);
      const joinedGroup = res.data?.data?.group;
      toast.success("Joined group successfully!");
      setGroups((prev) => [joinedGroup, ...prev]);
      setSelectedUser({ ...joinedGroup, isGroup: true });
      setShowJoinModal(false);
      setInviteCodeInput("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to join group");
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Invite code copied!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full bg-slate-900/40 border-r border-slate-800/80 flex flex-col relative select-none">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
        <h2 className="font-bold text-lg text-slate-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          Groups
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowJoinModal(true)}
            title="Join via Code"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            <Link2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            title="Create Group"
            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative flex items-center bg-slate-950/60 rounded-lg px-3 py-2 border border-slate-800/80">
          <Search className="w-4 h-4 text-slate-500 mr-2" />
          <input
            type="text"
            placeholder="Search joined groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Group list */}
      <div className="flex-1 overflow-y-auto px-2">
        {loading ? (
          <div className="flex flex-col gap-3 p-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-800/50 rounded-lg w-full" />
            ))}
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500">
            No groups found. Create one to get started!
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {filteredGroups.map((group) => {
              const isSelected = selectedUser?._id === group._id;
              return (
                <div
                  key={group._id}
                  onClick={() => setSelectedUser({ ...group, isGroup: true })}
                  className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-indigo-600/15 border border-indigo-500/20 text-indigo-200"
                      : "hover:bg-slate-800/40 text-slate-300 hover:text-slate-100 border border-transparent"
                  }`}
                >
                  {/* Group Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white shadow-md">
                    {group.name[0].toUpperCase()}
                  </div>

                  {/* Group Metadata */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm truncate">{group.name}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(group.inviteCode);
                        }}
                        title="Copy Invite Code"
                        className="p-1 rounded hover:bg-slate-800/60 text-slate-400 hover:text-indigo-400 transition-colors"
                      >
                        {copiedCode === group.inviteCode ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {group.description || "No description"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-slate-100 mb-4">Create New Group</h3>
            <form onSubmit={handleCreateGroup} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Group Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Engineers"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  placeholder="What is this group about?"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
              <div className="flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg hover:bg-slate-800 text-sm font-medium text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-lg shadow-indigo-600/20 transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Group Modal */}
      {showJoinModal && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-slate-100 mb-4">Join via Invite Code</h3>
            <form onSubmit={handleJoinGroup} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Invite Code
                </label>
                <input
                  type="text"
                  placeholder="Enter 12-char hex code"
                  value={inviteCodeInput}
                  onChange={(e) => setInviteCodeInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 rounded-lg hover:bg-slate-800 text-sm font-medium text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-lg shadow-indigo-600/20 transition-all"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default GroupsSidebar;
