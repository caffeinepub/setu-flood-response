import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { initialHeatmap, villages } from "../../data/mockData";

type CellStatus = "danger" | "moderate" | "safe";

function getCellStatus(value: number): CellStatus {
  if (value > 60) return "danger";
  if (value > 30) return "moderate";
  return "safe";
}

const cellColor: Record<CellStatus, string> = {
  danger: "#FF3B30",
  moderate: "#FFD700",
  safe: "#24C26A",
};

export default function SimulatorScreen() {
  const [timeHours, setTimeHours] = useState(0);
  const [isFloodTriggered, setIsFloodTriggered] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showBlast, setShowBlast] = useState(false);
  const [blockedRoads, setBlockedRoads] = useState(0);
  const [isolatorActive, setIsolatorActive] = useState(false);
  const [airFallback, setAirFallback] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const heatmapData = initialHeatmap.map((row) =>
    row.map((cell) => {
      const floodIncrease = (timeHours / 72) * 50;
      return Math.min(100, cell + (isFloodTriggered ? floodIncrease : 0));
    }),
  );

  const supplyData = villages.slice(0, 6).map((v) => ({
    name: v.name,
    level: Math.max(
      0,
      v.supplyLevel - (timeHours / 72) * (isFloodTriggered ? 30 : 10),
    ),
  }));

  const triggerFlood = () => {
    setIsFloodTriggered(true);
    setIsShaking(true);
    setShowBlast(true);

    setTimeout(() => setIsShaking(false), 600);
    setTimeout(() => setShowBlast(false), 900);
  };

  const blockRoad = () => {
    setBlockedRoads((prev) => Math.min(prev + 1, 8));
  };

  return (
    <main
      className="relative min-h-[calc(100vh-56px)] overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, #1a0808 0%, #0f0a0a 40%, #0a0a0a 100%)",
      }}
      data-ocid="simulator.section"
    >
      {/* Blast overlay */}
      <AnimatePresence>
        {showBlast && (
          <motion.div
            className="fixed inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,59,48,0.6) 0%, transparent 70%)",
              zIndex: 100,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.9 }}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#555" }}
          >
            [ SIMULATION CONTROL PANEL ]
          </span>
          <div className="flex items-center gap-3">
            {isFloodTriggered && (
              <motion.span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{
                  background: "rgba(255,59,48,0.2)",
                  color: "#FF3B30",
                  border: "1px solid #FF3B30",
                }}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              >
                ⚠ FLOOD ACTIVE
              </motion.span>
            )}
            <span
              className="text-xs"
              style={{ color: "#666", fontFamily: "monospace" }}
            >
              T+{timeHours}h
            </span>
          </div>
        </div>

        <div
          ref={containerRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* LEFT: Controls */}
          <motion.div
            animate={isShaking ? { x: [-5, 5, -5, 5, -5, 0] } : { x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div
              className="rounded-xl p-6 flex flex-col gap-5"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E8E8",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "#555" }}
              >
                [ TRIGGER CONTROLS ]
              </div>

              {/* Trigger Flood */}
              <motion.button
                type="button"
                className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-lg"
                style={{
                  background: isFloodTriggered
                    ? "rgba(255,59,48,0.3)"
                    : "#FF3B30",
                  color: isFloodTriggered ? "#FF3B30" : "#fff",
                  border: isFloodTriggered ? "2px solid #FF3B30" : "none",
                  cursor: "pointer",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={triggerFlood}
                data-ocid="simulator.primary_button"
              >
                🌊 {isFloodTriggered ? "FLOOD ACTIVE" : "TRIGGER FLOOD"}
              </motion.button>

              {/* Block Road */}
              <motion.button
                type="button"
                className="w-full py-3 rounded-xl font-bold uppercase tracking-widest text-sm"
                style={{
                  background: "transparent",
                  color: "#FFD700",
                  border: "1px solid #FFD700",
                  cursor: "pointer",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={blockRoad}
                data-ocid="simulator.secondary_button"
              >
                🚧 BLOCK ROAD ({blockedRoads} blocked)
              </motion.button>

              {/* Time Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span
                    className="text-xs uppercase tracking-wider"
                    style={{ color: "#555" }}
                  >
                    Time Progression
                  </span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      color: "#FFD700",
                      fontSize: "13px",
                    }}
                  >
                    T+{timeHours}h / 72h
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={72}
                  value={timeHours}
                  onChange={(e) => setTimeHours(Number(e.target.value))}
                  className="time-slider w-full h-2 rounded cursor-pointer"
                  style={{
                    accentColor:
                      timeHours > 48
                        ? "#FF3B30"
                        : timeHours > 24
                          ? "#FFD700"
                          : "#24C26A",
                  }}
                  data-ocid="simulator.input"
                />
                <div
                  className="flex justify-between text-xs"
                  style={{ color: "#555" }}
                >
                  <span>0h</span>
                  <span style={{ color: "#24C26A" }}>24h</span>
                  <span style={{ color: "#FFD700" }}>48h</span>
                  <span style={{ color: "#FF3B30" }}>72h</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-3">
                <div
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: "#FAFAFA", border: "1px solid #F0F0F0" }}
                >
                  <div>
                    <div
                      className="text-sm font-bold"
                      style={{ color: "#1A1A1A" }}
                    >
                      Village Isolator
                    </div>
                    <div className="text-xs" style={{ color: "#666" }}>
                      Simulate village cut-off
                    </div>
                  </div>
                  <motion.button
                    type="button"
                    className="w-12 h-6 rounded-full relative"
                    style={{
                      background: isolatorActive
                        ? "rgba(255,59,48,0.4)"
                        : "#E0E0E0",
                      border: `1px solid ${isolatorActive ? "#FF3B30" : "#D0D0D0"}`,
                      cursor: "pointer",
                    }}
                    onClick={() => setIsolatorActive(!isolatorActive)}
                    data-ocid="simulator.toggle"
                  >
                    <motion.div
                      className="absolute top-0.5 w-5 h-5 rounded-full"
                      style={{
                        background: isolatorActive ? "#FF3B30" : "#AAA",
                      }}
                      animate={{
                        left: isolatorActive ? "calc(100% - 22px)" : "2px",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    />
                  </motion.button>
                </div>

                <div
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: "#FAFAFA", border: "1px solid #F0F0F0" }}
                >
                  <div>
                    <div
                      className="text-sm font-bold"
                      style={{ color: "#1A1A1A" }}
                    >
                      Air Fallback
                    </div>
                    <div className="text-xs" style={{ color: "#666" }}>
                      Deploy helicopter routes
                    </div>
                  </div>
                  <motion.button
                    type="button"
                    className="w-12 h-6 rounded-full relative"
                    style={{
                      background: airFallback
                        ? "rgba(36,194,106,0.4)"
                        : "#E0E0E0",
                      border: `1px solid ${airFallback ? "#24C26A" : "#D0D0D0"}`,
                      cursor: "pointer",
                    }}
                    onClick={() => setAirFallback(!airFallback)}
                    data-ocid="simulator.switch"
                  >
                    <motion.div
                      className="absolute top-0.5 w-5 h-5 rounded-full"
                      style={{ background: airFallback ? "#24C26A" : "#AAA" }}
                      animate={{
                        left: airFallback ? "calc(100% - 22px)" : "2px",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    />
                  </motion.button>
                </div>
              </div>

              {airFallback && (
                <motion.div
                  className="p-3 rounded-lg flex items-center gap-3"
                  style={{
                    background: "rgba(36,194,106,0.1)",
                    border: "1px solid rgba(36,194,106,0.3)",
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <motion.span
                    className="text-2xl"
                    animate={{ x: [0, 20, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    🚁
                  </motion.span>
                  <div>
                    <div
                      className="text-xs font-bold"
                      style={{ color: "#24C26A" }}
                    >
                      AIR ROUTES ACTIVE
                    </div>
                    <div className="text-xs" style={{ color: "#666" }}>
                      3 helicopters deployed to red zones
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* RIGHT: Visualizations */}
          <div className="flex flex-col gap-5">
            {/* Heatmap */}
            <div
              className="rounded-xl p-5"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E8E8",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
              data-ocid="simulator.card"
            >
              <div
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "#555" }}
              >
                [ SEVERITY HEATMAP —{" "}
                {isFloodTriggered ? `T+${timeHours}h` : "BASELINE"} ]
              </div>
              <div
                className="grid gap-1.5"
                style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
              >
                {heatmapData.flatMap((row, rowIdx) =>
                  row.map((value, colIdx) => {
                    const cellKey = `r${rowIdx}c${colIdx}`;
                    const flatIdx = rowIdx * 5 + colIdx;
                    const status = getCellStatus(value);
                    return (
                      <motion.div
                        key={cellKey}
                        className="rounded aspect-square flex items-center justify-center"
                        style={{
                          background: `${cellColor[status]}20`,
                          border: `1px solid ${cellColor[status]}60`,
                        }}
                        animate={{
                          boxShadow:
                            status === "danger"
                              ? [
                                  "0 0 8px rgba(255,0,0,0.4)",
                                  "0 0 18px rgba(255,0,0,0.7)",
                                  "0 0 8px rgba(255,0,0,0.4)",
                                ]
                              : undefined,
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: (flatIdx % 5) * 0.1,
                        }}
                        data-ocid={`simulator.item.${flatIdx + 1}`}
                      >
                        <span
                          className="text-xs"
                          style={{
                            fontFamily: "monospace",
                            color: cellColor[status],
                          }}
                        >
                          {Math.round(value)}
                        </span>
                      </motion.div>
                    );
                  }),
                )}
              </div>
            </div>

            {/* Supply Progress Bars */}
            <div
              className="rounded-xl p-5"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E8E8",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
              data-ocid="simulator.card"
            >
              <div
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "#555" }}
              >
                [ SUPPLY DELIVERY STATUS ]
              </div>
              <div className="flex flex-col gap-3">
                {supplyData.map((v, i) => {
                  const color =
                    v.level > 60
                      ? "#24C26A"
                      : v.level > 30
                        ? "#FFD700"
                        : "#FF3B30";
                  return (
                    <div key={v.name} data-ocid={`simulator.item.${i + 1}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span
                          className="text-xs font-bold"
                          style={{ color: "#1A1A1A" }}
                        >
                          {v.name}
                        </span>
                        <span
                          className="text-xs"
                          style={{ fontFamily: "monospace", color }}
                        >
                          {Math.round(v.level)}%
                        </span>
                      </div>
                      <div
                        className="w-full h-2 rounded-full"
                        style={{ background: "#F0F0F0" }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.round(v.level)}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div
              className="rounded-xl p-4"
              style={{ background: "#FFFFFF", border: "1px solid #F0F0F0" }}
            >
              <div
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "#555" }}
              >
                [ SEVERITY LEGEND ]
              </div>
              <div className="flex gap-4">
                {[
                  { color: "#FF3B30", label: "CRITICAL (>60)", glow: true },
                  { color: "#FFD700", label: "MODERATE (30–60)" },
                  { color: "#24C26A", label: "SAFE (<30)" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{
                        background: `${item.color}20`,
                        border: `1px solid ${item.color}`,
                        boxShadow: item.glow
                          ? `0 0 8px ${item.color}60`
                          : undefined,
                      }}
                    />
                    <span className="text-xs" style={{ color: "#666" }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
