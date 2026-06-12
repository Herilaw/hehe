/** 统一页面 HTML 结构，清理 class 空格 */
const fs = require('fs');
const path = require('path');
const PAGES = path.join(__dirname, '..', 'pages');

fs.readdirSync(PAGES).filter(f => f.endsWith('.html')).forEach(file => {
  let h = fs.readFileSync(path.join(PAGES, file), 'utf8');
  h = h.replace(/class="([^"]*?) "/g, 'class="$1"');
  h = h.replace(/class=" "/g, 'class=""');
  h = h.replace(/\n\s+\n\s+\n/g, '\n\n');
  fs.writeFileSync(path.join(PAGES, file), h, 'utf8');
});

// 搜索页补面包屑
const p01 = path.join(PAGES, 'seek-entry-results.html');
let h01 = fs.readFileSync(p01, 'utf8');
if (!h01.includes('breadcrumb')) {
  h01 = h01.replace(
    '</div>\n      \n      \n      <div class="page-body',
    '</div>\n      <div class="breadcrumb"><a href="../index.html">访问入口</a> &gt; seek.page 检索</div>\n      <div class="page-body'
  );
  fs.writeFileSync(p01, h01, 'utf8');
}

console.log('UI normalize done');
