import { motion } from "motion/react";

type Screen = "home" | "map" | "graph" | "simulator" | "dashboard";

interface NavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const navItems: { id: Screen; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "map", label: "Map View" },
  { id: "graph", label: "Network Graph" },
  { id: "simulator", label: "Simulator" },
  { id: "dashboard", label: "Dashboard" },
];

const zoneColor: Record<Screen, string> = {
  home: "#FF3B30",
  map: "#16a34a",
  graph: "#b45309",
  simulator: "#FF3B30",
  dashboard: "#16a34a",
};

export default function Nav({ currentScreen, onNavigate }: NavProps) {
  return (
    <nav
      className="sticky top-0 z-50 w-full border-b"
      style={{
        background: "#FFFFFF",
        borderColor: "#E0E0E0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
      data-ocid="nav.panel"
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg"
            style={{
              background: "linear-gradient(135deg, #FF3B30, #FF6B35)",
              color: "#fff",
              fontFamily: "sans-serif",
            }}
          >
            S
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="font-bold text-xl tracking-widest uppercase"
              style={{ color: "#FF3B30", fontFamily: "'Roboto', sans-serif" }}
            >
              SETU
            </span>
            <span
              className="text-[10px] tracking-widest"
              style={{ color: "#999" }}
            >
              EMERGENCY COMMAND CENTER
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-1" data-ocid="nav.tab">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            const color = isActive ? zoneColor[item.id] : "#666";
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="relative px-3 py-4 text-sm uppercase tracking-wider font-bold transition-colors duration-200"
                style={{
                  color,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
                data-ocid={`nav.${item.id}.link`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: zoneColor[item.id] }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: "#16a34a" }}
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          />
          <span
            className="text-xs font-bold tracking-widest"
            style={{ color: "#16a34a" }}
          >
            LIVE
          </span>
          <div
            className="ml-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ background: "#16a34a", color: "#fff" }}
          >
            Active Duty
          </div>
        </div>
      </div>
    </nav>
  );
}
