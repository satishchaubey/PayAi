"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import gsap from "gsap";
import styles from "./solutions.module.css";

type DemoForm = {
  name: string;
  email: string;
  company: string;
  message: string;
};

const pillars = [
  {
    title: "Customer Onboarding",
    text: "Guide users from first touch to activation with clear assisted flows.",
    value: "32% Faster"
  },
  {
    title: "Issue Resolution",
    text: "Route tickets automatically and visualize progress by team and SLA.",
    value: "48% Lower TAT"
  },
  {
    title: "Retention Engine",
    text: "Detect risk patterns and trigger personalized win-back journeys.",
    value: "21% Better Retention"
  }
];

const stages = ["Discovery", "Design", "Integration", "Deployment", "Optimization"];

export default function CompanySolutionsPage() {
  const orbitRef = useRef<HTMLDivElement>(null);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isArchOpen, setIsArchOpen] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<DemoForm>();

  useEffect(() => {
    if (!orbitRef.current) return;
    const tween = gsap.to(orbitRef.current, {
      rotate: 360,
      transformOrigin: "50% 50%",
      duration: 20,
      repeat: -1,
      ease: "none"
    });

    return () => tween.kill();
  }, []);

  const onDemoSubmit = async (data: DemoForm) => {
    setSubmitState("loading");
    setSubmitMessage("");

    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const payload = (await res.json()) as { error?: string; message?: string };

      if (!res.ok) {
        setSubmitState("error");
        setSubmitMessage(payload.error ?? "Failed to send demo request");
        return;
      }

      setSubmitState("success");
      setSubmitMessage(payload.message ?? "Demo request sent successfully");
      reset();
      window.setTimeout(() => {
        setIsDemoOpen(false);
        setSubmitState("idle");
        setSubmitMessage("");
      }, 1000);
    } catch {
      setSubmitState("error");
      setSubmitMessage("Network error while sending demo request");
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span className={styles.kicker}>Enterprise CX Studio</span>
          <h1>Customer Solution System for Modern Companies</h1>
          <p>
            We build production-ready customer workflows where support, engagement, and recovery are visible in one UI.
          </p>
          <div className={styles.actions}>
            <button onClick={() => setIsDemoOpen(true)}>Book Demo</button>
            <button className={styles.ghost} onClick={() => setIsArchOpen(true)}>
              See Architecture
            </button>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.orbit} ref={orbitRef}>
            <span />
            <span />
            <span />
          </div>
          <div className={styles.core}>
            <strong>Customer 360</strong>
            <p>Signals + Actions + Outcomes</p>
          </div>
        </div>
      </section>

      <section className={styles.grid3}>
        {pillars.map((item, i) => (
          <motion.article
            key={item.title}
            className={styles.card}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
          >
            <h2>{item.title}</h2>
            <p>{item.text}</p>
            <strong>{item.value}</strong>
          </motion.article>
        ))}
      </section>

      <section className={styles.pipeline}>
        <h2>How Our Customer Solution Works</h2>
        <div className={styles.stageRow}>
          {stages.map((stage, idx) => (
            <div key={stage} className={styles.stage}>
              <span>{idx + 1}</span>
              <p>{stage}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.tableBlock}>
        <h2>Operational Impact</h2>
        <div className={styles.table}>
          <div className={styles.head}>Metric</div>
          <div className={styles.head}>Before</div>
          <div className={styles.head}>After</div>

          <div>First Response Time</div>
          <div>11h</div>
          <div className={styles.good}>2.5h</div>

          <div>Resolution SLA Breach</div>
          <div>34%</div>
          <div className={styles.good}>8%</div>

          <div>Customer Escalations</div>
          <div>22%</div>
          <div className={styles.good}>6%</div>

          <div>CSAT</div>
          <div>3.7/5</div>
          <div className={styles.good}>4.6/5</div>
        </div>
      </section>

      {isDemoOpen ? (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <div className={styles.modalHead}>
              <h3>Book a Demo</h3>
              <button
                className={styles.close}
                onClick={() => {
                  setIsDemoOpen(false);
                  setSubmitState("idle");
                  setSubmitMessage("");
                }}
              >
                x
              </button>
            </div>
            <form className={styles.form} onSubmit={handleSubmit(onDemoSubmit)}>
              <label>
                Full Name
                <input
                  {...register("name", {
                    required: "Name is required",
                    minLength: { value: 2, message: "Name should be at least 2 characters" }
                  })}
                />
                {errors.name ? <span className={styles.error}>{errors.name.message}</span> : null}
              </label>

              <label>
                Work Email
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email"
                    }
                  })}
                />
                {errors.email ? <span className={styles.error}>{errors.email.message}</span> : null}
              </label>

              <label>
                Company
                <input
                  {...register("company", {
                    required: "Company is required"
                  })}
                />
                {errors.company ? <span className={styles.error}>{errors.company.message}</span> : null}
              </label>

              <label>
                Message
                <textarea
                  rows={4}
                  {...register("message", {
                    required: "Message is required",
                    minLength: { value: 10, message: "Message should be at least 10 characters" }
                  })}
                />
                {errors.message ? <span className={styles.error}>{errors.message.message}</span> : null}
              </label>

              <div className={styles.modalActions}>
                <button type="submit" disabled={submitState === "loading"}>
                  {submitState === "loading" ? "Sending..." : "Send Mail"}
                </button>
                <button
                  type="button"
                  className={styles.ghost}
                  onClick={() => {
                    setIsDemoOpen(false);
                    setSubmitState("idle");
                    setSubmitMessage("");
                  }}
                >
                  Cancel
                </button>
              </div>
              {submitMessage ? (
                <p className={submitState === "success" ? styles.submitOk : styles.submitFail}>{submitMessage}</p>
              ) : null}
            </form>
          </div>
        </div>
      ) : null}

      {isArchOpen ? (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalLarge}>
            <div className={styles.modalHead}>
              <h3>Architecture: Customer Conversations + Conversion</h3>
              <button className={styles.close} onClick={() => setIsArchOpen(false)}>
                x
              </button>
            </div>

            <div className={styles.archGrid}>
              <div>
                <h4>1) Channel Layer</h4>
                <p>Website chat widget, WhatsApp, and in-app support feed user messages into one API gateway.</p>
              </div>
              <div>
                <h4>2) Conversation Engine</h4>
                <p>Session manager stores user context, profile, and previous intents before calling AI services.</p>
              </div>
              <div>
                <h4>3) NotebookLM API Layer</h4>
                <p>
                  Company docs, policy notes, and product FAQs are indexed and queried through NotebookLM APIs to
                  generate grounded responses.
                </p>
              </div>
              <div>
                <h4>4) Conversion Orchestrator</h4>
                <p>
                  Based on intent signals, the system triggers demo booking, callback request, or issue-resolution
                  journeys.
                </p>
              </div>
              <div>
                <h4>5) CRM + Analytics Sync</h4>
                <p>Lead events and outcomes sync to CRM, and dashboards track response quality and conversion rates.</p>
              </div>
              <div>
                <h4>6) Human Escalation</h4>
                <p>Low-confidence answers auto-route to support agents with full chat transcript and recommended reply.</p>
              </div>
            </div>

            <div className={styles.codeBlock}>{`User Query -> API Gateway -> Session Context
-> NotebookLM API (Grounded Response)
-> Conversion Decision Engine
-> CRM / Ticketing / Demo Pipeline`}</div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
