/**
 * 《明日回拨》素材路径对照 + 现代图片格式选择
 */
const GameImages = {
  base: "../assets/images/",
  files: {
    img_home_banner_0017: "img_home_banner_0017.png",
    img_shutdown_notice_1017: "img_shutdown_notice_1017.png",
    img_no_number_case_114: "img_no_number_case_114.png",
    img_zero_callback_report_cover: "img_zero_callback_report_cover.jpg.png",
    img_duty_staff_hidden_visitor: "img_duty_staff_hidden_visitor.png",
    img_duty_staff_archived_jumpscare: "img_duty_staff_archived_jumpscare.jpg.png",
    img_shenqiao_award_room7_0017: "img_shenqiao_award_room7_0017.jpg.png",
    img_shenqiao_award_stare: "img_shenqiao_award_stare.jpg.png",
    img_abnormal_cases_pdf_1017: "img_abnormal_cases_pdf_1017.png",
    img_old_clocktower_room7: "img_old_clocktower_room7.jpg.png",
    img_clocktower_maintenance_10170017: "img_clocktower_maintenance_10170017.png",
    img_room7_login_bg: "img_room7_login_bg.jpg.png",
    jiexiankouling: "jiexiankouling.png",
    icon: "icon.png",
    img_voice_backfill_flow_chenq: "img_voice_backfill_flow_chenq.png",
    img_chen_xiaoman_case_017041: "img_chen_xiaoman_case_017041.png",
    img_silence_waveform_morse: "img_silence_waveform_morse.png",
    img_shenqiao_leave_request_acrostic: "img_shenqiao_leave_request_acrostic.jpg.png",
    img_linyan_memo_1700: "img_linyan_memo_1700.jpg.png",
    img_phone_booth_map_null0017: "img_phone_booth_map_null0017.png",
    img_null_line_record: "img_null_line_record.png",
    img_call_center_floorplan_room7: "img_call_center_floorplan_room7.png",
    img_room7_cctv_empty: "img_room7_cctv_empty.png",
    img_room7_cctv_jumpscare: "img_room7_cctv_jumpscare.png",
    img_skip_trap_index_glitch: "img_skip_trap_index_glitch.png",
    img_room7_duty_roster_template: "img_room7_duty_roster_template.png",
    img_bad_end_signed_roster: "img_bad_end_signed_roster.png",
    img_bad_end_old_news: "img_bad_end_old_news.png",
    img_good_end_404_archive: "img_good_end_404_archive.png",
    img_true_end_no_answer_dashboard: "img_true_end_no_answer_dashboard.png",
  },

  _format: null,

  /** 从文件名推导无扩展名的 base（兼容 .jpg.png） */
  fileBase(filename) {
    return filename
      .replace(/\.jpg\.png$/i, "")
      .replace(/\.png$/i, "")
      .replace(/\.jpe?g$/i, "");
  },

  /** 同步检测浏览器对 AVIF / WebP 的支持 */
  detectFormat() {
    if (this._format) return this._format;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      this._format = "orig";
      return this._format;
    }
    if (canvas.toDataURL("image/avif").indexOf("data:image/avif") === 0) {
      this._format = "avif";
    } else if (canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0) {
      this._format = "webp";
    } else {
      this._format = "orig";
    }
    return this._format;
  },

  /** 将原始路径解析为当前浏览器最优格式 */
  resolve(src) {
    if (!src || this.detectFormat() === "orig") return src;
    const slash = src.lastIndexOf("/");
    const dir = slash >= 0 ? src.slice(0, slash + 1) : "";
    const file = slash >= 0 ? src.slice(slash + 1) : src;
    const base = this.fileBase(file);
    const ext = this._format === "avif" ? ".avif" : ".webp";
    return dir + base + ext;
  },

  src(key) {
    return this.resolve(this.base + (this.files[key] || ""));
  },

  /** 原始 PNG/JPG 路径（降级回退用） */
  origSrc(key) {
    return this.base + (this.files[key] || "");
  },

  /**
   * 为 <img> 设置最优 src，并在现代格式 404 时回退原图
   */
  applyToImg(img, origSrc) {
    if (!img || !origSrc) return;
    const best = this.resolve(origSrc);
    if (best === origSrc) {
      img.src = origSrc;
      return;
    }
    img.dataset.origSrc = origSrc;
    img.onerror = function onFmtErr() {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = "1";
      img.onerror = null;
      img.src = img.dataset.origSrc;
    };
    img.src = best;
  },

  /** 升级页面内所有游戏图片的 src / data-* 属性 */
  upgradePageImages(root) {
    const scope = root || document;
    scope.querySelectorAll("img").forEach((img) => {
      ["src", "data-normal", "data-scare"].forEach((attr) => {
        const val = img.getAttribute(attr);
        if (!val || val.indexOf("/assets/images/") === -1) return;
        if (attr === "src") {
          this.applyToImg(img, val);
        } else {
          img.setAttribute(attr, this.resolve(val));
        }
      });
    });
  },

  /** 预加载关键图片（在上一页提前拉取；同时拉取原图与优化格式） */
  preload(keys) {
    this.detectFormat();
    keys.forEach((key) => {
      const urls = [this.src(key), this.origSrc(key)];
      const seen = new Set();
      urls.forEach((href) => {
        if (!href || seen.has(href)) return;
        seen.add(href);
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = href;
        document.head.appendChild(link);
        const img = new Image();
        img.src = href;
      });
    });
  },

  /** 各页预加载配置：在到达目标页之前提前下载 */
  PRELOAD_BY_PAGE: {
    12: [
      "img_duty_staff_hidden_visitor",
      "img_duty_staff_archived_jumpscare",
    ],
    13: [
      "img_duty_staff_hidden_visitor",
      "img_duty_staff_archived_jumpscare",
    ],
    14: [
      "img_shenqiao_award_room7_0017",
      "img_shenqiao_award_stare",
    ],
    10: ["img_skip_trap_index_glitch"],
    22: ["img_skip_trap_index_glitch"],
    "trap-skip": ["img_skip_trap_index_glitch"],
    30: ["img_room7_cctv_empty", "img_room7_cctv_jumpscare"],
  },
};
