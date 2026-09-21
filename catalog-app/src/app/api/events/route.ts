import { NextResponse } from "next/server";
import { appendLocalRecord } from "@/lib/local-store";

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    event?: unknown;
    payload?: unknown;
  };

  if (typeof payload.event !== "string" || !payload.event.trim()) {
    return NextResponse.json({ error: "Missing event name." }, { status: 400 });
  }

  await appendLocalRecord("events", {
    event: payload.event.trim().slice(0, 80),
    payload:
      payload.payload && typeof payload.payload === "object" ? payload.payload : {},
    mode: "local-prototype",
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
