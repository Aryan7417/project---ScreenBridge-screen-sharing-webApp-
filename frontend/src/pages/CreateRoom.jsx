import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";

export default function CreateRoom() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [waitingRoom, setWaitingRoom] = useState(false);
  const [passcodeLock, setPasscodeLock] = useState(true);
  const [passcode, setPasscode] = useState("9402");
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate a random room code on mount
  useEffect(() => {
    generateNewRoomId();
  }, []);

  const generateNewRoomId = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const segment1 = "SB";
    let segment2 = "";
    let segment3 = "";
    for (let i = 0; i < 3; i++) {
      segment2 += chars.charAt(Math.floor(Math.random() * chars.length));
      segment3 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRoomId(`${segment1}-${segment2}-${segment3}`);
  };

  const generateNewPasscode = () => {
    let pin = "";
    for (let i = 0; i < 4; i++) {
      pin += Math.floor(Math.random() * 10).toString();
    }
    setPasscode(pin);
  };

  const copyToClipboard = () => {
    const roomLink = `${window.location.origin}/join?code=${roomId}`;
    navigator.clipboard.writeText(roomLink).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };


  const handleStartSharing = () => {
    // Navigate to host dashboard with this room code
    // Pass passcode/waiting room settings via state
    navigate(`/host/${roomId}`, {
      state: {
        passcode: passcodeLock ? passcode : null,
        waitingRoom
      }
    });
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen relative overflow-x-hidden">
      {/* Atmospheric Backgrounds */}
      <div className="ambient-glow"></div>
      <div className="ambient-glow-2"></div>
      <div className="fixed inset-0 grid-bg z-0 pointer-events-none opacity-50"></div>

      {/* Side Navigation Bar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="md:ml-64 relative z-10 min-h-screen flex flex-col px-6 md:px-20 py-12">
        {/* Mobile Header (Since Sidebar is hidden on mobile) */}
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

        {/* Page Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col gap-2"
        >
          <h1 className="font-headline-xl text-[28px] md:text-headline-xl text-primary font-bold tracking-tight">Create Session Room</h1>
          <p className="font-body-lg text-body-md md:text-body-lg text-on-surface-variant max-w-2xl">
            Generate a secure, zero-latency environment for instant wireless collaboration. Share this unique code with your team to establish connection.
          </p>
        </motion.header>

        {/* Bento Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 h-full">

          {/* Main Generator Card (Spans 8 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-8 glass-panel rounded-xl flex flex-col relative group overflow-hidden border border-white/10"
          >
            {/* Decorative top-left highlight */}
            <div className="absolute top-0 left-0 w-32 h-[1px] bg-gradient-to-r from-primary to-transparent"></div>
            <div className="absolute top-0 left-0 w-[1px] h-32 bg-gradient-to-b from-primary to-transparent"></div>

            <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[18px]">router</span>
                </div>
                <h2 className="font-headline-lg text-[18px] md:text-[20px] text-on-surface font-semibold">Transmission Signal</h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border-l-2 border-emerald-500 text-emerald-400 font-label-sm text-label-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Network Ready
              </span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center relative overflow-hidden min-h-[300px]">
              {/* Central visual element behind code */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-primary/5 rounded-full blur-[60px] pointer-events-none"></div>

              <p className="font-label-sm text-label-sm text-on-surface-variant mb-4 uppercase tracking-[0.2em]">Unique Room Identifier</p>

              <div className="relative group cursor-copy" title="Click to copy" onClick={copyToClipboard}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"
                />
                <div
                  className="font-label-md text-[3rem] sm:text-[4.5rem] md:text-[5.5rem] leading-none tracking-wider text-white relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {roomId ? (
                    <>
                      {roomId.split("-")[0]}-
                      <span className="text-primary">{roomId.split("-")[1]}</span>-
                      {roomId.split("-")[2]}
                    </>
                  ) : (
                    "SB-..."
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 w-full max-w-md z-10">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={copyToClipboard}
                  className="w-full sm:flex-1 glass-panel border-white/10 hover:bg-white/5 hover:border-white/20 transition-all duration-300 py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 text-on-surface font-label-md text-label-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {copiedLink ? "check_circle" : "content_copy"}
                  </span>
                  {copiedLink ? "Copied Room Link!" : "Copy Room Link"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(59,130,246,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleStartSharing}
                  className="w-full sm:flex-1 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 text-white font-label-md text-label-md font-bold transition-all duration-300 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">sensors</span>
                  Start Sharing
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Side Settings Column (Spans 4 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            {/* Security Settings Card */}
            <div className="glass-panel rounded-xl p-6 relative overflow-hidden border border-white/10 group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>

              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-outline">admin_panel_settings</span>
                <h3 className="font-label-md text-[16px] text-on-surface font-semibold">Security Protocol</h3>
              </div>

              <div className="flex flex-col gap-5">
                {/* Waiting Room Toggle */}
                <label className="flex items-center justify-between cursor-pointer group/toggle select-none">
                  <div className="flex flex-col pr-4">
                    <span className="font-body-md text-body-md text-on-surface">Waiting Room</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Admit participants manually</span>
                  </div>
                  <div
                    onClick={() => setWaitingRoom(!waitingRoom)}
                    className={`relative w-11 h-6 rounded-full border transition-colors flex items-center p-[2px] ${waitingRoom
                        ? "bg-primary/20 border-primary"
                        : "bg-surface-container-high border-white/10"
                      }`}
                  >
                    <motion.div
                      layout
                      className={`w-4 h-4 rounded-full ${waitingRoom ? "bg-primary shadow-[0_0_5px_rgba(173,198,255,0.8)]" : "bg-outline-variant"}`}
                      animate={{ x: waitingRoom ? 20 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </div>
                </label>

                <div className="h-[1px] w-full bg-white/5"></div>

                {/* Passcode Lock Toggle */}
                <label className="flex items-center justify-between cursor-pointer group/toggle select-none">
                  <div className="flex flex-col pr-4">
                    <span className="font-body-md text-body-md text-on-surface">Passcode Lock</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Require PIN to join</span>
                  </div>
                  <div
                    onClick={() => setPasscodeLock(!passcodeLock)}
                    className={`relative w-11 h-6 rounded-full border transition-colors flex items-center p-[2px] ${passcodeLock
                        ? "bg-primary/20 border-primary"
                        : "bg-surface-container-high border-white/10"
                      }`}
                  >
                    <motion.div
                      layout
                      className={`w-4 h-4 rounded-full ${passcodeLock ? "bg-primary shadow-[0_0_5px_rgba(173,198,255,0.8)]" : "bg-outline-variant"}`}
                      animate={{ x: passcodeLock ? 20 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </div>
                </label>

                {/* Collapsible Passcode Input */}
                <AnimatePresence>
                  {passcodeLock && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-surface-container-highest/50 rounded-lg border border-white/5 p-3 flex items-center justify-between">
                        <span className="font-label-md text-label-md text-primary tracking-widest font-bold">{passcode}</span>
                        <button
                          onClick={generateNewPasscode}
                          className="text-on-surface-variant hover:text-white transition-colors flex items-center justify-center p-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">refresh</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Info Compatibility Card */}
            <div className="glass-panel rounded-xl p-6 flex-1 flex flex-col justify-between relative overflow-hidden border border-white/10">
              <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[120px]">devices</span>
              </div>
              <div>
                <h3 className="font-label-md text-[16px] text-on-surface mb-2 font-semibold">Hardware Target</h3>
                <p className="font-body-md text-[14px] text-on-surface-variant leading-relaxed">
                  Ensure the receiving display or projector is connected to the same local network, or use a ScreenBridge Dongle for standalone casting.
                </p>
              </div>
              <a className="inline-flex items-center gap-2 text-primary hover:text-inverse-primary font-label-md text-label-sm transition-colors mt-6 w-fit border-b border-transparent hover:border-inverse-primary pb-0.5" href="#">
                View compatibility matrix
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>

          </motion.div>

        </div>
      </main>
    </div>
  );
}
