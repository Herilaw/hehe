/**
 * 《明日回拨》音频素材路径
 */
const GameAudio = {
  base: "../assets/audio/",
  files: {
    shenqiao: "shenqiao.m4a",
    chenxiaoman: "chenxiaoman.m4a",
  },

  src(key) {
    const file = this.files[key];
    if (!file) return "";
    return this.base + file;
  },
};
