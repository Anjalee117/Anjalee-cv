import { getSupabaseConfig } from "@/lib/supabase/config";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  if (!getSupabaseConfig()) return NextResponse.next();
  return await updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
