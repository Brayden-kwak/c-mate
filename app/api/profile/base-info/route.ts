import type { NextRequest } from "next/server";
import type { BaseInfoPayload } from "@/app/_lib/base-info";

export async function GET(): Promise<Response> {
  const empty: BaseInfoPayload = {};
  return Response.json(empty);
}

export async function PATCH(request: NextRequest): Promise<Response> {
  await request.json();
  return Response.json({ ok: true });
}
