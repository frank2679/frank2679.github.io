---
title: cpp 编译时间优化
date: 2023-08-16 10:48:50
tags: [cpp, compiler, cmake IT, efficiency]
---

 - [原理](#原理)
 - [做法](#做法)
 - [效果](#效果)

## 原理

cmake 官方文档：[UNITY_BUILD — CMake 3.16.9 Documentation](https://cmake.org/cmake/help/v3.16/prop_tgt/UNITY_BUILD.html)

原理解释：[使用 Unity Build 加速 CMake 编译 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/146434531)

cpp 代码由于历史原因只能以文件为单位进行编译，有以下问题

> 1. 每个编译单元，都需要独立解析所有包含的头文件:
>    a. 如果N个源文件引用到了同一个头文件，则这个头文件需要解析N次（对于 `protobuf`这类动辄几千上万行的头文件简直就是鬼故事）；
>    b. 如果头文件中有模板(STL/Boost)，则该模板在每个cpp文件中使用时都会做一次实例化，N个源文件中的 `std::vector<int>`会实例化N次。
> 2. 每个源文件独立编译，导致编译优化时只能基于本文件内容进行优化，很难跨编译单元提供代码优化；
> 3. 基于问题2，C/C++ 跨编译单元的优化只能交给链接器，而链接阶段是单进程，无法并行加速，导致大项目链接极慢。
>
> From [使用 Unity Build 加速 CMake 编译 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/146434531)

unity build 的思路是将多个文件合入到一个 cpp 文件中，最后只编译合并后的 cpp，这样可以很大程度上解决上述问题。将哪些文件合并到一个 cpp 文件中，可以借鉴模块化思路，将一个模块的代码放到一个 cpp 中，如此，一个模块中的公用头文件就只会被编译一次。

综上，对于**模板**用的多的场景，unity build 非常有效。

## 做法

上面的知乎分享中给出了手动合并文件的做法，这种做法更精细，不过成本高，要求开发者对代码相当熟悉。其实 cmake 本身也支持 unity build，由 cmake 帮你决定哪些文件合并到一起，并且有一个上限——最多 UNITY_BUILD_BATCH_SIZE 个文件合并到一个文件中。

> When this property is set to true, the target source files will be combined into batches for faster compilation. This is done by creating a (set of) unity sources which `<span class="pre">#include</span>` the original sources, then compiling these unity sources instead of the originals. This is known as a *Unity* or *Jumbo* build. The [`<span class="pre">UNITY_BUILD_BATCH_SIZE</span>`](https://cmake.org/cmake/help/v3.16/prop_tgt/UNITY_BUILD_BATCH_SIZE.html#prop_tgt:UNITY_BUILD_BATCH_SIZE) property controls the upper limit on how many sources can be combined per unity source file.

> From: [UNITY_BUILD — CMake 3.16.9 Documentation](https://cmake.org/cmake/help/v3.16/prop_tgt/UNITY_BUILD.html)

在 CMakeLists.txt 中做如下配置

```cmake

if(${CMAKE_VERSION} VERSION_GREATER_EQUAL "3.16.9")

  set_target_properties(${TARGET} PROPERTIES UNITY_BUILD ON)

  set_target_properties(${TARGET} PROPERTIES UNITY_BUILD_BATCH_SIZE 50)

endif()

```

## 效果

优化前

![1692151104184](1692151104184.png)

优化后

![1692151172333](1692151172333.png)

编译文件数量减少了，383 -> 180，时间也减少了 226s -> 33s，这个 build 中之所以有这么大的好处是因为该实现中大量使用了模板。
