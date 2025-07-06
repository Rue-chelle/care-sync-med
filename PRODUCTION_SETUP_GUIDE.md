
# AloraMed Production Setup Guide

## 🚀 Production Deployment Checklist

### 1. Email Configuration Setup

#### Supabase Email Settings
1. Go to your Supabase Dashboard → Authentication → Settings
2. Configure SMTP settings:
   - **SMTP Host**: Your email provider's SMTP server
   - **SMTP Port**: Usually 587 for TLS or 465 for SSL
   - **SMTP User**: Your email address or username
   - **SMTP Password**: Your email password or app-specific password
   - **Sender Email**: The "from" email address for system emails

#### Recommended Email Providers
- **SendGrid**: Enterprise-grade email delivery
- **AWS SES**: Cost-effective for high volume
- **Mailgun**: Developer-friendly with good deliverability
- **Gmail SMTP**: For development/testing only

### 2. Domain & SSL Configuration

#### Custom Domain Setup
1. **Purchase your domain** (e.g., aloramedapp.com)
2. **Configure DNS**:
   - Add CNAME record pointing to your Lovable app
   - Example: `CNAME www your-app.lovable.app`
3. **SSL Certificate**: Automatically provided by Lovable
4. **Verify domain** in Lovable project settings

#### Supabase URL Configuration
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Set **Site URL**: `https://your-domain.com`
3. Add **Redirect URLs**:
   - `https://your-domain.com/auth`
   - `https://your-domain.com/auth?confirmed=true`
   - `https://your-domain.com/auth?reset=true`

### 3. Security Configuration

#### Authentication Settings
- Enable email confirmation for new users
- Set session timeout (recommended: 24 hours)
- Configure password requirements
- Enable 2FA for admin accounts

#### CORS Configuration
Update allowed origins in your Supabase project to include your production domain.

### 4. Environment Configuration

#### Update Production URLs
In `src/config/production.ts`:
```typescript
PRODUCTION_DOMAIN: "https://your-actual-domain.com",
STAGING_DOMAIN: "https://staging.your-domain.com",
```

#### Switch to Production Environment
Users can switch environments by setting:
```javascript
localStorage.setItem('env', 'production');
```

### 5. Monitoring & Backup Setup

#### Error Monitoring (Optional Integrations)
- **Sentry**: Real-time error tracking
- **LogRocket**: Session replay and monitoring
- **Custom API**: Send errors to your own monitoring service

#### Database Backups
- Supabase automatically creates daily backups
- Access backups: Supabase Dashboard → Database → Backups
- Set up backup monitoring alerts

#### Performance Monitoring
- Monitor API response times
- Track user engagement metrics
- Set up uptime monitoring

### 6. Production Security Checklist

#### Database Security
- ✅ Row Level Security (RLS) policies are active
- ✅ API keys are properly secured
- ✅ No sensitive data in client-side code
- ✅ Proper user role validation

#### Application Security
- ✅ HTTPS enforced
- ✅ Secure headers configured
- ✅ Input validation in place
- ✅ Rate limiting configured

### 7. Super Admin Account Creation

#### Method 1: Direct Database Insert
```sql
-- Insert into auth.users (handled by Supabase Auth)
-- Then insert into your super_admins table:
INSERT INTO public.super_admins (user_id, email, full_name)
VALUES ('your-auth-user-id', 'admin@yourdomain.com', 'Super Administrator');
```

#### Method 2: Through Supabase Dashboard
1. Go to Authentication → Users
2. Create new user with admin email
3. Note the user ID
4. Insert into super_admins table using SQL editor

### 8. Demo Mode Configuration

#### Current Demo Credentials (Keep for Testing)
- Patient: `patient@aloramedapp.com` / `password123`
- Doctor: `doctor@aloramedapp.com` / `password123`
- Admin: `admin@aloramedapp.com` / `password123`
- Super Admin: `superadmin@aloramedapp.com` / `password123`

#### Demo User Features
- ✅ Warning banner for demo users
- ✅ Limited functionality where appropriate
- ✅ Separate demo data from production data
- ✅ Easy identification of demo accounts

### 9. Performance Optimization

#### Database Optimization
- Add indexes for frequently queried columns
- Monitor slow queries
- Set up connection pooling
- Regular database maintenance

#### Frontend Optimization
- Enable CDN for static assets
- Optimize image loading
- Implement proper caching strategies
- Monitor Core Web Vitals

### 10. Going Live Checklist

#### Pre-Launch Testing
- [ ] Test all user registration flows
- [ ] Verify email confirmation works
- [ ] Test password reset functionality
- [ ] Validate all user roles and permissions
- [ ] Test payment processing (if applicable)
- [ ] Verify SSL certificate is active
- [ ] Test on multiple devices and browsers

#### Launch Day
- [ ] Update DNS records to point to production
- [ ] Monitor error logs closely
- [ ] Have rollback plan ready
- [ ] Monitor server performance
- [ ] Check email deliverability
- [ ] Verify all integrations work

#### Post-Launch
- [ ] Set up monitoring alerts
- [ ] Regular security audits
- [ ] Monitor user feedback
- [ ] Performance optimization
- [ ] Regular backups verification

### 11. Support & Maintenance

#### Regular Maintenance Tasks
- Weekly error log review
- Monthly performance analysis
- Quarterly security audits
- Regular backup testing
- User feedback analysis

#### Emergency Procedures
- Database restoration process
- Incident response plan
- User communication templates
- Rollback procedures

## 📞 Support Resources

- **Supabase Documentation**: https://supabase.com/docs
- **Lovable Documentation**: https://docs.lovable.dev/
- **System Health Monitoring**: Available in Admin Dashboard
- **Error Logs**: Check browser console or monitoring service

## 🔧 Configuration Files Updated

The following files have been created/updated for production:
- `src/config/production.ts` - Production configuration
- `src/services/authService.ts` - Enhanced authentication
- `src/services/monitoringService.ts` - Error and performance monitoring
- `src/components/shared/DemoUserBanner.tsx` - Demo user indicators
- `src/components/admin/SystemHealth.tsx` - Health monitoring dashboard

---

**Important**: Always test thoroughly in a staging environment before deploying to production!
