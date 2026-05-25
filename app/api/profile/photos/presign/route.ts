import type { NextRequest } from "next/server";

type PresignBody = {
  count: number;
  contentTypes: string[];
};

export async function POST(request: NextRequest): Promise<Response> {
  const body = (await request.json()) as PresignBody;
  const uploads = body.contentTypes.map((_, i) => ({
    uploadUrl: "/api/profile/photos/upload-mock",
    key: `photos/mock/${Date.now()}-${i}.jpg`,
  }));
  return Response.json({ uploads });
}
