export { auth as middleware } from "@/lib/auth/auth";

export const config = {
  // Protect these routes — unauthenticated users get redirected to /login
  matcher: ["/account/:path*", "/admin/:path*"],
};
