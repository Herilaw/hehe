/**
 * 为所有 HTML 中的 css/js 引用追加 ?v= 版本号，避免 immutable 缓存导致新旧资源混用
 * 运行: node scripts/inject-asset-version.js
 * 部署前更新 ASSET_VERSION
 */
const fs = require("fs");
const path = require("path");

const ASSET_VERSION = "20250611";
const root = path.join(__dirname, "..");

function bustAssetUrls(html) {
  return html.replace(
    /((?:href|src)=["'])((?:\.\.\/)?(?:css\/y2k\.css|js\/[^"']+\.js))(?:\?v=[^"']*)?(["'])/g,
    `$1$2?v=${ASSET_VERSION}$3`
  );
}

function patchFile(rel) {
  const fp = path.join(root, rel);
  if (!fs.existsSync(fp)) return false;
  const next = bustAssetUrls(fs.readFileSync(fp, "utf8"));
  const prev = fs.readFileSync(fp, "utf8");
  if (next === prev) return false;
  fs.writeFileSync(fp, next, "utf8");
  return true;
}

let count = 0;
if (patchFile("index.html")) count++;
for (const f of fs.readdirSync(path.join(root, "pages"))) {
  if (f.endsWith(".html") && patchFile(path.join("pages", f))) count++;
}

console.log(`Asset version v=${ASSET_VERSION} applied to ${count} file(s).`);
