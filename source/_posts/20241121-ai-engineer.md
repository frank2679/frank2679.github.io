---
title: AI Engineer Roadmap
date: 2024-11-21 17:26:10
tags: [AI, LLM]
---

- [1. 概要](#1-概要)
  - [1.1. Target](#11-target)
  - [1.2. Key result](#12-key-result)
  - [1.3. Resource](#13-resource)
- [2. Roadmap](#2-roadmap)
  - [2.1. 参考1](#21-参考1)
- [3. 阿里 LLM](#3-阿里-llm)
- [4. auto coder](#4-auto-coder)
- [5. 智源 BAAI](#5-智源-baai)
  - [5.1. 简介](#51-简介)
  - [5.2. kicking like human](#52-kicking-like-human)
  - [5.3. 通用机器人——合成数据](#53-通用机器人合成数据)
  - [5.4. 具身智能](#54-具身智能)
  - [5.5. 圆桌，具身智能前沿进展](#55-圆桌具身智能前沿进展)
  - [5.6. 机器人与世界模型](#56-机器人与世界模型)
  - [5.7. 圆桌，空间智能与世界模型](#57-圆桌空间智能与世界模型)
  - [5.8. What's missing for robotics foundation](#58-whats-missing-for-robotics-foundation)
  - [5.9. 通用类人灵巧操作机器人](#59-通用类人灵巧操作机器人)
  - [5.10. 闭幕](#510-闭幕)
  - [感想](#感想)
- [6. 软件工程师如何应对 AI 时代](#6-软件工程师如何应对-ai-时代)

# 1. 概要
## 1.1. Target 

1. 产品化，商业化
2. AI 重度使用者
3. AI 是长期方向


## 1.2. Key result

1. 每日学习 AI 1h



## 1.3. Resource

- [Coursera, What Is an AI Engineer? (And How to Become One)](https://www.coursera.org/articles/ai-engineer)
- [Simplilearn, How to Become an AI Engineer: Skills, & Salary [2025]](https://www.simplilearn.com/tutorials/artificial-intelligence-tutorial/how-to-become-an-ai-engineer)
- [aisolink](https://www.aisolink.com/)
- [智源社区](https://hub.baai.ac.cn/)
- [Stephen Wolfram, what is chatgpt and why does it work](https://writings.stephenwolfram.com/2023/02/what-is-chatgpt-doing-and-why-does-it-work/)

# 2. Roadmap

## 2.1. 参考1
[Medium, If I started learning AI Engineering in 2024, here’s what I would do.](https://ai.gopubby.com/if-i-started-learning-ai-engineering-in-2024-heres-what-i-would-do-25dc37bc015a)

1. Basic python
2. LLM，给了三个资源
3. Prompt engineering, 别花太久的时间，掌握最基本的就好，包括哪些？
4. Projects
   1. 1st project，组合上面的3个部分
      1. Openai api, langchain, llamaindex
      2. 一定要实践出来，实践出来，实践出来
         1. Document learning
         2. Portfolio of completed projects, 作品集
      3. Clone chatgpt
5. Learn in public
   1. Share what you learn
6. Repeat 4 and 5
   1. 如何选择（下）一个项目
      1. 项目的作用，解决真实世界的问题
         1. 节约时间
         2. 节约钱
         3. 挣钱
   2. 技术是个 hint，关键是技术要解决的问题
7. Find a mentor
   1. Find the author from linkedin


# 3. 阿里 LLM

- [大模型平台百炼平台官方文档](https://help.aliyun.com/zh/model-studio/getting-started/what-is-model-studio?spm=a2c4g.11186623.0.i3)

key: sk-a9f551b03850475fb420079deb2ff00c


# 4. auto coder

[知乎，010-AutoCoder 如何在公司级别使用](https://zhuanlan.zhihu.com/p/689049233)


# 5. 智源 BAAI

- [2024.11, 智源论坛 2024 具身与世界模型专题](https://event.baai.ac.cn/activities/855)


## 5.1. 简介
BAAI 2018 年成立，悟道系列，院长王仲远
- 解决行业痛点
  - BGE系列
  - 多模态大模型 EMU 系列，图像/视频/文字
- 具身智能大模型

## 5.2. kicking like human
- 赵明国，清华自动化系,mgzhao@tsinghua.edu.cn
- robocup，2050年打败人类

## 5.3. 通用机器人——合成数据

- 王鹤，北大教授，银河通用创始人
- 通用机器人，多任务，自然语言交互，零代码部署
- Vision-language-action (VLA)
- 用什么数据训练，缺少数据
  - google: open X-embodiment, 1 million
  - openVLA
- 距离家用机器人10年
- 筛选论文的方法，直接找各大会议/期刊的最佳论文
- 3D数据 vs 2D 数据，前者效率提升 10000 倍
- Sim2Real, D3RoMA vs depth anything
- Dexterous grasping
- 合成数据 + 强化学习


## 5.4. 具身智能
- 蒋树强，中科院
- 生物已经进化了很多年了，所以现在看上去不用计算了，其实是经过很多代迭代。

## 5.5. 圆桌，具身智能前沿进展

- 赵明国，面对新事物，信息量越来越大，反复学习，思考
- 王鹤，具身智能的落地场景，车厂，一天不能停1min，需要务实，理想和现实的距离，把抓取这件小事情做好就已经了不起了
- 具身智能的 iphone 时刻还很远
- 冷晓琨，2023年


## 5.6. 机器人与世界模型

- 来杰，星尘智能，百度文心一言，然后到腾讯，其老师张正友
- design for AI
  - 安全地交互，拿到数据
  - 多观察少交互
  - 世界模型刚刚起步，最终做出终端
    - 国家在推数据
  - 机器人需要补全的信息
    - 空间信息
    - 物理信息
    - 约束信息
  - 为机器人打造一个小的世界模型，再通过机器人打造一个普适性的世界模型
  - 感想
    - 可能是实现 AGI 的一条可行的路
    - 接近清楚的状态，但是还不够清楚，可能故意不说清楚，感觉他是清楚的



## 5.7. 圆桌，空间智能与世界模型

- learning base, data driven
- 黄思远，北京通用人工智能研究院，3D 场景理解来帮助机器人和人的交互
- 长视频理解，视频序列的表征还没找到，多模态智能等基础技术有待探索
- 空间/工业机器人：精确性，稳定性
  - model based -> learning based
- 自动驾驶 -> 具身智能，latent world model
- 来杰，星尘智能
  - 世界模型的要点：可以脑补，对世界的一种表征
  - 难点：没有数据，也不知道需要什么样的数据；做机器人收集数据；
- 物理
  - 物理可解释性
  - action 和视频生成的融合
- 难点
  - 陈睿，清华机械系，硬件
  - 代季峰，清华电子工程，算法突破，生物低功耗，现在的 DL 算法还没找到根本
  - 李弘扬，港大，数据是问题
    - 低成本收集，生态
  - 场景


## 5.8. What's missing for robotics foundation

- Ted Xiao, google deepmind, RT1, 2, SayCan, tedxiao@google.com
- VLM -> LLM -> Control policy
  - VLM, LLM 并非一开始为 robotic 服务
- robotics-first foundation models are next step from generic vision/language models
  - missing part1: scaling law
  - #2: high-bandwith context
  - #3: scalable evaluation
- data collection 是最大的挑战
- 感悟：
  - 这些研究蛮有意思的，但是我不擅长，我一直从事芯片加速库开发，未来如何规划

## 5.9. 通用类人灵巧操作机器人
- 王鹏，中科院自动化所，中科硅纪公司
- 泛化能力很重要
- 灵巧手+具身智能+应用场景
- 任务分解——大模型可以做
- 感想
  - 报告的逻辑是先学会，然后抽象总结输出，西方逻辑是重复学习路径的介绍

## 5.10. 闭幕

- 黄铁军，智源理事
- 智能形态，大而全 vs 小而美，互相合作
  - 大而全，LLM
  - 小而美，具身都是一个个智能体
- 智源做企业不愿意做，大学做不了的事
  - 具身智能产业链，具身智能的 CPU，OS 是什么

## 感想



# 6. 软件工程师如何应对 AI 时代

AI 时代，一个人可以做的事情更多了，也能更好地探索自己的真正兴趣/使命。

AI 时代，我想做点什么，用 AI 解决工作生活中的问题。这些问题可以是有趣的，足够困难的，简单的是用于学习的。
- 自我成长，比如
  - 找到问题/使命，比如
    - 机器人踢足球
  - 掌握某个技能
    - 掌握编译器知识，编程语言，编程范式
    - 给我当游泳教练，指导我游泳训练
  - 养成一些习惯
    - 写作，阅读
    - 运动
    - 写代码，做有趣的项目
