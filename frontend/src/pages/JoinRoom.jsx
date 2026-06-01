import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navigation from "../components/Navigation";

export default function JoinRoom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  // If a code is passed in the URL (e.g., from Home page), prefill it
  useEffect(() => {
    const urlCode = searchParams.get("code");
    if (urlCode) {
      setRoomCode(formatInputCode(urlCode));
    }
  }, [searchParams]);

  const formatInputCode = (val) => {
    let clean = val.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    let formatted = "";
    for (let i = 0; i < clean.length; i++) {
      if (i > 0 && i % 3 === 0) formatted += "-";
      formatted += clean[i];
    }
    // Limit to 11 chars (9 chars + 2 dashes)
    return formatted.substring(0, 11);
  };

  const handleInputChange = (e) => {
    setRoomCode(formatInputCode(e.target.value));
    setError(false);
  };

  const handleConnect = () => {
    // Room codes are generally formatted like "XXX-XXX-XXX" (11 chars) or "SB-XXX-XXX" (10-12 chars)
    // Validate length: must be at least 8-11 characters to make sense
    if (roomCode.replace(/-/g, "").length < 6) {
      setError(true);
      return;
    }

    setConnecting(true);

    // Simulate connecting sequence
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      
      setTimeout(() => {
        // Redirect to waiting room
        navigate(`/waiting/${roomCode}`);
      }, 800);
    }, 1500);
  };

  const inputShakeVariants = {
    shake: {
      x: [0, -6, 6, -6, 6, 0],
      transition: { duration: 0.4, ease: "easeInOut" }
    },
    idle: { x: 0 }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-body-md overflow-x-hidden relative">
      <Navigation />

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center pt-20 px-6 md:px-20 relative">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
          {/* Simulated connection lines/grid */}
          <div className="w-full h-full opacity-10" style={{ backgroundImage: "radial-gradient(rgba(137, 206, 255, 0.4) 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
          {/* Central glowing orb behind card */}
          <div className="absolute w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
        </div>

        {/* Join Room Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card w-full max-w-[480px] p-8 md:p-10 rounded-2xl z-10 flex flex-col items-center text-center relative border border-white/10"
        >
          {/* Header Icon */}
          <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-6 border border-primary/20 shadow-[0_0_20px_rgba(173,198,255,0.15)] relative">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              cast_connected
            </span>
            {/* Pulse effect */}
            <div className="absolute inset-0 rounded-full border border-primary/50" style={{ animation: "pulse-glow 2s infinite" }} />
          </div>

          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2 font-semibold">Join a Room</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-10">Enter the Room ID to connect instantly.</p>

          {/* Input Section */}
          <div className="w-full relative mb-8 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline-variant group-focus-within:text-primary transition-colors">
                meeting_room
              </span>
            </div>

            <motion.input
              animate={error ? "shake" : "idle"}
              variants={inputShakeVariants}
              className={`tech-input w-full py-4 pl-12 pr-4 rounded-xl font-label-md text-label-md text-center tracking-widest uppercase placeholder:text-outline-variant/50 placeholder:normal-case placeholder:tracking-normal placeholder:font-body-md ${
                error ? "border-error focus:border-error focus:ring-error" : ""
              }`}
              placeholder="e.g. 8X9-2B4-Q1Z"
              type="text"
              value={roomCode}
              onChange={handleInputChange}
              disabled={connecting || connected}
            />

            {/* Validation Message Area */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-6 left-0 right-0 text-center"
              >
                <span className="font-label-sm text-label-sm text-error flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  Invalid Room ID format
                </span>
              </motion.div>
            )}
          </div>

          {/* Join Button */}
          <motion.button
            whileHover={!(connecting || connected) ? { scale: 1.02 } : {}}
            whileTap={!(connecting || connected) ? { scale: 0.98 } : {}}
            onClick={handleConnect}
            disabled={connecting || connected}
            className={`w-full py-4 rounded-xl font-label-md text-label-md uppercase tracking-wider flex items-center justify-center gap-2 group relative overflow-hidden transition-all font-bold ${
              connected 
                ? "bg-emerald-500 text-surface-container-lowest"
                : connecting
                  ? "bg-primary/50 text-white cursor-wait"
                  : "bg-gradient-to-r from-[#4d8eff] to-[#005ac2] text-white shadow-[0_4px_15px_rgba(77,142,255,0.3)] hover:shadow-[0_6px_20px_rgba(77,142,255,0.5)] cursor-pointer"
            }`}
          >
            {connected ? (
              <>
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>Connected</span>
              </>
            ) : connecting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <span className="relative z-10">Connect</span>
                <span className="material-symbols-outlined relative z-10 group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </>
            )}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>

          {/* Secondary Action */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="font-body-md text-body-md text-on-surface-variant text-sm">Don't have a code?</span>
            <Link to="/create" className="font-label-sm text-label-sm text-primary hover:text-tertiary transition-colors flex items-center gap-1 border-b border-transparent hover:border-primary pb-0.5">
              Host a new room
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
