# Environment Variables Guide

This document explains all environment variables used in the MetaReverse Health App.

## Quick Setup

1. Copy the example file:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. Fill in the required values (see sections below)

3. Test your configuration:
   \`\`\`bash
   curl http://localhost:3000/api/health/env
   \`\`\`

## Required Variables

### Supabase Database
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
\`\`\`

**How to get these:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Add Supabase integration to your project
3. Values will be automatically added

### AI API Keys
At least one is required for AI features:

\`\`\`env
DEEPSEEK_API_KEY=your-deepseek-api-key
GOOGLE_GENERATIVE_AI_API_KEY=your-google-gemini-api-key
\`\`\`

**How to get these:**
- **DeepSeek**: Sign up at [DeepSeek Platform](https://platform.deepseek.com/)
- **Google Gemini**: Get key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Blob Storage
\`\`\`env
BLOB_READ_WRITE_TOKEN=your-blob-token
\`\`\`

**How to get this:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Add Blob integration to your project
3. Token will be automatically added

## Optional Variables

### Development
\`\`\`env
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

### Production
\`\`\`env
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
\`\`\`

## Auto-Configured Variables

These are automatically set by Vercel integrations:

### Database (Neon/Supabase)
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`
- `POSTGRES_HOST`

### Neon Specific
- `NEON_NEON_DATABASE_URL`
- `NEON_POSTGRES_URL`
- And other Neon-specific variables

## Validation

The app includes built-in environment validation:

- **Startup validation**: Checks required variables when the app starts
- **Health endpoint**: Visit `/api/health/env` to check configuration
- **Helpful errors**: Clear messages when variables are missing

## Troubleshooting

### Missing Variables Error
If you see environment validation errors:

1. Check your `.env.local` file exists
2. Compare with `.env.example`
3. Restart your development server
4. Check the health endpoint: `http://localhost:3000/api/health/env`

### Integration Issues
If integrations aren't working:

1. Verify integrations are added in Vercel dashboard
2. Check that environment variables are set in Vercel project settings
3. Redeploy your application

### AI Features Not Working
If AI features are unavailable:

1. Ensure at least one AI API key is set
2. Check API key validity
3. Verify API quotas/billing

## Security Notes

- Never commit `.env.local` or `.env` files
- Use different keys for development and production
- Rotate API keys regularly
- Monitor API usage and costs

## Development vs Production

| Variable | Development | Production |
|----------|-------------|------------|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Your domain |
| `NEXT_PUBLIC_APP_URL` | Not needed | Required |
| `NODE_ENV` | `development` | `production` |

The app automatically detects the environment and uses appropriate defaults.
