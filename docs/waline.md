# Waline 评论系统：搭建与维护指南

博客的**文章评论**和**阅读数**由 [Waline](https://waline.js.org) 提供，2026-10-12 上线（[PR #73](https://github.com/frank2679/frank2679.github.io/pull/73)）。本文记录系统怎么搭起来的、踩过的坑，以及日常怎么维护。

## 1. 整体架构

```
读者浏览器
  │  打开 https://frank2679.github.io/blog/<slug>/   ← GitHub Pages（静态页面，与评论系统无关）
  │
  └─ 页面里的 @waline/client 发 HTTPS 请求
        ↓
     https://waline-comment-tawny-zeta.vercel.app      ← Vercel 上的 Waline 服务端（Serverless Function）
        ↓
     Neon PostgreSQL                                   ← 评论、阅读数、用户数据都存这里
```

- 博客本身仍然是纯静态站，构建和部署流程完全没变。
- 评论服务挂了，只会让评论区和阅读数加载不出来，**博客本身照常访问**。
- 全部使用免费套餐：Vercel Hobby + Neon Free。

## 2. 各组件与账号清单

| 组件 | 位置 | 说明 |
|---|---|---|
| 服务端代码仓库 | GitHub 私有仓库 [`frank2679/waline-comment`](https://github.com/frank2679/waline-comment) | Vercel 从官方模板复制生成，里面只有依赖 `@waline/vercel` 的少量文件；推送后 Vercel 自动部署 |
| 服务端部署 | Vercel 项目 `waline-comment` | 正式域名 `waline-comment-tawny-zeta.vercel.app` |
| 数据库 | Neon（通过 Vercel **Storage** 创建并关联） | 连接信息由 Vercel 自动写入环境变量，不需要手动管理 |
| 管理后台 | <https://waline-comment-tawny-zeta.vercel.app/ui> | 第一个注册的账号就是管理员（已注册） |
| 博客前端 | 本仓库 | 见下面第 4 节 |

## 3. 搭建过程（以后重建或迁移时照着做）

1. **部署服务端**：按 [官方文档](https://waline.js.org/guide/get-started/) 点 Vercel 一键部署按钮。
   - Vercel 会在你的 GitHub 账号下**新建一个仓库**存放服务端代码。不要用博客仓库，否则会和 Astro 项目冲突。
   - 先要给 Vercel 安装 GitHub App 授权，否则会报 *"install the GitHub integration first"*。
   - 如果报 *"A repository named … already exists"*，说明上一次失败的尝试已经建好了仓库。在 Vercel 用 **Add New → Project → Import** 导入这个已有仓库即可。
2. **建数据库**：在 Vercel 项目里进入 **Storage → Create Database → Neon**，按默认配置创建，并关联到项目（Development、Preview、Production 三个环境都勾上）。
3. **建表**：在 Neon 的 **SQL Editor** 里执行 [`waline.pgsql`](https://github.com/walinejs/waline/blob/main/assets/waline.pgsql)，执行后应能看到 `wl_comment`、`wl_counter`、`wl_users` 三张表。
4. **配置环境变量**：见下面第 5 节。
5. **重新部署**：进入 **Deployments**，在最新一次部署的 `⋯` 菜单里选 **Redeploy**。**改任何环境变量后都要重新部署才会生效。**
6. **注册管理员**：打开 `<服务端地址>/ui/register` 注册。**一定要在博客接入之前完成**，免得被别人抢先注册成管理员。
7. **接入博客**：把正式域名填进 `src/config/waline.ts`，提 PR 并合并。

### 踩过的坑

| 现象 | 原因 | 解决 |
|---|---|---|
| 地址里带随机串（如 `waline-comment-e5u135y1i-…vercel.app`），访问后跳转到 Vercel 登录页 | 这是**单次部署的预览地址**，受 Deployment Protection 保护，而且每次部署都会变 | 用 **Settings → Domains** 里的**正式域名** |
| `waline-comment.vercel.app` 能打开 | 那是**别人的项目**，碰巧同名 | 不要使用 |
| 点 Visit 后显示 `500 FUNCTION_INVOCATION_FAILED` | 还没建数据库或没建表 | 完成上面第 2、3 步后重新部署 |
| 注册页和接口都返回 `403 Forbidden` | 设置了 `SECURE_DOMAINS`，但名单里没有服务端自己的域名（Waline 不会自动加入），而且值里混进了 Tab 字符 | 见下面第 5 节，手动输入值，不要复制粘贴 |

## 4. 博客前端是怎么接入的

| 文件 | 作用 |
|---|---|
| `src/config/waline.ts` | 唯一配置项 `WALINE_SERVER_URL`。**留空就整体关闭**评论区和阅读数 |
| `src/components/Comments.astro` | 评论区，放在文章底部 |
| `src/components/PageViews.astro` | 文章日期旁的「N 次阅读 / N views」 |
| `src/pages/blog/[slug].astro` | 引入上面两个组件，并统一传入 `path` |

设计要点：

- **数据的 key 是 `/blog/<slug>/`**，在 `[slug].astro` 里写死，带不带结尾斜杠都算同一篇。⚠️ **修改文章 slug，等于换了 key**，旧的评论和阅读数会对不上。数据还在库里，可以在后台把评论的 `url` 字段改成新路径。
- **评论区懒加载**：滚动到离评论区还有 400px 时才加载 Waline 的 JS 和 CSS，不影响首屏速度。
- **语言跟随站点的 EN/中文 切换**：监听 `<html data-lang>` 的变化，然后调用 `waline.update({ lang })`。
- **颜色**：在 `#waline` 上把 `--waline-*` CSS 变量映射到站点的暗色主题变量。
- **关闭的功能**：图片上传、GIF 搜索、文章 reaction（减少垃圾内容和代码体积）。
- **表情包从 jsDelivr 用 https 加载**：默认的 unpkg 地址不带协议，在 http 页面上会被浏览器拦截，而且 unpkg 在国内不稳定。
- **阅读数**：每次打开文章页加 1，刷新也算一次。只统计文章页，不统计首页和列表页。

## 5. 服务端环境变量

在 Vercel 项目的 **Settings → Environment Variables** 里配置，**改完要 Redeploy**。

| Key | 当前值 / 来源 | 说明 |
|---|---|---|
| `DATABASE_URL`、`PG*`、`POSTGRES_*` | 关联 Neon 时自动生成 | 不要手动改 |
| `SITE_NAME` | `Frank Young` | 显示在邮件和后台里 |
| `SITE_URL` | `https://frank2679.github.io` | 后台和邮件里的链接会指向这里 |
| `SECURE_DOMAINS` | `frank2679.github.io,waline-comment-tawny-zeta.vercel.app` | 来源域名白名单：只写域名，不带 `https://`；用英文逗号分隔，不加空格；**必须包含服务端自己的域名**，否则后台会 403 |

可选（目前没开）：

| 需求 | 变量 |
|---|---|
| 新评论发邮件通知 | `SMTP_SERVICE`（如 `Gmail`）、`SMTP_USER`、`SMTP_PASS`（Gmail 要用"应用专用密码"）、`AUTHOR_EMAIL` |
| 评论先审核再显示 | `COMMENT_AUDIT=true` |
| 禁止匿名评论 | `LOGIN=force` |

完整列表见 [官方文档：服务端环境变量](https://waline.js.org/reference/server/env.html)。

## 6. 日常维护

### 管理评论
登录 <https://waline-comment-tawny-zeta.vercel.app/ui>，可以审核、删除、置顶评论，或者标记为垃圾评论。管理员登录后，在博客评论区回复会带「博主」标识。

### 备份（建议每月一次，或在大改之前）
在后台 `/ui` 的 **导入/导出** 页面导出一份 JSON，保存到本地或网盘。迁移到新数据库时，用同一个页面导入。

### 升级 Waline
- **服务端**：官方模板的 `package.json` 写的是 `"@waline/vercel": "latest"`，所以升级只需在 Vercel 里 **Redeploy**，并**取消勾选** "Use existing Build Cache"。如果以后改成了固定版本号，就改版本号后推送。
  - 升级前先看 [更新日志](https://github.com/walinejs/waline/releases)，确认有没有需要改表结构的说明。
- **前端**：在本仓库运行 `npm install @waline/client@<新版本>`，用 `npm run dev` 本地确认评论区正常后再提 PR。前后端大版本要保持一致（目前都是 v3 / 1.x）。

### 关注免费额度
偶尔到 Vercel 的 **Usage** 页面和 Neon 控制台看看用量。个人博客的访问量远低于免费额度。Neon 免费库空闲一段时间后会自动休眠，下一次请求要先唤醒，所以第一次加载评论可能慢 1～2 秒，属于正常现象。

### 换服务端域名（例如绑定自己的域名 `comment.xxx.com`）
1. 在 Vercel **Settings → Domains** 添加域名，并按提示配置 DNS 的 CNAME 记录。
2. 把新域名加进 `SECURE_DOMAINS`，然后 Redeploy。
3. 修改本仓库 `src/config/waline.ts` 里的 `WALINE_SERVER_URL`，提 PR 并合并。
4. 确认新地址正常后，再从 `SECURE_DOMAINS` 里删掉旧域名。

### 临时关闭评论
把 `src/config/waline.ts` 里的 `WALINE_SERVER_URL` 改成空字符串 `''`，提 PR 并合并。数据不会丢失。

## 7. 故障排查

先用 curl 判断是哪一层出了问题（把 `Referer` 换成博客域名，模拟真实请求）：

```bash
curl -s -H "Referer: https://frank2679.github.io/" \
  "https://waline-comment-tawny-zeta.vercel.app/api/comment?path=/blog/x/&type=count"
# 正常：{"errno":0,"errmsg":"","data":0}
```

| 现象 | 排查方向 |
|---|---|
| 返回 `403 Forbidden` | 检查 `SECURE_DOMAINS` 的拼写，以及有没有混进空格、Tab 或 `https://`；改完记得 Redeploy |
| 返回 `500` | 查看 Vercel 项目的 **Logs**。常见原因：数据库没关联（缺少 `PG*` 变量）、表没建（日志里有 `relation "wl_comment" does not exist`）、Neon 免费额度用完 |
| curl 正常，但博客上不显示评论区 | 打开浏览器开发者工具看 Console 和 Network；确认 `src/config/waline.ts` 里有地址，并且线上已经部署了最新版本 |
| 阅读数一直显示 `–` | 和上一行一样，阅读数也依赖同一个接口 |
