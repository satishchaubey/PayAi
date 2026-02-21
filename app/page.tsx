"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import styles from "./landing.module.css";
import WelcomeThreeScene from "@/components/WelcomeThreeScene";

const routeCards = [
  {
    title: "BBPS Assistant",
    detail: "Real-time AI chat for BBPS workflows, PDFs, image context, and Sarvam-backed responses.",
    href: "/bbps-assistant",
    tone: "a"
  },
  {
    title: "Payment Flow Graph",
    detail: "Graph-based BBPS + blockchain API flow with animated connectors and branch states.",
    href: "/payment-flow",
    tone: "b"
  },
  {
    title: "JS Internals Lab",
    detail: "Interactive editor to visualize call stack, microtasks, macrotasks, web APIs, and callback queues.",
    href: "/js-internals",
    tone: "c"
  },
  {
    title: "Company Solution UI",
    detail: "Enterprise solution page with architecture and validated demo booking workflows.",
    href: "/company-solutions",
    tone: "d"
  },
  {
    title: "Portfolio Journey",
    detail: "3D-inspired personal showcase including skills tree, work history, and project highlights.",
    href: "/journey",
    tone: "e"
  }
] as const;

const roadmapLeft = [
  "API Authentication",
  "Biller Categories",
  "Get Billers by Category",
  "Bill Fetch",
  "Bill Validation"
];

const roadmapRight = [
  "Bill Payment",
  "Transaction Status",
  "Raise Complaint",
  "Complaint Status",
  "Track LPG Booking"
];

const bbpsLeft = [
  "Select Biller",
  "Enter Consumer Number",
  "Fetch Outstanding Bill",
  "Validate Parameters"
];

const bbpsRight = [
  "Choose Payment Mode",
  "Process Through Gateway",
  "Settlement & Reconciliation",
  "Generate Receipt + Notify User"
];

const WELCOME_SEEN_KEY = "payai_home_welcome_seen_v1";

export default function LandingPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      const hasSeenWelcome = localStorage.getItem(WELCOME_SEEN_KEY) === "1";
      if (!hasSeenWelcome) {
        setShowWelcome(true);
        localStorage.setItem(WELCOME_SEEN_KEY, "1");
      }
    } catch {
      // If storage is blocked, fall back to showing welcome once for this render.
      setShowWelcome(true);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!showWelcome) return;
    const timer = window.setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [showWelcome]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (showWelcome) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prev || "";
    }
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [showWelcome]);

  useEffect(() => {
    if (showWelcome) return;
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero='title']",
        { y: 32, opacity: 0, rotateX: -18 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.9, ease: "power3.out" }
      );

      gsap.fromTo(
        "[data-hero='sub']",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, delay: 0.12, duration: 0.8, ease: "power2.out" }
      );

      gsap.fromTo(
        "[data-card='route']",
        { y: 20, opacity: 0, rotateX: -12 },
        { y: 0, opacity: 1, rotateX: 0, stagger: 0.08, delay: 0.2, duration: 0.68, ease: "power2.out" }
      );

      gsap.fromTo(
        "[data-road='item']",
        { opacity: 0, x: -18 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.06, delay: 0.28, ease: "power2.out" }
      );

      gsap.fromTo(
        "[data-node='core']",
        { opacity: 0, scale: 0.86 },
        { opacity: 1, scale: 1, duration: 0.55, stagger: 0.12, delay: 0.36, ease: "back.out(1.6)" }
      );

      gsap.to("[data-float='one']", {
        y: -10,
        x: 6,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to("[data-orbit='ring']", {
        rotate: 360,
        transformOrigin: "50% 50%",
        duration: 26,
        repeat: -1,
        ease: "none"
      });

      gsap.to("[data-orbit='ring-rev']", {
        rotate: -360,
        transformOrigin: "50% 50%",
        duration: 20,
        repeat: -1,
        ease: "none"
      });

      gsap.fromTo(
        "[data-front='node']",
        { scale: 0.82, opacity: 0.6 },
        { scale: 1, opacity: 1, duration: 0.9, yoyo: true, repeat: -1, stagger: 0.16, ease: "sine.inOut" }
      );

      gsap.fromTo(
        "[data-front='metric']",
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, delay: 0.22, stagger: 0.1, ease: "power2.out" }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [showWelcome]);

  if (!isReady) return null;

  if (showWelcome) {
    return (
      <main className={styles.welcomePage}>
        <div className={styles.welcomeScene}>
          <WelcomeThreeScene className={styles.welcomeCanvas} />

          <div className={styles.welcomeChrome}>
            <div className={styles.chromeTop}>
              <div className={styles.chromeDots}>
                <span />
                <span />
                <span />
              </div>
              <div className={styles.chromeBar} />
              <div className={styles.chromeMenu}>
                <span />
                <span />
              </div>
            </div>

            <div className={styles.verticalBrand}>PayAi</div>

            <div className={styles.welcomeOverlay}>
              <span className={styles.welcomeKicker}>Welcome</span>
              <h1>PayAi Platform</h1>
              <p>Booting 3D intelligence layer for payment systems...</p>
              <div className={styles.welcomeLoader}>
                <span />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page} ref={rootRef}>
      <section className={styles.bugHero}>
        <span className={styles.kicker}>LLM Engineering Layer</span>
        <h2>How AI Reduces Bugs Before They Reach Production</h2>
        <p>
          We use LLM-driven checks to catch logic mistakes, edge-case misses, schema mismatches, and unsafe API usage
          early in the development lifecycle.
        </p>
        <div className={styles.bugGrid}>
          <article>
            <strong>Prompted Code Review</strong>
            <p>LLMs scan PR code for risky patterns, missing validations, and async-flow breakpoints.</p>
          </article>
          <article>
            <strong>Test Case Expansion</strong>
            <p>AI generates boundary and failure-path tests developers usually miss under delivery pressure.</p>
          </article>
          <article>
            <strong>Contract Safety</strong>
            <p>Request/response payload checks prevent API integration bugs before runtime failures happen.</p>
          </article>
          <article>
            <strong>Regression Guardrails</strong>
            <p>LLM summaries highlight high-risk changes so teams can focus QA on the right modules.</p>
          </article>
        </div>
      </section>

      <section className={styles.hero}>
        <div className={styles.copy}>
          <span className={styles.kicker}>PayAi Platform</span>
          <h1 data-hero="title">Build, Visualize, Simulate, and Ship Complex Payment Intelligence</h1>
          <p data-hero="sub">
            One workspace for BBPS AI assistant, architecture-level API flow mapping, JavaScript internals simulation,
            and enterprise solution demos.
          </p>
          <div className={styles.actions}>
            <Link href="/bbps-assistant" className={styles.btnPrimary}>
              Launch BBPS Assistant
            </Link>
            <Link href="/payment-flow" className={styles.btnGhost}>
              Open API Flow Graph
            </Link>
          </div>
        </div>

        <div className={styles.stage3d}>
          <div className={styles.sceneGlow} />
          <div className={`${styles.orbitRing} ${styles.orbitRingA}`} data-orbit="ring" />
          <div className={`${styles.orbitRing} ${styles.orbitRingB}`} data-orbit="ring-rev" />
          <div className={styles.coreSphere} data-float="one" />

          <div className={`${styles.orbitNode} ${styles.nodeA}`} data-front="node">AI</div>
          <div className={`${styles.orbitNode} ${styles.nodeB}`} data-front="node">API</div>
          <div className={`${styles.orbitNode} ${styles.nodeC}`} data-front="node">Flow</div>
          <div className={`${styles.orbitNode} ${styles.nodeD}`} data-front="node">Ops</div>

          <article className={`${styles.metricTile} ${styles.metricA}`} data-front="metric">
            <strong>99.2%</strong>
            <p>Validation Accuracy</p>
          </article>
          <article className={`${styles.metricTile} ${styles.metricB}`} data-front="metric">
            <strong>4 Layers</strong>
            <p>AI Safety Guardrails</p>
          </article>
          <article className={`${styles.metricTile} ${styles.metricC}`} data-front="metric">
            <strong>Real-time</strong>
            <p>Flow + Queue Insights</p>
          </article>
        </div>
      </section>

      <section className={styles.roadmap}>
        <h2>AI API Roadmap Flow</h2>
        <div className={styles.roadCanvas}>
          <div className={styles.leftRail}>
            {roadmapLeft.map((item) => (
              <article key={item} className={styles.railCard} data-road="item">
                {item}
              </article>
            ))}
          </div>

          <div className={styles.coreRail}>
            <div className={styles.coreLine} />
            <div className={styles.coreNode} data-node="core">Introduction</div>
            <div className={styles.coreNode} data-node="core">Pre-trained Models</div>
            <div className={styles.coreNode} data-node="core">Open AI Platform</div>
          </div>

          <div className={styles.rightRail}>
            {roadmapRight.map((item) => (
              <article key={item} className={styles.railCard} data-road="item">
                {item}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.roadmap} ${styles.bbpsRoadmap}`}>
        <h2>BBPS End-to-End Flow</h2>
        <div className={styles.roadCanvas}>
          <div className={styles.leftRail}>
            {bbpsLeft.map((item) => (
              <article key={item} className={styles.railCard} data-road="item">
                {item}
              </article>
            ))}
          </div>

          <div className={styles.coreRail}>
            <div className={styles.coreLine} />
            <div className={styles.coreNode} data-node="core">Bill Discovery</div>
            <div className={styles.coreNode} data-node="core">Validation Layer</div>
            <div className={styles.coreNode} data-node="core">Payment Execution</div>
            <div className={styles.coreNode} data-node="core">Success & Tracking</div>
          </div>

          <div className={styles.rightRail}>
            {bbpsRight.map((item) => (
              <article key={item} className={styles.railCard} data-road="item">
                {item}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.grid}>
        {routeCards.map((card) => (
          <Link
            href={card.href}
            key={card.title}
            className={`${styles.routeCard} ${styles[`tone_${card.tone}`]}`}
            data-card="route"
          >
            <h2>{card.title}</h2>
            <p>{card.detail}</p>
            <span>Explore</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
