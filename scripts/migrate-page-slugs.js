/**
 * 将 pages/*.html 重命名为英文 slug，并替换项目内所有旧链接。
 * 用法：node scripts/migrate-page-slugs.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PAGES = path.join(ROOT, "pages");

const SLUGS = {
  "01": "seek-entry-results",
  "02": "legacy-site-home",
  "03": "shutdown-notice-1017",
  "04": "visitor-message-board",
  "05": "message-supplement-form",
  "06": "message-thread-detail",
  "07": "night-duty-hotline",
  "08": "tomorrow-duty-log",
  "09": "no-caller-id-brief",
  10: "news-search-portal",
  11: "search-callback-keyword",
  12: "zero-callback-incident-report",
  13: "duty-staff-photo-archive",
  14: "search-shenqiao-results",
  15: "shenqiao-honor-story",
  16: "shenqiao-voice-sample",
  17: "abnormal-callback-tickets",
  18: "old-clocktower-halt-news",
  19: "clocktower-maintenance-order",
  20: "room-seven-login",
  21: "operator-protocol-manual",
  22: "room-seven-dashboard",
  23: "voice-backfill-mechanism",
  24: "search-chen-xiaoman",
  25: "ticket-chen-017041",
  "26a": "voice-sample-library",
  "27a": "shenqiao-leave-request",
  "26b": "clock-sync-chronicle",
  "27b": "lin-yan-memo-scan",
  "26c": "null-line-distribution-map",
  "27c": "null-line-call-record",
  28: "three-proofs-submission",
  29: "chen-callback-recording",
  30: "room-seven-overview",
  31: "room-seven-cctv-snapshot",
  32: "room-seven-duty-roster",
  33: "duty-qualification-check",
  34: "view-page-source",
  35: "admin-backdoor-access",
  36: "system-conflict-screen",
  37: "ending-proxy-signed-duty",
  38: "ending-disconnect-archive",
  39: "ending-unanswered-line",
  "ex-download": "misc-download-center",
  "ex-lost": "misc-lost-and-found",
  "ex-contact": "misc-contact-desk",
  "ex-migrate": "misc-platform-migration",
  404: "misc-page-not-found",
};

function oldFile(pageId) {
  return `${pageId}.html`;
}

function newFile(pageId) {
  return `${SLUGS[pageId]}.html`;
}

function buildReplacements() {
  const pairs = Object.keys(SLUGS).map((id) => ({
    old: oldFile(id),
    neu: newFile(id),
  }));
  pairs.sort((a, b) => b.old.length - a.old.length);
  return pairs;
}

function replaceInText(content, pairs) {
  let out = content;
  for (const { old, neu } of pairs) {
    out = out.split(old).join(neu);
    out = out.split(`pages/${old}`).join(`pages/${neu}`);
  }
  return out;
}

function walkAndReplace(dir, pairs, exts) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      if (name === "node_modules" || name === ".git") continue;
      walkAndReplace(p, pairs, exts);
      continue;
    }
    if (!exts.some((e) => name.endsWith(e))) continue;
    const raw = fs.readFileSync(p, "utf8");
    const next = replaceInText(raw, pairs);
    if (next !== raw) {
      fs.writeFileSync(p, next, "utf8");
      console.log("updated", path.relative(ROOT, p));
    }
  }
}

function renamePages() {
  for (const id of Object.keys(SLUGS)) {
    const from = path.join(PAGES, oldFile(id));
    const to = path.join(PAGES, newFile(id));
    if (!fs.existsSync(from)) {
      if (fs.existsSync(to)) {
        console.log("already renamed", newFile(id));
        continue;
      }
      console.warn("missing", oldFile(id));
      continue;
    }
    if (fs.existsSync(to)) {
      console.warn("target exists, skip rename", newFile(id));
      continue;
    }
    fs.renameSync(from, to);
    console.log("renamed", oldFile(id), "→", newFile(id));
  }
}

function injectRoutesInHead() {
  const headNeedle = '<script src="../js/nav-lock-head.js"></script>';
  const headInsert =
    '<script src="../js/routes.js"></script>\n  <script src="../js/nav-lock-head.js"></script>';

  for (const f of fs.readdirSync(PAGES).filter((x) => x.endsWith(".html"))) {
    const p = path.join(PAGES, f);
    let html = fs.readFileSync(p, "utf8");
    if (html.includes("../js/routes.js")) continue;
    if (!html.includes(headNeedle)) {
      console.warn("no nav-lock head in", f);
      continue;
    }
    html = html.replace(headNeedle, headInsert);
    fs.writeFileSync(p, html, "utf8");
    console.log("injected routes in head:", f);
  }
}

const pairs = buildReplacements();
renamePages();
walkAndReplace(ROOT, pairs, [".html", ".js", ".md"]);
injectRoutesInHead();
console.log("\nDone. Old numbered URLs (e.g. shenqiao-honor-story.html) will 404 after deploy.");
