# Vercel 环境变量同步工具

这个工具可以帮助你轻松管理 Vercel 项目的环境变量，支持增量更新而不需要每次都删除重建所有变量。

## ✨ 特性

- 🔄 **增量同步** - 智能比较本地和远程环境变量，只更新变化的部分
- 🎯 **多环境支持** - 支持 development、preview、production 环境
- 🎨 **友好界面** - 彩色输出和详细的变更摘要
- ⚡ **批量操作** - 支持一次性同步所有环境
- 🛡️ **安全确认** - 更新前需要用户确认（可通过参数跳过）

## 📦 安装要求

确保你已经安装了：

1. **Node.js** (版本 14+)
2. **Vercel CLI** 
   ```bash
   npm install -g vercel
   ```
3. **已登录 Vercel CLI**
   ```bash
   vercel login
   ```
4. **项目已链接到 Vercel**
   ```bash
   vercel link
   ```

## 🚀 使用方法

### 基本用法

```bash
# 同步到 development 环境（默认）
npm run env:sync

# 同步到指定环境
npm run env:sync:dev      # development 环境
npm run env:sync:preview  # preview 环境  
npm run env:sync:prod     # production 环境
npm run env:sync:all      # 所有环境

# 查看帮助信息
npm run env:help
```

### 高级用法

```bash
# 直接使用脚本
node scripts/sync-env.js [环境] [选项]

# 跳过确认直接应用变更
node scripts/sync-env.js prod --force

# 同步所有环境并跳过确认
node scripts/sync-env.js all --force
```

## 📋 支持的环境

| 环境名 | 别名 | 说明 |
|-------|------|------|
| `development` | `dev` | 开发环境 |
| `preview` | - | 预览环境 |
| `production` | `prod` | 生产环境 |
| `all` | - | 所有环境 |

## 🎨 使用示例

### 1. 首次同步

```bash
$ npm run env:sync:dev

🚀 开始同步环境变量到 Vercel

ℹ 解析本地 .env 文件...
✓ 发现 8 个本地环境变量

📝 处理 DEVELOPMENT 环境

ℹ 获取 development 环境的远程变量...
✓ 发现 3 个远程环境变量

==================================================
环境变量变更摘要
==================================================

新增变量 (5个):
  + VITE_API_URL = "https://api.example.com"
  + VITE_APP_NAME = "AI Relay Pricing"
  + DATABASE_URL = "postgresql://..."
  + REDIS_URL = "redis://..."
  + SECRET_KEY = "super-secret-key"

确定要将这些变更应用到 development 环境吗? (y/n): y

ℹ 添加变量: VITE_API_URL
ℹ 添加变量: VITE_APP_NAME
ℹ 添加变量: DATABASE_URL
ℹ 添加变量: REDIS_URL
ℹ 添加变量: SECRET_KEY
✓ 环境变量同步完成!

🎉 所有环境变量同步完成!
```

### 2. 删除变量示例

```bash
$ npm run env:sync:prod

🚀 开始同步环境变量到 Vercel

ℹ 解析本地 .env 文件...
✓ 发现 8 个本地环境变量

📝 处理 PRODUCTION 环境

ℹ 获取 production 环境的远程变量...
✓ 发现 9 个远程环境变量

==================================================
环境变量变更摘要
==================================================

删除变量 (1个):
  - DEPRECATED_VAR = "[ENCRYPTED]"

确定要将这些变更应用到 production 环境吗? (y/n): y

⚠ 删除变量: DEPRECATED_VAR
✓ 环境变量同步完成!

🎉 所有环境变量同步完成!
```

### 3. 无变更情况

```bash
$ npm run env:sync

🚀 开始同步环境变量到 Vercel

ℹ 解析本地 .env 文件...
✓ 发现 8 个本地环境变量

📝 处理 DEVELOPMENT 环境

ℹ 获取 development 环境的远程变量...
✓ 发现 8 个远程环境变量

==================================================
环境变量变更摘要
==================================================

✨ 环境变量已是最新状态，无需更新

🎉 所有环境变量同步完成!
```

## 📁 文件结构

```
项目根目录/
├── .env                           # 本地环境变量文件
├── scripts/
│   └── sync-env.js               # 主同步脚本
└── package.json                  # npm scripts 配置
```

## ⚙️ 配置选项

### 命令行参数

| 参数 | 简写 | 说明 |
|------|------|------|
| `--force` | `-f` | 跳过确认直接应用变更 |
| `--help` | `-h` | 显示帮助信息 |

### 环境变量格式

工具支持标准的 `.env` 文件格式：

```bash
# 注释会被忽略
VITE_API_URL=https://api.example.com
VITE_APP_NAME="AI Relay Pricing"
DATABASE_URL='postgresql://user:pass@host:5432/db'

# 支持多行值
PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB
-----END PRIVATE KEY-----"
```

## 🛡️ 安全注意事项

1. **权限控制** - 确保只有授权人员能访问 Vercel 项目
2. **环境隔离** - 不同环境使用不同的敏感值（如 API 密钥、数据库连接等）

**注意**：由于 Vercel 环境变量是加密存储的，工具只能基于变量名进行同步，无法比较实际值。

## 🔧 故障排除

### 常见问题

**1. "vercel: command not found"**
```bash
# 安装 Vercel CLI
npm install -g vercel
```

**2. "Error: Not authorized"**
```bash
# 重新登录 Vercel
vercel logout
vercel login
```

**3. "Error: Project not linked"**
```bash
# 链接项目到 Vercel
vercel link
```

**4. ".env 文件不存在"**
```bash
# 确保项目根目录有 .env 文件
cp .env.example .env
# 然后编辑 .env 文件
```

### 调试模式

如需查看详细的执行日志，可以直接运行脚本：

```bash
node scripts/sync-env.js dev --force
```

## 🚀 最佳实践

1. **环境分离** - 不同环境使用不同的配置值
2. **版本控制** - 将环境变量的变更记录在版本控制中（不包含敏感值）
3. **测试流程** - 先在 development 环境测试，再推送到 production
4. **敏感信息** - 对于极其敏感的信息，考虑使用 Vercel 的项目设置页面手动管理

## 📝 更新日志

### v1.0.0 (2024-01-15)
- ✨ 初始版本发布
- 🔄 支持增量同步环境变量
- 🎨 友好的命令行界面
- 🛡️ 安全确认机制
- 🔧 智能错误处理

---

## 🤝 贡献

如果你发现问题或有改进建议，欢迎提交 Issue 或 Pull Request！