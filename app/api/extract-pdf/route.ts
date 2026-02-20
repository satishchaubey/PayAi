import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "PDF file is required" }, { status: 400 });
  }

  if (!file.type.includes("pdf")) {
    return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
  }

  const maxBytes = 8 * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json({ error: "PDF too large. Max 8MB." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await pdfParse(buffer);
    const text = parsed.text.replace(/\s+/g, " ").trim();

    if (!text) {
      return NextResponse.json({ error: "No readable text found in PDF" }, { status: 422 });
    }

    return NextResponse.json({
      text: text.slice(0, 15000),
      chars: text.length
    });
  } catch {
    return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}
