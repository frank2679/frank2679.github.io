---
title: Tenstorrent 芯片架构
date: 2024-11-25 11:12:44
tags: [芯片架构]
---

转载参考： https://blog.csdn.net/weixin_50518899/article/details/139047889

## 两个核心技术点

1. **通信至上，统一片内，片间通信模式**
   - 不用 shared mem 做核间通信，采用 multicore private memory model
   - 核间和芯片间的通信模式在软件上一致，减低分布式开发难度
   - 通过 NoC 加强所有核心和片外芯片间的通信
   - SW 层基于 pipe 的数据路由方式，由 graph compiler 生成当前模型下最优的数据路由策略，统一片内片间的通信

2. **动态执行**
   - 运行时数据压缩，packet manager engine，很重要
     - 减少数据搬运
     - 减少 private mem size
     - 提升性能功耗比
     - 可以做 reshape 操作，与 compute engine 并行
   - 条件执行，MoE 场景，有一些 RISCV CPU 小核做这件事
   - 稀疏计算
   - 动态混合精度

总体而言，数据并行和模型并行的部分功能下沉到硬件层，有效解决 scale out 的问题，且减少大量分布式实现的代码。