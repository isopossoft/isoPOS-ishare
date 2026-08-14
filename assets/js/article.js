/* =========================================================
   isoPOS iShare — 文章頁行為
   1. 文章目錄（自動產生 + 捲動高亮）
   2. 分享按鈕：複製連結
   3. YouTube 輕量播放器（點擊才載入 iframe）
   4. 正文中的 isoPOS 套用品牌字體（只掃 .article-body）
   ========================================================= */
(function () {
  'use strict';

  var content = document.getElementById('article-content');

  /* ---------- 1. 文章目錄 ---------- */
  (function toc() {
    var nav  = document.getElementById('article-toc');
    var list = document.getElementById('article-toc-list');
    if (!nav || !list || !content) return;

    var targets = [];
    content.querySelectorAll('h2, h3, h4, .ishare-step').forEach(function (el) {
      if (el.matches('.ishare-step')) {
        var numEl   = el.querySelector('.step-number');
        var titleEl = el.querySelector('.ishare-step-content > strong');
        var num     = numEl ? numEl.textContent.trim() : '';
        var title   = titleEl ? titleEl.textContent.replace(/^步驟\s*\d+：/, '').trim() : '';
        if (title) targets.push({ el: el, text: (num ? '步驟 ' + num + ' ' : '') + title, level: 3 });
        return;
      }
      // FAQ 區塊的 h2 已經是「常見問題」，仍然收進目錄
      var text = el.textContent.trim();
      if (text) targets.push({ el: el, text: text, level: Number(el.tagName.substring(1)) });
    });

    if (!targets.length) return;

    var used = new Map();
    function slugify(text) {
      var slug = text.normalize('NFKC').toLowerCase().trim()
        .replace(/[\s/]+/g, '-')
        .replace(/[^a-z0-9㐀-鿿-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      if (!slug) slug = 'section';
      var count = used.get(slug) || 0;
      used.set(slug, count + 1);
      return count ? slug + '-' + (count + 1) : slug;
    }

    var links = [];
    targets.forEach(function (t) {
      if (!t.el.id) t.el.id = slugify(t.text);
      t.el.classList.add('anchor-target');

      var li = document.createElement('li');
      li.className = 'toc-level-' + Math.min(Math.max(t.level, 2), 4);
      var a = document.createElement('a');
      a.href = '#' + t.el.id;
      a.textContent = t.text;
      li.appendChild(a);
      list.appendChild(li);
      links.push({ a: a, el: t.el });
    });

    nav.hidden = false;

    var toggle = nav.querySelector('.article-toc-toggle');
    var icon   = nav.querySelector('.article-toc-toggle-icon');
    function setExpanded(expanded) {
      toggle.setAttribute('aria-expanded', String(expanded));
      list.hidden = !expanded;
      if (icon) icon.textContent = expanded ? '⌃' : '⌄';
    }
    if (window.matchMedia('(max-width: 640px)').matches) setExpanded(false);
    toggle.addEventListener('click', function () {
      setExpanded(toggle.getAttribute('aria-expanded') !== 'true');
    });
    list.addEventListener('click', function (e) {
      if (e.target.closest('a') && window.matchMedia('(max-width: 640px)').matches) setExpanded(false);
    });

    // 捲動時高亮目前段落
    if ('IntersectionObserver' in window) {
      var active = null;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var hit = links.find(function (l) { return l.el === entry.target; });
          if (!hit || hit.a === active) return;
          if (active) active.classList.remove('is-current');
          hit.a.classList.add('is-current');
          active = hit.a;
        });
      }, { rootMargin: '-96px 0px -70% 0px', threshold: 0 });
      links.forEach(function (l) { io.observe(l.el); });
    }
  })();

  /* ---------- 2a. Facebook：改用彈出視窗；手機優先用系統分享 ---------- */
  (function shareFacebook() {
    var wrap = document.querySelector('.article-share');
    var fb = document.querySelector('.share-fb');
    if (!wrap || !fb) return;

    var url   = wrap.dataset.shareUrl || location.href;
    var title = wrap.dataset.shareTitle || document.title;

    fb.addEventListener('click', function (e) {
      // 手機：FB App 常會攔截 sharer.php 卻不帶入內容，
      // 改走系統原生分享選單，使用者仍可選 Facebook，成功率高很多。
      if (navigator.share && window.matchMedia('(max-width: 900px)').matches) {
        e.preventDefault();
        navigator.share({ title: title, url: url }).catch(function () { /* 使用者取消，忽略 */ });
        return;
      }
      // 桌機：開固定尺寸的彈出視窗，比開新分頁順暢
      var w = 620, h = 560;
      var left = (screen.width  - w) / 2;
      var top  = (screen.height - h) / 2;
      var popup = window.open(fb.href, 'fbshare',
        'width=' + w + ',height=' + h + ',left=' + left + ',top=' + top +
        ',toolbar=0,menubar=0,location=0,status=0,scrollbars=1,resizable=1');
      if (popup) { e.preventDefault(); popup.focus(); }
      // 彈出視窗被瀏覽器擋掉時，就讓原本的連結照常開新分頁
    });
  })();

  /* ---------- 2b. 系統原生分享 ---------- */
  (function shareNative() {
    var wrap = document.querySelector('.article-share');
    var btn  = document.querySelector('.share-native');
    if (!wrap || !btn) return;
    if (!navigator.share) return;   // 不支援就維持隱藏

    btn.hidden = false;
    btn.addEventListener('click', function () {
      navigator.share({
        title: wrap.dataset.shareTitle || document.title,
        url:   wrap.dataset.shareUrl   || location.href
      }).catch(function () { /* 使用者取消，忽略 */ });
    });
  })();

  /* ---------- 2c. 複製連結 ---------- */
  (function shareCopy() {
    var btn = document.querySelector('.share-copy');
    if (!btn) return;

    var idle = btn.querySelector('.share-copy-idle');
    var done = btn.querySelector('.share-copy-done');

    btn.addEventListener('click', function () {
      var url = btn.dataset.copyUrl || location.href;

      var show = function () {
        idle.hidden = true;
        done.hidden = false;
        btn.classList.add('is-done');
        window.setTimeout(function () {
          idle.hidden = false;
          done.hidden = true;
          btn.classList.remove('is-done');
        }, 2000);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(show).catch(fallback);
      } else {
        fallback();
      }

      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = url;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); show(); } catch (err) { window.prompt('複製這個連結：', url); }
        document.body.removeChild(ta);
      }
    });
  })();

  /* ---------- 3. YouTube 輕量播放器 ---------- */
  (function liteYouTube() {
    document.querySelectorAll('.youtube-facade').forEach(function (facade) {
      var btn = facade.querySelector('.youtube-facade-play');
      if (!btn) return;

      // 滑鼠移過去先預連線，點下去時感覺更快
      var warmed = false;
      facade.addEventListener('pointerover', function () {
        if (warmed) return;
        warmed = true;
        ['https://www.youtube-nocookie.com', 'https://www.google.com'].forEach(function (href) {
          var link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = href;
          document.head.appendChild(link);
        });
      }, { once: true });

      btn.addEventListener('click', function () {
        var id = facade.dataset.videoId;
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
        iframe.title = facade.dataset.videoTitle || '影片';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.setAttribute('frameborder', '0');
        facade.innerHTML = '';
        facade.appendChild(iframe);
        facade.classList.add('is-playing');
      });
    });
  })();

  /* ---------- 4. 正文中的 isoPOS 品牌字體 ---------- */
  (function brandText() {
    if (!content) return;

    var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.closest('script, style, code, pre, a, .isopos-text')) return NodeFilter.FILTER_REJECT;
        return node.nodeValue.indexOf('isoPOS') !== -1 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });

    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    if (!nodes.length) return;

    nodes.forEach(function (node) {
      var parts = node.nodeValue.split(/(isoPOS)/g);
      if (parts.length < 2) return;
      var frag = document.createDocumentFragment();
      parts.forEach(function (part) {
        if (part === 'isoPOS') {
          var span = document.createElement('span');
          span.className = 'isopos-text';
          span.textContent = part;
          frag.appendChild(span);
        } else if (part) {
          frag.appendChild(document.createTextNode(part));
        }
      });
      node.replaceWith(frag);
    });
  })();

})();
