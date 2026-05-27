import type { NextRequest } from "next/server";

type PresignBody = {
  count: number;
  contentTypes: string[];
};

const ALLOWED_CONTENT_TYPES = new Set(["image/jpeg", "image/png"]);
const MAX_UPLOAD_COUNT = 8;

const isPresignBody = (value: unknown): value is PresignBody => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const body = value as Record<string, unknown>;
  return (
    Number.isInteger(body.count) &&
    typeof body.count === "number" &&
    body.count > 0 &&
    body.count <= MAX_UPLOAD_COUNT &&
    Array.isArray(body.contentTypes) &&
    body.contentTypes.length === body.count &&
    body.contentTypes.every(
      (contentType) =>
        typeof contentType === "string" &&
        ALLOWED_CONTENT_TYPES.has(contentType),
    )
  );
};

export const POST = async (request: NextRequest): Promise<Response> => {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  if (!isPresignBody(raw)) {
    return Response.json({ message: "Invalid request body" }, { status: 400 });
  }

  const uploads = raw.contentTypes.map((_, i) => ({
    uploadUrl: "/api/profile/photos/upload-mock",
    key: `photos/mock/${Date.now()}-${i}.jpg`,
  }));
  return Response.json({ uploads });
};
