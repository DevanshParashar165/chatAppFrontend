import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  PhoneOff,
} from "lucide-react";
import toast from "react-hot-toast";

export const VideoCall = () => {
  const chatContext = useContext(ChatContext);
  if (!chatContext) return null;

  const {
    endCall,
    localVideoRef,
    remoteVideoRef,
    localStream,
    remoteStream,
    selectedUser,
    replaceVideoTrack,
  } = chatContext;

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, localVideoRef]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, remoteVideoRef]);

  // Toggle Mute (Microphone)
  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        setIsMuted(!audioTracks[0].enabled);
      }
    }
  };

  // Toggle Camera
  const toggleCamera = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
        setIsCameraOff(!videoTracks[0].enabled);
      }
    }
  };

  // Toggle Screen Share
  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        // Stop screen share and restore camera
        if (screenStream) {
          screenStream.getTracks().forEach((track) => track.stop());
        }
        setScreenStream(null);

        // Restore camera video track
        if (localStream) {
          const cameraTrack = localStream.getVideoTracks()[0];
          if (cameraTrack) {
            await replaceVideoTrack(cameraTrack);
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = localStream;
            }
          }
        }
        setIsScreenSharing(false);
      } else {
        // Start screen share
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        const screenTrack = stream.getVideoTracks()[0];
        if (screenTrack) {
          await replaceVideoTrack(screenTrack);

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }

          // Handle screen sharing stopped by user (browser UI button)
          screenTrack.onended = async () => {
            stream.getTracks().forEach((track) => track.stop());
            setScreenStream(null);
            setIsScreenSharing(false);

            if (localStream) {
              const cameraTrack = localStream.getVideoTracks()[0];
              if (cameraTrack) {
                await replaceVideoTrack(cameraTrack);
                if (localVideoRef.current) {
                  localVideoRef.current.srcObject = localStream;
                }
              }
            }
          };

          setScreenStream(stream);
          setIsScreenSharing(true);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Screen share permission denied or failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 flex flex-col select-none">
      {/* Remote Video (Full Screen) */}
      <div className="relative flex-1 min-h-0 bg-slate-950 flex items-center justify-center">
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="relative">
              <div className="absolute inset-0 w-24 h-24 rounded-full bg-indigo-500/10 animate-ping" />
              <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-4xl font-bold text-white shadow-xl">
                {selectedUser?.fullname?.[0]?.toUpperCase() || "?"}
              </div>
            </div>
            <div>
              <p className="text-white font-semibold text-lg">
                {selectedUser?.fullname || "Connecting..."}
              </p>
              <p className="text-slate-500 text-sm animate-pulse mt-1">
                Waiting for answer...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Top Bar (Call details) */}
      <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-slate-950/90 to-transparent flex items-center justify-between z-10">
        <div>
          <p className="text-white font-bold tracking-tight">
            {selectedUser?.fullname || "QuickChat Call"}
          </p>
          <p className="text-slate-400 text-xs mt-0.5">
            {remoteStream ? "HD connection active" : "Establishing peer connection"}
          </p>
        </div>
      </div>

      {/* Local Video Overlay (Picture in Picture) */}
      <div className="absolute bottom-28 right-6 w-40 h-28 md:w-52 md:h-36 rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-900">
        {localStream && !isCameraOff ? (
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover scale-x-[-1]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs gap-1 bg-slate-950">
            <VideoOff className="w-5 h-5 text-slate-650" />
            Camera off
          </div>
        )}
      </div>

      {/* Controls HUD */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center bg-gradient-to-t from-slate-950/90 to-transparent">
        <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-850 px-6 py-3.5 rounded-full shadow-2xl backdrop-blur-md">
          {/* Mute button */}
          <button
            onClick={toggleMute}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isMuted
                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200"
            }`}
            title={isMuted ? "Unmute Mic" : "Mute Mic"}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Camera toggle */}
          <button
            onClick={toggleCamera}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isCameraOff
                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200"
            }`}
            title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
          >
            {isCameraOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
          </button>

          {/* Screen Share toggle */}
          <button
            onClick={toggleScreenShare}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isScreenSharing
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200"
            }`}
            title={isScreenSharing ? "Stop Sharing Screen" : "Share Screen"}
          >
            <Monitor className="w-5 h-5" />
          </button>

          <div className="w-[1px] h-6 bg-slate-800 mx-1" />

          {/* End Call button */}
          <button
            onClick={() => endCall()}
            className="w-11 h-11 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 transition-all text-white flex items-center justify-center shadow-lg shadow-rose-600/20 cursor-pointer"
            title="End Call"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default VideoCall;
