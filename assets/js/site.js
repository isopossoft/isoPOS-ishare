/* =========================================================
   isoPOS iShare — 全站共用行為
   1. 手機版抽屜選單（含焦點鎖定，鍵盤不會跑到背景）
   2. /tags/ 的前端標籤篩選（沒有實體標籤頁時的 fallback）
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1. 手機版選單 ---------- */
  (function mobileDrawer() {
    var toggle   = document.querySelector('.mobile-menu-toggle');
    var closeBtn = document.querySelector('.mobile-menu-close');
    var drawer   = document.getElementById('mobile-drawer');
    var backdrop = document.querySelector('.mobile-nav-backdrop');
    if (!toggle || !drawer || !backdrop) return;

    var FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
    var lastFocused = null;

    function focusables() {
      return Array.prototype.slice.call(drawer.querySelectorAll(FOCUSABLE))
        .filter(function (el) { return el.offsetParent !== null; });
    }

    function openMenu() {
      lastFocused = document.activeElement;
      drawer.hidden = false;                 // 關閉時是 hidden，背景元素不會被 Tab 到
      document.body.classList.add('menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      backdrop.hidden = false;
      requestAnimationFrame(function () {
        backdrop.classList.add('is-visible');
        var f = focusables();
        if (f.length) f[0].focus();
      });
      document.addEventListener('keydown', onKeydown, true);
    }

    function closeMenu() {
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      backdrop.classList.remove('is-visible');
      document.removeEventListener('keydown', onKeydown, true);
      window.setTimeout(function () {
        backdrop.hidden = true;
        drawer.hidden = true;
      }, 240);
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    function onKeydown(e) {
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
      if (e.key !== 'Tab') return;

      var f = focusables();
      if (!f.length) return;
      var first = f[0];
      var last  = f[f.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }

    toggle.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    backdrop.addEventListener('click', closeMenu);
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    // 由手機切到桌機寬度時自動收起，避免狀態卡住
    var mq = window.matchMedia('(min-width: 901px)');
    var onChange = function (e) { if (e.matches && document.body.classList.contains('menu-open')) closeMenu(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  })();

  /* ---------- 2. /tags/ 前端篩選 ---------- */
  (function tagFilter() {
    var list = document.getElementById('tag-post-list');
    if (!list) return;

    var selected   = new URLSearchParams(location.search).get('tag');
    var posts      = Array.prototype.slice.call(document.querySelectorAll('.tag-post-item'));
    var pageTitle  = document.getElementById('tag-page-title');
    var pageDesc   = document.getElementById('tag-page-desc');
    var resultTtl  = document.getElementById('tag-results-title');
    var resultCnt  = document.getElementById('tag-results-count');
    var empty      = document.getElementById('tag-empty-state');

    var visible = 0;
    posts.forEach(function (post) {
      var match = !selected || post.dataset.tags.indexOf('||' + selected + '||') !== -1;
      post.hidden = !match;
      if (match) visible++;
    });

    document.querySelectorAll('.tag-cloud a').forEach(function (a) {
      if (selected && a.dataset.tagName === selected) a.classList.add('is-active');
    });

    if (selected) {
      if (pageTitle) pageTitle.textContent = '#' + selected;
      if (pageDesc)  pageDesc.textContent  = '查看與「' + selected + '」相關的文章。';
      if (resultTtl) resultTtl.textContent = '相關文章';
      document.title = '#' + selected + '｜文章標籤｜isoPOS iShare';
    }
    if (resultCnt) resultCnt.textContent = visible + ' 篇';
    if (empty) empty.hidden = visible !== 0;
  })();

})();
