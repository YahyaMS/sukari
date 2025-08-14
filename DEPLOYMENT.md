# MetaReverse Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables
Ensure all required environment variables are set in your Vercel project:

**Required:**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` 
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `BLOB_READ_WRITE_TOKEN`
- `DEEPSEEK_API_KEY`

**Production-specific:**
- `NEXT_PUBLIC_APP_URL` (your production domain)
- `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
- `ENCRYPTION_KEY` (32-character key for data encryption)

### 2. Database Setup
Run the RLS policies script in your Supabase project:
\`\`\`sql
-- Execute scripts/enable-rls-policies.sql in Supabase SQL editor
\`\`\`

### 3. Domain Configuration
1. Add your custom domain in Vercel dashboard
2. Configure DNS records
3. Enable SSL certificate
4. Update `NEXT_PUBLIC_APP_URL` environment variable

### 4. Security Configuration
1. Review CSP headers in `next.config.mjs`
2. Configure CORS settings for your domain
3. Enable rate limiting in Vercel dashboard
4. Set up monitoring alerts

### 5. Performance Optimization
1. Enable image optimization
2. Configure CDN settings
3. Set up bundle analysis: `ANALYZE=true npm run build`
4. Review Core Web Vitals

## Deployment Steps

### 1. Deploy to Vercel
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
\`\`\`

### 2. Post-Deployment Verification
1. Check health endpoint: `https://your-domain.com/health`
2. Verify all integrations are working
3. Test user registration and login flows
4. Verify file upload functionality
5. Check analytics and monitoring

### 3. Monitoring Setup
1. Configure error alerts in Vercel dashboard
2. Set up uptime monitoring
3. Enable performance monitoring
4. Configure log retention

## Production Maintenance

### Daily Tasks
- Monitor system health dashboard
- Review error logs
- Check performance metrics

### Weekly Tasks  
- Review user analytics
- Update dependencies
- Backup database

### Monthly Tasks
- Security audit
- Performance optimization review
- User feedback analysis

## Troubleshooting

### Common Issues
1. **Database Connection Errors**: Check RLS policies and environment variables
2. **Image Upload Failures**: Verify Blob storage configuration
3. **Authentication Issues**: Check Supabase auth settings and redirect URLs
4. **Performance Issues**: Review bundle size and optimize images

### Emergency Procedures
1. **Rollback**: Use Vercel dashboard to rollback to previous deployment
2. **Database Issues**: Check Supabase dashboard and logs
3. **Critical Errors**: Monitor error reporting service and fix immediately

## Security Considerations

### HIPAA Compliance
- All health data is encrypted at rest and in transit
- RLS policies prevent unauthorized data access
- Audit logs track all data access
- Regular security reviews and updates

### Data Privacy
- No PII in analytics or logs
- User consent for data collection
- Right to data deletion
- Regular privacy policy updates
