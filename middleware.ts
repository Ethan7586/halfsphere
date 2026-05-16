import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/* ── Rate limiter (in-memory, per-instance) ── */
interface RateRecord {
  count: number;
  resetTime: number;
}
const rateMap = new Map<string, RateRecord>();

function isRateLimited(
  key: string,
  max: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const record = rateMap.get(key);
  if (!record || now > record.resetTime) {
    rateMap.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }
  if (record.count >= max) return true;
  record.count++;
  return false;
}

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/* ── Security headers ── */
const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIP(request);

  /* ── Global rate limit: 100 req/min per IP ── */
  if (isRateLimited(`global:${ip}`, 100, 60_000)) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  /* ── API route rate limit: 30 req/min per IP ── */
  if (pathname.startsWith("/api/")) {
    if (isRateLimited(`api:${ip}`, 30, 60_000)) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
  }

  /* ── Login brute-force protection: 10 req/min per IP ── */
  if (pathname === "/login") {
    if (isRateLimited(`login:${ip}`, 10, 60_000)) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
  }

  /* ── Auth check for protected routes ── */
  /* 游客只能访问 /（landing page）、/login、/apply */
  const protectedPrefixes = ["/dashboard", "/settings", "/budget", "/admin"];
  const isProtected = protectedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  let response = NextResponse.next({ request });

  if (isProtected) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  /* ── Inject security headers ── */
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon.svg (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)",
  ],
};
