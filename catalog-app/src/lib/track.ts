import { publicPath } from "@/lib/paths";

export function trackEvent(event: string, payload: Record<string, unknown> = {}) {
  void fetch(publicPath("/api/events"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, payload }),
  });
}
