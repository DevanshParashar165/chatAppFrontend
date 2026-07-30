import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import {
  MessageSquare,
  Users,
  PhoneCall,
  Settings as SettingsIcon,
  ShieldCheck,
  LogOut,
  User as UserIcon,
} from "lucide-react";


export const AppSidebar = () => {
  const authContext = useContext(AuthContext);
  const chatContext = useContext(ChatContext);
  const navigate = useNavigate();

  if (!authContext || !chatContext) return null;

  const { authUser, logout } = authContext;
  const { activeTab, setActiveTab } = chatContext;

  const menuItems = [
    { id: "chats", label: "Chats", icon: MessageSquare },
    { id: "groups", label: "Groups", icon: Users },
    { id: "calls", label: "Calls", icon: PhoneCall },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ] as const;
  const showAdminTab = authUser?.role === "admin";

  return (
    <div className="w-[72px] bg-slate-950 border-r border-slate-800/80 flex flex-col items-center py-6 gap-8 flex-shrink-0">
      {/* Brand logo */}
      <div
        onClick={() => navigate("/")}
        className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xl text-white cursor-pointer shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all"
      >
        Q
      </div>

      {/* Main Tabs */}
      <div className="flex-1 flex flex-col gap-4 w-full px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`relative group w-12 h-12 mx-auto rounded-xl flex items-center justify-center transition-all cursor-pointer ${isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60"
                }`}
            >
              {/* Left active indicator pill */}
              <div
                className={`absolute -left-2 top-1/2 -translate-y-1/2 w-[4px] h-6 bg-indigo-500 rounded-r-full transition-all duration-300 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-50"
                  }`}
              />
              <Icon className="w-5 h-5 transition-transform group-hover:scale-105" />
            </button>
          );
        })}

        {showAdminTab && (
          <button
            onClick={() => setActiveTab("admin")}
            title="Admin Panel"
            className={`relative group w-12 h-12 mx-auto rounded-xl flex items-center justify-center transition-all cursor-pointer ${activeTab === "admin"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
              : "text-emerald-500 hover:text-emerald-400 hover:bg-slate-900/60"
              }`}
          >
            <div
              className={`absolute -left-2 top-1/2 -translate-y-1/2 w-[4px] h-6 bg-emerald-500 rounded-r-full transition-all duration-300 ${activeTab === "admin" ? "opacity-100 scale-100" : "opacity-0 scale-50"
                }`}
            />
            <ShieldCheck className="w-5 h-5 transition-transform group-hover:scale-105" />
          </button>
        )}
      </div>

      {/* User profile actions */}
      <div className="flex flex-col gap-4 items-center w-full px-2">
        <button
          onClick={() => navigate("/profile")}
          title="Edit Profile"
          className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-800 hover:border-indigo-500 transition-all cursor-pointer group flex items-center justify-center bg-slate-900"
        >
          {authUser?.profilePic ? (
            <img
              src={authUser.profilePic}
              alt="Avatar"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <UserIcon className="w-5 h-5 text-slate-400" />
          )}
        </button>

        <button
          onClick={() => logout()}
          title="Logout"
          className="w-12 h-12 rounded-xl flex items-center justify-center text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
export default AppSidebar;
