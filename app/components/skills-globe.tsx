"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";

type BaseNode = {
  label: string;
  short: string;
  color: string;
  x: number;
  y: number;
  z: number;
};

type ProjectedNode = BaseNode & {
  screenX: number;
  screenY: number;
  scale: number;
  alpha: number;
  depth: number;
};

type LightningBolt = {
  id: string;
  points: { x: number; y: number }[];
  branches: { x: number; y: number }[][];
  color: string;
  alpha: number;
  width: number;
};

type AcceleratorArc = {
  id: string;
  d: string;
  rotation: number;
  color: string;
  alpha: number;
  width: number;
  dashArray: string;
  dashOffset: number;
};

type OverlayState = {
  projectedSkills: ProjectedNode[];
  projectedLattice: ProjectedNode[];
  lightningBolts: LightningBolt[];
  acceleratorArcs: AcceleratorArc[];
  reactorPhase: number;
};

const RAW_SKILLS = [
  { label: "TypeScript", short: "TS", color: "#3178c6", phi: 0.42, theta: 0.18 },
  { label: "JavaScript", short: "JS", color: "#d7b92b", phi: 0.88, theta: 1.28 },
  { label: "React", short: "RE", color: "#61dafb", phi: 1.32, theta: 2.24 },
  { label: "Next.js", short: "NX", color: "#d8d8d8", phi: 1.7, theta: 0.84 },
  { label: "Tailwind", short: "TW", color: "#44c3f4", phi: 2.1, theta: 2.92 },
  { label: "Node.js", short: "ND", color: "#78b657", phi: 2.46, theta: 1.82 },
  { label: "Python", short: "PY", color: "#8fb5ff", phi: 1.08, theta: 3.58 },
  { label: "Git", short: "GT", color: "#f26a3d", phi: 2.74, theta: 4.12 },
  { label: "GitHub", short: "GH", color: "#cfd3dc", phi: 0.98, theta: 4.78 },
  { label: "PostgreSQL", short: "PG", color: "#7296d1", phi: 1.96, theta: 5.28 },
  { label: "Docker", short: "DK", color: "#4d9fff", phi: 2.4, theta: 5.82 },
  { label: "HTML", short: "HT", color: "#e46d43", phi: 0.56, theta: 5.54 },
  { label: "CSS", short: "CS", color: "#5b8df1", phi: 1.22, theta: 6.02 },
  { label: "Operating Systems", short: "OS", color: "#9aa3b2", phi: 2.72, theta: 0.54 },
] as const;

const SPHERE_RADIUS = 184;
const PROJECTION_DISTANCE = 430;

const BASE_AUTO_VELOCITY_X = 0.0028;
const BASE_AUTO_VELOCITY_Y = -0.0036;

const MIN_SPEED = 1;
const MAX_SPEED = 50;

const VIEWBOX_WIDTH = 864;
const VIEWBOX_HEIGHT = 608;
const CENTER_X = VIEWBOX_WIDTH / 2;
const CENTER_Y = VIEWBOX_HEIGHT / 2;

const GLOBE_SCENE_WIDTH = 864;
const GLOBE_SCENE_HEIGHT = 608;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function polarToCartesian(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  angle: number
) {
  return {
    x: cx + Math.cos(angle) * rx,
    y: cy + Math.sin(angle) * ry,
  };
}

function createEllipseArcPath(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, rx, ry, startAngle);
  const end = polarToCartesian(cx, cy, rx, ry, endAngle);
  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

  return `M ${start.x} ${start.y} A ${rx} ${ry} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

function createSkillNodes(): BaseNode[] {
  return RAW_SKILLS.map((skill) => {
    const sinPhi = Math.sin(skill.phi);

    return {
      label: skill.label,
      short: skill.short,
      color: skill.color,
      x: SPHERE_RADIUS * sinPhi * Math.cos(skill.theta),
      y: SPHERE_RADIUS * Math.cos(skill.phi),
      z: SPHERE_RADIUS * sinPhi * Math.sin(skill.theta),
    };
  });
}

function createLattice() {
  const ringCounts = [8, 12, 16, 18, 16, 12, 8];
  const nodes: BaseNode[] = [];
  const rings: number[][] = [];

  ringCounts.forEach((count, ringIndex) => {
    const phi = 0.34 + (ringIndex / (ringCounts.length - 1)) * (Math.PI - 0.68);
    const sinPhi = Math.sin(phi);
    const currentRing: number[] = [];

    for (let index = 0; index < count; index += 1) {
      const theta =
        (Math.PI * 2 * index) / count + (ringIndex % 2 === 0 ? 0.18 : 0);

      currentRing.push(nodes.length);
      nodes.push({
        label: "",
        short: "",
        color: "#8f92ff",
        x: SPHERE_RADIUS * sinPhi * Math.cos(theta),
        y: SPHERE_RADIUS * Math.cos(phi),
        z: SPHERE_RADIUS * sinPhi * Math.sin(theta),
      });
    }

    rings.push(currentRing);
  });

  const edges = new Set<string>();

  const addEdge = (a: number, b: number) => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    edges.add(key);
  };

  rings.forEach((ring) => {
    ring.forEach((nodeIndex, index) => {
      addEdge(nodeIndex, ring[(index + 1) % ring.length]);
      addEdge(nodeIndex, ring[(index + 2) % ring.length]);
    });
  });

  for (let ring = 0; ring < rings.length - 1; ring += 1) {
    const current = rings[ring];
    const next = rings[ring + 1];

    current.forEach((nodeIndex, index) => {
      const ratio = index / current.length;
      const mapped = ratio * next.length;
      const lower = Math.floor(mapped) % next.length;
      const upper = Math.ceil(mapped) % next.length;
      const nextNeighbor = (lower + 1) % next.length;

      addEdge(nodeIndex, next[lower]);
      addEdge(nodeIndex, next[upper]);
      addEdge(nodeIndex, next[nextNeighbor]);
    });
  }

  return {
    nodes,
    edges: Array.from(edges).map((edge) => {
      const [from, to] = edge.split("-").map(Number);
      return { from, to };
    }),
  };
}

function projectNode(
  node: BaseNode,
  rotationX: number,
  rotationY: number
): ProjectedNode {
  const cosY = Math.cos(rotationY);
  const sinY = Math.sin(rotationY);
  const cosX = Math.cos(rotationX);
  const sinX = Math.sin(rotationX);

  const rotatedX = node.x * cosY - node.z * sinY;
  const rotatedZ = node.x * sinY + node.z * cosY;
  const rotatedY = node.y * cosX - rotatedZ * sinX;
  const finalZ = node.y * sinX + rotatedZ * cosX;

  const perspective = PROJECTION_DISTANCE / (PROJECTION_DISTANCE - finalZ);
  const depth = (finalZ + SPHERE_RADIUS) / (SPHERE_RADIUS * 2);

  return {
    ...node,
    screenX: rotatedX * perspective,
    screenY: rotatedY * perspective,
    scale: 0.58 + depth * 0.82,
    alpha: 0.2 + depth * 0.92,
    depth,
  };
}

function createLightningPath(
  from: { x: number; y: number },
  to: { x: number; y: number },
  seed: number,
  chaos: number
) {
  const points: { x: number; y: number }[] = [];
  const segments = 7 + Math.floor(chaos * 5);

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;

  const nx = -dy / len;
  const ny = dx / len;

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const edgeFade = Math.sin(Math.PI * t);
    const spread = (5 + chaos * 18) * edgeFade;

    const wave =
      Math.sin(seed * 2.2 + t * 8.5) * 0.5 +
      Math.sin(seed * 1.4 + t * 16.4) * 0.33 +
      Math.sin(seed * 0.74 + t * 27.5) * 0.17;

    const jitter = wave * spread;

    points.push({
      x: lerp(from.x, to.x, t) + nx * jitter,
      y: lerp(from.y, to.y, t) + ny * jitter,
    });
  }

  return points;
}

function buildLightningBolts(
  projectedLattice: ProjectedNode[],
  speed: number,
  chaos: number,
  rotationSeed: number
): LightningBolt[] {
  if (speed < 18 || projectedLattice.length === 0) return [];

  const frontNodes = projectedLattice.filter((node) => node.depth > 0.5);
  if (frontNodes.length < 5) return [];

  const boltCount = Math.min(9, Math.max(2, Math.floor((speed - 12) / 4)));
  const bolts: LightningBolt[] = [];

  for (let i = 0; i < boltCount; i += 1) {
    const aIndex = Math.floor(
      Math.abs(Math.sin(rotationSeed * 0.83 + i * 1.71)) * frontNodes.length
    );
    const a = frontNodes[aIndex];
    if (!a) continue;

    let best: ProjectedNode | null = null;
    let bestScore = -Infinity;

    for (const candidate of frontNodes) {
      if (candidate === a) continue;

      const d = distance(
        { x: a.screenX, y: a.screenY },
        { x: candidate.screenX, y: candidate.screenY }
      );

      if (d < 55 || d > 240) continue;

      const preferred = lerp(90, 180, chaos);
      const score =
        -Math.abs(d - preferred) +
        candidate.depth * 38 +
        Math.sin(rotationSeed * 1.35 + d * 0.013 + i * 0.7) * 12;

      if (score > bestScore) {
        bestScore = score;
        best = candidate;
      }
    }

    if (!best) continue;

    const seed = rotationSeed + i * 0.618;
    const points = createLightningPath(
      { x: a.screenX, y: a.screenY },
      { x: best.screenX, y: best.screenY },
      seed,
      chaos
    );

    const branches: { x: number; y: number }[][] = [];
    const branchCount = chaos > 0.72 ? 3 : chaos > 0.38 ? 2 : 1;

    for (let branchIndex = 0; branchIndex < branchCount; branchIndex += 1) {
      const pivotIndex = Math.floor(
        points.length * lerp(0.24, 0.76, (branchIndex + 1) / (branchCount + 1))
      );
      const pivot = points[pivotIndex];
      if (!pivot) continue;

      const angle = seed * (1.45 + branchIndex * 0.34) + branchIndex * 1.15;
      const branchTarget = {
        x: pivot.x + Math.cos(angle) * lerp(18, 42, chaos),
        y: pivot.y + Math.sin(angle) * lerp(16, 34, chaos),
      };

      branches.push(
        createLightningPath(
          pivot,
          branchTarget,
          seed + 1.8 + branchIndex,
          Math.max(0.25, chaos * 0.72)
        )
      );
    }

    bolts.push({
      id: `bolt-${i}`,
      points,
      branches,
      color:
        i % 4 === 0
          ? "#ffffff"
          : i % 4 === 1
          ? "#c4d3ff"
          : i % 4 === 2
          ? "#8cf0ff"
          : "#9ab3ff",
      alpha: 0.24 + chaos * 0.52,
      width: 1.05 + chaos * 1.45,
    });
  }

  return bolts;
}

function buildAcceleratorArcs(
  speed: number,
  rotationSeed: number
): AcceleratorArc[] {
  if (speed < 26) return [];

  const energy = clamp((speed - 26) / 24, 0, 1);
  const count = 2 + Math.round(energy * 2);

  const arcs: AcceleratorArc[] = [];

  for (let i = 0; i < count; i += 1) {
    const rx = 214 + i * 14 + Math.sin(rotationSeed * 0.7 + i) * 6;
    const ry = 90 + i * 10 + Math.cos(rotationSeed * 0.9 + i * 0.5) * 5;
    const start = rotationSeed * 1.5 + i * 0.88;
    const sweep = lerp(0.55, 1.18, energy) + Math.sin(rotationSeed + i) * 0.06;

    arcs.push({
      id: `arc-${i}`,
      d: createEllipseArcPath(CENTER_X, CENTER_Y, rx, ry, start, start + sweep),
      rotation: rotationSeed * 18 + i * (180 / count) + Math.sin(rotationSeed + i) * 6,
      color: i % 3 === 0 ? "#ffffff" : i % 3 === 1 ? "#9eb4ff" : "#76dcff",
      alpha: lerp(0.06, 0.15, energy) * (1 - i * 0.1),
      width: lerp(1, 1.8, energy) - i * 0.06,
      dashArray: `${lerp(34, 18, energy)} ${lerp(84, 34, energy)}`,
      dashOffset: ((rotationSeed * 160 * (i % 2 === 0 ? 1 : -1)) % 240) - 120,
    });
  }

  return arcs;
}

const GlobeOverlay = memo(function GlobeOverlay({
  overlay,
  edges,
  speed,
}: {
  overlay: OverlayState;
  edges: { from: number; to: number }[];
  speed: number;
}) {
  const {
    projectedSkills,
    projectedLattice,
    lightningBolts,
    acceleratorArcs,
    reactorPhase,
  } = overlay;

  const hideLabel = speed > 18;
  const compressBadges = speed > 34;
  const reactorEnergy = clamp((speed - 16) / 34, 0, 1);
  const pulse = 0.88 + ((Math.sin(reactorPhase * 2.2) + 1) / 2) * 0.42 * reactorEnergy;

  return (
    <>
      <svg
        className="pointer-events-none absolute inset-0 overflow-visible"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        fill="none"
      >
        <defs>
          <radialGradient id="reactor-core-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="18%" stopColor="#dce7ff" stopOpacity="0.95" />
            <stop offset="42%" stopColor="#8dc7ff" stopOpacity="0.58" />
            <stop offset="72%" stopColor="#4f76ff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#4f76ff" stopOpacity="0" />
          </radialGradient>

          <filter id="lightning-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="arc-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="core-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="18" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={(44 + reactorEnergy * 22) * pulse}
          fill="url(#reactor-core-gradient)"
          opacity={0.18 + reactorEnergy * 0.14}
          filter="url(#core-glow)"
        />
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={(82 + reactorEnergy * 30) * pulse}
          fill="url(#reactor-core-gradient)"
          opacity={0.07 + reactorEnergy * 0.08}
          filter="url(#core-glow)"
        />

        <g transform={`rotate(${reactorPhase * 16} ${CENTER_X} ${CENTER_Y})`}>
          <ellipse
            cx={CENTER_X}
            cy={CENTER_Y}
            rx={128 + reactorEnergy * 14}
            ry={42 + reactorEnergy * 6}
            stroke="rgba(176, 197, 255, 0.42)"
            strokeOpacity={0.1 + reactorEnergy * 0.12}
            strokeWidth={1.1 + reactorEnergy * 0.8}
            filter="url(#arc-glow)"
          />
        </g>

        <g transform={`rotate(${-reactorPhase * 12 + 70} ${CENTER_X} ${CENTER_Y})`}>
          <ellipse
            cx={CENTER_X}
            cy={CENTER_Y}
            rx={104 + reactorEnergy * 12}
            ry={34 + reactorEnergy * 5}
            stroke="rgba(138, 225, 255, 0.42)"
            strokeOpacity={0.08 + reactorEnergy * 0.1}
            strokeWidth={0.9 + reactorEnergy * 0.6}
            filter="url(#arc-glow)"
          />
        </g>

        {acceleratorArcs.map((arc) => (
          <g
            key={arc.id}
            transform={`rotate(${arc.rotation} ${CENTER_X} ${CENTER_Y})`}
          >
            <path
              d={arc.d}
              stroke={arc.color}
              strokeOpacity={arc.alpha * 0.24}
              strokeWidth={arc.width * 2.4}
              strokeLinecap="round"
              strokeDasharray={arc.dashArray}
              strokeDashoffset={arc.dashOffset}
              filter="url(#arc-glow)"
            />
            <path
              d={arc.d}
              stroke={arc.color}
              strokeOpacity={arc.alpha}
              strokeWidth={arc.width}
              strokeLinecap="round"
              strokeDasharray={arc.dashArray}
              strokeDashoffset={arc.dashOffset}
            />
          </g>
        ))}

        {edges.map((edge, index) => {
          const from = projectedLattice[edge.from];
          const to = projectedLattice[edge.to];

          if (!from || !to) return null;

          const alpha = clamp(
            ((from.alpha + to.alpha) / 2) * (0.22 + Math.min(0.16, speed / 180)),
            0,
            0.92
          );

          return (
            <line
              key={`${edge.from}-${edge.to}-${index}`}
              x1={CENTER_X + from.screenX}
              y1={CENTER_Y + from.screenY}
              x2={CENTER_X + to.screenX}
              y2={CENTER_Y + to.screenY}
              stroke={`rgba(158,170,255,${alpha})`}
              strokeWidth={0.75 + ((from.depth + to.depth) / 2) * 0.46}
            />
          );
        })}

        {projectedLattice.map((node, index) => (
          <circle
            key={`node-${index}`}
            cx={CENTER_X + node.screenX}
            cy={CENTER_Y + node.screenY}
            r={0.8 + node.depth * 1.2}
            fill={`rgba(236,240,255,${node.alpha * 0.48})`}
          />
        ))}

        {lightningBolts.map((bolt) => {
          const points = bolt.points
            .map((point) => `${CENTER_X + point.x},${CENTER_Y + point.y}`)
            .join(" ");

          return (
            <g key={bolt.id}>
              <polyline
                points={points}
                fill="none"
                stroke={bolt.color}
                strokeOpacity={bolt.alpha * 0.18}
                strokeWidth={bolt.width * 4.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#lightning-glow)"
              />
              <polyline
                points={points}
                fill="none"
                stroke={bolt.color}
                strokeOpacity={bolt.alpha * 0.72}
                strokeWidth={bolt.width * 1.9}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#lightning-glow)"
              />
              <polyline
                points={points}
                fill="none"
                stroke="#ffffff"
                strokeOpacity={bolt.alpha}
                strokeWidth={Math.max(0.7, bolt.width * 0.72)}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {bolt.branches.map((branch, branchIndex) => {
                const branchPoints = branch
                  .map((point) => `${CENTER_X + point.x},${CENTER_Y + point.y}`)
                  .join(" ");

                return (
                  <g key={`${bolt.id}-branch-${branchIndex}`}>
                    <polyline
                      points={branchPoints}
                      fill="none"
                      stroke={bolt.color}
                      strokeOpacity={bolt.alpha * 0.12}
                      strokeWidth={bolt.width * 2.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#lightning-glow)"
                    />
                    <polyline
                      points={branchPoints}
                      fill="none"
                      stroke="#eaf1ff"
                      strokeOpacity={bolt.alpha * 0.8}
                      strokeWidth={Math.max(0.55, bolt.width * 0.48)}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {projectedSkills.map((node) => {
        return (
          <div
            key={node.label}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate3d(${node.screenX}px, ${node.screenY}px, 0) scale(${node.scale})`,
              opacity: node.alpha,
              zIndex: Math.round(node.depth * 100),
            }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              <div
                className={`flex items-center rounded-full border border-white/[0.08] bg-[rgba(7,9,15,0.68)] backdrop-blur-[8px] transition-[padding,gap,background,border-color] duration-200 ${
                  hideLabel ? "gap-0 px-2.5 py-2" : "gap-3 px-3 py-2"
                } ${compressBadges ? "border-white/[0.12] bg-[rgba(7,9,15,0.48)]" : ""}`}
                style={{
                  boxShadow: compressBadges
                    ? "0 0 18px rgba(120,145,255,0.18), 0 6px 18px rgba(0,0,0,0.18)"
                    : "0 6px 16px rgba(0,0,0,0.22)",
                }}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[0.68rem] font-semibold tracking-[0.12em] text-white"
                  style={{
                    background: `linear-gradient(135deg, ${node.color}, rgba(255,255,255,0.12))`,
                    boxShadow: compressBadges ? `0 0 16px ${node.color}55` : undefined,
                  }}
                >
                  {node.short}
                </span>

                {!hideLabel && (
                  <span className="whitespace-nowrap text-sm font-medium tracking-[-0.01em] text-white/86">
                    {node.label}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
});

export function SkillsGlobe() {
  const skills = useMemo(() => createSkillNodes(), []);
  const lattice = useMemo(() => createLattice(), []);
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const initialRotationX = -0.34;
  const initialRotationY = 0.46;

  const [speed, setSpeed] = useState(prefersReducedMotion ? 8 : 15);
  const [overlay, setOverlay] = useState<OverlayState>(() => ({
    projectedSkills: skills
      .map((skill) => projectNode(skill, initialRotationX, initialRotationY))
      .sort((first, second) => first.depth - second.depth),
    projectedLattice: lattice.nodes.map((node) =>
      projectNode(node, initialRotationX, initialRotationY)
    ),
    lightningBolts: [],
    acceleratorArcs: [],
    reactorPhase: 0,
  }));

  const stageRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const isVisibleRef = useRef(true);

  const pointerActiveRef = useRef(false);
  const pointerXRef = useRef(0);
  const pointerYRef = useRef(0);

  const rotationXRef = useRef(initialRotationX);
  const rotationYRef = useRef(initialRotationY);

  const velocityXRef = useRef(BASE_AUTO_VELOCITY_X);
  const velocityYRef = useRef(BASE_AUTO_VELOCITY_Y);

  const frameCounterRef = useRef(0);
  const overlaySpeedRef = useRef(speed);
  const velocityMultiplierRef = useRef(1.6);

  const speedRatio = clamp((speed - MIN_SPEED) / (MAX_SPEED - MIN_SPEED), 0, 1);
  const highEnergyRatio = clamp((speed - 18) / 32, 0, 1);

  useEffect(() => {
    overlaySpeedRef.current = speed;
    velocityMultiplierRef.current = 1.1 + Math.pow(speedRatio, 2.9) * 64;
  }, [speed, speedRatio]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.06 }
    );

    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let mounted = true;

    const updateFrame = (time: number) => {
      if (!mounted) return;

      frameRef.current = window.requestAnimationFrame(updateFrame);

      if (!isVisibleRef.current || document.hidden) {
        lastTimeRef.current = time;
        return;
      }

      const dt = lastTimeRef.current
        ? Math.min((time - lastTimeRef.current) / 16.6667, 2)
        : 1;
      lastTimeRef.current = time;

      const currentSpeed = overlaySpeedRef.current;
      const overdrive =
        currentSpeed > 42 ? 1 + (currentSpeed - 42) * 0.12 : 1;

      const targetVelocityX =
        BASE_AUTO_VELOCITY_X * velocityMultiplierRef.current * overdrive;
      const targetVelocityY =
        BASE_AUTO_VELOCITY_Y * velocityMultiplierRef.current * overdrive;

      if (!pointerActiveRef.current) {
        velocityXRef.current += (targetVelocityX - velocityXRef.current) * 0.048 * dt;
        velocityYRef.current += (targetVelocityY - velocityYRef.current) * 0.048 * dt;
      }

      rotationXRef.current += velocityXRef.current * dt;
      rotationYRef.current += velocityYRef.current * dt;

      const nextSkills = skills
        .map((skill) => projectNode(skill, rotationXRef.current, rotationYRef.current))
        .sort((first, second) => first.depth - second.depth);

      const nextLattice = lattice.nodes.map((node) =>
        projectNode(node, rotationXRef.current, rotationYRef.current)
      );

      const chaos = clamp((currentSpeed - 18) / 32, 0, 1);
      const rotationSeed = rotationYRef.current * 12 + rotationXRef.current * 9;

      frameCounterRef.current += 1;

      const shouldRefreshLightning =
        currentSpeed > 28
          ? true
          : currentSpeed > 20
          ? frameCounterRef.current % 2 === 0
          : frameCounterRef.current % 3 === 0;

      setOverlay((prev) => ({
        projectedSkills: nextSkills,
        projectedLattice: nextLattice,
        lightningBolts: shouldRefreshLightning
          ? buildLightningBolts(nextLattice, currentSpeed, chaos, rotationSeed)
          : prev.lightningBolts,
        acceleratorArcs: buildAcceleratorArcs(currentSpeed, rotationSeed),
        reactorPhase: rotationSeed,
      }));

      const damping =
        currentSpeed > 44
          ? 0.996
          : currentSpeed > 34
          ? 0.993
          : currentSpeed > 22
          ? 0.99
          : 0.987;

      velocityXRef.current *= Math.pow(damping, dt);
      velocityYRef.current *= Math.pow(damping, dt);
    };

    frameRef.current = window.requestAnimationFrame(updateFrame);

    return () => {
      mounted = false;
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [lattice, prefersReducedMotion, skills]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || prefersReducedMotion) return;

    const handlePointerDown = (event: PointerEvent) => {
      pointerActiveRef.current = true;
      pointerXRef.current = event.clientX;
      pointerYRef.current = event.clientY;

      try {
        stage.setPointerCapture(event.pointerId);
      } catch {
        // ignore
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!pointerActiveRef.current) return;

      const deltaX = event.clientX - pointerXRef.current;
      const deltaY = event.clientY - pointerYRef.current;

      pointerXRef.current = event.clientX;
      pointerYRef.current = event.clientY;

      velocityYRef.current = deltaX * 0.00062;
      velocityXRef.current = -deltaY * 0.00062;

      rotationYRef.current += deltaX * 0.0044;
      rotationXRef.current -= deltaY * 0.0044;
    };

    const handlePointerUp = (event: PointerEvent) => {
      pointerActiveRef.current = false;

      try {
        if (stage.hasPointerCapture(event.pointerId)) {
          stage.releasePointerCapture(event.pointerId);
        }
      } catch {
        // ignore
      }
    };

    stage.addEventListener("pointerdown", handlePointerDown);
    stage.addEventListener("pointermove", handlePointerMove);
    stage.addEventListener("pointerup", handlePointerUp);
    stage.addEventListener("pointerleave", handlePointerUp);
    stage.addEventListener("pointercancel", handlePointerUp);

    return () => {
      stage.removeEventListener("pointerdown", handlePointerDown);
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerup", handlePointerUp);
      stage.removeEventListener("pointerleave", handlePointerUp);
      stage.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [prefersReducedMotion]);

  return (
    <div className="relative">
      <div className="mb-8 text-center">
        <p className="mb-3 text-[0.72rem] font-semibold tracking-[0.42em] text-white/42">
          TECH STACK
        </p>

        <h2 className="text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
          My Skills
        </h2>
      </div>

      <div className="globe-stage-frame relative mx-auto w-full max-w-[54rem]">
        <div
          ref={stageRef}
          className="globe-stage relative flex w-full cursor-grab items-center justify-center overflow-visible active:cursor-grabbing"
        >
          <div
            className="globe-core-outer pointer-events-none absolute rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(130,145,255,${
                0.05 + highEnergyRatio * 0.08
              }) 0%, rgba(90,122,255,${
                0.03 + highEnergyRatio * 0.06
              }) 34%, rgba(0,0,0,0) 72%)`,
              filter: `blur(${20 + highEnergyRatio * 14}px)`,
              transform: `scale(${1 + highEnergyRatio * 0.12})`,
              opacity: 0.8,
            }}
          />

          <div
            className="globe-core-inner pointer-events-none absolute rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(255,255,255,${
                0.02 + highEnergyRatio * 0.05
              }) 0%, rgba(153,211,255,${
                0.04 + highEnergyRatio * 0.08
              }) 30%, rgba(79,118,255,0) 72%)`,
              filter: `blur(${18 + highEnergyRatio * 18}px)`,
              transform: `scale(${1 + highEnergyRatio * 0.18})`,
              opacity: 0.95,
            }}
          />

          <div className="globe-ring-outer pointer-events-none absolute rounded-full border border-[#6c78ff]/12" />
          <div className="globe-ring-inner pointer-events-none absolute rounded-full border border-[#8890ff]/12 opacity-40" />

          <div className="globe-scene-shell">
            <div className="globe-scene">
              <GlobeOverlay overlay={overlay} edges={lattice.edges} speed={speed} />
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[14rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/16 to-transparent" />
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-[30rem] px-1 sm:mt-8">
        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-white/42">
          <span>Speed</span>
          <span className="text-white/65">{speed.toFixed(0)}</span>
        </div>

        <input
          type="range"
          min={MIN_SPEED}
          max={MAX_SPEED}
          step={1}
          value={speed}
          onChange={(event) => setSpeed(Number(event.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-white"
        />

        <div className="mt-3 text-center text-xs text-white/38">
          Push it to the limit and the globe enters particle-accelerator mode.
        </div>
      </div>

      <div className="relative mt-6 overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.03] py-3 shadow-[0_10px_30px_rgba(0,0,0,0.18)] sm:mt-8 sm:py-3.5">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[rgba(4,5,8,0.98)] via-[rgba(4,5,8,0.75)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[rgba(4,5,8,0.98)] via-[rgba(4,5,8,0.75)] to-transparent" />

        <div className="marquee-track flex w-max items-center gap-3 whitespace-nowrap px-4 sm:gap-4">
          {[...RAW_SKILLS, ...RAW_SKILLS].map((skill, index) => (
            <div
              key={`bottom-${skill.label}-${index}`}
              className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-white/68 transition hover:border-white/[0.14] hover:text-white/82 sm:gap-2.5 sm:px-4 sm:py-2 sm:text-sm"
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[0.55rem] font-semibold tracking-[0.12em] text-white sm:h-6 sm:w-6 sm:text-[0.6rem]"
                style={{
                  background: `${skill.color}22`,
                }}
              >
                {skill.short}
              </span>
              <span>{skill.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: infiniteLogoMarquee 24s linear infinite;
        }

        @keyframes infiniteLogoMarquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .globe-stage-frame {
          overflow: visible;
        }

        .globe-stage {
          height: 38rem;
        }

        .globe-core-outer {
          height: 29rem;
          width: 29rem;
        }

        .globe-core-inner {
          height: 17rem;
          width: 17rem;
        }

        .globe-ring-outer {
          height: 29rem;
          width: 29rem;
        }

        .globe-ring-inner {
          height: 18rem;
          width: 29rem;
          transform: rotateX(74deg);
        }

        .globe-scene-shell {
          --globe-scale: 1;
          position: relative;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .globe-scene {
          position: absolute;
          left: 50%;
          top: 50%;
          width: ${GLOBE_SCENE_WIDTH}px;
          height: ${GLOBE_SCENE_HEIGHT}px;
          transform: translate(-50%, -50%) scale(var(--globe-scale));
          transform-origin: center center;
        }

        @media (max-width: 1023px) {
          .globe-stage {
            height: 34rem;
          }

          .globe-core-outer {
            height: 24rem;
            width: 24rem;
          }

          .globe-core-inner {
            height: 14rem;
            width: 14rem;
          }

          .globe-ring-outer {
            height: 24rem;
            width: 24rem;
          }

          .globe-ring-inner {
            height: 15rem;
            width: 24rem;
          }

          .globe-scene-shell {
            --globe-scale: 0.82;
          }
        }

        @media (max-width: 767px) {
          .globe-stage-frame {
            height: 26.75rem;
          }

          .globe-stage {
            height: 26.75rem;
          }

          .globe-scene-shell {
            --globe-scale: 0.64;
          }
        }

        @media (max-width: 479px) {
          .globe-stage-frame {
            height: 23.75rem;
          }

          .globe-stage {
            height: 23.75rem;
          }

          .globe-scene-shell {
            --globe-scale: 0.52;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation-duration: 42s;
          }
        }
      `}</style>
    </div>
  );
}