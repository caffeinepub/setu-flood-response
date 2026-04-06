import L from "leaflet";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { type Village, routes, villages } from "../../data/mockData";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const C = { danger: "#FF1744", moderate: "#FFEA00", success: "#00E676" };
const statusColor = { danger: C.danger, moderate: C.moderate, safe: C.success };
const statusBg = {
  danger: "rgba(255,23,68,0.1)",
  moderate: "rgba(255,234,0,0.1)",
  safe: "rgba(0,230,118,0.1)",
};

const heatmapDistricts = [
  { label: "Dhubri", severity: 4 },
  { label: "Bilasipara", severity: 5 },
  { label: "Barpeta", severity: 3 },
  { label: "Kamrup", severity: 2 },
  { label: "Nalbari", severity: 2 },
  { label: "Bongaigaon", severity: 3 },
  { label: "Chirang", severity: 4 },
  { label: "Kokrajhar", severity: 5 },
  { label: "Goalpara", severity: 4 },
  { label: "Morigaon", severity: 2 },
  { label: "Nagaon", severity: 3 },
  { label: "Hojai", severity: 2 },
  { label: "Golakganj", severity: 5 },
  { label: "Gauripur", severity: 3 },
  { label: "Fakiragram", severity: 4 },
  { label: "Srirampur", severity: 2 },
  { label: "Chapar", severity: 4 },
  { label: "Fekamari", severity: 5 },
  { label: "Mankachar", severity: 3 },
  { label: "Jogighopa", severity: 3 },
];

const topRiskVillages = [
  {
    name: "Golakganj",
    risk: "Flood Predict",
    note: "Demand Spike Incoming",
    severity: 5,
  },
  {
    name: "Bilasipara",
    risk: "Road Collapse Risk",
    note: "Supply Route Threatened",
    severity: 5,
  },
  {
    name: "Fekamari",
    risk: "Flood Predict",
    note: "Medicine Shortage Alert",
    severity: 5,
  },
  {
    name: "Kokrajhar",
    risk: "Cascade Risk",
    note: "3 Connected Villages at Risk",
    severity: 4,
  },
  {
    name: "Chirang",
    risk: "Bridge Risk",
    note: "Isolation Likely in 4hr",
    severity: 4,
  },
];

const cascadeNodes = [
  "Dhubri",
  "Bilasipara",
  "Golakganj",
  "Fekamari",
  "Kokrajhar",
];

const rerouteLog = [
  {
    id: "r1",
    time: "14:32",
    bridge: "Bridge A (NH-27)",
    buddy: "Jogighopa",
    etaSaved: 5,
    status: "active" as const,
  },
  {
    id: "r2",
    time: "14:18",
    bridge: "Bridge B (NH-15)",
    buddy: "Barpeta",
    etaSaved: 8,
    status: "active" as const,
  },
  {
    id: "r3",
    time: "13:55",
    bridge: "Ferry Ghat C",
    buddy: "Dhubri Hub",
    etaSaved: 3,
    status: "satellite" as const,
  },
  {
    id: "r4",
    time: "13:20",
    bridge: "Road Block D-12",
    buddy: "Chapar",
    etaSaved: 6,
    status: "active" as const,
  },
  {
    id: "r5",
    time: "12:48",
    bridge: "Bridge E (SH-8)",
    buddy: "Gauripur",
    etaSaved: 4,
    status: "resolved" as const,
  },
];

function severityColor(s: number): string {
  if (s >= 5) return C.danger;
  if (s >= 4) return "#FF6B00";
  if (s >= 3) return C.moderate;
  if (s >= 2) return "#88CC44";
  return C.success;
}

function PredictionsModal({ onClose }: { onClose: () => void }) {
  const [cascadeStep, setCascadeStep] = useState(-1);
  const [forecastAnimated, setForecastAnimated] = useState(false);

  useEffect(() => {
    const steps = [0, 1, 2, 3, 4];
    steps.forEach((s, i) => setTimeout(() => setCascadeStep(s), 400 + i * 350));
    setTimeout(() => setForecastAnimated(true), 300);
  }, []);

  const forecastBars = [
    { label: "Day+1", height: 40 },
    { label: "Day+2", height: 55 },
    { label: "Day+3", height: 70 },
    { label: "Day+4", height: 85 },
    { label: "Day+5", height: 95 },
  ];

  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(255,255,255,0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <motion.div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ background: "#FFFFFF", border: `1px solid ${C.danger}50` }}
      >
        {/* bg */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div
            style={{
              backgroundImage:
                "url('/assets/generated/flood-village-bg.dim_1920x1080.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.15,
              filter: "blur(3px)",
              position: "absolute",
              inset: 0,
            }}
          />
        </div>

        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <motion.h2
              className="text-lg font-black uppercase tracking-widest"
              style={{ color: C.danger, fontFamily: "monospace" }}
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              Predict &amp; Preempt: 3 Failures Next 2hrs
            </motion.h2>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: "#FFF0F0", color: "#666" }}
            >
              ✕
            </button>
          </div>

          {/* Heatmap */}
          <div
            className="rounded-xl p-4 mb-5"
            style={{
              background: "rgba(255,255,255,0.85)",
              border: "1px solid #F0F0F0",
            }}
          >
            <div
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#777" }}
            >
              [ ASSAM DISTRICT SEVERITY GRID ]
            </div>
            <div
              className="grid gap-1.5"
              style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
            >
              {heatmapDistricts.map((d, i) => {
                const col = severityColor(d.severity);
                return (
                  <motion.div
                    key={d.label}
                    className="rounded-md p-1.5 text-center"
                    style={{
                      background: `${col}20`,
                      border: `1px solid ${col}60`,
                    }}
                    animate={{
                      boxShadow:
                        d.severity >= 4
                          ? [
                              `0 0 6px ${col}60`,
                              `0 0 16px ${col}90`,
                              `0 0 6px ${col}60`,
                            ]
                          : `0 0 3px ${col}30`,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.07,
                    }}
                  >
                    <div
                      className="text-xs leading-tight"
                      style={{
                        color: col,
                        fontFamily: "monospace",
                        fontSize: "10px",
                      }}
                    >
                      {d.label}
                    </div>
                    <div
                      className="text-xs font-black"
                      style={{ color: col, fontFamily: "monospace" }}
                    >
                      {"▮".repeat(d.severity)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Top 5 risk cards */}
          <div className="mb-5">
            <div
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#777" }}
            >
              [ TOP 5 HIGH-RISK VILLAGES ]
            </div>
            <div className="flex flex-col gap-2">
              {topRiskVillages.map((v, idx) => (
                <motion.div
                  key={v.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-lg px-4 py-2.5 flex items-center justify-between"
                  style={{
                    background: "rgba(255,255,255,0.80)",
                    borderLeft: `3px solid ${C.moderate}`,
                  }}
                >
                  <div>
                    <span
                      className="font-bold text-sm"
                      style={{ color: "#1A1A1A", fontFamily: "monospace" }}
                    >
                      {v.name}:{" "}
                    </span>
                    <span className="text-sm" style={{ color: C.moderate }}>
                      {v.risk}
                    </span>
                    <span className="text-xs ml-2" style={{ color: "#666" }}>
                      — {v.note}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{ background: `${C.danger}20`, color: C.danger }}
                  >
                    RISK {v.severity}/5
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cascade predictor */}
          <div
            className="rounded-xl p-4 mb-5"
            style={{
              background: "rgba(255,255,255,0.85)",
              border: "1px solid #F0F0F0",
            }}
          >
            <div
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#777" }}
            >
              [ CASCADE PREDICTOR ]
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {cascadeNodes.map((n, i) => (
                <div key={n} className="flex items-center gap-2">
                  <motion.div
                    className="relative w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-center"
                    style={{
                      background:
                        cascadeStep >= i ? `${C.danger}20` : "#F0F0F0",
                      border: `2px solid ${cascadeStep >= i ? C.danger : "#CCC"}`,
                      color: cascadeStep >= i ? C.danger : "#666",
                      fontSize: "9px",
                      fontFamily: "monospace",
                      lineHeight: 1.1,
                    }}
                    animate={
                      cascadeStep >= i
                        ? {
                            boxShadow: [
                              `0 0 8px ${C.danger}60`,
                              `0 0 20px ${C.danger}90`,
                              `0 0 8px ${C.danger}60`,
                            ],
                          }
                        : {}
                    }
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    {n.slice(0, 5)}
                  </motion.div>
                  {i < cascadeNodes.length - 1 && (
                    <motion.div
                      className="w-6 h-0.5"
                      style={{
                        background: cascadeStep > i ? C.danger : "#CCC",
                      }}
                      animate={
                        cascadeStep > i ? { opacity: [0.4, 1, 0.4] } : {}
                      }
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div
              className="text-xs mt-2"
              style={{ color: C.moderate, fontFamily: "monospace" }}
            >
              Cascade: {Math.max(0, cascadeStep + 1)} nodes at risk
            </div>
          </div>

          {/* Demand forecast */}
          <div
            className="rounded-xl p-4 mb-5"
            style={{
              background: "rgba(255,255,255,0.85)",
              border: "1px solid #F0F0F0",
            }}
          >
            <div
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#777" }}
            >
              [ DEMAND FORECAST ]
            </div>
            <div className="flex items-end gap-2 h-24">
              {forecastBars.map((bar, i) => {
                const col =
                  bar.height >= 85
                    ? C.danger
                    : bar.height >= 65
                      ? "#FF6B00"
                      : C.moderate;
                return (
                  <div
                    key={bar.label}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full rounded-t relative"
                      style={{ height: "80px", background: "#F0F0F0" }}
                    >
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 rounded-t"
                        style={{
                          background: `linear-gradient(to top, ${C.moderate}, ${col})`,
                          boxShadow: `0 0 8px ${col}60`,
                        }}
                        initial={{ height: 0 }}
                        animate={{
                          height: forecastAnimated ? `${bar.height}%` : 0,
                        }}
                        transition={{
                          duration: 0.8,
                          delay: i * 0.15,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                    <span
                      className="text-xs"
                      style={{ color: "#666", fontSize: "10px" }}
                    >
                      {bar.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
              style={{
                background: "#F0F0F0",
                color: "#666",
                border: "1px solid #E0E0E0",
              }}
            >
              Close
            </button>
            <motion.button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-xs font-black uppercase tracking-wider"
              style={{ background: C.success, color: "#000" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✓ Act Now
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(content, document.body);
}

function RerouteDrawer({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [time, setTime] = useState(() => new Date().toLocaleTimeString());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  const activeCount = rerouteLog.filter(
    (r) => r.status === "active" || r.status === "satellite",
  ).length;
  const borderCol = {
    active: C.success,
    satellite: C.moderate,
    resolved: "#555",
  };
  const statusLabel = {
    active: "ACTIVE",
    satellite: "SATELLITE",
    resolved: "✓ RESOLVED",
  };
  const statusColMap = {
    active: C.success,
    satellite: C.moderate,
    resolved: "#555",
  };

  const content = (
    <motion.div
      className="flex flex-col overflow-hidden"
      style={{
        position: "fixed",
        top: 56,
        right: 0,
        bottom: 0,
        width: 340,
        zIndex: 99998,
        background: "#FFFFFF",
        borderLeft: `1px solid ${C.success}60`,
      }}
      initial={{ x: 340 }}
      animate={{ x: 0 }}
      exit={{ x: 340 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
            filter: "blur(2px)",
            position: "absolute",
            inset: 0,
          }}
        />
      </div>

      {/* Header */}
      <div
        className="relative z-10 flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor: "#DCFCE7" }}
      >
        <div>
          <motion.span
            className="text-xs font-black uppercase tracking-widest block"
            style={{ color: C.success, fontFamily: "monospace" }}
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            Live Reroutes: {activeCount} Active | Network Holding
          </motion.span>
          <span
            className="text-xs"
            style={{ color: "#777", fontFamily: "monospace" }}
          >
            {time}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
          style={{ background: "#F0FFF4", color: "#666" }}
        >
          ✕
        </button>
      </div>

      {/* Log */}
      <div className="relative z-10 flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
        <AnimatePresence>
          {rerouteLog.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 280 }}
              className="rounded-lg overflow-hidden cursor-pointer"
              onClick={() =>
                setExpanded(expanded === entry.id ? null : entry.id)
              }
              style={{
                background: "rgba(255,255,255,0.90)",
                borderLeft: `3px solid ${borderCol[entry.status]}`,
                boxShadow:
                  entry.status === "satellite"
                    ? `0 0 12px ${C.moderate}40`
                    : "none",
              }}
            >
              <div className="px-3 py-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-xs"
                    style={{ color: "#666", fontFamily: "monospace" }}
                  >
                    {entry.time}
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{
                      color: statusColMap[entry.status],
                      fontFamily: "monospace",
                    }}
                  >
                    {statusLabel[entry.status]}
                  </span>
                </div>
                <div
                  className="text-xs font-bold"
                  style={{ color: "#1A1A1A", fontFamily: "monospace" }}
                >
                  Road Block @ {entry.bridge}
                </div>
                <div className="text-xs" style={{ color: C.success }}>
                  → Reroute via {entry.buddy} (ETA -{entry.etaSaved}min)
                </div>

                {/* Truck animation for active */}
                {entry.status === "active" && (
                  <div
                    className="mt-2 relative h-4 rounded overflow-hidden"
                    style={{ background: "#F0FFF4" }}
                  >
                    <motion.div
                      className="absolute top-0.5 text-xs"
                      style={{ fontSize: "12px" }}
                      animate={{ x: ["0%", "92%"] }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    >
                      🚚
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Expanded detail */}
              <AnimatePresence>
                {expanded === entry.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-3 pb-3 overflow-hidden"
                  >
                    <div
                      className="text-xs pt-2 border-t"
                      style={{ borderColor: "#DCFCE7", color: "#666" }}
                    >
                      <div style={{ color: "#FF6666" }}>
                        ✗ Original: {entry.bridge} — BLOCKED
                      </div>
                      <div style={{ color: C.success }}>
                        ✓ New Path: Via {entry.buddy} Hub (+satellite relay)
                      </div>
                      <div style={{ color: "#666" }}>
                        ETA Improvement: -{entry.etaSaved}min | Fuel: +12%
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  return createPortal(content, document.body);
}

function TruckLayer() {
  const map = useMap();
  const markersRef = useRef<L.Marker[]>([]);
  const trucks = [
    {
      route: [
        [26.33, 91.47],
        [26.32, 91.01],
        [26.22, 90.23],
      ] as [number, number][],
      eta: "2h 15m",
    },
    {
      route: [
        [26.32, 91.01],
        [26.07, 89.95],
        [25.54, 89.87],
      ] as [number, number][],
      eta: "3h 45m",
    },
  ];
  const truckPositions = useRef<number[]>(trucks.map(() => 0));

  useEffect(() => {
    for (let i = 0; i < trucks.length; i++) {
      const truck = trucks[i];
      const icon = L.divIcon({
        html: `<div class="truck-marker">🚚<span class="eta-badge">ETA: ${truck.eta}</span></div>`,
        className: "",
        iconSize: [60, 40],
        iconAnchor: [15, 20],
      });
      const marker = L.marker(truck.route[0], { icon }).addTo(map);
      markersRef.current[i] = marker;
    }
    const interval = setInterval(() => {
      for (let i = 0; i < trucks.length; i++) {
        const truck = trucks[i];
        const pos = truckPositions.current[i];
        const nextPos = (pos + 0.01) % truck.route.length;
        truckPositions.current[i] = nextPos;
        const routeIdx = Math.floor(nextPos);
        const frac = nextPos - routeIdx;
        const p1 = truck.route[routeIdx];
        const p2 = truck.route[Math.min(routeIdx + 1, truck.route.length - 1)];
        const lat = p1[0] + (p2[0] - p1[0]) * frac;
        const lng = p1[1] + (p2[1] - p1[1]) * frac;
        if (markersRef.current[i]) markersRef.current[i].setLatLng([lat, lng]);
      }
    }, 500);
    return () => {
      clearInterval(interval);
      for (const m of markersRef.current) {
        if (m) map.removeLayer(m);
      }
      markersRef.current = [];
    };
  }, [map]);
  return null;
}

export default function MapScreen() {
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [showPredictions, setShowPredictions] = useState(false);
  const [showReroutes, setShowReroutes] = useState(false);
  const [time, setTime] = useState(() => new Date().toLocaleTimeString());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  const routeOptions = (status: string) => {
    if (status === "active")
      return { color: C.success, weight: 3, opacity: 0.8 };
    if (status === "blocked")
      return { color: C.danger, weight: 2, opacity: 0.9, dashArray: "5,5" };
    return { color: C.moderate, weight: 2, opacity: 0.7, dashArray: "10,5" };
  };

  return (
    <main
      className="flex h-[calc(100vh-56px)] overflow-hidden relative"
      style={{ background: "#FAFAFA" }}
    >
      {/* Map */}
      <div className="flex-1 relative" style={{ minWidth: 0 }}>
        <div
          className="absolute top-3 left-3 z-50 flex gap-2"
          style={{ pointerEvents: "none" }}
        >
          <span
            className="text-xs px-2 py-1 rounded font-bold uppercase tracking-wider"
            style={{
              background: "rgba(255,255,255,0.95)",
              color: "#777",
              border: "1px solid #E0E0E0",
            }}
          >
            [ LIVE SITUATION MAP ]
          </span>
          <span
            className="text-xs px-2 py-1 rounded"
            style={{
              background: "rgba(0,0,0,0.7)",
              color: "#777",
              fontFamily: "monospace",
              pointerEvents: "none",
            }}
          >
            {time}
          </span>
        </div>

        {/* Legend */}
        <div
          className="absolute bottom-4 right-4 z-50 rounded-xl p-3 flex flex-col gap-1.5"
          style={{
            background: "rgba(255,255,255,0.95)",
            border: "1px solid #E0E0E0",
            minWidth: "120px",
          }}
        >
          {[
            { color: C.danger, label: "Danger" },
            { color: C.moderate, label: "Moderate" },
            { color: C.success, label: "Safe" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: l.color }}
              />
              <span className="text-xs" style={{ color: "#777" }}>
                {l.label}
              </span>
            </div>
          ))}
        </div>

        <MapContainer
          center={[26.0, 90.5]}
          zoom={8}
          style={{ width: "100%", height: "100%" }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {routes.map((route) => (
            <Polyline
              key={route.id}
              positions={route.coordinates}
              pathOptions={routeOptions(route.status)}
            />
          ))}
          {villages.map((v) => (
            <CircleMarker
              key={v.id}
              center={[v.lat, v.lng]}
              radius={
                v.status === "danger" ? 14 : v.status === "moderate" ? 10 : 8
              }
              pathOptions={{
                color: statusColor[v.status],
                fillColor: statusColor[v.status],
                fillOpacity: 0.7,
                weight: 2,
              }}
              eventHandlers={{ click: () => setSelectedVillage(v) }}
            >
              <Popup>
                <div
                  style={{
                    background: "#FFFFFF",
                    color: "#1a1a1a",
                    padding: "8px",
                    minWidth: "160px",
                    fontFamily: "monospace",
                  }}
                >
                  <div
                    style={{
                      color: statusColor[v.status],
                      fontWeight: "bold",
                      marginBottom: "4px",
                    }}
                  >
                    {v.name}
                  </div>
                  <div>
                    Status:{" "}
                    <span style={{ color: statusColor[v.status] }}>
                      {v.status.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    Supply:{" "}
                    <span style={{ color: C.moderate }}>{v.supplyLevel}%</span>
                  </div>
                  <div>Pop: {v.population.toLocaleString()}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
          <TruckLayer />
        </MapContainer>
      </div>

      {/* Sidebar */}
      <aside
        className="w-80 flex flex-col overflow-hidden relative"
        style={{ background: "#F8F8F8", borderLeft: "1px solid #2A1A1A" }}
      >
        <div
          className="px-4 py-3 border-b flex items-center justify-between"
          style={{ borderColor: "#FFE0E0" }}
        >
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#777" }}
          >
            [ VILLAGE PRIORITY LIST ]
          </span>
          <div className="flex gap-2">
            <motion.button
              type="button"
              onClick={() => setShowPredictions(true)}
              className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider"
              style={{
                background: `${C.moderate}20`,
                color: C.moderate,
                border: `1px solid ${C.moderate}50`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              ◈ PREDICT
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setShowReroutes(!showReroutes)}
              className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider"
              style={{
                background: showReroutes ? `${C.success}30` : `${C.success}10`,
                color: C.success,
                border: `1px solid ${C.success}50`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              ⇄ REROUTES
            </motion.button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {villages
            .sort((a, b) => {
              const o = { danger: 0, moderate: 1, safe: 2 };
              return o[a.status] - o[b.status];
            })
            .map((v, _i) => (
              <motion.div
                key={v.id}
                className="px-4 py-3 border-b cursor-pointer"
                style={{
                  borderColor: "#F0F0F0",
                  background:
                    selectedVillage?.id === v.id
                      ? statusBg[v.status]
                      : "transparent",
                }}
                whileHover={{ background: statusBg[v.status] }}
                onClick={() => setSelectedVillage(v)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{ background: statusColor[v.status] }}
                      animate={
                        v.status === "danger"
                          ? {
                              scale: [1, 1.5, 1],
                              boxShadow: [
                                `0 0 4px ${C.danger}`,
                                `0 0 12px ${C.danger}`,
                                `0 0 4px ${C.danger}`,
                              ],
                            }
                          : {}
                      }
                      transition={{
                        duration: 1.2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                    <span
                      className="text-sm font-bold"
                      style={{ color: "#1A1A1A" }}
                    >
                      {v.name}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded"
                    style={{
                      background: `${statusColor[v.status]}20`,
                      color: statusColor[v.status],
                    }}
                  >
                    {v.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="flex-1 h-1.5 rounded-full"
                    style={{ background: "#F0F0F0" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${v.supplyLevel}%`,
                        background:
                          v.supplyLevel > 60
                            ? C.success
                            : v.supplyLevel > 30
                              ? C.moderate
                              : C.danger,
                      }}
                    />
                  </div>
                  <span
                    className="text-xs w-12 text-right"
                    style={{ color: "#666", fontFamily: "monospace" }}
                  >
                    {v.supplyLevel}%
                  </span>
                </div>
              </motion.div>
            ))}
        </div>

        {selectedVillage && (
          <div
            className="p-4 border-t"
            style={{ borderColor: "#FFE0E0", background: "#FFFFFF" }}
          >
            <div
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: "#777" }}
            >
              [ SELECTED: {selectedVillage.name.toUpperCase()} ]
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Medicine", val: selectedVillage.supplies.medicine },
                { label: "Food", val: selectedVillage.supplies.food },
                { label: "Water", val: selectedVillage.supplies.water },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div
                    className="text-lg font-bold"
                    style={{
                      fontFamily: "monospace",
                      color: s.val < 30 ? C.danger : C.moderate,
                    }}
                  >
                    {s.val}%
                  </div>
                  <div className="text-xs" style={{ color: "#666" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Predictions Modal — portalled to document.body to escape stacking context */}
      <AnimatePresence>
        {showPredictions && (
          <PredictionsModal onClose={() => setShowPredictions(false)} />
        )}
      </AnimatePresence>

      {/* Reroute Drawer — portalled to document.body to escape stacking context */}
      <AnimatePresence>
        {showReroutes && (
          <RerouteDrawer onClose={() => setShowReroutes(false)} />
        )}
      </AnimatePresence>
    </main>
  );
}
