isoPOS iShare Block Builder 測試包

請上傳／覆蓋：
1. .pages.yml
2. _layouts/post.html

另外：
3. 打開 assets/css/style.css
4. 把 assets/css/article-builder-addon.css 的內容貼到 style.css 最底部

這版已移除舊 body 文章編輯方式，文章正文全面改用 article_sections。
H1 = 文章標題欄位（不在正文區塊重複提供）
文章內容區塊：
- 一般文字（可粗體、斜體、連結、清單）
- H2 / H3 / H4
- 重點文字／顏色
- 一般引用
- 項目清單 / 編號清單
- 重點提示
- 注意事項
- 步驟區塊
- 補充資訊
- 圖片（自動 relative_url）
- YouTube（可貼完整網址或 ID）
- 表格
- 程式碼
- 官方來源
- 延伸閱讀
- 分隔線

注意：GitHub 連線目前對這個 Repository 回傳 403，無法由 ChatGPT 直接 Commit，
所以此包供直接上傳。
