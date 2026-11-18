import { createClient } from "redis";

export async function saveEntries(
  entries: { key: string; value: string }[],
): Promise<void> {
  const client = createClient({
    url: process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
    socket: {
      connectTimeout: 5000,
      reconnectStrategy: false,
    },
  });

  client.on("error", (error) => {
    console.error("Redis connection error:", error.message);
  });

  try {
    await client.connect();

    for (const entry of entries) {
      await client.set(entry.key, entry.value);
    }
  } finally {
    if (client.isOpen) {
      await client.close();
    }
  }
}
