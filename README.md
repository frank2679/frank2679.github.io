# frank2679.github.io

Astro 个人网站 + 博客，部署在 GitHub Pages（https://frank2679.github.io）。

> 本仓库最早是 Hexo 博客，已重写为 Astro（见 commit `3bf4f25`）。仓库里残留的 `source/`、`public/`（生成物）、`themes/`、`db.json` 等是旧 Hexo 遗留文件，未被 git 跟踪，与当前站点无关。

## 写新文章

1. 在 `src/content/blog/` 下新建 `YYYYMMDD-english-slug.md`（文件名即路由 slug，如 `20260914-li-lu-value-investing-2024-speech.md`）。
2. Frontmatter 遵循 `src/content/config.ts` 里的 schema：
   ```yaml
   ---
   title: "文章标题"
   date: 2026-09-14
   tags: [标签1, 标签2]
   description: "一句话简介"
   ---
   ```
3. 配图放在 `public/assets/blog/<slug>/`，正文里用绝对路径引用：`![](/assets/blog/<slug>/xxx.png)`。
4. 如果内容主要由 AI 辅助整理生成，在正文开头加一行说明，并在 `tags` 里加 `AI-generated`（参考近期文章的写法）。

## 本地开发

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 产物输出到 dist/
npm run preview  # 预览 build 产物
```

## 部署

推送到 `main` 分支后，GitHub Actions（`.github/workflows/deploy.yml`）会自动 `npm run build` 并把 `dist/` 发布到 `gh-pages` 分支，无需手动部署。工作流还配置了每日定时任务，用于从 `resume-ng` 同步简历 PDF 并重新部署。

## 评论与阅读数（Waline）

文章页底部的评论区和标题旁的阅读数由 [Waline](https://waline.js.org) 提供，后端单独部署在 Vercel（免费套餐）+ Neon PostgreSQL（免费套餐）上。前端只需配置一个地址：`src/config/waline.ts` 里的 `WALINE_SERVER_URL`，留空则评论区和阅读数都不渲染。

后端部署步骤（参考 [官方文档](https://waline.js.org/guide/get-started/)）：

1. 用官方模板一键部署到 Vercel，项目名随意。
2. Vercel 项目 → **Storage** → **Create Database** → 选 **Neon**，按默认配置创建。
3. 在 Neon 的 **SQL Editor** 里执行 Waline 仓库 `assets/waline.pgsql` 的建表语句。
4. 回到 Vercel **Redeploy**，打开部署地址即为 `serverURL`，填进 `src/config/waline.ts`。
5. 访问 `<serverURL>/ui/register` 注册，第一个注册的账号是管理员；在后台可审核/删除评论。
6. 建议在 Vercel 环境变量里配置：`SITE_NAME`、`SITE_URL=https://frank2679.github.io`、`SECURE_DOMAINS=frank2679.github.io`（只允许本站调用），以及邮件通知相关的 `SMTP_*`、`AUTHOR_EMAIL`。改完环境变量需要 Redeploy。

每篇文章的评论和阅读数以 `/blog/<slug>/` 为键存储，修改文章 slug 会让该文已有的评论和阅读数“丢失”（数据仍在库里，只是对不上新路径）。
