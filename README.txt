isoPOS iShare Block Builder v3

本版調整：
1. 手機版改為左側滑出選單。
2. 文章頁有「快速解答」時，不再重複顯示文章摘要。
3. Pages CMS 的區塊新增方式維持原生 Block Builder；原生目前不是 Notion 那種每兩塊中間浮出「＋」。
4. YouTube 區塊新增「影片上方說明」Rich Text 欄位。
5. 補充資訊、重點提示、注意事項底色加深，與頁面背景明顯區隔。
6. 保留前版圖片路徑自動修正、YouTube 16:9 全寬、tip/note 舊 text 欄位 fallback。

請上傳／覆蓋：
- .pages.yml
- _layouts/default.html
- _layouts/post.html
- _includes/render-rich.html

CSS：
- 打開 assets/css/block-builder-v3.css
- 將內容貼到現有 assets/css/style.css 最底部

建議 Commit 後等待 GitHub Pages 同步，再用手機寬度測試左側選單。
