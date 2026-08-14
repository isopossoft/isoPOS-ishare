# =============================================================
# 自動為每個標籤產生一個實體頁面：/tags/<slug>/
#
# 為什麼需要：
#   原本標籤是用 /tags/?tag=xxx 的前端篩選，
#   搜尋引擎只會看到一頁空的 /tags/，每個標籤都無法被單獨索引。
#
# 注意：
#   GitHub Pages「內建」的 Jekyll 建置不會執行 _plugins。
#   要讓這個檔案生效，必須改用 GitHub Actions 建置
#   （Settings → Pages → Build and deployment → Source: GitHub Actions）。
#   沒啟用也不會壞掉 —— 標籤會自動退回原本的 ?tag= 篩選模式。
# =============================================================

module ISharePlugins
  class TagPageGenerator < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      posts = site.posts.docs.reject { |p| p.data['noindex'] }

      tags = {}
      posts.each do |post|
        Array(post.data['tags']).each do |tag|
          next if tag.to_s.strip.empty?
          tags[tag] ||= []
          tags[tag] << post
        end
      end

      tags.each do |tag, tag_posts|
        site.pages << TagPage.new(site, tag, tag_posts.size)
      end

      Jekyll.logger.info "iShare:", "已產生 #{tags.size} 個標籤頁"
    end
  end

  class TagPage < Jekyll::Page
    def initialize(site, tag, count)
      @site = site
      @base = site.source
      @dir  = File.join('tags', slugify(tag))
      @name = 'index.html'

      process(@name)
      read_yaml(File.join(@base, '_layouts'), 'tag.html')

      data['layout']          = 'tag'
      data['tag_name']        = tag
      data['tag_slug']        = slugify(tag)
      data['title']           = "##{tag}｜文章標籤｜#{site.config['title']}"
      data['meta_description'] = "與「#{tag}」相關的 #{count} 篇文章，涵蓋 #{site.config['description']}。"
      data['post_count']      = count
    end

    # 中文標籤也能產生可讀的網址；純中文則退回 URL 編碼後的安全字串
    def slugify(tag)
      s = tag.to_s.downcase.strip
             .gsub(/[[:space:]\/]+/, '-')
             .gsub(/[^\p{Alnum}\p{Han}\-]/, '')
             .gsub(/-+/, '-')
             .gsub(/\A-|-\z/, '')
      s.empty? ? 'tag' : s
    end
  end
end
