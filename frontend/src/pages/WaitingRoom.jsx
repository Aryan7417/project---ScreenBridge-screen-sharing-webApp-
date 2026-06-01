import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "../components/Navigation";

export default function WaitingRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState("Establishing secure, zero-latency tunnel...");
  const [connectingToStream, setConnectingToStream] = useState(false);

  useEffect(() => {
    // Stage 1: Establishing tunnel (0-2s)
    const t1 = setTimeout(() => {
      setStatusText("Waiting for host to broadcast display stream...");
    }, 2000);

    // Stage 2: Host starts sharing (4s)
    const t2 = setTimeout(() => {
      setConnectingToStream(true);
      setStatusText("Host connection detected! Connecting to stream...");
    }, 4500);

    // Stage 3: Redirect to Viewer Dashboard (6s)
    const t3 = setTimeout(() => {
      navigate(`/viewer/${roomId}`);
    }, 6000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [roomId, navigate]);

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-on-primary-container relative">
      <Navigation />

      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center pt-20 relative overflow-hidden bg-grid-pattern">
        {/* Ambient Background Glow */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-30">
          <div className="w-[800px] h-[800px] rounded-full bg-primary/20 blur-[150px]" />
        </div>

        <div className="relative z-10 w-full max-w-2xl px-6 md:px-0">
          
          {/* Waiting Room Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-panel rounded-2xl p-8 md:p-12 text-center flex flex-col items-center shadow-2xl relative overflow-hidden border border-white/10 glow-pulse"
          >
            {/* Scanline overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none" />

            {/* Connectivity Animation Graphic */}
            <div className="relative w-40 h-40 md:w-48 md:h-48 mb-8 flex justify-center items-center">
              
              {/* Center Device Hub */}
              <motion.div 
                animate={{ scale: [0.95, 1.05, 0.95] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute z-20 w-14 h-14 md:w-16 md:h-16 bg-surface-container-high rounded-full border border-primary/50 shadow-[0_0_30px_rgba(173,198,255,0.4)] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-primary text-3xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
                  router
                </span>
              </motion.div>

              {/* Orbiting Satellite Node 1 */}
              <div className="absolute w-full h-full animate-spin-orbit-1">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-tertiary rounded-full shadow-[0_0_10px_rgba(137,206,255,0.8)]" />
              </div>

              {/* Orbiting Satellite Node 2 */}
              <div className="absolute w-3/4 h-3/4 animate-spin-orbit-2">
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full shadow-[0_0_10px_rgba(208,188,255,0.8)]" />
              </div>

              {/* SVG Signal Waves */}
              <svg className="absolute inset-0 w-full h-full text-primary/30" viewBox="0 0 100 100">
                <circle className="signal-wave opacity-50" cx="50" cy="50" fill="none" r="30" stroke="currentColor" strokeWidth="1" />
                <circle className="animate-spin-slow" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeDasharray="4 4" strokeWidth="0.5" />
              </svg>
            </div>

            {/* Text Content */}
            <h1 className="font-headline-lg text-headline-lg text-[22px] md:text-headline-lg mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-on-surface-variant font-semibold">
              {connectingToStream ? "Connecting Display Stream" : "Waiting for Host Connection"}
            </h1>
            
            <p className="font-body-md text-on-surface-variant mb-8 max-w-md mx-auto min-h-[48px] flex items-center justify-center">
              {statusText}
            </p>

            {/* Status indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-8 font-label-sm text-label-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-on-surface-variant uppercase tracking-widest">Network Secure</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span className="uppercase tracking-widest">E2E Encrypted</span>
              </div>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-4 z-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="font-label-md text-label-md text-on-surface-variant hover:text-white bg-surface-container-high/50 hover:bg-surface-container-high border border-white/5 rounded-lg px-6 py-2 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
                Audio Settings
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/join")}
                className="font-label-md text-label-md text-error hover:text-white bg-error/10 hover:bg-error/20 border border-error/20 rounded-lg px-6 py-2 transition-colors cursor-pointer"
              >
                Leave Room
              </motion.button>
            </div>
          </motion.div>

          {/* Footer Details */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8 font-label-sm text-label-sm text-on-surface-variant/50"
          >
            Session ID: <span className="font-mono ml-1 font-semibold">{roomId}</span>
          </motion.div>

        </div>
      </main>

      {/* Screen Connecting Loader Overlay */}
      <AnimatePresence>
        {connectingToStream && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center gap-4"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-16 h-16 rounded-full border-t-2 border-primary border-r-2 border-r-transparent"
            />
            <span className="font-label-md text-label-md text-primary tracking-widest uppercase animate-pulse">
              Buffering Stream Channels...
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
