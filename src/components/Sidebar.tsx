import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const Sidebar = () => {
  const chatContext = useContext(ChatContext);
  const authContext = useContext(AuthContext);

  if (!chatContext || !authContext) return null;

  const {
    getUsers,
    users = [],
    selectedUser,
    setSelectedUser,
    unseenMessages = {},
    setUnseenMessages,
  } = chatContext;

  const { logout, onlineUser } = authContext;

  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const aiUser = {
    _id: "ai_quickchat",
    fullname: "QuickChat AI",
    profilePic: assets.ai_logo, // make sure this exists
    isAI: true,
  };

  const allUsers = users.length > 0 ? [aiUser, ...users] : [aiUser];

  const filteredUsers = input
    ? allUsers.filter((user) =>
        user.fullname?.toLowerCase().includes(input.toLowerCase())
      )
    : allUsers;

  useEffect(() => {
    getUsers();
  }, [onlineUser]);

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="Logo" className="max-h-40" />

          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p
                className="cursor-pointer text-sm"
                onClick={() => logout()}
              >
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>

      {/* USER LIST */}
      <div>
        {filteredUsers.map((user, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                setSelectedUser(user);

                if (!user.isAI) {
                  setUnseenMessages((prev) => ({
                    ...prev,
                    [user._id]: 0,
                  }));
                }
              }}
              className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
                selectedUser?._id === user._id
                  ? "bg-[#282142]/50"
                  : ""
              }`}
            >
              {/* PROFILE IMAGE */}
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt="Profile Pic"
                className="w-[35px] aspect-[1/1] rounded-full"
              />

              {/* USER INFO */}
              <div className="flex flex-col leading-5">
                <p>{user.fullname}</p>

                {user.isAI ? (
                  <span className="text-violet-400 text-xs">
                    AI Assistant
                  </span>
                ) : onlineUser?.includes(user._id) ? (
                  <span className="text-green-400 text-xs">
                    Online
                  </span>
                ) : (
                  <span className="text-neutral-400 text-xs">
                    Offline
                  </span>
                )}
              </div>

              {!user.isAI && unseenMessages[user._id] > 0 && (
                <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                  {unseenMessages[user._id]}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;