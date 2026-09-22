const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix local `/public` paths so they work under GitHub Pages (`/car-marketplace`). */
export function publicPath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${basePath}${path}`;
}
