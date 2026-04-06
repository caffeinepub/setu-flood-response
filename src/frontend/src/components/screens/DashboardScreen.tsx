import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  dashboardMetrics,
  supplyDeliveryData,
  villages,
} from "../../data/mockData";

const C = { danger: "#FF1744", moderate: "#FFEA00", success: "#00E676" };

interface RequestCard {
  id: string;
  village: string;
  requestType: "medicine" | "food" | "blankets" | "water";
  waitMinutes: number;
  urgencyLevel: "critical" | "high" | "moderate";
  status: "pending" | "approved" | "sent";
}

const initialCards: RequestCard[] = [
  {
    id: "c1",
    village: "Dhubri",
    requestType: "medicine",
    waitMinutes: 45,
    urgencyLevel: "critical",
    status: "pending",
  },
  {
    id: "c2",
    village: "Bilasipara",
    requestType: "medicine",
    waitMinutes: 38,
    urgencyLevel: "critical",
    status: "pending",
  },
  {
    id: "c3",
    village: "Jogighopa",
    requestType: "medicine",
    waitMinutes: 55,
    urgencyLevel: "critical",
    status: "pending",
  },
  {
    id: "c4",
    village: "Golakganj",
    requestType: "food",
    waitMinutes: 22,
    urgencyLevel: "high",
    status: "pending",
  },
  {
    id: "c5",
    village: "Chapar",
    requestType: "blankets",
    waitMinutes: 18,
    urgencyLevel: "high",
    status: "pending",
  },
  {
    id: "c6",
    village: "Gauripur",
    requestType: "medicine",
    waitMinutes: 12,
    urgencyLevel: "high",
    status: "pending",
  },
  {
    id: "c7",
    village: "Barpeta",
    requestType: "blankets",
    waitMinutes: 30,
    urgencyLevel: "high",
    status: "pending",
  },
  {
    id: "c8",
    village: "Kamrup",
    requestType: "blankets",
    waitMinutes: 25,
    urgencyLevel: "high",
    status: "pending",
  },
  {
    id: "c9",
    village: "Mankachar",
    requestType: "food",
    waitMinutes: 8,
    urgencyLevel: "moderate",
    status: "pending",
  },
  {
    id: "c10",
    village: "Fekamari",
    requestType: "water",
    waitMinutes: 6,
    urgencyLevel: "moderate",
    status: "pending",
  },
  {
    id: "c11",
    village: "Srirampur",
    requestType: "food",
    waitMinutes: 15,
    urgencyLevel: "moderate",
    status: "pending",
  },
  {
    id: "c12",
    village: "Nalbari",
    requestType: "food",
    waitMinutes: 3,
    urgencyLevel: "moderate",
    status: "pending",
  },
];

function urgencySort(a: RequestCard, b: RequestCard): number {
  if (a.status !== "pending" && b.status === "pending") return 1;
  if (a.status === "pending" && b.status !== "pending") return -1;
  const lvl = { critical: 0, high: 1, moderate: 2 };
  if (lvl[a.urgencyLevel] !== lvl[b.urgencyLevel])
    return lvl[a.urgencyLevel] - lvl[b.urgencyLevel];
  if (a.requestType === "medicine" && b.requestType !== "medicine") return -1;
  if (a.requestType !== "medicine" && b.requestType === "medicine") return 1;
  return b.waitMinutes - a.waitMinutes;
}

function ArcGauge({
  value,
  max = 100,
  title,
  color,
}: { value: number; max?: number; title: string; color: string }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = 70;
  const circumference = Math.PI * radius;
  const pct = animatedValue / max;
  const offset = circumference * (1 - pct);
  useEffect(() => {
    const t = setTimeout(() => setAnimatedValue(value), 200);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="text-xs font-bold uppercase tracking-widest text-center"
        style={{ color: "#555" }}
      >
        {title}
      </div>
      <div className="relative" style={{ width: 160, height: 90 }}>
        <svg
          width={160}
          height={90}
          viewBox="0 0 160 90"
          overflow="visible"
          role="img"
          aria-label={title}
        >
          <path
            d="M 10 80 A 70 70 0 0 1 150 80"
            fill="none"
            stroke="#E8E8E8"
            strokeWidth={12}
            strokeLinecap="round"
          />
          <motion.path
            d="M 10 80 A 70 70 0 0 1 150 80"
            fill="none"
            stroke={color}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
          <text
            x={80}
            y={72}
            textAnchor="middle"
            fill={color}
            fontSize={22}
            fontFamily="monospace"
            fontWeight="bold"
          >
            {animatedValue}
          </text>
          <text x={80} y={85} textAnchor="middle" fill="#999" fontSize={9}>
            / {max}
          </text>
        </svg>
      </div>
    </div>
  );
}

function PriorityQueueTab() {
  const [cards, setCards] = useState<RequestCard[]>(initialCards);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [time, setTime] = useState(() => new Date().toLocaleTimeString());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Urgency decay tick every 30s
  useEffect(() => {
    const tick = setInterval(() => {
      setCards((prev) =>
        prev.map((card) => {
          if (card.status !== "pending") return card;
          const bump = Math.floor(Math.random() * 4) + 2;
          const newWait = card.waitMinutes + bump;
          let newUrgency = card.urgencyLevel;
          if (newWait > 40 && card.urgencyLevel === "high")
            newUrgency = "critical";
          if (newWait > 30 && card.urgencyLevel === "moderate")
            newUrgency = "high";
          return { ...card, waitMinutes: newWait, urgencyLevel: newUrgency };
        }),
      );
    }, 30000);
    return () => clearInterval(tick);
  }, []);

  const approve = useCallback((id: string) => {
    setSentIds((prev) => new Set([...prev, id]));
    setTimeout(() => {
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "sent" } : c)),
      );
    }, 800);
  }, []);

  const sorted = [...cards].sort(urgencySort);
  const criticalCount = cards.filter(
    (c) => c.urgencyLevel === "critical" && c.status === "pending",
  ).length;

  const cardBg: Record<string, string> = {
    critical: "rgba(255,23,68,0.12)",
    high: "rgba(255,234,0,0.08)",
    moderate: "rgba(0,230,118,0.05)",
  };
  const cardBorder: Record<string, string> = {
    critical: `1px solid ${C.danger}60`,
    high: `1px solid ${C.moderate}50`,
    moderate: `1px solid ${C.success}40`,
  };
  const dotColor: Record<string, string> = {
    critical: C.danger,
    high: C.moderate,
    moderate: C.success,
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url('/assets/generated/flood-village-bg.dim_1920x1080.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15,
          filter: "blur(2px)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,23,68,0.08) 0%, rgba(255,234,0,0.05) 100%)",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div
        className="relative z-10 flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "#FFE0E0" }}
      >
        <motion.span
          className="text-sm font-black uppercase tracking-widest"
          style={{ color: C.danger, fontFamily: "monospace" }}
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          Priority Queue: {criticalCount} Urgent | Medicine First
        </motion.span>
        <span
          className="text-xs"
          style={{ color: "#555", fontFamily: "monospace" }}
        >
          {time}
        </span>
      </div>

      {/* Cards */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
        <AnimatePresence>
          {sorted.map((card) => (
            <motion.div
              key={card.id}
              layout
              layoutId={card.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: card.status === "sent" ? 0.4 : 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="rounded-lg px-4 py-3 flex items-center gap-3"
              style={{
                background: cardBg[card.urgencyLevel],
                border: cardBorder[card.urgencyLevel],
              }}
            >
              {/* Status dot */}
              <motion.div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{
                  background: dotColor[card.urgencyLevel],
                  boxShadow: `0 0 8px ${dotColor[card.urgencyLevel]}`,
                }}
                animate={
                  card.urgencyLevel === "critical"
                    ? {
                        scale: [1, 1.4, 1],
                        boxShadow: [
                          `0 0 8px ${C.danger}`,
                          `0 0 20px ${C.danger}`,
                          `0 0 8px ${C.danger}`,
                        ],
                      }
                    : {}
                }
                transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm font-bold"
                  style={{ color: "#1A1A1A", fontFamily: "monospace" }}
                >
                  {card.village}:{" "}
                  <span
                    style={{
                      color:
                        card.requestType === "medicine"
                          ? C.danger
                          : card.requestType === "food"
                            ? C.moderate
                            : C.success,
                    }}
                  >
                    {card.requestType.toUpperCase()}
                  </span>{" "}
                  <span style={{ color: "#666" }}>
                    — {card.waitMinutes}min wait
                  </span>{" "}
                  <span
                    className="font-black text-xs"
                    style={{ color: dotColor[card.urgencyLevel] }}
                  >
                    → {card.urgencyLevel.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Timer */}
              <div
                className="text-xs font-bold flex-shrink-0"
                style={{
                  fontFamily: "monospace",
                  color: dotColor[card.urgencyLevel],
                }}
              >
                {Math.floor(card.waitMinutes / 60) > 0
                  ? `${Math.floor(card.waitMinutes / 60)}h `
                  : ""}
                {card.waitMinutes % 60}m
              </div>

              {/* Approve button */}
              {card.status === "pending" && (
                <motion.button
                  type="button"
                  onClick={() => approve(card.id)}
                  className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg cursor-pointer"
                  style={{
                    background: `${C.success}20`,
                    border: `1px solid ${C.success}60`,
                  }}
                  whileHover={{ scale: 1.1, background: `${C.success}40` }}
                  whileTap={{ scale: 0.9 }}
                >
                  {sentIds.has(card.id) ? (
                    <span style={{ color: C.success }}>✓</span>
                  ) : (
                    "🚚"
                  )}
                </motion.button>
              )}
              {card.status === "sent" && (
                <span
                  className="flex-shrink-0 text-sm"
                  style={{ color: C.success }}
                >
                  ✓ SENT
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function DashboardScreen() {
  const [tab, setTab] = useState<"operations" | "queue">("operations");
  const [showConfetti, setShowConfetti] = useState(false);
  const [time, setTime] = useState(() => new Date().toLocaleTimeString());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (dashboardMetrics.efficiency > 75) {
      const timer = setTimeout(() => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const gaugeColor = (v: number) =>
    v >= 70 ? C.success : v >= 40 ? C.moderate : C.danger;
  const statusColor: Record<string, string> = {
    danger: C.danger,
    moderate: C.moderate,
    safe: C.success,
  };
  const confettiItems = Array.from({ length: 14 }, (_, i) => ({
    id: `c-${i}`,
    left: `${10 + i * 6}%`,
    color: i % 3 === 0 ? C.success : i % 3 === 1 ? C.moderate : C.danger,
    dx: (i % 2 === 0 ? 1 : -1) * (20 + i * 3),
    dy: 180 + i * 8,
  }));

  const heatmapCells = [
    { label: "Dhubri", severity: "danger" },
    { label: "Bilasipara", severity: "danger" },
    { label: "Golakganj", severity: "danger" },
    { label: "Chapar", severity: "danger" },
    { label: "Gauripur", severity: "moderate" },
    { label: "Mankachar", severity: "moderate" },
    { label: "Barpeta", severity: "moderate" },
    { label: "Fekamari", severity: "danger" },
    { label: "Jogighopa", severity: "moderate" },
    { label: "Nalbari", severity: "safe" },
    { label: "Kamrup", severity: "safe" },
    { label: "Nagaon", severity: "safe" },
    { label: "Fakiragram", severity: "moderate" },
    { label: "Srirampur", severity: "moderate" },
    { label: "Morigaon", severity: "safe" },
    { label: "Air Hub", severity: "safe" },
  ];

  return (
    <main
      className="relative min-h-[calc(100vh-56px)] overflow-x-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, rgba(42,11,11,0.4) 0%, #0a0a0a 60%)",
      }}
    >
      {/* Blurred bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url('/assets/generated/flood-village-bg.dim_1920x1080.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15,
          filter: "blur(2px)",
          zIndex: 0,
        }}
      />

      {/* Confetti */}
      {showConfetti &&
        confettiItems.map((c) => (
          <motion.div
            key={c.id}
            className="fixed pointer-events-none rounded-full"
            style={{
              width: 8,
              height: 8,
              left: c.left,
              top: "10%",
              background: c.color,
              zIndex: 200,
            }}
            animate={{
              y: [0, c.dy],
              x: [0, c.dx],
              rotate: [0, 720],
              opacity: [1, 0],
            }}
            transition={{ duration: 2.5, ease: "easeIn" }}
          />
        ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#555" }}
          >
            [ OPERATIONS DASHBOARD ]
          </span>
          <span
            className="text-xs"
            style={{ fontFamily: "monospace", color: "#555" }}
          >
            LIVE: {time}
          </span>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-6">
          {(["operations", "queue"] as const).map((t) => (
            <motion.button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
              style={{
                background:
                  tab === t
                    ? t === "queue"
                      ? C.danger
                      : C.success
                    : "#F5F5F5",
                color: tab === t ? "#000" : "#888",
                border: tab === t ? "none" : "1px solid #E0E0E0",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {t === "operations" ? "Operations" : "⚠ Priority Queue"}
            </motion.button>
          ))}
        </div>

        {tab === "queue" ? (
          <div style={{ height: "calc(100vh - 200px)" }}>
            <PriorityQueueTab />
          </div>
        ) : (
          <>
            {/* Arc Gauges */}
            <div
              className="rounded-xl p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E8E8",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <ArcGauge
                value={dashboardMetrics.efficiency}
                title="Efficiency Score"
                color={gaugeColor(dashboardMetrics.efficiency)}
              />
              <ArcGauge
                value={dashboardMetrics.routeOptimization}
                title="Route Optimization %"
                color={gaugeColor(dashboardMetrics.routeOptimization)}
              />
              <ArcGauge
                value={dashboardMetrics.villagesReached}
                max={15}
                title="Villages Reached"
                color={gaugeColor(
                  (dashboardMetrics.villagesReached / 15) * 100,
                )}
              />
            </div>

            {/* Counters */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                {
                  target: dashboardMetrics.affectedVillages,
                  label: "Affected Villages",
                  color: C.danger,
                },
                {
                  target: dashboardMetrics.roadsBlocked,
                  label: "Roads Blocked",
                  color: C.moderate,
                },
                {
                  target: dashboardMetrics.suppliesDelivered,
                  label: "Supplies Delivered",
                  color: C.success,
                },
              ].map(({ target, label, color }) => (
                <div
                  key={label}
                  className="rounded-xl p-5 flex flex-col items-center gap-1 text-center"
                  style={{
                    background: "#FFFFFF",
                    border: `1px solid ${color}40`,
                    boxShadow: `0 0 15px ${color}20`,
                  }}
                >
                  <div
                    className="text-4xl font-black"
                    style={{ fontFamily: "monospace", color }}
                  >
                    {target.toLocaleString()}
                  </div>
                  <div
                    className="text-xs uppercase tracking-widest"
                    style={{ color: "#666" }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Bar chart */}
            <div
              className="rounded-xl p-5 mb-6"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E8E8",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "#555" }}
              >
                [ SUPPLY DELIVERY — DAILY ]
              </div>
              <div className="flex items-end gap-3 h-32">
                {supplyDeliveryData.map((d, i) => {
                  const maxVal = Math.max(
                    ...supplyDeliveryData.map((x) => x.delivered),
                  );
                  const heightPct = d.delivered / maxVal;
                  const color =
                    i === supplyDeliveryData.length - 1
                      ? C.danger
                      : i >= 2
                        ? C.moderate
                        : C.success;
                  return (
                    <div
                      key={d.day}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <span
                        className="text-xs"
                        style={{ fontFamily: "monospace", color }}
                      >
                        {d.delivered}
                      </span>
                      <div
                        className="w-full rounded-t"
                        style={{
                          height: "100px",
                          background: "#F0F0F0",
                          position: "relative",
                        }}
                      >
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 rounded-t"
                          style={{
                            background: color,
                            boxShadow: `0 0 8px ${color}60`,
                          }}
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPct * 100}%` }}
                          transition={{
                            duration: 0.8,
                            delay: i * 0.1,
                            ease: "easeOut",
                          }}
                        />
                      </div>
                      <span className="text-xs" style={{ color: "#555" }}>
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Village table */}
            <div
              className="rounded-xl overflow-hidden mb-6"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E8E8",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="px-5 py-3 border-b"
                style={{ borderColor: "#F0F0F0" }}
              >
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "#555" }}
                >
                  [ VILLAGE STATUS TABLE ]
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #F0F0F0" }}>
                      {[
                        "Village",
                        "Status",
                        "Supply %",
                        "Pop",
                        "Last Updated",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider"
                          style={{ color: "#666" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {villages.map((v, i) => (
                      <motion.tr
                        key={v.id}
                        style={{
                          background:
                            v.status === "danger"
                              ? "rgba(255,23,68,0.05)"
                              : v.status === "moderate"
                                ? "rgba(255,234,0,0.05)"
                                : "rgba(0,230,118,0.05)",
                          borderBottom: "1px solid #1A1010",
                        }}
                        whileHover={{
                          background:
                            v.status === "danger"
                              ? "rgba(255,23,68,0.12)"
                              : v.status === "moderate"
                                ? "rgba(255,234,0,0.12)"
                                : "rgba(0,230,118,0.12)",
                        }}
                      >
                        <td
                          className="px-4 py-2.5 font-bold"
                          style={{ color: "#1A1A1A" }}
                        >
                          {v.name}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded"
                            style={{
                              background: `${statusColor[v.status]}20`,
                              color: statusColor[v.status],
                            }}
                          >
                            {v.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            style={{
                              fontFamily: "monospace",
                              color:
                                v.supplyLevel < 30
                                  ? C.danger
                                  : v.supplyLevel < 60
                                    ? C.moderate
                                    : C.success,
                            }}
                          >
                            {v.supplyLevel}%
                          </span>
                        </td>
                        <td
                          className="px-4 py-2.5"
                          style={{ fontFamily: "monospace", color: "#666" }}
                        >
                          {v.population.toLocaleString()}
                        </td>
                        <td
                          className="px-4 py-2.5 text-xs"
                          style={{ color: "#555" }}
                        >
                          {new Date(
                            Date.now() - i * 180000,
                          ).toLocaleTimeString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Heatmap grid */}
            <div
              className="rounded-xl p-5"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E8E8",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "#555" }}
              >
                [ REGIONAL SEVERITY HEATMAP ]
              </div>
              <div className="grid grid-cols-4 gap-2">
                {heatmapCells.map((cell, i) => {
                  const color = statusColor[cell.severity] ?? C.success;
                  return (
                    <motion.div
                      key={cell.label}
                      className="rounded-lg p-2 flex items-center justify-center text-center"
                      style={{
                        background: `${color}15`,
                        border: `1px solid ${color}50`,
                        minHeight: "52px",
                      }}
                      animate={{
                        boxShadow:
                          cell.severity === "danger"
                            ? [
                                `0 0 8px ${color}60`,
                                `0 0 18px ${color}90`,
                                `0 0 8px ${color}60`,
                              ]
                            : `0 0 4px ${color}30`,
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.08,
                      }}
                    >
                      <span
                        className="text-xs"
                        style={{ color, fontFamily: "monospace" }}
                      >
                        {cell.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
