#!/usr/bin/env node
/**
 * Run prisma migrate deploy with retries.
 * Concurrent Vercel preview/production builds often contend for Postgres
 * advisory locks and fail with P1002; retrying unblocks production deploys.
 */
const { spawnSync } = require("child_process");

const maxAttempts = 5;
const waitMs = 8000;

for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  console.log(`prisma migrate deploy (attempt ${attempt}/${maxAttempts})`);
  const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });
  if (result.status === 0) {
    process.exit(0);
  }
  if (attempt < maxAttempts) {
    console.log(`Migrate failed; waiting ${waitMs / 1000}s before retry...`);
    spawnSync(process.execPath, ["-e", `Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ${waitMs})`]);
  }
}

console.error("prisma migrate deploy failed after retries");
process.exit(1);
