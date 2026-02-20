import EventLoopVisualizer from "@/components/EventLoopVisualizer";

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
