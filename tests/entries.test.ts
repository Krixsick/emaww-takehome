import { test } from "node:test";
import { deepStrictEqual, throws } from "node:assert/strict";
import { createEntries } from "../src/entries.js";

// Builds a small input object for our tests.
function makeInput(cookies: unknown[]) {
  return {
    config: {
      subdomains: {
        subdomain: [
          "http://secureline.tools.avast.com",
          "https://files.avast.com",
        ],
      },
      cookies: {
        cookie: cookies,
      },
    },
  };
}

test("creates the subdomains entry and a key for each cookie", () => {
  const input = makeInput([
    {
      "@_name": "dlp-avast",
      "@_host": "amazon",
      "#text": "mmm_amz_dlp_777_ppc_m",
    },
    {
      "@_name": "dlp-avg",
      "@_host": "01net",
      "#text": "Mmm_net_dlp_779_ppc_m",
    },
  ]);

  const actual = createEntries(input);

  deepStrictEqual(actual, [
    {
      key: "subdomains",
      value: '["http://secureline.tools.avast.com","https://files.avast.com"]',
    },
    {
      key: "cookie:dlp-avast:amazon",
      value: "mmm_amz_dlp_777_ppc_m",
    },
    {
      key: "cookie:dlp-avg:01net",
      value: "Mmm_net_dlp_779_ppc_m",
    },
  ]);
});

test("rejects a cookie with a missing host", () => {
  const input = makeInput([
    {
      "@_name": "dlp-avast",
      "#text": "some-value",
    },
  ]);

  throws(() => createEntries(input), /@_host/);
});

test("rejects input with no config", () => {
  throws(() => createEntries({}), /config/);
});
