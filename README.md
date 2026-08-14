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
| `isopos-ishare-mobile-menu-hotfix.zip` | 舊修補包，目前任何人都能直接下載 |
| `README.txt` | 舊修補說明，已被這份 README 取代 |
| `assets/images/公告_標準範例01.png` | 測試文章的圖，中文檔名 |
| `assets/images/公告_標準範例01-1.png` | 同上 |

**測試文章**（在 Pages CMS 裡依標題找，比較不會刪錯）：

- 「isoPOS iShare 新版知識中心測試文章」
- 「LINE 官方帳號測試文章」

> 這兩篇已勾選「不允許搜尋引擎索引」，新版會自動把它們從首頁、分類頁、
> 標籤頁、搜尋、RSS、sitemap 全部隱藏，所以**不刪也不會出現在前台**。
> 想留著當排版範本完全可以。

### 步驟 3｜開啟 GitHub Actions 建置（選用，可以先跳過）

`.github/workflows/jekyll.yml` 預設是**手動觸發**，不會自己跑，所以現在上傳
不會多出任何失敗的紅叉。想啟用時：

1. `Settings` → `Pages` → `Build and deployment` → `Source` 改成 **GitHub Actions**
2. 打開 `.github/workflows/jekyll.yml`，把 `# push:` 那三行的 `#` 拿掉

開啟後多了什麼：

- **每個標籤有自己的網址**（`/tags/notion/`），可以被 Google 單獨索引
- 建置失敗會顯示明確訊息與行號，不再只是「網站沒更新」

不開也沒關係 —— 網站會用 GitHub Pages 內建建置（Jekyll 3.10），
標籤自動退回原本的 `?tag=` 篩選模式，其他功能全部正常。

### 步驟 3.5｜認識「建置檢查」

`.github/workflows/lint.yml` 會在每次 push 時，用和 GitHub Pages 相同的環境
試建一次網站，然後檢查：關鍵頁面有沒有產生、`search.json` 是不是合法 JSON、
sitemap 與 feed 是不是合法 XML、結構化資料是不是合法 JSON-LD。

**它不會部署任何東西**，失敗也不影響線上網站。存在的意義是：
語法出錯時你能立刻在 Actions 看到「檔名 + 行號」，
不用再從 `pages-build-deployment` 的長日誌裡慢慢找。

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
| 5b | 摘要自動產生 | 用「新版文章內容」區塊寫的文章，Jekyll 的 `excerpt` 是空的。新版會自動從內容區塊擷取摘要，分類頁／首頁／搜尋結果都不會再出現空白或整篇內文 |

### 搜尋與導覽

| # | 項目 | 說明 |
|---|---|---|
| 6 | 站內搜尋 | 全新 `/search/`。純前端，不需要後端服務。同時搜尋標題、摘要、標籤與**內文**，支援多關鍵字、分類篩選、關鍵字標示 |
| 7 | 搜尋入口 | 首頁 Hero、頁首、手機抽屜、404 頁都有；任何頁面按 `/` 直接跳到搜尋框 |
| 8 | 上一篇 / 下一篇 | 文章底部新增，自動跳過測試文章 |
| 9 | 相關文章 | 同分類優先，不足三篇自動補其他分類最新文章 |
| 10 | 404 頁面 | 原本會看到 GitHub 預設頁面，完全跳出品牌 |
| 11 | 頁尾導覽 | 新增分類、搜尋、標籤、官網連結，以及 Facebook / Instagram / Threads |
| 11b | 文末 CTA 全可調 | 小標、標題、內文、按鈕四個部分都能在 `_config.yml` 設預設值，或單篇覆蓋 |
| 11c | 移除 Canonical 欄位 | 一般文章用不到，填錯會讓整篇文章從 Google 搜尋結果消失。網站仍會自動產生正確的 canonical |

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

**改文末 CTA**：四個部分都能調整。

| 部分 | 預設值改哪裡 | 單篇覆蓋 |
|---|---|---|
| 上方小標（FROM KNOWLEDGE TO WORKFLOW） | `_config.yml` → `isopos.cta_kicker` | 文末 CTA 上方小標 |
| 標題（想把數位工具真正整合進日常營運？） | `isopos.cta_title` | 文末 CTA 標題 |
| 內文 | `isopos.cta_text` | 文末 CTA 銜接文字 |
| 按鈕（了解 isoPOS） | `isopos.cta_button` | 文末 CTA 按鈕文字 |

小標想整行隱藏，在 Pages CMS 該欄位填一個半形空格即可。

**改社群連結**：`_config.yml` → `social`。留空的圖示不會顯示。

**要不要顯示 RSS**：`_config.yml` → `features.rss_link`。
預設關閉，但 `feed.xml` 仍會產生 —— RSS 閱讀器可以自動偵測訂閱，
只是不放在頁尾避免一般訪客點進去看到一堆原始碼。

**本機預覽**：

```bash
bundle install
bundle exec jekyll serve
```

---

## 六、疑難排解

### 建置失敗（Actions 出現紅色叉叉）

先看是哪一個 workflow 失敗：

| Workflow | 意義 |
|---|---|
| **建置檢查** | 語法或內容有問題。點進去 → `試建網站` 那一步會有明確的檔名與行號 |
| **pages-build-deployment** | GitHub 內建的建置，線上網站真的沒更新 |

訊息最後一段會寫出**檔名與行號**，
例如：

```
Error: Liquid syntax error (/github/workspace/_includes/head.html line 34):
Variable '{{ ... }}' was not properly terminated
```

最常見的原因是 **Liquid 標籤裡出現了單獨的大括號**。Liquid 掃到 `{{` 之後
會找第一個 `}` 就停下來，所以像 `{{ '?q={關鍵字}' }}` 這種寫法一定會失敗。
解法是把大括號放到 `{% capture %}` 的純文字區，不要寫在 `{{ }}` 裡面。

### 改了東西但網站沒更新

- 先看 Actions 頁面是不是建置失敗了
- CSS 版本號現在會自動帶入建置時間，理論上不會再有快取問題；
  如果還是舊的，用無痕視窗開一次確認

### 文章摘要看起來怪怪的

摘要的取用順序是：**快速解答 → Meta Description → 文章內容自動擷取**。

自動擷取只是保底，會直接抓內文開頭，讀起來通常不夠精準。
建議在 Pages CMS 幫每篇文章填「**快速解答**」—— 用 2～4 句直接回答文章的核心問題。
這段同時會用在搜尋結果、分類頁、首頁卡片、Google 搜尋摘要與社群分享，CP 值最高。

### 分享到 Facebook 沒有帶入內容

手機上的 **FB App 會攔截 `sharer.php` 連結**，常常只把 App 打開卻不帶入分享內容。
這是 FB 的已知行為，不是網站的問題。

新版的處理方式：

- **手機**：點 Facebook 會改叫出**系統原生分享選單**，可以選 FB、IG、Threads、LINE 或任何 App
- **桌機**：開固定尺寸的彈出視窗
- 另外多一顆「更多分享」按鈕，支援的裝置才會出現

如果分享出去**標題或縮圖不對**，是 Facebook 快取了舊資料。
到 [Facebook 分享偵錯工具](https://developers.facebook.com/tools/debug/)
貼上網址 → 按「Scrape Again」重新抓取即可。

### 標籤點進去是 404

代表 GitHub Actions 建置沒有啟用（見步驟 3）。
把 Source 改回「Deploy from a branch」，標籤會自動退回 `?tag=` 模式。

---

## 七、還沒做、建議接著處理

1. **圖片轉 WebP**：目前文章截圖都是 PNG，單張約 1.3MB。轉 WebP 通常可省 60–80%。
2. **圖片檔名改英數**：中文檔名會被編碼成 `%E5%85%AC...`，網址不好看，部分平台貼上會出錯。
3. **補內容**：建議優先寫客服信箱裡重複率最高的問題 —— 既是真需求，寫完之後回信直接貼連結。
4. **裝 GA4 之後看數據**：哪篇文章有用、客戶都搜什麼字進來，是決定下一篇寫什麼的依據。
