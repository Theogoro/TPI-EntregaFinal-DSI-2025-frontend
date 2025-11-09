# 🔧 Environment Configuration

## Overview

The application uses environment variables to configure the backend API URL. This allows you to easily switch between development, staging, and production environments.

## Files

- **`.env`** - Your local environment configuration (not committed to git)
- **`.env.example`** - Template file showing all available variables
- **`src/vite-env.d.ts`** - TypeScript definitions for environment variables

## Available Variables

### `VITE_API_BASE_URL`

The base URL for the backend API.

- **Default**: `http://localhost:8080`
- **Example**: `http://localhost:8080`, `https://api.seismic-events.com`

## Setup

### 1. Create your `.env` file

Copy the example file:

```bash
cp .env.example .env
```

Or create manually:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 2. Configure for your environment

**Development (default):**
```env
VITE_API_BASE_URL=http://localhost:8080
```

**Production:**
```env
VITE_API_BASE_URL=https://api.your-domain.com
```

**Custom port:**
```env
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Restart the development server

After changing `.env`, restart the dev server:

```bash
npm run dev
```

## Important Notes

⚠️ **Vite Environment Variables:**
- Variables must be prefixed with `VITE_` to be exposed to the client
- Changes require restarting the dev server
- `.env` files are loaded automatically by Vite

⚠️ **Security:**
- `.env` is in `.gitignore` and won't be committed
- Only commit `.env.example` as a template
- Never commit sensitive credentials

⚠️ **Type Safety:**
- Environment variables are typed in `src/vite-env.d.ts`
- TypeScript will provide autocomplete and type checking

## Usage in Code

The environment variable is already configured in `src/services/api.ts`:

```typescript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
```

**Fallback:** If `VITE_API_BASE_URL` is not set, it defaults to `http://localhost:8080`.

## Testing Different Environments

### Test with local backend
```env
VITE_API_BASE_URL=http://localhost:8080
```

### Test with remote backend
```env
VITE_API_BASE_URL=https://api.example.com
```

### Test with different port
```env
VITE_API_BASE_URL=http://localhost:3000
```

## Troubleshooting

### Variable not working?

1. **Check the prefix**: Must start with `VITE_`
2. **Restart dev server**: Changes require restart
3. **Check syntax**: No spaces around `=`

```env
# ✓ Correct
VITE_API_BASE_URL=http://localhost:8080

# ✗ Wrong (spaces)
VITE_API_BASE_URL = http://localhost:8080
```

### Backend connection issues?

1. Verify backend is running
2. Check the URL in `.env` is correct
3. Check for CORS configuration
4. Verify no trailing slash:

```env
# ✓ Correct
VITE_API_BASE_URL=http://localhost:8080

# ✗ Wrong (trailing slash)
VITE_API_BASE_URL=http://localhost:8080/
```

## Build for Production

When building for production, Vite will inline the environment variables:

```bash
npm run build
```

For different environments:

```bash
# Development build
npm run build

# Production with custom env
VITE_API_BASE_URL=https://api.prod.com npm run build
```

## Multiple Environments

You can create environment-specific files:

- `.env.local` - Local overrides (not committed)
- `.env.development` - Development environment
- `.env.production` - Production environment

**Load priority:**
1. `.env.local`
2. `.env.[mode]`
3. `.env`

## Examples

### Development Team
```env
# .env
VITE_API_BASE_URL=http://localhost:8080
```

### Staging Server
```env
# .env.staging
VITE_API_BASE_URL=https://staging-api.seismic-events.com
```

### Production Server
```env
# .env.production
VITE_API_BASE_URL=https://api.seismic-events.com
```

## Quick Reference

| File | Purpose | Committed? |
|------|---------|------------|
| `.env` | Local configuration | ❌ No |
| `.env.example` | Template/documentation | ✅ Yes |
| `.env.local` | Local overrides | ❌ No |
| `src/vite-env.d.ts` | TypeScript types | ✅ Yes |

---

**Need help?** Check [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
