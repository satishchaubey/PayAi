"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

const chain = ["myObj", "Animal.prototype", "Object.prototype", "null"];

export default function PrototypeVisualizer() {
  const [needle, setNeedle] = useState("speak");
  const [hitAt, setHitAt] = useState(1);

  const runLookup = () => {
    const mapping: Record<string, number> = {
      name: 0,
      speak: 1,
      toString: 2,
      missing: 3
    };

    const found = mapping[needle] ?? 3;
    setHitAt(found);

    const target = document.querySelector(`#proto-${found}`);
    if (target) {
      gsap.fromTo(target, { scale: 0.96, backgroundColor: "#fff1c7" }, { scale: 1, backgroundColor: "#ffffff", duration: 0.55 });
    }
  };

  return (
    <div className="card">
      <span className="badge">Object Model</span>
      <h2>Prototype Chain Lookup</h2>
      <p>Visualize where property resolution stops while JavaScript walks up the prototype chain.</p>
      <div className="control-row">
        <button onClick={runLookup}>Resolve Property</button>
        <button className="ghost" onClick={() => setNeedle("name")}>name</button>
        <button className="ghost" onClick={() => setNeedle("speak")}>speak</button>
        <button className="ghost" onClick={() => setNeedle("toString")}>toString</button>
        <button className="ghost" onClick={() => setNeedle("missing")}>missing</button>
      </div>
      <div className="diagram">
        <p style={{ marginTop: 0 }}>
          lookup: <strong>{needle}</strong>
        </p>
        {chain.map((node, idx) => (
          <motion.div
            key={node}
            id={`proto-${idx}`}
            className="pill"
            initial={false}
            animate={{ borderColor: idx === hitAt ? "#1792ff" : "rgba(16,34,58,0.12)", x: idx === hitAt ? 8 : 0 }}
            transition={{ duration: 0.25 }}
            style={{ marginBottom: 8 }}
          >
            {node}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
