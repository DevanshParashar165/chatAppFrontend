import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Phone, PhoneCall, PhoneIncoming, PhoneMissed, PhoneOutgoing, Clock } from "lucide-react";
import assets from "../assets/assets";
import { formatDistanceToNow } from "date-fns";

interface CallLogRecord {
  _id: string;
  callerId: {
    _id: string;
    fullname: string;
    profilePic?: string;
  };
  receiverId: {
    _id: string;
    fullname: string;
    profilePic?: string;
  };
  status: "answered" | "rejected" | "missed";
  duration: number;
  createdAt: string;
}

export const CallHistory = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { authUser, axios } = authContext;

  const [logs, setLogs] = useState<CallLogRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await axios.get("/api/calls/history");
        if (data.success && data.data?.logs) {
          setLogs(data.data.logs);
        }
      } catch (err) {
        console.error("Failed to load call logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [axios]);

  const formatDuration = (sec: number) => {
    if (sec <= 0) return "0s";
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return mins > 0 ? `${mins}m ${remainingSecs}s` : `${remainingSecs}s`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden p-6 text-slate-350">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
        <Phone className="w-6 h-6 text-indigo-400" />
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Call History</h2>
          <p className="text-xs text-slate-500 mt-0.5">Logs of your incoming and outgoing voice/video connections</p>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <PhoneCall className="w-12 h-12 text-slate-700 mb-3" />
          <p className="text-sm font-medium text-slate-400">No calls yet</p>
          <p className="text-xs text-slate-500 mt-1">Initiated calls will show up here.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 custom-scrollbar">
          {logs.map((log) => {
            const isOutgoing = log.callerId._id === authUser._id;
            const partner = isOutgoing ? log.receiverId : log.callerId;

            // Status details
            let StatusIcon = PhoneCall;
            let statusColor = "text-indigo-400";
            if (log.status === "missed") {
              StatusIcon = PhoneMissed;
              statusColor = "text-rose-500";
            } else if (log.status === "rejected") {
              StatusIcon = PhoneMissed;
              statusColor = "text-amber-500";
            } else {
              StatusIcon = isOutgoing ? PhoneOutgoing : PhoneIncoming;
              statusColor = "text-emerald-400";
            }

            return (
              <div
                key={log._id}
                className="flex items-center justify-between bg-slate-900/40 border border-slate-850/60 p-4 rounded-xl hover:border-slate-800 hover:bg-slate-900/60 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={partner?.profilePic || assets.avatar_icon}
                    alt={partner?.fullname}
                    className="w-10 h-10 rounded-full object-cover border border-slate-850"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{partner?.fullname}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusIcon className={`w-3.5 h-3.5 ${statusColor}`} />
                      <span className="text-[11px] text-slate-400 capitalize">
                        {isOutgoing ? "Outgoing Call" : "Incoming Call"} ({log.status})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end text-slate-400">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className="text-[11px]">
                      {formatDuration(log.duration)}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CallHistory;
