const fs = require("fs");
const path = require("path");

const pagesDir = path.join(__dirname, "..", "pages");
const tag = '<script src="../js/nav-lock-head.js"></script>\n  ';
let count = 0;

for (const f of fs.readdirSync(pagesDir).filter((x) => x.endsWith(".html"))) {
  const fp = path.join(pagesDir, f);
  let h = fs.readFileSync(fp, "utf8");
  if (!h.includes("y2k-nav")) continue;
  if (h.includes("nav-lock-head.js")) continue;

  const linkRe = /<link rel="stylesheet" href="\.\.\/css\/y2k\.css"\s*\/?>/;
  if (!linkRe.test(h)) {
    console.log("SKIP pattern:", f);
    continue;
  }
  h = h.replace(linkRe, (m) => tag + m);
  fs.writeFileSync(fp, h, "utf8");
  count++;
}

console.log("Patched", count, "pages");
