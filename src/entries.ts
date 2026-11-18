import * as z from "zod";

const CookieSchema = z.object({
  "@_name": z.string().min(1),
  "@_host": z.string().min(1),
  "#text": z.string(),
});

const ConfigSchema = z.object({
  config: z.object({
    subdomains: z.object({
      subdomain: z.array(z.string().min(1)),
    }),
    cookies: z.object({
      cookie: z.array(CookieSchema),
    }),
  }),
});

export function createEntries(data: unknown) {
  const validated = ConfigSchema.parse(data);
  const subdomains = validated.config.subdomains.subdomain;
  const cookies = validated.config.cookies.cookie;

  const entries = [createSubdomainsEntry(subdomains)];

  for (const cookie of cookies) {
    const entry = createCookieEntry(
      cookie["@_name"],
      cookie["@_host"],
      cookie["#text"],
    );

    entries.push(entry);
  }

  return entries;
}

function createSubdomainsEntry(subdomains: string[]) {
  return {
    key: "subdomains",
    value: JSON.stringify(subdomains),
  };
}

function createCookieEntry(name: string, host: string, value: string) {
  return {
    key: `cookie:${name}:${host}`,
    value: value,
  };
}
