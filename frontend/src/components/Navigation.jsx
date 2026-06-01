import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuth = () => {
    const storedUser = localStorage.getItem("sb_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("authChange", checkAuth);
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("authChange", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("sb_user");
    setUser(null);
    setIsProfileOpen(false);
    setIsOpen(false);
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  const navLinks = [
    { label: "Dashboard", path: "/host/default" },
    { label: "Rooms", path: "/join" },
    { label: "History", path: "/history" },
    { label: "Devices", path: "/devices" },
  ];

  const handleLinkClick = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/40 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] h-20">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center px-6 md:px-20 h-full">
        {/* Brand */}
        <Link
          to="/"
          className="font-headline-xl text-headline-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-tertiary flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            cast
          </span>
          ScreenBridge
        </Link>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 font-label-md text-label-md h-full">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || 
              (link.path === "/join" && location.pathname.startsWith("/join")) ||
              (link.path === "/host/default" && (location.pathname.startsWith("/host") || location.pathname.startsWith("/viewer")));
            return (
              <Link
                key={link.label}
                to={link.path}
                className={`${
                  isActive
                    ? "text-primary border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-on-surface border-b-2 border-transparent"
                } pb-1 h-full flex items-center hover:bg-white/5 transition-all duration-300 px-4`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/join")}
            className="font-label-md text-label-md text-primary px-6 py-2 rounded-full border border-primary/30 hover:bg-primary/10 transition-colors cursor-pointer"
          >
            Join Room
          </motion.button>

          {user ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(59,130,246,0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/create")}
                className="font-label-md text-label-md bg-gradient-to-r from-primary to-tertiary text-on-primary px-6 py-2 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)] font-bold transition-all cursor-pointer"
              >
                Host Now
              </motion.button>

              {/* User Avatar dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="ml-4 rounded-full overflow-hidden w-10 h-10 border border-white/20 hover:border-primary transition-colors cursor-pointer focus:outline-none flex items-center justify-center bg-white/5"
                >
                  <img
                    alt={user.name}
                    className="w-full h-full object-cover"
                    src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256"}
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      {/* Click outside overlay */}
                      <div 
                        className="fixed inset-0 z-40 cursor-default" 
                        onClick={() => setIsProfileOpen(false)}
                      />
                      
                      {/* Dropdown Menu */}
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-72 glass-panel border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 z-50 flex flex-col gap-4 text-left"
                      >
                        {/* User Info Header */}
                        <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                          <div className="w-11 h-11 rounded-full overflow-hidden border border-white/15">
                            <img
                              alt={user.name}
                              className="w-full h-full object-cover"
                              src={user.avatar}
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-white text-[15px] truncate">{user.name}</span>
                            <span className="text-[12px] text-white/50 truncate">{user.email}</span>
                          </div>
                        </div>

                        {/* Dropdown Links */}
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              navigate("/host/default");
                            }}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/85 hover:text-white transition-all text-left text-[14px] cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[20px] text-primary">dashboard</span>
                            Host Dashboard
                          </button>
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              navigate("/settings");
                            }}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/85 hover:text-white transition-all text-left text-[14px] cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[20px] text-white/40">settings</span>
                            Settings
                          </button>
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              navigate("/devices");
                            }}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/85 hover:text-white transition-all text-left text-[14px] cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[20px] text-white/40">router</span>
                            Devices
                          </button>
                        </div>

                        {/* Sign Out Section */}
                        <div className="border-t border-white/10 pt-3">
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 transition-all text-left text-[14px] font-bold cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 ml-4">
              <Link
                to="/login"
                className="font-label-md text-label-md text-white/70 hover:text-white px-4 py-2 transition-colors cursor-pointer"
              >
                Log In
              </Link>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(173,198,255,0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/signup")}
                className="font-label-md text-label-md bg-gradient-to-r from-primary to-tertiary text-on-primary px-5 py-2 rounded-full font-bold shadow-lg cursor-pointer"
              >
                Sign Up
              </motion.button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-primary focus:outline-none flex items-center justify-center"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
            {isOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden w-full bg-surface-container-low border-b border-white/10 shadow-2xl relative z-40 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4 font-label-md text-label-md bg-surface/90 backdrop-blur-2xl">
              {/* User Profile Info on Mobile */}
              {user && (
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 mb-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                    <img
                      alt={user.name}
                      className="w-full h-full object-cover"
                      src={user.avatar}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-white text-[14px] truncate">{user.name}</span>
                    <span className="text-[11px] text-white/50 truncate">{user.email}</span>
                  </div>
                </div>
              )}

              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <button
                    key={link.label}
                    onClick={() => handleLinkClick(link.path)}
                    className={`${
                      isActive ? "text-primary bg-white/5" : "text-on-surface-variant"
                    } text-left py-3 px-4 rounded-lg hover:bg-white/5 transition-all`}
                  >
                    {link.label}
                  </button>
                );
              })}
              <div className="h-[1px] w-full bg-white/10 my-2"></div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleLinkClick("/join")}
                  className="w-full text-center py-3 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  Join Room
                </button>
                {user ? (
                  <>
                    <button
                      onClick={() => handleLinkClick("/create")}
                      className="w-full text-center py-3 rounded-lg bg-gradient-to-r from-primary to-tertiary text-on-primary font-bold shadow-lg cursor-pointer"
                    >
                      Host Now
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-center py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 font-bold hover:bg-red-500/20 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleLinkClick("/login")}
                      className="w-full text-center py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => handleLinkClick("/signup")}
                      className="w-full text-center py-3 rounded-lg bg-gradient-to-r from-primary to-tertiary text-on-primary font-bold shadow-lg cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
