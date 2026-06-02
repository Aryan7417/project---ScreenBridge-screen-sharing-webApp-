import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Navigation from "../components/Navigation";

const TOTAL_FRAMES = 100;

// ─── Frame Preloader ──────────────────────────────────────────────────────────

function useFrameSequence() {
  const imagesRef = useRef([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let loaded = 0;
    const imgs = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = String(i).padStart(3, "0");
      img.src = `/frames/video_000/video_${num}.jpg`;
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded === TOTAL_FRAMES) setReady(true);
      };
      img.onerror = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded === TOTAL_FRAMES) setReady(true);
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
  }, []);

  return { imagesRef, loadedCount, ready };
}

// ─── Canvas Renderer ──────────────────────────────────────────────────────────
function FrameCanvas({ imagesRef, scrollYProgress, ready, counterRef }) {
  const canvasRef = useRef(null);
  const lastIndexRef = useRef(-1);

  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[index];
    if (!img || !img.complete || !img.naturalWidth) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;

    let sx, sy, sw, sh;
    if (ir > cr) {
      sh = img.naturalHeight;
      sw = sh * cr;
      sx = (img.naturalWidth - sw) / 2;
      sy = 0;
    } else {
      sw = img.naturalWidth;
      sh = sw / cr;
      sx = 0;
      sy = (img.naturalHeight - sh) / 2;
    }
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  }, [imagesRef]);

  // Resize canvas to fill window
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (ready && lastIndexRef.current >= 0) {
        drawFrame(lastIndexRef.current);
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [drawFrame, ready]);

  // Listen to scrollYProgress and update canvas/counter directly
  useEffect(() => {
    if (!ready) return;

    const handleUpdate = (v) => {
      const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(v * TOTAL_FRAMES)));
      if (idx !== lastIndexRef.current) {
        lastIndexRef.current = idx;
        
        // Draw frame directly in animation frame
        requestAnimationFrame(() => {
          drawFrame(idx);
        });

        // Update counter DOM directly
        if (counterRef && counterRef.current) {
          counterRef.current.innerText = `${String(idx).padStart(3, "0")} / ${String(TOTAL_FRAMES - 1).padStart(3, "0")}`;
        }
      }
    };

    // Draw initial frame
    handleUpdate(scrollYProgress.get());

    const unsub = scrollYProgress.on("change", handleUpdate);
    return unsub;
  }, [scrollYProgress, ready, drawFrame, counterRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}

// ─── Scroll Text Panel ────────────────────────────────────────────────────────
function ScrollPanel({ show, title, subtitle, badge, align = "center" }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`absolute z-30 px-6 md:px-16 max-w-3xl ${
            align === "left"
              ? "left-8 md:left-20 text-left"
              : align === "right"
              ? "right-8 md:right-20 text-right"
              : "left-1/2 -translate-x-1/2 text-center"
          } top-1/2 -translate-y-1/2`}
        >
          {badge && (
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full glass-card border border-primary/30 ${align === "right" ? "float-right clear-both" : align === "left" ? "" : "mx-auto"}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">{badge}</span>
            </div>
          )}
          <h2
            className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-[56px] md:leading-[64px] font-bold tracking-tight text-white mb-4 drop-shadow-2xl"
            style={{ textShadow: "0 2px 40px rgba(0,0,0,0.8)" }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className="font-body-lg text-body-lg text-white/70 max-w-lg leading-relaxed drop-shadow-xl"
              style={{ textShadow: "0 1px 20px rgba(0,0,0,0.7)" }}
            >
              {subtitle}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const { imagesRef, loadedCount, ready } = useFrameSequence();
  const counterRef = useRef(null);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Derived scroll stages (0-1 mapped into story beats)
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (v < 0.08) setStage(0);
      else if (v < 0.28) setStage(1);
      else if (v < 0.50) setStage(2);
      else if (v < 0.72) setStage(3);
      else if (v < 0.90) setStage(4);
      else setStage(5);
    });
    return unsub;
  }, [scrollYProgress]);

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (roomCode.trim()) navigate(`/join?code=${encodeURIComponent(roomCode.trim())}`);
  };

  const formatCode = (val) => {
    let clean = val.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    let out = "";
    for (let i = 0; i < clean.length; i++) {
      if (i > 0 && i % 3 === 0) out += "-";
      out += clean[i];
    }
    return out.substring(0, 11);
  };

  // Parallax transforms for background glows
  const glowY1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const glowY2 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <div className="bg-[#020617] text-white font-body-md">
      <Navigation />

      {/* ── Loading Screen ── */}
      <AnimatePresence>
        {!ready && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[200] bg-[#020617] flex flex-col items-center justify-center gap-8"
          >
            {/* Animated logo */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="relative"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-tertiary/20 border border-primary/30 flex items-center justify-center backdrop-blur-xl shadow-[0_0_60px_rgba(173,198,255,0.3)]">
                <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  cast
                </span>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl animate-pulse" />
            </motion.div>

            <div className="flex flex-col items-center gap-3 w-64">
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-[0.3em]">
                Initializing Stream
              </span>
              {/* Progress bar */}
              <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  style={{ width: `${pct}%` }}
                  className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full shadow-[0_0_8px_rgba(173,198,255,0.6)]"
                  transition={{ ease: "linear" }}
                />
              </div>
              <span className="font-label-sm text-label-sm text-white/30 font-mono">{pct}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════
           SCROLL-DRIVEN CINEMATIC SECTION  (600vh tall, sticky canvas)
         ══════════════════════════════════════════════════════════════ */}
      <div ref={containerRef} className="relative" style={{ height: "650vh" }}>

        {/* Sticky viewport */}
        <div className="sticky top-0 w-full h-screen overflow-hidden">

          {/* Frame canvas */}
          <FrameCanvas imagesRef={imagesRef} scrollYProgress={scrollYProgress} ready={ready} counterRef={counterRef} />

          {/* Gradient vignette overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/70 via-transparent to-[#020617]/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/30 via-transparent to-[#020617]/30" />
          </div>

          {/* Animated background glows */}
          <motion.div
            style={{ y: glowY1 }}
            className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[130px] pointer-events-none z-5"
          />
          <motion.div
            style={{ y: glowY2 }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-tertiary/8 rounded-full blur-[120px] pointer-events-none z-5"
          />

          {/* ── Stage 0: Initial Hero Headline ── */}
          <AnimatePresence>
            {stage === 0 && (
              <motion.div
                key="stage0"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full glass-card border border-primary/30"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(173,198,255,0.9)]" />
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-[0.2em]">
                    ScreenBridge v3.0 Live
                  </span>
                </motion.div>

                <h1
                  className="text-[42px] md:text-[72px] lg:text-[88px] font-bold leading-[1.05] tracking-[-0.04em] text-white max-w-5xl mb-6"
                  style={{ textShadow: "0 4px 60px rgba(0,0,0,0.9)" }}
                >
                  The Future of{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-[#60a5fa] to-tertiary">
                    Screen Sharing
                  </span>{" "}
                  is Here
                </h1>

                <p
                  className="font-body-lg text-body-lg text-white/60 max-w-2xl mb-4"
                  style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
                >
                  Scroll to explore the experience
                </p>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="flex flex-col items-center gap-1 text-white/30 mt-4"
                >
                  <span className="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
                  <span className="material-symbols-outlined text-[20px] -mt-2 opacity-50">keyboard_arrow_down</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Stage 1: Zero Latency ── */}
          <ScrollPanel
            show={stage === 1}
            badge="Lightning Fast"
            title={<>Zero&#8209;Latency<br />Casting</>}
            subtitle="Our proprietary protocol delivers your screen in real-time — under 5ms end-to-end, every time."
            align="left"
          />

          {/* ── Stage 2: Security ── */}
          <ScrollPanel
            show={stage === 2}
            badge="Military Grade"
            title={<>Unbreakable<br />End-to-End<br />Encryption</>}
            subtitle="AES-256 encryption wraps every pixel before it leaves your device. Your data stays yours."
            align="right"
          />

          {/* ── Stage 3: Multi Device ── */}
          <ScrollPanel
            show={stage === 3}
            badge="Any Device"
            title={<>Works on<br />Everything</>}
            subtitle="MacBook. Windows PC. Android. Smart TV. Legacy projector. ScreenBridge runs everywhere."
            align="left"
          />

          {/* ── Stage 4: Enterprise ── */}
          <ScrollPanel
            show={stage === 4}
            badge="Enterprise Ready"
            title={<>Built for<br />Teams at Scale</>}
            subtitle="Broadcast to unlimited viewers simultaneously. No degradation. No cap. No compromise."
            align="center"
          />

          {/* ── Stage 5: CTA overlay before leaving sticky zone ── */}
          <AnimatePresence>
            {stage === 5 && (
              <motion.div
                key="stage5"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-30 flex items-center justify-center px-6"
              >
                <div className="glass-panel rounded-3xl border border-white/10 p-10 md:p-16 max-w-2xl w-full text-center shadow-[0_0_80px_rgba(173,198,255,0.12)]">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-tertiary flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(173,198,255,0.4)]">
                    <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      sensors
                    </span>
                  </div>
                  <h2 className="text-[32px] md:text-[44px] font-bold tracking-tight text-white mb-3 leading-tight">
                    Ready to connect?
                  </h2>
                  <p className="text-white/60 font-body-lg text-body-md mb-10 max-w-md mx-auto">
                    Start a session in seconds. No downloads. No setup. Just instant, secure screen sharing.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.04, boxShadow: "0 0 35px rgba(173,198,255,0.4)" }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => navigate("/create")}
                      className="w-full sm:w-auto bg-gradient-to-r from-primary to-tertiary text-on-primary font-label-md text-label-md font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 group cursor-pointer shadow-[0_0_20px_rgba(173,198,255,0.25)]"
                    >
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        add_circle
                      </span>
                      Create Room
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => navigate("/join")}
                      className="w-full sm:w-auto glass-panel border border-white/15 text-white font-label-md text-label-md px-8 py-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer hover:border-primary/40 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                        login
                      </span>
                      Join a Room
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Persistent scroll progress bar ── */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2">
            <div className="flex gap-1.5">
              {[0, 1, 2, 3, 4, 5].map((s) => (
                <motion.div
                  key={s}
                  animate={{ opacity: stage === s ? 1 : 0.2, scale: stage === s ? 1.3 : 1 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-full ${stage === s ? "w-6 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-white/30"}`}
                />
              ))}
            </div>
          </div>

          {/* ── Frame counter (dev / premium aesthetic touch) ── */}
          <div
            ref={counterRef}
            className="absolute bottom-8 right-8 z-40 font-mono font-label-sm text-label-sm text-white/20 select-none"
          >
            000 / 099
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
           BELOW THE SCROLL ANIMATION — Standard Sections
         ══════════════════════════════════════════════════════════════ */}

      {/* Quick Action Bar */}
      <section className="relative bg-[#020617] -mt-1 z-20">
        <div className="max-w-5xl mx-auto px-6 md:px-16 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-panel rounded-3xl border border-white/10 p-8 md:p-12 shadow-[0_0_60px_rgba(173,198,255,0.06)]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">Instant Access</span>
                </div>
                <h2 className="text-[28px] md:text-[36px] font-bold tracking-tight text-white mb-3 leading-tight">
                  Start in seconds,<br />not minutes
                </h2>
                <p className="text-white/55 font-body-md text-body-md leading-relaxed">
                  Create or join a room with a single click. Enter a room code to instantly connect to an active broadcast.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(173,198,255,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/create")}
                  className="w-full bg-gradient-to-r from-primary to-tertiary text-on-primary font-label-md text-label-md font-bold py-4 px-6 rounded-2xl flex items-center gap-3 group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
                  </div>
                  <div className="text-left">
                    <div className="text-[15px] font-bold">Create a Room</div>
                    <div className="text-[11px] font-normal opacity-75">Broadcast your screen instantly</div>
                  </div>
                  <span className="material-symbols-outlined ml-auto group-hover:translate-x-0.5 transition-transform text-[18px]">
                    arrow_forward
                  </span>
                </motion.button>

                <form onSubmit={handleJoinSubmit} className="w-full flex gap-3">
                  <input
                    className="flex-1 bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-2xl px-5 py-4 font-label-md text-label-md text-white placeholder:text-white/25 outline-none transition-all uppercase tracking-widest"
                    placeholder="Room Code…"
                    value={roomCode}
                    onChange={(e) => setRoomCode(formatCode(e.target.value))}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="shrink-0 glass-panel border border-white/10 hover:border-primary/30 text-primary font-label-md text-label-md px-6 py-4 rounded-2xl flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    Join
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="bg-[#020617] py-8 pb-32 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-[32px] md:text-[42px] font-bold tracking-tight text-white mb-4">
              Engineered for Precision
            </h2>
            <p className="text-white/50 font-body-lg text-body-md max-w-xl mx-auto">
              Enterprise-grade infrastructure. Consumer-grade simplicity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: "bolt",
                color: "text-primary",
                bg: "from-primary/10",
                title: "< 5ms Latency",
                desc: "Proprietary STUN/TURN routing delivers sub-5ms end-to-end casting — indistinguishable from a physical cable.",
                metric: { label: "Avg Latency", value: "4.2ms", bar: 97 },
              },
              {
                icon: "lock",
                color: "text-tertiary",
                bg: "from-tertiary/10",
                title: "AES-256 Encrypted",
                desc: "Every frame is wrapped in military-grade encryption before it leaves your device. Zero exposure.",
                metric: { label: "Security Score", value: "100%", bar: 100 },
              },
              {
                icon: "hub",
                color: "text-secondary",
                bg: "from-secondary/10",
                title: "Unlimited Viewers",
                desc: "Multi-node mesh routing lets you broadcast to thousands of simultaneous viewers without a performance hit.",
                metric: { label: "Max Participants", value: "∞", bar: 100 },
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-panel rounded-2xl p-7 border border-white/8 group cursor-default relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${card.bg} to-transparent rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.bg} to-transparent border border-white/10 flex items-center justify-center mb-5`}>
                  <span className={`material-symbols-outlined ${card.color} text-[22px]`} style={{ fontVariationSettings: "'FILL' 0" }}>
                    {card.icon}
                  </span>
                </div>
                <h3 className="text-[18px] font-bold text-white mb-2">{card.title}</h3>
                <p className="text-white/50 font-body-md text-[14px] leading-relaxed mb-6">{card.desc}</p>

                <div className="mt-auto">
                  <div className="flex justify-between mb-2">
                    <span className="font-label-sm text-[11px] text-white/30 uppercase tracking-wider">{card.metric.label}</span>
                    <span className={`font-label-md text-[13px] ${card.color} font-bold`}>{card.metric.value}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${card.metric.bar}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                      className={`h-full rounded-full bg-gradient-to-r ${
                        card.color === "text-primary"
                          ? "from-primary to-primary/60"
                          : card.color === "text-tertiary"
                          ? "from-tertiary to-tertiary/60"
                          : "from-secondary to-secondary/60"
                      } shadow-[0_0_8px_currentColor]`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#07090f] border-t border-white/5 py-12 px-6 md:px-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>cast</span>
            <span className="font-bold text-[20px] bg-clip-text text-transparent bg-gradient-to-r from-primary to-tertiary">
              ScreenBridge
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 font-label-sm text-label-sm">
            {["Privacy Policy", "Terms of Service", "Security", "Status"].map((l) => (
              <a key={l} href="#" className="text-white/35 hover:text-primary transition-colors">{l}</a>
            ))}
          </div>
          <p className="text-white/25 font-label-sm text-[12px]">
            © 2024 ScreenBridge Technologies
          </p>
        </div>
      </footer>
    </div>
  );
}
