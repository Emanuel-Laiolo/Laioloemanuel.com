"use client";

import {
  memo,
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
    markerEnd:
      typeof edge.markerEnd === "object" && edge.markerEnd !== null
        ? { ...edge.markerEnd }
        : edge.markerEnd,
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
        border: "1px solid rgba(255,255,255,0.16)",
        background: "#252b38",
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        bottom: -15,
      }}
    >
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[0.95rem] font-semibold text-white">
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
        border: "1px solid rgba(255,255,255,0.16)",
        background: "#243246",
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        top: -15,
      }}
    >
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[0.82rem] font-semibold text-white">
        ↓
      </span>
    </Handle>
  );
}

const HUB_HANDLE_LEFTS = [8, 20, 32, 44, 56, 68, 80, 92] as const;

const HubNode = memo(function HubNode(props: NodeProps<FlowNode>) {
  const data = props.data as HubNodeData;
  const selected = Boolean(props.selected);

  return (
    <div
      className={`relative min-w-[15.5rem] rounded-[1.45rem] border px-5 py-4 text-center transition duration-200 ${
        selected
          ? "border-white/24 bg-[linear-gradient(180deg,rgba(25,31,48,0.99),rgba(11,13,21,0.99))]"
          : "border-white/12 bg-[linear-gradient(180deg,rgba(19,24,36,0.98),rgba(10,12,19,0.98))]"
      }`}
      style={{
        boxShadow: selected
          ? "0 22px 64px rgba(0,0,0,0.4), 0 0 60px rgba(145,198,255,0.18)"
          : "0 20px 58px rgba(0,0,0,0.34), 0 0 54px rgba(129,157,255,0.14)",
      }}
    >
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
            border: "1px solid rgba(255,255,255,0.14)",
            background: "#2a2f3b",
            boxShadow: "0 6px 18px rgba(0,0,0,0.24)",
            bottom: -9,
            left: `${left}%`,
            transform: "translateX(-50%)",
          }}
        />
      ))}

      <p className="text-[0.64rem] uppercase tracking-[0.28em] text-white/38">
        Experience Hub
      </p>

      <h3 className="mt-2 text-[1.15rem] font-semibold tracking-[0.18em] text-white/94">
        {data.label}
      </h3>

      <p className="mt-2 text-sm text-white/48">{data.subtitle}</p>
    </div>
  );
});

const ExperienceNodeCard = memo(function ExperienceNodeCard(
  props: NodeProps<FlowNode>
) {
  const data = props.data as ExperienceNodeData;
  const selected = Boolean(props.selected);

  return (
    <div
      className={`relative w-[18.2rem] rounded-[1.2rem] border px-4 py-3.5 text-left transition duration-200 ${
        selected
          ? "border-white/24 bg-[rgba(16,18,28,0.98)]"
          : "border-white/10 bg-[rgba(10,12,18,0.96)]"
      }`}
      style={{
        boxShadow: selected
          ? `0 0 0 1px rgba(255,255,255,0.06), 0 0 28px ${data.accent}24, 0 18px 52px rgba(0,0,0,0.38)`
          : "0 14px 38px rgba(0,0,0,0.28)",
      }}
    >
      <TargetHandle />
      <SourceHandle />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.22em] text-white/34">
            {data.stage}
          </p>

          <h3 className="mt-1 text-[1.02rem] font-semibold tracking-[-0.03em] text-white/94">
            {data.title}
          </h3>
        </div>

        <span
          className="mt-0.5 inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: data.accent }}
        />
      </div>

      <p className="mt-3 text-[0.72rem] uppercase tracking-[0.18em] text-white/36">
        {data.subtitle}
      </p>

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
  const raw = props.data as Partial<EdgeMeta> | undefined;
  const meta: EdgeMeta = {
    kind: raw?.kind === "secondary" ? "secondary" : "primary",
    color: raw?.color ?? EDGE_PRIMARY,
  };

  const selected = Boolean(props.selected);

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
        stroke: selected ? "rgba(255,255,255,0.98)" : meta.color,
        strokeWidth: selected ? 3 : meta.kind === "primary" ? 2.1 : 1.25,
        strokeDasharray: meta.kind === "primary" ? "3 8" : "none",
        opacity: selected ? 1 : meta.kind === "primary" ? 0.95 : 0.68,
        filter: selected ? "drop-shadow(0 0 8px rgba(255,255,255,0.32))" : "",
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
  const [isEditMode, setIsEditMode] = useState(true);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [newNodeName, setNewNodeName] = useState("");
  const [newNodeStage, setNewNodeStage] = useState("New");
  const [nodes, setNodes, onNodesChange] =
    useNodesState<FlowNode>(cloneNodes());
  const [edges, setEdges, onEdgesChange] =
    useEdgesState<FlowEdge>(cloneEdges());

  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        selected: node.id === selectedId,
        data: { ...node.data, selected: node.id === selectedId },
      }))
    );
  }, [selectedId, setNodes]);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedId) ?? null,
    [nodes, selectedId]
  );

  const selectedEdge = useMemo(
    () => edges.find((edge) => edge.id === selectedEdgeId) ?? null,
    [edges, selectedEdgeId]
  );

  const flowEdges = useMemo<FlowEdge[]>(
    () =>
      edges.map((edge) => {
        const meta = getEdgeMeta(edge);

        return {
          ...edge,
          hidden: meta.kind === "secondary",
          selected: edge.id === selectedEdgeId,
        };
      }),
    [edges, selectedEdgeId]
  );

  const onNodeClick = useCallback<NodeMouseHandler<FlowNode>>((_, node) => {
    setSelectedId(node.id);
    setSelectedEdgeId(null);
  }, []);

  const onNodeDoubleClick = useCallback<NodeMouseHandler<FlowNode>>(
    (_, node) => {
      if (!isEditMode) return;

      setSelectedId(node.id);
      setSelectedEdgeId(null);
      setIsEditorOpen(true);
      setIsCreatorOpen(false);
    },
    [isEditMode]
  );

  const onEdgeClick = useCallback(
    (_event: ReactMouseEvent, edge: FlowEdge) => {
      if (!isEditMode) return;

      setSelectedEdgeId(edge.id);
      setSelectedId(null);
      setIsEditorOpen(false);
      setIsCreatorOpen(false);
    },
    [isEditMode]
  );

  const isValidConnection = useCallback<IsValidConnection>(
    (connection) => {
      const { source, target, sourceHandle, targetHandle } = connection;

      if (!source || !target) return false;
      if (source === target) return false;

      if (sourceHandle && source !== "emanuel" && sourceHandle !== "source") {
        return false;
      }

      if (targetHandle && targetHandle !== "target") {
        return false;
      }

      return !edges.some(
        (edge) =>
          edge.source === source &&
          edge.target === target &&
          edge.sourceHandle === sourceHandle &&
          edge.targetHandle === targetHandle
      );
    },
    [edges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
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
      setSelectedEdgeId(nextEdge.id);
      setSelectedId(null);
    },
    [isEditMode, isValidConnection, setEdges]
  );

  const updateSelectedNode = useCallback(
    (patch: Partial<HubNodeData & ExperienceNodeData>) => {
      if (!selectedNode) return;

      setNodes((currentNodes) =>
        currentNodes.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, ...patch } }
            : node
        )
      );
    },
    [selectedNode, setNodes]
  );

  const createNode = useCallback(() => {
    const id = `card-${Date.now()}`;
    const title = newNodeName.trim() || "New Node";
    const offset = nodes.length % 6;

    const newNode: FlowNode = {
      id,
      type: "experience",
      position: {
        x: 330 + offset * 44,
        y: 350 + offset * 36,
      },
      data: {
        title,
        subtitle: "Custom Node",
        period: "2026",
        role: "Role",
        location: "Remote",
        summary: "Describe the project, role, or milestone here.",
        stack: ["Tag 1", "Tag 2"],
        accent: "#8fb8ff",
        stage: newNodeStage.trim() || "New",
      },
    };

    setNodes((current) => [...current, newNode]);
    setSelectedId(id);
    setSelectedEdgeId(null);
    setNewNodeName("");
    setNewNodeStage("New");
    setIsEditorOpen(true);
    setIsCreatorOpen(false);
  }, [newNodeName, newNodeStage, nodes.length, setNodes]);

  const duplicateSelected = useCallback(() => {
    if (!selectedNode || selectedNode.type !== "experience") return;

    const data = selectedNode.data as ExperienceNodeData;
    const id = `duplicate-${Date.now()}`;

    const duplicate: FlowNode = {
      ...selectedNode,
      id,
      selected: false,
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
    setIsCreatorOpen(false);
  }, [selectedNode, setNodes]);

  const deleteSelectedNode = useCallback(() => {
    if (!selectedNode) return;
    if (selectedNode.id === "emanuel") return;

    const nodeId = selectedNode.id;

    setNodes((current) => current.filter((node) => node.id !== nodeId));
    setEdges((current) =>
      current.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );

    setSelectedId(null);
    setSelectedEdgeId(null);
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
    setIsEditorOpen(false);
    setIsCreatorOpen(false);
    setIsEditMode(true);
  }, [setEdges, setNodes]);

  const fitViewOptions = useMemo(
    () => ({ padding: 0.58, minZoom: 0.42, maxZoom: 1.05 }),
    []
  );

  const selectedHub =
    selectedNode?.type === "hub" ? (selectedNode.data as HubNodeData) : null;

  const selectedCard =
    selectedNode?.type === "experience"
      ? (selectedNode.data as ExperienceNodeData)
      : null;

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

        #projects .react-flow__attribution {
          display: none !important;
        }
      `}</style>

      <div className="space-y-10 lg:space-y-14">
        <div className="mx-auto max-w-6xl space-y-6 px-1 text-center">
          <div className="space-y-4">
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.34em] text-[var(--foreground-subtle)]">
              Interactive Experience Flow
            </p>

            <h2 className="mx-auto max-w-5xl text-[2rem] font-semibold tracking-[-0.045em] text-[var(--foreground)] sm:text-4xl lg:text-[2.9rem]">
              A visual map of how my projects, skills, and technical foundations
              connect.
            </h2>

            <p className="mx-auto max-w-3xl text-[0.98rem] leading-7 text-[var(--foreground-muted)] sm:text-lg sm:leading-8">
              This is an interactive flowchart built to present my work as a
              connected system, not a static timeline. Explore the nodes, inspect
              relationships, move elements around, or create your own connections
              to understand how each experience contributes to the bigger
              picture.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-3 text-left sm:grid-cols-3">
            <div className="rounded-[1.25rem] border border-white/[0.08] bg-white/[0.025] px-4 py-4 backdrop-blur-md">
              <p className="text-[0.64rem] font-medium uppercase tracking-[0.24em] text-white/36">
                Explore
              </p>
              <p className="mt-2 text-sm leading-6 text-white/62">
                Click any node to reveal the role, context, stack, and project
                details.
              </p>
            </div>

            <div className="rounded-[1.25rem] border border-white/[0.08] bg-white/[0.025] px-4 py-4 backdrop-blur-md">
              <p className="text-[0.64rem] font-medium uppercase tracking-[0.24em] text-white/36">
                Interact
              </p>
              <p className="mt-2 text-sm leading-6 text-white/62">
                Drag nodes, zoom, pan, and inspect how different experiences are
                linked.
              </p>
            </div>

            <div className="rounded-[1.25rem] border border-white/[0.08] bg-white/[0.025] px-4 py-4 backdrop-blur-md">
              <p className="text-[0.64rem] font-medium uppercase tracking-[0.24em] text-white/36">
                Build
              </p>
              <p className="mt-2 text-sm leading-6 text-white/62">
                Add custom nodes and connect them to test new paths inside the
                canvas.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#0b0d12] shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
          <div className="experience-scroll-shell">
            <div className="experience-scroll-track">
              <div className="experience-stage relative w-full overflow-hidden bg-[#111318]">
                <div className="experience-scene absolute inset-0">
                  <ReactFlow<FlowNode, FlowEdge>
                    nodes={nodes}
                    edges={flowEdges}
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
                      <div className="hidden rounded-xl border border-white/[0.08] bg-[rgba(15,17,23,0.88)] px-3 py-2.5 text-xs leading-5 text-white/62 backdrop-blur-xl sm:block sm:w-[min(100%,28rem)] sm:px-4 sm:py-3 sm:text-sm sm:leading-6">
                        This canvas is interactive. Select a node to inspect the
                        experience, drag nodes to reorganize the map, or use the
                        editor controls to add, duplicate, connect, and reset
                        items.
                      </div>
                    </Panel>

                    <Panel position="bottom-left">
                      <div className="hidden rounded-xl border border-white/[0.08] bg-[rgba(15,17,23,0.82)] px-3 py-2 text-[0.64rem] uppercase tracking-[0.18em] text-white/42 backdrop-blur-xl sm:block">
                        Edit mode enabled
                      </div>
                    </Panel>

                    {isEditMode ? (
                      <>
                        <Panel position="top-right">
                          <div className="hidden flex-col gap-2 rounded-[1rem] border border-white/[0.08] bg-[rgba(15,17,23,0.88)] p-3 backdrop-blur-xl sm:flex sm:w-[17.5rem] sm:p-4">
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
                              onClick={() =>
                                setIsEditorOpen((current) => !current)
                              }
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
                              disabled={
                                !selectedNode || selectedNode.id === "emanuel"
                              }
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
                            <div className="hidden rounded-[1.15rem] border border-white/[0.08] bg-[rgba(15,17,23,0.92)] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:mt-44 sm:block sm:w-[20rem] sm:p-4">
                              <p className="text-[0.66rem] uppercase tracking-[0.22em] text-white/36">
                                Node Creator
                              </p>

                              <div className="mt-4 space-y-3">
                                <Field
                                  label="Name"
                                  value={newNodeName}
                                  onChange={setNewNodeName}
                                />

                                <Field
                                  label="Stage"
                                  value={newNodeStage}
                                  onChange={setNewNodeStage}
                                />

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
                                {selectedNode.type === "hub"
                                  ? "Hub Editor"
                                  : "Card Editor"}
                              </p>

                              <p className="mt-1 text-sm text-white/58">
                                Compact contextual editing, without taking over
                                the workspace.
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
                              <Field
                                label="Label"
                                value={selectedHub.label}
                                onChange={(value) =>
                                  updateSelectedNode({ label: value })
                                }
                              />

                              <Field
                                label="Subtitle"
                                value={selectedHub.subtitle}
                                onChange={(value) =>
                                  updateSelectedNode({ subtitle: value })
                                }
                                multiline
                              />
                            </div>
                          ) : null}

                          {selectedNode.type === "experience" &&
                          selectedCard ? (
                            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                              <Field
                                label="Title"
                                value={selectedCard.title}
                                onChange={(value) =>
                                  updateSelectedNode({ title: value })
                                }
                              />

                              <Field
                                label="Subtitle"
                                value={selectedCard.subtitle}
                                onChange={(value) =>
                                  updateSelectedNode({ subtitle: value })
                                }
                              />

                              <Field
                                label="Period"
                                value={selectedCard.period}
                                onChange={(value) =>
                                  updateSelectedNode({ period: value })
                                }
                              />

                              <Field
                                label="Role"
                                value={selectedCard.role}
                                onChange={(value) =>
                                  updateSelectedNode({ role: value })
                                }
                              />

                              <Field
                                label="Location"
                                value={selectedCard.location}
                                onChange={(value) =>
                                  updateSelectedNode({ location: value })
                                }
                              />

                              <Field
                                label="Stage"
                                value={selectedCard.stage}
                                onChange={(value) =>
                                  updateSelectedNode({ stage: value })
                                }
                              />

                              <Field
                                label="Accent"
                                value={selectedCard.accent}
                                onChange={(value) =>
                                  updateSelectedNode({ accent: value })
                                }
                              />

                              <Field
                                label="Summary"
                                value={selectedCard.summary}
                                onChange={(value) =>
                                  updateSelectedNode({ summary: value })
                                }
                                multiline
                              />

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
        </div>
      </div>

      <style jsx>{`
        .experience-scroll-shell {
          overflow: hidden;
        }

        .experience-scroll-track {
          width: 100%;
        }

        .experience-stage {
          height: 58rem;
        }

        .experience-scene {
          inset: 0;
        }

        @media (max-width: 1023px) {
          .experience-stage {
            height: 48rem;
          }
        }

        @media (max-width: 767px) {
          .experience-scroll-shell {
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }

          .experience-scroll-shell::-webkit-scrollbar {
            display: none;
          }

          .experience-scroll-track {
            width: 980px;
            min-width: 980px;
          }

          .experience-stage {
            height: 46rem;
          }

          .experience-scene {
            inset: 0;
          }
        }

        @media (max-width: 480px) {
          .experience-scroll-track {
            width: 960px;
            min-width: 960px;
          }

          .experience-stage {
            height: 43rem;
          }
        }
      `}</style>
    </section>
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
      <span className="text-[0.66rem] uppercase tracking-[0.22em] text-white/36">
        {label}
      </span>

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