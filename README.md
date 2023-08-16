# 如何用 hexo 写博客

1. 创建新文章：`hexo new [layout] <name>` layout 一般直接写 post
2. 需要把 next repo 拉下来，路径 themes/next，`git submodule update --init`
3. 生成网页：`hexo generate`
4. 开启网站供预览效果：`hexo server`
5. 打开浏览器预览，输入 `<ip>:4000`
6. 部署到 github：`hexo deploy`

Tips:

1. 使用 typora 插件写文档的时候，路径解析和 hexo 不一致，也就是本地看不到图片预览效果，hexo 是不需要文件夹路径的；
