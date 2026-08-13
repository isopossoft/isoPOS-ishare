Hotfix 原因：
文章頁仍可能拿到舊版 default.html 快取，因此只載入 style.css，沒有載入 block-builder-v3.css。
首頁已更新、文章頁仍舊版時，就會出現「抽屜選單 HTML 直接攤在頁面上、Logo 巨大」的狀況。

處理方式：
1. 覆蓋 _layouts/default.html
2. 把 assets/css/APPEND_TO_style.css 整段貼到現有 assets/css/style.css 最底部
3. 不再需要另外載入 block-builder-v3.css
4. Commit 後 default.html 已用 style.css?v=20260813-4 強制換版，可減少舊快取問題
