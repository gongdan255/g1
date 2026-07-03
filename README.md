# 纸页日记

一个温暖手账风的动态博客首页，适合个人随笔、旅行记录、读书笔记和生活碎片。

## 特点

- 纸张质感背景
- 便签、拍立得、胶带风格视觉
- 滚动出现动效
- 卡片悬停轻微 3D 倾斜
- 可直接部署到 GitHub Pages
- 多页面结构：首页、文章列表、详情页、发布页
- 发布内容会先保存到浏览器本地存储
- 发布页支持封面图链接和本地图片预览
- 可选接入 Supabase 作为真正的后端发布方案

## 运行

直接打开 `index.html` 即可预览。

如果你想本地起服务，也可以用任意静态服务器，比如：

```bash
python -m http.server 8000
```

然后访问 `http://localhost:8000`

## 部署到 GitHub Pages

1. 把这几个文件放在仓库根目录：
   - `index.html`
   - `posts.html`
   - `post.html`
   - `publish.html`
   - `about.html`
   - `blog-config.js`
   - `blog-data.js`
   - `backend.js`
   - `supabase-schema.sql`
   - `style.css`
   - `script.js`
   - `README.md`

## 发布说明

- 这个版本的“发布页”会把新文章保存到当前浏览器的 `localStorage`
- 发布后会自动跳转到新文章详情页
- 文章列表页和首页也会同步显示新内容
- 如果你想做成多人可见的真正博客，需要接后端或 CMS

## 接 Supabase

1. 在 `blog-config.js` 里把 `provider` 改成 `supabase`
2. 填入 `supabaseUrl` 和 `supabaseAnonKey`
3. 把 `supabaseBucket` 改成你自己的公开存储桶
4. 在 Supabase 里创建文章表，字段至少包括：
   - `id`
   - `slug`
   - `title`
   - `category`
   - `date`
   - `excerpt`
   - `cover`
   - `featured`
   - `body`
   - `notes`
   - `related`
   - `created_at`
5. 之后在发布页提交就会写入 Supabase，并自动把封面图上传到存储桶
2. 推送到 GitHub
3. 在仓库设置里打开 GitHub Pages
4. 选择 `main` 分支和根目录 `/`

## 你可以继续做的事

- 把文章数据改成你自己的内容
- 替换成自己的照片
- 再加一个文章列表页或详情页
