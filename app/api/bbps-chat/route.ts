import { NextResponse } from "next/server";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Payload = {
  messages?: Message[];
  contexts?: Array<{ name?: string; source?: string; text?: string }>;
};

const BBPS_SYSTEM_PROMPT = `You are a BBPS (Bharat Bill Payment System) assistant for India payment operations.
Answer only BBPS and adjacent payment workflow topics:
- BBPS roles (customer, agent, biller, BBPOU, NPCI)
- transaction lifecycle, validation, posting, settlement, reconciliation
- failed transactions, pending status, reversal/refund cases
- compliance, security, and operational controls
Keep answers practical, implementation-oriented, and concise.`;

function normalizeForSarvam(messages: Message[]) {
  const filtered = messages.filter((m) => (m.role === "user" || m.role === "assistant") && m.content.trim().length > 0);
  const firstUserIndex = filtered.findIndex((m) => m.role === "user");
  if (firstUserIndex === -1) return [];

  // Sarvam expects conversation to start from user turn (after system message).
  const trimmed = filtered.slice(firstUserIndex);
  // Keep recent context window to avoid oversized payloads.
  return trimmed.slice(-14);
}

async function generateWithSarvam(messages: Message[], contextBlock: string) {
  const apiKey = process.env.SARVAM_API_KEY;
  const model = process.env.SARVAM_MODEL || "sarvam-m";

  if (!apiKey) return null;

  const conversation = normalizeForSarvam(messages);
  if (conversation.length === 0) return null;

  const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": apiKey
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: `${BBPS_SYSTEM_PROMPT}\n\n${contextBlock}`
        },
        ...conversation
      ]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Sarvam Chat Completions failed: ${errText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content?.trim() ?? null;
}

function fallbackAnswer(query: string) {
  const q = query.toLowerCase();

  if (q.includes("refund") || q.includes("reversal")) {
    return "In BBPS, reversal/refund depends on transaction state. If debit succeeded but biller confirmation failed, raise reconciliation and auto-reversal workflow with TAT tracking. Keep idempotent reference IDs and status polling.";
  }

  if (q.includes("failure") || q.includes("failed") || q.includes("pending")) {
    return "For BBPS failures, track status with txn reference + BBPS ID, classify technical vs business failures, retry safely with idempotency, and trigger customer notification + escalation thresholds.";
  }

  if (q.includes("settlement") || q.includes("reconciliation")) {
    return "BBPS settlement flow should include T+N cycle checks, biller-wise net positions, unmatched transaction bucket, and daily recon reports with exception queues.";
  }

  return `For your BBPS query "${query}", use this flow: bill fetch + validation, payment authorization, transaction reference mapping, status polling, reconciliation, refund/reversal orchestration, and customer communication lifecycle.`;
}

function envSetupHint() {
  if (process.env.NODE_ENV === "production") {
    return "Set SARVAM_API_KEY in Vercel Project Settings -> Environment Variables and redeploy for full real-time GenAI output.";
  }

  return "Set SARVAM_API_KEY in .env.local and restart server for full real-time GenAI output.";
}

export async function POST(request: Request) {
  let payload: Payload;

  try {
    payload = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const messages = payload.messages ?? [];
  const contexts = payload.contexts ?? [];
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content?.trim();

  if (!lastUser) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const hasKey = Boolean(process.env.SARVAM_API_KEY);
  const cleanedContexts = contexts
    .map((ctx) => ({
      name: ctx.name?.trim() || "Uploaded document",
      source: ctx.source?.trim() || "document",
      text: ctx.text?.trim() || ""
    }))
    .filter((ctx) => ctx.text.length > 0)
    .slice(-5);

  const contextBlock =
    cleanedContexts.length > 0
      ? `Uploaded reference context (use this for grounded answers):\n${cleanedContexts
          .map((ctx, idx) => `[${idx + 1}] ${ctx.source.toUpperCase()} - ${ctx.name}: ${ctx.text.slice(0, 3500)}`)
          .join("\n\n")}`
      : "No uploaded context.";

  try {
    const ai = await generateWithSarvam(messages, contextBlock);
    if (ai) return NextResponse.json({ answer: ai });

    if (!hasKey) {
      return NextResponse.json({
        answer: `${fallbackAnswer(lastUser)}\n\n${envSetupHint()}`
      });
    }

    return NextResponse.json({ error: "Sarvam returned empty response" }, { status: 502 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Sarvam provider error";
    return NextResponse.json({
      answer: `${fallbackAnswer(lastUser)}\n\nSarvam provider error: ${message}\n\n${envSetupHint()}`,
      providerError: message
    });
  }
}
