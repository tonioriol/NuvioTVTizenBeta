import { copyFile, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import os from "node:os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const nuvioRepo = "NuvioMedia/NuvioWeb";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repoRoot,
    stdio: "inherit",
    env: { ...process.env, ...options.env }
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}`);
  }
}

async function githubJson(url) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "NuvioTVTizenBeta-updater"
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status} ${response.statusText} ${url}`);
  }

  return response.json();
}

async function downloadFile(url, destination) {
  const headers = { "User-Agent": "NuvioTVTizenBeta-updater" };
  if (process.env.GITHUB_TOKEN && url.includes("api.github.com")) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    headers.Accept = "application/octet-stream";
  }

  const response = await fetch(url, { headers, redirect: "follow" });
  if (!response.ok) {
    throw new Error(`Download failed: ${response.status} ${response.statusText} ${url}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(destination, bytes);
}

async function latestBetaRelease() {
  const releases = await githubJson(`https://api.github.com/repos/${nuvioRepo}/releases?per_page=20`);
  const beta = releases.find((release) => {
    const tag = release.tag_name ?? "";
    return release.prerelease || tag.includes("beta");
  });

  if (!beta) {
    throw new Error("No Nuvio beta/prerelease was found.");
  }

  return beta;
}

function findTizenWgtAsset(release) {
  return release.assets?.find((asset) => {
    const name = asset.name ?? "";
    return name.endsWith(".wgt") && /tizen/i.test(name);
  });
}

async function patchPackageJson(version) {
  const packagePath = path.join(repoRoot, "package.json");
  const packageJson = JSON.parse(await readFile(packagePath, "utf8"));

  packageJson.name = packageJson.name || "nuvio-tv-tizen-beta";
  packageJson.version = version.replace(/^v/, "");
  packageJson.description =
    "Self-contained Nuvio beta module for TizenBrew, updated from NuvioMedia/NuvioWeb prereleases.";
  packageJson.appName = "Nuvio TV Beta";
  packageJson.packageType = "app";
  packageJson.appPath = "app/index.html";
  packageJson.scripts = { update: "node scripts/update-nuvio-beta.mjs" };

  await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
  await writeFile(path.join(repoRoot, ".nuvio-beta-version"), `${version}\n`);
}

async function main() {
  const release = await latestBetaRelease();
  const tag = release.tag_name;
  const wgtAsset = findTizenWgtAsset(release);

  if (!wgtAsset) {
    throw new Error(`Release ${tag} does not contain a Tizen .wgt asset.`);
  }

  const tmp = await mkdtemp(path.join(os.tmpdir(), "nuvio-beta-"));
  const sourceDir = path.join(tmp, "NuvioWeb");
  const wgtPath = path.join(tmp, wgtAsset.name);
  const wgtDir = path.join(tmp, "wgt");

  try {
    run("git", ["clone", "--depth", "1", "--branch", tag, `https://github.com/${nuvioRepo}.git`, sourceDir]);
    run("npm", ["ci"], { cwd: sourceDir });
    run("npm", ["run", "build"], { cwd: sourceDir });
    run("npm", ["run", "sync:tizenbrew", "--", "--path", repoRoot], { cwd: sourceDir });

    await downloadFile(wgtAsset.browser_download_url, wgtPath);
    run("unzip", ["-q", wgtPath, "-d", wgtDir]);

    const envPath = path.join(wgtDir, "nuvio.env.js");
    if (!existsSync(envPath)) {
      throw new Error(`Release ${tag} .wgt did not include nuvio.env.js.`);
    }

    await copyFile(envPath, path.join(repoRoot, "app", "nuvio.env.js"));
    await patchPackageJson(tag);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
