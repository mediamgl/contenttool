# Deployment Checklist
**ContentFlow - Production Deployment**

Use this checklist to ensure a smooth production deployment.

---

## Pre-Deployment Verification

### 1. Environment Configuration

- [ ] **ANTHROPIC_API_KEY is set in Supabase**
  ```bash
  # Set via Supabase CLI:
  supabase secrets set ANTHROPIC_API_KEY=your_key_here

  # Or via Dashboard:
  # Project Settings > Edge Functions > Secrets > Add ANTHROPIC_API_KEY
  ```

- [ ] **Verify environment variables**
  - VITE_SUPABASE_URL is correct
  - VITE_SUPABASE_ANON_KEY is correct
  - Edge functions can access ANTHROPIC_API_KEY

### 2. Database

- [ ] **All migrations applied**
  ```sql
  -- Verify tables exist
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public';

  -- Should show 11 tables including error_logs
  ```

- [ ] **RLS is enabled on all tables**
  ```sql
  SELECT tablename, rowsecurity
  FROM pg_tables
  WHERE schemaname = 'public';

  -- All should show rowsecurity = true
  ```

- [ ] **Test RLS policies**
  - Create test user
  - Verify user can only access own data
  - Verify admin can access all data (if admin exists)

### 3. Edge Functions

- [ ] **All 5 edge functions deployed**
  - generate-ideas
  - generate-hooks
  - generate-outline
  - ai-text-operations
  - analyze-content

- [ ] **Test each edge function**
  ```bash
  # Test via curl or Postman
  curl -X POST https://[project-ref].supabase.co/functions/v1/generate-ideas \
    -H "Authorization: Bearer [anon-key]" \
    -H "Content-Type: application/json" \
    -d '{"businessDescription":"Test","contentTypes":["blog"],"count":1}'
  ```

### 4. Authentication

- [ ] **Test user registration**
  - Visit /register
  - Create new account
  - Verify profile created
  - Verify preferences created

- [ ] **Test user login**
  - Visit /login
  - Login with credentials
  - Verify redirect to dashboard
  - Verify session persists on refresh

- [ ] **Test protected routes**
  - Try accessing /ideas without login → should redirect to /login
  - Login and access /ideas → should work
  - Try accessing /admin as non-admin → should redirect to /

- [ ] **Test logout**
  - Click logout
  - Verify redirect to login
  - Verify can't access protected routes

### 5. Build

- [ ] **Production build successful**
  ```bash
  npm run build
  # Should complete without errors
  ```

- [ ] **Test production build locally**
  ```bash
  npm run preview
  # Open browser and test key features
  ```

### 6. Error Logging

- [ ] **Error logging service initialized**
  - Check browser console for initialization
  - Should not show any errors

- [ ] **Test error capture**
  ```javascript
  // In browser console:
  throw new Error('Test error');

  // Then check database:
  // SELECT * FROM error_logs ORDER BY occurred_at DESC LIMIT 1;
  ```

- [ ] **Verify error appears in database**

---

## Deployment Steps

### 1. Code Deployment

- [ ] **Push to production branch**
  ```bash
  git add .
  git commit -m "Production-ready deployment"
  git push origin main
  ```

- [ ] **Build and deploy frontend**
  ```bash
  npm run build
  # Deploy dist/ folder to hosting (Vercel, Netlify, etc.)
  ```

### 2. Database Configuration

- [ ] **Verify Supabase project is on paid plan** (if needed for production)
- [ ] **Configure database backups**
- [ ] **Set up database monitoring**

### 3. Security Configuration

- [ ] **Review RLS policies one final time**
- [ ] **Verify no public policies exist** (except where intended)
- [ ] **Check for any test/development users** (remove if found)
- [ ] **Verify CORS settings on edge functions**

### 4. Monitoring Setup

- [ ] **Set up error monitoring** (optional but recommended)
  - Sentry, LogRocket, or similar
  - Configure in `errorLoggingService.ts`

- [ ] **Set up uptime monitoring**
  - Pingdom, UptimeRobot, or similar

- [ ] **Configure alerts**
  - Critical errors
  - Database issues
  - Edge function failures

---

## Post-Deployment Verification

### Immediate Checks (First Hour)

- [ ] **Visit live site**
  - Homepage loads correctly
  - No console errors
  - Assets loading properly

- [ ] **Test user flows**
  - [ ] Register new account
  - [ ] Login with new account
  - [ ] Generate content ideas
  - [ ] Create content
  - [ ] Update profile
  - [ ] Logout

- [ ] **Check error logs**
  ```sql
  SELECT COUNT(*), severity
  FROM error_logs
  WHERE occurred_at > NOW() - INTERVAL '1 hour'
  GROUP BY severity;
  ```

- [ ] **Monitor edge function logs** in Supabase dashboard

### First Day Checks

- [ ] **Review error metrics**
  ```typescript
  const metrics = await errorLogger.getErrorMetrics(24);
  console.log(metrics);
  ```

- [ ] **Check for critical errors**
  ```sql
  SELECT * FROM error_logs
  WHERE severity = 'critical'
  AND occurred_at > NOW() - INTERVAL '24 hours';
  ```

- [ ] **Monitor user registrations**
  ```sql
  SELECT COUNT(*) FROM auth.users
  WHERE created_at > NOW() - INTERVAL '24 hours';
  ```

- [ ] **Check database performance**
  - Query response times
  - Connection pool usage
  - Storage usage

### First Week Checks

- [ ] **Review all error categories**
  ```sql
  SELECT category, COUNT(*)
  FROM error_logs
  WHERE occurred_at > NOW() - INTERVAL '7 days'
  GROUP BY category
  ORDER BY COUNT(*) DESC;
  ```

- [ ] **Analyze user behavior**
  - Most used features
  - Drop-off points
  - Error-prone areas

- [ ] **Performance optimization**
  - Identify slow queries
  - Optimize if needed
  - Consider caching

- [ ] **Clean up old error logs**
  ```typescript
  await errorLogger.clearOldLogs(30);
  ```

---

## Rollback Plan

If issues arise, follow this rollback procedure:

### 1. Immediate Issues (First Hour)

- [ ] **Identify the issue**
  - Check error logs
  - Review recent changes
  - Check Supabase logs

- [ ] **Quick fixes**
  - Disable problematic feature via feature flag
  - Fix critical bug and redeploy
  - Roll back edge function if needed

### 2. Major Issues

- [ ] **Roll back frontend deployment**
  - Redeploy previous version
  - Clear CDN cache if applicable

- [ ] **Roll back database migration** (if issue is database-related)
  ```sql
  -- Only if absolutely necessary
  -- Create rollback migration
  ```

- [ ] **Notify users** (if service was disrupted)

### 3. Post-Rollback

- [ ] **Investigate root cause**
- [ ] **Fix issue in development**
- [ ] **Test thoroughly**
- [ ] **Redeploy with fix**

---

## Monitoring Endpoints

### Key URLs to Monitor

- [ ] **Frontend:** `https://your-domain.com`
- [ ] **Login:** `https://your-domain.com/login`
- [ ] **API Health:** Check edge function responses
- [ ] **Supabase Dashboard:** Monitor database and functions

### Key Metrics to Track

- [ ] **User registrations per day**
- [ ] **Login success rate**
- [ ] **Error rate by category**
- [ ] **Edge function response times**
- [ ] **Database query performance**
- [ ] **Page load times**

---

## Maintenance Schedule

### Daily
- [ ] Check critical errors
- [ ] Monitor user feedback
- [ ] Review system alerts

### Weekly
- [ ] Review error metrics
- [ ] Clean old logs (30+ days)
- [ ] Check database performance
- [ ] Review user analytics

### Monthly
- [ ] Security review
- [ ] Dependency updates
- [ ] Performance optimization
- [ ] Backup verification

---

## Emergency Contacts

**System Status:**
- Supabase Status: https://status.supabase.com
- Anthropic Status: https://status.anthropic.com

**Support:**
- Supabase Support: support@supabase.com
- Anthropic Support: support@anthropic.com

---

## Success Criteria

Your deployment is successful when:

- [x] All users can register and login
- [x] Protected routes require authentication
- [x] AI features work (with ANTHROPIC_API_KEY configured)
- [x] Error logging captures and stores errors
- [x] No critical errors in first 24 hours
- [x] Database queries perform well
- [x] Edge functions respond quickly (<2s)
- [x] User experience is smooth

---

## Notes

- Keep this checklist handy for future deployments
- Update based on lessons learned
- Document any issues encountered
- Share with team members

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Version:** _______________
**Status:** _______________

---

**Good luck with your deployment!** 🚀
