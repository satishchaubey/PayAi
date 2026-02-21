"use client";

import { useEffect, useState } from "react";

type Topic = {
  id: string;
  title: string;
  definition: string;
};

const topics: Topic[] = [
  {
    id: "call-stack",
    title: "Call Stack Fundamentals",
    definition:
      "The call stack is a LIFO structure where function frames are pushed on invocation and popped on return. Deep sync recursion can overflow the stack."
  },
  {
    id: "web-apis",
    title: "Web APIs and Async Offloading",
    definition:
      "Timers, network requests, and DOM events run outside the JS engine in browser APIs, then schedule callbacks back to queues when work completes."
  },
  {
    id: "micro-vs-macro",
    title: "Microtasks vs Macrotasks",
    definition:
      "Microtasks (Promise callbacks, queueMicrotask) run before the next macrotask (setTimeout, I/O), so they can starve rendering if overused."
  },
  {
    id: "event-loop-cycle",
    title: "Callback Queue and Event Loop Cycle",
    definition:
      "The event loop checks whether the call stack is empty, then pulls ready tasks from queues and executes them in order by scheduling rules."
  },
  {
    id: "promise-order",
    title: "Promise Resolution Order",
    definition:
      "Promise chains preserve registration order within microtasks. `then` handlers run after current sync code and before timer callbacks."
  },
  {
    id: "timeout-reality",
    title: "setTimeout Timing Reality",
    definition:
      "setTimeout delay is a minimum threshold, not exact execution time. Actual run time depends on call stack load, tab throttling, and queue backlog."
  },
  {
    id: "execution-context",
    title: "Execution Context and Function Frames",
    definition:
      "Each function call gets an execution context containing scope references, variables, and `this` binding. Frames map these contexts on the stack."
  },
  {
    id: "runtime-tracing",
    title: "Real-Time Code Tracing with Visual Runtime",
    definition:
      "Runtime tracing visualizes stack and queue transitions per code step, making async ordering and callback timing easier to reason about."
  }
];

const TOPIC_PREF_KEY = "js_internals_selected_topic_v1";
const TOPIC_IDS = topics.map((topic) => topic.id);

function TopicGraph({ id }: { id: string }) {
  if (id === "call-stack" || id === "execution-context") {
    return (
      <svg className="topic-graph-svg" viewBox="0 0 220 120" aria-hidden="true">
        <rect className="topic-bar a" x="38" y="72" width="148" height="16" rx="5" />
        <rect className="topic-bar b" x="52" y="52" width="120" height="14" rx="5" />
        <rect className="topic-bar c" x="68" y="34" width="90" height="12" rx="5" />
        <rect className="topic-bar d" x="80" y="18" width="64" height="10" rx="5" />
      </svg>
    );
  }

  if (id === "micro-vs-macro" || id === "promise-order") {
    return (
      <svg className="topic-graph-svg" viewBox="0 0 220 120" aria-hidden="true">
        <rect className="topic-pill micro" x="26" y="44" width="70" height="24" rx="12" />
        <rect className="topic-pill micro" x="102" y="44" width="70" height="24" rx="12" />
        <rect className="topic-pill macro" x="178" y="44" width="24" height="24" rx="12" />
        <path className="topic-path" d="M22 86 L198 86" />
        <circle className="topic-pulse" cx="26" cy="86" r="5" />
      </svg>
    );
  }

  return (
    <svg className="topic-graph-svg" viewBox="0 0 220 120" aria-hidden="true">
      <circle className="topic-node one" cx="36" cy="60" r="10" />
      <circle className="topic-node two" cx="110" cy="24" r="10" />
      <circle className="topic-node three" cx="110" cy="96" r="10" />
      <circle className="topic-node four" cx="184" cy="60" r="10" />
      <path className="topic-path" d="M46 60 L100 24" />
      <path className="topic-path" d="M46 60 L100 96" />
      <path className="topic-path" d="M120 24 L174 60" />
      <path className="topic-path" d="M120 96 L174 60" />
    </svg>
  );
}

export default function JsInternalsTopics() {
  const [activeId, setActiveId] = useState(topics[0].id);

  useEffect(() => {
    const stored = localStorage.getItem(TOPIC_PREF_KEY);
    if (stored && TOPIC_IDS.includes(stored)) {
      setActiveId(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(TOPIC_PREF_KEY, activeId);
  }, [activeId]);

  const activeTopic = topics.find((topic) => topic.id === activeId) ?? topics[0];

  return (
    <>
      <div className="topic-grid" role="tablist" aria-label="JavaScript internals topics">
        {topics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            role="tab"
            aria-selected={activeId === topic.id}
            className={activeId === topic.id ? "topic-card topic-card-active" : "topic-card"}
            onClick={() => setActiveId(topic.id)}
          >
            {topic.title}
          </button>
        ))}
      </div>

      <section className="topic-panel" role="tabpanel" aria-live="polite">
        <h3>{activeTopic.title}</h3>
        <p>{activeTopic.definition}</p>
        <div className="topic-graph-wrap">
          <TopicGraph id={activeTopic.id} />
        </div>
      </section>
    </>
  );
}
