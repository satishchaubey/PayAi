"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Mode = "implicit" | "explicit" | "new" | "arrow";

const outputs: Record<Mode, string> = {
  implicit: "obj.show() -> this === obj",
  explicit: "show.call(admin) -> this === admin",
  new: "new Show() -> this is new instance",
  arrow: "arrow fn -> this from lexical parent"
};

export default function ThisBindingVisualizer() {
  const [mode, setMode] = useState<Mode>("implicit");

  return (
    <div className="card">
      <span className="badge">Function Context</span>
      <h2>`this` Binding Visuals</h2>
      <p>Switch invocation style to see how JavaScript chooses the `this` value.</p>
      <div className="control-row">
        <button className={mode === "implicit" ? "alt" : "ghost"} onClick={() => setMode("implicit")}>Implicit</button>
        <button className={mode === "explicit" ? "alt" : "ghost"} onClick={() => setMode("explicit")}>call/apply</button>
        <button className={mode === "new" ? "alt" : "ghost"} onClick={() => setMode("new")}>new</button>
        <button className={mode === "arrow" ? "alt" : "ghost"} onClick={() => setMode("arrow")}>Arrow</button>
      </div>
      <div className="diagram">
        <motion.div
          key={mode}
          className="pill"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24 }}
          style={{ marginBottom: 10 }}
        >
          {outputs[mode]}
        </motion.div>
        <div className="code">{`const obj = {
  name: "dev",
  show() {
    return this.name;
  }
};`}</div>
      </div>
    </div>
  );
}
