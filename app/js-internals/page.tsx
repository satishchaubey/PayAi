import type { Metadata } from "next";
import EventLoopVisualizer from "@/components/EventLoopVisualizer";
import { absoluteUrl } from "@/app/seo";

export const metadata: Metadata = {
  title: "JavaScript Internals Lab",
  description:
    "Interactive JavaScript internals visualizer to understand call stack behavior, event loop timing, microtasks, macrotasks, and async execution.",
  alternates: {
    canonical: "/js-internals"
  },
  openGraph: {
    title: "JavaScript Internals Lab | PayAi",
    description: "Visual sandbox for mastering JavaScript runtime behavior and async flows.",
    url: absoluteUrl("/js-internals")
  },
  twitter: {
    card: "summary_large_image",
    title: "JavaScript Internals Lab | PayAi",
    description: "Understand event loop and async execution with an interactive visual playground."
  }
};

const topics = [
  "Call Stack Fundamentals",
  "Web APIs and Async Offloading",
  "Microtasks vs Macrotasks",
  "Callback Queue and Event Loop Cycle",
  "Promise Resolution Order",
  "setTimeout Timing Reality",
  "Execution Context and Function Frames",
  "Real-Time Code Tracing with Visual Runtime"
];

export default function JSInternalsPage() {
  return (
    <main className="page-shell">
      <a className="side-button" href="/company-solutions">
        Company Solution UI
      </a>
      <a className="side-button side-button-second" href="/">
        BBPS Assistant
      </a>
      <section className="learning-hero card">
        <h1>Master JavaScript Internals: From Call Stack to Event Loop</h1>
        <p>Use this reference path while you run code in the simulator.</p>
        <div className="topic-grid">
          {topics.map((topic) => (
            <div key={topic} className="topic-card">
              {topic}
            </div>
          ))}
        </div>
      </section>
      <section className="grid">
        <EventLoopVisualizer />
      </section>
    </main>
  );
}
