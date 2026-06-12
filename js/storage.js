const SAVE_KEY = "mingrihuibo_v1";

const defaultState = () => ({
  playerName: "",
  currentPage: "landing",
  visitedPages: ["landing"],
  flags: {
    submittedMessage: false,
    readNightDuty: false,
    readNoCaller: false,
    readAccident: false,
    readVoiceFill: false,
    pdfUnlocked: false,
    loginSuccess: false,
    threeProofs: false,
    chenCallSeen: false,
    chenRecordingPlayed: false,
    monitorSeen: false,
    audioJumpscare: false,
    photoJumpscare: false,
    shenqiaoStare: false,
    shenqiaoSamplePlayCount: 0,
    revokeEntered: false,
    conflictResolved: false,
    room7Revealed: false,
    monitorCreepScare: false,
  },
  tokens: { ren: false, zhong: false, xian: false },
  readItems: [],
  ending: null,
  hiddenEligible: false,
  chenCallWaitStart: null,
  gameStarted: false,
  savedAt: null,
});

const Storage = {
  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const merged = {
        ...defaultState(),
        ...parsed,
        flags: { ...defaultState().flags, ...parsed.flags },
        tokens: { ...defaultState().tokens, ...parsed.tokens },
      };
      if (merged.flags.chenCallSeen && !merged.flags.chenRecordingPlayed) {
        merged.flags.chenRecordingPlayed = true;
      }
      return merged;
    } catch {
      return defaultState();
    }
  },

  save(state) {
    const toSave = { ...state, savedAt: new Date().toISOString() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
  },

  clear() {
    localStorage.removeItem(SAVE_KEY);
  },

  hasSave() {
    const s = Storage.load();
    return s.gameStarted && s.visitedPages.length > 1;
  },
};
