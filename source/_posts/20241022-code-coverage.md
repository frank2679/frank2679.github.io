---
title: C++ Code Coverage
date: 2024-10-22 15:46:50
tags: [cpp, tool, ]
---

## 简介
本文档介绍了如何在 C++ 项目中生成代码覆盖率报告。我们将使用 `lcov` 和 `gcovr` 工具来生成 HTML 格式的覆盖率报告。

## 示例项目
以下是一个简单的 C++ 项目示例，展示了如何配置和生成代码覆盖率报告。

### main.cpp

```cpp
cpp
#include <iostream>
int add(int a, int b) { return a + b; }
int main() {
std::cout << "Hello, World!" << std::endl;
std::cout << "2 + 3 = " << add(2, 3) << std::endl;
return 0;
}
```

### CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.10)  
project(SimpleCppProject)  

# 选项：启用代码覆盖率  
option(COVERAGE "Enable coverage reporting" ON)  

if(COVERAGE)  
    add_compile_options(--coverage)  
    link_libraries(--coverage)  
endif()  

# 添加可执行文件  
add_executable(simple_cpp main.cpp)
```


## 生成代码覆盖率报告

### 基本流程

![](03_cov_flow.drawio.svg)

1. **CMake 添加编译选项**：在 CMakeLists.txt 中启用代码覆盖率选项。
2. **编译和运行程序**：生成可执行文件并运行，生成 `.gcda` 和 `.gcno` 文件。
   - 示例文件路径：`./build/CMakeFiles/simple_cpp.dir/main.cpp.gcno`
3. **使用 lcov 生成 HTML 报告**：
   - 执行命令：`lcov --capture --directory . --output-file coverage.info`
   - 生成 HTML：`genhtml coverage.info --output-directory out`

> **注意**：
> 1. 生成的 `.gcda` 和 `.gcno` 文件不在当前路径。
> 2. `gcov` 解析 C++ 文件时会去掉 `.cpp` 后缀。

### 使用 llvm-gcov 替代 gcov
在步骤 3 中，可以使用 `llvm-gcov` 替代 `gcov`：
- 命令：`lcov -c -d . --gcov-tool *llvm-gcov* -o coverage.info`

![lcov 报告](01_lcov_report.png)

### 尝试使用 gcovr
`gcovr` 是一个 Python 封装的前端工具，比 `lcov` 更轻量。`lcov` 报告文件更详细，包含被调用的头文件。

- 运行 `supa project` 时遇到错误，原因是使用了错误的 `gcov` 版本，需要使用 `llvm-gcov`。
- 命令：`gcovr -r .. --html --html-details -o gcovr_report2/coverage.html --gcov-ignore-errors`

![gcovr 报告](02_gcovr_report.png)

## 部署指南

### 目标
1. 本地能够只运行某（几）个用例，查看相应源码的覆盖率。
2. 基于 `supa` 项目构建相同的流程。

### 操作步骤
1. 编译时打开覆盖率开关。
2. 运行目标程序，生成 `.gcda` 和 `.gcno` 文件。
3. 运行脚本 `gen_cov_report.sh`，生成 HTML 报告。

通过以上步骤，您可以轻松地在 C++ 项目中生成代码覆盖率报告，并进行分析和优化。