export async function PUT(request: Request): Promise<Response> {
  await request.arrayBuffer();
  return new Response(null, { status: 200 });
}
