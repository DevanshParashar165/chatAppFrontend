import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  ReactNode,
  RefObject
} from "react";
import { AuthContext, User } from "./AuthContext";
import toast from "react-hot-toast";
import { createPeerConnection } from "../src/utils/webrtc.js";

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  seen: boolean;
  deliveryStatus: "sent" | "delivered" | "read";
  deliveredAt?: string;
  readAt?: string;
  isDeleted: boolean;
  createdAt: string;
}

export interface ChatContextType {
  messages: Message[];
  users: User[];
  selectedUser: any;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  loadOlderMessages: () => Promise<void>;
  hasMoreMessages: boolean;
  loadingOlder: boolean;
  sendMessage: (messageData: { text?: string; image?: string; audio?: string }) => Promise<void>;
  editMessage: (messageId: string, text: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  searchMessages: (query: string, userId: string) => Promise<Message[]>;
  setSelectedUser: (user: any) => void;
  unseenMessages: Record<string, number>;
  setUnseenMessages: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  startVideoCall: (userId: string) => Promise<void>;
  endCall: (notify?: boolean) => void;
  localVideoRef: RefObject<HTMLVideoElement | null>;
  remoteVideoRef: RefObject<HTMLVideoElement | null>;
  incomingCall: { from: string; offer: RTCSessionDescriptionInit } | null;
  isCalling: boolean;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  remoteStream: MediaStream | null;
  localStream: MediaStream | null;
  isPartnerTyping: boolean;
  handleInputChange: (value: string) => string;
  emitTypingStop: () => void;
  activeTab: "chats" | "groups" | "calls" | "settings" | "admin";
  setActiveTab: (tab: "chats" | "groups" | "calls" | "settings" | "admin") => void;
  replaceVideoTrack: (newTrack: MediaStreamTrack | null) => Promise<void>;
}

export const ChatContext = createContext<ChatContextType | null>(null);

const PAGE_SIZE = 30;

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const iceQueue = useRef<RTCIceCandidateInit[]>([]);
  const localStreamRef = useRef<MediaStream | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | number | null>(null);
  const nextCursorRef = useRef<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [unseenMessages, setUnseenMessages] = useState<Record<string, number>>({});
  const [incomingCall, setIncomingCall] = useState<{ from: string; offer: RTCSessionDescriptionInit } | null>(null);
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(false);
  const [loadingOlder, setLoadingOlder] = useState<boolean>(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"chats" | "groups" | "calls" | "settings" | "admin">("chats");

  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error("AuthContext must be used within an AuthProvider");
  const { socket, axios } = authContext;


  const getUsers = async () => {
    try {
      const { data } = await axios.get("api/messages/users");
      if (data.success) {
        setUsers(data.data?.filteredUser || []);
        setUnseenMessages(data.message || {});
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`, {
        params: { limit: PAGE_SIZE },
      });

      if (data.success) {
        const { messages: fetched = [], hasMore, nextCursor } = data.data || {};
        setMessages(fetched);
        setHasMoreMessages(hasMore);
        nextCursorRef.current = nextCursor;
      } else {
        setMessages([]);
      }
    } catch (error) {
      toast.error(error.message);
      setMessages([]);
    }
  };

  const loadOlderMessages = useCallback(async () => {
    if (!selectedUser || selectedUser.isAI || loadingOlder || !hasMoreMessages) {
      return;
    }

    if (!nextCursorRef.current) return;

    setLoadingOlder(true);
    try {
      const { data } = await axios.get(`/api/messages/${selectedUser._id}`, {
        params: { cursor: nextCursorRef.current, limit: PAGE_SIZE },
      });

      if (data.success) {
        const { messages: older = [], hasMore, nextCursor } = data.data || {};
        setMessages((prev) => [...older, ...prev]);
        setHasMoreMessages(hasMore);
        nextCursorRef.current = nextCursor;
      }
    } catch (error) {
      toast.error("Failed to load older messages");
    } finally {
      setLoadingOlder(false);
    }
  }, [selectedUser, loadingOlder, hasMoreMessages, axios]);

  const updateMessageStatus = (payload) => {
    if (payload.messageId) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === payload.messageId
            ? {
                ...msg,
                deliveryStatus: payload.deliveryStatus,
                deliveredAt: payload.deliveredAt,
                readAt: payload.readAt,
                seen: payload.deliveryStatus === "read",
              }
            : msg
        )
      );
    } else if (payload.partnerId && payload.deliveryStatus === "read") {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === payload.partnerId ||
          msg.senderId?.toString() === payload.partnerId
            ? {
                ...msg,
                deliveryStatus: "read",
                seen: true,
                readAt: payload.readAt,
              }
            : msg
        )
      );
    }
  };

  const sendMessage = async (messageData) => {
    if (!selectedUser) return;

    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success && data.data?.newMessage) {
        setMessages((prev) => [...prev, data.data.newMessage]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const editMessage = async (messageId, text) => {
    try {
      const { data } = await axios.put(`/api/messages/${messageId}`, { text });
      if (data.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, ...data.data.message } : msg
          )
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const { data } = await axios.delete(`/api/messages/${messageId}`);
      if (data.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const searchMessages = async (query, userId) => {
    try {
      const { data } = await axios.get("/api/messages/search", {
        params: { q: query, userId },
      });
      return data.success ? data.data.messages : [];
    } catch {
      return [];
    }
  };

  const emitTypingStart = () => {
    if (!socket || !selectedUser || selectedUser.isAI) return;
    socket.emit("typing-start", { to: selectedUser._id });
  };

  const emitTypingStop = () => {
    if (!socket || !selectedUser || selectedUser.isAI) return;
    socket.emit("typing-stop", { to: selectedUser._id });
  };

  const handleInputChange = (value) => {
    emitTypingStart();
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(emitTypingStop, 1500);
    return value;
  };

  const startVideoCall = async (userId) => {
    try {
      setIsCalling(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      setLocalStream(stream);

      if (peerRef.current) peerRef.current.close();
      peerRef.current = createPeerConnection();

      stream.getTracks().forEach((track) =>
        peerRef.current.addTrack(track, stream)
      );

      peerRef.current.ontrack = (e) => {
        setRemoteStream(e.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = e.streams[0];
        }
      };

      peerRef.current.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", {
            to: userId,
            candidate: e.candidate,
          });
        }
      };

      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);

      socket.emit("call-user", { to: userId, offer });
    } catch {
      toast.error("Camera/mic permission denied");
      endCall();
    }
  };

  const endCall = (notify = true) => {
    if (isCalling && !remoteStream && selectedUser) {
      axios.post("/api/calls/log", { receiverId: selectedUser._id, status: "missed" }).catch(() => {});
    }

    if (notify) {
      socket?.emit("end-call", {
        to: selectedUser?._id || incomingCall?.from,
      });
    }

    iceQueue.current = [];

    if (peerRef.current) {
      peerRef.current.ontrack = null;
      peerRef.current.onicecandidate = null;
      peerRef.current.close();
      peerRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setLocalStream(null);
    setRemoteStream(null);
    setIncomingCall(null);
    setIsCalling(false);
  };

  useEffect(() => {
    if (!socket) return;

    const onIncomingCall = ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
      setIncomingCall({ from, offer });
      const caller = users.find((u) => u._id === from);
      setSelectedUser(caller || { _id: from, fullname: "Calling User" });
    };

    const onCallAccepted = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
      if (!peerRef.current) return;

      try {
        await peerRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );

        for (const c of iceQueue.current) {
          await peerRef.current.addIceCandidate(new RTCIceCandidate(c));
        }
        iceQueue.current = [];
      } catch (err) {
        console.error("Failed to handle call answer:", err);
        toast.error("Call connection failed");
        endCall(false);
      }
    };

    const onIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      if (!candidate) return;

      if (!peerRef.current) {
        iceQueue.current.push(candidate);
        return;
      }

      if (peerRef.current.remoteDescription) {
        try {
          await peerRef.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } catch (err) {
          console.error("Failed to add ICE candidate:", err);
        }
      } else {
        iceQueue.current.push(candidate);
      }
    };

    const onCallRejected = () => {
      toast.error("Call rejected");
      endCall(false);
    };

    const onCallEnded = () => endCall(false);

    const onTypingStart = ({ from }: { from: string }) => {
      if (selectedUser?._id === from) setIsPartnerTyping(true);
    };

    const onTypingStop = ({ from }: { from: string }) => {
      if (selectedUser?._id === from) setIsPartnerTyping(false);
    };

    const onMessageStatusUpdate = (payload: any) => updateMessageStatus(payload);

    const onMessageEdited = (message: Message) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === message._id ? message : msg))
      );
    };

    const onMessageDeleted = ({ messageId }: { messageId: string }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    };

    socket.on("incoming-call", onIncomingCall);
    socket.on("call-accepted", onCallAccepted);
    socket.on("ice-candidate", onIceCandidate);
    socket.on("call-rejected", onCallRejected);
    socket.on("call-ended", onCallEnded);
    socket.on("typing-start", onTypingStart);
    socket.on("typing-stop", onTypingStop);
    socket.on("messageStatusUpdate", onMessageStatusUpdate);
    socket.on("messageEdited", onMessageEdited);
    socket.on("messageDeleted", onMessageDeleted);

    return () => {
      socket.off("incoming-call", onIncomingCall);
      socket.off("call-accepted", onCallAccepted);
      socket.off("ice-candidate", onIceCandidate);
      socket.off("call-rejected", onCallRejected);
      socket.off("call-ended", onCallEnded);
      socket.off("typing-start", onTypingStart);
      socket.off("typing-stop", onTypingStop);
      socket.off("messageStatusUpdate", onMessageStatusUpdate);
      socket.off("messageEdited", onMessageEdited);
      socket.off("messageDeleted", onMessageDeleted);
    };
  }, [socket, users, selectedUser]);

  const acceptCall = async () => {
    if (!incomingCall) return;

    try {
      setIsCalling(true);
      axios.post("/api/calls/log", { receiverId: incomingCall.from, status: "answered" }).catch(() => {});

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      setLocalStream(stream);

      if (peerRef.current) peerRef.current.close();
      peerRef.current = createPeerConnection();

      stream.getTracks().forEach((track) =>
        peerRef.current!.addTrack(track, stream)
      );

      peerRef.current.ontrack = (e) => {
        setRemoteStream(e.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = e.streams[0];
        }
      };

      peerRef.current.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", {
            to: incomingCall.from,
            candidate: e.candidate,
          });
        }
      };

      await peerRef.current.setRemoteDescription(
        new RTCSessionDescription(incomingCall.offer)
      );

      for (const c of iceQueue.current) {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(c));
      }
      iceQueue.current = [];

      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);

      socket.emit("answer-call", {
        to: incomingCall.from,
        answer,
      });

      setIncomingCall(null);
    } catch {
      toast.error("Failed to accept call");
      endCall();
    }
  };

  const rejectCall = () => {
    if (!incomingCall) return;
    socket.emit("reject-call", { to: incomingCall.from });
    axios.post("/api/calls/log", { receiverId: incomingCall.from, status: "rejected" }).catch(() => {});
    setIncomingCall(null);
  };

  useEffect(() => {
    if (!socket) return;

    const onNewMessage = async (msg: Message) => {
      const isCurrentChat = selectedUser && (
        (selectedUser.isGroup && msg.groupId === selectedUser._id) ||
        (!selectedUser.isGroup && msg.senderId === selectedUser._id)
      );

      if (isCurrentChat) {
        setMessages((prev) => [...prev, { ...msg, seen: true }]);
        socket.emit("message-delivered", { messageIds: [msg._id] });
        await axios.put(`api/messages/mark/${msg._id}`);
      } else {
        const key = msg.groupId || msg.senderId;
        setUnseenMessages((prev) => ({
          ...prev,
          [key]: (prev[key] || 0) + 1,
        }));

        if (document.hasFocus()) {
          socket.emit("message-delivered", { messageIds: [msg._id] });
        }
      }
    };

    const onMessageReaction = ({ messageId, reactions }: { messageId: string; reactions: any[] }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, reactions } : msg))
      );
    };

    const onMessagePinToggle = ({ messageId, isPinned, pinnedBy }: { messageId: string; isPinned: boolean; pinnedBy: string }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, isPinned, pinnedBy } : msg))
      );
    };

    socket.on("newMessage", onNewMessage);
    socket.on("message-reaction", onMessageReaction);
    socket.on("message-pin-toggle", onMessagePinToggle);
    return () => {
      socket.off("newMessage", onNewMessage);
      socket.off("message-reaction", onMessageReaction);
      socket.off("message-pin-toggle", onMessagePinToggle);
    };
  }, [socket, selectedUser, axios]);

  const replaceVideoTrack = useCallback(async (newTrack: MediaStreamTrack | null) => {
    if (!peerRef.current || !newTrack) return;
    const senders = peerRef.current.getSenders();
    const videoSender = senders.find((s) => s.track?.kind === "video");
    if (videoSender) {
      await videoSender.replaceTrack(newTrack);
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        loadOlderMessages,
        hasMoreMessages,
        loadingOlder,
        sendMessage,
        editMessage,
        deleteMessage,
        searchMessages,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        startVideoCall,
        endCall,
        localVideoRef,
        remoteVideoRef,
        incomingCall,
        isCalling,
        acceptCall,
        rejectCall,
        remoteStream,
        localStream,
        isPartnerTyping,
        handleInputChange,
        emitTypingStop,
        activeTab,
        setActiveTab,
        replaceVideoTrack,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
