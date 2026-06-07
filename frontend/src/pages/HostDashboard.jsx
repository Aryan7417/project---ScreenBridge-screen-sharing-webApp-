import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import FramePlayer from "../components/FramePlayer";
import CanvasChart from "../components/CanvasChart";
import socket from "../services/socket";
import peer from "../services/peer";



export default function HostDashboard() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // const [remoteSocketId, setRemoteSocketId] = useState(null);
  const remoteSocketIdRef = useRef(null);

  // Retrieve states passed from CreateRoom, or fallback to defaults
  const passedState = location.state || {};
  const [passcode] = useState(passedState.passcode || "9402");
  const [waitingRoom] = useState(passedState.waitingRoom || false);

  const [isSharing, setIsSharing] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(12);
  const [latencyVal, setLatencyVal] = useState(12);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // Fluctuating metric simulation
  useEffect(() => {
    const timer = setInterval(() => {
      // Fluctuate latency slightly
      setLatencyVal(prev => {
        const delta = (Math.random() - 0.5) * 4;
        return Math.max(8, Math.min(18, Math.round(prev + delta)));
      });


      socket.emit("join-room", roomId)

      peer.onicecandidate = async (event) => {

        if (event.candidate) {

          console.log("Sending ICE");

          socket.emit("ice-candidate", {
           to: remoteSocketIdRef.current,
            candidate: event.candidate
          });

        }

      }






      // Periodically join/leave participants
      if (Math.random() > 0.8) {
        setParticipantsCount(prev => {
          const delta = Math.random() > 0.5 ? 1 : -1;
          return Math.max(3, Math.min(20, prev + delta));
        });
      }
    }, 3000);

    socket.emit("join-room", roomId)

    //send user-join 

    socket.on("user-joined", (id) => {

      console.log("Viewer Joined :", id);

      //setRemoteSocketId(id);
      remoteSocketIdRef.current = id;

    });

    // socket.on("user-joined", async (id) => {

    //   setRemoteSocketId(id);

    //   if (peer.signalingState !== "stable") return;
    //   const offer = await peer.createOffer();

    //   await peer.setLocalDescription(offer);

    //   socket.emit("offer", {
    //     offer,
    //     to: id
    //   });

    // });

    //SEND offer receive

    socket.on("offer", async (data) => {

      console.log("Offer Received");

      try {

        if (peer.signalingState !== "stable") {

          console.log("Skipping duplicate offer");

          return;

        }

        setRemoteSocketId(data.from);

        await peer.setRemoteDescription(data.offer);

        if (peer.signalingState !== "have-remote-offer") {

          console.log("Wrong state after remote description");

          return;

        }

        const answer = await peer.createAnswer();

        if (peer.signalingState !== "have-remote-offer") {

          console.log("State changed before answer");

          return;

        }

        await peer.setLocalDescription(answer);

        socket.emit("answer", {
          answer,
          to: data.from
        });

      } catch (err) {

        console.log("Offer Error :", err);

      }

    });

    //recive answer

    socket.on("answer", async (data) => {



      if (!peer.remoteDescription) {

        await peer.setRemoteDescription(data.answer);

      }

    });


    socket.on("ice-candidate", async (data) => {

      console.log("ICE Candidate Received");

      await peer.addIceCandidate(data.candidate);

    });

    return () => clearInterval(timer);
    socket.off("user-joined");
    socket.off("offer");
    socket.off("answer");
    socket.off("ice-candidate");
  }, []);


  useEffect(()=>{
    console.log("host useEffect Running")
  })

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  const toggleSharing = async () => {

    const stream =
      await navigator.mediaDevices.getDisplayMedia({

        video: true,
        audio: false

      });

    myVideoRef.current.srcObject = stream;

    peer.getSenders().forEach((sender) => {

      peer.removeTrack(sender);

    });
    stream.getTracks().forEach((track) => {

      peer.addTrack(track, stream);
      console.log("Track Added");

    });
    console.log(remoteSocketIdRef.current)

    if (remoteSocketIdRef.current) {

      const offer = await peer.createOffer();

      await peer.setLocalDescription(offer);

      socket.emit("offer", {
        offer,
        to: remoteSocketIdRef.current

      });

    }

    setIsSharing(true);

  }

  const handleEndSession = () => {
    if (window.confirm("Are you sure you want to end this transmission session? This will disconnect all active viewers.")) {
      navigate("/create");
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen relative overflow-x-hidden">
      {/* Side Navigation Bar */}
      <Sidebar />

      {/* Main Content Canvas */}
      <main className="md:ml-64 relative z-10 p-6 md:p-12 min-h-screen flex flex-col">

        {/* Mobile Nav Header */}
        <div className="flex md:hidden items-center justify-between mb-8 border-b border-white/10 pb-4">
          <span className="font-headline-xl text-headline-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-tertiary">
            ScreenBridge
          </span>
          <button
            onClick={() => navigate("/")}
            className="text-primary font-label-md text-label-sm border border-primary/30 px-3 py-1 rounded-full bg-primary/5"
          >
            Home
          </button>
        </div>

        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">Host Dashboard</h1>
            <p className="text-on-surface-variant font-body-md text-body-md flex items-center gap-2 mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
              System Online • Local Node Active
            </p>
          </div>

          <div className="flex gap-4 self-stretch sm:self-auto">
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="w-full sm:w-auto glass-panel text-on-surface-variant hover:text-primary hover:bg-white/10 px-4 py-2.5 rounded-lg font-label-md text-label-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
              Preferences
            </button>
          </div>
        </header>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-1">

          {/* Left Column: Controls & Info (4 cols) */}
          <div className="xl:col-span-4 flex flex-col gap-6">

            {/* Room Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-panel rounded-xl p-6 relative overflow-hidden group border border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex items-center justify-between mb-6 relative z-10">
                <h2 className="font-headline-lg text-[20px] text-on-surface font-bold">Room Alpha</h2>
                <div className="bg-primary/20 text-primary border-l-2 border-primary px-3 py-1 font-label-sm text-label-sm rounded-r flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  Secure
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div>
                  <p className="text-on-surface-variant font-label-sm text-label-sm mb-1.5 uppercase tracking-wider">Access Code</p>
                  <div className="flex items-center justify-between bg-surface-container-high px-4 py-3 rounded-lg border border-white/5">
                    <span className="font-label-md text-label-md tracking-[0.15em] text-primary font-bold">
                      {roomId}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
                      title="Copy code"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {copiedCode ? "check_circle" : "content_copy"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-high p-4 rounded-lg border border-white/5 flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-tertiary mb-1.5 text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      groups
                    </span>
                    <span className="font-headline-lg text-[22px] md:text-headline-lg text-on-surface leading-none font-bold">
                      {participantsCount}
                    </span>
                    <span className="text-on-surface-variant font-label-sm text-label-sm mt-1">Participants</span>
                  </div>

                  <div className="bg-surface-container-high p-4 rounded-lg border border-white/5 flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-emerald-400 mb-1.5 text-[28px]">
                      speed
                    </span>
                    <span className="font-headline-lg text-[22px] md:text-headline-lg text-on-surface leading-none font-bold">
                      {latencyVal}ms
                    </span>
                    <span className="text-on-surface-variant font-label-sm text-label-sm mt-1">Latency</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Broadcast Controls Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="glass-panel rounded-xl p-6 relative overflow-hidden flex-1 flex flex-col justify-center border border-white/10"
            >
              <h3 className="font-label-md text-label-md text-on-surface-variant mb-6 uppercase tracking-widest text-center">Broadcast Control</h3>

              <div className="flex flex-col gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleSharing}
                  className={`w-full font-headline-lg text-[18px] md:text-headline-lg py-5 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer font-bold ${isSharing
                    ? "bg-gradient-to-r from-secondary-container to-secondary text-white shadow-[0_0_20px_rgba(208,188,255,0.4)]"
                    : "bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-[0_0_20px_rgba(173,198,255,0.4)]"
                    }`}
                >
                  <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isSharing ? "screen_share_indicator" : "screen_share"}
                  </span>
                  {isSharing ? "Stop Broadcasting" : "Start Sharing"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEndSession}
                  className="w-full glass-panel hover:bg-error/10 hover:border-error/30 border border-white/10 text-on-surface font-body-lg text-body-md md:text-body-lg py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span className="material-symbols-outlined text-error group-hover:animate-pulse">
                    stop_circle
                  </span>
                  End Session
                </motion.button>
              </div>

              {/* Bandwidth Indicator */}
              <div className="mt-8">
                <div className="flex justify-between font-label-sm text-label-sm mb-2 text-on-surface-variant">
                  <span>Bandwidth Allocation</span>
                  <span className="text-primary font-bold">{isSharing ? "Auto (High)" : "Standby (Low)"}</span>
                </div>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden relative">
                  <motion.div
                    animate={{ width: isSharing ? "75%" : "15%" }}
                    transition={{ type: "spring", stiffness: 80 }}
                    className="h-full bg-gradient-to-r from-secondary to-primary rounded-full relative"
                  >
                    {isSharing && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] blur-[1px]" />
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Local Preview & Monitor (8 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="xl:col-span-8 flex flex-col h-full"
          >
            <div className="glass-panel rounded-xl p-2 flex-grow flex flex-col glow-shadow relative overflow-hidden min-h-[500px] border border-white/10">

              {/* Preview Header */}
              <div className="flex justify-between items-center px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">desktop_mac</span>
                  <span className="font-label-md text-label-md text-on-surface">Local Display 1 (Main)</span>
                </div>
                <div className="flex gap-2">
                  <button className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded hover:bg-white/5">
                    <span className="material-symbols-outlined text-[20px]">crop</span>
                  </button>
                  <button className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded hover:bg-white/5">
                    <span className="material-symbols-outlined text-[20px]">fullscreen</span>
                  </button>
                </div>
              </div>

              {/* Video Canvas Container */}
              <div className="flex-grow bg-surface-container-lowest m-2 rounded-lg border border-white/5 relative overflow-hidden flex items-center justify-center">

                {/* Canvas Player for 100 JPEG Frames */}
                <video
                  ref={myVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/10 to-surface/60 pointer-events-none" />

                {/* Overlay Status Standby (Only visible when not sharing) */}
                <AnimatePresence>
                  {!isSharing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-surface-container-lowest/80 backdrop-blur-md p-6"
                    >
                      <div className="w-20 h-20 rounded-full bg-surface-container-high/50 backdrop-blur-md border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <span className="material-symbols-outlined text-[40px] text-on-surface-variant">
                          visibility_off
                        </span>
                      </div>
                      <h4 className="font-headline-lg text-[20px] text-on-surface mb-2 font-semibold">Preview Standby</h4>
                      <p className="text-on-surface-variant font-body-md text-body-md max-w-md text-center">
                        Click 'Start Sharing' to broadcast this display to the room. Content is currently hidden from participants.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Technical Corner Overlays */}
                <div className="absolute top-4 left-4 font-label-sm text-label-sm text-tertiary bg-surface/80 px-2.5 py-1 rounded border border-white/5 backdrop-blur-sm z-10">
                  {isSharing ? "1920x1080 • 60FPS" : "STANDBY"}
                </div>

                {/* Connection bars signal */}
                <div className="absolute bottom-4 right-4 flex gap-1 z-10">
                  <div className={`w-1 h-4 bg-emerald-400 rounded-sm ${isSharing ? "opacity-60" : "opacity-20"}`} />
                  <div className={`w-1 h-6 bg-emerald-400 rounded-sm ${isSharing ? "opacity-75" : "opacity-20"}`} />
                  <div className={`w-1 h-5 bg-emerald-400 rounded-sm ${isSharing ? "opacity-90" : "opacity-20"}`} />
                  <div className={`w-1 h-8 bg-emerald-400 rounded-sm ${isSharing ? "animate-pulse" : "opacity-20"}`} />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Preferences Drawer Panel Overlay */}
      <AnimatePresence>
        {showPreferences && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreferences(false)}
              className="absolute inset-0 bg-black"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm h-full bg-surface-container-high/90 backdrop-blur-2xl border-l border-white/10 p-6 flex flex-col shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
                <h3 className="font-headline-lg text-[18px] font-bold text-white">Broadcast Preferences</h3>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-on-surface-variant hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-label-sm text-label-sm text-primary uppercase tracking-wider mb-2">Network Protocol</h4>
                  <div className="bg-surface-container-low p-3 rounded-lg border border-white/5 font-label-md text-label-md text-white flex justify-between items-center">
                    <span>Tunnel Type</span>
                    <span className="text-tertiary">STUN/TURN</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-label-sm text-label-sm text-primary uppercase tracking-wider mb-2">Security</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-body-md text-sm text-on-surface-variant">
                      <span>Waiting Room</span>
                      <span>{waitingRoom ? "Enabled" : "Disabled"}</span>
                    </div>
                    <div className="flex justify-between text-body-md text-sm text-on-surface-variant">
                      <span>Passcode PIN</span>
                      <span className="font-mono">{passcode || "None"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-label-sm text-label-sm text-primary uppercase tracking-wider mb-3">Live Diagnostics</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="font-label-sm text-[11px] text-on-surface-variant block mb-1">Latency History</span>
                      <CanvasChart type="latency" color="#89ceff" height={70} />
                    </div>
                    <div>
                      <span className="font-label-sm text-[11px] text-on-surface-variant block mb-1">Bandwidth Load</span>
                      <CanvasChart type="bandwidth" color="#adc6ff" height={70} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
