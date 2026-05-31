import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navigation from "../components/Navigation";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col justify-between relative select-none">
      {/* Decorative ambient gradients */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-tertiary/10 rounded-full blur-[100px]" />
      </div>

      <Navigation />

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center pt-24 px-6 md:px-20 relative z-10">
        <div className="max-w-2xl text-center flex flex-col items-center">
          
          {/* Tech Ring Graphic */}
          <div className="mb-10 relative">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-[40px] pointer-events-none" />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 w-48 h-48 md:w-64 md:h-64 rounded-full border border-primary/30 bg-surface/40 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(173,198,255,0.15)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,transparent_100%)]" />
              <span className="font-display-lg text-display-lg font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary to-tertiary opacity-90 drop-shadow-lg">
                404
              </span>
              
              {/* Floating orbital elements */}
              <motion.div 
                animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-8 left-8 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_#adc6ff]" 
              />
              <motion.div 
                animate={{ y: [0, 8, 0], x: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-12 right-12 w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_#89ceff]" 
              />
            </motion.div>
          </div>

          {/* Typography */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg font-bold text-white mb-6 tracking-tight"
          >
            Connection Lost
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto mb-10 leading-relaxed"
          >
            The terminal you are trying to reach is offline or does not exist within the current workspace hierarchy. Please verify the access coordinates.
          </motion.p>

          {/* Action Area */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full max-w-md"
          >
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 bg-surface-container-low/40 backdrop-blur-md hover:bg-white/5 transition-all duration-300 font-label-md text-label-md text-on-surface flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span className="material-symbols-outlined text-on-surface-variant group-hover:-translate-x-0.5 transition-transform">
                arrow_back
              </span>
              Return Previous
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(59,130,246,0.3)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-inverse-primary text-on-primary font-label-md text-label-md font-bold transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
            >
              Initialize Home
              <span className="material-symbols-outlined group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </motion.button>
          </motion.div>

          {/* Diagnostic details */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.5 }}
            className="mt-16 font-label-sm text-label-sm text-outline-variant flex flex-col items-center gap-1.5 font-mono text-[11px]"
          >
            <span>ERR_CODE: 404_NODE_UNREACHABLE</span>
            <span>LATENCY: TIMEOUT</span>
            <span>SYSTEM: SCREENBRIDGE_CORE_V3</span>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-10 bg-surface-container-lowest border-t border-white/5 flex flex-col md:flex-row justify-between items-center px-6 md:px-20 gap-8 relative z-10 text-center md:text-left">
        <div className="font-headline-md text-headline-md text-primary font-bold">ScreenBridge</div>
        <div className="flex flex-wrap justify-center gap-6">
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Security</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Status</a>
        </div>
        <div className="font-body-md text-body-md text-on-surface-variant text-sm">
          © 2024 ScreenBridge Technologies. Built for the future of work.
        </div>
      </footer>
    </div>
  );
}
