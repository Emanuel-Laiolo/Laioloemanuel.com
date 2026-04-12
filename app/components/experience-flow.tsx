"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Background,
  BaseEdge,
  ConnectionLineType,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  getSmoothStepPath,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type EdgeProps,
  type EdgeTypes,
  type IsValidConnection,
  type Node,
  type NodeMouseHandler,
  type NodeProps,
  type NodeTypes,
} from "@xyflow/react";

type EdgeKind = "primary" | "secondary";

type HubNodeData = {
  label: string;
  subtitle: string;
  selected?: boolean;
};

type ExperienceNodeData = {
  title: string;
  subtitle: string;
  period: string;
  role: string;
  location: string;
  summary: string;
  stack: string[];
  accent: string;
  stage: string;
  selected?: boolean;
};

type FlowNodeData = HubNodeData | ExperienceNodeData;
type FlowNode = Node<FlowNodeData>;
type FlowEdge = Edge;
type EdgeMeta = { kind: EdgeKind; color: string };

const EDGE_PRIMARY = "rgba(224,229,236,0.92)";
const EDGE_SECONDARY = "rgba(214,220,230,0.34)";
const INITIAL_SELECTED = "yogalorena";

const seedNodes: FlowNode[] = [
  {
    id: "emanuel",
    type: "hub",
    position: { x: 430, y: 235 },
    data: {
      label: "EMANUEL LAIOLO",
      subtitle: "Projects, roles, foundations, and growth paths",
    },
  },
  {
    id: "solver",
    type: "experience",
    position: { x: 40, y: 295 },
    data: {
      title: "Solver Support",
      subtitle: "Technical Product",
      period: "May 2023 — Aug. 2024",
      role: "Support Team · Python Solver",
      location: "Self-employed",
      summary:
        "Technical support role around solver software, internal logic, and technically demanding product behavior.",
      stack: ["Python", "JSON", "Algorithms", "Statistics"],
      accent: "#ffd08a",
      stage: "Technical Layer",
    },
  },
  {
    id: "utn",
    type: "experience",
    position: { x: 875, y: 315 },
    data: {
      title: "UTN",
      subtitle: "Foundation",
      period: "Aug. 2025 — Jul. 2027",
      role: "Programming Technician",
      location: "Online",
      summary:
        "Formal programming education reinforcing long-term technical fundamentals.",
      stack: ["Programming", "Fundamentals", "Software Dev", "Growth"],
      accent: "#9dc4ff",
      stage: "Long-term Base",
    },
  },
  {
    id: "quantitative",
    type: "experience",
    position: { x: 220, y: 475 },
    data: {
      title: "Quantitative Project",
      subtitle: "Quant Systems",
      period: "Mar. 2022 — Apr. 2023",
      role: "Custom Software Projects",
      location: "Self-employed",
      summary:
        "Custom software work around EV, probability, risk models, datasets, and decision systems.",
      stack: ["Software", "Risk", "EV", "Datasets"],
      accent: "#ff9fae",
      stage: "Foundations",
    },
  },
  {
    id: "yoga4poker",
    type: "experience",
    position: { x: 455, y: 700 },
    data: {
      title: "Yoga4Poker",
      subtitle: "Niche Product",
      period: "Feb. 2025 — Aug. 2025",
      role: "Co-Founder",
      location: "Yoga Lorena ecosystem",
      summary:
        "Product and positioning work around a niche high-performance concept.",
      stack: ["Strategy", "Positioning", "Offer", "Content"],
      accent: "#78efd0",
      stage: "Product",
    },
  },
  {
    id: "yogalorena",
    type: "experience",
    position: { x: 770, y: 595 },
    data: {
      title: "YogaLorena VOD",
      subtitle: "Production App",
      period: "Dec. 2025 — Jan. 2026",
      role: "FullStack Lead · Partner",
      location: "Krakow · Remote",
      summary:
        "Subscription VOD platform with payments, auth, database, and protected video delivery for real users.",
      stack: ["Stripe", "Supabase", "Cloudflare", "Full Stack"],
      accent: "#b6a7ff",
      stage: "Execution",
    },
  },
  {
    id: "intothepoker",
    type: "experience",
    position: { x: 40, y: 760 },
    data: {
      title: "IntoThePoker",
      subtitle: "Live Commerce",
      period: "Oct. 2025 — Feb. 2026",
      role: "Full Ecommerce Build",
      location: "Self-employed",
      summary:
        "Built a real Shopify ecommerce experience with custom frontend work and a live commercial foundation.",
      stack: ["Shopify", "Theme", "Frontend", "UX"],
      accent: "#91c6ff",
      stage: "Execution",
    },
  },
];

const seedEdges: FlowEdge[] = [
  ["emanuel", "solver", "hub-source-0", "primary", EDGE_PRIMARY],
  ["emanuel", "quantitative", "hub-source-1", "primary", EDGE_PRIMARY],
  ["emanuel", "yoga4poker", "hub-source-3", "primary", EDGE_PRIMARY],
  ["emanuel", "yogalorena", "hub-source-4", "primary", EDGE_PRIMARY],
  ["emanuel", "utn", "hub-source-6", "primary", EDGE_PRIMARY],
  ["emanuel", "intothepoker", "hub-source-7", "primary", EDGE_PRIMARY],
  ["solver", "quantitative", "source", "secondary", EDGE_SECONDARY],
  ["quantitative", "yoga4poker", "source", "secondary", EDGE_SECONDARY],
  ["yoga4poker", "yogalorena", "source", "secondary", EDGE_SECONDARY],
  ["quantitative", "intothepoker", "source", "secondary", EDGE_SECONDARY],
].map(([source, target, sourceHandle, kind, color], index) => ({
  id: `seed-${index}-${source}-${target}`,
  source,
  target,
  sourceHandle,
  targetHandle: "target",
  type: "workflow",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color,
    width: kind === "primary" ? 20 : 16,
    height: kind === "primary" ? 20 : 16,
  },
  data: {
    kind,
    color,
  },
}));

function getEdgeMeta(edge: FlowEdge): EdgeMeta {
  const raw = edge.data as Partial<EdgeMeta> | undefined;
  return {
    kind: raw?.kind === "secondary" ? "secondary" : "primary",
    color: raw?.color ?? EDGE_PRIMARY,
  };
}

function cloneNodes(): FlowNode[] {
  return seedNodes.map((node) => ({
    ...node,
    position: { ...node.position },
    data: { ...node.data },
  }));
}

function cloneEdges(): FlowEdge[] {
  return seedEdges.map((edge) => ({
    ...edge,
    data: edge.data ? { ...(edge.data as object) } : undefined,
  }));
}

function SourceHandle({ id = "source" }: { id?: string }) {
  return (
    <Handle
      id={id}
      type="source"
      position={Position.Bottom}
      isConnectable
      className="!z-20"
      style={{
        width: 30,
        height: 30,
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "#2a2f3b",
        boxShadow: "0 8px 24px rgba(0,0,0,0.28)",
        bottom: -15,
      }}
    >
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-white text-[0.95rem] font-semibold">
        +
      </span>
    </Handle>
  );
}

function TargetHandle() {
  return (
    <Handle
      id="target"
      type="target"
      position={Position.Top}
      isConnectable
      className="!z-20"
      style={{
        width: 30,
        height: 30,
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "#314d3f",
        boxShadow: "0 8px 24px rgba(0,0,0,0.28)",
        top: -15,
      }}
    >
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-white text-[0.82rem] font-semibold">
        ↓
      </span>
    </Handle>
  );
}

const HUB_HANDLE_LEFTS = [8, 20, 32, 44, 56, 68, 80, 92] as const;

const HubNode = memo(function HubNode(_props: NodeProps<FlowNode>) {
  return (
    <div className="relative min-w-[15.5rem] rounded-[1.45rem] border border-white/12 bg-[linear-gradient(180deg,rgba(19,24,36,0.98),rgba(10,12,19,0.98))] px-5 py-4 text-center shadow-[0_20px_58px_rgba(0,0,0,0.34),0_0_54px_rgba(129,157,255,0.14)]">
      {HUB_HANDLE_LEFTS.map((left, index) => (
        <Handle
          key={`hub-source-${index}`}
          id={`hub-source-${index}`}
          type="source"
          position={Position.Bottom}
          isConnectable
          className="!z-20"
          style={{
            width: 18,
            height: 18,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "#2a2f3b",
            boxShadow: "0 6px 18px rgba(0,0,0,0.22)",
            bottom: -9,
            left: `${left}%`,
            transform: "translateX(-50%)",
          }}
        />
      ))}
      <p className="text-[0.64rem] uppercase tracking-[0.28em] text-white/38">Experience Hub</p>
      <h3 className="mt-2 text-[1.15rem] font-semibold tracking-[0.18em] text-white/94">
        EMANUEL LAIOLO
      </h3>
      <p className="mt-2 text-sm text-white/48">Projects, roles, foundations, and growth paths</p>
    </div>
  );
});

const ExperienceNodeCard = memo(function ExperienceNodeCard(props: NodeProps<FlowNode>) {
  const data = props.data as ExperienceNodeData;
  const { selected } = props;

  return (
    <div
      className={`relative w-[18.2rem] rounded-[1.2rem] border px-4 py-3.5 text-left transition duration-200 ${
        selected ? "border-white/24 bg-[rgba(16,18,28,0.98)]" : "border-white/10 bg-[rgba(10,12,18,0.96)]"
      }`}
      style={{
        boxShadow: selected
          ? `0 0 0 1px rgba(255,255,255,0.06), 0 0 28px ${data.accent}24, 0 18px 52px rgba(0,0,0,0.38)`
          : `0 14px 38px rgba(0,0,0,0.28)`,
      }}
    >
      <TargetHandle />
      <SourceHandle />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.22em] text-white/34">{data.stage}</p>
          <h3 className="mt-1 text-[1.02rem] font-semibold tracking-[-0.03em] text-white/94">{data.title}</h3>
        </div>
        <span
          className="mt-0.5 inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: data.accent }}
        />
      </div>

      <p className="mt-3 text-[0.72rem] uppercase tracking-[0.18em] text-white/36">{data.subtitle}</p>
      <p className="mt-1 text-sm text-white/42">{data.period}</p>

      {selected ? (
        <div className="mt-4 space-y-3 border-t border-white/[0.06] pt-4">
          <p className="text-[0.72rem] uppercase tracking-[0.18em] text-white/34">
            {data.role} · {data.location}
          </p>
          <p className="text-sm leading-6 text-white/60">{data.summary}</p>
          <div className="flex flex-wrap gap-2">
            {data.stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[0.66rem] text-white/56"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
});

const WorkflowEdge = memo(function WorkflowEdge(props: EdgeProps<FlowEdge>) {
  const meta = getEdgeMeta(props as unknown as FlowEdge);
  const [path] = getSmoothStepPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
    borderRadius: meta.kind === "primary" ? 18 : 10,
    offset: meta.kind === "primary" ? 32 : 24,
  });

  return (
    <BaseEdge
      path={path}
      markerEnd={props.markerEnd}
      style={{
        stroke: meta.color,
        strokeWidth: meta.kind === "primary" ? 2.1 : 1.25,
        strokeDasharray: meta.kind === "primary" ? "3 8" : "none",
        opacity: meta.kind === "primary" ? 0.95 : 0.68,
      }}
    />
  );
});

const nodeTypes: NodeTypes = {
  hub: HubNode,
  experience: ExperienceNodeCard,
};

const edgeTypes: EdgeTypes = {
  workflow: WorkflowEdge,
};

function ExperienceFlowInner() {
  const [selectedId, setSelectedId] = useState<string | null>(INITIAL_SELECTED);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [showSecondaryRelationships, setShowSecondaryRelationships] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [newNodeName, setNewNodeName] = useState("");
  const [newNodeStage, setNewNodeStage] = useState("New");
  const [nodes, setNodes, onNodesChange] = useNodesState(cloneNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(cloneEdges());


  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        selected: node.id === selectedId,
        data: { ...node.data, selected: node.id === selectedId },
      })),
    );
  }, [selectedId, setNodes]);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedId) ?? null,
    [nodes, selectedId],
  );

  const selectedEdge = useMemo(
    () => edges.find((edge) => edge.id === selectedEdgeId) ?? null,
    [edges, selectedEdgeId],
  );

  const visibleEdges = useMemo(() => {
    if (showSecondaryRelationships) return edges;
    return edges.filter((edge) => getEdgeMeta(edge).kind !== "secondary");
  }, [edges, showSecondaryRelationships]);

  const onNodeClick = useCallback<NodeMouseHandler<FlowNode>>((_, node) => {
    setSelectedId(node.id);
    setSelectedEdgeId(null);
  }, []);

  const onNodeDoubleClick = useCallback<NodeMouseHandler<FlowNode>>((_, node) => {
    if (!isEditMode) return;
    setSelectedId(node.id);
    setSelectedEdgeId(null);
    setIsEditorOpen(true);
  }, [isEditMode]);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: FlowEdge) => {
    if (!isEditMode) return;
    setSelectedEdgeId(edge.id);
    setSelectedId(null);
  }, [isEditMode]);

  const isValidConnection = useCallback<IsValidConnection>((connection) => {
    const { source, target, sourceHandle, targetHandle } = connection;
    if (!source || !target) return false;
    if (source === target) return false;
    if (sourceHandle && source !== "emanuel" && sourceHandle !== "source") return false;
    if (targetHandle && targetHandle !== "target") return false;

    return !edges.some(
      (edge) =>
        edge.source === source &&
        edge.target === target &&
        edge.sourceHandle === sourceHandle &&
        edge.targetHandle === targetHandle,
    );
  }, [edges]);

  const onConnect = useCallback((connection: Connection) => {
    if (!isEditMode) return;
    if (!connection.source || !connection.target) return;
    if (!isValidConnection(connection)) return;

    const nextEdge: FlowEdge = {
      source: connection.source,
      target: connection.target,
      sourceHandle:
        connection.sourceHandle ??
        (connection.source === "emanuel" ? "hub-source-7" : "source"),
      targetHandle: connection.targetHandle ?? "target",
      id: `manual-${connection.source}-${connection.target}-${Date.now()}`,
      type: "workflow",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: EDGE_PRIMARY,
        width: 20,
        height: 20,
      },
      data: {
        color: EDGE_PRIMARY,
        kind: "primary",
      },
    };

    setEdges((currentEdges) => addEdge(nextEdge, currentEdges));
  }, [isEditMode, isValidConnection, setEdges]);

  const updateSelectedNode = useCallback((patch: Partial<HubNodeData & ExperienceNodeData>) => {
    if (!selectedNode) return;
    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, ...patch } }
          : node,
      ),
    );
  }, [selectedNode, setNodes]);

  const createNode = useCallback(() => {
    const id = `card-${Date.now()}`;
    const title = newNodeName.trim() || "New Node";
    const newNode: FlowNode = {
      id,
      type: "experience",
      position: { x: 420, y: 360 },
      data: {
        title,
        subtitle: "Custom Node",
        period: "2026",
        role: "Role",
        location: "Remote",
        summary: "Describe the project, role, or milestone here.",
        stack: ["Tag 1", "Tag 2"],
        accent: "#8fb8ff",
        stage: newNodeStage,
      },
    };
    setNodes((current) => [...current, newNode]);
    setSelectedId(id);
    setSelectedEdgeId(null);
    setNewNodeName("");
    setNewNodeStage("New");
    setIsEditorOpen(true);
  }, [newNodeName, newNodeStage, setNodes]);

  const duplicateSelected = useCallback(() => {
    if (!selectedNode || selectedNode.type !== "experience") return;
    const data = selectedNode.data as ExperienceNodeData;
    const id = `duplicate-${Date.now()}`;
    const duplicate: FlowNode = {
      ...selectedNode,
      id,
      position: {
        x: selectedNode.position.x + 48,
        y: selectedNode.position.y + 48,
      },
      data: { ...data, title: `${data.title} Copy` },
    };
    setNodes((current) => [...current, duplicate]);
    setSelectedId(id);
    setSelectedEdgeId(null);
    setIsEditorOpen(true);
  }, [selectedNode, setNodes]);

  const deleteSelectedNode = useCallback(() => {
    if (!selectedNode) return;
    const nodeId = selectedNode.id;
    setNodes((current) => current.filter((node) => node.id !== nodeId));
    setEdges((current) => current.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedId(null);
    setIsEditorOpen(false);
  }, [selectedNode, setEdges, setNodes]);

  const deleteSelectedEdge = useCallback(() => {
    if (!selectedEdgeId) return;
    setEdges((current) => current.filter((edge) => edge.id !== selectedEdgeId));
    setSelectedEdgeId(null);
  }, [selectedEdgeId, setEdges]);

  const resetGraph = useCallback(() => {
    setNodes(cloneNodes());
    setEdges(cloneEdges());
    setSelectedId(INITIAL_SELECTED);
    setSelectedEdgeId(null);
    setShowSecondaryRelationships(false);
    setIsEditorOpen(false);
    setIsEditMode(true);
  }, [setEdges, setNodes]);

  const fitViewOptions = useMemo(
    () => ({ padding: 0.58, minZoom: 0.42, maxZoom: 1.05 }),
    [],
  );

  const selectedHub = selectedNode?.type === "hub" ? (selectedNode.data as HubNodeData) : null;
  const selectedCard = selectedNode?.type === "experience" ? (selectedNode.data as ExperienceNodeData) : null;

  return (
    <section
      id="projects"
      className="scroll-mt-28 border-b border-[var(--border)] py-20 sm:py-32 lg:py-40"
    >
      <style jsx global>{`
        #projects .react-flow__renderer svg,
        #projects .react-flow__edgelabel-renderer svg,
        #projects .react-flow__minimap svg,
        #projects .react-flow__background svg {
          max-width: none !important;
        }
      `}</style>

      <div className="space-y-10 lg:space-y-14">
        <div className="mx-auto max-w-4xl space-y-4 px-1 text-center">
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.34em] text-[var(--foreground-subtle)]">
            Experience Flow
          </p>
          <h2 className="text-[2rem] font-semibold tracking-[-0.045em] text-[var(--foreground)] sm:text-4xl lg:text-[2.9rem]">
            A living map of my work, built by me.
          </h2>
          <p className="mx-auto max-w-3xl text-[0.98rem] leading-7 text-[var(--foreground-muted)] sm:text-lg sm:leading-8">
            I built this interactive canvas to show how my projects, skills, and technical foundations connect over time. You can move nodes, inspect links, and explore the structure freely — while the original composition stays intentional and curated.
          </p>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#0b0d12] shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-4 sm:px-6">
            <div>
              <p className="text-[0.64rem] uppercase tracking-[0.28em] text-white/34">
                React Flow Canvas
              </p>
              
            </div>

            <div className="flex items-center gap-2" />
          </div>

          <div className="experience-stage relative h-[36rem] w-full overflow-hidden bg-[#111318] sm:h-[48rem] lg:h-[58rem]">
            <div className="experience-scene absolute inset-0">
            <ReactFlow<FlowNode, FlowEdge>
              nodes={nodes}
              edges={visibleEdges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onNodeDoubleClick={onNodeDoubleClick}
              onEdgeClick={onEdgeClick}
              isValidConnection={isValidConnection}
              fitView
              fitViewOptions={fitViewOptions}
              defaultEdgeOptions={{
                type: "workflow",
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  color: EDGE_PRIMARY,
                  width: 20,
                  height: 20,
                },
              }}
              connectionLineType={ConnectionLineType.SmoothStep}
              connectionLineStyle={{
                stroke: EDGE_PRIMARY,
                strokeWidth: 2,
                strokeDasharray: "3 8",
              }}
              minZoom={0.45}
              maxZoom={1.4}
              colorMode="dark"
              panOnDrag
              selectionOnDrag
              nodesDraggable
              nodesConnectable={isEditMode}
              elementsSelectable
              connectOnClick={false}
              connectionRadius={40}
              deleteKeyCode={null}
              proOptions={{ hideAttribution: true }}
            >
              <Background gap={20} size={1} />
              <MiniMap
                zoomable
                pannable
                style={{
                  background: "#0f1117",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
              <Controls
                style={{
                  background: "#0f1117",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                showInteractive={false}
              />
              <Panel position="top-left">
                <div className="w-[min(52vw,16rem)] rounded-xl border border-white/[0.08] bg-[rgba(15,17,23,0.88)] px-3 py-2.5 text-xs leading-5 text-white/62 backdrop-blur-xl sm:w-[min(100%,26rem)] sm:px-4 sm:py-3 sm:text-sm sm:leading-6">
                  Select a node to reveal its information. You can also move nodes, create connections, duplicate items, or reset the canvas from the panel on the right.
                </div>
              </Panel>

              {isEditMode ? (
                <>
                  <Panel position="top-right">
                    <div className="flex w-[12.75rem] flex-col gap-2 rounded-[1rem] border border-white/[0.08] bg-[rgba(15,17,23,0.88)] p-3 backdrop-blur-xl sm:w-[17.5rem] sm:p-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatorOpen(true);
                          setIsEditorOpen(false);
                        }}
                        className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-white/46 transition hover:text-white/78"
                      >
                        Add Node
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditorOpen((current) => !current)}
                        disabled={!selectedNode}
                        className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-white/46 transition hover:text-white/78 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        Edit Selected
                      </button>
                      <button
                        type="button"
                        onClick={duplicateSelected}
                        disabled={selectedNode?.type !== "experience"}
                        className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-white/46 transition hover:text-white/78 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        Duplicate
                      </button>
                      <button
                        type="button"
                        onClick={deleteSelectedNode}
                        disabled={!selectedNode}
                        className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-white/46 transition hover:text-white/78 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        Delete Node
                      </button>
                      <button
                        type="button"
                        onClick={deleteSelectedEdge}
                        disabled={!selectedEdge}
                        className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-white/46 transition hover:text-white/78 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        Delete Edge
                      </button>
                      <button
                        type="button"
                        onClick={resetGraph}
                        className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-white/46 transition hover:text-white/78"
                      >
                        Reset
                      </button>
                    </div>
                  </Panel>

                  {isCreatorOpen ? (
                    <Panel position="top-right">
                      <div className="mt-32 w-[13rem] rounded-[1.15rem] border border-white/[0.08] bg-[rgba(15,17,23,0.92)] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:mt-44 sm:w-[20rem] sm:p-4">
                        <p className="text-[0.66rem] uppercase tracking-[0.22em] text-white/36">Node Creator</p>
                        <div className="mt-4 space-y-3">
                          <Field label="Name" value={newNodeName} onChange={setNewNodeName} />
                          <Field label="Stage" value={newNodeStage} onChange={setNewNodeStage} />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={createNode}
                              className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-white/46 transition hover:text-white/78"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsCreatorOpen(false)}
                              className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-white/46 transition hover:text-white/78"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </Panel>
                  ) : null}
                </>
              ) : null}

              {selectedNode && isEditorOpen ? (
                <Panel position="bottom-center">
                  <div className="mb-4 w-[min(96vw,52rem)] rounded-[1.25rem] border border-white/[0.08] bg-[rgba(14,16,24,0.92)] p-3 text-white/84 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-4">
                    <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
                      <div>
                        <p className="text-[0.66rem] uppercase tracking-[0.22em] text-white/34">
                          {selectedNode.type === "hub" ? "Hub Editor" : "Card Editor"}
                        </p>
                        <p className="mt-1 text-sm text-white/58">
                          Compact contextual editing, without taking over the workspace.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEditorOpen(false)}
                        className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[0.64rem] uppercase tracking-[0.22em] text-white/46 transition hover:text-white/78"
                      >
                        Close
                      </button>
                    </div>

                    {selectedNode.type === "hub" && selectedHub ? (
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <Field label="Label" value={selectedHub.label} onChange={(value) => updateSelectedNode({ label: value })} />
                        <Field label="Subtitle" value={selectedHub.subtitle} onChange={(value) => updateSelectedNode({ subtitle: value })} multiline />
                      </div>
                    ) : null}

                    {selectedNode.type === "experience" && selectedCard ? (
                      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <Field label="Title" value={selectedCard.title} onChange={(value) => updateSelectedNode({ title: value })} />
                        <Field label="Subtitle" value={selectedCard.subtitle} onChange={(value) => updateSelectedNode({ subtitle: value })} />
                        <Field label="Period" value={selectedCard.period} onChange={(value) => updateSelectedNode({ period: value })} />
                        <Field label="Role" value={selectedCard.role} onChange={(value) => updateSelectedNode({ role: value })} />
                        <Field label="Location" value={selectedCard.location} onChange={(value) => updateSelectedNode({ location: value })} />
                        <Field label="Stage" value={selectedCard.stage} onChange={(value) => updateSelectedNode({ stage: value })} />
                        <Field label="Accent" value={selectedCard.accent} onChange={(value) => updateSelectedNode({ accent: value })} />
                        <Field label="Summary" value={selectedCard.summary} onChange={(value) => updateSelectedNode({ summary: value })} multiline />
                        <Field
                          label="Stack tags"
                          value={selectedCard.stack.join(", ")}
                          onChange={(value) =>
                            updateSelectedNode({
                              stack: value
                                .split(",")
                                .map((item) => item.trim())
                                .filter(Boolean),
                            })
                          }
                          multiline
                        />
                      </div>
                    ) : null}
                  </div>
                </Panel>
              ) : null}
            </ReactFlow>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 639px) {
          .experience-stage {
            height: 33rem;
          }

          .experience-scene {
            transform: scale(0.7);
            transform-origin: top center;
            width: 138%;
            left: -19%;
            top: 0;
          }
        }

        @media (min-width: 640px) and (max-width: 1023px) {
          .experience-stage {
            height: 45rem;
          }

          .experience-scene {
            transform: scale(0.88);
            transform-origin: top center;
            width: 116%;
            left: -8%;
            top: 0;
          }
        }
      `}</style>
    </section>
  );
}

function ToolbarButton({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-white/46 transition hover:text-white/78 disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[0.66rem] uppercase tracking-[0.22em] text-white/36">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          className="w-full rounded-[1rem] border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white/78 outline-none transition focus:border-white/[0.18]"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-[1rem] border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white/78 outline-none transition focus:border-white/[0.18]"
        />
      )}
    </label>
  );
}

export function ExperienceFlow() {
  return (
    <ReactFlowProvider>
      <ExperienceFlowInner />
    </ReactFlowProvider>
  );
}
