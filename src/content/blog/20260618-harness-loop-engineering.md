---
title: "Harness Engineering 与 Loop Engineering 深度调研报告"
date: 2026-06-18
tags: [AI, agent, harness-engineering, loop-engineering, LLM]
description: "系统梳理 Harness Engineering 与 Loop Engineering 的定义、架构、关系，以及以 Claude Code 为例的工程实践，附完整学习路径。"
---

> **本文由 AI（Claude）辅助生成**，经人工审阅后发布。调研日期：2026-06-17。
>
> 核心问题：什么是 Harness Engineering 和 Loop Engineering？如何系统学习？

---

## 目录

1. [Harness Engineering — AI Agent 基础设施工程](#一harness-engineering)
2. [Loop Engineering — Agent 迭代循环工程](#二loop-engineering)
3. [两者的关系与协作架构](#三两者的关系)
4. [以 Claude Code 为例的具体实现](#四claude-code-案例解析)
5. [系统学习路径](#五系统学习路径)
6. [参考资源](#六参考资源)

---

## 一、Harness Engineering

### 1.1 定义

**Harness Engineering** 是一门工程学科，专注于设计和维护 **控制 AI Agent 行为的整套基础设施系统**——除模型本身之外的一切。

核心公式：
```
Agent = Model + Harness
```

正式定义：Harness 是围绕 LLM 核心推理循环的非模型运行时软件基础设施，负责持续协调工具分发、上下文管理、安全执行和会话持久化，**作为模型推理引擎的操作系统**。

> 关键区别：Prompt Engineering 是 Harness Engineering 的一个子组件，而非同义词。Prompt Engineering 优化单次模型调用的输入，而 Harness Engineering 覆盖整个基础设施层。

形式化框架（Vishal Mysore, 2026）：
```
H = (E, T, C, S, L, V)
```
| 符号 | 含义 |
|------|------|
| **E** | Execution infrastructure（执行基础设施） |
| **T** | Tool schemas（工具 Schema） |
| **C** | Context construction（上下文构建） |
| **S** | State management（状态管理） |
| **L** | Verification & validation logic（验证逻辑） |
| **V** | Additional validation layers（额外校验层） |

### 1.2 三层架构

```
┌─────────────────────────────────────────┐
│  Layer 3 — Feedback（反馈层）            │
│  评估、验证、Human-in-the-loop            │
├─────────────────────────────────────────┤
│  Layer 2 — Execution（执行层）           │
│  Agentic Loop: Plan→Tool→Parse→Guard→Retry│
├─────────────────────────────────────────┤
│  Layer 1 — Information（信息层）         │
│  记忆检索、上下文构建、工具暴露             │
└─────────────────────────────────────────┘
```

### 1.3 核心组件

使用 Martin Fowler 的 Guides-and-Sensors 分类法：

**Guides（前馈控制 — 约束型）**
- System Prompts：定义 Agent 角色与范围
- CLAUDE.md / AGENTS.md：指定允许行为
- 约束文件：建立禁止边界
- 数据上下文管道：提供经认证的信息

**Sensors（反馈控制 — 验证型）**
- 自动化测试套件：评分输出质量
- 实时验证循环：标记约束违规
- 输出解析器：将文本转为类型化数据
- 漂移检测器：识别行为退化

### 1.4 设计原则

1. **Deny-First 安全姿态**：宽泛的拒绝规则优先于狭窄的允许规则
2. **权限分离**：推理层与执行决策层隔离，防止 Prompt Injection
3. **可逆性加权**：高风险操作要求用户确认，低风险操作自动执行
4. **上下文作为稀缺资源**：从设计初始就假设上下文窗口是约束瓶颈
5. **环境分层防御**：Intent Layer → Harness Layer → Environment Layer，层层独立

### 1.5 为什么重要

- **88% 的 AI 试点项目无法进入生产**（Shakudo, 2026）
- **65% 的企业 AI 失败追溯到 Harness 缺陷**：Context Drift（上下文漂移）、Schema Misalignment（Schema 不对齐）、State Degradation（状态退化）
- 优化 Harness（而非更换模型）可将 Token 成本从 $3.00/百万降至 $0.30/百万，同时实现 4x 延迟改善

---

## 二、Loop Engineering

### 2.1 定义

**Loop Engineering** 是设计 AI Agent 自主迭代执行循环的工程实践——指定目标、设置触发器、构建护栏，让 Agent 无需人工干预地反复运行直到达成目标。

> "Loop Engineering 用目标驱动的自动化取代了手动提示。" — MindStudio, 2026

范式演进：
```
2022-2024 → 专注于优化高质量 Prompt
2025     → 专注于管理上下文窗口
2026     → 设计整个系统架构（Loop Engineering）
```

工程师角色从「转动曲柄的操作员」转变为「设计机器的架构师」。

### 2.2 ReAct 模式（核心基础）

ReAct（Reasoning + Acting）由 Yao et al. 于 2022 年提出（发表于 ICLR 2023），是现代所有主要自主 AI 系统的核心架构。

```
Thought → Action → Observation → Thought → Action → ...（直到终止）
```

| 阶段 | 内容 |
|------|------|
| **Thought** | Agent 在行动前评估情况，推理为何使用某工具 |
| **Action** | 执行具体工具调用（搜索、读文件、运行代码等） |
| **Observation** | 工具结果反馈回上下文，驱动下一轮推理 |

实验结果：在 ALFWorld 和 WebShop 两个交互式决策基准上，ReAct 分别以绝对成功率 34% 和 10% 超越了模仿学习和强化学习方法。

### 2.3 Loop 架构类型

```
链（Chain）: A → B → C（线性，固定路径）
循环（Loop）: A → B → [发现B失败] → 修改策略 → B' →...（动态，自适应）
```

| 代际 | 代表 | 特点 |
|------|------|------|
| Gen 1 (2023) | AutoGPT | 概念验证，稳定性差 |
| Gen 2 (2024) | LangGraph, CrewAI | 带状态图的受控循环 |
| Gen 3 (2025) | Claude `/goal`, OpenAI Swarm | 目标条件终止 |
| Gen 4 (2026) | 多Agent编排，Ralph Loop | 跨会话文件持久化状态 |

**Ralph Loop**（特殊模式）：在迭代间重置上下文，用文件系统保存状态——解决长任务的上下文溢出问题。

### 2.4 状态管理

```
Agentic System = Agent × Stateful Environment（闭环）
```

Agent 将交互历史与相关上下文映射到下一个工具调用动作，环境执行并返回 Observation。

五大状态管理要素：

1. **会话内记忆**：当前上下文窗口中的消息历史
2. **外部持久化**：Markdown 文件、数据库、任务板
3. **上下文压缩**：Snip → Microcompact → Context Collapse → Auto-Compact
4. **Snapshot 机制**：修改前记录文件状态，支持回滚
5. **跨 Agent 传递**：Sub-agent 间的结构化 handoff

### 2.5 终止条件设计（关键）

> "没有明确的停止条件，循环就会一直运行直到钱烧完。" — DataScienceDojo, 2026

五类终止机制：

| 机制 | 实现方式 | 适用场景 |
|------|---------|---------|
| **目标完成信号** | Agent 输出 `TASK_COMPLETED` 等显式标记 | 主要终止路径 |
| **步骤预算** | 最大迭代次数（如 max_turns=50） | 硬性保险 |
| **Token 预算** | 上下文窗口使用率阈值 | 成本控制 |
| **无进展检测** | 语义相似度检测（Cosine Similarity on embeddings） | 识别循环卡死 |
| **熔断器** | 连续失败 N 次后终止（Circuit Breaker 模式） | 错误隔离 |

防止无限循环的高级策略：
- 强制最终状态：`completed` / `failed` / `needs_human`
- 任务 ID 幂等性：防止重复处理同一任务
- 反递归规则：禁止 Agent 将相同任务反复路由给同一 Sub-agent
- Meta-Agent 监控：独立观察 Agent 检测循环并介入

---

## 三、两者的关系

### 3.1 协作关系

```
┌───────────────────────────────────────────────────────────┐
│                    HARNESS ENGINEERING                     │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                 LOOP ENGINEERING                    │  │
│  │                                                     │  │
│  │  Trigger → [Thought → Action → Observation] → Stop │  │
│  │               ↑__________________________↑          │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  Tool Registry | Permission System | Context Manager      │
│  Hook System   | Session Storage   | MCP Layer            │
│  Observability | Safety Classifier | Compaction Pipeline  │
└───────────────────────────────────────────────────────────┘
```

**Harness** 是基础设施（硬件），**Loop** 是在其上运行的执行模式（软件）。

| 维度 | Harness Engineering | Loop Engineering |
|------|--------------------|--------------------|
| **关注点** | 系统如何被约束和执行 | 系统如何推理和迭代 |
| **核心产物** | 工具注册表、权限规则、Hook | 目标设定、终止条件、状态流 |
| **失败模式** | 权限绕过、上下文漂移、Schema 错误 | 无限循环、卡死、目标漂移 |
| **设计比喻** | 操作系统 | 应用程序 |

### 3.2 三层控制平面

```
Intent Layer（意图层）
  └── CLAUDE.md, system prompts → 塑造意图，无强制力

Harness Layer（Harness 层）
  └── settings.json, hooks, MCP → 控制允许分发的工具调用

Environment Layer（环境层）
  └── OS 用户隔离, 容器, 网络过滤 → 决定实际能完成什么
```

关键洞察："CLAUDE.md 是进入模型上下文的文本，模型通常会遵循它，但背后没有执行层。"

---

## 四、Claude Code 案例解析

Claude Code 是目前最成熟的 Harness + Loop 工程实现之一，经过 VILA-Lab（arxiv 2604.14228）的系统性逆向分析。

### 4.1 架构概览

```
98.4% 基础设施代码 + 1.6% AI 调用代码
"Agent Loop 本身是简单的 while 循环；
 真正的复杂度在于权限门、上下文管理和恢复逻辑。"
```

### 4.2 八大核心 Harness 组件

| 组件 | 功能 |
|------|------|
| **Tool Executor** | 将模型工具请求转为文件系统/Shell/Web 操作 |
| **Permission Manager** | 四种审批模式（默认/自动接受编辑/计划/自动） |
| **Hook System** | 27 个生命周期事件（SessionStart, PreToolUse, PostToolUse 等） |
| **Context Manager** | 管理 200K Token 预算：压缩、缓存、懒加载 |
| **MCP Layer** | 通过 Model Context Protocol 路由第三方工具 |
| **Skill System** | 按需加载的模块化 Markdown 知识包 |
| **Subagent Framework** | 独立模型实例处理并行或专业化任务 |
| **Session Storage** | JSONL 持久化，支持 resume/fork/rewind |

### 4.3 Agentic Loop 实现

```
queryLoop() 异步生成器（query.ts）

每轮 9 步流水线：
设置初始化 → 状态加载 → 上下文组装 → 工具 Schema 注入
  → [五级压缩管道] → 模型调用 → 工具分发 → 权限校验 → 结果追加

五级压缩管道（最便宜优先）：
  Budget Reduction → Snip → Microcompact → Context Collapse → Auto-Compact
```

### 4.4 权限系统（七层独立安全）

```
Deny List → Ask List → Allow List → Default Mode
               ↑
    独立 Safety Classifier（仅看用户请求+工具调用，不看模型推理，防 Prompt Injection）
```

### 4.5 三种部署模式

| 模式 | Harness | 环境 | 适用场景 |
|------|---------|------|---------|
| **Pattern A** | 仅 Harness，每个动作询问 | 裸机 | 生产敏感仓库 |
| **Pattern B** | Harness + 轻量环境（路径黑名单） | 半隔离 | 平衡自主性与安全 |
| **Pattern C** | 完整 Harness + 容器隔离 + 网络过滤 | 沙箱 | 无人值守过夜自主运行 |

---

## 五、系统学习路径

### 阶段一：基础（1-4周）

**目标**：理解 AI Agent 的概念基础

| 内容 | 资源 |
|------|------|
| LLM 基础与 API 使用 | Anthropic / OpenAI 官方文档 |
| ReAct 原始论文 | [react-lm.github.io](https://react-lm.github.io) |
| 链式思考与工具调用 | Claude API Docs: Tool Use |
| 第一个 Agent Demo | LangChain 入门教程 |

### 阶段二：Loop Engineering（4-8周）

**目标**：掌握 Agentic Loop 设计

| 内容 | 资源 |
|------|------|
| ReAct / Reflexion / Tree-of-Thought | 原始论文 + DataScienceDojo 指南 |
| LangGraph 状态图 Agent | LangGraph 官方文档 |
| 终止条件与无限循环防御 | Google ADK Loop Pattern |
| Claude `/goal` 与 `/loop` 命令 | Claude Code 官方文档 |

实践项目：构建一个有明确终止条件的研究 Agent（给定主题，自主搜索→验证→输出报告）

### 阶段三：Harness Engineering（8-16周）

**目标**：掌握 Agent 基础设施构建

| 内容 | 资源 |
|------|------|
| MCP 协议与工具注册 | MCP 官方规范 |
| 权限模型与安全设计 | Claude Code Harness 分析文章 |
| Hook 系统与生命周期事件 | Claude Code 文档：Hooks |
| 上下文管理与压缩策略 | VILA-Lab arxiv 2604.14228 |
| 可观测性：日志、追踪、评估 | OpenTelemetry for AI |

实践项目：为自己的工具链构建一个权限控制的 MCP Server，接入 Claude Code

### 阶段四：多 Agent 系统（16-20周）

**目标**：设计生产级 Multi-Agent 架构

| 内容 | 资源 |
|------|------|
| Supervisor + Sub-agent 模式 | CrewAI / AutoGen 文档 |
| A2A（Agent-to-Agent）协议 | Google A2A 规范 |
| 跨 Agent 状态传递 | LangGraph Multi-Agent |
| 企业级治理与安全 | TRiSM for Agentic AI (arxiv 2506.04133) |

### 核心学习资源清单

**论文**
- ReAct: Synergizing Reasoning and Acting (Yao et al., ICLR 2023)
- Dive into Claude Code (VILA-Lab, arxiv 2604.14228)
- TRiSM for Agentic AI (arxiv 2506.04133)
- Architecting Agentic Communities (arxiv 2601.03624)

**文章与指南**
- Harness Engineering: The Infrastructure Layer（Medium, Vishal Mysore）
- Agent Harness Engineering: The Rise of the AI Control Plane（Medium, Adnan Masood）
- Claude Code Harness & Environment Engineering（hidekazu-konishi.com）
- Loop Engineering: The Quiet Revolution（AlphaMatch Blog）

**官方文档**
- Claude Code 官方文档（code.claude.com）
- Claude Agent SDK: How the agent loop works
- Model Context Protocol 规范
- Google Cloud: Agentic AI Design Patterns

**课程**
- Agentic AI Engineering Masterclass 2026（Udemy）
- The Complete Agentic AI Engineering Course（Udemy）
- Analytics Vidhya: Agentic AI Learning Path

---

## 六、参考资源

| 来源 | 链接 |
|------|------|
| Medium - Harness Engineering（Vishal Mysore） | [链接](https://medium.com/@visrow/harness-engineering-the-infrastructure-layer-that-makes-ai-agents-actually-work-598a279c1c5f) |
| Atlan - What Is Harness Engineering | [链接](https://atlan.com/know/what-is-harness-engineering/) |
| Medium - Agent Harness Control Plane（Adnan Masood） | [链接](https://medium.com/@adnanmasood/agent-harness-engineering-the-rise-of-the-ai-control-plane-938ead884b1d) |
| WaveSpeed - Claude Code Harness Architecture | [链接](https://wavespeed.ai/blog/posts/claude-code-agent-harness-architecture/) |
| hidekazu-konishi - Harness & Environment Engineering | [链接](https://hidekazu-konishi.com/entry/claude_code_harness_and_environment_engineering_guide.html) |
| Pasquale Pillitteri - Claude Code Runtime Architecture | [链接](https://pasqualepillitteri.it/en/news/1892/claude-code-harness-runtime-architecture-2026-guide) |
| VILA-Lab - Dive into Claude Code (arxiv) | [链接](https://arxiv.org/pdf/2604.14228) |
| DataScienceDojo - Agentic Loops Guide | [链接](https://datasciencedojo.com/blog/agentic-loops-explained-from-react-to-loop-engineering-2026-guide/) |
| MindStudio - What Is Loop Engineering | [链接](https://www.mindstudio.ai/blog/what-is-loop-engineering-ai-coding-agents) |
| AlphaMatch - Loop Engineering 2026 | [链接](https://www.alphamatch.ai/blog/loop-engineering-ai-coding-2026) |
| react-lm.github.io - ReAct 原始论文 | [链接](https://react-lm.github.io/) |
| Oracle - What Is the AI Agent Loop | [链接](https://blogs.oracle.com/developers/what-is-the-ai-agent-loop-the-core-architecture-behind-autonomous-ai-systems) |
| DEV Community - Preventing Infinite Loops | [链接](https://dev.to/alessandro_pignati/stop-the-loop-how-to-prevent-infinite-conversations-in-your-ai-agents-ekj) |
| Google Cloud - Agentic AI Design Patterns | [链接](https://docs.cloud.google.com/architecture/choose-design-pattern-agentic-ai-system) |
| MachineLearningMastery - Agentic AI Roadmap | [链接](https://machinelearningmastery.com/the-roadmap-for-mastering-agentic-ai-in-2026/) |
| Shakudo - Enterprise AI Failure Analysis | [链接](https://www.shakudo.io/blog/enterprise-ai-agent-production-failures) |
| GitHub - awesome-harness-engineering | [链接](https://github.com/ai-boost/awesome-harness-engineering) |
| GitHub - Dive-into-Claude-Code | [链接](https://github.com/VILA-Lab/Dive-into-Claude-Code) |

---

> **核心洞察**：Harness Engineering 和 Loop Engineering 是 2026 年 AI Agent 工程的两个核心支柱——前者解决"Agent 在什么约束下运行"，后者解决"Agent 如何自主迭代到达目标"。两者的结合，才构成从 Demo 到生产部署的完整工程能力。
