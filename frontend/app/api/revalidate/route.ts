import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { paths?: string[] };
  const paths = body.paths ?? ["/", "/articles"];

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ success: true, message: "Revalidated", paths });
}
