#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`${colors.bright}${colors.blue}${msg}${colors.reset}`)
};

class VercelEnvSync {
  constructor() {
    this.envFile = path.join(process.cwd(), '.env');
    this.environments = ['development', 'preview', 'production'];
  }

  // 解析.env文件
  parseEnvFile(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`环境变量文件不存在: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const variables = {};

    content.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          let value = valueParts.join('=');
          // 移除引号
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          variables[key.trim()] = value;
        }
      }
    });

    return variables;
  }

  // 获取远程环境变量
  getRemoteEnvVars(environment) {
    try {
      log.info(`获取 ${environment} 环境的远程变量...`);
      const output = execSync(`vercel env ls ${environment}`, { 
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      const variables = {};
      const lines = output.split('\n');
      
      // 解析表格格式输出
      for (const line of lines) {
        // 跳过标题行和空行
        if (line.includes('name') && line.includes('value') && line.includes('environments')) {
          continue;
        }
        if (line.includes('Vercel CLI') || line.includes('Retrieving project') || 
            line.includes('Environment Variables found') || line.trim() === '') {
          continue;
        }
        
        // 解析变量行
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('>')) {
          // 使用正则表达式解析表格行
          const match = trimmedLine.match(/^(\S+)\s+(\S+)\s+(\S+)\s+(.+)$/);
          if (match) {
            const [, name, value, env] = match;
            // 对于加密值，我们无法获取实际值，只能记录变量存在
            variables[name] = value === 'Encrypted' ? '[ENCRYPTED]' : value;
          }
        }
      }
      
      return variables;
    } catch (error) {
      log.error(`获取远程环境变量失败: ${error.message}`);
      return {};
    }
  }

  // 比较环境变量差异
  compareEnvVars(localVars, remoteVars, options = {}) {
    const toAdd = {};
    const toUpdate = {};
    const toRemove = {};

    // 检查需要添加的变量
    Object.keys(localVars).forEach(key => {
      if (!(key in remoteVars)) {
        toAdd[key] = localVars[key];
      }
    });

    // 检查需要删除的变量（远程有但本地没有）
    Object.keys(remoteVars).forEach(key => {
      if (!(key in localVars)) {
        toRemove[key] = remoteVars[key];
      }
    });

    // 注意：由于Vercel环境变量是加密的，我们无法比较实际值
    // 只能基于变量名存在性进行同步
    
    return { toAdd, toUpdate, toRemove };
  }

  // 显示变更摘要
  showChangeSummary(changes) {
    const { toAdd, toUpdate, toRemove } = changes;
    
    console.log('\n' + '='.repeat(50));
    log.title('环境变量变更摘要');
    console.log('='.repeat(50));

    if (Object.keys(toAdd).length > 0) {
      log.success(`\n新增变量 (${Object.keys(toAdd).length}个):`);
      Object.keys(toAdd).forEach(key => {
        console.log(`  + ${colors.green}${key}${colors.reset} = "${toAdd[key]}"`);
      });
    }

    if (Object.keys(toUpdate).length > 0) {
      log.warning(`\n更新变量 (${Object.keys(toUpdate).length}个):`);
      Object.keys(toUpdate).forEach(key => {
        console.log(`  ~ ${colors.yellow}${key}${colors.reset}`);
        console.log(`    - "${toUpdate[key].old}"`);
        console.log(`    + "${toUpdate[key].new}"`);
      });
    }

    if (Object.keys(toRemove).length > 0) {
      log.error(`\n删除变量 (${Object.keys(toRemove).length}个):`);
      Object.keys(toRemove).forEach(key => {
        console.log(`  - ${colors.red}${key}${colors.reset} = "${toRemove[key]}"`);
      });
    }

    if (Object.keys(toAdd).length === 0 && 
        Object.keys(toUpdate).length === 0 && 
        Object.keys(toRemove).length === 0) {
      log.success('\n✨ 环境变量已是最新状态，无需更新');
      return false;
    }

    return true;
  }

  // 应用变更
  async applyChanges(environment, changes) {
    const { toAdd, toUpdate, toRemove } = changes;

    try {
      // 添加新变量
      for (const [key, value] of Object.entries(toAdd)) {
        log.info(`添加变量: ${key}`);
        try {
          execSync(`vercel env add ${key} ${environment}`, {
            input: value,
            stdio: ['pipe', 'pipe', 'pipe']
          });
        } catch (error) {
          if (error.message.includes('already exists')) {
            log.warning(`变量 ${key} 已存在，跳过添加`);
          } else {
            throw error;
          }
        }
      }

      // 更新现有变量
      for (const [key, change] of Object.entries(toUpdate)) {
        log.info(`更新变量: ${key}`);
        try {
          // 先删除旧值
          execSync(`vercel env rm ${key} ${environment} --yes`, {
            stdio: ['pipe', 'pipe', 'pipe']
          });
          // 再添加新值
          execSync(`vercel env add ${key} ${environment}`, {
            input: change.new,
            stdio: ['pipe', 'pipe', 'pipe']
          });
        } catch (error) {
          log.error(`更新变量 ${key} 失败: ${error.message}`);
        }
      }

      // 删除不存在的变量
      for (const key of Object.keys(toRemove)) {
        log.warning(`删除变量: ${key}`);
        try {
          execSync(`vercel env rm ${key} ${environment} --yes`, {
            stdio: ['pipe', 'pipe', 'pipe']
          });
        } catch (error) {
          log.error(`删除变量 ${key} 失败: ${error.message}`);
        }
      }

      log.success(`环境变量同步完成!`);
    } catch (error) {
      log.error(`应用变更失败: ${error.message}`);
      throw error;
    }
  }

  // 确认操作
  askConfirmation(message) {
    return new Promise(async (resolve) => {
      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question(`\n${message} (y/n): `, (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
      });
    });
  }

  // 主同步方法
  async sync(targetEnvironments = ['development'], options = {}) {
    try {
      log.title(`🚀 开始同步环境变量到 Vercel`);
      
      // 解析本地环境变量
      log.info('解析本地 .env 文件...');
      const localVars = this.parseEnvFile(this.envFile);
      log.success(`发现 ${Object.keys(localVars).length} 个本地环境变量`);

      for (const environment of targetEnvironments) {
        log.title(`\n📝 处理 ${environment.toUpperCase()} 环境`);
        
        // 获取远程环境变量
        const remoteVars = this.getRemoteEnvVars(environment);
        log.success(`发现 ${Object.keys(remoteVars).length} 个远程环境变量`);

        // 比较差异
        const changes = this.compareEnvVars(localVars, remoteVars);
        
        // 显示变更摘要
        const hasChanges = this.showChangeSummary(changes);
        
        if (!hasChanges) {
          continue;
        }

        // 确认应用变更
        if (!options.force) {
          const confirmed = await this.askConfirmation(
            `确定要将这些变更应用到 ${environment} 环境吗?`
          );
          
          if (!confirmed) {
            log.warning('跳过此环境的变更');
            continue;
          }
        }

        // 应用变更
        await this.applyChanges(environment, changes);
      }

      log.title('\n🎉 所有环境变量同步完成!');
      
    } catch (error) {
      log.error(`同步失败: ${error.message}`);
      process.exit(1);
    }
  }
}

// CLI 入口
async function main() {
  const args = process.argv.slice(2);
  const options = {
    force: args.includes('--force') || args.includes('-f'),
    help: args.includes('--help') || args.includes('-h')
  };

  if (options.help) {
    console.log(`
Vercel 环境变量同步工具

用法:
  node scripts/sync-env.js [环境] [选项]

环境:
  dev, development    同步到 development 环境
  preview            同步到 preview 环境  
  prod, production   同步到 production 环境
  all               同步到所有环境

选项:
  --force, -f        跳过确认直接应用变更
  --help, -h         显示此帮助信息

示例:
  node scripts/sync-env.js dev
  node scripts/sync-env.js prod --force
  node scripts/sync-env.js all
`);
    return;
  }

  // 解析目标环境
  let targetEnvironments = ['development']; // 默认环境
  
  const envArg = args.find(arg => !arg.startsWith('--'));
  if (envArg) {
    switch (envArg.toLowerCase()) {
      case 'dev':
      case 'development':
        targetEnvironments = ['development'];
        break;
      case 'preview':
        targetEnvironments = ['preview'];
        break;
      case 'prod':
      case 'production':
        targetEnvironments = ['production'];
        break;
      case 'all':
        targetEnvironments = ['development', 'preview', 'production'];
        break;
      default:
        log.error(`未知环境: ${envArg}`);
        log.info('支持的环境: dev, preview, prod, all');
        process.exit(1);
    }
  }

  const syncer = new VercelEnvSync();
  await syncer.sync(targetEnvironments, options);
}

// 错误处理
process.on('unhandledRejection', (reason, promise) => {
  log.error(`未处理的 Promise 拒绝: ${reason}`);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  log.error(`未捕获的异常: ${error.message}`);
  process.exit(1);
});

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default VercelEnvSync;