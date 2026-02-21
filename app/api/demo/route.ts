import { NextResponse } from "next/server";
import { Resend } from "resend";

type DemoPayload = {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Server email is not configured" }, { status: 500 });
  }

  let body: DemoPayload;

  try {
    body = (await request.json()) as DemoPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const company = body.company?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Valid name is required" }, { status: 400 });
  }

  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  if (!company) {
    return NextResponse.json({ error: "Company is required" }, { status: 400 });
  }

  if (!message || message.length < 10) {
    return NextResponse.json({ error: "Message should be at least 10 characters" }, { status: 400 });
  }

  const resend = new Resend(apiKey);
  const to = process.env.DEMO_TO_EMAIL || "satishchaubey02@gmail.com";
  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject: `Demo Request from ${company}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nMessage:\n${message}`
    });

    if (result.error) {
      return NextResponse.json({ error: result.error.message || "Resend rejected the email request" }, { status: 502 });
    }

    return NextResponse.json({ message: "Demo request sent successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send email via Resend";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
