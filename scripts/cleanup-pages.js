/**
 * 清理全站剧透/提示文本，统一动态日期占位符与页脚
 */
const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '..', 'pages');
const INDEX = path.join(__dirname, '..', 'index.html');

const SIDE_SPOILER = /线索|提示|矛盾|讽刺|备注|密码|令牌|检索提示|异常说明|协议摘要|技术说明|下载行为|100%完成率/;

function clean(html) {
  html = html.replace(/<span>第[一二三四五]章·[^<]+<\/span>/g, '<span class="footer-site">槐宁市114便民服务网 · 旧版镜像</span>');
  html = html.replace(/<span>扩展页面<\/span>/g, '<span class="footer-site">槐宁市114便民服务网 · 旧版镜像</span>');
  html = html.replace(/<span>结局<\/span>/g, '<span class="footer-site">槐宁市114便民服务网 · 旧版镜像</span>');

  html = html.replace(/<aside class="side-panel">([\s\S]*?)<\/aside>\s*/g, (m, inner) =>
    SIDE_SPOILER.test(inner) ? '' : m
  );

  html = html.replace(/<p class="puzzle-box">[\s\S]*?<\/p>\s*/g, '');
  html = html.replace(/<p class="foot-hint">[\s\S]*?<\/p>\s*/g, '');
  html = html.replace(/<p class="invert-hint">[\s\S]*?<\/p>\s*/g, '');
  html = html.replace(/<p class="hint">[\s\S]*?<\/p>\s*/g, '');

  html = html.replace(/<span class="ph-tag">[\s\S]*?<\/span>\s*/g, '');
  html = html.replace(/<span class="ph-hint">[\s\S]*?<\/span>\s*/g, '');

  html = html.replace(/<div data-if-flag="audioJumpscare"[\s\S]*?<\/div>\s*/g, '');
  html = html.replace(/<div data-unless-flag="audioJumpscare"[\s\S]*?<\/div>\s*/g, '');
  html = html.replace(/<p data-if-token="[^"]*">[\s\S]*?<\/p>\s*/g, '');

  html = html.replace(/<p>线索汇总：[\s\S]*?<\/p>\s*/g, '');
  html = html.replace(/<ul class="bullet-list">[\s\S]*?文件名线索[\s\S]*?<\/ul>\s*/g, '');
  html = html.replace(/<strong class="kw-char">(.?)<\/strong>/g, '$1');

  const tomorrowReplacements = [
    [/明日00:17/g, '[[TOMORROW]]'],
    [/明日 00:17/g, '[[TOMORROW]]'],
    [/将于<strong>明日00:17<\/strong>/g, '将于<strong>[[TOMORROW]]</strong>'],
    [/您的留言将在明日00:17回拨/g, '您的留言将在[[TOMORROW]]回拨'],
    [/请于明日保持可联系状态/g, '请于[[TOMORROW_DATE]]保持可联系状态'],
    [/状态：<span class="status-future">明日登录<\/span>/g, '状态：<span class="status-future">[[TOMORROW]] 登录</span>'],
    [/明日登录/g, '[[TOMORROW]] 登录'],
    [/<td>本机\+1<\/td>/g, '<td>[[TOMORROW_DATE]]</td>'],
    [/夜间留言将于<strong>明日00:17<\/strong>/g, '夜间留言将于<strong>[[TOMORROW]]</strong>'],
    [/明日 00:17—05:00/g, '[[TOMORROW]]—05:00'],
  ];
  tomorrowReplacements.forEach(([re, rep]) => { html = html.replace(re, rep); });

  html = html.replace(/placeholder="事故日期与停摆时间组成"/g, 'placeholder="请输入"');
  html = html.replace(/placeholder="若忘记请阅读接线规范"/g, 'placeholder="请输入"');
  html = html.replace(/<span>支线·[^<]+<\/span>/g, '<span class="footer-site">槐宁市114便民服务网 · 旧版镜像</span>');
  html = html.replace(/<p>钟表反证：[\s\S]*?<\/p>\s*/g, '');
  html = html.replace(/<div class="source-comment">[\s\S]*?<\/div>\s*/g, '');
  html = html.replace(/<p><strong>我<\/strong>/g, '<p>我');
  html = html.replace(/<p><strong>系<\/strong>/g, '<p>系');
  html = html.replace(/<p><strong>但<\/strong>/g, '<p>但');
  html = html.replace(/<p><strong>如<\/strong>/g, '<p>如');

  html = html.replace(/<div class="hidden-path">[\s\S]*?<\/div>\s*/g, '');
  html = html.replace(/<p>按顺序点击：[\s\S]*?<\/p>\s*/g, '');
  html = html.replace(/<p>关联工单：[\s\S]*?<\/p>\s*/g, '');
  html = html.replace(/<p>闪白前值班表线索：[\s\S]*?<\/p>\s*/g, '');
  html = html.replace(/<p>3\/8\/5\/14\/17[\s\S]*?<\/p>\s*/g, '');
  html = html.replace(/<p>修改历史：[\s\S]*?<\/p>\s*/g, '');
  html = html.replace(/<p class="hint">鼠标悬停[\s\S]*?<\/p>\s*/g, '');
  html = html.replace(/ · 横幅占位/g, '');

  html = html.replace(/<p class="terror-text blink">明日回拨已提前送达[\s\S]*?<\/p>\s*/g,
    '<p class="terror-text blink">回拨已提前送达。当前访客尚未登记。</p>\n');
  html = html.replace(/<p class="terror-text">系统备注：当前访客尚未登记。（再次矛盾——或不矛盾。）<\/p>\s*/g,
    '<p class="status-line">系统备注：当前访客尚未登记。</p>\n');

  return html;
}

function cleanIndex(html) {
  html = html.replace(/<p class="hint">[\s\S]*?<\/p>\s*/g, '');
  html = html.replace(/异常索引：明日00:17/g, '异常索引：[[TOMORROW]]');
  return html;
}

let n = 0;
fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.html')).forEach(f => {
  fs.writeFileSync(path.join(PAGES_DIR, f), clean(fs.readFileSync(path.join(PAGES_DIR, f), 'utf8')), 'utf8');
  n++;
});
fs.writeFileSync(INDEX, cleanIndex(fs.readFileSync(INDEX, 'utf8')), 'utf8');
console.log('Cleaned', n, 'pages + index');
