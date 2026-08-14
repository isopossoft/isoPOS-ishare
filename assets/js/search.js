/* =========================================================
   isoPOS iShare — 站內搜尋
   純前端：載入 /search.json，在瀏覽器端比對，不需要任何後端服務。
   支援：多關鍵字（空白分隔）、分類篩選、關鍵字標示、網址同步。
   ========================================================= */
(function () {
  'use strict';

  var input   = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  if (!input || !results) return;

  var form     = document.getElementById('search-form');
  var status   = document.getElementById('search-status');
  var empty    = document.getElementById('search-empty');
  var clearBtn = document.getElementById('search-clear');
  var filters  = document.getElementById('search-filters');

  var data = [];
  var ready = false;
  var activeCategory = '';

  /* ---------- 載入索引 ---------- */
  fetch(window.ISHARE_SEARCH_INDEX || '/search.json')
    .then(function (r) {
      if (!r.ok) throw new Error('index ' + r.status);
      return r.json();
    })
    .then(function (json) {
      data = json;
      ready = true;
      var q = new URLSearchParams(location.search).get('q') || '';
      if (q) { input.value = q; }
      run();
      input.focus();
    })
    .catch(function () {
      if (status) status.textContent = '搜尋索引載入失敗，請重新整理頁面再試一次。';
    });

  /* ---------- 工具 ---------- */
  function normalize(s) {
    return (s || '').toLowerCase().normalize('NFKC');
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function highlight(text, terms) {
    var out = escapeHtml(text);
    terms.forEach(function (t) {
      if (!t) return;
      var re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      out = out.replace(re, '<mark>$1</mark>');
    });
    return out;
  }

  function clamp(text, max) {
    text = (text || '').trim();
    return text.length > max ? text.slice(0, max) + '…' : text;
  }

  // 取出包含關鍵字的一小段內文當摘要
  function snippet(body, terms) {
    var lower = normalize(body);
    var pos = -1;
    for (var i = 0; i < terms.length; i++) {
      pos = lower.indexOf(terms[i]);
      if (pos !== -1) break;
    }
    if (pos === -1) return clamp(body, 150);
    var start = Math.max(0, pos - 40);
    var end   = Math.min(body.length, pos + 90);
    return (start > 0 ? '…' : '') + body.slice(start, end) + (end < body.length ? '…' : '');
  }

  /* ---------- 評分 ---------- */
  function score(item, terms) {
    var title   = normalize(item.title);
    var summary = normalize(item.summary);
    var tags    = normalize((item.tags || []).join(' '));
    var cat     = normalize(item.category);
    var body    = normalize(item.body);

    var total = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      var hit = 0;
      if (title.indexOf(t) !== -1)   hit += 12;
      if (tags.indexOf(t) !== -1)    hit += 7;
      if (summary.indexOf(t) !== -1) hit += 5;
      if (cat.indexOf(t) !== -1)     hit += 3;
      if (body.indexOf(t) !== -1)    hit += 2;
      if (hit === 0) return 0;       // 每個關鍵字都必須命中
      total += hit;
    }
    return total;
  }

  /* ---------- 主流程 ---------- */
  function run() {
    if (!ready) return;

    var raw = input.value.trim();
    var terms = normalize(raw).split(/\s+/).filter(Boolean);

    if (clearBtn) clearBtn.hidden = raw === '';

    var pool = activeCategory
      ? data.filter(function (d) { return d.category === activeCategory; })
      : data.slice();

    var matched;
    if (!terms.length) {
      matched = pool.map(function (d) { return { item: d, s: 0 }; });
    } else {
      matched = pool
        .map(function (d) { return { item: d, s: score(d, terms) }; })
        .filter(function (r) { return r.s > 0; })
        .sort(function (a, b) { return b.s - a.s || (a.item.iso < b.item.iso ? 1 : -1); });
    }

    render(matched, terms, raw);
    syncUrl(raw);
  }

  function render(matched, terms, raw) {
    if (!matched.length) {
      results.innerHTML = '';
      if (empty) empty.hidden = false;
      if (status) status.textContent = raw ? '「' + raw + '」找不到符合的文章。' : '目前沒有文章。';
      return;
    }
    if (empty) empty.hidden = true;

    if (status) {
      status.textContent = raw
        ? '「' + raw + '」找到 ' + matched.length + ' 篇文章'
        : '共 ' + matched.length + ' 篇文章';
    }

    results.innerHTML = matched.map(function (r) {
      var d = r.item;
      // summary 已在 search.json 端算好（含區塊文章的 fallback）。
      // 萬一仍是空的，才從內文索引截一小段，絕不整段輸出。
      var text = d.summary || clamp(d.body, 150);
      var body = terms.length ? snippet(d.body || text, terms) : text;

      return '' +
        '<article class="post-list-item">' +
          '<div>' +
            '<div class="search-result-meta">' +
              (d.categoryUrl
                ? '<a class="search-result-cat" href="' + d.categoryUrl + '">' + escapeHtml(d.category) + '</a>'
                : '<span class="search-result-cat">' + escapeHtml(d.category) + '</span>') +
              '<time datetime="' + escapeHtml(d.iso) + '">' + escapeHtml(d.date) + '</time>' +
            '</div>' +
            '<h2><a href="' + d.url + '">' + highlight(d.title, terms) + '</a></h2>' +
            '<p>' + highlight(body, terms) + '</p>' +
            (d.tags && d.tags.length
              ? '<div class="tag-result-tags">' + d.tags.map(function (t) {
                  return '<span>#' + escapeHtml(t) + '</span>';
                }).join('') + '</div>'
              : '') +
          '</div>' +
          '<a class="arrow" href="' + d.url + '" aria-label="閱讀「' + escapeHtml(d.title) + '」">→</a>' +
        '</article>';
    }).join('');
  }

  function syncUrl(raw) {
    var url = new URL(location.href);
    if (raw) url.searchParams.set('q', raw);
    else url.searchParams.delete('q');
    history.replaceState(null, '', url.toString());
    document.title = raw
      ? '「' + raw + '」的搜尋結果｜isoPOS iShare'
      : '搜尋文章｜isoPOS iShare';
  }

  /* ---------- 事件 ---------- */
  var timer;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(run, 120);
  });

  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); run(); });

  if (clearBtn) clearBtn.addEventListener('click', function () {
    input.value = '';
    input.focus();
    run();
  });

  if (filters) filters.addEventListener('click', function (e) {
    var btn = e.target.closest('.search-filter');
    if (!btn) return;
    activeCategory = btn.dataset.filter || '';
    filters.querySelectorAll('.search-filter').forEach(function (b) {
      b.classList.toggle('is-active', b === btn);
    });
    run();
  });

  // 鍵盤：任何頁面按 / 都能跳到搜尋框
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== input &&
        !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
      e.preventDefault();
      input.focus();
    }
  });
})();
