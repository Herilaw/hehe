const Utils = {
  formatTomorrow() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}年${m}月${day}日 00:17`;
  },

  formatTomorrowShort() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day} 00:17`;
  },

  formatTomorrowDate() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}年${m}月${day}日`;
  },

  formatTomorrowTime() {
    return "00:17";
  },

  formatTomorrowLogin() {
    return `${Utils.formatTomorrowDate()} 00:17 登录`;
  },

  formatTodayCode() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}${m}${day}`;
  },

  formatNow() {
    const d = new Date();
    return d.toLocaleString("zh-CN", { hour12: false });
  },

  messageId() {
    return `HM-${Utils.formatTodayCode()}-0017`;
  },

  playerName(state) {
    return state.playerName || "当前访客";
  },

  displayName(state) {
    const n = state.playerName;
    if (!n || n === "无名" || n === "。" || n === ".") return "当前访客";
    return n;
  },

  escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  },

  filterChineseOnly(str) {
    return String(str).replace(/[^\u4e00-\u9fff]/g, "");
  },

  bindChineseOnlyInput(input) {
    if (!input || input.dataset.zhOnlyBound) return;
    input.dataset.zhOnlyBound = "1";
    let composing = false;
    const apply = () => {
      const next = Utils.filterChineseOnly(input.value);
      if (next !== input.value) input.value = next;
    };
    input.addEventListener("compositionstart", () => {
      composing = true;
    });
    input.addEventListener("compositionend", () => {
      composing = false;
      apply();
    });
    input.addEventListener("input", () => {
      if (!composing) apply();
    });
    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData)?.getData("text") || "";
      const selStart = input.selectionStart ?? input.value.length;
      const selEnd = input.selectionEnd ?? input.value.length;
      const merged =
        input.value.slice(0, selStart) +
        Utils.filterChineseOnly(text) +
        input.value.slice(selEnd);
      input.value = Utils.filterChineseOnly(merged);
    });
  },

  playTone(freq, duration, volume = 0.15) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.value = volume;
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (_) {
      /* 占位：无音频环境时静默 */
    }
  },

  playPhoneRing() {
    for (let i = 0; i < 6; i++) {
      setTimeout(() => Utils.playTone(880, 0.12, 0.2), i * 200);
      setTimeout(() => Utils.playTone(660, 0.12, 0.2), i * 200 + 100);
    }
  },

  playPhoneRingBurst(count = 4) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => Utils.playTone(880, 0.09, 0.38), i * 130);
      setTimeout(() => Utils.playTone(660, 0.09, 0.38), i * 130 + 65);
    }
  },

  playScareSting() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const t = ctx.currentTime;
      const thud = ctx.createOscillator();
      const thudG = ctx.createGain();
      thud.type = "sine";
      thud.frequency.setValueAtTime(95, t);
      thud.frequency.exponentialRampToValueAtTime(28, t + 0.22);
      thudG.gain.setValueAtTime(0.55, t);
      thudG.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      thud.connect(thudG).connect(ctx.destination);
      thud.start(t);
      thud.stop(t + 0.3);

      const len = Math.floor(ctx.sampleRate * 0.18);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const ch = buf.getChannelData(0);
      for (let i = 0; i < len; i++)
        ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const nG = ctx.createGain();
      nG.gain.setValueAtTime(0.42, t + 0.04);
      nG.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      noise.connect(nG).connect(ctx.destination);
      noise.start(t + 0.04);
      noise.stop(t + 0.24);
    } catch (_) {
      /* 无音频环境 */
    }
  },

  playScanWhine() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(1800, t);
      osc.frequency.linearRampToValueAtTime(900, t + 1.8);
      g.gain.setValueAtTime(0.04, t);
      g.gain.linearRampToValueAtTime(0.07, t + 0.3);
      g.gain.linearRampToValueAtTime(0.001, t + 1.9);
      osc.connect(g).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 2);
    } catch (_) {
      /* 无音频环境 */
    }
  },

  playStampThud() {
    Utils.playTone(70, 0.09, 0.45);
    setTimeout(() => Utils.playTone(45, 0.06, 0.3), 40);
  },

  playSystemBeep() {
    Utils.playTone(880, 0.05, 0.12);
    setTimeout(() => Utils.playTone(1100, 0.04, 0.1), 60);
  },

  placeholderImg(name, hint, w = 560, h = 200) {
    const safeName = Utils.escapeHtml(name);
    const safeHint = Utils.escapeHtml(hint);
    return `<div class="img-placeholder" style="width:${w}px;max-width:100%;height:${h}px" title="${safeHint}">
      <span class="ph-icon">[图片占位]</span>
      <span class="ph-name">${safeName}</span>
      <span class="ph-hint">${safeHint}</span>
    </div>`;
  },

  placeholderAudio(name, hint) {
    const safeName = Utils.escapeHtml(name);
    const safeHint = Utils.escapeHtml(hint);
    return `<div class="audio-placeholder" data-audio="${safeName}">
      <span class="ph-icon">[音频占位]</span>
      <span class="ph-name">${safeName}</span>
      <span class="ph-hint">${safeHint}</span>
      <div class="fake-waveform"></div>
    </div>`;
  },
};
