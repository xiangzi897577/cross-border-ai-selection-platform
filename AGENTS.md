
# AGENTS.md

## 项目名称

跨境电商手机支架选品分析平台  
Cross-border Phone Holder Product Analyzer

## 项目目标

本项目是一个用于暑期前端实习简历的前后端分离项目。开发者已经掌握了js的大部分内容以及react的一部分，开发质量向现代大厂开发看齐。

项目聚焦“手机支架”这个跨境电商轻小件品类，模拟 Amazon 候选商品与 1688 货源数据，通过利润测算、竞争强度评估、物流成本分析、风险等级判断和推荐评分，帮助跨境电商卖家筛选高潜力商品。

目标是在 2026 年 6 月 15 日前完成可展示版本，并用于暑期实习简历和面试讲解。

## 技术栈

### 前端

- React
- Vite
- JavaScript
- React Router
- Recharts
- CSS

### 后端

- Node.js
- Express
- JSON 文件存储

### 数据存储

- server/data/products.json
- server/data/favorites.json

## 不使用的技术

当前版本禁止使用以下内容：

- TypeScript
- 数据库，例如 MySQL、MongoDB、PostgreSQL
- 登录注册
- JWT 鉴权
- 真实爬虫
- 真实 Amazon API
- 真实 1688 API
- 复杂状态管理库，例如 Redux、Zustand
- UI 组件库，例如 Ant Design、Element Plus、Material UI

## 开发边界

1. 每次只完成当天任务，不提前实现后续功能。
2. 只修改与当天任务相关的文件。
3. 不擅自增加新技术栈。
4. 不擅自重构整个项目。
5. 代码要适合 React + Node 学习者的理解。
6. 每次修改后必须说明：
   - 修改了哪些文件
   - 如何运行
   - 如何测试
   - 我需要重点理解哪些代码
7. 如果需要安装依赖，必须先说明原因。
8. 始终保持项目可以运行。
9. 如果发现已有代码问题，优先做最小修复，不做大范围重写。

## 项目核心业务

本项目只聚焦手机支架品类，包括但不限于：

- 桌面手机支架
- 车载手机支架
- 懒人支架
- 折叠手机支架
- 磁吸手机支架
- 直播手机支架
- 平板/手机两用支架
- 可调节铝合金支架

## 核心数据字段

每个商品至少包含以下字段：

- id
- productName
- category
- amazonPrice
- cost1688
- shippingCost
- platformFeeRate
- estimatedMonthlySales
- rating
- reviewCount
- competitionScore
- weight
- volumeLevel
- material
- supplier
- image
- tags
- riskFactors
- recommendationReason

## 核心计算逻辑

需要实现以下计算：

- 预估销售收入
- 平台手续费
- 单件利润
- 利润率
- 竞争强度等级
- 风险等级
- 推荐评分
- 高潜力商品判断

## 页面结构

前端需要包含以下页面：

1. Dashboard 首页数据看板
2. Products 商品列表页
3. Product Detail 商品详情页
4. Analysis 选品分析页
5. Favorites 候选池页面

## 接口设计

后端至少实现以下接口：

- GET /api/health
- GET /api/products
- GET /api/products/:id
- GET /api/dashboard
- GET /api/favorites
- POST /api/favorites
- DELETE /api/favorites/:id

## 代码风格

1. 文件名使用清晰语义。
2. 组件名使用大驼峰命名。
3. 工具函数放到 utils 目录。
4. API 请求函数放到 services 目录。
5. 不在页面组件里堆太多业务计算逻辑。
6. 能抽离的计算逻辑尽量放到 utils 中。
7. CSS 类名要语义化。

## 每次开发完成后的输出格式

每次完成任务后，请输出：

1. 本次完成内容
2. 修改文件列表
3. 运行方式
4. 测试方式
5. 今日重点理解知识点
6. 是否更新 DAILY_LOG.md
