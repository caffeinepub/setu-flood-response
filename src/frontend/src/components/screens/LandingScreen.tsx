import { motion } from "motion/react";

interface LandingScreenProps {
  onNavigate: (
    screen: "map" | "simulator" | "graph" | "dashboard" | "home",
  ) => void;
}

const disasterCards = [
  {
    icon: "\uD83C\uDF0A",
    title: "Flood",
    desc: "Flash floods & river overflow",
    active: true,
  },
  {
    icon: "\uD83C\uDF0B",
    title: "Earthquake",
    desc: "Seismic activity response",
  },
  {
    icon: "\uD83C\uDF2A\uFE0F",
    title: "Cyclone",
    desc: "Cyclonic storm management",
  },
];

export default function LandingScreen({ onNavigate }: LandingScreenProps) {
  return (
    <main
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "#FAFAFA" }}
    >
      {/* Flood disaster background image */}
      <img
        src="/assets/generated/flood-bg.dim_1920x1080.jpg"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.2,
          zIndex: 0,
        }}
      />

      {/* Light overlay for readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(255,240,240,0.80) 0%, rgba(255,248,245,0.65) 40%, rgba(250,250,250,0.40) 100%)",
          zIndex: 1,
        }}
      />

      {/* Status bar */}
      <div
        className="relative z-10 w-full py-2 px-6 flex items-center justify-center gap-3 text-sm"
        style={{
          background: "rgba(255,255,255,0.85)",
          borderBottom: "1px solid #E0E0E0",
          backdropFilter: "blur(8px)",
        }}
        data-ocid="landing.section"
      >
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{ background: "#16a34a" }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
        />
        <span style={{ color: "#555" }}>
          \u26A0 <span style={{ color: "#16a34a" }}>0 villages at risk</span> |
          System:{" "}
          <span style={{ color: "#16a34a", fontFamily: "monospace" }}>
            READY
          </span>
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-20 pb-10 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-none mb-4"
            style={{
              background:
                "linear-gradient(90deg, #FF3B30 0%, #FF6B35 40%, #b45309 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            SETU: LIFELINE FOR ASSAM FLOODS
          </h1>
        </motion.div>

        <motion.p
          className="text-xl md:text-2xl font-medium mb-3"
          style={{ color: "#b45309" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Real-time rescue routes when roads fail
        </motion.p>

        <motion.p
          className="text-sm max-w-xl mb-2"
          style={{ color: "#555" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          NDMA Assam Emergency Response Simulation System \u2014 Powered by
          AI-Optimized Routing
        </motion.p>

        {/* Alert badge */}
        <motion.div
          className="mt-4 mb-8 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest"
          style={{
            background: "rgba(255,59,48,0.1)",
            border: "1px solid #FF3B30",
            color: "#FF3B30",
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "#FF3B30", display: "inline-block" }}
          />
          Current Alert: SEVERE \u2014 Brahmaputra Basin
        </motion.div>
      </section>

      {/* Disaster Type Cards */}
      <section className="relative z-10 flex justify-center gap-6 px-4 mb-12 flex-wrap">
        {disasterCards.map((card, i) => (
          <motion.div
            key={card.title}
            className="cursor-pointer rounded-xl p-6 flex flex-col items-center gap-3 w-48"
            style={{
              background: "rgba(255,255,255,0.90)",
              border: card.active
                ? "1px solid rgba(255,59,48,0.6)"
                : "1px solid rgba(200,200,200,0.8)",
              boxShadow: card.active
                ? "0 4px 20px rgba(255,59,48,0.15)"
                : "0 2px 10px rgba(0,0,0,0.06)",
              backdropFilter: "blur(8px)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
            whileHover={{ y: -8, boxShadow: "0 8px 30px rgba(255,59,48,0.2)" }}
            data-ocid="landing.card"
          >
            <span className="text-4xl">{card.icon}</span>
            <span
              className="text-base font-bold uppercase tracking-widest"
              style={{ color: card.active ? "#FF3B30" : "#555" }}
            >
              {card.title}
            </span>
            <span className="text-xs text-center" style={{ color: "#777" }}>
              {card.desc}
            </span>
            {card.active && (
              <span
                className="text-xs px-2 py-0.5 rounded font-bold"
                style={{ background: "rgba(255,59,48,0.12)", color: "#FF3B30" }}
              >
                ACTIVE
              </span>
            )}
          </motion.div>
        ))}
      </section>

      {/* CTA Buttons */}
      <section className="relative z-10 flex flex-col items-center gap-4 mb-16">
        <motion.button
          className="px-14 py-4 rounded-full font-black uppercase tracking-widest text-lg"
          style={{
            background: "#16a34a",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(22,163,74,0.35)",
          }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          whileHover={{ x: [0, -4, 4, -4, 4, 0] } as any}
          onClick={() => onNavigate("simulator")}
          data-ocid="landing.primary_button"
        >
          \uD83D\uDEA8 START SIMULATION
        </motion.button>

        <div className="flex gap-4">
          <motion.button
            className="px-6 py-3 rounded font-bold uppercase tracking-widest text-sm"
            style={{
              background: "#f59e0b",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 12px rgba(245,158,11,0.3)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate("simulator")}
            data-ocid="landing.secondary_button"
          >
            LAUNCH SIMULATION
          </motion.button>
          <motion.button
            className="px-6 py-3 rounded font-bold uppercase tracking-widest text-sm"
            style={{
              background: "#FF3B30",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 12px rgba(255,59,48,0.3)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate("map")}
            data-ocid="landing.map_button"
          >
            VIEW LIVE MAP
          </motion.button>
        </div>
      </section>

      {/* How It Works */}
      <section
        className="relative z-10 max-w-4xl mx-auto px-4 mb-16 w-full"
        data-ocid="landing.section"
      >
        <h2
          className="text-center text-xs font-bold uppercase tracking-widest mb-8"
          style={{ color: "#777" }}
        >
          [ HOW IT WORKS ]
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              icon: "\uD83D\uDCE1",
              title: "Detect",
              desc: "Sensors and satellite imagery detect flood zones in real-time",
            },
            {
              step: "02",
              icon: "\uD83D\uDDFA\uFE0F",
              title: "Route",
              desc: "AI calculates optimal rescue routes around blocked roads",
            },
            {
              step: "03",
              icon: "\uD83D\uDE81",
              title: "Deploy",
              desc: "Supply convoys and air units dispatched with live ETA tracking",
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              className="rounded-xl p-5 flex flex-col gap-2"
              style={{
                background: "rgba(255,255,255,0.90)",
                border: "1px solid #E8E8E8",
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                backdropFilter: "blur(8px)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 + i * 0.15 }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-bold"
                  style={{ color: "#FF3B30", fontFamily: "monospace" }}
                >
                  {item.step}
                </span>
                <span className="text-2xl">{item.icon}</span>
                <span
                  className="font-bold uppercase tracking-wider text-sm"
                  style={{ color: "#1A1A1A" }}
                >
                  {item.title}
                </span>
              </div>
              <p className="text-sm" style={{ color: "#666" }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Water ripple effect */}
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden h-32 pointer-events-none"
        style={{ zIndex: 2 }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="ripple-ring"
            style={{
              position: "absolute",
              bottom: "-20px",
              left: "50%",
              transform: "translateX(-50%)",
              width: `${300 + i * 200}px`,
              height: `${150 + i * 100}px`,
              borderRadius: "50%",
              border: "1px solid rgba(255,59,48,0.2)",
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>
    </main>
  );
}
