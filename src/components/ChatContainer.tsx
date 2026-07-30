import React, { useContext, useEffect, useRef, useState } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import EmptyState from "./EmptyState";
import { Check, CheckCheck, Pin, Mic, Square, Trash2, Reply, X, Sparkles } from "lucide-react";

const ChatContainer = () => {
  const chatContext = useContext(ChatContext);
  const authContext = useContext(AuthContext);

  if (!chatContext || !authContext) return null;

  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
    loadOlderMessages,
    loadingOlder,
    startVideoCall,
    handleInputChange,
    emitTypingStop,
  } = chatContext;
  const { authUser, onlineUser, axios } = authContext;

  const scrollEnd = useRef<HTMLDivElement | null>(null);

  const [input, setInput] = useState("");
  const [replyingTo, setReplyingTo] = useState<any | null>(null);

  const handleToggleReaction = async (messageId: string, emoji: string) => {
    try {
      await axios.post(`api/messages/${messageId}/react`, { emoji });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to react");
    }
  };

  const handleTogglePin = async (messageId: string) => {
    try {
      await axios.post(`api/messages/${messageId}/pin`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to toggle pin");
    }
  };

  // Voice Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<any>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          await sendMessage({ audio: base64Audio });
        };
        // Stop streams
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      toast.error("Could not access microphone");
    }
  };

  // Stop recording and send
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    cleanupRecorder();
  };

  // Cancel recording
  const cancelRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.onstop = null; // discard trigger
      mediaRecorder.stop();
    }
    cleanupRecorder();
    toast.error("Recording cancelled");
  };

  const cleanupRecorder = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    setMediaRecorder(null);
    setRecordingTime(0);
  };

  // AI Productivity suite states
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isCorrectingGrammar, setIsCorrectingGrammar] = useState(false);

  const fetchSmartReplies = async () => {
    if (messages.length === 0 || selectedUser?.isAI) {
      setSmartReplies([]);
      return;
    }
    try {
      const { data } = await axios.post("/api/ai/action", {
        action: "replies",
        messagesList: messages.map((m) => ({ text: m.text, senderId: m.senderId })),
      });
      if (data.success && Array.isArray(data.data?.result)) {
        setSmartReplies(data.data.result);
      }
    } catch {
      setSmartReplies([]);
    }
  };

  useEffect(() => {
    fetchSmartReplies();
  }, [messages.length, selectedUser]);

  const handleCorrectGrammar = async () => {
    if (!input.trim()) return;
    setIsCorrectingGrammar(true);
    try {
      const modRes = await axios.post("/api/ai/action", {
        action: "moderation",
        messageText: input.trim(),
      });
      if (modRes.data?.success && modRes.data.data?.result !== "clean") {
        toast.error(`AI Filter: ${modRes.data.data.result}`);
      }

      const { data } = await axios.post("/api/ai/action", {
        action: "grammar",
        messageText: input.trim(),
      });
      if (data.success && data.data?.result) {
        setInput(data.data.result);
        toast.success("Corrected!");
      }
    } catch {
      toast.error("AI assistant offline");
    } finally {
      setIsCorrectingGrammar(false);
    }
  };

  const handleGetSummary = async () => {
    if (messages.length === 0) return;
    setIsLoadingSummary(true);
    try {
      const { data } = await axios.post("/api/ai/action", {
        action: "summary",
        messagesList: messages.map((m) => ({ text: m.text, senderId: m.senderId })),
      });
      if (data.success && data.data?.result) {
        setAiSummary(data.data.result);
      }
    } catch {
      toast.error("Could not fetch summary");
    } finally {
      setIsLoadingSummary(false);
    }
  };

  // Handle send message
  const handleSendMessages = async (e: React.FormEvent | any) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    emitTypingStop();
    await sendMessage({
      text: input.trim(),
      replyTo: replyingTo ? replyingTo._id : undefined,
    });
    setInput("");
    setReplyingTo(null);
  };

  // handle sending an image

  const handleSendImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an Image file");
      return;
    }
    const reader = new FileReader();

    reader.onloadend = async () => {
      await sendMessage({ image: reader.result as string });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (!loadingOlder && scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, loadingOlder]);

  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser?.fullname}
          {onlineUser?.includes(selectedUser._id) && (
            <span className="w-2 h-2  rounded-full bg-green-500"></span>
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7"
        />
        <button
          onClick={handleGetSummary}
          disabled={isLoadingSummary || messages.length === 0}
          title="Summarize Chat (AI)"
          className="text-slate-400 hover:text-indigo-450 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center p-1 rounded-lg hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-800/80 mr-1.5"
        >
          <Sparkles className={`w-4 h-4 ${isLoadingSummary ? 'animate-pulse text-indigo-400' : ''}`} />
        </button>
        <img
          onClick={() => startVideoCall(selectedUser._id)}
          src={assets.video_call}
          alt=""
          className="max-md:hidden max-w-8 cursor-pointer"
        />
      </div>
      {/* chat area */}
      <div
        className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6"
        onScroll={(e) => {
          if (e.currentTarget.scrollTop === 0) loadOlderMessages();
        }}
      >
        {aiSummary && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 mb-4 text-xs text-slate-300 select-none shadow-lg relative flex flex-col gap-2 mx-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-white">AI Conversation Summary</span>
              </div>
              <button
                onClick={() => setAiSummary(null)}
                className="text-slate-400 hover:text-slate-100 cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="leading-relaxed whitespace-pre-line">{aiSummary}</p>
          </div>
        )}
        {messages.map((msg, index) => {
          const senderObj = typeof msg.senderId === "object" ? (msg.senderId as any) : null;
          const senderIdStr = senderObj ? senderObj._id : msg.senderId;
          const isMyMessage = senderIdStr === authUser._id;

          const senderName = senderObj ? senderObj.fullname : (isMyMessage ? authUser.fullname : selectedUser?.fullname);
          const senderPic = senderObj ? senderObj.profilePic : (isMyMessage ? authUser?.profilePic : selectedUser?.profilePic);

          return (
            <div
              key={index}
              className={`group relative flex items-end gap-2 justify-end ${!isMyMessage && "flex-row-reverse"}`}
            >
              {/* Hover reactions popup */}
              <div className={`absolute top-[-32px] ${isMyMessage ? 'right-12' : 'left-12'} hidden group-hover:flex items-center gap-1 bg-slate-955 border border-slate-800 rounded-full px-2 py-1 shadow-lg z-10`}>
                {["👍", "❤️", "😂", "😮", "😢", "🙏"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleToggleReaction(msg._id, emoji)}
                    className="hover:scale-125 transition-transform px-1 cursor-pointer text-xs"
                  >
                    {emoji}
                  </button>
                ))}
                <div className="w-[1px] h-3 bg-slate-800 mx-1" />
                <button
                  onClick={() => handleTogglePin(msg._id)}
                  title={msg.isPinned ? "Unpin Message" : "Pin Message"}
                  className="hover:scale-110 transition-transform p-0.5 text-slate-400 hover:text-indigo-400 cursor-pointer"
                >
                  <Pin className={`w-3.5 h-3.5 ${msg.isPinned ? "fill-indigo-500 text-indigo-500" : ""}`} />
                </button>
                <button
                  onClick={() => setReplyingTo(msg)}
                  title="Reply"
                  className="hover:scale-110 transition-transform p-0.5 text-slate-400 hover:text-indigo-400 cursor-pointer"
                >
                  <Reply className="w-3.5 h-3.5" />
                </button>
              </div>

              {msg.audio ? (
                <div className={`flex flex-col mb-8 ${!isMyMessage ? 'items-start' : 'items-end'}`}>
                  {msg.isPinned && (
                    <div className="flex items-center gap-1 text-[9px] text-indigo-400 mb-1 font-semibold uppercase tracking-wide">
                      <Pin className="w-2.5 h-2.5 fill-indigo-400" />
                      <span>Pinned</span>
                    </div>
                  )}
                  {selectedUser?.isGroup && !isMyMessage && (
                    <span className="text-[10px] text-slate-400 mr-2 mb-1">{senderName}</span>
                  )}
                  {msg.replyTo && (
                    <div className="bg-slate-950/40 border-l-2 border-indigo-500 rounded p-1.5 mb-1 text-[10px] text-left max-w-[200px] truncate opacity-85 select-none">
                      <span className="font-semibold text-indigo-400 block mb-0.5">
                        {msg.replyTo.senderId?._id === authUser._id ? "You" : msg.replyTo.senderId?.fullname}
                      </span>
                      <span className="text-slate-300">
                        {msg.replyTo.text || (msg.replyTo.image ? "🖼️ Image" : "🎙️ Voice note")}
                      </span>
                    </div>
                  )}
                  <div className="bg-slate-905 border border-slate-800 p-2 rounded-2xl max-w-[245px] shadow-md flex items-center">
                    <audio
                      src={msg.audio}
                      controls
                      className="w-full max-w-[210px] h-8 outline-none filter invert contrast-125 scale-95"
                    />
                  </div>
                  {/* Reactions list */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(
                        msg.reactions.reduce((acc: Record<string, string[]>, r: any) => {
                          acc[r.emoji] = acc[r.emoji] || [];
                          acc[r.emoji].push(r.userId);
                          return acc;
                        }, {})
                      ).map(([emoji, userIds]: [string, any]) => {
                        const hasReacted = userIds.includes(authUser._id);
                        return (
                          <button
                            key={emoji}
                            onClick={() => handleToggleReaction(msg._id, emoji)}
                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] border cursor-pointer transition-colors ${hasReacted
                                ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
                                : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200"
                              }`}
                            title={`${userIds.length} reaction(s)`}
                          >
                            <span>{emoji}</span>
                            <span>{userIds.length}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : msg.image ? (
                <div className={`flex flex-col mb-8 ${!isMyMessage ? 'items-start' : 'items-end'}`}>
                  {msg.isPinned && (
                    <div className="flex items-center gap-1 text-[9px] text-indigo-400 mb-1 font-semibold uppercase tracking-wide">
                      <Pin className="w-2.5 h-2.5 fill-indigo-400" />
                      <span>Pinned</span>
                    </div>
                  )}
                  {selectedUser?.isGroup && !isMyMessage && (
                    <span className="text-[10px] text-slate-400 mr-2 mb-1">{senderName}</span>
                  )}
                  {msg.replyTo && (
                    <div className="bg-slate-950/40 border-l-2 border-indigo-500 rounded p-1.5 mb-1 text-[10px] text-left max-w-[200px] truncate opacity-85 select-none">
                      <span className="font-semibold text-indigo-400 block mb-0.5">
                        {msg.replyTo.senderId?._id === authUser._id ? "You" : msg.replyTo.senderId?.fullname}
                      </span>
                      <span className="text-slate-300">
                        {msg.replyTo.text || (msg.replyTo.image ? "🖼️ Image" : "🎙️ Voice note")}
                      </span>
                    </div>
                  )}
                  <img
                    src={msg.image}
                    alt=""
                    className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden"
                  />
                  {/* Reactions list */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(
                        msg.reactions.reduce((acc: Record<string, string[]>, r: any) => {
                          acc[r.emoji] = acc[r.emoji] || [];
                          acc[r.emoji].push(r.userId);
                          return acc;
                        }, {})
                      ).map(([emoji, userIds]: [string, any]) => {
                        const hasReacted = userIds.includes(authUser._id);
                        return (
                          <button
                            key={emoji}
                            onClick={() => handleToggleReaction(msg._id, emoji)}
                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] border cursor-pointer transition-colors ${hasReacted
                                ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
                                : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200"
                              }`}
                            title={`${userIds.length} reaction(s)`}
                          >
                            <span>{emoji}</span>
                            <span>{userIds.length}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className={`flex flex-col mb-8 ${!isMyMessage ? 'items-start' : 'items-end'}`}>
                  {msg.isPinned && (
                    <div className="flex items-center gap-1 text-[9px] text-indigo-400 mb-1 font-semibold uppercase tracking-wide">
                      <Pin className="w-2.5 h-2.5 fill-indigo-400" />
                      <span>Pinned</span>
                    </div>
                  )}
                  {selectedUser?.isGroup && !isMyMessage && (
                    <span className="text-[10px] text-slate-400 mr-2 mb-1">{senderName}</span>
                  )}
                  {msg.replyTo && (
                    <div className="bg-slate-950/40 border-l-2 border-indigo-500 rounded p-1.5 mb-1 text-[10px] text-left max-w-[200px] truncate opacity-85 select-none">
                      <span className="font-semibold text-indigo-400 block mb-0.5">
                        {msg.replyTo.senderId?._id === authUser._id ? "You" : msg.replyTo.senderId?.fullname}
                      </span>
                      <span className="text-slate-300">
                        {msg.replyTo.text || (msg.replyTo.image ? "🖼️ Image" : "🎙️ Voice note")}
                      </span>
                    </div>
                  )}
                  <p
                    className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all bg-violet-500/30 text-white ${!isMyMessage ? "rounded-br-none" : "rounded-bl-none"}`}
                  >
                    {msg.text}
                  </p>
                  {/* Reactions list */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(
                        msg.reactions.reduce((acc: Record<string, string[]>, r: any) => {
                          acc[r.emoji] = acc[r.emoji] || [];
                          acc[r.emoji].push(r.userId);
                          return acc;
                        }, {})
                      ).map(([emoji, userIds]: [string, any]) => {
                        const hasReacted = userIds.includes(authUser._id);
                        return (
                          <button
                            key={emoji}
                            onClick={() => handleToggleReaction(msg._id, emoji)}
                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] border cursor-pointer transition-colors ${hasReacted
                                ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
                                : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200"
                              }`}
                            title={`${userIds.length} reaction(s)`}
                          >
                            <span>{emoji}</span>
                            <span>{userIds.length}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              <div className="text-center text-xs">
                <img
                  src={senderPic || assets.avatar_icon}
                  alt=""
                  className="rounded-full w-7 aspect-square object-cover"
                />
                <div className="text-gray-500 flex items-center justify-center gap-0.5 mt-0.5">
                  <span>{formatMessageTime(msg.createdAt)}</span>
                  {isMyMessage && !selectedUser?.isGroup && (
                    <span>
                      {msg.deliveryStatus === "read" ? (
                        <CheckCheck className="w-3 h-3 text-sky-400" />
                      ) : msg.deliveryStatus === "delivered" ? (
                        <CheckCheck className="w-3 h-3 text-slate-400" />
                      ) : (
                        <Check className="w-3 h-3 text-slate-500" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>
      {/* bottom area */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col p-3 bg-slate-950/40 border-t border-slate-800/40">
        {replyingTo && (
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl mb-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 truncate">
              <Reply className="w-3.5 h-3.5 text-indigo-400" />
              <span>Replying to <span className="font-semibold text-indigo-300">{(replyingTo.senderId?.fullname || (replyingTo.senderId?._id === authUser._id ? "You" : selectedUser?.fullname))}</span></span>
              <span className="text-slate-500 truncate">: "{replyingTo.text || (replyingTo.image ? "🖼️ Image" : "🎙️ Voice note")}"</span>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-slate-400 hover:text-slate-100 cursor-pointer p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Smart Replies suggestions block */}
        {smartReplies.length > 0 && !isRecording && (
          <div className="flex items-center gap-1.5 flex-wrap mb-2.5 px-1 animate-fade-in select-none">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mr-1 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
              Suggestions:
            </span>
            {smartReplies.map((replyText, idx) => (
              <button
                key={idx}
                onClick={async () => {
                  await sendMessage({ text: replyText });
                  setSmartReplies([]);
                }}
                className="text-[10px] bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white px-2.5 py-0.5 rounded-full cursor-pointer transition-all active:scale-95 shadow-sm"
              >
                {replyText}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 w-full">
          {isRecording ? (
            <div className="flex-1 flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-full px-4 py-2.5 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                <span className="font-semibold text-rose-400">Recording</span>
                <span className="text-slate-500">•</span>
                <span className="font-mono text-slate-400">
                  {Math.floor(recordingTime / 60).toString().padStart(2, "0")}:
                  {(recordingTime % 60).toString().padStart(2, "0")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={cancelRecording}
                  title="Cancel"
                  className="text-slate-400 hover:text-rose-400 cursor-pointer transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={stopRecording}
                  title="Send voice note"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded-full cursor-pointer transition-all shadow-md flex items-center justify-center"
                >
                  <Square className="w-3.5 h-3.5 fill-white text-white" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
              <input
                onChange={(e) => setInput(handleInputChange(e.target.value))}
                value={input}
                onKeyDown={(e) =>
                  e.key === "Enter" ? handleSendMessages(e) : null
                }
                type="text"
                placeholder="Send a message"
                className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent"
              />
              <input
                onChange={handleSendImage}
                type="file"
                id="image"
                accept="image/png , image/jpeg"
                hidden
              />
              <div className="flex items-center gap-3.5">
                {input.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={handleCorrectGrammar}
                    disabled={isCorrectingGrammar}
                    title="Optimize style & correct spelling (AI)"
                    className="text-slate-400 hover:text-indigo-400 cursor-pointer disabled:opacity-50 flex items-center justify-center"
                  >
                    <Sparkles className={`w-4 h-4 ${isCorrectingGrammar ? 'animate-pulse text-indigo-400' : ''}`} />
                  </button>
                )}
                <label htmlFor="image" className="cursor-pointer flex items-center">
                  <img
                    src={assets.gallery_icon}
                    alt=""
                    className="w-5 cursor-pointer hover:scale-105 transition-transform"
                  />
                </label>
                <button
                  type="button"
                  onClick={startRecording}
                  title="Record Voice Note"
                  className="text-slate-400 hover:text-indigo-400 cursor-pointer transition-colors flex items-center justify-center"
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
          {!isRecording && (
            <img
              onClick={handleSendMessages}
              src={assets.send_button}
              alt=""
              className="w-7 cursor-pointer hover:scale-105 transition-transform"
            />
          )}
        </div>
      </div>
    </div>
  ) : (
    <EmptyState />
  );
};

export default ChatContainer;
