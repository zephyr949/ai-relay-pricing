# AI Relay 定价页面

<div align="center">
  <h3>一个优雅的 API 定价展示页面</h3>
  <p>基于 Vue 3 + TypeScript + Tailwind CSS 构建</p>
  
  [English](./README.en.md) | 简体中文
  
  [在线演示](https://ai-relay-pricing.vercel.app/)
</div>

## ✨ 特性

- 🎨 **现代化设计** - 采用 Linear 设计风格，简洁优雅
- 🌍 **多语言支持** - 内置中英文切换，易于扩展
- 📱 **响应式布局** - 完美适配桌面端和移动端
- ⚡ **极速开发** - 基于 Vite，享受闪电般的开发体验
- 🔧 **灵活配置** - 通过环境变量轻松定制内容
- 💳 **支付集成** - 支持微信支付接入
- 🎯 **类型安全** - 使用 TypeScript 编写，类型完备

## 🖼️ 预览

### 📱 在线演示
- **Demo**: [ai-relay-pricing-demo.vercel.app](https://ai-relay-pricing.vercel.app)

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0 (推荐) 或 npm/yarn

### 安装

```bash
# 克隆项目
git clone https://github.com/zephyrcicd/ai-relay-pricing.git
cd ai-relay-pricing

# 安装依赖
pnpm install

# 复制环境变量文件
cp .env.example .env

# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000 查看页面

### 构建部署

```bash
# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 📦 项目结构

```
ai-relay-pricing/
├── docs/                 # 项目文档
├── public/              
│   ├── locales/         # 多语言文件
│   └── images/          # 静态图片
├── src/
│   ├── components/      # Vue 组件
│   ├── composables/     # 组合式函数
│   ├── pages/          # 页面组件
│   ├── router/         # 路由配置
│   ├── styles/         # 样式文件
│   ├── types/          # TypeScript 类型
│   └── utils/          # 工具函数
├── .env.example        # 环境变量示例
├── package.json        
└── README.md
```

## ⚙️ 配置说明

### 环境变量

复制并编辑环境变量文件：

```bash
cp .env.example .env
```

根据需要修改 `.env` 文件中的配置项。所有配置项均已在示例文件中注释说明。

### 多语言配置

语言文件位于 `public/locales/` 目录：

- `en.json` - 英文语言包
- `zh.json` - 中文语言包

添加新语言只需创建对应的 JSON 文件即可。

## 🛠️ 技术栈

- **框架:** [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- **语言:** [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- **样式:** [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架
- **构建:** [Vite](https://vitejs.dev/) - 下一代前端构建工具
- **路由:** [Vue Router](https://router.vuejs.org/) - Vue.js 官方路由
- **UI组件:** [Headless UI](https://headlessui.dev/) - 无样式组件库


## 🚢 部署

### 快速部署（推荐）

使用 Vercel CLI 5分钟完成部署：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 执行部署
vercel

# 部署到生产环境  
vercel --prod
```


### Vercel 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zephyrcicd/ai-relay-pricing)

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/zephyrcicd/ai-relay-pricing)

### 其他部署方式


## 🤝 贡献

欢迎贡献代码！请查看 [贡献指南](./CONTRIBUTING.md) 了解详情。

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📝 提交规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档变更
- `style:` 代码格式（不影响代码运行的变动）
- `refactor:` 重构
- `perf:` 性能优化
- `test:` 增加测试
- `chore:` 构建过程或辅助工具的变动

## ⚠️ 免责声明

本项目是一个开源的定价页面模板，仅供学习和参考使用。

**重要提示：**
- 本项目与 Anthropic 或 Claude AI 没有官方关联
- 本项目不提供实际的 API 服务或支付处理功能
- **本项目代码基于 AI (Claude) 生成，本人不对代码内容负责**
- 用户需要自行实现后端服务和支付系统
- 使用本模板产生的任何后果由使用者自行承担
- 维护者不对模板的任何误用承担责任

**使用指南：**
- 如使用任何第三方商标或服务，请确保已获得适当授权
- 生产部署时请实施适当的安全措施
- API 通信必须使用 HTTPS
- 切勿在前端代码中存储敏感信息
- 遵循处理用户数据和支付的最佳实践
- **使用前请自行审查和测试所有代码**

## 📄 开源协议

本项目基于 [MIT](./LICENSE) 协议开源。

MIT License

Copyright (c) 2024 ai-relay-pricing contributors

详细协议内容请查看 [LICENSE](./LICENSE) 文件。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 提供强大的前端框架
- [Tailwind CSS](https://tailwindcss.com/) - 提供优秀的样式系统
- [Linear](https://linear.app/) - 设计灵感来源
- [Vite](https://vitejs.dev/) - 提供极速的开发体验

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=zephyrcicd/ai-relay-pricing&type=Date)](https://star-history.com/#zephyrcicd/ai-relay-pricing&Date)

---

<div align="center">
  如果这个项目对你有帮助，请给一个 ⭐️ Star！
</div>