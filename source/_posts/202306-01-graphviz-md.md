---
title: graphviz 简介
date: 2023-06-26 17:54:13
tags: [IT, efficiency]
---
### Reference

1. home page: [Graphviz](https://graphviz.org/)
2. user guide: [User Guide — graphviz 0.20.1 documentation](https://graphviz.readthedocs.io/en/stable/manual.html)
3. repo: [graphviz / graphviz · GitLab](https://gitlab.com/graphviz/graphviz)
4. wiki: [Graphviz - Wikipedia](https://en.wikipedia.org/wiki/Graphviz#Applications_that_use_Graphviz)

### Introduction

非常棒的学习对象，学习构建一个自己的工具。不少常见应用（confluence, doxygen, sphinx 等）都通过插件的方式用上它。

1. 提供 python 接口，可以快速构图
2. 提供 cmd line，包括 dot 等多个 binary
3. 提供插件，给 confluence，doxygen 等提供服务
4. 定义了 dot 语言

### Example

1. 生成 dot 文件 `cmake --graphviz=dot_file_prefix ..` 每个目标都会生成一个 dot 文件
2. 将 dot 文件转成图片， `dot -Tsvg graph_sublas.dot.gtest_trsv > graph_trsv.svg`

![1687769988727](graph_trsv.svg)

dot 语言如下

```dot

digraph "gtest_trsv" {
node [
  fontsize = "12"
];
    "node137" [ label = "gtest_trsv", shape = egg ];
    "node1" [ label = "/home/jenkins/workspace/xxx/build/openblas_binary_file/lib/libopenblas.a", shape = septagon ];
    "node137" -> "node1" [ style = dotted ] // gtest_trsv -> /home/jenkins/workspace/xxx/build/openblas_binary_file/lib/libopenblas.a
    "node3" [ label = "gtest", shape = octagon ];
    "node137" -> "node3" [ style = dotted ] // gtest_trsv -> gtest
    "node4" [ label = "Threads::Threads", shape = pentagon ];
    "node3" -> "node4"  // gtest -> Threads::Threads
    "node5" [ label = "-pthread", shape = septagon ];
    "node4" -> "node5" [ style = dashed ] // Threads::Threads -> -pthread
    "node6" [ label = "gtest_main", shape = octagon ];
    "node137" -> "node6" [ style = dotted ] // gtest_trsv -> gtest_main
    "node4" [ label = "Threads::Threads", shape = pentagon ];
    "node6" -> "node4"  // gtest_main -> Threads::Threads
    "node3" [ label = "gtest", shape = octagon ];
    "node6" -> "node3"  // gtest_main -> gtest
    "node7" [ label = "openblas_static\n(openblas)", shape = octagon ];
    "node137" -> "node7"  // gtest_trsv -> openblas_static
    "node5" [ label = "-pthread", shape = septagon ];
    "node7" -> "node5"  // openblas_static -> -pthread
    "node8" [ label = "driver_level2", shape = hexagon ];
    "node7" -> "node8"  // openblas_static -> driver_level2
    "node9" [ label = "driver_level3", shape = hexagon ];
    "node7" -> "node9"  // openblas_static -> driver_level3
    "node10" [ label = "driver_others", shape = hexagon ];
    "node7" -> "node10"  // openblas_static -> driver_others
    "node11" [ label = "interface", shape = hexagon ];
    "node7" -> "node11"  // openblas_static -> interface
    "node12" [ label = "kernel", shape = hexagon ];
    "node7" -> "node12"  // openblas_static -> kernel
    "node13" [ label = "pthread", shape = septagon ];
    "node137" -> "node13" [ style = dotted ] // gtest_trsv -> pthread
    "node14" [ label = "xxx", shape = doubleoctagon ];
    "node137" -> "node14" [ style = dotted ] // gtest_trsv -> xxx
}


```

### summary

学习 graphviz 来制作一个属于自己的工具。

### todo

cmake 是如何集成 graphviz 的，graphviz 是如何让 cmake 集成的。
