"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type ScopeState = {
  outerCount: number;
  secret: string;
};

export default function ClosureVisualizer() {
  const [scope, setScope] = useState<ScopeState>({ outerCount: 0, secret: "token_42" });
  const [logs, setLogs] = useState<string[]>([]);

  const handler = useMemo(() => {
    const hidden = scope.secret;
    return () => {
      setScope((prev) => ({ ...prev, outerCount: prev.outerCount + 1 }));
      setLogs((prev) => [`closure reads secret -> ${hidden}`, ...prev].slice(0, 4));
    };
  }, [scope.secret]);

  return (
    <div className="card">
      <span className="badge">Lexical Scope</span>
      <h2>Closure Memory</h2>
      <p>The inner function keeps access to outer variables even after outer execution is done.</p>
      <div className="control-row">
        <button onClick={handler}>Call innerFn()</button>
        <button className="alt" onClick={() => setScope((prev) => ({ ...prev, secret: `token_${Math.floor(Math.random() * 100)}` }))}>
          Rotate Secret
        </button>
      </div>
      <div className="diagram">
        <motion.div layout className="pill" style={{ marginBottom: 8 }}>
          outerCount: {scope.outerCount}
        </motion.div>
        <div className="code">{`function outer() {
  const secret = "${scope.secret}";
  return function inner() {
    console.log(secret); // closure keeps reference
  };
}`}</div>
        <div className="line" />
        <strong>Execution Log</strong>
        <div className="stack" style={{ minHeight: 90 }}>
          {logs.map((line, idx) => (
            <motion.div
              key={line + idx}
              className="pill"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
            >
              {line}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
