"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";

type ActionType = "sync" | "scheduleMicro" | "scheduleMacro";

type Action = {
  type: ActionType;
  line: string;
  label: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function unquote(value: string): string {
  const v = value.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

function extractConsoleValue(line: string): string {
  const m = line.match(/console\.log\((.+?)\)/);
  return m ? unquote(m[1]) : line;
}

function parseProgram(source: string): Action[] {
  const actions: Action[] = [];
  const lines = source
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !l.startsWith("//"));

  for (const line of lines) {
    if (line.includes("setTimeout(")) {
      actions.push({ type: "scheduleMacro", line, label: extractConsoleValue(line) });
      continue;
    }

    if (line.includes("Promise.resolve") || line.includes(".then(") || line.includes("queueMicrotask(")) {
      actions.push({ type: "scheduleMicro", line, label: extractConsoleValue(line) });
      continue;
    }

    if (line.includes("console.log(")) {
      actions.push({ type: "sync", line, label: extractConsoleValue(line) });
      continue;
    }

    actions.push({ type: "sync", line, label: line.replace(";", "") });
  }

  return actions;
}

export default function EventLoopVisualizer() {
  const initialCode = `console.log("Start");
setTimeout(() => console.log("Timeout Callback"), 0);
Promise.resolve().then(() => console.log("Promise Callback"));
console.log("End");`;

  const [code, setCode] = useState(initialCode);
  const [actions, setActions] = useState<Action[]>(parseProgram(initialCode));
  const [cursor, setCursor] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [callStack, setCallStack] = useState<string[]>([]);
  const [stackInput, setStackInput] = useState("myFunction()");

  const [webApi, setWebApi] = useState<string[]>([]);
  const [microTasks, setMicroTasks] = useState<string[]>([]);
  const [macroTasks, setMacroTasks] = useState<string[]>([]);
  const [callbackQueue, setCallbackQueue] = useState<string[]>([]);

  const [microExecution, setMicroExecution] = useState<string[]>([]);
  const [macroExecution, setMacroExecution] = useState<string[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [status, setStatus] = useState("Click Analyze, then Next Step.");
  const [speed, setSpeed] = useState(1200);
  const [phase, setPhase] = useState("idle");

  const stackRef = useRef<HTMLDivElement>(null);
  const webApiRef = useRef<HTMLDivElement>(null);
  const queueRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const signalRef = useRef<HTMLDivElement>(null);

  const pulse = (target: HTMLDivElement | null) => {
    if (!target) return;
    gsap.fromTo(
      target,
      { boxShadow: "0 0 0 rgba(23,146,255,0)", y: 0 },
      { boxShadow: "0 12px 28px rgba(23,146,255,0.22)", y: -2, duration: 0.25, yoyo: true, repeat: 1 }
    );
  };

  const moveSignal = (step: "stack" | "webapi" | "taskqueues" | "callback" | "idle") => {
    if (!railRef.current || !signalRef.current) return;
    const ratios: Record<string, number> = {
      idle: 0,
      stack: 0.02,
      webapi: 0.33,
      taskqueues: 0.63,
      callback: 0.93
    };
    const track = railRef.current.clientWidth - 24;
    const x = track * ratios[step];
    gsap.to(signalRef.current, { x, duration: 0.45, ease: "power2.out" });
  };

  useEffect(() => {
    const boxes = [stackRef.current, webApiRef.current, queueRef.current].filter(Boolean) as HTMLDivElement[];
    const tween = gsap.to(boxes, {
      y: -2,
      duration: 2.2,
      stagger: 0.25,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    moveSignal("idle");
    return () => {
      tween.kill();
    };
  }, []);

  const analyze = () => {
    const parsed = parseProgram(code);
    setActions(parsed);
    setCursor(0);
    setCallStack([]);
    setWebApi([]);
    setMicroTasks([]);
    setMacroTasks([]);
    setCallbackQueue([]);
    setMicroExecution([]);
    setMacroExecution([]);
    setConsoleOutput([]);
    setPhase("idle");
    moveSignal("idle");
    setStatus(`Program parsed: ${parsed.length} steps.`);
  };

  const pushManualFrame = () => {
    const frame = stackInput.trim();
    if (!frame) return;
    setCallStack((prev) => [...prev, frame]);
    setStatus(`Manual push: ${frame}`);
    pulse(stackRef.current);
  };

  const popManualFrame = () => {
    setCallStack((prev) => {
      if (prev.length === 0) return prev;
      setStatus(`Manual pop: ${prev[prev.length - 1]}`);
      return prev.slice(0, -1);
    });
    pulse(stackRef.current);
  };

  const runEventLoopCycle = async () => {
    if (isRunning) return;
    setIsRunning(true);

    if (callStack.length > 0) {
      setStatus("Event loop waits until Call Stack is empty.");
      setIsRunning(false);
      return;
    }

    if (microTasks.length > 0) {
      const task = microTasks[0];
      setMicroTasks((prev) => prev.slice(1));
      setCallbackQueue((prev) => [...prev, `micro: ${task}`]);
      pulse(queueRef.current);
      setPhase("callback");
      moveSignal("callback");
      setStatus("Event loop picked microtask (higher priority).");

      await sleep(speed);
      setCallbackQueue((prev) => prev.slice(0, -1));
      setCallStack((prev) => [...prev, `microtask(${task})`]);
      setMicroExecution((prev) => [...prev, task]);
      setPhase("stack");
      moveSignal("stack");
      pulse(stackRef.current);

      await sleep(speed);
      setCallStack((prev) => prev.slice(0, -1));
      setConsoleOutput((prev) => [...prev, task]);
      setIsRunning(false);
      return;
    }

    if (macroTasks.length > 0) {
      const task = macroTasks[0];
      setMacroTasks((prev) => prev.slice(1));
      setCallbackQueue((prev) => [...prev, `macro: ${task}`]);
      pulse(queueRef.current);
      setPhase("callback");
      moveSignal("callback");
      setStatus("Event loop picked macrotask.");

      await sleep(speed);
      setCallbackQueue((prev) => prev.slice(0, -1));
      setCallStack((prev) => [...prev, `macrotask(${task})`]);
      setMacroExecution((prev) => [...prev, task]);
      setPhase("stack");
      moveSignal("stack");
      pulse(stackRef.current);

      await sleep(speed);
      setCallStack((prev) => prev.slice(0, -1));
      setConsoleOutput((prev) => [...prev, task]);
      setIsRunning(false);
      return;
    }

    setStatus("No pending tasks in micro/macro queues.");
    setIsRunning(false);
  };

  const nextStep = async () => {
    if (isRunning) return;
    if (cursor >= actions.length) {
      setStatus("Code lines complete. Use Event Loop Cycle.");
      return;
    }

    setIsRunning(true);
    const action = actions[cursor];
    setCursor((n) => n + 1);

    const frame = action.type === "sync" ? action.line : `${action.type} scheduler`;
    setCallStack((prev) => [...prev, frame]);
    setPhase("stack");
    moveSignal("stack");
    setStatus(`Executing: ${action.line}`);
    pulse(stackRef.current);

    await sleep(speed);

    if (action.type === "sync") {
      if (action.line.includes("console.log(")) {
        setConsoleOutput((prev) => [...prev, action.label]);
      }
      setCallStack((prev) => prev.slice(0, -1));
      setIsRunning(false);
      return;
    }

    if (action.type === "scheduleMicro") {
      setMicroTasks((prev) => [...prev, action.label]);
      setCallStack((prev) => prev.slice(0, -1));
      setPhase("taskqueues");
      moveSignal("taskqueues");
      setStatus("Microtask queued.");
      pulse(webApiRef.current);
      setIsRunning(false);
      return;
    }

    setWebApi((prev) => [...prev, `timer(${action.label})`]);
    setPhase("webapi");
    moveSignal("webapi");
    pulse(webApiRef.current);
    setStatus("Callback moved to Web API timer.");

    await sleep(speed);

    setWebApi((prev) => prev.slice(0, -1));
    setMacroTasks((prev) => [...prev, action.label]);
    setPhase("taskqueues");
    moveSignal("taskqueues");
    setCallStack((prev) => prev.slice(0, -1));
    setStatus("Macrotask queued from Web API.");
    setIsRunning(false);
  };

  const reset = () => {
    setCursor(0);
    setCallStack([]);
    setWebApi([]);
    setMicroTasks([]);
    setMacroTasks([]);
    setCallbackQueue([]);
    setMicroExecution([]);
    setMacroExecution([]);
    setConsoleOutput([]);
    setPhase("idle");
    moveSignal("idle");
    setStatus("Runtime reset.");
    setIsRunning(false);
  };

  const remaining = useMemo(() => actions.length - cursor, [actions.length, cursor]);

  return (
    <div className="runtime-shell card">
      <div className="runtime-layout">
        <section className="runtime-editor">
          <h2>Program Editor</h2>
          <p className="runtime-subhead">Write JS and inspect internal execution.</p>
          <div className="flow-legend">
            <span className={phase === "stack" ? "on" : ""}>Call Stack</span>
            <span className={phase === "webapi" ? "on" : ""}>Web APIs</span>
            <span className={phase === "taskqueues" ? "on" : ""}>Task Queues</span>
            <span className={phase === "callback" ? "on" : ""}>Callback Queue</span>
          </div>
          <div className="flow-rail" ref={railRef}>
            <div className="flow-signal" ref={signalRef} />
          </div>
          <textarea className="editor" value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false} />

          <div className="control-row">
            <button onClick={analyze}>Analyze</button>
            <button onClick={nextStep} disabled={isRunning}>Next Step</button>
            <button className="alt" onClick={runEventLoopCycle} disabled={isRunning}>Event Loop Cycle</button>
            <button className="ghost" onClick={reset}>Reset</button>
          </div>

          <div className="speed-row">
            <label htmlFor="speed">Execution speed: {speed}ms</label>
            <input
              id="speed"
              type="range"
              min={600}
              max={2500}
              step={100}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </div>

          <p className="activity-line">{status}</p>
          <p className="runtime-subhead">Remaining parsed steps: {remaining}</p>
        </section>

        <section className="runtime-visuals">
          <div className="runtime-box" ref={stackRef}>
            <h3>Call Stack</h3>
            <div className="stack-controls">
              <input
                className="query-input"
                value={stackInput}
                onChange={(e) => setStackInput(e.target.value)}
                placeholder="myFunction()"
              />
              <button className="ghost" onClick={pushManualFrame}>Push</button>
              <button className="ghost" onClick={popManualFrame}>Pop</button>
            </div>
            <div className="stack">
              <AnimatePresence>
                {callStack.map((item, idx) => (
                  <motion.div key={`${item}-${idx}`} className="pill" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                    {item}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="runtime-box" ref={webApiRef}>
            <h3>Web APIs</h3>
            <div className="queue">
              {webApi.map((item, idx) => (
                <motion.div key={`${item}-${idx}`} className="pill" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {item}
                </motion.div>
              ))}
            </div>
            <div className="line" />
            <h3>Micro Task Execution</h3>
            <div className="queue">
              {microExecution.map((item, idx) => (
                <motion.div key={`${item}-${idx}`} className="pill" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  {item}
                </motion.div>
              ))}
            </div>
            <div className="line" />
            <h3>Macro Task Execution</h3>
            <div className="queue">
              {macroExecution.map((item, idx) => (
                <motion.div key={`${item}-${idx}`} className="pill" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  {item}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="runtime-box" ref={queueRef}>
            <h3>Micro Task Queue</h3>
            <div className="queue">
              {microTasks.map((item, idx) => (
                <motion.div key={`${item}-${idx}`} className="pill" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {item}
                </motion.div>
              ))}
            </div>
            <div className="line" />
            <h3>Macro Task Queue</h3>
            <div className="queue">
              {macroTasks.map((item, idx) => (
                <motion.div key={`${item}-${idx}`} className="pill" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {item}
                </motion.div>
              ))}
            </div>
            <div className="line" />
            <h3>Callback Queue</h3>
            <div className="queue">
              {callbackQueue.map((item, idx) => (
                <motion.div key={`${item}-${idx}`} className="pill" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                  {item}
                </motion.div>
              ))}
            </div>
            <div className="line" />
            <h3>Console Output</h3>
            <div className="console-box">
              {consoleOutput.map((item, idx) => (
                <div key={`${item}-${idx}`} className="console-line">{item}</div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
