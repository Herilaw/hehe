const Puzzles = {
  validatePassword114(val) {
    return String(val).trim() === "722";
  },

  validateLogin(code, pwd) {
    return (
      String(code).trim() === "10170017" && String(pwd).trim() === "暗柜钥匙"
    );
  },

  validateVoiceKeyword(val) {
    const v = String(val).trim();
    if (v.toUpperCase() === "DONT SAY NAME") return true;
    if (v === "不要说出名字") return true;
    if (v.includes("不要") && v.includes("名字")) return true;
    return false;
  },

  clockProofAnswer() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return mm + hh;
  },

  validateClockProof(val) {
    return String(val).trim() === Puzzles.clockProofAnswer();
  },

  validateEmptyLine(val) {
    const v = String(val).trim();
    return v === "空线不是来电";
  },

  validateThreeProofs(ren, zhong, xian) {
    const r = String(ren).trim().toLowerCase();
    const z = String(zhong).trim().toLowerCase();
    const x = String(xian).trim().toLowerCase();
    const okR =
      r === "you" || r === "ren" || String(ren).trim() === "人声不是权限";
    const okZ =
      z === "are" || z === "zhong" || String(zhong).trim() === "旧钟不是明天";
    const okX =
      x === "next" || x === "xian" || String(xian).trim() === "空线不是来电";
    return okR && okZ && okX;
  },

  validateRevoke(val) {
    const v = String(val).trim();
    return v === "让明日失效" || v === "撤销明日";
  },

  validateBackdoor(items) {
    if (!Array.isArray(items) || items.length !== 3) return false;
    const expected = ["人声不是权限", "旧钟不是明天", "空线不是来电"];
    return items.every((item, i) => String(item).trim() === expected[i]);
  },

  validateHiddenEnding(val) {
    return String(val).trim() === "允许未接通";
  },

  isHiddenName(name) {
    const n = String(name).trim();
    return !n || n === "无名" || n === "。" || n === "." || n === "…";
  },

  boothSequence: ["E-041", "F-052", "G-086"],

  validateBoothMapPuzzle(booths, shape) {
    if (shape !== "triangle") return false;
    if (!Array.isArray(booths) || booths.length !== 3) return false;
    const picked = [...booths].sort().join(",");
    const expected = [...Puzzles.boothSequence].sort().join(",");
    return picked === expected;
  },

  isNull0017Search(kw) {
    const n = String(kw).trim().replace(/[\s_]/g, "").toLowerCase();
    return /^null-?0017$/.test(n);
  },

  /** 直接搜索人声回填指南工单编号（跳过关卡） */
  isVoiceGuideSkipSearch(kw) {
    const n = String(kw).trim().replace(/\s+/g, "").toLowerCase();
    if (n === "3851417") return true;
    if (/^e-?041$|^f-?052$|^g-?086$/.test(n)) return true;
    if (/^017-?(041|052|086)$/.test(n)) return true;
    if (/^017(041|052|086)$/.test(n)) return true;
    return false;
  },
};
