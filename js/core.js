/**
 * 《明日回拨》多页面游戏核心引擎
 * 负责：存档、动态绑定、谜题交互、访问记录
 */
const Game = {
  state: null,
  pageId: null,

  PAGE_REGISTRY: {
    "01": { num: "01", title: "搜索结果", chapter: "第一章·明日通知" },
    "02": { num: "02", title: "旧站首页", chapter: "第一章·明日通知" },
    "03": { num: "03", title: "关站通知", chapter: "第一章·明日通知" },
    "04": { num: "04", title: "留言回访", chapter: "第一章·明日通知" },
    "05": { num: "05", title: "补充留言", chapter: "第一章·明日通知" },
    "06": { num: "06", title: "留言详情", chapter: "第一章·明日通知" },
    "07": { num: "07", title: "夜间值班室说明", chapter: "第一章·明日通知" },
    "08": { num: "08", title: "明日值班记录", chapter: "第一章·明日通知" },
    "09": { num: "09", title: "无人来电说明", chapter: "第二章·无人来电" },
    10: { num: "10", title: "新闻公告库", chapter: "第二章·无人来电" },
    11: { num: "11", title: "搜索：回拨", chapter: "第二章·无人来电" },
    12: { num: "12", title: "零点回拨事故通报", chapter: "第二章·无人来电" },
    13: { num: "13", title: "值班人员情况说明", chapter: "第二章·无人来电" },
    14: { num: "14", title: "搜索：沈桥", chapter: "第二章·无人来电" },
    15: { num: "15", title: "沈桥先进事迹", chapter: "第二章·无人来电" },
    16: { num: "16", title: "沈桥接线录音", chapter: "第二章·无人来电" },
    17: { num: "17", title: "异常回拨工单汇总", chapter: "第二章·无人来电" },
    18: { num: "18", title: "旧钟楼停摆新闻", chapter: "第二章·无人来电" },
    19: { num: "19", title: "钟楼检修单", chapter: "第二章·无人来电" },
    20: { num: "20", title: "第七接线室登录", chapter: "第三章·人声回填" },
    21: { num: "21", title: "接线规范", chapter: "第三章·人声回填" },
    22: { num: "22", title: "后台登录成功", chapter: "第三章·人声回填" },
    23: { num: "23", title: "人声回填机制", chapter: "第三章·人声回填" },
    24: { num: "24", title: "搜索：陈小满", chapter: "第三章·人声回填" },
    25: { num: "25", title: "017-041号工单", chapter: "第三章·人声回填" },
    "26a": { num: "26A", title: "人声样本库", chapter: "支线·人声" },
    "27a": { num: "27A", title: "沈桥离岗申请", chapter: "支线·人声" },
    "26b": { num: "26B", title: "旧钟同步记录", chapter: "支线·旧钟" },
    "27b": { num: "27B", title: "林雁备忘录", chapter: "支线·旧钟" },
    "26c": { num: "26C", title: "空线分布图", chapter: "支线·空线" },
    "27c": { num: "27C", title: "空线记录", chapter: "支线·空线" },
    28: { num: "28", title: "提交三项证明", chapter: "第四章·第七接线室" },
    29: { num: "29", title: "陈小满回拨录音", chapter: "第四章·第七接线室" },
    30: { num: "30", title: "第七接线室介绍", chapter: "第四章·第七接线室" },
    31: { num: "31", title: "监控快照", chapter: "第四章·第七接线室" },
    32: { num: "32", title: "第七接线室值班表", chapter: "第四章·第七接线室" },
    33: { num: "33", title: "值班资格确认", chapter: "第五章·明日值班" },
    34: { num: "34", title: "撤销申请", chapter: "第五章·明日值班" },
    35: { num: "35", title: "管理员后门", chapter: "第五章·明日值班" },
    36: { num: "36", title: "系统冲突", chapter: "第五章·明日值班" },
    37: { num: "37", title: "结局：代签", chapter: "结局" },
    38: { num: "38", title: "结局：断线归档", chapter: "结局" },
    39: { num: "39", title: "结局：无人应答", chapter: "结局" },
    "ex-download": { num: "EX", title: "下载中心", chapter: "扩展" },
    "ex-lost": { num: "EX", title: "失物招领", chapter: "扩展" },
    "ex-contact": { num: "EX", title: "联系我们", chapter: "扩展" },
    "ex-migrate": { num: "EX", title: "并入新平台通知", chapter: "扩展" },
    404: { num: "404", title: "页面不存在", chapter: "扩展" },
    "trap-skip": { num: "!", title: "跳过检测", chapter: "隐藏" },
  },

  boot(pageId) {
    this.pageId = pageId;
    this.state = Storage.load();
    if (typeof GameImages !== "undefined") {
      const preloadKeys = GameImages.PRELOAD_BY_PAGE[pageId];
      if (preloadKeys) GameImages.preload(preloadKeys);
      GameImages.upgradePageImages();
    }
    this.initNavLockGuard();
    this.markHotlineNavLinks();
    this.applyNavLock();

    const f = this.state.flags;
    const gates = {
      "06": () => f.submittedMessage,
      "07": () => f.submittedMessage,
      17: () => f.pdfUnlocked,
      22: () => f.loginSuccess,
      23: () => f.loginSuccess,
      28: () => f.loginSuccess,
      29: () => f.threeProofs,
      30: () => f.chenRecordingPlayed,
      31: () => f.chenCallSeen,
      32: () => f.monitorSeen,
      35: () => f.revokeEntered,
    };
    if (gates[pageId] && !gates[pageId]()) {
      const redirect = {
        "06": "05",
        "07": "02",
        17: "12",
        22: "20",
        23: "22",
        28: "22",
        29: "28",
        30: "29",
        31: "30",
        32: "31",
        35: "34",
      };
      location.href = GameRoutes.page(redirect[pageId]);
      return;
    }

    if (pageId === "05" && f.submittedMessage) {
      location.href = GameRoutes.page("06");
      return;
    }

    if (pageId !== "landing") {
      this.state.gameStarted = true;
      this.state.currentPage = pageId;
      if (!this.state.visitedPages.includes(pageId)) {
        this.state.visitedPages.push(pageId);
      }
    }
    this.applyPlaceholders();
    this.applyBindings();
    this.applyFlags();
    this.updateDynamicUI();
    this.initClockSearchResults();
    this.initClocktowerUncanny();
    this.initHandlers();
    this.injectSiteDisclaimer();
    Storage.save(this.state);
  },

  injectSiteDisclaimer() {
    if (document.getElementById("site-disclaimer")) return;
    const footer = document.createElement("footer");
    footer.id = "site-disclaimer";
    footer.className = "site-disclaimer";
    footer.innerHTML = `<p>本体验中的人物、事件、地名及机构均为虚构，与现实无关。</p><p>© 2026 何日. All rights reserved.</p>`;
    document.body.appendChild(footer);
  },

  isHotlineNavLink(el) {
    if (!el) return false;
    const href = (el.getAttribute("href") || "").trim();
    return GameRoutes.isHotlineHref(href);
  },

  markHotlineNavLinks() {
    document
      .querySelectorAll(".y2k-nav a, a.side-hotline-link")
      .forEach((el) => {
        if (this.isHotlineNavLink(el)) el.dataset.navHotline = "1";
      });
  },

  initNavLockGuard() {
    if (document.documentElement.dataset.navLockGuard) return;
    document.documentElement.dataset.navLockGuard = "1";

    const blockHotline = (e) => {
      if (Storage.load().flags.submittedMessage) return;
      const locked = e.target.closest(".nav-hotline-locked");
      if (locked) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === "function") {
          e.stopImmediatePropagation();
        }
        return;
      }
      const a = e.target.closest(".y2k-nav a, a.side-hotline-link");
      if (!a || !this.isHotlineNavLink(a)) return;
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === "function") {
        e.stopImmediatePropagation();
      }
    };

    ["touchstart", "touchend", "pointerdown", "mousedown", "click"].forEach((type) => {
      document.addEventListener(type, blockHotline, {
        capture: true,
        passive: false,
      });
    });
  },

  applyNavLock() {
    const locked = !this.state.flags.submittedMessage;
    if (locked) {
      document.documentElement.dataset.hotlineLocked = "1";
    } else {
      delete document.documentElement.dataset.hotlineLocked;
    }

    document
      .querySelectorAll(".y2k-nav a, a.side-hotline-link, .y2k-nav .nav-hotline-locked")
      .forEach((el) => {
        const isHotline =
          el.dataset.navHotline === "1" ||
          (el.tagName === "A" && this.isHotlineNavLink(el));
        if (!isHotline) return;

        if (locked) {
          if (el.tagName === "A") {
            const span = document.createElement("span");
            span.className = "nav-hotline-locked";
            if (el.classList.contains("nav-active")) {
              span.classList.add("nav-active");
            }
            span.textContent = el.textContent;
            span.setAttribute("aria-disabled", "true");
            span.dataset.navHotline = "1";
            span.dataset.navHotlineLocked = "1";
            el.replaceWith(span);
          }
        }
      });
  },

  initClockSearchResults() {
    if (this.pageId !== "18") return;
    if (!location.search.includes("sr=1")) return;
    const body = document.querySelector(".page-body");
    if (!body || document.getElementById("clock-search-results")) return;
    const box = document.createElement("div");
    box.id = "clock-search-results";
    box.className = "search-results-inline";
    box.innerHTML = `<h3 class="section-title">搜索结果："旧钟楼"</h3>
      <p class="result-count">找到 2 条结果</p>
      <article class="search-result"><a class="title" href="${GameRoutes.page("18")}">《旧钟楼停摆与热线系统迁移无直接关系》</a><div class="snippet">停摆时间约为00:17……</div></article>
      <article class="search-result"><a class="title" href="${GameRoutes.page("19")}">《钟楼检修单》</a><div class="snippet">维修编号 HN-1017 · 指针没有坏，是时间不肯走</div></article>
      <p style="margin-top:12px"><a href="${GameRoutes.page("10")}">← 返回搜索</a></p>`;
    body.insertBefore(box, body.firstChild);
    const article = document.getElementById("clock-news-content");
    if (article) article.hidden = true;
    const crumb = document.querySelector(".breadcrumb");
    if (crumb) crumb.textContent = "公告库 > 搜索：旧钟楼";
  },

  initClocktowerUncanny() {
    if (this.pageId !== "18") return;
    if (location.search.includes("sr=1")) return;
    const field = document.getElementById("clock-uncanny-field");
    if (!field || field.dataset.bound) return;
    field.dataset.bound = "1";
    const frag = "无直接关系。";
    const count = 100;
    for (let i = 0; i < count; i++) {
      const span = document.createElement("span");
      span.className = "clock-uncanny-bit";
      span.textContent = frag;
      span.style.setProperty("--u-i", String(i));
      span.style.setProperty("--u-d", `${(i % 17) * 0.11 + 0.4}s`);
      span.style.setProperty("--u-o", `${0.08 + (i % 11) * 0.07}`);
      field.appendChild(span);
      if (i % 7 === 3) field.appendChild(document.createTextNode(" "));
      if (i % 13 === 5) field.appendChild(document.createElement("br"));
    }
  },

  recordSearchKeyword(kw) {
    const k = kw.trim();
    if (!k) return;
    const hist = this.state.searchHistory || [];
    const next = [k, ...hist.filter((x) => x !== k)].slice(0, 12);
    this.state.searchHistory = next;
    Storage.save(this.state);
    this.renderSearchHistory();
  },

  renderSearchHistory() {
    const wrap = document.getElementById("search-history");
    if (!wrap) return;
    const hist = this.state.searchHistory || [];
    if (!hist.length) {
      wrap.hidden = true;
      return;
    }
    wrap.hidden = false;
    const list = document.getElementById("search-history-list");
    if (!list) return;
    list.innerHTML = hist
      .map(
        (kw) =>
          `<button type="button" class="history-kw-btn" data-kw="${Utils.escapeHtml(
            kw
          )}">${Utils.escapeHtml(kw)}</button>`
      )
      .join("");
    list.querySelectorAll(".history-kw-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const input = document.getElementById("news-search");
        if (input) input.value = btn.getAttribute("data-kw");
        const go = wrap.__searchGo;
        if (go) go(btn.getAttribute("data-kw"));
      });
    });
  },

  pn() {
    return Utils.displayName(this.state);
  },

  applyPlaceholders() {
    const map = {
      "[[TOMORROW]]": Utils.formatTomorrow(),
      "[[TOMORROW_SHORT]]": Utils.formatTomorrowShort(),
      "[[TOMORROW_DATE]]": Utils.formatTomorrowDate(),
      "[[TOMORROW_TIME]]": Utils.formatTomorrowTime(),
      "[[TOMORROW_LOGIN]]": Utils.formatTomorrowLogin(),
      "[[PLAYER_NAME]]": this.pn(),
      "[[PLAYER]]": this.pn(),
      "[[MSG_ID]]": Utils.messageId(),
      "[[MSG_SUFFIX]]": "0017",
      "[[NOW]]": Utils.formatNow(),
      "[[VISITOR_COUNT]]": "000114",
      "[[TODAY]]": Utils.formatTodayCode(),
      "[[PLAYER_RAW]]": this.state.playerName || "（未填写）",
    };
    const root =
      document.querySelector(".site-wrap") ||
      document.querySelector("#landing-wrap");
    if (!root) return;
    let html = root.innerHTML;
    for (const [k, v] of Object.entries(map)) {
      html = html.split(k).join(v);
    }
    root.innerHTML = html;
  },

  applyBindings() {
    document.querySelectorAll("[data-bind]").forEach((el) => {
      const key = el.getAttribute("data-bind");
      const map = {
        PLAYER_NAME: this.pn(),
        MSG_ID: Utils.messageId(),
        VISITOR_COUNT: "000114",
        TOMORROW: Utils.formatTomorrow(),
      };
      if (map[key] !== undefined) el.textContent = map[key];
    });
    const nameInput = document.getElementById("msg-name");
    if (nameInput && this.state.playerName)
      nameInput.value = this.state.playerName;
  },

  applyFlags() {
    const flags = this.state.flags || {};
    const flagOn = (key) => {
      if (Object.prototype.hasOwnProperty.call(flags, key)) return !!flags[key];
      return !!this.state[key];
    };
    document.querySelectorAll("[data-if-flag]").forEach((el) => {
      const f = el.getAttribute("data-if-flag");
      el.style.display = flagOn(f) ? "" : "none";
    });
    document.querySelectorAll("[data-unless-flag]").forEach((el) => {
      const f = el.getAttribute("data-unless-flag");
      el.style.display = flagOn(f) ? "none" : "";
    });
    document.querySelectorAll("[data-if-token]").forEach((el) => {
      const t = el.getAttribute("data-if-token");
      el.style.display = this.state.tokens?.[t] ? "" : "none";
    });
    document.querySelectorAll("[data-unless-token]").forEach((el) => {
      const t = el.getAttribute("data-unless-token");
      el.style.display = this.state.tokens?.[t] ? "none" : "";
    });
  },

  updateDynamicUI() {
    const f = this.state.flags;
    const rs = document.getElementById("record-status");
    if (rs) {
      rs.textContent = f.threeProofs
        ? "生成失败"
        : f.loginSuccess
        ? "待生成"
        : "未生成";
      if (f.threeProofs) rs.className = "terror-text";
    }
    if (this.pageId === "08") {
      const tick = (id, done, label) => {
        const el = document.getElementById(id);
        if (el) el.textContent = `${done ? "✓" : "☐"} ${label}`;
      };
      tick("chk-night", f.readNightDuty, "阅读夜间值班说明");
      tick("chk-nocaller", f.readNoCaller, "查询无人来电说明");
      tick("chk-accident", f.readAccident, "查看零点回拨事故记录");
      tick(
        "chk-training",
        f.threeProofs,
        f.threeProofs ? "完成岗前培训" : "完成岗前培训（后期激活）"
      );
      const statusLine = document.getElementById("status-line");
      if (statusLine) {
        statusLine.textContent = f.threeProofs
          ? "系统备注：当前访客已登记。"
          : "系统备注：当前访客尚未登记。";
        if (f.threeProofs) statusLine.classList.add("terror-text");
      }
    }
    if (this.pageId === "30" && f.room7Revealed) {
      document.getElementById("plan-wrap")?.classList.add("is-revealed");
      const rv = document.getElementById("room7-reveal");
      if (rv) rv.hidden = false;
    }
    if (this.pageId === "31" && f.monitorSeen) {
      this.initMonitorCreep();
    }
    if (this.pageId === "13") {
      const img = document.getElementById("staff-img");
      if (img) {
        if (f.photoJumpscare && img.dataset.scare) {
          img.src = img.dataset.scare;
          img.classList.remove("inverted-view");
        } else if (img.dataset.normal) {
          img.src = img.dataset.normal;
          img.classList.add("inverted-view");
        }
      }
    }
    if (this.pageId === "15" && f.shenqiaoStare) {
      const wrap = document.getElementById("shenqiao-photo-wrap");
      wrap?.classList.add("is-revealed");
      document.getElementById("shenqiao-terror").hidden = false;
    }
    if (this.pageId === "31") {
      const cctv = document.getElementById("monitor-cctv");
      const room = document.getElementById("monitor-room");
      if (f.monitorSeen && cctv?.dataset.scare) {
        cctv.src = cctv.dataset.scare;
        room?.classList.add("is-scare-frame");
        document.getElementById("monitor-hint")?.remove();
      }
    }
    const badge = document.getElementById("page-badge");
    const meta = this.PAGE_REGISTRY[this.pageId];
    if (badge && meta)
      badge.textContent = meta.num === "EX" ? "扩展" : `P.${meta.num}`;
  },

  resolveSearch(kw) {
    const k = kw.trim();
    if (!k) return null;
    const f = this.state.flags;
    const t = this.state.tokens || {};

    /* 带前置条件的匹配须排在通用关键词之前 */
    if (f.threeProofs && (k.includes("陈小满回拨") || k.includes("回拨录音"))) {
      return { href: GameRoutes.page("29") };
    }
    if (f.revokeEntered && k.includes("赵逢春"))
      return { href: GameRoutes.page("35") };
    if (f.room7Revealed && /room\s*7/i.test(k))
      return { href: GameRoutes.page("31") };
    if (f.chenCallSeen && k.includes("第七接线室"))
      return { href: GameRoutes.page("30") };
    if (f.monitorSeen && k.includes("值班表"))
      return { href: GameRoutes.page("32") };
    if (k.includes("监控")) return { alert: "未找到相关结果。" };
    if (k.includes("三项证明")) {
      if (t.ren && t.zhong && t.xian) return { href: GameRoutes.page("28") };
      if (f.loginSuccess)
        return { alert: "培训尚未全部完成。请先完成三项培训。" };
      return { alert: "未找到相关结果。" };
    }

    if (
      typeof Puzzles.isVoiceGuideSkipSearch === "function" &&
      Puzzles.isVoiceGuideSkipSearch(k)
    )
      return {
        href: GameRoutes.page(
          "trap-skip",
          `q=${encodeURIComponent(k.trim())}`
        ),
      };

    if (k.includes("停水")) return { alert: "找到 3 条停水通知。" };
    if (k.includes("迁移")) return { href: GameRoutes.page("ex-migrate") };
    if (k.includes("无人来电") || k === "无人")
      return { href: GameRoutes.page("09") };
    if (k.includes("沈桥")) return { href: GameRoutes.page("14") };
    if (/^chenq$/i.test(k.trim())) return { href: GameRoutes.page("24") };
    if (k.includes("陈小满"))
      return {
        href: GameRoutes.page(
          "trap-skip",
          `q=${encodeURIComponent(k.trim())}`
        ),
      };
    if (k.includes("旧钟楼") || (k.includes("钟楼") && !k.includes("检修")))
      return { href: GameRoutes.page("18", "sr=1") };
    if (k.includes("检修")) return { href: GameRoutes.page("19") };
    if (k.includes("林雁")) return { alert: "未找到相关结果。" };
    if (k.includes("人声回填") || k.includes("人声机制"))
      return { href: GameRoutes.page("23") };
    if (
      !f.room7Revealed &&
      (/room\s*7/i.test(k) ||
        k.toLowerCase().includes("room7") ||
        (k.includes("第七") && k.includes("登录")))
    ) {
      return { href: GameRoutes.page("20") };
    }
    if (
      f.room7Revealed &&
      (/room\s*7/i.test(k) || k.toLowerCase().includes("room7"))
    ) {
      return { href: GameRoutes.page("31") };
    }
    if (Puzzles.isNull0017Search(k)) return { href: GameRoutes.page("27c") };
    if (k.includes("接线规范")) return { href: GameRoutes.page("21") };
    if (k.includes("撤销")) return { href: GameRoutes.page("34") };
    if (k.includes("赵逢春")) return { alert: "未找到相关结果。" };
    if (k.includes("回拨")) return { href: GameRoutes.page("11") };

    return { alert: "未找到相关结果。" };
  },

  initHandlers() {
    const id = this.pageId;
    const s = this.state;

    if (id === "05") {
      document
        .getElementById("form-message")
        ?.addEventListener("submit", (e) => {
          e.preventDefault();
          if (s.flags.submittedMessage) {
            this.showAlertModal("留言不可重复提交。");
            return;
          }
          const raw = e.target.name.value.trim();
          if (!raw) {
            if (!s.nameWarnedOnce) {
              s.nameWarnedOnce = true;
              Storage.save(s);
              this.showAlertModal("请补充称呼后再提交留言。");
              return;
            }
            s.playerName = "无名";
            if (Puzzles.isHiddenName("无名")) s.hiddenEligible = true;
          } else {
            s.playerName = raw;
            if (Puzzles.isHiddenName(raw)) s.hiddenEligible = true;
          }
          s.flags.submittedMessage = true;
          Storage.save(s);
          location.href = GameRoutes.page("06");
        });
    }

    if (id === "09") s.flags.readNoCaller = true;
    if (id === "12") s.flags.readAccident = true;
    if (id === "07") s.flags.readNightDuty = true;
    if (id === "23") s.flags.readVoiceFill = true;

    if (id === "10") {
      const go = (kw) => {
        const r = this.resolveSearch(kw);
        if (!r) return;
        if (r.alert) this.showAlertModal(r.alert);
        else if (r.href) {
          if (
            (typeof Puzzles.isVoiceGuideSkipSearch === "function" &&
              Puzzles.isVoiceGuideSkipSearch(kw)) ||
            kw.includes("陈小满")
          ) {
            GameImages?.preload(["img_skip_trap_index_glitch"]);
          }
          this.recordSearchKeyword(kw);
          location.href = r.href;
        }
      };
      const wrap = document.getElementById("search-history");
      if (wrap) wrap.__searchGo = go;
      this.renderSearchHistory();
      document.querySelectorAll("[data-kw]").forEach((btn) => {
        btn.addEventListener("click", () => go(btn.getAttribute("data-kw")));
      });
      const input = document.getElementById("news-search");
      document
        .getElementById("btn-news-search")
        ?.addEventListener("click", () => go(input?.value || ""));
      input?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") go(e.target.value);
      });
    }

    if (id === "12") {
      document.getElementById("btn-pdf-pwd")?.addEventListener("click", () => {
        const val = document.getElementById("pdf-pwd")?.value;
        if (Puzzles.validatePassword114(val)) {
          s.flags.pdfUnlocked = true;
          Storage.save(s);
          location.href = GameRoutes.page("17");
        } else alert("密码错误。");
      });
    }

    if (id === "13") {
      document
        .getElementById("btn-photo-scare")
        ?.addEventListener("click", () => {
          const btn = document.getElementById("btn-photo-scare");
          const img = document.getElementById("staff-img");
          if (document.body.classList.contains("archive-scare-active")) return;
          btn.disabled = true;
          btn.textContent = "加载中……";
          if (img) {
            img.classList.remove("inverted-view");
            img.style.transition = "transform 0.55s ease, filter 0.4s ease";
            img.style.transform = "scale(1.06)";
            img.style.filter = "none";
          }
          setTimeout(() => {
            this.runArchiveJumpscare({
              normalSrc:
                img?.dataset.normal ||
                GameImages.origSrc("img_duty_staff_hidden_visitor"),
              scareSrc:
                img?.dataset.scare ||
                GameImages.origSrc("img_duty_staff_archived_jumpscare"),
              playerName: this.pn(),
              caption: "请不要让照片里的人发现你在看。",
              onDone: () => {
                s.flags.photoJumpscare = true;
                Storage.save(s);
                location.reload();
              },
            });
          }, 720);
        });
    }

    if (id === "15") this.initShenqiaoPhoto();

    if (id === "17") this.initPdfMagnifier();

    if (id === "16") {
      const btn = document.getElementById("btn-play-audio");
      const transcript = document.getElementById("shenqiao-transcript");
      const audioEl =
        document.getElementById("shenqiao-audio") ||
        new Audio(GameAudio.src("shenqiao"));

      btn?.addEventListener("click", () => {
        if (btn.disabled) return;
        const playCount = s.flags.shenqiaoSamplePlayCount || 0;
        if (playCount >= 1 && transcript) transcript.hidden = false;

        btn.disabled = true;
        btn.textContent = "▶ 播放中……";
        audioEl.currentTime = 0;
        audioEl.play().catch(() => {
          btn.disabled = false;
          btn.textContent = playCount ? "▶ 重新播放" : "▶ 播放样本";
        });
      });

      audioEl.addEventListener("ended", () => {
        s.flags.shenqiaoSamplePlayCount =
          (s.flags.shenqiaoSamplePlayCount || 0) + 1;
        Storage.save(s);
        btn.disabled = false;
        btn.textContent = "▶ 重新播放";
      });
    }

    if (id === "20") {
      document.getElementById("form-login")?.addEventListener("submit", (e) => {
        e.preventDefault();
        if (Puzzles.validateLogin(e.target.code.value, e.target.pwd.value)) {
          s.flags.loginSuccess = true;
          Storage.save(s);
          location.href = GameRoutes.page("22");
        } else alert("登录失败。");
      });
    }

    if (id === "25") {
      const cell = document.getElementById("handler-cell");
      if (cell && !cell.dataset.bound) {
        cell.dataset.bound = "1";
        const names = ["沈桥", "无", this.pn()];
        let i = 0;
        cell.addEventListener("mouseenter", () => {
          const t = setInterval(() => {
            cell.textContent = names[i % 3];
            cell.classList.toggle("handler-flash", i % 3 === 2);
            i++;
            if (i > 8) clearInterval(t);
          }, 350);
        });
      }
    }

    if (id === "26a") {
      this.bindSilenceWaveControls();
      Utils.bindChineseOnlyInput(document.getElementById("voice-kw"));
      document.getElementById("btn-silence")?.addEventListener("click", () => {
        this.runSilenceWaveform();
      });
      document.getElementById("btn-voice-kw")?.addEventListener("click", () => {
        if (
          Puzzles.validateVoiceKeyword(
            document.getElementById("voice-kw")?.value
          )
        ) {
          s.tokens.ren = true;
          Storage.save(s);
          location.href = GameRoutes.page("27a");
        } else alert("输入无效。");
      });
    }

    if (id === "26b") {
      document
        .getElementById("clock-anomaly")
        ?.addEventListener("click", () => (location.href = GameRoutes.page("27b")));
    }

    if (id === "27b") {
      document
        .getElementById("btn-clock-proof")
        ?.addEventListener("click", () => {
          if (
            Puzzles.validateClockProof(
              document.getElementById("clock-proof")?.value
            )
          ) {
            s.tokens.zhong = true;
            Storage.save(s);
            location.reload();
          } else alert("输入无效。");
        });
    }

    if (id === "26c") {
      const selectedBooths = new Set();
      let shapePick = null;
      let mapLocked = false;
      const resetBoothMap = () => {
        selectedBooths.clear();
        shapePick = null;
        mapLocked = false;
        document
          .querySelectorAll(".booth-btn, .shape-btn")
          .forEach((x) => x.classList.remove("selected"));
        document.getElementById("map-result")?.classList.remove("show");
      };
      const tryFinishBoothMap = () => {
        if (selectedBooths.size !== 3 || !shapePick) return;
        mapLocked = true;
        if (
          Puzzles.validateBoothMapPuzzle([...selectedBooths], shapePick)
        ) {
          document.getElementById("map-result")?.classList.add("show");
        } else {
          alert("错误。");
          resetBoothMap();
        }
      };
      document.querySelectorAll(".booth-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (mapLocked) return;
          const booth = btn.getAttribute("data-booth");
          if (selectedBooths.has(booth) || selectedBooths.size >= 3) return;
          selectedBooths.add(booth);
          btn.classList.add("selected");
          tryFinishBoothMap();
        });
      });
      document.querySelectorAll(".shape-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (mapLocked) return;
          if (shapePick) return;
          shapePick = btn.getAttribute("data-shape");
          btn.classList.add("selected");
          tryFinishBoothMap();
        });
      });
    }

    if (id === "27c") {
      document
        .getElementById("btn-empty-proof")
        ?.addEventListener("click", () => {
          if (
            Puzzles.validateEmptyLine(
              document.getElementById("empty-proof")?.value
            )
          ) {
            s.tokens.xian = true;
            Storage.save(s);
            location.reload();
          } else alert("输入无效。");
        });
    }

    if (id === "28") {
      document
        .getElementById("form-proofs")
        ?.addEventListener("submit", (e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          if (
            Puzzles.validateThreeProofs(
              fd.get("ren"),
              fd.get("zhong"),
              fd.get("xian")
            )
          ) {
            s.flags.threeProofs = true;
            s.tokens = { ren: true, zhong: true, xian: true };
            Storage.save(s);
            location.reload();
          } else alert("输入无效。");
        });
    }

    if (id === "29") {
      const btn = document.getElementById("btn-chen-audio");
      const area = document.getElementById("chen-call-area");
      const audioEl =
        document.getElementById("chen-audio") ||
        new Audio(GameAudio.src("chenxiaoman"));
      const CHEN_POST_AUDIO_DELAY = 3000;
      let awaitingChenTransition = false;

      const renderChenStatus = () => {
        if (!area) return;
        if (s.flags.chenCallSeen) {
          area.innerHTML =
            '<p class="terror-text">来电已转入第七接线室。</p>';
        } else if (s.flags.chenRecordingPlayed) {
          area.innerHTML =
            `<p class="terror-text">录音结束。请进入 <a href="${GameRoutes.page("30")}">第七接线室</a>。</p>`;
        }
      };

      renderChenStatus();
      if (s.flags.chenRecordingPlayed && btn) {
        btn.textContent = "▶ 重新播放";
      }

      btn?.addEventListener("click", () => {
        if (btn.disabled || awaitingChenTransition) return;

        btn.disabled = true;
        btn.textContent = "▶ 播放中……";
        audioEl.currentTime = 0;
        audioEl.play().catch(() => {
          btn.disabled = false;
          btn.textContent = s.flags.chenRecordingPlayed
            ? "▶ 重新播放"
            : "▶ 播放录音";
        });
      });

      audioEl.addEventListener("ended", () => {
        if (s.flags.chenRecordingPlayed) {
          btn.disabled = false;
          btn.textContent = "▶ 重新播放";
          return;
        }

        awaitingChenTransition = true;
        btn.disabled = true;
        btn.textContent = "▶ 转接中……";

        setTimeout(() => {
          this.runChenCallPopup(() => {
            s.flags.chenRecordingPlayed = true;
            Storage.save(s);
            location.href = GameRoutes.page("30");
          });
        }, CHEN_POST_AUDIO_DELAY);
      });
    }

    if (id === "30") {
      const revealPlan = () => {
        document.getElementById("plan-wrap")?.classList.add("is-revealed");
        const el = document.getElementById("room7-reveal");
        if (el) el.hidden = false;
        s.flags.room7Revealed = true;
        Storage.save(s);
      };
      document
        .getElementById("btn-reveal-room7")
        ?.addEventListener("click", revealPlan);
      document
        .getElementById("plan-wrap")
        ?.addEventListener("click", revealPlan);

      if (s.flags.chenRecordingPlayed && !s.flags.chenCallSeen) {
        setTimeout(
          () =>
            this.runChenCallPopup(() => {
              const note = document.getElementById("chen-transfer-note");
              if (note) note.hidden = false;
            }),
          400
        );
      } else if (s.flags.chenCallSeen) {
        const note = document.getElementById("chen-transfer-note");
        if (note) note.hidden = false;
      }
    }

    if (id === "31") {
      document.getElementById("btn-monitor")?.addEventListener("click", () => {
        if (document.body.classList.contains("monitor-scare-active")) return;
        this.runMonitorJumpscare();
      });
    }

    if (id === "33") {
      document
        .getElementById("btn-confirm-duty")
        ?.addEventListener("click", () => {
          s.ending = "bad";
          Storage.save(s);
          location.href = GameRoutes.page("37");
        });
    }

    if (id === "34") {
      document.getElementById("btn-revoke")?.addEventListener("click", () => {
        if (
          Puzzles.validateRevoke(document.getElementById("revoke-input")?.value)
        ) {
          s.flags.revokeEntered = true;
          Storage.save(s);
          location.reload();
        } else alert("输入无效。");
      });
    }

    if (id === "trap-skip") {
      const q = new URLSearchParams(location.search).get("q") || "";
      this.runVoiceGuideSkipTrap(q);
    }

    if (id === "35") {
      document
        .getElementById("form-backdoor")
        ?.addEventListener("submit", (e) => {
          e.preventDefault();
          const items = [e.target.r.value, e.target.z.value, e.target.x.value];
          if (Puzzles.validateBackdoor(items)) {
            s.flags.conflictResolved = true;
            Storage.save(s);
            location.href = GameRoutes.page("36");
          } else alert("输入无效。");
        });
    }

    if (id === "36") {
      document
        .getElementById("btn-disconnect")
        ?.addEventListener("click", () => {
          s.ending = "good";
          Storage.save(s);
          location.href = GameRoutes.page("38");
        });
      document
        .getElementById("btn-accept-call")
        ?.addEventListener("click", () => {
          s.ending = "bad";
          Storage.save(s);
          location.href = GameRoutes.page("37");
        });
      document.querySelectorAll("#btn-hidden").forEach((btn) => {
        btn.addEventListener("click", () => {
          const input =
            btn.closest(".system-override")?.querySelector("#hidden-input") ||
            document.getElementById("hidden-input");
          if (s.hiddenEligible && Puzzles.validateHiddenEnding(input?.value)) {
            s.ending = "hidden";
            Storage.save(s);
            location.href = GameRoutes.page("39");
          } else alert("无法执行。");
        });
      });
    }

    if (id === "37") {
      this.runBadEndingScare();
    }

    if (id === "38") {
      const panel = document.getElementById("good-ending-panel");
      if (panel)
        requestAnimationFrame(() => panel.classList.add("is-animating"));
    }
  },

  initPdfMagnifier() {
    const wrap = document.getElementById("pdf-magnifier-wrap");
    const img = document.getElementById("pdf-magnifier-img");
    const lens = document.getElementById("pdf-magnifier-lens");
    const lensInner = lens?.querySelector(".pdf-magnifier-lens-inner");
    if (!wrap || !img || !lens || !lensInner || wrap.dataset.bound) return;
    wrap.dataset.bound = "1";

    const ZOOM = 2.8;
    let lensLeft = 0;
    let lensTop = 0;
    let dragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    const lensSize = () => lens.offsetWidth || 128;

    const clamp = (v, min, max) => Math.max(min, Math.min(v, max));

    const positionLens = (left, top) => {
      const size = lensSize();
      lensLeft = left;
      lensTop = top;
      lens.style.left = `${lensLeft}px`;
      lens.style.top = `${lensTop}px`;

      const imgRect = img.getBoundingClientRect();
      const w = imgRect.width;
      const h = imgRect.height;
      if (!w || !h) return;
      const centerX = lensLeft + size / 2;
      const centerY = lensTop + size / 2;
      const localX = clamp(centerX - imgRect.left, 0, w);
      const localY = clamp(centerY - imgRect.top, 0, h);
      lensInner.style.backgroundPosition = `${-(localX * ZOOM - size / 2)}px ${-(localY * ZOOM - size / 2)}px`;
    };

    const centerLens = () => {
      const size = lensSize();
      const imgRect = img.getBoundingClientRect();
      positionLens(
        imgRect.left + (imgRect.width - size) / 2,
        imgRect.top + (imgRect.height - size) / 2
      );
    };

    const updateBg = () => {
      const imgRect = img.getBoundingClientRect();
      const w = imgRect.width;
      const h = imgRect.height;
      if (!w || !h) return;
      const src = img.currentSrc || img.src;
      lensInner.style.backgroundImage = `url("${src}")`;
      lensInner.style.backgroundSize = `${w * ZOOM}px ${h * ZOOM}px`;
      positionLens(lensLeft, lensTop);
    };

    const onPointerDown = (e) => {
      dragging = true;
      lens.classList.add("is-dragging");
      dragOffsetX = e.clientX - lensLeft;
      dragOffsetY = e.clientY - lensTop;
      lens.setPointerCapture(e.pointerId);
      e.preventDefault();
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      positionLens(e.clientX - dragOffsetX, e.clientY - dragOffsetY);
    };

    const onPointerUp = (e) => {
      if (!dragging) return;
      dragging = false;
      lens.classList.remove("is-dragging");
      if (lens.hasPointerCapture(e.pointerId)) {
        lens.releasePointerCapture(e.pointerId);
      }
    };

    lens.addEventListener("pointerdown", onPointerDown);
    lens.addEventListener("pointermove", onPointerMove);
    lens.addEventListener("pointerup", onPointerUp);
    lens.addEventListener("pointercancel", onPointerUp);

    img.addEventListener("load", () => {
      centerLens();
      updateBg();
    });
    if (img.complete) {
      centerLens();
      updateBg();
    }

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(updateBg);
      ro.observe(img);
    } else {
      window.addEventListener("resize", updateBg);
    }
    window.addEventListener("scroll", updateBg, { passive: true });
  },

  initShenqiaoPhoto() {
    const wrap = document.getElementById("shenqiao-photo-wrap");
    if (!wrap || wrap.dataset.bound) return;
    wrap.dataset.bound = "1";

    const s = this.state;
    if (s.flags.shenqiaoStare) return;

    let timers = [];
    const clearTimers = () => {
      timers.forEach(clearTimeout);
      timers = [];
    };

    const reveal = () => {
      if (
        wrap.classList.contains("is-revealed") ||
        document.body.classList.contains("stare-scare-active")
      )
        return;
      clearTimers();
      wrap.classList.remove("is-glitching");
      wrap.classList.add("is-flash", "is-revealed");
      setTimeout(() => wrap.classList.remove("is-flash"), 380);

      /* 页内先切换为凝视版，停顿后再从原位置扑出 */
      timers.push(
        setTimeout(() => {
          this.runStareJumpscare({
            sourceEl: wrap,
            imageSrc: GameImages.src("img_shenqiao_award_stare"),
            playerName: this.pn(),
            caption: "请不要与表彰照片对视。",
            onDone: () => {
              document.getElementById("shenqiao-terror").hidden = false;
              s.flags.shenqiaoStare = true;
              Storage.save(s);
              this.runShenqiaoCameraFlood();
            },
          });
        }, 2000)
      );
    };

    const schedule = () => {
      if (wrap.classList.contains("is-revealed")) return;
      clearTimers();
      timers.push(setTimeout(() => wrap.classList.add("is-glitching"), 2800));
      timers.push(setTimeout(reveal, 4500));
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) schedule();
          else {
            clearTimers();
            if (!wrap.classList.contains("is-revealed"))
              wrap.classList.remove("is-glitching");
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(wrap);

    wrap.addEventListener("click", () => {
      if (wrap.classList.contains("is-revealed")) return;
      clearTimers();
      wrap.classList.add("is-glitching");
      timers.push(setTimeout(reveal, 280));
    });
  },

  runChenCallPopup(onComplete) {
    const s = this.state;
    if (
      s.flags.chenCallSeen ||
      document.body.classList.contains("chen-call-active")
    ) {
      onComplete?.();
      return;
    }

    document.body.classList.add("chen-call-active");
    const blackout = document.createElement("div");
    blackout.className = "chen-call-blackout";
    document.body.appendChild(blackout);

    setTimeout(() => {
      blackout.classList.add("is-lifting");
      Utils.playPhoneRingBurst(5);
      setTimeout(() => blackout.remove(), 450);

      const ov = document.getElementById("modal-overlay");
      const content = document.getElementById("modal-content");
      if (!ov || !content) return;

      content.innerHTML = `<div class="chen-call-modal modal-order">
        <h3>📞 当前来电</h3>
        <p class="chen-call-name">陈小满</p>
        <p>呼入时间：${Utils.formatTomorrow()}</p>
        <p class="chen-call-ask">是否由 <strong>${Utils.escapeHtml(
          this.pn()
        )}</strong> 接听？</p>
        <div class="chen-call-actions">
          <button type="button" class="y2k-btn primary" disabled id="chen-btn-accept">接听</button>
          <button type="button" class="y2k-btn" disabled id="chen-btn-hangup">挂断</button>
        </div>
        <p class="chen-call-hint blink">系统转接中……按钮暂不可用</p>
      </div>`;
      ov.classList.remove("hidden");

      const wait = s.hiddenEligible ? 30000 : 5500;
      if (s.hiddenEligible) s.chenCallWaitStart = Date.now();

      setTimeout(() => {
        ov.classList.add("hidden");
        content.innerHTML = "";
        document.body.classList.remove("chen-call-active");
        s.flags.chenCallSeen = true;
        Storage.save(s);
        onComplete?.();
      }, wait);
    }, 500);
  },

  runMonitorJumpscare() {
    const s = this.state;
    const btn = document.getElementById("btn-monitor");
    const room = document.getElementById("monitor-room");
    const img = document.getElementById("monitor-cctv");
    const status = document.getElementById("monitor-status");
    const scanline = document.getElementById("monitor-scanline");
    const hint = document.getElementById("monitor-hint");
    if (
      !room ||
      !img ||
      document.body.classList.contains("monitor-scare-active")
    )
      return;

    document.body.classList.add("monitor-scare-active");
    btn && (btn.disabled = true);
    room.classList.add("is-loading");
    if (hint) hint.textContent = "正在恢复监控信号……";
    if (status) status.textContent = "LOADING…";
    Utils.playScanWhine();
    scanline?.classList.add("is-active");

    setTimeout(() => {
      Utils.playPhoneRingBurst(3);
      room.classList.add("chair-shift");
      if (status) status.textContent = "⚠ 异常移动";
    }, 2000);

    setTimeout(() => {
      const flash = document.createElement("div");
      flash.className = "jumpscare-flash-layer";
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 320);
      if (img.dataset.scare) {
        img.src = img.dataset.scare;
        img.classList.add("is-scare-swap");
      }
      room.classList.add("is-scare-flash");
      Utils.playScareSting();
    }, 3200);

    const fullscreenAt = 3400;
    const holdMs = 2800;
    const exitMs = 950;

    setTimeout(() => {
      const ov = document.getElementById("jumpscare-overlay");
      if (ov && img.dataset.scare) {
        ov.className = "monitor-scare-fullscreen";
        ov.innerHTML = `<div class="monitor-scare-full-wrap is-holding">
          <img class="monitor-scare-full-img" src="${img.dataset.scare}" alt="">
          <div class="monitor-scare-exit-static" aria-hidden="true"></div>
          <div class="monitor-scare-crt-line" aria-hidden="true"></div>
        </div>`;
      }
    }, fullscreenAt);

    setTimeout(() => {
      const ov = document.getElementById("jumpscare-overlay");
      const wrap = ov?.querySelector(".monitor-scare-full-wrap");
      ov?.classList.add("is-exiting");
      wrap?.classList.remove("is-holding");
      wrap?.classList.add("is-exiting");
    }, fullscreenAt + holdMs);

    setTimeout(() => {
      const ov = document.getElementById("jumpscare-overlay");
      ov?.classList.add("hidden");
      ov && (ov.innerHTML = "");
      document.body.classList.remove("monitor-scare-active");
      s.flags.monitorSeen = true;
      Storage.save(s);
      location.reload();
    }, fullscreenAt + holdMs + exitMs);
  },

  runVoiceGuideSkipTrap(query) {
    const root = document.getElementById("skip-trap-root");
    if (!root) return;

    if (root._skipTrapTimers) {
      root._skipTrapTimers.forEach((id) => {
        clearTimeout(id);
        clearInterval(id);
      });
    }
    root._skipTrapTimers = [];

    const schedule = (fn, ms) => {
      const id = setTimeout(fn, ms);
      root._skipTrapTimers.push(id);
      return id;
    };

    document.body.classList.add("skip-trap-active");

    const kw = Utils.escapeHtml(query.trim() || "——");
    const scareOrig =
      typeof GameImages !== "undefined"
        ? GameImages.origSrc("img_skip_trap_index_glitch")
        : "";
    GameImages?.preload(["img_skip_trap_index_glitch"]);

    root.innerHTML = `
      <div class="skip-trap-terminal">
        <p class="skip-trap-line" data-phase="0">&gt; 正在索引工单编号：${kw}</p>
        <p class="skip-trap-line" data-phase="1">&gt; 匹配：人声回填指南 · 未授权访问</p>
        <p class="skip-trap-line skip-trap-warn" data-phase="2">&gt; 检测到跳过行为</p>
      </div>
      <div class="skip-trap-main">
        <p class="skip-trap-big skip-trap-question-text">你在躲避什么？</p>
        <div class="skip-trap-reveal">
          <div class="skip-trap-scare-frame">
            <img class="skip-trap-scare-img" src="${scareOrig}" alt="">
            <div class="skip-trap-scare-scanline" aria-hidden="true"></div>
          </div>
          <p class="skip-trap-whisper">跳过的步骤，系统会替你补做。</p>
        </div>
      </div>
      <div class="skip-trap-outro" data-phase="5">
        <a href="${GameRoutes.page("10")}" class="y2k-btn skip-trap-back">返回站内搜索</a>
      </div>
    `;

    const show = (sel, delay) =>
      schedule(() => root.querySelector(sel)?.classList.add("show"), delay);

    const scareImg = root.querySelector(".skip-trap-scare-img");
    if (scareImg && scareOrig && typeof GameImages !== "undefined") {
      GameImages.applyToImg(scareImg, scareOrig);
    }

    const questionEl = () => root.querySelector(".skip-trap-question-text");
    const revealEl = () => root.querySelector(".skip-trap-reveal");

    const pulseScare = () => {
      const flash = document.createElement("div");
      flash.className = "jumpscare-flash-layer skip-trap-flash";
      document.body.appendChild(flash);
      schedule(() => flash.remove(), 360);
      root.querySelector(".skip-trap-scare-frame")?.classList.add("is-pulse");
      schedule(
        () => root.querySelector(".skip-trap-scare-frame")?.classList.remove("is-pulse"),
        700
      );
      Utils.playScareSting();
      Utils.playPhoneRingBurst(2);
    };

    Utils.playSystemBeep();
    show('[data-phase="0"]', 120);
    show('[data-phase="1"]', 900);
    show('[data-phase="2"]', 1800);

    schedule(() => {
      root.classList.add("is-glitch");
      Utils.playScanWhine();
    }, 2400);

    schedule(() => {
      questionEl()?.classList.add("show");
      Utils.playPhoneRingBurst(2);
    }, 3100);

    schedule(() => {
      questionEl()?.classList.remove("show");
    }, 4200);

    schedule(() => {
      pulseScare();
      revealEl()?.classList.add("show");
    }, 4800);

    schedule(() => {
      root.classList.remove("is-glitch");
      root.classList.add("skip-trap-final");
      questionEl()?.classList.add("show");
      revealEl()?.classList.add("show");
      root.querySelector('[data-phase="5"]')?.classList.add("show");
      const loopId = setInterval(() => {
        if (!root.isConnected) {
          clearInterval(loopId);
          return;
        }
        pulseScare();
      }, 9000);
      root._skipTrapTimers.push(loopId);
    }, 6200);
  },

  runArchiveJumpscare(opts) {
    const {
      normalSrc,
      scareSrc,
      playerName,
      caption,
      onDone = () => {},
    } = opts;
    const ov = document.getElementById("jumpscare-overlay");
    if (!ov || document.body.classList.contains("archive-scare-active"))
      return onDone();

    const preloadNormal = new Image();
    preloadNormal.src = normalSrc;
    const preloadScare = new Image();
    preloadScare.src = scareSrc;

    document.body.classList.add("archive-scare-active");
    ov.className = "archive-scare-active";
    ov.innerHTML = `
      <div class="archive-scare">
        <div class="archive-scare-titlebar">
          <span>槐宁市114 · 档案扫描预览</span>
          <span class="archive-scare-id">DOC-2009-1017</span>
        </div>
        <div class="archive-scare-stage">
          <img class="archive-scare-img" src="${normalSrc}" alt="">
          <div class="archive-stamp archive-stamp-a">已归档</div>
          <div class="archive-stamp archive-stamp-b">已归档</div>
          <div class="archive-stamp archive-stamp-c">已归档</div>
          <div class="archive-scare-scanline"></div>
        </div>
        <div class="archive-scare-log"></div>
        <p class="archive-scare-caption">${Utils.escapeHtml(caption)}</p>
      </div>
    `;

    const img = ov.querySelector(".archive-scare-img");
    const logEl = ov.querySelector(".archive-scare-log");
    const scanline = ov.querySelector(".archive-scare-scanline");
    const stamps = ov.querySelectorAll(".archive-stamp");

    Utils.playScanWhine();
    setTimeout(() => scanline?.classList.add("is-scanning"), 80);

    setTimeout(() => {
      if (img) {
        img.src = scareSrc;
        img.classList.add("is-scare");
      }
    }, 1050);

    setTimeout(() => {
      stamps.forEach((el, i) => {
        setTimeout(() => {
          el.classList.add("show");
          Utils.playStampThud();
        }, i * 200);
      });
    }, 2050);

    const logLines = [
      "> 档案比对中……完成",
      "> 检测到未登记访客",
      `> 写入第七位：${playerName}`,
      "> 状态：已归档",
    ];
    logLines.forEach((line, i) => {
      setTimeout(() => {
        const p = document.createElement("p");
        p.textContent = line;
        if (i === 2) p.className = "archive-log-hit";
        logEl?.appendChild(p);
        Utils.playSystemBeep();
      }, 2800 + i * 420);
    });

    setTimeout(
      () => ov.querySelector(".archive-scare-caption")?.classList.add("show"),
      4600
    );
    setTimeout(() => ov.classList.add("is-fading"), 5200);
    setTimeout(() => {
      ov.className = "hidden";
      ov.innerHTML = "";
      document.body.classList.remove("archive-scare-active");
      onDone();
    }, 6000);
  },

  runStareJumpscare(opts) {
    const { sourceEl, imageSrc, playerName, caption, onDone = () => {} } = opts;
    const ov = document.getElementById("jumpscare-overlay");
    if (
      !ov ||
      !sourceEl ||
      document.body.classList.contains("stare-scare-active")
    )
      return onDone();

    const rect = sourceEl.getBoundingClientRect();
    document.body.classList.add("stare-scare-active");
    ov.className = "stare-scare-active";
    ov.innerHTML = `
      <div class="stare-scare-backdrop"></div>
      <div class="stare-scare-lunge" style="--sx:${rect.left}px;--sy:${
      rect.top
    }px;--sw:${rect.width}px;--sh:${rect.height}px">
        <img src="${imageSrc}" alt="" class="stare-scare-face">
      </div>
      <p class="stare-scare-whisper">${Utils.escapeHtml(
        playerName
      )}，你在看吗？</p>
      <p class="stare-scare-caption">${Utils.escapeHtml(caption)}</p>
    `;

    const lunge = ov.querySelector(".stare-scare-lunge");
    sourceEl.classList.add("is-lunging-source");
    requestAnimationFrame(() => lunge?.classList.add("is-lunging"));

    setTimeout(() => Utils.playTone(160, 0.2, 0.18), 120);
    setTimeout(
      () => ov.querySelector(".stare-scare-whisper")?.classList.add("show"),
      700
    );
    setTimeout(() => Utils.playPhoneRingBurst(2), 1400);
    setTimeout(
      () => ov.querySelector(".stare-scare-caption")?.classList.add("show"),
      2100
    );

    setTimeout(() => {
      lunge?.classList.add("is-retreat");
      ov.classList.add("is-retreat");
    }, 3400);

    setTimeout(() => {
      ov.className = "hidden";
      ov.innerHTML = "";
      sourceEl.classList.remove("is-lunging-source");
      document.body.classList.remove("stare-scare-active");
      onDone();
    }, 4200);
  },

  async runShenqiaoCameraFlood() {
    if (!navigator.mediaDevices?.getUserMedia) return;

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
    } catch {
      return;
    }

    const titles = [
      "系统提示",
      "应用程序错误",
      "114 热线",
      "权限不足",
      "值班记录冲突",
      "未授权访问",
      "ERR-0017",
      "第七接线室",
    ];
    const msgs = [
      "检测到未登记值班人。",
      "人声回填失败。",
      "明日无法确认。",
      "请不要与表彰照片对视。",
      "空线不构成呼叫。",
      "当前权限不足。",
      "回拨记录时间异常。",
      "你在看吗？",
    ];

    const layer = document.createElement("div");
    layer.className = "cam-flood-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    const flashEl = document.createElement("div");
    flashEl.className = "cam-flood-flash-layer";
    document.body.appendChild(flashEl);

    const chrome = document.createElement("div");
    chrome.className = "cam-flood-chrome";
    chrome.innerHTML = `
      <div class="cam-flood-rgb-split" aria-hidden="true"></div>
      <div class="cam-flood-scanbar" aria-hidden="true"></div>
      <p class="cam-flood-banner">检测到外部观测设备 · ${Utils.escapeHtml(
        this.pn()
      )}</p>
      <p class="cam-flood-banner cam-flood-banner-sub">槐宁市114旧站 · 窗口层已失去控制</p>`;
    document.body.appendChild(chrome);

    document.body.classList.add("cam-flood-active", "cam-flood-phase-1");
    Utils.playTone(95, 0.18, 0.22);
    setTimeout(() => Utils.playTone(72, 0.12, 0.16), 120);

    const setPhase = (n) => {
      document.body.classList.remove(
        "cam-flood-phase-1",
        "cam-flood-phase-2",
        "cam-flood-phase-3"
      );
      document.body.classList.add(`cam-flood-phase-${n}`);
    };

    const triggerFlash = (strong = false) => {
      flashEl.classList.remove("is-on", "is-strong");
      void flashEl.offsetWidth;
      flashEl.classList.add("is-on");
      if (strong) flashEl.classList.add("is-strong");
    };

    const triggerScan = () => {
      const bar = chrome.querySelector(".cam-flood-scanbar");
      if (!bar) return;
      bar.classList.remove("is-sweep");
      void bar.offsetWidth;
      bar.classList.add("is-sweep");
    };

    const winW = 210;
    const winH = 200;
    const area = window.innerWidth * window.innerHeight;
    const targetCount = Math.min(
      48,
      Math.max(14, Math.ceil((area / (winW * winH)) * 1.35))
    );
    const HOLD_MS = 3600;
    let spawned = 0;
    let spawnTimer = null;
    let sustainFlashTimer = null;

    const stopStream = () => {
      stream.getTracks().forEach((t) => t.stop());
    };

    const cleanup = () => {
      clearTimeout(spawnTimer);
      clearInterval(sustainFlashTimer);
      stopStream();
      document.body.classList.add("cam-flood-exit");
      layer.classList.add("is-exit");
      setTimeout(() => {
        layer.remove();
        chrome.remove();
        flashEl.remove();
        document.body.classList.remove(
          "cam-flood-active",
          "cam-flood-phase-1",
          "cam-flood-phase-2",
          "cam-flood-phase-3",
          "cam-flood-exit"
        );
      }, 900);
    };

    const startSustain = () => {
      setPhase(3);
      triggerFlash(true);
      Utils.playTone(58, 0.22, 0.14);
      sustainFlashTimer = setInterval(() => {
        triggerFlash(Math.random() > 0.55);
        triggerScan();
        if (Math.random() > 0.4) {
          Utils.playTone(70 + Math.random() * 50, 0.05, 0.1);
        }
      }, 820);
      spawnTimer = setTimeout(() => {
        clearInterval(sustainFlashTimer);
        cleanup();
      }, HOLD_MS);
    };

    const spawnWin = () => {
      if (spawned >= targetCount) {
        startSustain();
        return;
      }
      spawned += 1;

      const ratio = spawned / targetCount;
      if (ratio > 0.62) setPhase(3);
      else if (ratio > 0.32) setPhase(2);

      const title = titles[Math.floor(Math.random() * titles.length)];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      const w = winW + Math.floor(Math.random() * 40) - 10;
      const maxX = Math.max(0, window.innerWidth - w - 4);
      const maxY = Math.max(0, window.innerHeight - (winH + 20) - 4);
      const rot = (Math.random() - 0.5) * 10;

      const win = document.createElement("div");
      win.className = "cam-flood-win";
      win.style.width = `${w}px`;
      win.style.left = `${Math.random() * maxX}px`;
      win.style.top = `${Math.random() * maxY}px`;
      win.style.setProperty("--cam-rot", `${rot}deg`);
      win.style.zIndex = String(10 + spawned);
      win.innerHTML = `
        <div class="cam-flood-title">
          <span>${Utils.escapeHtml(title)}</span>
          <span class="cam-flood-close" aria-hidden="true">×</span>
        </div>
        <div class="cam-flood-body">
          <video class="cam-flood-video" autoplay playsinline muted></video>
          <p class="cam-flood-msg">${Utils.escapeHtml(msg)}</p>
        </div>
        <div class="cam-flood-btns">
          <span class="cam-flood-btn">确定</span>
        </div>`;
      layer.appendChild(win);

      const video = win.querySelector("video");
      if (video) {
        video.srcObject = stream;
        video.play().catch(() => {});
      }

      if (spawned % 4 === 0) {
        triggerFlash(spawned % 12 === 0);
        triggerScan();
      }
      if (spawned % 5 === 0) {
        Utils.playTone(110 + Math.random() * 90, 0.06, 0.13);
      }
      if (spawned === 1) triggerFlash(true);

      const delay = 65 + Math.random() * 105;
      spawnTimer = setTimeout(spawnWin, delay);
    };

    spawnWin();
  },

  showModal(html) {
    document.getElementById("modal-content").innerHTML = html;
    document.getElementById("modal-overlay").classList.remove("hidden");
  },

  showAlertModal(msg) {
    this.showModal(
      `<div class="alert-modal"><p>${Utils.escapeHtml(
        msg
      )}</p><button class="y2k-btn primary" type="button" id="modal-alert-ok">确定</button></div>`
    );
    document
      .getElementById("modal-alert-ok")
      ?.addEventListener("click", () => this.hideModal());
  },

  hideModal() {
    document.getElementById("modal-overlay").classList.add("hidden");
  },

  initMonitorCreep() {
    if (document.getElementById("roster-creep-wrap")) return;
    const seen = document.querySelector('[data-if-flag="monitorSeen"]');
    if (!seen) return;
    const wrap = document.createElement("div");
    wrap.id = "roster-creep-wrap";
    wrap.className = "roster-creep-wrap";
    wrap.innerHTML = `<p class="roster-creep-line" aria-live="polite"><span class="roster-creep-text">让我看看值班表</span><span class="roster-creep-ghost" aria-hidden="true">让我看看值班表</span></p><p class="roster-creep-subline">……${Utils.escapeHtml(this.pn())}……在表上吗……</p>`;
    seen.appendChild(wrap);
    if (this.state.flags.monitorCreepScare) return;
    setTimeout(() => this.runRosterCreepScare(), 4200);
  },

  runRosterCreepScare() {
    if (
      this.pageId !== "31" ||
      document.body.classList.contains("roster-creep-scare-active")
    )
      return;
    const s = this.state;
    document.body.classList.add("roster-creep-scare-active");
    const flash = document.createElement("div");
    flash.className = "jumpscare-flash-layer roster-creep-flash";
    document.body.appendChild(flash);
    Utils.playScareSting();
    Utils.playPhoneRingBurst(4);
    const ov = document.getElementById("jumpscare-overlay");
    if (ov) {
      ov.className = "roster-creep-overlay";
      ov.innerHTML = `<div class="roster-creep-scare">
        <p class="roster-creep-whisper">${Utils.escapeHtml(this.pn())}</p>
        <p class="roster-creep-big">让我看看值班表</p>
        <p class="roster-creep-sub">—— 第七接线室 · 00:17</p>
      </div>`;
      setTimeout(() => ov.classList.add("is-visible"), 40);
    }
    setTimeout(() => {
      ov?.classList.add("hidden");
      ov && (ov.className = "hidden");
      ov && (ov.innerHTML = "");
      flash.remove();
      document.body.classList.remove("roster-creep-scare-active");
      s.flags.monitorCreepScare = true;
      Storage.save(s);
    }, 2800);
  },

  runBadEndingScare() {
    setTimeout(() => Utils.playPhoneRing(), 200);
    setTimeout(() => {
      for (let i = 0; i < 14; i++) setTimeout(Utils.playPhoneRing, i * 220);
    }, 800);
    setTimeout(() => {
      const flash = document.createElement("div");
      flash.className = "bad-ending-flash";
      document.body.appendChild(flash);
      Utils.playScareSting();
      setTimeout(() => flash.remove(), 600);
    }, 3200);
    this.initBadEndingScrollReveal();
  },

  SILENCE_MORSE:
    "-... ..- -.-- .- --- ... .... ..- --- -.-. .... ..- -- .. -. --. --.. ..",

  morseToWaveSamples(morse) {
    const samples = [];
    const base = 0.5;
    const nudge = (spread = 0.018) => base + (Math.random() - 0.5) * spread;
    const flat = (n) => {
      for (let i = 0; i < n; i++) samples.push(nudge(0.012));
    };
    const dot = () => {
      const spike = [0.5, 0.54, 0.68, 0.82, 0.66, 0.54, 0.5];
      spike.forEach((v) => samples.push(v + (Math.random() - 0.5) * 0.02));
      flat(5);
    };
    const dash = () => {
      const n = 22 + Math.floor(Math.random() * 4);
      for (let i = 0; i < n; i++) {
        const t = i / Math.max(1, n - 1);
        const hill = 0.5 + Math.sin(t * Math.PI) * 0.28;
        const ripple = Math.sin(t * Math.PI * 3) * 0.03;
        samples.push(hill + ripple + (Math.random() - 0.5) * 0.015);
      }
      flat(5);
    };
    const words = morse.trim().split(/\s+/);
    words.forEach((word, wi) => {
      for (const ch of word) {
        if (ch === ".") dot();
        else if (ch === "-") dash();
      }
      if (wi < words.length - 1) flat(14);
    });
    flat(30);
    return samples;
  },

  bindSilenceWaveControls() {
    const slider = document.getElementById("silence-wave-speed");
    const label = document.getElementById("silence-wave-speed-val");
    if (!slider || slider.dataset.bound) return;
    slider.dataset.bound = "1";
    const sync = () => {
      const v = parseFloat(slider.value) || 1;
      if (label) label.textContent = `${v.toFixed(2).replace(/\.?0+$/, "")}×`;
      const canvas = document.getElementById("silence-wave-canvas");
      if (canvas?._silenceState) canvas._silenceState.speed = v;
    };
    slider.addEventListener("input", sync);
    sync();
  },

  SILENCE_DURATION_MS: 17000,

  drawSilenceEcgLine(ctx, samples, headIndex, playheadX, pps, cssW, cssH) {
    const mid = cssH * 0.52;
    const amp = cssH * 0.36;

    ctx.fillStyle = "#081008";
    ctx.fillRect(0, 0, cssW, cssH);

    ctx.strokeStyle = "rgba(90, 150, 100, 0.22)";
    ctx.lineWidth = 1;
    for (let y = 0; y < cssH; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(cssW, y);
      ctx.stroke();
    }

    const maxVisible = Math.max(
      2,
      Math.floor((cssW - playheadX - 10) / pps)
    );
    const scrollStart = Math.max(0, headIndex - maxVisible + 1);

    const pts = [];
    for (let idx = scrollStart; idx <= headIndex && idx < samples.length; idx++) {
      const x = playheadX + (idx - scrollStart) * pps;
      if (x < playheadX - 2 || x > cssW + 4) continue;
      const y = mid - (samples[idx] - 0.5) * amp * 2;
      pts.push({ x, y });
    }

    if (pts.length >= 2) {
      ctx.strokeStyle = "rgba(70, 200, 110, 0.28)";
      ctx.lineWidth = 4;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        const p0 = pts[i - 1];
        const p1 = pts[i];
        const cx = (p0.x + p1.x) / 2;
        const cy = (p0.y + p1.y) / 2;
        ctx.quadraticCurveTo(p0.x, p0.y, cx, cy);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.stroke();

      ctx.strokeStyle = "#6ecf8a";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        const p0 = pts[i - 1];
        const p1 = pts[i];
        const cx = (p0.x + p1.x) / 2;
        const cy = (p0.y + p1.y) / 2;
        ctx.quadraticCurveTo(p0.x, p0.y, cx, cy);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.stroke();
    } else if (pts.length === 1) {
      ctx.fillStyle = "#6ecf8a";
      ctx.beginPath();
      ctx.arc(pts[0].x, pts[0].y, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = "#7f7";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, cssH);
    ctx.stroke();
  },

  runSilenceWaveform() {
    const btn = document.getElementById("btn-silence");
    const wrap = document.getElementById("silence-wave-wrap");
    const canvas = document.getElementById("silence-wave-canvas");
    const timeEl = document.getElementById("silence-wave-time");
    const speedEl = document.getElementById("silence-wave-speed");
    if (!btn || !wrap || !canvas) return;

    if (canvas._silenceRaf) cancelAnimationFrame(canvas._silenceRaf);

    wrap.hidden = false;
    canvas.dataset.playing = "1";
    btn.disabled = true;
    btn.textContent = "▶ 播放中……";

    const samples = this.morseToWaveSamples(this.SILENCE_MORSE);
    const pps = 2.4;
    const speed = parseFloat(speedEl?.value) || 1;
    const durationMs = this.SILENCE_DURATION_MS;
    const dpr = window.devicePixelRatio || 1;
    const stage = canvas.parentElement;
    const cssW = stage?.clientWidth || 560;
    const cssH = 132;
    const playheadX = cssW * 0.12;

    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const state = {
      samples,
      elapsedMs: 0,
      speed,
      durationMs,
      lastNow: performance.now(),
      playing: true,
    };
    canvas._silenceState = state;

    const draw = (now) => {
      if (!state.playing) return;
      const dt = Math.min(48, now - state.lastNow);
      state.lastNow = now;
      state.elapsedMs += dt * state.speed;
      const t = Math.min(1, state.elapsedMs / state.durationMs);
      const headIndex = Math.min(
        samples.length - 1,
        Math.floor(t * (samples.length - 1))
      );

      this.drawSilenceEcgLine(
        ctx,
        samples,
        headIndex,
        playheadX,
        pps,
        cssW,
        cssH
      );

      const totalSec = 17 * t;
      const sec = Math.floor(totalSec);
      const ms = Math.floor((totalSec - sec) * 100);
      if (timeEl)
        timeEl.textContent = `00:${String(sec).padStart(2, "0")}.${String(ms).padStart(2, "0")}`;

      if (t < 1) {
        canvas._silenceRaf = requestAnimationFrame(draw);
      } else {
        state.playing = false;
        canvas.dataset.playing = "0";
        btn.disabled = false;
        btn.textContent = "▶ 重新播放";
      }
    };

    this.drawSilenceEcgLine(ctx, samples, -1, playheadX, pps, cssW, cssH);
    canvas._silenceRaf = requestAnimationFrame(draw);
  },

  initBadEndingScrollReveal() {
    const el = document.getElementById("bad-ending-extra");
    if (!el || el.dataset.bound) return;
    el.dataset.bound = "1";

    const reveal = () => {
      if (el.dataset.revealed) return;
      el.dataset.revealed = "1";
      el.innerHTML = `<div class="bad-ending-answer"><p class="bad-answer-line bad-answer-scream">请开始接听。</p></div>`;
      Utils.playScareSting();
    };

    const sentinel = document.createElement("div");
    sentinel.className = "bad-ending-scroll-sentinel";
    sentinel.setAttribute("aria-hidden", "true");
    el.parentNode?.insertBefore(sentinel, el);

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          reveal();
          obs.disconnect();
        }
      },
      { root: null, threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(sentinel);
  },
};

/* 首页入口逻辑 */
const INTRO_SEEN_KEY = "mingrihuibo_intro_v1";

const LANDING_INTRO_STORY = [
  "我哥失踪前最后一条短信，是一个网址。",
  "我以为是诈骗，没点开。",
  "三个月后，我梦见他在电话里说：「我在槐宁市，救救我，救——」",
  "",
  "醒来手贱搜了一下。",
  "槐宁市。南方一座我从没去过、百科里只有半页介绍的老工业小城。",
  "114 便民热线，2009 年 10 月 17 日关站。",
  "",
  "搜索结果第一条却像刚更新过：",
  "您的留言将在明日 00:17 回拨。当前访客留言已接收。",
  "",
  "明天。",
  "我的日历上也是明天。",
  "",
  "我没留言。",
  "可它知道我正在看。",
  "",
  "我告诉自己：进去看一眼，确认是诈骗网页，就关。",
  "旧站首页的横幅还是 2009 年的样式，关站通知、便民热线、留言回访——一切正常得过分。",
  "直到页脚访问量变成 114，在线人数变成 1。",
  "",
  "我开始觉得，不是我在找这个站。",
  "是这个站在等一个探索者的到来。",
];

const LANDING_INTRO_NOTICES = [
  "本作游戏时长约2小时，具体时间取决于您的探索节奏。本作支持电脑与手机双端游玩，但推荐使用电脑以获得更佳体验。建议您预留充足时间，一次性完成全流程体验，以获得最佳沉浸感。点击每页右下角（手机端为左下角）的“访问入口”回到首页即可完成自动存档，请勿直接关闭网页，否则会导致存档丢失。查看网页源代码可能会影响您的游戏体验，本作游玩过程中无需任何计算机专业知识。",
  "本作恐怖程度为“微恐”，不含血腥元素，且大部分惊吓场景（包含图片、音效的突然跳出等）都为您预留了心理准备时间，若您无法接受请勿游玩。游戏中有屏幕闪烁环节，光敏性癫痫患者请勿游玩。",
  "本作并非严格意义上的线性解谜游戏。开篇引导较为清晰，便于您快速上手；中后期引导则相对隐晦，需要您具备一定的联想能力和线索发掘能力。有些内容可能暂时用不到，有些内容可能重复用到，当然也有起到干扰作用的内容。",
  "本作解谜与剧情的大致比例为7:3。解谜难度较高，故事线中埋藏了大量伏笔与暗示，直给的剧情内容适中。适合喜爱轻度剧情驱动的解谜玩家，不太适合极度注重故事性的玩家。如果您对剧情有疑问，可前往作者的小红书账号查看解读。",
  "游戏中请善用搜索功能，所有输入部分皆可能输入数字、字母以及中文字符，也请您多加尝试。",
  "若系统向您请求某些权限，请尽量允许，以免错过重要的剧情演出。",
  "游戏包含语音聆听等环节，为保证沉浸感，建议全程佩戴耳机游玩。",
];

const LANDING_INTRO_AUTHOR =
  "这是我独立开发的第一部游戏，有很多不足之处，非常感谢您点进来游玩。欢迎您在社交平台（如小红书）上带tag #明日回拨 发表repo或建议并@作者，我看到后会去评论区回复~";

const Landing = {
  init() {
    const state = Storage.load();
    Game.injectSiteDisclaimer();
    Landing.applyDates();
    Landing.renderIndex(state);
    Landing.showIntroIfNeeded();
    document
      .getElementById("btn-reopen-intro")
      ?.addEventListener("click", () => Landing.showIntro(true));
    document.getElementById("btn-new-game")?.addEventListener("click", (e) => {
      if (Storage.hasSave() && !confirm("开始新游戏将清除存档，确定吗？")) {
        e.preventDefault();
        return;
      }
      Storage.clear();
    });
    document.getElementById("btn-continue")?.addEventListener("click", () => {
      let p = state.currentPage;
      if (!p || p === "landing") {
        const visited = (state.visitedPages || []).filter(
          (id) => id !== "landing"
        );
        p = visited.length ? visited[visited.length - 1] : "01";
      }
      location.href = GameRoutes.fromRoot(p);
    });
    document
      .getElementById("btn-toggle-index")
      ?.addEventListener("click", () => {
        const idx = document.getElementById("page-index");
        if (idx)
          idx.style.display = idx.style.display === "none" ? "block" : "none";
      });
  },

  applyDates() {
    const root = document.getElementById("landing-wrap");
    if (!root) return;
    let html = root.innerHTML;
    html = html.split("[[TOMORROW]]").join(Utils.formatTomorrow());
    root.innerHTML = html;
  },

  showIntroIfNeeded() {
    if (localStorage.getItem(INTRO_SEEN_KEY)) return;
    Landing.showIntro(false);
  },

  showIntro(replay) {
    const overlay = document.getElementById("landing-intro-overlay");
    const content = document.getElementById("landing-intro-content");
    if (!overlay || !content) return;

    const progressHtml = replay
      ? ""
      : `<div class="landing-intro-progress">
            <div class="landing-intro-progress-bar" id="landing-intro-progress"></div>
          </div>`;

    content.innerHTML = `
      <div class="landing-intro-window">
        <div class="landing-intro-titlebar">
          <span class="landing-intro-title">明日回拨 · 访问日志</span>
          <span class="landing-intro-blink">● REC</span>
        </div>
        <div class="landing-intro-body">
          <div class="landing-intro-story" id="landing-intro-story"></div>
          <hr class="landing-intro-divider">
          <h3 class="landing-intro-notice-title">探索者须知</h3>
          <ol class="landing-intro-notices">
            ${LANDING_INTRO_NOTICES.map((n) => `<li>${Utils.escapeHtml(n)}</li>`).join("")}
          </ol>
          <hr class="landing-intro-divider">
          <h3 class="landing-intro-notice-title">作者的话</h3>
          <p class="landing-intro-author">${Utils.escapeHtml(LANDING_INTRO_AUTHOR)}</p>
          ${progressHtml}
        </div>
        <div class="landing-intro-footer">
          ${replay
            ? '<button type="button" class="y2k-btn primary landing-intro-btn is-ready" id="landing-intro-ok">关闭</button>'
            : '<button type="button" class="y2k-btn primary landing-intro-btn" id="landing-intro-ok" disabled>请阅读须知（30s）</button>'}
        </div>
        <div class="landing-intro-scanline" aria-hidden="true"></div>
      </div>
    `;

    overlay.classList.remove("hidden");
    document.body.classList.add("landing-intro-open");

    const storyEl = document.getElementById("landing-intro-story");
    const btn = document.getElementById("landing-intro-ok");
    const progress = document.getElementById("landing-intro-progress");
    let timer = null;

    const appendStoryParagraph = (text) => {
      if (!text) {
        storyEl.insertAdjacentHTML("beforeend", "<br>");
        return;
      }
      const p = document.createElement("p");
      p.className = "landing-intro-p";
      if (text.includes("明日 00:17") || text.includes("访问量变成 114")) {
        p.classList.add("landing-intro-highlight");
      }
      p.textContent = text;
      storyEl.appendChild(p);
    };

    if (replay) {
      LANDING_INTRO_STORY.forEach(appendStoryParagraph);
    } else {
      let pIdx = 0;
      const typeStory = () => {
        if (pIdx >= LANDING_INTRO_STORY.length) return;
        const text = LANDING_INTRO_STORY[pIdx];
        if (!text) {
          storyEl.insertAdjacentHTML("beforeend", "<br>");
          pIdx++;
          setTimeout(typeStory, 80);
          return;
        }
        const p = document.createElement("p");
        p.className = "landing-intro-p";
        if (text.includes("明日 00:17") || text.includes("访问量变成 114")) {
          p.classList.add("landing-intro-highlight");
        }
        storyEl.appendChild(p);
        let ci = 0;
        const tick = () => {
          if (ci < text.length) {
            p.textContent += text[ci++];
            setTimeout(tick, text.length > 40 ? 18 : 28);
          } else {
            pIdx++;
            setTimeout(typeStory, 120);
          }
        };
        tick();
      };
      setTimeout(typeStory, 400);

      const LOCK_SEC = 30;
      let left = LOCK_SEC;
      timer = setInterval(() => {
        left--;
        const pct = ((LOCK_SEC - left) / LOCK_SEC) * 100;
        if (progress) progress.style.width = `${pct}%`;
        if (btn) btn.textContent = `请阅读须知（${left}s）`;
        if (left <= 0) {
          clearInterval(timer);
          if (btn) {
            btn.disabled = false;
            btn.textContent = "我已了解，继续";
            btn.classList.add("is-ready");
          }
          if (progress) progress.classList.add("is-done");
        }
      }, 1000);
    }

    btn?.addEventListener("click", () => {
      if (btn.disabled) return;
      if (!replay) localStorage.setItem(INTRO_SEEN_KEY, "1");
      overlay.classList.add("hidden");
      document.body.classList.remove("landing-intro-open");
      if (timer) clearInterval(timer);
    });
  },

  renderIndex(state) {
    const grid = document.getElementById("page-index-grid");
    if (!grid) return;
    const visited = (state.visitedPages || []).filter(
      (id) => Game.PAGE_REGISTRY[id]
    );
    grid.innerHTML = visited
      .map((id) => {
        const m = Game.PAGE_REGISTRY[id];
        return `<a class="page-index-item" href="${GameRoutes.fromRoot(id)}"><span class="idx-num">${
          m.num
        }</span>${Utils.escapeHtml(m.title)}</a>`;
      })
      .join("");
    if (visited.length) {
      document
        .getElementById("btn-toggle-index")
        ?.style.setProperty("display", "inline-block");
    }
    if (state.savedAt) {
      const el = document.getElementById("save-info");
      if (el)
        el.textContent =
          "上次存档：" + new Date(state.savedAt).toLocaleString("zh-CN");
    }
    if (!Storage.hasSave()) {
      document
        .getElementById("btn-continue")
        ?.style.setProperty("display", "none");
    }
  },
};

/* 脚本加载后立即锁定便民热线，避免移动端在 Game.boot 前误触跳转 */
(function applyEarlyNavLock() {
  if (typeof Storage === "undefined" || typeof Game === "undefined") return;
  Game.initNavLockGuard();
  Game.state = Storage.load();
  Game.markHotlineNavLinks();
  Game.applyNavLock();
})();
