import fs from "fs";

const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));

const sections = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies"
];

let hasError = false;

const invalidPatterns = [
  /^\^/,
  /^~/,
  /\*/,
  />=/,
  /</,
  /latest/,
  /git\+/,
  /github:/,
  /http:|https:/
];

for (const section of sections) {
  const deps = pkg[section] || {};
  for (const [name, version] of Object.entries(deps)) {
    if (invalidPatterns.some(pattern => pattern.test(version))) {
      console.error(`❌ ${section} -> ${name}: ${version} is NOT pinned`);
      hasError = true;
    }
  }
}

if (hasError) {
  console.error("\n🚨 Build failed: Unpinned dependency versions found.");
  process.exit(1);
} else {
  console.log("✅ All dependencies are pinned properly.");
}