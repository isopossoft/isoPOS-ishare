# isoPOS iShare v5

依前次網站健檢的 25 項建議全面改版。這份 README 就是操作手冊，照著做即可。

---

## 一、怎麼安裝（5 分鐘）

### 步驟 1｜上傳檔案

把這個資料夾裡的**所有內容**上傳到 GitHub repository 根目錄，覆蓋同名檔案。

> `assets/images/` 裡只有一張新增的 `og-default.png`。
> 你原本的文章圖片（notion01.png…等）都不會被動到。

### 步驟 2｜刪掉這些檔案

在 GitHub 上手動刪除（改版後不再需要，留著會拖慢網站或造成混淆）：

| 檔案 | 原因 |
|---|---|
| `_posts/2026-08-13-welcome-to-isopos-ishare.md` | 測試文章 |
| `_posts/2026-08-13-line-oa-test.md` | 測試文章 |
| `assets/images/公告_標準範例01.png` | 測試文章的圖，中文檔名 |
| `assets/images/公告_標準範例01-1.png` | 同上 |
| `isopos-ishare-mobile-menu-hotfix.zip` | 舊修補包，目前任何人都能下載 |
| `README.txt` | 舊修補說明，已被這份 README 取代 |

### 步驟 3｜開啟 GitHub Actions 建置（建議，但可跳過）

`Settings` → `Pages` → `Build and deployment` → `Source` 改成 **GitHub Actions**。

開啟後多了什麼：

- **每個標籤有自己的網址**（`/tags/notion/`），可以被 Google 單獨索引
- 建置失敗會在 Actions 頁面顯示明確錯誤，不再只是「網站沒更新」

不開也沒關係 —— 網站會照舊運作，標籤自動退回原本的 `?tag=` 篩選模式，不會壞掉。

### 步驟 4｜填三個設定（`_config.yml`）

```yaml
analytics:
  ga4_id: ""          # 填 GA4 評估 ID，例如 G-XXXXXXXXXX

verification:
  google: ""          # 填 Search Console 的 HTML 標記驗證碼
```

留空就完全不會輸出任何追蹤程式碼，不影響網站。

---

## 二、切換自訂網域

現在網址是 `isopossoft.github.io/isoPOS-ishare/`，SEO 權重累積在 GitHub 而不是你的品牌上。
建議越早換越好，文章越多之後搬遷成本越高。

**1. 在網域商加一筆 DNS 紀錄**

```
類型：CNAME
名稱：ishare
指向：isopossoft.github.io
```

**2. 在 repo 根目錄新增一個檔案 `CNAME`**（沒有副檔名），內容一行：

```
ishare.zoom-world.tw
```

**3. 改 `_config.yml`**，把現有兩行註解掉，改用下面兩行：

```yaml
# url:     "https://isopossoft.github.io"
# baseurl: "/isoPOS-ishare"
url:     "https://ishare.zoom-world.tw"
baseurl: ""
```

**4. GitHub → Settings → Pages** 確認 Custom domain 已填入，並勾選 `Enforce HTTPS`。

**5. 到 Search Console** 重新提交 sitemap：`https://ishare.zoom-world.tw/sitemap.xml`

> 舊網址 GitHub 會自動轉址到新網域，不會有斷鏈問題。

---

## 三、這次改了什麼

### 內容與資訊架構

| # | 項目 | 說明 |
|---|---|---|
| 1 | 測試文章全站隱藏 | 勾選「不允許搜尋引擎索引」的文章，現在首頁、分類頁、標籤頁、搜尋、RSS、sitemap 全部自動略過 |
| 2 | 麵包屑分類可點擊 | 原本是純文字 `<span>`，讀者看完文章沒有路徑回到同類文章 |
| 3 | 分類改為設定驅動 | 分類名稱、網址、說明、排序全部集中在 `_config.yml` 的 `category_list`，四個分類頁從 25 行縮成 6 行 |
| 4 | 分類頁顯示文章數 | 首頁分類卡片與分類頁都會顯示「N 篇文章」 |
| 5 | 空分類有引導 | 不再只是一句「目前還沒有文章」，會引導到搜尋或其他分類 |

### 搜尋與導覽

| # | 項目 | 說明 |
|---|---|---|
| 6 | 站內搜尋 | 全新 `/search/`。純前端，不需要後端服務。同時搜尋標題、摘要、標籤與**內文**，支援多關鍵字、分類篩選、關鍵字標示 |
| 7 | 搜尋入口 | 首頁 Hero、頁首、手機抽屜、404 頁都有；任何頁面按 `/` 直接跳到搜尋框 |
| 8 | 上一篇 / 下一篇 | 文章底部新增，自動跳過測試文章 |
| 9 | 相關文章 | 同分類優先，不足三篇自動補其他分類最新文章 |
| 10 | 404 頁面 | 原本會看到 GitHub 預設頁面，完全跳出品牌 |
| 11 | 頁尾導覽 | 新增分類、搜尋、標籤、RSS、官網連結 |

### SEO

| # | 項目 | 說明 |
|---|---|---|
| 12 | 標籤實體頁 | `/tags/notion/` 可被單獨索引（需步驟 3） |
| 13 | BreadcrumbList | 搜尋結果會顯示「首頁 › 數位工具教學 › 文章」路徑 |
| 14 | WebSite + Organization | 首頁新增，並含 SearchAction（有機會取得 Google sitelinks 搜尋框） |
| 15 | CollectionPage | 分類頁新增，含 ItemList |
| 16 | VideoObject | 有影片的文章新增，提高出現在影片搜尋結果的機會 |
| 17 | 預設分享圖 | 新增 `og-default.png`（1200×630）。原本沒設封面的文章分享到 LINE／FB 只會顯示一顆小圖示 |
| 18 | Twitter Card | 原本完全沒有 |
| 19 | RSS Feed | `/feed.xml`，原本是空的 |
| 20 | sitemap 改寫 | 加入 `changefreq`、`priority`、分類頁 `lastmod`、標籤頁、文章封面圖 |
| 21 | article:* meta | 發布時間、更新時間、分類、標籤 |

### 效能

| # | 項目 | 說明 |
|---|---|---|
| 22 | YouTube 輕量播放器 | 預設只載入縮圖，點擊才載入播放器。Notion 那篇有兩支影片，原本一開頁就多載入約 1MB |
| 23 | 圖片自動 lazy load | 正文所有圖片自動補上 `loading="lazy"` 與 `decoding="async"` |
| 24 | 字型非阻塞載入 | Orbitron 改成 preconnect + 非阻塞，原本用 CSS `@import` 會擋住渲染 |
| 25 | CSS 版本號自動化 | 原本手寫 `?v=20260814-2`，忘記改就會讓客戶看到舊樣式。現在自動帶入建置時間 |

### 程式碼品質

| # | 項目 | 說明 |
|---|---|---|
| 26 | CSS 全面整理 | 原本是「原始樣式 + 三輪 hotfix」層層用 `!important` 互相覆蓋，同一個元件的顏色散在四個地方。現在最終值直接寫進本體，**全檔 0 個 `!important`**，並加上目錄與設計變數 |
| 27 | JS 抽成獨立檔案 | 原本三段 inline script 每頁重複下載，現在是可快取的 `site.js` / `article.js` / `search.js` |
| 28 | 版型元件化 | 新增 `head` / `header` / `footer` / `post-card` 等 include，改一次全站生效 |
| 29 | 移除 runtime 補 alt | 原本用 JS 補圖片 alt，但 Google 讀的是原始 HTML，補了對 SEO 沒有效果。改成在 Pages CMS 端要求填寫（原本就已設為必填） |
| 30 | isoPOS 品牌字體改良 | 標題類改成建置時處理（不閃動、不會破壞 alt/href）；正文仍用 JS，但範圍縮小到正文區並跳過連結 |

### 無障礙

| # | 項目 | 說明 |
|---|---|---|
| 31 | 手機選單焦點鎖定 | 原本選單打開時，鍵盤 Tab 會跑到背景內容 |
| 32 | 跳至主要內容 | 按 Tab 第一下可直接跳過導覽 |
| 33 | 品牌副標統一 | 首頁寫「愛分享」、文章頁寫「知識中心」，現在統一由 `_config.yml` 的 `tagline` 控制 |
| 34 | 減少動態偏好 | 支援 `prefers-reduced-motion` |
| 35 | 表格可捲動 | 手機上寬表格加上鍵盤可聚焦的捲動區 |

---

## 四、功能開關

不想要某個功能，改 `_config.yml` 即可，不用動程式碼：

```yaml
features:
  toc:            true    # 文章目錄
  reading_time:   true    # 閱讀時間
  share_buttons:  true    # 分享按鈕
  related_posts:  true    # 相關文章
  prev_next:      true    # 上一篇 / 下一篇
  site_search:    true    # 站內搜尋
```

---

## 五、日常維護

**新增分類**：在 `_config.yml` 的 `category_list` 加一組，再複製一個 `categories/xxx.html`（只有 6 行），
同時把中文名稱加進 `.pages.yml` 的分類選項。

**改品牌色**：`assets/css/style.css` 最上方的 `:root` 區塊。

**改文末 CTA**：預設文字在 `_layouts/post.html`；單篇文章可在 Pages CMS 的「文末 isoPOS CTA 銜接文字」覆蓋。

**本機預覽**：

```bash
bundle install
bundle exec jekyll serve
```

---

## 六、還沒做、建議接著處理

1. **圖片轉 WebP**：目前文章截圖都是 PNG，單張約 1.3MB。轉 WebP 通常可省 60–80%。
2. **圖片檔名改英數**：中文檔名會被編碼成 `%E5%85%AC...`，網址不好看，部分平台貼上會出錯。
3. **補內容**：建議優先寫客服信箱裡重複率最高的問題 —— 既是真需求，寫完之後回信直接貼連結。
4. **裝 GA4 之後看數據**：哪篇文章有用、客戶都搜什麼字進來，是決定下一篇寫什麼的依據。
