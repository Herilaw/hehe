/**
 * 便民热线导航锁 — 在 <head> 中尽早执行，覆盖移动端 WebView（微信/夸克/Edge 等）
 * 不依赖 Game / Storage，避免 body 底部脚本加载前误触跳转
 */
(function () {
  var SAVE_KEY = "mingrihuibo_v1";

  function isSubmitted() {
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      var parsed = JSON.parse(raw);
      return !!(parsed.flags && parsed.flags.submittedMessage);
    } catch (e) {
      return false;
    }
  }

  function isHotlineAnchor(el) {
    if (!el || el.tagName !== "A") return false;
    var href = (el.getAttribute("href") || "").trim();
    return (
      (typeof GameRoutes !== "undefined" && GameRoutes.isHotlineHref(href)) ||
      href === "night-duty-hotline.html" ||
      /\/night-duty-hotline\.html$/i.test(href)
    );
  }

  function syncRootLock() {
    if (isSubmitted()) {
      delete document.documentElement.dataset.hotlineLocked;
    } else {
      document.documentElement.dataset.hotlineLocked = "1";
    }
  }

  function replaceHotlineAnchors(root) {
    if (isSubmitted()) return;
    var scope = root || document;
    scope
      .querySelectorAll(".y2k-nav a, a.side-hotline-link")
      .forEach(function (a) {
        if (!isHotlineAnchor(a) || a.dataset.navHotlineLocked === "1") return;
        var span = document.createElement("span");
        span.className = "nav-hotline-locked";
        if (a.classList.contains("nav-active")) {
          span.classList.add("nav-active");
        }
        span.textContent = a.textContent;
        span.setAttribute("aria-disabled", "true");
        span.dataset.navHotline = "1";
        span.dataset.navHotlineLocked = "1";
        a.replaceWith(span);
      });
  }

  function blockHotlineEvent(e) {
    if (isSubmitted()) return;
    var locked = e.target.closest && e.target.closest(".nav-hotline-locked");
    if (locked) {
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      return;
    }
    var a =
      e.target.closest &&
      e.target.closest(".y2k-nav a, a.side-hotline-link");
    if (!a || !isHotlineAnchor(a)) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
  }

  syncRootLock();

  ["touchstart", "touchend", "pointerdown", "mousedown", "click"].forEach(
    function (type) {
      document.addEventListener(type, blockHotlineEvent, {
        capture: true,
        passive: false,
      });
    }
  );

  function onReady() {
    replaceHotlineAnchors();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }
})();
