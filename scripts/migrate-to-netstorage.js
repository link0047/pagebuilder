import Netstorage from "netstorageapi";
import { join, parse } from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { loadEnvFile } from "node:process";
import { minifyHTMLLiterals } from "minify-literals";
import { minify } from "terser";

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

function parseStat(body) {
  const file = body?.stat?.file;
  const entry = Array.isArray(file) ? file[0] : file;
  if (!entry) return null;
  return { size: Number(entry.size), md5: entry.md5 };
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

  const localSize = (await fs.stat(localFile)).size;
  return { status: localSize === remote.size ? "match-size" : "differ", localSize, remoteSize: remote.size };
}

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

// Minify one source file, write the result into buildPath, return the built path + name.
async function buildFile(file) {
  const srcFile = join(localPath, file);

  const [rawError, rawCode] = await attempt(fs.readFile(srcFile, "utf8"));
  if (rawError) return { status: "error", error: rawError };

  const [htmlError, htmlResult] = await attempt(minifyHTMLLiterals(rawCode, {
    fileName: srcFile,
    minifyOptions: { collapseWhitespace: true, removeComments: true, minifyCSS: true },
  }));
  if (htmlError) return { status: "error", error: htmlError };

  const codeToTerser = htmlResult ? htmlResult.code : rawCode;

  const [terserError, terserResult] = await attempt(minify(codeToTerser, {
    ecma: 2020,
    module: true,
    keep_fnames: true,
    compress: { passes: 2, drop_console: false },
    mangle: true,
    format: { comments: false },
  }));
  if (terserError) return { status: "error", error: terserError };

  const { name, ext } = parse(file);
  const outName = `${name}.min${ext}`;
  const outFile = join(buildPath, outName);

  const [writeError] = await attempt(fs.writeFile(outFile, terserResult.code, "utf8"));
  if (writeError) return { status: "error", error: writeError };

  return { status: "ok", outFile, outName };
}

async function deployComponents() {
  const fileTargets = ["carousel"];
  const tally = { uploaded: 0, skipped: 0, failed: 0 };

  const [mkdirError] = await attempt(fs.mkdir(buildPath, { recursive: true }));
  if (mkdirError) {
    console.error("Failed to create build dir:", mkdirError.message);
    process.exitCode = 1;
    return;
  }

  const [readDirError, files] = await attempt(fs.readdir(localPath));
  if (readDirError) {
    console.error("Failed to read local components:", readDirError.message);
    process.exitCode = 1;
    return;
  }

  for (const file of files) {
    const srcFile = join(localPath, file);
    const [statError, fileStats] = await attempt(fs.stat(srcFile));
    if (statError || !fileStats.isFile()) continue;
    if (!fileTargets.some(item => file.includes(item))) continue;

    const built = await buildFile(file);
    if (built.status === "error") {
      console.error(`Failed to build ${file}:`, built.error.message);
      tally.failed += 1;
      continue;
    }

    for (const brand of brands) {
      const storageFile = join(storagePathFor(brand), built.outName);
      const outcome = await syncFile(built.outFile, storageFile, `${brand}/${built.outName}`);
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
const buildPath = `${root}/dist/web-components`;
const brands = ["spencers", "spirit"];
const storagePathFor = (brand) => `/${config.cpCode}/${brand}/static/js/`;

deployComponents();
