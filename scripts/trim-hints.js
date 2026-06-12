/**
 * 移除解谜游戏中过于明显的跳转指引
 * 运行: node scripts/trim-hints.js
 */
const fs = require('fs');
const path = require('path');
const PAGES = path.join(__dirname, '..', 'pages');

const edits = {
  'seek-entry-results.html': [
    [/如需查阅请前往 <a href="10\.html">新闻公告库<\/a> 搜索"回拨"。/,
      '如需查阅请使用站内「新闻公告库」自行检索。']
  ],
  'message-supplement-form.html': [
    [/\s*<p><a href="06\.html">查看留言详情 →<\/a><\/p>/, '']
  ],
  'message-thread-detail.html': [
    [/\s*<p><a href="07\.html" class="y2k-btn">查看夜间值班室说明<\/a> <a href="08\.html" class="y2k-btn">查看明日值班记录<\/a><\/p>/, '']
  ],
  'night-duty-hotline.html': [
    [/\s*<p><a href="08\.html">→ 查看您的明日值班记录状态<\/a> · <a href="09\.html">→ 无人来电说明<\/a><\/p>/, '']
  ],
  'tomorrow-duty-log.html': [
    [/<li>✓ 阅读夜间值班说明<\/li>/, '<li id="chk-night">☐ 阅读夜间值班说明</li>'],
    [/<li>☐ 查询无人来电说明<\/li>/, '<li id="chk-nocaller">☐ 查询无人来电说明</li>'],
    [/<li>☐ 查看零点回拨事故记录<\/li>/, '<li id="chk-accident">☐ 查看零点回拨事故记录</li>'],
    [/\s*<p><a href="09\.html" class="y2k-btn primary">查看无人来电说明<\/a> <a href="10\.html" class="y2k-btn">搜索回拨事故<\/a><\/p>/, '']
  ],
  'no-caller-id-brief.html': [
    [/\s*<p><a href="10\.html" class="y2k-btn primary">相关事故说明 · 新闻公告库<\/a><\/p>/, '']
  ],
  'news-search-portal.html': [
    [/<button type="button" data-kw="回拨">回拨<\/button>\s*/g, ''],
    [/<button type="button" data-kw="旧钟楼">旧钟楼<\/button>\s*/g, ''],
    [/<button type="button" data-kw="值班">值班<\/button>\s*/g, ''],
    [/<button type="button" data-kw="林雁">林雁<\/button>\s*/g, ''],
    [/<div class="notice-box">\s*<p>最近更新：2009-10-17 00:17（异常时间戳）<\/p>\s*<p>已删除条目仍可搜索：<a href="11\.html">回拨<\/a><\/p>\s*<\/div>/,
      '<div class="notice-box"><p>最近更新：2009-10-17 00:17（异常时间戳）</p></div>']
  ],
  'duty-staff-photo-archive.html': [
    [/<td><a href="14\.html">沈桥<\/a><\/td>/, '<td>沈桥</td>'],
    [/\s*<p><a href="14\.html">搜索"沈桥" →<\/a><\/p>/, '']
  ],
  'search-shenqiao-results.html': [
    [/<div class="snippet">无权限 · 需完成人声培训后访问 → <a href="26a\.html">人声样本库<\/a><\/div>/,
      '<div class="snippet">无权限 · 需完成人声培训后访问</div>']
  ],
  'shenqiao-honor-story.html': [
    [/\s*<p><a href="16\.html">→ 沈桥接线录音样本<\/a> · <a href="20\.html">→ 后台入口 \/room7\/login<\/a><\/p>/, '']
  ],
  'abnormal-callback-tickets.html': [
    [/\s*<p><a href="18\.html">若需核对事故时间，请查阅旧钟楼维护记录 →<\/a><\/p>/, '']
  ],
  'old-clocktower-halt-news.html': [
    [/\s*<p><a href="19\.html">→ 查看钟楼检修单<\/a> · <a href="ex-download\.html">→ 下载中心（检修附件副本）<\/a><\/p>/, '']
  ],
  'clocktower-maintenance-order.html': [
    [/\s*<p><a href="20\.html" class="y2k-btn primary">后台入口 \/room7\/login →<\/a><\/p>/, '']
  ],
  'room-seven-login.html': [
    [/\s*<p><a href="21\.html">若忘记口令，请阅读接线规范 →<\/a><\/p>/, '']
  ],
  'operator-protocol-manual.html': [
    [/\s*<p><a href="20\.html">← 返回登录<\/a><\/p>/, '']
  ],
  'room-seven-dashboard.html': [
    [/\s*<p><a href="23\.html" class="y2k-btn primary">继续培训 →<\/a><\/p>/, '']
  ],
  'search-chen-xiaoman.html': [
    [/<article class="search-result"><span class="title dead">《陈小满回拨录音》<\/span><div class="snippet">仅值班员可听 · 需完成三项培训<\/div><\/article>/,
      `<article class="search-result dead-result" data-unless-flag="threeProofs"><span class="title dead">《陈小满回拨录音》</span><div class="snippet">仅值班员可听 · 需完成三项培训</div></article>
        <article class="search-result" data-if-flag="threeProofs"><a class="title" href="chen-callback-recording.html">《陈小满回拨录音》</a><div class="snippet">培训已完成 · 可收听</div></article>`]
  ],
  'ticket-chen-017041.html': [
    [/\s*<p data-if-flag="threeProofs"><a href="28\.html">→ 提交三项证明<\/a><\/p>/, '']
  ],
  'null-line-distribution-map.html': [
    [/\s*<p><a href="27c\.html">→ 空线记录<\/a><\/p>/, '']
  ],
  'shenqiao-leave-request.html': [[/\s*<p><a href="28\.html">→ 返回提交证明<\/a><\/p>/, '']],
  'lin-yan-memo-scan.html': [[/\s*<p><a href="28\.html">→ 返回提交证明<\/a><\/p>/, '']],
  'null-line-call-record.html': [[/\s*<p><a href="28\.html">→ 返回提交证明<\/a><\/p>/, '']],
  'three-proofs-submission.html': [
    [/\s*<p><a href="29\.html" class="y2k-btn primary">听取陈小满回拨录音<\/a><\/p>/, '']
  ],
  'chen-callback-recording.html': [
    [/\s*<p data-if-flag="chenCallSeen" class="terror-text">来电已转入第七接线室。 <a href="30\.html">→<\/a><\/p>/, '']
  ],
  'room-seven-overview.html': [
    [/ROOM 7 已浮现 — <a href="31\.html">进入监控快照<\/a>/, 'ROOM 7 已浮现']
  ],
  'room-seven-cctv-snapshot.html': [
    [/\s*<p><a href="32\.html">→ 第七接线室值班表<\/a><\/p>/, '']
  ],
  'view-page-source.html': [
    [/\s*<p data-if-flag="revokeEntered"><a href="35\.html">→ 赵逢春管理员后门<\/a><\/p>/, '']
  ],
  'misc-page-not-found.html': [
    [/<p><a href="02\.html">返回首页<\/a> · <a href="35\.html">尝试管理员后门<\/a>（需解锁）<\/p>/,
      '<p><a href="legacy-site-home.html">返回首页</a></p>']
  ]
};

Object.entries(edits).forEach(([file, reps]) => {
  const fp = path.join(PAGES, file);
  let h = fs.readFileSync(fp, 'utf8');
  reps.forEach(([from, to]) => {
    const next = h.replace(from, to);
    if (next === h) console.warn('no match:', file, from.toString().slice(0, 60));
    h = next;
  });
  fs.writeFileSync(fp, h, 'utf8');
  console.log('trimmed:', file);
});

console.log('Done.');
