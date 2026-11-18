import { readFile } from "node:fs/promises";
import { createEntries } from "./entries.js";
import { XMLParser } from "fast-xml-parser";
import { saveEntries } from "./redis-store.js";

import { parseArgs } from "node:util";

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      verbose: {
        type: "boolean",
        short: "v",
        default: false,
      },
    },
    allowPositionals: true,
    strict: true,
  });

  const filePath = positionals[0];

  if (positionals.length !== 1 || !filePath) {
    throw new Error("Usage: npx tsx src/index.ts [-v] /path/to/xml");
  }

  const xml = await readFile(filePath, "utf8");

  const parser = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: false,
    parseAttributeValue: false,
    isArray: (_name, path) =>
      path === "config.subdomains.subdomain" ||
      path === "config.cookies.cookie",
  });

  const data: unknown = parser.parse(xml, true);

  const entries = createEntries(data);

  await saveEntries(entries);

  if (values.verbose) {
    for (const entry of entries) {
      console.log(entry.key);
    }
  }

  console.log(`Saved ${entries.length} entries to Redis.`);
}

main().catch((error: unknown) => {
  console.error("Export failed:", error);
  process.exitCode = 1;
});
