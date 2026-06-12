/**
 * 页面 ID → 对外 URL 文件名（不可猜测的英文 slug）
 * 内部逻辑仍使用 pageId（01、26a 等），存档不受影响。
 */
const GameRoutes = {
  slug: {
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
    "trap-skip": "skipped-voice-guide",
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
  },

  file(pageId) {
    const slug = this.slug[pageId];
    return slug ? `${slug}.html` : "misc-page-not-found.html";
  },

  /** 游戏页内相对路径（pages/ 目录下互相跳转） */
  page(pageId, query) {
    let url = this.file(pageId);
    if (query) {
      const q = String(query).replace(/^\?/, "");
      if (q) url += `?${q}`;
    }
    return url;
  },

  /** 从站点根目录出发的路径 */
  fromRoot(pageId, query) {
    return `pages/${this.page(pageId, query)}`;
  },

  hotlineFile() {
    return this.file("07");
  },

  isHotlineHref(href) {
    if (!href) return false;
    const trimmed = href.trim();
    const file = this.hotlineFile();
    return (
      trimmed === file ||
      trimmed.endsWith(`/${file}`) ||
      /\/night-duty-hotline\.html$/i.test(trimmed)
    );
  },
};
