/**
 * 二次清理：剩余剧透、支线页脚、源码注释谜题
 */
const fs = require('fs');
const path = require('path');
const PAGES = path.join(__dirname, '..', 'pages');

function patch(file, edits) {
  const fp = path.join(PAGES, file);
  let h = fs.readFileSync(fp, 'utf8');
  edits.forEach(([from, to]) => { h = h.replace(from, to); });
  fs.writeFileSync(fp, h, 'utf8');
}

// 支线页脚
fs.readdirSync(PAGES).filter(f => f.endsWith('.html')).forEach(f => {
  let h = fs.readFileSync(path.join(PAGES, f), 'utf8');
  h = h.replace(/<span>支线·[^<]+<\/span>/g, '<span class="footer-site">槐宁市114便民服务网 · 旧版镜像</span>');
  fs.writeFileSync(path.join(PAGES, f), h, 'utf8');
});

patch('lin-yan-memo-scan.html', [
  ['<p>钟表反证：0017 反转 → <strong>1700</strong></p>\n', ''],
  ['<label>请输入旧钟反证</label>', '<label>验证输入</label>']
]);

patch('view-page-source.html', [
  ['<div class="source-comment">&lt;!-- 管理员无法在明日之前审核明日。请让明日失效。 --&gt;</div>\n', ''],
]);

// 真实 HTML 注释（需查看源代码）
let h34 = fs.readFileSync(path.join(PAGES, 'view-page-source.html'), 'utf8');
if (!h34.includes('请让明日失效')) {
  h34 = h34.replace('</head>', '  <!-- 管理员无法在明日之前审核明日。请让明日失效。 -->\n</head>');
  fs.writeFileSync(path.join(PAGES, 'view-page-source.html'), h34, 'utf8');
}

patch('room-seven-login.html', [
  ['placeholder="事故日期与停摆时间组成"', 'placeholder="请输入"'],
  ['placeholder="若忘记请阅读接线规范"', 'placeholder="请输入"']
]);

patch('room-seven-overview.html', [
  ['显示隐藏轮廓', '查看平面图'],
  ['<span class="ph-hint">点击走廊尽头空白区域</span>', '']
]);

patch('night-duty-hotline.html', [
  ['<aside class="side-panel"><h4>阅读记录</h4><p>✓ 您正在阅读本页</p><p>✓ 系统已记录访问时间</p><p class="terror-text">✓ 计入"岗前阅读对象"（尚未激活）</p></aside>\n', '']
]);

patch('shenqiao-voice-sample.html', [
  ['<aside class="side-panel"><h4>沈桥警告（档案摘录）</h4>', '<blockquote class="archive-quote"><p class="doc-no">档案摘录</p>'],
  ['<p>不要让它学会你沉默的时间。</p></aside>', '<p>不要让它学会你沉默的时间。</p></blockquote>']
]);

patch('shenqiao-leave-request.html', [
  ['<p><strong>我</strong>申请', '<p>我申请'],
  ['<p><strong>系</strong>统已经', '<p>系统已经'],
  ['<p><strong>但</strong>我没有', '<p>但我没有'],
  ['<p><strong>如</strong>果一个', '<p>如果一个']
]);

// 36 隐藏结局输入（无剧透标签）
h36 = fs.readFileSync(path.join(PAGES, 'system-conflict-screen.html'), 'utf8');
if (!h36.includes('btn-hidden')) {
  h36 = h36.replace(
    '</p>\n</div>',
    `</p>
<div class="system-override">
  <label>系统覆写指令</label>
  <input id="hidden-input" type="text" placeholder="请输入">
  <button class="y2k-btn" id="btn-hidden" type="button">执行</button>
</div>
</div>`
  );
  fs.writeFileSync(path.join(PAGES, 'system-conflict-screen.html'), h36, 'utf8');
}

patch('legacy-site-home.html', [
  ['alt="槐宁市114横幅占位"', 'alt="槐宁市114便民服务热线"'],
  ['<p class="foot-hint">提示：灰色链接也可能可以访问。旧站并未真正关闭。</p>\n', '']
]);

console.log('Patch pass 2 done');
