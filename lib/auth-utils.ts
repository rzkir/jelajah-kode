import { API_CONFIG } from "@/lib/config";

export function checkAuthorization(request: Request): boolean {
  const authHeader = request.headers.get("authorization");

  // Always require valid API_SECRET for authorization
  return authHeader === `Bearer ${API_CONFIG.SECRET}`;
}
