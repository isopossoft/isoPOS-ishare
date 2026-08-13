isoPOS iShare Block Builder v2

這版修正：
1. Rich Text 中 /assets/images/... 自動轉成 GitHub Pages 正確 baseurl，不用每篇改網址。
2. YouTube 播放器固定文章寬度 16:9。
3. 重點提示／注意事項／補充資訊同時相容 content 與舊的 text 欄位，內容不再消失。
4. .pages.yml 完全移除舊 body，改成區塊式 Builder。

上傳／覆蓋：
- .pages.yml
- _layouts/post.html
- 新增 _includes/render-rich.html

最後把：
- assets/css/block-builder-fix.css
內容貼到現有 assets/css/style.css 最底部。

因 GitHub Connector 目前對寫入 repository 回傳 403，這次無法直接替你 Commit。
