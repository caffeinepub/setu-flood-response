import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Nav from "./components/Nav";
import DashboardScreen from "./components/screens/DashboardScreen";
import GraphScreen from "./components/screens/GraphScreen";
import LandingScreen from "./components/screens/LandingScreen";
import MapScreen from "./components/screens/MapScreen";
import SimulatorScreen from "./components/screens/SimulatorScreen";

type Screen = "home" | "map" | "graph" | "simulator" | "dashboard";

const screenVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <LandingScreen key="home" onNavigate={setCurrentScreen} />;
      case "map":
        return <MapScreen key="map" />;
      case "graph":
        return <GraphScreen key="graph" />;
      case "simulator":
        return <SimulatorScreen key="simulator" />;
      case "dashboard":
        return <DashboardScreen key="dashboard" />;
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "#FAFAFA", color: "#1A1A1A" }}
    >
      <Nav currentScreen={currentScreen} onNavigate={setCurrentScreen} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <footer
        className="w-full py-4 px-6 text-center text-xs border-t"
        style={{ background: "#F0F0F0", borderColor: "#E0E0E0", color: "#777" }}
      >
        <span>© {new Date().getFullYear()}. Built with ❤️ using </span>
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#FF3B30" }}
        >
          caffeine.ai
        </a>
        <span className="ml-4" style={{ color: "#999" }}>
          NDMA Assam Emergency Response Simulation v1.0
        </span>
      </footer>
    </div>
  );
}
