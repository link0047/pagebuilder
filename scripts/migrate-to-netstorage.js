import Netstorage from "netstorageapi";
import { join } from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { loadEnvFile } from "node:process";

loadEnvFile(".env");

async function attempt(promise) {
  try {
    const value = await promise;
    return [null, value];
  } catch (error) {
    return [error instanceof Error ? error : new Error(String(error)), null];
  }
}

function nsUpload(localFile, remoteFile) {
  return new Promise((resolve, reject) => {
    ns.upload(localFile, remoteFile, (error, response, body) => {
      if (error) return reject(error);
      if (response.statusCode !== 200) {
        return reject(new Error(`Akamai Upload Failed: ${response.statusCode} - ${JSON.stringify(body)}`));
      }
      resolve(body);
    });
  });
}

function nsStat(remoteFile) {
  return new Promise((resolve, reject) => {
    ns.stat(remoteFile, (error, response, body) => {
      if (error) return reject(error);
      if (response.statusCode === 404) return resolve(null);
      if (response.statusCode !== 200) {
        return reject(new Error(`Akamai Stat Failed: ${response.statusCode} - ${JSON.stringify(body)}`));
      }
      resolve(body);
    });
  });
}

async function md5Local(localFile) {
  const buffer = await fs.readFile(localFile);
  return crypto.createHash("md5").update(buffer).digest("hex");
}

// Pulls size + md5 out of the stat response's <file> element.
function parseStat(body) {
  const file = body?.stat?.file;
  const entry = Array.isArray(file) ? file[0] : file;
  if (!entry) return null;
  return {
    size: Number(entry.size),
    md5: entry.md5
  };
}

async function compareFile(localFile, remoteFile) {
  const [statError, body] = await attempt(nsStat(remoteFile));
  if (statError) return { status: "error", error: statError };
  if (body === null) return { status: "missing-remote" };

  const remote = parseStat(body);
  if (!remote) return { status: "error", error: new Error("Could not parse stat") };

  if (remote.md5) {
    const localMd5 = await md5Local(localFile);
    return { status: localMd5 === remote.md5 ? "match" : "differ", localMd5, remoteMd5: remote.md5 };
  }

  // Fallback: size-only comparison when the remote has no md5.
  const localSize = (await fs.stat(localFile)).size;
  return { status: localSize === remote.size ? "match-size" : "differ", localSize, remoteSize: remote.size };
}

// Compares one file and uploads only if it differs. Returns the tally key.
async function syncFile(localFile, remoteFile, name) {
  const IDENTICAL = new Set(["match", "match-size"]);
  const comparison = await compareFile(localFile, remoteFile);

  if (comparison.status === "error") {
    console.error(`Failed to compare ${name}:`, comparison.error.message);
    return "failed";
  }
  if (IDENTICAL.has(comparison.status)) {
    console.log(`Skipping upload: ${name} (matches existing file)`);
    return "skipped";
  }

  console.log(`Attempting to upload: ${name} -> ${remoteFile}`);
  const [uploadError, result] = await attempt(nsUpload(localFile, remoteFile));
  if (uploadError) {
    console.error(`Failed to upload ${name}:`, uploadError.message);
    return "failed";
  }
  console.log(`Successfully uploaded: ${name} - ${JSON.stringify(result)}`);
  return "uploaded";
}

async function deployComponents() {
  const fileTargets = ["test"];
  const tally = { uploaded: 0, skipped: 0, failed: 0 };
  const [readDirError, files] = await attempt(fs.readdir(localPath));

  if (readDirError) {
    console.error("Failed to read local components:", readDirError.message);
    process.exitCode = 1;
    return;
  }

  for (const file of files) {
    const localFile = join(localPath, file);

    const [statError, fileStats] = await attempt(fs.stat(localFile));
    if (statError || !fileStats.isFile()) continue;

    const isTarget = fileTargets.some(item => file.includes(item));
    if (!isTarget) continue;

    for (const brand of brands) {
      const storageFile = join(storagePathFor(brand), file);
      const outcome = await syncFile(localFile, storageFile, `${brand}/${file}`);
      tally[outcome] += 1;
    }
  }

  console.log(`\nDone — ${tally.uploaded} uploaded, ${tally.skipped} skipped, ${tally.failed} failed`);
  if (tally.failed > 0) process.exitCode = 1;
}

const config = {
  hostname: process.env.NS_HOSTNAME,
  keyName: process.env.NS_KEY_NAME,
  key: process.env.NS_KEY,
  cpCode: process.env.NS_CP_CODE,
  ssl: process.env.NS_SSL !== "false"
};

for (const [k, v] of Object.entries(config)) {
  if (v === undefined) throw new Error(`Missing env var for config.${k}`);
}

const ns = new Netstorage(config);
const root = process.cwd();
const localPath = `${root}/src/lib/components/web-components`;
const brands = ["spencers", "spirit"];
const storagePathFor = (brand) => `/${config.cpCode}/${brand}/static/js/`;

deployComponents();
