import { NextResponse } from "next/server";
import { createServerClient } from "@/src/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const destination = new URL(next, requestUrl.origin);
      if (destination.pathname === "/reset-password") {
        destination.searchParams.set("recovery", "1");
      }
      return NextResponse.redirect(destination);
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=auth_failed", requestUrl.origin),
  );
}
