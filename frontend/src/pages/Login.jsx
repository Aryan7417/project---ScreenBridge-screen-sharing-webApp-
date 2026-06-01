import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navigation from "../components/Navigation";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      const displayName = email.split("@")[0];
      const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      
      const mockUser = {
        name: formattedName,
        email: email.trim(),
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256",
      };

      localStorage.setItem("sb_user", JSON.stringify(mockUser));
      // Dispatch custom event to trigger navbar update
      window.dispatchEvent(new Event("authChange"));
      navigate("/");
    }, 1200);
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const mockUser = {
        name: provider === "Google" ? "Alex Rivera" : "Developer X",
        email: `${provider.toLowerCase()}user@screenbridge.com`,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256&h=256",
      };
      localStorage.setItem("sb_user", JSON.stringify(mockUser));
      window.dispatchEvent(new Event("authChange"));
      navigate("/");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col relative overflow-hidden">
      <Navigation />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 grid-bg opacity-20 z-0 pointer-events-none" />

      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-tertiary/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center px-6 pt-24 pb-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-primary transition-colors mb-6 font-label-sm text-label-sm group"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
              arrow_back
            </span>
            Back to Home
          </Link>

          {/* Login Card */}
          <div className="glass-card rounded-3xl border border-white/10 p-8 md:p-10 shadow-[0_0_80px_rgba(173,198,255,0.05)] relative overflow-hidden">
            {/* Top design line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-primary/0 via-primary/50 to-tertiary/0" />

            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-tertiary/10 border border-primary/30 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  cast
                </span>
              </div>
              <h2 className="text-[28px] font-bold tracking-tight text-white mb-2">Welcome Back</h2>
              <p className="text-white/50 font-body-md text-[14px]">
                Access your premium screen casting workspace
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-300 font-body-md text-[13px]"
              >
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="block font-label-sm text-[12px] text-white/60 uppercase tracking-widest">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-[20px]">
                    mail
                  </span>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3.5 tech-input rounded-2xl font-body-md text-[14px]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block font-label-sm text-[12px] text-white/60 uppercase tracking-widest">
                    Password
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setError("Password reset is disabled for the mock session.");
                    }}
                    className="text-[12px] text-primary hover:underline transition-colors"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-[20px]">
                    lock
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-11 pr-12 py-3.5 tech-input rounded-2xl font-body-md text-[14px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember me & auto-fill tip */}
              <div className="text-[12px] text-white/40 flex items-center gap-1.5 px-1">
                <span className="material-symbols-outlined text-[16px] text-primary">info</span>
                <span>Pro tip: Enter any credentials to log in.</span>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={!isLoading ? { scale: 1.02, boxShadow: "0 0 30px rgba(173,198,255,0.3)" } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-tertiary text-on-primary font-label-md text-label-md font-bold py-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(173,198,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-on-primary" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      login
                    </span>
                    <span>Sign In</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-widest">
                <span className="bg-[#0b1021] px-3 text-white/40">Or continue with</span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3.5">
              <motion.button
                whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSocialLogin("Google")}
                disabled={isLoading}
                className="py-3 rounded-2xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2 cursor-pointer text-white/70 hover:text-white font-label-md text-[13px] transition-all"
              >
                {/* Simplified Google Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Google
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSocialLogin("GitHub")}
                disabled={isLoading}
                className="py-3 rounded-2xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2 cursor-pointer text-white/70 hover:text-white font-label-md text-[13px] transition-all"
              >
                {/* Simplified Github Icon */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z"
                  />
                </svg>
                GitHub
              </motion.button>
            </div>

            {/* Link to Register */}
            <div className="text-center mt-8 text-[14px] text-white/50">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-bold transition-all">
                Sign Up
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
