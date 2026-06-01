import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "../components/Navigation";
import FramePlayer from "../components/FramePlayer";
import CanvasChart from "../components/CanvasChart";

export default function ViewerDashboard() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showBuffering, setShowBuffering] = useState(true);
  const [scrubberPos, setScrubberPos] = useState(0.65); // Default scrubber position at 65%
  const [timeText, setTimeText] = useState("01:18:00");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoContainerRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("sb_user");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  // Buffer state simulation on enter
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBuffering(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Update mock time text based on scrubber position
  useEffect(() => {
    const totalSeconds = 2 * 60 * 60; // 2 hours
    const currentSeconds = totalSeconds * scrubberPos;

    const hrs = String(Math.floor(currentSeconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((currentSeconds % 3600) / 60)).padStart(2, "0");
    const secs = String(Math.floor(currentSeconds % 60)).padStart(2, "0");

    setTimeText(`${hrs}:${mins}:${secs}`);
  }, [scrubberPos]);

  const handleScrubberClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.min(1, Math.max(0, clickX / rect.width));
    setScrubberPos(pct);
  };

  const handleFrameChange = (pct) => {
    // If playing, let the player update the progress automatically
    if (isPlaying) {
      setScrubberPos(pct);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (videoContainerRef.current.requestFullscreen) {
        videoContainerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleLeaveRoom = () => {
    if (window.confirm("Disconnect from session and leave room?")) {
      navigate("/join");
    }
  };

  return (
    <div className="bg-[#020617] text-on-surface font-body-md min-h-screen flex flex-col overflow-hidden relative">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-tertiary/10 blur-[150px] rounded-full" />
      </div>

      <Navigation />

      {/* Main Content Area */}
      <main className="flex-grow pt-24 pb-6 px-6 md:px-20 flex flex-col lg:flex-row gap-6 h-[calc(100vh-80px)] w-full relative z-10 box-border overflow-hidden">

        {/* Stream Viewing Panel (Left side) */}
        <div
          ref={videoContainerRef}
          className="flex-grow relative rounded-xl overflow-hidden glass-panel flex flex-col group border border-white/10 shadow-2xl h-full"
        >
          {/* FramePlayer Canvas */}
          <div className="absolute inset-0 z-0">
            <FramePlayer
              isPlaying={isPlaying && !showBuffering}
              currentProgress={scrubberPos}
              onFrameChange={handleFrameChange}
              className="w-full h-full object-cover"
            />
            {/* Dark gradient mapping overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-surface-container-lowest/30 pointer-events-none" />
          </div>

          {/* Top Overlay Stream Info Bar */}
          <div className="absolute top-0 w-full p-4 flex justify-between items-start z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-surface/80 to-transparent">
            <div className="flex items-center gap-3">
              <div className="bg-primary-container/20 backdrop-blur-md border border-primary/30 text-primary px-3 py-1.5 rounded-full font-label-sm text-label-sm flex items-center gap-2 font-semibold">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                LIVE
              </div>
              <span className="font-headline-lg text-[18px] md:text-headline-lg text-white drop-shadow-md font-semibold">
                Engineering Sync - Q3 Architecture
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors border border-white/10">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>present_to_all</span>
              </button>
              <button
                onClick={toggleFullscreen}
                className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors border border-white/10"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
                  {isFullscreen ? "fullscreen_exit" : "fullscreen"}
                </span>
              </button>
            </div>
          </div>

          {/* Buffering/Optimizing Overlay */}
          <AnimatePresence>
            {showBuffering && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none"
              >
                <div className="glass-panel-floating px-6 py-4 rounded-xl flex flex-col items-center gap-3 border border-white/10">
                  <span className="material-symbols-outlined text-tertiary animate-spin text-[32px]">sync</span>
                  <span className="font-label-md text-label-md text-tertiary tracking-wider font-semibold">Optimizing Stream...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Stream Control Bar */}
          <div className="mt-auto absolute bottom-0 w-full p-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-surface/90 to-transparent flex flex-col gap-4">

            {/* Scrubber / Progress Bar */}
            <div
              onClick={handleScrubberClick}
              className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative cursor-pointer group/scrubber"
            >
              <div
                style={{ width: `${scrubberPos * 100}%` }}
                className="absolute top-0 left-0 h-full bg-primary pulse-bar rounded-full"
              />
              <div
                style={{ left: `${scrubberPos * 100}%` }}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_10px_rgba(173,198,255,0.8)] opacity-0 group-hover/scrubber:opacity-100 transition-opacity"
              />
            </div>

            {/* Playback Controls */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isPlaying ? "pause" : "play_arrow"}
                  </span>
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {isMuted ? "volume_off" : "volume_up"}
                  </span>
                </button>
                <span className="font-label-md text-label-md text-on-surface-variant font-mono">
                  {timeText} / 02:00:00
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1 cursor-pointer">
                  <span className="material-symbols-outlined">settings</span>
                </button>
                <div className="glass-panel px-3 py-1 rounded-lg border-primary/20 border">
                  <span className="font-label-sm text-label-sm text-tertiary font-bold">4K 60FPS</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Info panel (Right side) */}
        <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6 h-auto lg:h-full pb-4 overflow-y-auto custom-scrollbar">

          {/* Connection Details Card */}
          <div className="glass-panel-floating rounded-xl p-5 flex flex-col gap-5 border border-white/10">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-white/5 pb-2 font-semibold">
              Connection Diagnostics
            </h3>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-body-md text-sm text-on-surface font-semibold">Latency Jitter</span>
                <span className="font-label-md text-label-sm text-tertiary font-bold">12ms</span>
              </div>
              <CanvasChart type="latency" color="#89ceff" height={60} />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-body-md text-sm text-on-surface font-semibold">Payload Bitrate</span>
                <span className="font-label-md text-label-sm text-primary font-bold">18.4 Mbps</span>
              </div>
              <CanvasChart type="bandwidth" color="#adc6ff" height={60} />
            </div>

            <div className="flex items-center gap-2 mt-1 pt-4 border-t border-white/5">
              <span className="material-symbols-outlined text-tertiary text-[18px]">verified_user</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">End-to-End Encrypted</span>
            </div>
          </div>

          {/* Room Participants Card */}
          <div className="glass-panel rounded-xl p-5 flex-grow flex flex-col gap-4 border border-white/10 min-h-[250px] overflow-hidden">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Participants (4)
              </h3>
              <button className="text-primary hover:text-tertiary transition-colors flex items-center justify-center p-1">
                <span className="material-symbols-outlined text-[20px]">person_add</span>
              </button>
            </div>

            {/* Scrollable list */}
            <div className="flex-grow flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">

              {/* Host Participant */}
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border-l-2 border-primary">
                <div className="w-8 h-8 rounded-full overflow-hidden relative shrink-0">
                  <img
                    alt="Alex Chen"
                    className="w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128&h=128"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-md text-label-sm text-white truncate font-bold">Alex Chen</span>
                  <span className="font-label-sm text-[10px] text-primary">Host • Presenting</span>
                </div>
              </div>

              {/* Viewer Participant 1 */}
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                  <img
                    alt="Sarah Jenkins"
                    className="w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=128&h=128"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-body-md text-sm text-on-surface truncate">Sarah Jenkins</span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant">Viewer</span>
                </div>
                <span className="material-symbols-outlined ml-auto text-on-surface-variant text-[16px]">mic_off</span>
              </div>

              {/* Viewer Participant 2 */}
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                  <img
                    alt="Michael Torres"
                    className="w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=128&h=128"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-body-md text-sm text-on-surface truncate">Michael Torres</span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant">Viewer</span>
                </div>
                <span className="material-symbols-outlined ml-auto text-on-surface-variant text-[16px]">mic_off</span>
              </div>

              {/* You */}
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden shrink-0 flex items-center justify-center bg-white/5">
                  <img
                    alt={currentUser ? currentUser.name : "You"}
                    className="w-full h-full object-cover"
                    src={currentUser ? currentUser.avatar : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128&h=128"}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-body-md text-sm text-on-surface truncate font-semibold">
                    {currentUser ? currentUser.name : "You"}
                  </span>
                  <span className="font-label-sm text-[10px] text-primary">Viewer • Connected</span>
                </div>
                <span className="material-symbols-outlined ml-auto text-on-surface-variant text-[16px]">mic_off</span>
              </div>

            </div>

            <div className="pt-4 border-t border-white/5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLeaveRoom}
                className="w-full btn-ghost text-error hover:bg-error/10 font-label-md text-label-md py-2.5 rounded-lg border border-error/30 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">call_end</span>
                Leave Room
              </motion.button>
            </div>
          </div>

        </aside>
      </main>
    </div>
  );
}
