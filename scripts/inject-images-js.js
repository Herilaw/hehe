const fs = require("fs");
const path = require("path");

const pagesDir = path.join(__dirname, "../pages");
const headNeedle = '<script src="../js/nav-lock-head.js"></script>';
const headInsert =
  '<script src="../js/routes.js"></script>\n  <script src="../js/nav-lock-head.js"></script>';
const bodyNeedle = '<script src="../js/core.js"></script>';
const bodyInsert =
  '<script src="../js/images.js"></script>\n  <script src="../js/core.js"></script>';

fs.readdirSync(pagesDir)
  .filter((f) => f.endsWith(".html"))
  .forEach((f) => {
    const p = path.join(pagesDir, f);
    let html = fs.readFileSync(p, "utf8");
    let changed = false;
    if (html.includes(headNeedle) && !html.includes("../js/routes.js")) {
      html = html.replace(headNeedle, headInsert);
      changed = true;
    }
    if (!html.includes("images.js") && html.includes(bodyNeedle)) {
      html = html.replace(bodyNeedle, bodyInsert);
      changed = true;
    }
    if (!changed) return;
    fs.writeFileSync(p, html);
    console.log("patched", f);
  });
