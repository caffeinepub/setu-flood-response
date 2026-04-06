export type VillageStatus = "danger" | "moderate" | "safe";
export type RouteStatus = "active" | "blocked" | "alternative";
export type NodeType =
  | "village-danger"
  | "village-moderate"
  | "warehouse"
  | "hub";
export type EdgeType = "active" | "blocked" | "satellite";

export interface Village {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: VillageStatus;
  supplyLevel: number;
  population: number;
  supplies: { medicine: number; food: number; water: number };
}

export interface Route {
  id: string;
  from: string;
  to: string;
  status: RouteStatus;
  coordinates: [number, number][];
}

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  supplies: { medicine: number; food: number; water: number };
  priority: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  weight: number;
}

export interface DashboardMetrics {
  efficiency: number;
  routeOptimization: number;
  villagesReached: number;
  affectedVillages: number;
  roadsBlocked: number;
  suppliesDelivered: number;
}

export const villages: Village[] = [
  {
    id: "v1",
    name: "Dhubri",
    lat: 26.02,
    lng: 89.98,
    status: "danger",
    supplyLevel: 18,
    population: 4200,
    supplies: { medicine: 15, food: 20, water: 10 },
  },
  {
    id: "v2",
    name: "Bilasipara",
    lat: 26.22,
    lng: 90.23,
    status: "danger",
    supplyLevel: 22,
    population: 3100,
    supplies: { medicine: 20, food: 25, water: 18 },
  },
  {
    id: "v3",
    name: "Golakganj",
    lat: 25.98,
    lng: 89.82,
    status: "danger",
    supplyLevel: 12,
    population: 2800,
    supplies: { medicine: 10, food: 15, water: 8 },
  },
  {
    id: "v4",
    name: "Gauripur",
    lat: 26.07,
    lng: 89.95,
    status: "moderate",
    supplyLevel: 45,
    population: 5600,
    supplies: { medicine: 40, food: 50, water: 45 },
  },
  {
    id: "v5",
    name: "Mankachar",
    lat: 25.54,
    lng: 89.87,
    status: "moderate",
    supplyLevel: 38,
    population: 3400,
    supplies: { medicine: 35, food: 42, water: 38 },
  },
  {
    id: "v6",
    name: "Jogighopa",
    lat: 26.19,
    lng: 91.62,
    status: "moderate",
    supplyLevel: 55,
    population: 6200,
    supplies: { medicine: 50, food: 58, water: 55 },
  },
  {
    id: "v7",
    name: "Barpeta",
    lat: 26.32,
    lng: 91.01,
    status: "moderate",
    supplyLevel: 48,
    population: 7800,
    supplies: { medicine: 45, food: 52, water: 48 },
  },
  {
    id: "v8",
    name: "Kamrup",
    lat: 26.33,
    lng: 91.47,
    status: "safe",
    supplyLevel: 72,
    population: 8900,
    supplies: { medicine: 70, food: 75, water: 72 },
  },
  {
    id: "v9",
    name: "Nalbari",
    lat: 26.44,
    lng: 91.44,
    status: "safe",
    supplyLevel: 80,
    population: 5300,
    supplies: { medicine: 78, food: 82, water: 80 },
  },
  {
    id: "v10",
    name: "Morigaon",
    lat: 26.25,
    lng: 92.34,
    status: "safe",
    supplyLevel: 68,
    population: 4700,
    supplies: { medicine: 65, food: 70, water: 68 },
  },
  {
    id: "v11",
    name: "Nagaon",
    lat: 26.35,
    lng: 92.68,
    status: "safe",
    supplyLevel: 76,
    population: 9200,
    supplies: { medicine: 74, food: 78, water: 76 },
  },
  {
    id: "v12",
    name: "Chapar",
    lat: 26.27,
    lng: 90.05,
    status: "danger",
    supplyLevel: 8,
    population: 2100,
    supplies: { medicine: 5, food: 10, water: 8 },
  },
  {
    id: "v13",
    name: "Srirampur",
    lat: 25.85,
    lng: 89.92,
    status: "moderate",
    supplyLevel: 42,
    population: 1800,
    supplies: { medicine: 38, food: 45, water: 42 },
  },
  {
    id: "v14",
    name: "Fekamari",
    lat: 26.45,
    lng: 90.35,
    status: "danger",
    supplyLevel: 15,
    population: 1500,
    supplies: { medicine: 12, food: 18, water: 15 },
  },
  {
    id: "v15",
    name: "Fakiragram",
    lat: 26.38,
    lng: 90.47,
    status: "moderate",
    supplyLevel: 52,
    population: 3900,
    supplies: { medicine: 48, food: 55, water: 52 },
  },
];

export const routes: Route[] = [
  {
    id: "r1",
    from: "v8",
    to: "v7",
    status: "active",
    coordinates: [
      [26.33, 91.47],
      [26.32, 91.01],
    ],
  },
  {
    id: "r2",
    from: "v7",
    to: "v4",
    status: "active",
    coordinates: [
      [26.32, 91.01],
      [26.07, 89.95],
    ],
  },
  {
    id: "r3",
    from: "v4",
    to: "v1",
    status: "blocked",
    coordinates: [
      [26.07, 89.95],
      [26.02, 89.98],
    ],
  },
  {
    id: "r4",
    from: "v4",
    to: "v3",
    status: "blocked",
    coordinates: [
      [26.07, 89.95],
      [25.98, 89.82],
    ],
  },
  {
    id: "r5",
    from: "v7",
    to: "v6",
    status: "active",
    coordinates: [
      [26.32, 91.01],
      [26.19, 91.62],
    ],
  },
  {
    id: "r6",
    from: "v9",
    to: "v8",
    status: "active",
    coordinates: [
      [26.44, 91.44],
      [26.33, 91.47],
    ],
  },
  {
    id: "r7",
    from: "v7",
    to: "v2",
    status: "alternative",
    coordinates: [
      [26.32, 91.01],
      [26.22, 90.23],
    ],
  },
  {
    id: "r8",
    from: "v4",
    to: "v5",
    status: "alternative",
    coordinates: [
      [26.07, 89.95],
      [25.54, 89.87],
    ],
  },
  {
    id: "r9",
    from: "v2",
    to: "v14",
    status: "active",
    coordinates: [
      [26.22, 90.23],
      [26.45, 90.35],
    ],
  },
  {
    id: "r10",
    from: "v14",
    to: "v12",
    status: "blocked",
    coordinates: [
      [26.45, 90.35],
      [26.27, 90.05],
    ],
  },
];

export const graphNodes: GraphNode[] = [
  {
    id: "n1",
    label: "Dhubri",
    type: "village-danger",
    supplies: { medicine: 15, food: 20, water: 10 },
    priority: "CRITICAL",
  },
  {
    id: "n2",
    label: "Bilasipara",
    type: "village-danger",
    supplies: { medicine: 20, food: 25, water: 18 },
    priority: "CRITICAL",
  },
  {
    id: "n3",
    label: "Golakganj",
    type: "village-danger",
    supplies: { medicine: 10, food: 15, water: 8 },
    priority: "CRITICAL",
  },
  {
    id: "n4",
    label: "Gauripur",
    type: "village-moderate",
    supplies: { medicine: 40, food: 50, water: 45 },
    priority: "HIGH",
  },
  {
    id: "n5",
    label: "Mankachar",
    type: "village-moderate",
    supplies: { medicine: 35, food: 42, water: 38 },
    priority: "HIGH",
  },
  {
    id: "n6",
    label: "Jogighopa",
    type: "village-moderate",
    supplies: { medicine: 50, food: 58, water: 55 },
    priority: "MEDIUM",
  },
  {
    id: "n7",
    label: "Barpeta",
    type: "village-moderate",
    supplies: { medicine: 45, food: 52, water: 48 },
    priority: "MEDIUM",
  },
  {
    id: "n8",
    label: "Kamrup Hub",
    type: "hub",
    supplies: { medicine: 200, food: 300, water: 250 },
    priority: "OPERATIONAL",
  },
  {
    id: "n9",
    label: "Nalbari",
    type: "village-moderate",
    supplies: { medicine: 78, food: 82, water: 80 },
    priority: "LOW",
  },
  {
    id: "n10",
    label: "North Warehouse",
    type: "warehouse",
    supplies: { medicine: 500, food: 800, water: 600 },
    priority: "DEPOT",
  },
  {
    id: "n11",
    label: "South Depot",
    type: "warehouse",
    supplies: { medicine: 400, food: 700, water: 500 },
    priority: "DEPOT",
  },
  {
    id: "n12",
    label: "Chapar",
    type: "village-danger",
    supplies: { medicine: 5, food: 10, water: 8 },
    priority: "CRITICAL",
  },
  {
    id: "n13",
    label: "Srirampur",
    type: "village-moderate",
    supplies: { medicine: 38, food: 45, water: 42 },
    priority: "MEDIUM",
  },
  {
    id: "n14",
    label: "Fekamari",
    type: "village-danger",
    supplies: { medicine: 12, food: 18, water: 15 },
    priority: "CRITICAL",
  },
  {
    id: "n15",
    label: "Air Hub Alpha",
    type: "hub",
    supplies: { medicine: 150, food: 200, water: 180 },
    priority: "AERIAL",
  },
];

export const graphEdges: GraphEdge[] = [
  { id: "e1", source: "n10", target: "n8", type: "active", weight: 5 },
  { id: "e2", source: "n8", target: "n7", type: "active", weight: 4 },
  { id: "e3", source: "n7", target: "n4", type: "active", weight: 3 },
  { id: "e4", source: "n4", target: "n1", type: "blocked", weight: 1 },
  { id: "e5", source: "n4", target: "n3", type: "blocked", weight: 1 },
  { id: "e6", source: "n7", target: "n6", type: "active", weight: 4 },
  { id: "e7", source: "n9", target: "n8", type: "active", weight: 3 },
  { id: "e8", source: "n7", target: "n2", type: "active", weight: 3 },
  { id: "e9", source: "n4", target: "n5", type: "active", weight: 2 },
  { id: "e10", source: "n2", target: "n14", type: "active", weight: 2 },
  { id: "e11", source: "n14", target: "n12", type: "blocked", weight: 1 },
  { id: "e12", source: "n11", target: "n5", type: "active", weight: 3 },
  { id: "e13", source: "n11", target: "n13", type: "active", weight: 2 },
  { id: "e14", source: "n15", target: "n1", type: "satellite", weight: 2 },
  { id: "e15", source: "n15", target: "n3", type: "satellite", weight: 2 },
  { id: "e16", source: "n15", target: "n12", type: "satellite", weight: 2 },
  { id: "e17", source: "n8", target: "n9", type: "active", weight: 4 },
  { id: "e18", source: "n6", target: "n13", type: "active", weight: 3 },
  { id: "e19", source: "n10", target: "n15", type: "satellite", weight: 3 },
  { id: "e20", source: "n2", target: "n4", type: "active", weight: 3 },
];

export const initialHeatmap: number[][] = [
  [90, 80, 45, 30, 20],
  [85, 75, 55, 25, 15],
  [70, 60, 50, 35, 10],
  [40, 50, 45, 60, 70],
  [20, 30, 40, 75, 85],
];

export const dashboardMetrics: DashboardMetrics = {
  efficiency: 78,
  routeOptimization: 65,
  villagesReached: 9,
  affectedVillages: 12,
  roadsBlocked: 4,
  suppliesDelivered: 847,
};

export const supplyDeliveryData = [
  { day: "Mon", delivered: 120 },
  { day: "Tue", delivered: 185 },
  { day: "Wed", delivered: 210 },
  { day: "Thu", delivered: 165 },
  { day: "Fri", delivered: 167 },
];
