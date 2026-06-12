/**
 * 统一所有游戏页面的 HTML 外壳结构
 * 运行: node scripts/rebuild-shell.js
 */
const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '..', 'pages');

const DEFAULT_NAV = `<a href="legacy-site-home.html">首页</a><span class="sep">|</span><a href="shutdown-notice-1017.html">新闻公告</a><span class="sep">|</span><a href="night-duty-hotline.html">便民热线</a><span class="sep">|</span><a href="visitor-message-board.html">留言回访</a><span class="sep">|</span><a href="misc-download-center.html">下载中心</a><span class="sep">|</span><a href="misc-lost-and-found.html">失物招领</a><span class="sep">|</span><a href="news-search-portal.html">站内搜索</a><span class="sep">|</span><a href="misc-contact-desk.html">联系我们</a>`;

const FOOTER = `<span class="footer-site">槐宁市114便民服务网 · 旧版镜像</span>
        <span><a href="../index.html">访问入口</a> · <a href="legacy-site-home.html">旧站首页</a></span>`;

function pick(re, html, group = 1) {
  const m = html.match(re);
  return m ? m[group].trim() : '';
}

function indentBody(html) {
  return html
    .replace(/\r\n/g, '\n')
    .trim()
    .split('\n')
    .map(line => (line ? '        ' + line : ''))
    .join('\n');
}

function buildPage(opts) {
  const {
    id, title, badge, h1, subtitle, nav, breadcrumb, body, headExtra = '', noNav = false
  } = opts;

  const subBlock = subtitle ? `\n        <div class="subtitle">${subtitle}</div>` : '';
  const navBlock = noNav ? '' : `\n      <div class="y2k-nav">${nav || DEFAULT_NAV}</div>`;
  const crumbBlock = breadcrumb ? `\n      <div class="breadcrumb">${breadcrumb}</div>` : '';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${title} | 明日回拨</title>
  <link rel="stylesheet" href="../css/y2k.css">${headExtra ? '\n  ' + headExtra : ''}
</head>
<body>
  <div id="crt-overlay"></div>
  <div class="page-number" id="page-badge">${badge}</div>
  <main class="site-wrap">
    <div class="page-frame">
      <div class="page-header">
        <h1>${h1}</h1>${subBlock}
      </div>${navBlock}${crumbBlock}
      <div class="page-body">
${indentBody(body)}
      </div>
      <div class="page-footer">
        ${FOOTER}
      </div>
    </div>
  </main>
  <div id="jumpscare-overlay" class="hidden"></div>
  <div id="modal-overlay" class="hidden"><div id="modal-content"></div></div>
  <script src="../js/utils.js"></script>
  <script src="../js/storage.js"></script>
  <script src="../js/puzzles.js"></script>
  <script src="../js/core.js"></script>
  <script>Game.boot('${id}');</script>
</body>
</html>`;
}

function rebuild(file) {
  const html = fs.readFileSync(path.join(PAGES_DIR, file), 'utf8');
  const id = pick(/Game\.boot\(['"]([^'"]+)['"]\)/, html);
  if (!id) {
    console.warn('skip (no Game.boot):', file);
    return;
  }

  const title = pick(/<title>([^|]+)/, html).replace(/\s+$/, '');
  const badge = pick(/<div class="page-number"[^>]*>([^<]+)/, html) || `P.${id}`;
  const h1 = pick(/<div class="page-header"[^>]*>[\s\S]*?<h1>([^<]+)/, html) || title;
  const subtitle = pick(/<div class="subtitle">([^<]+)/, html);
  const nav = pick(/<div class="y2k-nav">([\s\S]*?)<\/div>/, html);
  const breadcrumb = pick(/<div class="breadcrumb">([\s\S]*?)<\/div>/, html);
  const body = pick(/<div class="page-body">([\s\S]*?)<\/div>\s*(?:<div class="page-footer"|$)/, html);
  const headComments = (html.match(/<!--[\s\S]*?-->/g) || [])
    .filter(c => {
      const pos = html.indexOf(c);
      return pos > html.indexOf('<head>') && pos < html.indexOf('</head>');
    });
  const headExtra = headComments.join('\n  ');

  const noNav = id === '01' || !nav;

  const out = buildPage({ id, title, badge, h1, subtitle, nav: nav || DEFAULT_NAV, breadcrumb, body, headExtra, noNav });
  fs.writeFileSync(path.join(PAGES_DIR, file), out, 'utf8');
  console.log('rebuilt:', file);
}

fs.readdirSync(PAGES_DIR)
  .filter(f => f.endsWith('.html'))
  .forEach(rebuild);

console.log('Shell rebuild complete.');
