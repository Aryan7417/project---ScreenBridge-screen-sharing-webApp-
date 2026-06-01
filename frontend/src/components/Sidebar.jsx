import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarLinks = [
    { label: "Home", path: "/", icon: "grid_view" },
    { label: "Connections", path: "/create", icon: "cast_connected" },
    { label: "Analytics", path: "/analytics", icon: "bar_chart" },
    { label: "Team", path: "/team", icon: "group" },
    { label: "Settings", path: "/settings", icon: "settings" },
    { label: "Support", path: "/support", icon: "help" },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 z-40 border-r border-white/5 shadow-2xl bg-surface-container-low/60 backdrop-blur-2xl flex flex-col p-6 gap-4 hidden md:flex">
      {/* Brand Header */}
      <div className="flex items-center gap-4 px-4 py-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-surface font-bold text-xl">hub</span>
        </div>
        <div className="flex flex-col">
          <span className="font-headline-lg text-[18px] leading-tight font-bold text-primary tracking-tight">ScreenBridge HQ</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">Enterprise Pro</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1 mt-4">
        {sidebarLinks.map((link) => {
          const isActive = location.pathname === link.path || 
            (link.path === "/create" && (location.pathname.startsWith("/create") || location.pathname.startsWith("/host") || location.pathname.startsWith("/waiting")));
          
          return (
            <Link
              key={link.label}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? "bg-primary-container/20 text-primary border-l-4 border-primary rounded-r-full font-bold opacity-90"
                  : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface hover:translate-x-1"
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] transition-colors ${
                isActive ? "text-primary" : "group-hover:text-on-surface"
              }`}>
                {link.icon}
              </span>
              <span className="font-label-md text-label-md">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Action & Footer */}
      <div className="mt-auto flex flex-col gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/create")}
          className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border border-primary/30 text-primary font-label-md text-label-md hover:bg-primary/20 transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(173,198,255,0.1)]"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Connection
        </motion.button>
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-colors group mt-2 border-t border-white/5 pt-4"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:text-on-surface">logout</span>
          <span className="font-label-md text-label-md">Log Out</span>
        </Link>
      </div>
    </aside>
  );
}
