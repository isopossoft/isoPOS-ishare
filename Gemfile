source "https://rubygems.org"

# GitHub Pages 官方環境（版本鎖定，避免本機與線上結果不一致）
gem "github-pages", group: :jekyll_plugins

# 讓 _plugins/tag_pages.rb 能執行（改用 GitHub Actions 建置時需要）
group :jekyll_plugins do
  gem "jekyll-sitemap", require: false   # 本站用自訂 sitemap.xml，這裡不啟用
end

gem "webrick", "~> 1.8"
