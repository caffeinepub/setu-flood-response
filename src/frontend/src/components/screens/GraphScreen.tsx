import cytoscape from "cytoscape";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { graphEdges, graphNodes } from "../../data/mockData";

const C = { danger: "#FF1744", moderate: "#FFEA00", success: "#00E676" };

interface TooltipData {
  name: string;
  priority: string;
  supplies: { medicine: number; food: number; water: number };
  x: number;
  y: number;
}

const rippleNodes = [
  { id: "n1", label: "Dhubri", x: 60, y: 120, type: "danger" },
  { id: "n2", label: "Bilasipara", x: 160, y: 60, type: "danger" },
  { id: "n3", label: "Golakganj", x: 270, y: 100, type: "danger" },
  { id: "n4", label: "Barpeta", x: 370, y: 60, type: "moderate" },
  { id: "n5", label: "Kamrup", x: 460, y: 140, type: "moderate" },
  { id: "n6", label: "Nalbari", x: 340, y: 180, type: "safe" },
  { id: "n7", label: "Nagaon", x: 220, y: 200, type: "safe" },
  { id: "n8", label: "Jogighopa", x: 100, y: 200, type: "danger" },
];

const rippleEdges = [
  ["n1", "n2"],
  ["n2", "n3"],
  ["n3", "n4"],
  ["n4", "n5"],
  ["n1", "n8"],
  ["n8", "n7"],
  ["n7", "n6"],
  ["n3", "n7"],
  ["n5", "n6"],
];

const heatmapVillages = [
  "Dhubri",
  "Bilasipara",
  "Golakganj",
  "Chapar",
  "Gauripur",
  "Mankachar",
  "Fekamari",
  "Barpeta",
  "Jogighopa",
  "Nalbari",
  "Kamrup",
  "Nagaon",
  "Fakiragram",
  "Srirampur",
  "Morigaon",
  "Chirang",
  "Morigaon",
  "Goalpara",
  "Bongaigaon",
  "Kokrajhar",
];

function nodeColor(type: string) {
  if (type === "danger") return C.danger;
  if (type === "moderate") return C.moderate;
  return C.success;
}

function VisualizationDeck({ onClose }: { onClose: () => void }) {
  const [sliderValue, setSliderValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [rippleStep, setRippleStep] = useState(-1);
  const [rippleActive, setRippleActive] = useState(false);
  const [rippleImpact, setRippleImpact] = useState(0);
  const [time, setTime] = useState(() => new Date().toLocaleTimeString());
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Play/pause slider
  useEffect(() => {
    if (isPlaying) {
      playRef.current = setInterval(() => {
        setSliderValue((prev) => {
          if (prev >= 12) {
            setIsPlaying(false);
            return 12;
          }
          return prev + 0.1 * speed;
        });
      }, 100);
    } else {
      if (playRef.current) clearInterval(playRef.current);
    }
    return () => {
      if (playRef.current) clearInterval(playRef.current);
    };
  }, [isPlaying, speed]);

  const triggerRipple = (startNodeIdx: number) => {
    if (rippleActive) return;
    setRippleActive(true);
    setRippleStep(-1);
    setRippleImpact(0);
    const order = [
      startNodeIdx,
      (startNodeIdx + 1) % 8,
      (startNodeIdx + 2) % 8,
      (startNodeIdx + 3) % 8,
      (startNodeIdx + 4) % 8,
    ];
    order.forEach((step, i) => {
      setTimeout(() => {
        setRippleStep(step);
        setRippleImpact(i + 1);
      }, i * 350);
    });
    setTimeout(() => setRippleActive(false), order.length * 350 + 500);
  };

  // Heatmap severity based on slider
  const heatSeverity = (i: number): number => {
    const base = [5, 5, 4, 3, 4, 3, 5, 3, 3, 2, 2, 2, 3, 3, 2, 4, 2, 3, 3, 4][
      i % 20
    ];
    const t = sliderValue / 12;
    return Math.min(5, Math.round(base + t * (5 - base) * 0.8));
  };

  const criticalCount = heatmapVillages.filter(
    (_, i) => heatSeverity(i) >= 4,
  ).length;

  function heatColor(sev: number): string {
    if (sev >= 5) return C.danger;
    if (sev >= 4) return "#FF6B00";
    if (sev >= 3) return C.moderate;
    if (sev >= 2) return "#88CC44";
    return C.success;
  }

  const dotSize = (sev: number) => 12 + sev * 4;

  const content = (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "#050505" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            backgroundImage:
              "url('/assets/generated/assam-roads-bg.dim_1920x1080.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.12,
            filter: "blur(3px)",
            position: "absolute",
            inset: 0,
          }}
        />
      </div>

      {/* Header bar */}
      <div
        className="relative z-10 flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
        style={{
          border: "1px solid #F0F0F0",
          background: "rgba(255,255,255,0.92)",
        }}
      >
        <motion.h1
          className="text-lg font-black uppercase tracking-widest"
          style={{ color: C.danger, fontFamily: "monospace" }}
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          Ripple &amp; Heat: See the Chaos Unfold
        </motion.h1>
        <div className="flex items-center gap-3">
          <span
            className="text-xs"
            style={{ color: "#555", fontFamily: "monospace" }}
          >
            {time}
          </span>
          {/* Overlay stats */}
          <div
            className="flex gap-3 text-xs font-bold"
            style={{ fontFamily: "monospace" }}
          >
            <span style={{ color: C.danger }}>
              Ripple Impact: {rippleImpact} Villages
            </span>
            <span style={{ color: C.moderate }}>
              Time: T+{Math.floor(sliderValue)}hr
            </span>
            <span style={{ color: C.success }}>Critical: {criticalCount}</span>
          </div>
          {/* Speed */}
          <div className="flex gap-1">
            {[1, 2, 4].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className="px-2 py-1 rounded text-xs font-bold"
                style={{
                  background: speed === s ? C.moderate : "#E8E8E8",
                  color: speed === s ? "#000" : "#888",
                }}
              >
                {s}x
              </button>
            ))}
          </div>
          <motion.button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-1.5 rounded text-xs font-bold uppercase"
            style={{
              background: isPlaying ? C.moderate : C.success,
              color: "#000",
            }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? "⏸ PAUSE" : "▶ PLAY"}
          </motion.button>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: "#FFF0F0", color: "#666" }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Split view */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Left: Ripple Simulator */}
        <div
          className="flex-1 flex flex-col border-r"
          style={{ borderColor: "#E0E0E0" }}
        >
          <div
            className="px-4 py-2 border-b flex-shrink-0"
            style={{ borderColor: "#E0E0E0" }}
          >
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#555" }}
            >
              [ RIPPLE SIMULATOR — Click a node ]
            </span>
          </div>
          <div className="flex-1 relative p-4">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 540 280"
              style={{ overflow: "visible" }}
              role="img"
              aria-label="Ripple simulator network graph"
            >
              <title>Ripple simulator network graph</title>
              {/* Edges */}
              {rippleEdges.map(([a, b]) => {
                const na = rippleNodes.find((n) => n.id === a)!;
                const nb = rippleNodes.find((n) => n.id === b)!;
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={na.x}
                    y1={na.y}
                    x2={nb.x}
                    y2={nb.y}
                    stroke="#2A2A2A"
                    strokeWidth={2}
                  />
                );
              })}
              {/* Nodes */}
              {rippleNodes.map((node, i) => {
                const isRippling = rippleStep === i;
                const hasRippled = rippleStep > i && rippleActive;
                const col = hasRippled
                  ? C.danger
                  : isRippling
                    ? C.moderate
                    : nodeColor(node.type);
                return (
                  <g
                    key={node.id}
                    onClick={() => triggerRipple(i)}
                    onKeyDown={(e) => e.key === "Enter" && triggerRipple(i)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Ripple ring */}
                    {isRippling && (
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r={20}
                        fill="none"
                        stroke={C.moderate}
                        strokeWidth={2}
                        initial={{ r: 14, opacity: 1 }}
                        animate={{ r: 40, opacity: 0 }}
                        transition={{ duration: 0.6, repeat: 2 }}
                      />
                    )}
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={14}
                      fill={col}
                      stroke={col}
                      strokeWidth={2}
                      style={{ filter: `drop-shadow(0 0 6px ${col})` }}
                      animate={
                        isRippling
                          ? { scale: [1, 1.3, 1] }
                          : hasRippled
                            ? { scale: [1, 1.15, 1] }
                            : {}
                      }
                      transition={{ duration: 0.5 }}
                    />
                    <text
                      x={node.x}
                      y={node.y + 24}
                      textAnchor="middle"
                      fill="#888"
                      fontSize={9}
                      fontFamily="monospace"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
            {rippleImpact > 0 && (
              <motion.div
                className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg text-sm font-black"
                style={{
                  background: `${C.danger}20`,
                  border: `1px solid ${C.danger}50`,
                  color: C.danger,
                  fontFamily: "monospace",
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                Ripple Impact: {rippleImpact} Villages
              </motion.div>
            )}
          </div>
        </div>

        {/* Right: Severity Heatmap Slider */}
        <div className="flex-1 flex flex-col">
          <div
            className="px-4 py-2 border-b flex-shrink-0 flex items-center justify-between"
            style={{ borderColor: "#E0E0E0" }}
          >
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#555" }}
            >
              [ SEVERITY HEATMAP — T+{Math.floor(sliderValue)}hr ]
            </span>
            <span
              className="text-xs font-bold"
              style={{ color: C.danger, fontFamily: "monospace" }}
            >
              Active Threat: {criticalCount} critical
            </span>
          </div>
          {/* Slider */}
          <div
            className="px-6 py-3 border-b flex-shrink-0 flex items-center gap-3"
            style={{ borderColor: "#E0E0E0" }}
          >
            <span
              className="text-xs"
              style={{ color: "#666", fontFamily: "monospace" }}
            >
              T+0hr
            </span>
            <input
              type="range"
              min={0}
              max={12}
              step={0.1}
              value={sliderValue}
              onChange={(e) => {
                setSliderValue(Number.parseFloat(e.target.value));
                setIsPlaying(false);
              }}
              className="flex-1"
              style={{ accentColor: C.danger, cursor: "pointer" }}
            />
            <span
              className="text-xs"
              style={{ color: "#666", fontFamily: "monospace" }}
            >
              T+12hr
            </span>
          </div>
          {/* Grid */}
          <div className="flex-1 overflow-auto p-4">
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
            >
              {heatmapVillages.map((village, i) => {
                const sev = heatSeverity(i);
                const col = heatColor(sev);
                const size = dotSize(sev);
                return (
                  <motion.div
                    key={village}
                    className="rounded-lg flex flex-col items-center justify-center gap-1 py-2"
                    style={{
                      background: `${col}15`,
                      border: `1px solid ${col}50`,
                      minHeight: 64,
                    }}
                    animate={{
                      boxShadow:
                        sev >= 4
                          ? [
                              `0 0 6px ${col}50`,
                              `0 0 16px ${col}80`,
                              `0 0 6px ${col}50`,
                            ]
                          : `0 0 2px ${col}30`,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.06,
                    }}
                  >
                    <motion.div
                      className="rounded-full"
                      style={{ background: col, boxShadow: `0 0 6px ${col}` }}
                      animate={{ width: size, height: size }}
                      transition={{ duration: 0.4 }}
                    />
                    <span
                      className="text-center"
                      style={{
                        color: col,
                        fontFamily: "monospace",
                        fontSize: "9px",
                        lineHeight: 1.1,
                      }}
                    >
                      {village}
                    </span>
                    <span
                      className="text-xs font-black"
                      style={{
                        color: col,
                        fontFamily: "monospace",
                        fontSize: "10px",
                      }}
                    >
                      {sev}/5
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
  return createPortal(content, document.body);
}

export default function GraphScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [bfsRunning, setBfsRunning] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const [time, setTime] = useState(() => new Date().toLocaleTimeString());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        ...graphNodes.map((n) => ({
          data: {
            id: n.id,
            label: n.label,
            type: n.type,
            supplies: n.supplies,
            priority: n.priority,
          },
        })),
        ...graphEdges.map((e) => ({
          data: {
            id: e.id,
            source: e.source,
            target: e.target,
            type: e.type,
            weight: e.weight,
          },
          classes: e.type,
        })),
      ],
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#555",
            label: "data(label)",
            color: "#fff",
            "font-size": 10,
            "text-valign": "bottom",
            "text-halign": "center",
            "text-margin-y": 4,
            width: 36,
            height: 36,
            "border-width": 2,
            "border-color": "#888",
          } as any,
        },
        {
          selector: "node[type='village-danger']",
          style: {
            "background-color": C.danger,
            "border-color": "#FF0000",
            "border-width": 3,
            shape: "star",
            width: 44,
            height: 44,
            "font-size": 10,
            color: C.danger,
          } as any,
        },
        {
          selector: "node[type='village-moderate']",
          style: {
            "background-color": C.moderate,
            "border-color": "#FFE040",
            shape: "ellipse",
            width: 36,
            height: 36,
            color: C.moderate,
          } as any,
        },
        {
          selector: "node[type='warehouse']",
          style: {
            "background-color": C.success,
            "border-color": "#00FF88",
            shape: "hexagon",
            width: 48,
            height: 48,
            color: C.success,
          } as any,
        },
        {
          selector: "node[type='hub']",
          style: {
            "background-color": "#888",
            "border-color": "#aaa",
            shape: "diamond",
            width: 40,
            height: 40,
            color: "#aaa",
          } as any,
        },
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#CCCCCC",
            "target-arrow-color": "#CCCCCC",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
          } as any,
        },
        {
          selector: "edge[type='active']",
          style: {
            "line-color": C.success,
            "target-arrow-color": C.success,
            width: 3,
          } as any,
        },
        {
          selector: "edge[type='blocked']",
          style: {
            "line-color": C.danger,
            "target-arrow-color": C.danger,
            "line-style": "dashed",
            width: 1,
          } as any,
        },
        {
          selector: "edge[type='satellite']",
          style: {
            "line-color": C.moderate,
            "target-arrow-color": C.moderate,
            "line-style": "dashed",
            "line-dash-pattern": [6, 3],
            width: 2,
          } as any,
        },
        {
          selector: ".highlighted",
          style: {
            "background-color": "#FF6B35",
            "border-color": C.danger,
          } as any,
        },
        {
          selector: ".rerouted",
          style: {
            "background-color": C.success,
            "border-color": "#00FF88",
          } as any,
        },
      ],
      layout: {
        name: "cose",
        idealEdgeLength: 100,
        nodeOverlap: 20,
        refresh: 20,
        fit: true,
        padding: 30,
        randomize: false,
        componentSpacing: 100,
        nodeRepulsion: 400000,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0,
      } as any,
    });
    cy.on("mouseover", "node", (e) => {
      const node = e.target;
      const data = node.data();
      const pos = node.renderedPosition();
      const container = containerRef.current!;
      const rect = container.getBoundingClientRect();
      setTooltip({
        name: data.label,
        priority: data.priority,
        supplies: data.supplies,
        x: rect.left + pos.x,
        y: rect.top + pos.y,
      });
    });
    cy.on("mouseout", "node", () => setTooltip(null));
    cyRef.current = cy;
    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, []);

  const runBFS = () => {
    if (!cyRef.current || bfsRunning) return;
    setBfsRunning(true);
    const cy = cyRef.current;
    const dangerNodes = cy.nodes("[type='village-danger']");
    let delay = 0;
    for (const node of dangerNodes) {
      setTimeout(() => node.addClass("highlighted"), delay);
      delay += 300;
      const neighbors = node.neighborhood("node");
      for (const n of neighbors) {
        setTimeout(() => n.addClass("highlighted"), delay);
        delay += 200;
      }
      setTimeout(() => {
        node.addClass("rerouted");
        node.removeClass("highlighted");
      }, delay + 500);
    }
    setTimeout(() => setBfsRunning(false), delay + 1000);
  };

  const resetGraph = () => {
    if (!cyRef.current) return;
    cyRef.current.nodes().removeClass("highlighted rerouted");
  };

  return (
    <main
      className="relative flex flex-col h-[calc(100vh-56px)]"
      style={{ background: "#FAFAFA" }}
    >
      {/* bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url('/assets/generated/assam-roads-bg.dim_1920x1080.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.12,
          filter: "blur(2px)",
          zIndex: 0,
        }}
      />

      {/* Top bar */}
      <div
        className="relative z-10 flex items-center justify-between px-6 py-3 border-b"
        style={{
          border: "1px solid #F0F0F0",
          background: "rgba(255,255,255,0.90)",
        }}
      >
        <div className="flex items-center gap-4">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#555" }}
          >
            [ NETWORK GRAPH ANALYSIS ]
          </span>
          <span
            className="text-xs"
            style={{ fontFamily: "monospace", color: "#555" }}
          >
            LIVE: {time}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            className="px-4 py-2 rounded font-bold uppercase tracking-wider text-xs"
            style={{
              background: "#1A1A2A",
              color: C.moderate,
              border: `1px solid ${C.moderate}50`,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowVisualization(true)}
          >
            ⊞ FULL VIEW
          </motion.button>
          <motion.button
            type="button"
            className="px-4 py-2 rounded font-bold uppercase tracking-wider text-xs"
            style={{
              background: bfsRunning ? "#CCC" : C.danger,
              color: bfsRunning ? "#666" : "#fff",
              border: "none",
              cursor: bfsRunning ? "not-allowed" : "pointer",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={runBFS}
            disabled={bfsRunning}
          >
            {bfsRunning ? "⚡ RUNNING BFS..." : "⚡ BFS REROUTE"}
          </motion.button>
          <motion.button
            type="button"
            className="px-4 py-2 rounded font-bold uppercase tracking-wider text-xs"
            style={{
              background: "transparent",
              color: "#555",
              border: "1px solid #3A2A2A",
              cursor: "pointer",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGraph}
          >
            RESET
          </motion.button>
        </div>
      </div>

      {/* Graph canvas */}
      <div className="relative flex-1 z-10">
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        {/* Legend */}
        <div
          className="absolute top-3 right-3 rounded-xl p-3 flex flex-col gap-2 z-10"
          style={{
            background: "rgba(255,255,255,0.95)",
            border: "1px solid #F0F0F0",
          }}
        >
          <div
            className="text-xs font-bold uppercase tracking-wider mb-1"
            style={{ color: "#555" }}
          >
            LEGEND
          </div>
          {[
            { color: C.danger, label: "Danger Village", shape: "★" },
            { color: C.moderate, label: "Moderate Village", shape: "●" },
            { color: C.success, label: "Warehouse", shape: "⬡" },
            { color: "#666", label: "Hub/Relay", shape: "◆" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <span style={{ color: l.color, fontSize: "14px" }}>
                {l.shape}
              </span>
              <span className="text-xs" style={{ color: "#666" }}>
                {l.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            className="fixed z-50 rounded-xl p-3 pointer-events-none"
            style={{
              left: tooltip.x + 15,
              top: tooltip.y - 80,
              background: "rgba(255,255,255,0.97)",
              border: "1px solid #3A2A2A",
              minWidth: "160px",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            <div
              className="font-bold text-sm mb-1"
              style={{ color: "#1A1A1A" }}
            >
              {tooltip.name}
            </div>
            <div
              className="text-xs mb-1"
              style={{ color: C.danger, fontFamily: "monospace" }}
            >
              Priority: {tooltip.priority}
            </div>
            {tooltip.supplies && (
              <div
                className="flex gap-2 text-xs"
                style={{ fontFamily: "monospace" }}
              >
                <span style={{ color: "#FF6B6B" }}>
                  Med:{tooltip.supplies.medicine}%
                </span>
                <span style={{ color: C.moderate }}>
                  Food:{tooltip.supplies.food}%
                </span>
                <span style={{ color: C.success }}>
                  H₂O:{tooltip.supplies.water}%
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visualization Deck overlay */}
      <AnimatePresence>
        {showVisualization && (
          <VisualizationDeck onClose={() => setShowVisualization(false)} />
        )}
      </AnimatePresence>
    </main>
  );
}
