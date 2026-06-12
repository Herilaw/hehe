/**
 * 生成《明日回拨》全部游戏 HTML 页面
 * 运行: node scripts/generate-pages.js
 */
const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '..', 'pages');

const NAV = (active = '') => {
  const items = [
    ['02', '首页'], ['03', '新闻公告'], ['07', '便民热线'], ['04', '留言回访'],
    ['ex-download', '下载中心'], ['ex-lost', '失物招领'], ['10', '站内搜索'], ['ex-contact', '联系我们']
  ];
  return items.map(([id, label]) => {
    const href = id.startsWith('ex-') ? `${id}.html` : `${id}.html`;
    const cls = active === id ? ' nav-active' : '';
    return `<a href="${href}" class="${cls.trim()}">${label}</a>`;
  }).join('<span class="sep">|</span>');
};

function shell(opts) {
  const { id, title, badge, chapter, breadcrumb, body, navActive = '' } = opts;
  const file = `${id}.html`;
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${title} | 明日回拨</title>
  <link rel="stylesheet" href="../css/y2k.css">
</head>
<body>
  <div id="crt-overlay"></div>
  <div class="page-number" id="page-badge">${badge}</div>
  <main class="site-wrap">
    <div class="page-frame">
      <div class="page-header"><h1>${title}</h1></div>
      <div class="y2k-nav">${NAV(navActive)}</div>
      ${breadcrumb ? `<div class="breadcrumb">${breadcrumb}</div>` : ''}
      <div class="page-body">${body}</div>
      <div class="page-footer">
        <span class="footer-site">槐宁市114便民服务网 · 旧版镜像</span>
        <span><a href="../index.html">访问入口</a> · <a href="legacy-site-home.html">旧站首页</a></span>
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

const PAGES = {
  '15': shell({
    id: '15', title: '优秀夜间值班员沈桥先进事迹', badge: 'P.15', chapter: '第二章·无人来电', navActive: '03',
    breadcrumb: '<a href="search-shenqiao-results.html">搜索沈桥</a> &gt; 先进事迹',
    body: `
<p class="doc-no">槐宁市服务热线管理中心 · 2009年9月 · 宣传稿</p>
<p class="lead">沈桥同志长期坚守夜间热线岗位，在群众服务中表现突出，被评为"优秀夜间值班员"。</p>
<div class="img-placeholder wide-img"><span class="ph-tag">[图片占位]</span><span class="ph-name">shenqiao_0017_room7.jpg</span><span class="ph-hint">沈桥站总机前 · 钟表00:17 · 纸条"无号不接" · 门牌"第七接线室"（被身体遮挡）</span></div>
<ul class="bullet-list">
  <li>文件名线索：<strong>0017</strong>、<strong>room7</strong></li>
  <li>照片背景门牌只露出「第七」二字</li>
  <li>鼠标悬停时眼睛方向可能轻微变化（占位）</li>
</ul>
<aside class="side-panel"><h4>矛盾</h4><p>宣传稿称沈桥"仍在岗位"，但离岗申请显示无权限。</p><p>搜索 <a href="room-seven-login.html">第七接线室</a> → 当前无权限，需后台入口。</p></aside>
<p><a href="shenqiao-voice-sample.html">→ 沈桥接线录音样本</a> · <a href="room-seven-login.html">→ 后台入口 /room7/login</a></p>`
  }),

  '16': shell({
    id: '16', title: '沈桥接线录音样本', badge: 'P.16', chapter: '第二章·无人来电', navActive: '07',
    breadcrumb: '<a href="search-shenqiao-results.html">沈桥</a> &gt; 录音样本',
    body: `
<p class="doc-no">技术部存档 · 样本编号 SQ-0017 · 仅供内部培训</p>
<div class="audio-block">
  <div class="audio-placeholder"><span class="ph-tag">[音频占位]</span><span class="ph-name">shenqiao_sample.wav</span><span class="ph-hint">0-10秒正常男声 → 长电流声 → 第17秒贴耳童声</span><div class="fake-waveform"></div></div>
  <p class="sample-text">「您好，这里是槐宁市114便民热线，请问有什么可以帮您？」</p>
  <button class="y2k-btn primary" id="btn-play-audio" type="button">▶ 播放样本</button>
</div>
<div data-if-flag="audioJumpscare" class="notice-box"><p class="terror-text">波形尖峰对应：1 / 1 / 4 → 密码 <strong>114</strong></p><p><a href="zero-callback-incident-report.html">← 返回事故通报解锁 PDF</a></p></div>
<div data-unless-flag="audioJumpscare" class="notice-box"><p>提示：样本后半段有异常。播放时请勿调高音量。</p></div>
<aside class="side-panel"><h4>沈桥警告（档案摘录）</h4><p>不要接没有号码的电话。</p><p>不要在接线时说自己的名字。</p><p>不要让它学会你沉默的时间。</p></aside>`
  }),

  '17': shell({
    id: '17', title: '异常回拨工单汇总', badge: 'P.17', chapter: '第二章·无人来电', navActive: '03',
    breadcrumb: '<a href="zero-callback-incident-report.html">事故通报</a> &gt; 附件PDF',
    body: `
<p class="doc-no">内部附件 · 共114条 · 大部分已涂黑</p>
<div class="img-placeholder wide-img"><span class="ph-tag">[PDF占位]</span><span class="ph-name">异常回拨工单汇总.pdf</span><span class="ph-hint">统计每页页脚电话图标数量</span></div>
<table class="y2k-table">
  <tr><th>工单编号</th><th>来电人</th><th>内容</th><th>状态</th></tr>
  <tr><td>017-041</td><td>陈小满</td><td>路灯一直闪</td><td>已回拨</td></tr>
  <tr><td>017-052</td><td>—</td><td>明天有人值班吗</td><td>已回拨</td></tr>
  <tr><td>017-086</td><td>—</td><td>请不要挂断</td><td>已回拨</td></tr>
</table>
<p class="puzzle-box">页脚电话图标（第1-4页）：<strong>1 / 0 / 1 / 7</strong> → 密码 <strong>1017</strong></p>
<p class="hint">某一页曾闪过您的称呼，刷新后消失。（占位效果）</p>
<p><a href="old-clocktower-halt-news.html">若需核对事故时间，请查阅旧钟楼维护记录 →</a></p>`
  }),

  '18': shell({
    id: '18', title: '旧钟楼停摆新闻', badge: 'P.18', chapter: '第二章·无人来电', navActive: '03',
    breadcrumb: '<a href="search-callback-keyword.html">搜索</a> &gt; 旧钟楼',
    body: `
<p class="doc-no">槐宁市晚报 · 2009年10月18日</p>
<h3 class="section-title">旧钟楼停摆与热线系统迁移无直接关系</h3>
<p>2009年10月17日凌晨，旧钟楼因电路故障停摆。停摆时间约为<strong>00:17</strong>。市文旅局强调：该事件与114热线系统迁移<strong>无直接关系</strong>。</p>
<p class="repeat-em">无直接关系。无直接关系。无直接关系。</p>
<div class="img-placeholder wide-img"><span class="ph-tag">[图片占位]</span><span class="ph-name">旧钟楼夜景</span><span class="ph-hint">钟面00:17 · 围挡HN-1017 · 水迹倒影 ROOM7</span></div>
<p>线索汇总：<strong>1017</strong> · <strong>0017</strong> · <strong>ROOM7</strong></p>
<p><a href="clocktower-maintenance-order.html">→ 查看钟楼检修单</a> · <a href="misc-download-center.html">→ 下载中心（检修附件副本）</a></p>`
  }),

  '19': shell({
    id: '19', title: '钟楼检修单', badge: 'P.19', chapter: '第二章·无人来电',
    breadcrumb: '<a href="old-clocktower-halt-news.html">旧钟楼</a> &gt; 检修单',
    body: `
<div class="img-placeholder wide-img"><span class="ph-tag">[扫描件占位]</span><span class="ph-name">钟楼检修单</span><span class="ph-hint">钟面4道裂痕 → 0,0,1,7 · 编号HN-1017</span></div>
<table class="meta-table y2k-table"><tr><td>维修编号</td><td>HN-1017</td></tr><tr><td>报修单位</td><td>槐宁市文旅局</td></tr><tr><td>备注</td><td><em>指针没有坏，是时间不肯走。</em></td></tr></table>
<p class="puzzle-box">HN-1017 + 裂痕 0017 = 后台编号 <strong class="terror-text">10170017</strong></p>
<p><a href="room-seven-login.html" class="y2k-btn primary">后台入口 /room7/login →</a></p>`
  }),

  '20': shell({
    id: '20', title: '第七接线室后台登录', badge: 'P.20', chapter: '第三章·人声回填',
    breadcrumb: '<a href="clocktower-maintenance-order.html">检修单</a> &gt; 后台登录',
    body: `
<p class="lead">第七接线室内部系统 · 非公开入口 · 访问将被记录</p>
<form class="y2k-form" id="form-login">
  <label>值班编号</label>
  <input name="code" type="text" placeholder="事故日期与停摆时间组成">
  <label>口令</label>
  <input name="pwd" type="password" placeholder="若忘记请阅读接线规范">
  <button type="submit" class="y2k-btn primary">登录</button>
</form>
<p><a href="operator-protocol-manual.html">若忘记口令，请阅读接线规范 →</a></p>
<aside class="side-panel"><h4>提示</h4><p>编号 = 10170017</p><p>口令在《接线规范》每条末字。</p></aside>`
  }),

  '21': shell({
    id: '21', title: '接线规范', badge: 'P.21', chapter: '第三章·人声回填', navActive: '07',
    body: `
<p class="doc-no">槐宁市114 · 客服话术规范 v2.3</p>
<ol class="policy-list">
  <li>您好，这里是槐宁市114便民热线，<strong class="kw-char">明</strong>。</li>
  <li>请说明您的位置与需求，<strong class="kw-char">日</strong>。</li>
  <li>夜间来电将统一登记，<strong class="kw-char">回</strong>。</li>
  <li>如无人处理，将安排次日接听，<strong class="kw-char">拨</strong>。</li>
</ol>
<p class="puzzle-box">取每条最后一字 → 口令：<strong>明日回拨</strong></p>
<p><a href="room-seven-login.html">← 返回登录</a></p>`
  }),

  '22': shell({
    id: '22', title: '后台登录成功', badge: 'P.22', chapter: '第三章·人声回填',
    body: `
<div class="status-panel success-panel">
  <p>✓ 登录成功</p>
  <table class="y2k-table">
    <tr><td>当前账号</td><td>临时访客</td></tr>
    <tr><td>当前身份</td><td class="terror-text">岗前阅读对象</td></tr>
    <tr><td>已记录阅读</td><td>夜间值班说明、无人来电说明、接线规范</td></tr>
  </table>
</div>
<p class="terror-text">您查资料的行为，被系统理解成「岗前培训」。</p>
<p><a href="voice-backfill-mechanism.html" class="y2k-btn primary">继续培训 →</a></p>`
  }),

  '23': shell({
    id: '23', title: '人声回填机制说明', badge: 'P.23', chapter: '第三章·人声回填', navActive: '07',
    body: `
<p class="doc-no">技术模块说明 · 维护员：林雁 / 林某 / 林燕（署名不一致）</p>
<p>人声回填机制用于在接线员无法即时应答时，调用历史语音样本完成基础回应。</p>
<p class="terror-text">当接线员离岗、失联、失声或无法确认存在状态时，系统可继续使用其历史语音完成回拨，并生成「仍在值班」的证明。</p>
<div class="flow-chart">
  <div class="flow-node">采集人声<span class="node-num">3</span></div><span class="flow-arrow">→</span>
  <div class="flow-node">建立样本<span class="node-num">8</span></div><span class="flow-arrow">→</span>
  <div class="flow-node">训练停顿<span class="node-num">5</span></div><span class="flow-arrow">→</span>
  <div class="flow-node">替代接听<span class="node-num">14</span></div><span class="flow-arrow">→</span>
  <div class="flow-node">生成值班证明<span class="node-num">17</span></div>
</div>
<p>3/8/5/14/17 → A1Z26 → <strong>CHENQ</strong> → 搜索 <a href="search-chen-xiaoman.html">陈小满</a></p>`
  }),

  '24': shell({
    id: '24', title: '搜索结果：陈小满', badge: 'P.24', chapter: '第三章·人声回填', navActive: '10',
    breadcrumb: '<a href="voice-backfill-mechanism.html">人声机制</a> &gt; 陈小满',
    body: `
<article class="search-result"><a class="title" href="ticket-chen-017041.html">《017-041号工单：陈小满》</a><div class="snippet">梧桐里7号 · 路灯报修 · 已回拨</div></article>
<article class="search-result"><span class="title dead">《梧桐里7号路灯报修》</span><div class="snippet">归档 · 不可编辑</div></article>
<article class="search-result"><span class="title dead">《陈小满回拨录音》</span><div class="snippet">仅值班员可听 · 需完成三项培训</div></article>
<aside class="side-panel"><h4>陈小满</h4><p>2009年10月17日零点，11岁女孩来电求助。</p><p>她不是来电。她是没有被接到的人。</p></aside>`
  }),

  '25': shell({
    id: '25', title: '017-041号工单：陈小满', badge: 'P.25', chapter: '第三章·人声回填',
    body: `
<table class="y2k-table">
  <tr><td>来电人</td><td>陈小满</td></tr>
  <tr><td>年龄</td><td>11（历年档案不变）</td></tr>
  <tr><td>地址</td><td>梧桐里7号</td></tr>
  <tr><td>内容</td><td>楼下路灯一直闪，妈妈叫不醒</td></tr>
  <tr><td>状态</td><td>已回拨</td></tr>
  <tr><td>回拨时间</td><td>2009-10-17 00:17</td></tr>
  <tr><td>处理人</td><td id="handler-cell">沈桥</td></tr>
</table>
<p class="hint">鼠标悬停「处理人」可见闪烁变化。</p>
<p>修改历史：来电人 → 误拨 → 测试样本 → 无号码来电库</p>
<p>完成三项培训后可听录音：</p>
<p>
  <a href="voice-sample-library.html" class="y2k-btn">人声培训</a>
  <a href="clock-sync-chronicle.html" class="y2k-btn">旧钟培训</a>
  <a href="null-line-distribution-map.html" class="y2k-btn">空线培训</a>
</p>
<p data-if-flag="threeProofs"><a href="three-proofs-submission.html">→ 提交三项证明</a></p>`
  }),

  '26a': shell({
    id: '26a', title: '人声样本库', badge: 'P.26A', chapter: '支线·人声',
    breadcrumb: '<a href="ticket-chen-017041.html">陈小满工单</a> &gt; 人声培训',
    body: `
<ul class="file-list">
  <li>📄 沈桥_您好.wav</li>
  <li>📄 沈桥_请稍等.wav</li>
  <li>📄 沈桥_已记录.wav</li>
  <li class="terror-text">📄 沈桥_沉默.wav ← 异常</li>
</ul>
<div class="audio-placeholder"><span class="ph-name">沈桥_沉默.wav</span><span class="ph-hint">无声但有波形 · 摩斯 DONT SAY NAME</span><div class="fake-waveform"></div></div>
<button class="y2k-btn" id="btn-silence" type="button">播放沉默样本</button>
<div class="y2k-form" style="margin-top:16px">
  <label>输入解谜结果</label>
  <input id="voice-kw" type="text" placeholder="不要说出名字">
  <button class="y2k-btn" id="btn-voice-kw" type="button">提交</button>
</div>
<p data-if-token="ren"><a href="shenqiao-leave-request.html">→ 沈桥离岗申请（已解锁）</a></p>`
  }),

  '27a': shell({
    id: '27a', title: '沈桥离岗申请', badge: 'P.27A', chapter: '支线·人声',
    body: `
<div class="notice-box">
  <p><strong>我</strong>申请停止夜间值班。</p>
  <p><strong>系</strong>统已经可以用我的声音回答来电。</p>
  <p><strong>但</strong>我没有回答。</p>
  <p><strong>如</strong>果一个声音还在工作，是否能证明这个人还在？</p>
</div>
<p class="puzzle-box">首字连读 → <strong class="terror-text">人声不是权限</strong> · 令牌 <strong>REN</strong></p>
<p class="hint">「我不在这里。」……「我一直在这里。」（占位音频）</p>
<p><a href="three-proofs-submission.html">→ 返回提交证明</a></p>`
  }),

  '26b': shell({
    id: '26b', title: '旧钟同步记录', badge: 'P.26B', chapter: '支线·旧钟',
    breadcrumb: '<a href="ticket-chen-017041.html">工单</a> &gt; 旧钟培训',
    body: `
<table class="y2k-table">
  <tr><th>时间</th><th>状态</th></tr>
  <tr><td>2009-10-16 23:59</td><td>正常</td></tr>
  <tr><td>2009-10-17 00:17</td><td>停摆</td></tr>
  <tr><td id="clock-anomaly" class="click-row">2009-10-18 00:17</td><td class="terror-text">明日</td></tr>
  <tr><td>2009-10-19 00:17</td><td>明日</td></tr>
  <tr><td>[[TOMORROW_SHORT]]</td><td>明日</td></tr>
</table>
<p class="hint">点击第一行异常「2009-10-18」→ 林雁备忘录</p>`
  }),

  '27b': shell({
    id: '27b', title: '林雁备忘录', badge: 'P.27B', chapter: '支线·旧钟',
    body: `
<div class="notice-box memo-box">
  <p>它不是预知明天。它只是永远停在事故前夜。</p>
  <p><strong class="terror-text">旧钟不是明天。</strong></p>
  <p>如果有人看到这页，请不要让系统继续同步本地时间。</p>
</div>
<p>钟表反证：0017 反转 → <strong>1700</strong></p>
<div class="y2k-form">
  <label>请输入旧钟反证</label>
  <input id="clock-proof" type="text" placeholder="四位数字">
  <button class="y2k-btn" id="btn-clock-proof" type="button">提交</button>
</div>
<p data-if-token="zhong">令牌已获得：<strong>ZHONG</strong></p>
<p><a href="three-proofs-submission.html">→ 返回提交证明</a></p>`
  }),

  '26c': shell({
    id: '26c', title: '空线分布图', badge: 'P.26C', chapter: '支线·空线',
    breadcrumb: '<a href="ticket-chen-017041.html">工单</a> &gt; 空线培训',
    body: `
<div class="img-placeholder wide-img"><span class="ph-name">槐宁市旧城区电话亭分布图</span></div>
<div class="map-grid" id="booth-map">
  ${['A-001','B-017','C-114','D-000','E-041','F-052','G-086','H-117'].map(b => `<button type="button" class="booth-btn" data-booth="${b}">${b}</button>`).join('')}
</div>
<p>关联工单：017-041 · 017-052 · 017-086 → 按顺序点击电话亭</p>
<div class="map-result" id="map-result">连线延伸至地图外 → <strong>NULL-0017</strong></div>
<p><a href="null-line-call-record.html">→ 空线记录</a></p>`
  }),

  '27c': shell({
    id: '27c', title: '空线记录', badge: 'P.27C', chapter: '支线·空线',
    body: `
<p>所有无号码来电均来自测试线路 <strong>NULL-0017</strong>。该线路已注销、不具备呼叫能力，但系统仍识别为待处理来电。</p>
<ul class="bullet-list">
  <li>无号码 ≠ 无人</li>
  <li>无来源 ≠ 求助</li>
  <li><strong>空线 ≠ 来电</strong></li>
</ul>
<div class="y2k-form">
  <input id="empty-proof" type="text" placeholder="空线不是来电">
  <button class="y2k-btn" id="btn-empty-proof" type="button">提交</button>
</div>
<p data-if-token="xian">令牌：<strong>XIAN</strong></p>
<p data-if-token="xian" class="terror-text">可是陈小满不是空线。</p>
<p><a href="three-proofs-submission.html">→ 返回提交证明</a></p>`
  }),

  '28': shell({
    id: '28', title: '提交三项证明', badge: 'P.28', chapter: '第四章·第七接线室',
    body: `
<div data-if-flag="threeProofs">
  <p class="terror-text">培训完成。当前访客已具备完整接线认知。值班权限开放。</p>
  <p>（系统把您的反抗也解释成了入职流程。）</p>
  <p><a href="chen-callback-recording.html" class="y2k-btn primary">听取陈小满回拨录音</a></p>
</div>
<div data-unless-flag="threeProofs">
  <form class="y2k-form" id="form-proofs">
    <label>人声证明</label><input name="ren" placeholder="REN / 人声不是权限">
    <label>旧钟证明</label><input name="zhong" placeholder="ZHONG / 旧钟不是明天">
    <label>空线证明</label><input name="xian" placeholder="XIAN / 空线不是来电">
    <button type="submit" class="y2k-btn primary">提交</button>
  </form>
</div>`
  }),

  '29': shell({
    id: '29', title: '陈小满回拨录音', badge: 'P.29', chapter: '第四章·第七接线室',
    body: `
<div class="audio-placeholder"><span class="ph-name">chenxiaoman_callback.wav</span><span class="ph-hint">女孩求助 → 长空白 → 沈桥声音 · 时间戳 2009-10-18 00:17</span></div>
<button class="y2k-btn primary" id="btn-chen-audio" type="button">▶ 播放录音</button>
<div id="chen-call-area"></div>
<p data-if-flag="chenCallSeen" class="terror-text">来电已转入第七接线室。 <a href="room-seven-overview.html">→</a></p>`
  }),

  '30': shell({
    id: '30', title: '第七接线室介绍', badge: 'P.30', chapter: '第四章·第七接线室',
    body: `
<p>第七接线室用于处理无法归类、无法回拨、无法确认来源的特殊工单。不在公开平面图中显示。</p>
<div class="img-placeholder wide-img plan-img" id="plan-blank" style="cursor:pointer"><span class="ph-name">热线中心平面图（6间）</span><span class="ph-hint">点击走廊尽头空白区域</span></div>
<p id="room7-reveal" style="display:none" class="terror-text">ROOM 7 已浮现 — <a href="room-seven-cctv-snapshot.html">进入监控快照</a></p>
<button class="y2k-btn" id="btn-reveal-room7" type="button">显示隐藏轮廓</button>`
  }),

  '31': shell({
    id: '31', title: '第七接线室监控快照', badge: 'P.31', chapter: '第四章·第七接线室',
    body: `
<p>监控恢复中……最后一帧缓存如下：</p>
<div class="monitor-room" id="monitor-room">
  <div class="monitor-static"></div>
  <div class="monitor-scene" id="monitor-scene">
    <p>🪑  📞  🕐</p>
    <p class="room-desc">空房间 · 桌子 · 电话 · 空椅子 · 旧钟 · 值班表</p>
  </div>
</div>
<div data-unless-flag="monitorSeen"><button class="y2k-btn" id="btn-monitor" type="button">加载监控</button></div>
<div data-if-flag="monitorSeen">
  <p class="terror-text blink">该座位等待当前访客。</p>
  <p>闪白前值班表线索：041-052-086</p>
  <p><a href="room-seven-duty-roster.html">→ 第七接线室值班表</a></p>
</div>`
  }),

  '32': shell({
    id: '32', title: '第七接线室值班表', badge: 'P.32', chapter: '第四章·第七接线室',
    body: `
<table class="y2k-table">
  <tr><th>日期</th><th>值班人</th><th>状态</th></tr>
  <tr><td>2009-10-17</td><td>沈桥</td><td>已归档</td></tr>
  <tr><td>2009-10-18</td><td>林雁</td><td>未完成</td></tr>
  <tr><td>2009-10-19</td><td>赵逢春</td><td>未完成</td></tr>
  <tr><td>[[TOMORROW_SHORT]]</td><td class="terror-text">[[PLAYER_NAME]]</td><td><a href="duty-qualification-check.html">待确认</a></td></tr>
</table>
<p class="terror-text">您的名字已进入值班表。</p>`
  }),

  '33': shell({
    id: '33', title: '值班资格确认', badge: 'P.33', chapter: '第五章·明日值班',
    body: `
<p>您已完成：</p>
<ol class="check-list-done">
  <li>提交称呼</li><li>阅读夜间值班说明</li><li>查询无人来电</li>
  <li>查看人声回填机制</li><li>完成三项培训</li><li>进入第七接线室</li>
</ol>
<p class="terror-text">系统判断：您具备明日值班资格。</p>
<p>您越努力调查，越被系统认为适合接班。</p>
<p>
  <button class="y2k-btn danger" id="btn-confirm-duty" type="button">确认明日值班</button>
  <a href="view-page-source.html" class="y2k-btn">申请撤销</a>
</p>`
  }),

  '34': shell({
    id: '34', title: '撤销申请', badge: 'P.34', chapter: '第五章·明日值班',
    body: `
<p>撤销值班需管理员审核。管理员：<strong>赵逢春</strong> · 状态：<span class="status-future">明日登录</span></p>
<table class="y2k-table">
  <tr><th>日期</th><th>登录时间</th></tr>
  <tr><td>2009-10-17</td><td>00:17</td></tr>
  <tr><td>2009-10-18</td><td>00:17</td></tr>
  <tr><td>2009-10-19</td><td>00:17</td></tr>
  <tr><td>本机+1</td><td class="status-future">00:17</td></tr>
</table>
<div class="source-comment">&lt;!-- 管理员无法在明日之前审核明日。请让明日失效。 --&gt;</div>
<input id="revoke-input" type="text" placeholder="让明日失效">
  <button class="y2k-btn" id="btn-revoke" type="button">提交</button>
<p data-if-flag="revokeEntered"><a href="admin-backdoor-access.html">→ 赵逢春管理员后门</a></p>`
  }),

  '35': shell({
    id: '35', title: '赵逢春管理员后门', badge: 'P.35', chapter: '第五章·明日值班',
    body: `
<div class="notice-box">
  <p>如果你能看到这里，说明它已经把你当成值班员。</p>
  <p>不要和它争论你不是。它只认记录。你必须让三条记录互相冲突。</p>
</div>
<form class="y2k-form" id="form-backdoor">
  <label>1. 人声记录 → 反证</label><input name="r" placeholder="人声不是权限">
  <label>2. 时间记录 → 反证</label><input name="z" placeholder="旧钟不是明天">
  <label>3. 来电记录 → 反证</label><input name="x" placeholder="空线不是来电">
  <button type="submit" class="y2k-btn primary">提交冲突</button>
</form>`
  }),

  '36': shell({
    id: '36', title: '系统冲突', badge: 'P.36', chapter: '第五章·明日值班',
    body: `
<div class="notice-box error-panel">
  <p class="terror-text">权限错误：人声无法证明值班人存在。</p>
  <p class="terror-text">时间错误：明日无法确认。</p>
  <p class="terror-text">来电错误：空线不构成呼叫。</p>
  <p>明日值班记录生成失败。</p>
  <hr>
  <p>检测到真实未接来电：<strong>陈小满</strong>。是否继续断开空线？</p>
  <p class="hint">断开则陈小满将永远「未接通」——好结局并不温暖。</p>
</div>
<p>
  <button class="y2k-btn primary" id="btn-disconnect" type="button">继续断开</button>
  <button class="y2k-btn danger" id="btn-accept-call" type="button">我来接听</button>
</p>
<div class="hidden-path">
  <label>隐藏路径（需满足无名等条件）</label>
  <input id="hidden-input" type="text" placeholder="允许未接通">
  <button class="y2k-btn" id="btn-hidden" type="button">提交</button>
</div>`
  }),

  '37': shell({
    id: '37', title: '结局：代签', badge: 'P.37', chapter: '结局',
    body: `
<div class="ending-page dark" id="bad-ending">
  <p>明日值班确认成功。</p>
  <p>值班人：[[PLAYER_NAME]]</p>
  <p>值班时间：[[TOMORROW]]—05:00</p>
  <p>状态：已代签</p>
  <p style="margin:20px 0">感谢您补足夜间空缺。系统正在学习您的停顿。请保持安静。</p>
  <hr style="border-color:#333">
  <p>《我市便民服务热线工作人员[[PLAYER_NAME]]获评优秀夜间值班员》</p>
  <p>发布日期：2009年10月18日</p>
  <p class="final-line">明天有人值班了。所以昨天没有出事。</p>
  <div id="bad-ending-extra"></div>
  <p style="margin-top:24px"><a href="../index.html" class="y2k-btn">返回访问入口</a></p>
</div>`
  }),

  '38': shell({
    id: '38', title: '结局：断线归档', badge: 'P.38', chapter: '结局',
    body: `
<div class="ending-page">
  <p>人声回填机制：停止</p>
  <p>旧钟同步：停止</p>
  <p>空线识别：停止</p>
  <p>明日值班生成：失败</p>
  <p>玩家记录：撤销</p>
  <p style="margin:16px 0">陈小满工单：已回拨 → <strong class="terror-text">未接通</strong></p>
  <hr>
  <p class="ending-404">槐宁市114便民服务网旧版镜像不存在。<br>该页面已停止服务。</p>
  <p class="final-line">这一次，没有人替他们接。</p>
  <p><a href="../index.html" class="y2k-btn">返回访问入口</a></p>
</div>`
  }),

  '39': shell({
    id: '39', title: '结局：无人应答', badge: 'P.39', chapter: '结局',
    body: `
<div class="ending-page dark">
  <p>未接来电：114</p>
  <p>已处理：0</p>
  <p>明日值班人：无</p>
  <p>服务完成率：0%</p>
  <p style="margin:24px 0">无法证明服务完成。无法生成明日值班。无法继续回拨。</p>
  <p class="final-line">有些电话没有被接到。但至少，没有人再被迫替它们作答。</p>
  <p><a href="../index.html" class="y2k-btn">返回访问入口</a></p>
</div>`
  }),

  'ex-download': shell({
    id: 'ex-download', title: '下载中心', badge: '扩展', chapter: '扩展页面', navActive: 'ex-download',
    body: `
<p>槐宁市114旧版文件下载区。部分文件已损坏或迁移。</p>
<table class="y2k-table file-table">
  <tr><th>文件名</th><th>大小</th><th>状态</th></tr>
  <tr><td><a href="operator-protocol-manual.html">接线规范.pdf</a></td><td>128KB</td><td>可读</td></tr>
  <tr><td><a href="clocktower-maintenance-order.html">钟楼检修单副本.pdf</a></td><td>2.1MB</td><td>可读</td></tr>
  <tr><td>夜间值班协议.doc</td><td>—</td><td>已归档</td></tr>
  <tr><td><a href="shenqiao-voice-sample.html">沈桥录音样本.zip</a></td><td>4.7MB</td><td>⚠ 异常</td></tr>
  <tr><td>第七接线室平面图.dwg</td><td>—</td><td>无权限</td></tr>
</table>
<aside class="side-panel"><h4>备注</h4><p>下载行为会被记录为「岗前阅读」。</p></aside>`
  }),

  'ex-lost': shell({
    id: 'ex-lost', title: '失物招领', badge: '扩展', chapter: '扩展页面', navActive: 'ex-lost',
    body: `
<p>以下失物信息长期未更新，请勿按登记联系方式致电——号码已是空号。</p>
<table class="y2k-table">
  <tr><th>日期</th><th>物品</th><th>地点</th></tr>
  <tr><td>2009-10-16</td><td>黑色工作证</td><td>114热线中心</td></tr>
  <tr><td>2009-10-17</td><td>儿童发卡（粉色）</td><td>梧桐里7号附近</td></tr>
  <tr><td>2009-10-17</td><td>值班室钥匙串</td><td>第七——（地点被涂黑）</td></tr>
</table>
<p class="terror-text">儿童发卡无人认领。登记人姓名栏：空白。</p>`
  }),

  'ex-contact': shell({
    id: 'ex-contact', title: '联系我们', badge: '扩展', chapter: '扩展页面', navActive: 'ex-contact',
    body: `
<table class="y2k-table">
  <tr><td>便民热线</td><td>114</td></tr>
  <tr><td>夜间值班室</td><td>114-0-017（空号）</td></tr>
  <tr><td>技术维护</td><td>林雁（无法接通）</td></tr>
  <tr><td>网站管理员</td><td>赵逢春 · 登录时间：明日 00:17</td></tr>
  <tr><td>地址</td><td>槐宁市旧城区服务热线大楼</td></tr>
</table>
<p class="hint">您拨打114，听筒里会先沉默三秒，再说「您好」——像已经有人接起来又放下。</p>`
  }),

  'ex-migrate': shell({
    id: 'ex-migrate', title: '并入新平台通知', badge: '扩展', chapter: '扩展页面', navActive: '03',
    body: `
<p class="doc-no">2009年10月16日</p>
<p>我市114便民服务热线将于10月17日零时整体迁移至新平台。旧版留言、回拨记录将封存。</p>
<p>新平台承诺：零漏接、全回拨、服务完成率100%。</p>
<aside class="side-panel"><h4>讽刺</h4><p>「100%完成率」正是零点事故的起点。</p><p><a href="shutdown-notice-1017.html">→ 关站公告</a></p></aside>`
  }),

  '404': shell({
    id: '404', title: '页面不存在', badge: '404', chapter: '扩展',
    body: `
<div class="ending-404" style="padding:40px;text-align:center">
  <h2>404 · 页面不存在</h2>
  <p>您请求的地址不在公开目录中。</p>
  <p class="terror-text">当前访客：[[PLAYER_NAME]] · 该称呼已被404页面读取。</p>
  <p><a href="legacy-site-home.html">返回首页</a> · <a href="admin-backdoor-access.html">尝试管理员后门</a>（需解锁）</p>
</div>`
  })
};

// 修补已有页面：注入 utils.js
function patchExisting(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  if (!html.includes('utils.js')) {
    html = html.replace('<script src="../js/puzzles.js"></script>', '<script src="../js/utils.js"></script>\n  <script src="../js/storage.js"></script>\n  <script src="../js/puzzles.js"></script>');
  }
  if (!html.includes('storage.js') && html.includes('utils.js')) {
    html = html.replace('<script src="../js/utils.js"></script>', '<script src="../js/utils.js"></script>\n  <script src="../js/storage.js"></script>');
  }
  fs.writeFileSync(filePath, html, 'utf8');
}

if (!fs.existsSync(PAGES_DIR)) fs.mkdirSync(PAGES_DIR, { recursive: true });

let count = 0;
for (const [id, html] of Object.entries(PAGES)) {
  fs.writeFileSync(path.join(PAGES_DIR, `${id}.html`), html, 'utf8');
  count++;
  console.log('Generated:', id + '.html');
}

fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.html')).forEach(f => {
  patchExisting(path.join(PAGES_DIR, f));
});

console.log(`Done. ${count} pages generated/updated.`);
