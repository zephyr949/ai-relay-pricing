# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 + TypeScript pricing page template for API services, built with Vite and Tailwind CSS. The application displays configurable pricing plans with multi-language support (Chinese/English) and WeChat contact integration.

## Key Commands

```bash
# Development
pnpm dev                    # Start dev server on port 3000
pnpm build                  # Build for production  
pnpm build:check           # Build with TypeScript checking
pnpm preview               # Preview production build

# Environment setup
cp .env.example .env       # Create local environment file
```

## Architecture

### Environment-Driven Configuration
- All content is configurable via environment variables (no hardcoded pricing/content)
- `useEnvConfig.ts` composable centralizes environment variable access
- Plans, pricing, features, and contact info are dynamically generated from env vars
- Environment variables follow pattern: `VITE_[SECTION]_[ITEM]_[PROPERTY]`

### Multi-language System
- Uses Vue i18n with reactive language switching
- Language files in `public/locales/` (en.json, zh.json)
- `useI18n.ts` composable provides reactive translations
- Global language state shared across components

### Key Composables
- `useEnvConfig`: Environment variable access and plan generation
- `useI18n`: Internationalization with reactive language switching  
- `useCurrency`: Currency formatting based on environment settings

### Routing Structure
- `/` - Main pricing page (`PricingPage.vue`)
- `/purchase/:planId` - Individual plan purchase page (`PurchasePage.vue`)

### Component Architecture
- `PricingCard.vue`: Reusable pricing plan display component
- `LanguageSwitch.vue`: Global language toggle component
- `CodeBlock.vue`: Syntax-highlighted code display (currently unused)

### Data Flow
1. Environment variables define all configurable content
2. `useEnvConfig` transforms env vars into typed plan objects
3. Components consume reactive config via composables
4. Multi-language content resolved through i18n keys

## Important Notes

- **Server port is 3000, not 5173** - when using Playwright MCP for testing, check if pages are already open to avoid duplicates
- **Sensitive information check**: Always verify commits don't contain sensitive data before submitting
- The `.env` file contains actual configuration and is gitignored
- Plans are generated dynamically from environment variables, not hardcoded
- All text content should be internationalized through language files