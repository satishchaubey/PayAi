"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import styles from "./bbps.module.css";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type DocContext = {
  id: string;
  name: string;
  source: "pdf" | "image";
  text: string;
};

const starters = [
  "What is BBPS and who regulates it?",
  "How does bill validation and confirmation work in BBPS?",
  "Explain BBPS transaction lifecycle from request to settlement",
  "What are common BBPS payment failure reasons and recovery steps?",
  "How do refunds and reversals work in BBPS?"
];

const STORAGE_KEY = "bbps_last_conversation_v1";
const TTL_MS = 15 * 60 * 1000;
const DEFAULT_ASSISTANT_MESSAGE =
  "Ask me anything about BBPS payments: flow, failure handling, refunds, settlement, compliance, and customer support operations.";

export default function BBPSAIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: DEFAULT_ASSISTANT_MESSAGE
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [contexts, setContexts] = useState<DocContext[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(15 * 60);
  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const hydratedRef = useRef(false);
  const expiredRef = useRef(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  useEffect(() => {
    if (!chatBodyRef.current) return;
    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [messages, loading]);

  const clearConversation = (reason?: string) => {
    setMessages([{ role: "assistant", content: reason ?? DEFAULT_ASSISTANT_MESSAGE }]);
    setContexts([]);
    setRemainingSeconds(15 * 60);
    setSessionStartedAt(null);
    expiredRef.current = false;
    localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      hydratedRef.current = true;
      return;
    }

    try {
      const parsed = JSON.parse(raw) as {
        savedAt: number;
        startedAt?: number | null;
        messages: ChatMessage[];
        contexts: DocContext[];
      };
      const startedAt = parsed.startedAt ?? null;
      const age = startedAt ? Date.now() - startedAt : 0;

      if (startedAt && age >= TTL_MS) {
        localStorage.removeItem(STORAGE_KEY);
        setUploadMessage("Previous conversation expired after 15 minutes.");
      } else {
        if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
          setMessages(parsed.messages);
        }
        if (Array.isArray(parsed.contexts)) {
          setContexts(parsed.contexts);
        }
        setSessionStartedAt(startedAt);
        setRemainingSeconds(startedAt ? Math.floor((TTL_MS - age) / 1000) : 15 * 60);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      hydratedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    const payload = {
      savedAt: Date.now(),
      startedAt: sessionStartedAt,
      messages,
      contexts
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [messages, contexts, sessionStartedAt]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      try {
        const parsed = JSON.parse(raw) as { startedAt?: number | null };
        if (!parsed.startedAt) return;
        const age = Date.now() - parsed.startedAt;
        const left = Math.max(0, Math.floor((TTL_MS - age) / 1000));
        setRemainingSeconds(left);

        if (left === 0 && !expiredRef.current) {
          expiredRef.current = true;
          clearConversation("Last conversation expired after 15 minutes. Start a new query.");
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const animateAssistantText = async (fullText: string) => {
    const chunk = 3;
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    for (let i = 0; i < fullText.length; i += chunk) {
      const part = fullText.slice(0, i + chunk);
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", content: part };
        return next;
      });
      await new Promise((resolve) => setTimeout(resolve, 16));
    }
  };

  const runImageOcr = async (file: File) => {
    const { createWorker } = await import("tesseract.js");
    const worker = await createWorker("eng");
    const {
      data: { text }
    } = await worker.recognize(file);
    await worker.terminate();
    return text.replace(/\s+/g, " ").trim();
  };

  const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadMessage("Processing document...");

    try {
      for (const file of Array.from(files)) {
        const id = `${file.name}-${Date.now()}`;

        if (file.type.includes("pdf")) {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/extract-pdf", {
            method: "POST",
            body: formData
          });

          const payload = (await res.json()) as { text?: string; error?: string };

          if (!res.ok || !payload.text) {
            setUploadMessage(payload.error ?? `Failed to parse ${file.name}`);
            continue;
          }

          setContexts((prev) => [...prev, { id, name: file.name, source: "pdf", text: payload.text }]);
          setUploadMessage(`Added PDF context: ${file.name}`);
          continue;
        }

        if (file.type.startsWith("image/")) {
          const text = await runImageOcr(file);
          if (!text) {
            setUploadMessage(`No readable text found in ${file.name}`);
            continue;
          }

          setContexts((prev) => [...prev, { id, name: file.name, source: "image", text: text.slice(0, 7000) }]);
          setUploadMessage(`Added image OCR context: ${file.name}`);
          continue;
        }

        setUploadMessage(`Unsupported file: ${file.name}`);
      }
    } catch {
      setUploadMessage("Failed to process uploaded file");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const openPdfPicker = () => {
    pdfInputRef.current?.click();
  };

  const openImagePicker = () => {
    imageInputRef.current?.click();
  };

  const removeContext = (id: string) => {
    setContexts((prev) => prev.filter((item) => item.id !== id));
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    const nextMessages = [...messages, { role: "user", content: query } as ChatMessage];
    setMessages(nextMessages);
    if (!sessionStartedAt) {
      setSessionStartedAt(Date.now());
      setRemainingSeconds(15 * 60);
    }
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/bbps-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          contexts: contexts.map((item) => ({ name: item.name, source: item.source, text: item.text }))
        })
      });

      const payload = (await res.json()) as { answer?: string; error?: string };

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: payload.error ?? "Unable to process your BBPS query right now." }
        ]);
        return;
      }

      if (!payload.answer) {
        setMessages((prev) => [...prev, { role: "assistant", content: "No AI response received." }]);
        return;
      }

      await animateAssistantText(payload.answer);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error while contacting BBPS AI service." }]);
    } finally {
      setLoading(false);
    }
  };

  const useStarter = (text: string) => {
    setInput(text);
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1>AI Assistant</h1>
        <p>Real-time GenAI conversations for Bharat Bill Payment System queries with PDF/Image context.</p>
      </section>

      <section className={styles.layout}>
        <aside className={styles.side}>
          <h2>Try These Queries</h2>
          <div className={styles.starters}>
            {starters.map((item) => (
              <button key={item} onClick={() => useStarter(item)}>
                {item}
              </button>
            ))}
          </div>
        </aside>

        <section className={styles.chatPanel}>
          <div className={styles.uploadBar}>
            <div className={styles.iconActions}>
              <button type="button" className={styles.uploadIconBtn} onClick={openPdfPicker} disabled={uploading}>
                <span className={styles.iconWrap} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.7"/>
                    <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.7"/>
                    <path d="M8 14h8M8 18h6" stroke="currentColor" strokeWidth="1.7"/>
                  </svg>
                </span>
                PDF
              </button>

              <button type="button" className={styles.uploadIconBtn} onClick={openImagePicker} disabled={uploading}>
                <span className={styles.iconWrap} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7"/>
                    <circle cx="9" cy="10" r="1.7" stroke="currentColor" strokeWidth="1.7"/>
                    <path d="M6 16l4-4 3 3 2-2 3 3" stroke="currentColor" strokeWidth="1.7"/>
                  </svg>
                </span>
                Image
              </button>
            </div>

            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              multiple
              onChange={onUpload}
              disabled={uploading}
              className={styles.hiddenInput}
            />
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={onUpload}
              disabled={uploading}
              className={styles.hiddenInput}
            />
            <p>{uploadMessage}</p>
          </div>
          <div className={styles.sessionRow}>
            <span className={styles.sessionBadge}>
              {sessionStartedAt
                ? `Session resets in ${Math.floor(remainingSeconds / 60)}:${String(remainingSeconds % 60).padStart(2, "0")}`
                : "Session timer starts on first message"}
            </span>
            <button type="button" className={styles.clearBtn} onClick={() => clearConversation("Conversation cleared.")}>
              Clear Chat
            </button>
          </div>

          {contexts.length > 0 ? (
            <div className={styles.contexts}>
              {contexts.map((ctx) => (
                <div key={ctx.id} className={styles.contextItem}>
                  <span>{ctx.source.toUpperCase()}: {ctx.name}</span>
                  <button onClick={() => removeContext(ctx.id)}>Remove</button>
                </div>
              ))}
            </div>
          ) : null}

          <div className={styles.chatBody} ref={chatBodyRef}>
            {messages.map((msg, idx) => (
              <div key={`${msg.role}-${idx}`} className={msg.role === "user" ? styles.userMsg : styles.aiMsg}>
                <strong>{msg.role === "user" ? "You" : "BBPS AI"}</strong>
                <p>{msg.content}</p>
              </div>
            ))}
            {loading ? <p className={styles.typing}>Thinking...</p> : null}
          </div>

          <form className={styles.form} onSubmit={sendMessage}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about BBPS flow, failures, reconciliation, chargeback, settlement..."
              rows={3}
            />
            <button type="submit" disabled={!canSend}>
              Send
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}
