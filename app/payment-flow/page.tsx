"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import styles from "./payment-flow.module.css";

type GraphNode = {
  id: string;
  icon: string;
  title: string;
  detail: string;
  x: number;
  y: number;
  type?: "normal" | "decision" | "success" | "failure";
};

type GraphEdge = {
  from: string;
  to: string;
  label?: string;
};

const bbpsNodes: GraphNode[] = [
  { id: "customer", icon: "👤", title: "Customer Request", detail: "Biller + account selected", x: 10, y: 45 },
  { id: "biller", icon: "🧾", title: "Bill Fetch", detail: "Outstanding bill fetched", x: 30, y: 22 },
  { id: "validate", icon: "🔐", title: "Validation", detail: "Customer and bill validated", x: 52, y: 45 },
  { id: "pay", icon: "💳", title: "Payment Auth", detail: "UPI/card/netbanking auth", x: 72, y: 22 },
  { id: "settle", icon: "🏦", title: "Settlement", detail: "Bank/biller reconciliation", x: 90, y: 45 }
];

const bbpsEdges: GraphEdge[] = [
  { from: "customer", to: "biller" },
  { from: "biller", to: "validate" },
  { from: "validate", to: "pay" },
  { from: "pay", to: "settle" }
];

const chainNodes: GraphNode[] = [
  { id: "wallet", icon: "👛", title: "Wallet Sign", detail: "User signs transaction", x: 10, y: 45 },
  { id: "mempool", icon: "📡", title: "Network Broadcast", detail: "Transaction in mempool", x: 30, y: 20 },
  { id: "consensus", icon: "🧠", title: "Consensus", detail: "Validators verify tx", x: 52, y: 45 },
  { id: "block", icon: "⛓️", title: "Block Inclusion", detail: "Tx added to new block", x: 72, y: 20 },
  { id: "state", icon: "📘", title: "State Update", detail: "Final balances + logs", x: 90, y: 45 }
];

const chainEdges: GraphEdge[] = [
  { from: "wallet", to: "mempool" },
  { from: "mempool", to: "consensus" },
  { from: "consensus", to: "block" },
  { from: "block", to: "state" }
];

const combinedNodes: GraphNode[] = [
  { id: "auth", icon: "🔑", title: "Generate Token", detail: "POST /v1/auth/token", x: 8, y: 12 },
  { id: "categories", icon: "🧾", title: "Get Biller Categories", detail: "GET /billers/categories/all", x: 20, y: 26 },
  { id: "billerByCategory", icon: "🗂️", title: "Get Billers by Category", detail: "Biller MDM APIs", x: 33, y: 26 },
  { id: "regions", icon: "🌍", title: "Get Biller Regions", detail: "Region/Circle APIs", x: 46, y: 26 },
  { id: "allBillers", icon: "📚", title: "Get All Billers", detail: "Master biller listing", x: 59, y: 26 },
  { id: "billerById", icon: "🆔", title: "Get Biller by Id", detail: "Single biller detail", x: 72, y: 26 },
  { id: "plans", icon: "📦", title: "Fetch Plans", detail: "Plan/Pack APIs", x: 85, y: 26 },
  { id: "billFetch", icon: "📥", title: "Bill Fetch", detail: "INT/MOB/AGT fetch", x: 26, y: 52 },
  { id: "billValidate", icon: "✅", title: "Bill Validation", detail: "Validate request payload", x: 42, y: 52 },
  { id: "billPayment", icon: "💳", title: "Bill Payment", detail: "INT/MOB/AGT pay APIs", x: 58, y: 52 },
  { id: "txnStatus", icon: "📈", title: "Transaction Status", detail: "Payment txn status check", x: 74, y: 52 },
  { id: "complaintRaise", icon: "📣", title: "Raise Complaint", detail: "Register complaint", x: 34, y: 78 },
  { id: "complaintDisposition", icon: "🛠️", title: "Complaint Disposition", detail: "Resolution handling", x: 50, y: 78 },
  { id: "complaintStatus", icon: "🔎", title: "Complaint Status", detail: "Track complaint TAT", x: 66, y: 78 },
  { id: "lpgTrack", icon: "🧯", title: "Track LPG Booking", detail: "LPG booking status API", x: 82, y: 78, type: "success" }
];

const combinedEdges: GraphEdge[] = [
  { from: "auth", to: "categories" },
  { from: "categories", to: "billerByCategory" },
  { from: "billerByCategory", to: "regions" },
  { from: "regions", to: "allBillers" },
  { from: "allBillers", to: "billerById" },
  { from: "billerById", to: "plans" },
  { from: "plans", to: "billFetch" },
  { from: "auth", to: "billFetch", label: "Bearer" },
  { from: "billFetch", to: "billValidate" },
  { from: "billValidate", to: "billPayment" },
  { from: "billPayment", to: "txnStatus" },
  { from: "billPayment", to: "complaintRaise", label: "Issue" },
  { from: "complaintRaise", to: "complaintDisposition" },
  { from: "complaintDisposition", to: "complaintStatus" },
  { from: "txnStatus", to: "complaintStatus", label: "Check" },
  { from: "txnStatus", to: "lpgTrack", label: "v1.4" }
];

function getEdgeEndpoints(a: GraphNode, b: GraphNode) {
  let sx = a.x;
  let sy = a.y;
  let ex = b.x;
  let ey = b.y;
  const dx = b.x - a.x;
  const dy = b.y - a.y;

  if (Math.abs(dx) >= Math.abs(dy)) {
    const padX = 5.2;
    sx += dx >= 0 ? padX : -padX;
    ex += dx >= 0 ? -padX : padX;
  } else {
    const padY = 3.9;
    sy += dy >= 0 ? padY : -padY;
    ey += dy >= 0 ? -padY : padY;
  }

  return { sx, sy, ex, ey };
}

function curvePath(a: GraphNode, b: GraphNode) {
  const { sx, sy, ex, ey } = getEdgeEndpoints(a, b);
  const dx = ex - sx;
  const dy = ey - sy;
  const c1x = sx + dx * 0.35;
  const c2x = sx + dx * 0.65;
  const c1y = sy + dy * 0.08;
  const c2y = ey - dy * 0.08;
  return `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`;
}

function orthogonalPath(a: GraphNode, b: GraphNode) {
  const { sx, sy, ex, ey } = getEdgeEndpoints(a, b);
  const dx = Math.abs(ex - sx);
  const dy = Math.abs(ey - sy);

  if (dy < 2.5 || dx < 2.5) {
    return `M ${sx} ${sy} L ${ex} ${ey}`;
  }

  if (dx >= dy) {
    const midX = sx + (ex - sx) * 0.5;
    return `M ${sx} ${sy} L ${midX} ${sy} L ${midX} ${ey} L ${ex} ${ey}`;
  }

  const midY = sy + (ey - sy) * 0.5;
  return `M ${sx} ${sy} L ${sx} ${midY} L ${ex} ${midY} L ${ex} ${ey}`;
}

function edgeLabelPosition(a: GraphNode, b: GraphNode) {
  const { sx, sy, ex, ey } = getEdgeEndpoints(a, b);
  return {
    x: (sx + ex) / 2,
    y: (sy + ey) / 2 - 2
  };
}

function FlowGraph({
  title,
  chip,
  nodes,
  edges,
  kind
}: {
  title: string;
  chip: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  kind: "bbps" | "chain" | "combined";
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const edgePaths = useMemo(
    () =>
      edges
        .map((edge) => {
          const from = nodes.find((n) => n.id === edge.from);
          const to = nodes.find((n) => n.id === edge.to);
          if (!from || !to) return null;
          return {
            key: `${edge.from}-${edge.to}`,
            d: kind === "combined" ? orthogonalPath(from, to) : curvePath(from, to)
          };
        })
        .filter(Boolean) as Array<{ key: string; d: string }>,
    [edges, nodes, kind]
  );

  useEffect(() => {
    if (!rootRef.current) return;
    const cards = rootRef.current.querySelectorAll("[data-node='true']");
    const lines = rootRef.current.querySelectorAll("[data-edge='true']");
    const trail = rootRef.current.querySelectorAll("[data-trail='true']");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 22, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );

      gsap.fromTo(
        lines,
        { strokeDashoffset: 220 },
        { strokeDashoffset: 0, duration: 1.1, stagger: 0.08, ease: "power1.out" }
      );

      gsap.to(trail, {
        strokeDashoffset: -120,
        duration: 1.5,
        repeat: -1,
        ease: "none",
        stagger: 0.1
      });
    }, rootRef);

    return () => ctx.revert();
  }, [edgePaths.length]);

  return (
    <section className={styles.flowSection}>
      <header className={styles.head}>
        <h2>{title}</h2>
        <span>{chip}</span>
      </header>

      <div
        className={`${styles.board} ${kind === "chain" ? styles.chainBoard : ""} ${kind === "combined" ? styles.combinedBoard : ""}`}
        ref={rootRef}
      >
        {kind === "combined" ? (
          <div className={styles.lanes} aria-hidden="true">
            <div className={styles.laneServices}><span>Authentication + Biller Master APIs</span></div>
            <div className={styles.laneAuth}><span>Core Billing APIs (Fetch/Validate/Pay/Status)</span></div>
            <div className={styles.lanePayment}><span>Complaint + LPG Tracking APIs</span></div>
          </div>
        ) : null}
        <svg viewBox="0 0 100 65" preserveAspectRatio="none" className={styles.svg}>
          {edgePaths.map((edge) => {
            const found = edges.find((e) => `${e.from}-${e.to}` === edge.key);
            const from = found ? nodes.find((n) => n.id === found.from) : null;
            const to = found ? nodes.find((n) => n.id === found.to) : null;
            const pos = from && to ? edgeLabelPosition(from, to) : null;
            return (
              <g key={edge.key}>
                <path d={edge.d} className={styles.edge} data-edge="true" />
                <path d={edge.d} className={styles.trail} data-trail="true" />
                {found?.label && pos ? (
                  <foreignObject x={pos.x - 2} y={pos.y - 2.3} width="8" height="4.6">
                    <div className={styles.edgeLabel}>{found.label}</div>
                  </foreignObject>
                ) : null}
              </g>
            );
          })}
        </svg>

        {nodes.map((node, i) => (
          <article
            key={node.id}
            className={`${styles.node} ${
              node.type === "decision"
                ? styles.decisionNode
                : node.type === "success"
                  ? styles.successNode
                  : node.type === "failure"
                    ? styles.failureNode
                    : ""
            }`}
            data-node="true"
            style={
              {
                left: `${node.x}%`,
                top: `${node.y}%`,
                animationDelay: `${i * 0.08}s`
              } as CSSProperties
            }
          >
            <div className={styles.nodeIcon}>{node.icon}</div>
            <h3>{node.title}</h3>
            <p>{node.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function PaymentFlowPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1>Payment Flow Architecture Graph</h1>
        <p>Flowchart view of BBPS bill payments and blockchain transactions with animated edges and execution nodes.</p>
      </section>

      <FlowGraph title="BBPS Bill Payment Graph" chip="Centralized Flow" nodes={bbpsNodes} edges={bbpsEdges} kind="bbps" />
      <FlowGraph
        title="AI (Agent Institution) API Flow Container"
        chip="Based on API Doc v1.4"
        nodes={combinedNodes}
        edges={combinedEdges}
        kind="combined"
      />
      <FlowGraph
        title="Blockchain Transaction Graph"
        chip="Distributed Ledger Flow"
        nodes={chainNodes}
        edges={chainEdges}
        kind="chain"
      />
    </main>
  );
}
