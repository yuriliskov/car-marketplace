import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

const dataDirectory = path.join(process.cwd(), ".local-data");

export async function appendLocalRecord(
  collection: "leads" | "events",
  record: Record<string, unknown>,
) {
  await mkdir(dataDirectory, { recursive: true });
  const entry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...record,
  };

  await appendFile(
    path.join(dataDirectory, `${collection}.jsonl`),
    `${JSON.stringify(entry)}\n`,
    "utf8",
  );

  return entry.id;
}
