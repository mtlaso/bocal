# Development Troubleshooting Guide

This guide helps resolve common issues encountered during Bocal development.

## 🚀 Quick Start Issues

### "pnpm: command not found"

**Solution:**
```bash
npm install -g pnpm
```

### Database Connection Issues

**Symptoms:** 
- `ECONNREFUSED` errors
- "Database not found" errors

**Solutions:**

1. **Check if PostgreSQL is running:**
   ```bash
   docker ps | grep postgres
   ```

2. **Start the database:**
   ```bash
   docker-compose up -d postgres
   ```

3. **Verify connection:**
   ```bash
   docker exec -it bocal-postgres psql -U admin -d bocal
   ```

4. **Reset database (if needed):**
   ```bash
   docker-compose down -v  # Warning: This deletes all data
   docker-compose up -d postgres
   pnpm migration:migrate
   ```

### Environment Variables

**Symptoms:**
- OAuth login not working
- "Missing environment variable" errors

**Solution:**
1. Ensure `.env.local` exists in project root
2. Check all required variables are set:
   ```bash
   APP_URL=http://localhost:3000
   AUTH_SECRET=your-secret-here
   AUTH_GITHUB_ID=your-github-id
   AUTH_GITHUB_SECRET=your-github-secret
   AUTH_GOOGLE_ID=your-google-id
   AUTH_GOOGLE_SECRET=your-google-secret
   DATABASE_URL=postgres://admin:root@localhost:5432/bocal
   ```

3. Generate AUTH_SECRET if missing:
   ```bash
   openssl rand -base64 32
   ```

## 🔧 Build & Development Issues

### Build Failures

**"Module not found" errors:**
```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

**TypeScript errors:**
```bash
pnpm type-check
```
Fix reported issues before proceeding.

**Next.js build errors:**
```bash
rm -rf .next
pnpm build
```

### Hot Reload Not Working

**Solutions:**
1. Check if using correct dev command:
   ```bash
   pnpm dev  # Uses Turbopack for faster reloads
   ```

2. Clear Next.js cache:
   ```bash
   rm -rf .next
   ```

3. Check file permissions (macOS/Linux):
   ```bash
   sudo chown -R $(whoami) .
   ```

### Port Already in Use

**Symptoms:** `EADDRINUSE: address already in use :::3000`

**Solutions:**
1. Kill process using port 3000:
   ```bash
   # macOS/Linux
   lsof -ti:3000 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. Use different port:
   ```bash
   pnpm dev -- -p 3001
   ```

## 🧪 Testing Issues

### Tests Failing

**"Cannot find module" errors:**
```bash
pnpm install --shamefully-hoist
```

**Mock issues:**
- Check `src/test/setup.ts` for proper mocks
- Ensure test utilities are imported correctly

**React Testing Library issues:**
```bash
# Clear test cache
pnpm test:run --clearCache
```

### Test Coverage Issues

**Low coverage warnings:**
```bash
pnpm test:coverage --reporter=verbose
```

Check which files need more test coverage.

## 🗄️ Database Issues

### Migration Problems

**"Migration failed" errors:**

1. **Check current migration status:**
   ```bash
   pnpm drizzle-kit status
   ```

2. **Reset migrations (development only):**
   ```bash
   docker-compose down -v
   docker-compose up -d postgres
   pnpm migration:migrate
   ```

3. **Generate new migration:**
   ```bash
   pnpm migration:generate
   ```

### Drizzle Studio Issues

**Can't access studio:**
```bash
pnpm drizzle-kit studio --port 4983
```

Then visit: http://localhost:4983

### pgAdmin Connection Issues

**Can't connect to pgAdmin:**

1. Check if container is running:
   ```bash
   docker ps | grep pgadmin
   ```

2. Access pgAdmin at: http://localhost:5050
   - Email: `admin@admin.admin`
   - Password: `admin`

3. Add server connection:
   - Host: `postgres` (container name)
   - Port: `5432`
   - Username: `admin`
   - Password: `root`

## 🎨 Styling Issues

### TailwindCSS Not Working

**Styles not applying:**

1. **Check if Tailwind is processing CSS:**
   ```bash
   pnpm build
   ```

2. **Verify Tailwind config includes all files:**
   Check `tailwind.config.js` content array.

3. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   ```

### shadcn/ui Component Issues

**Component not found:**
```bash
pnpm dlx shadcn@latest add [component-name]
```

**Styling conflicts:**
- Check `src/components/ui/` for component definitions
- Verify imports in your components

## 🔍 Code Quality Issues

### Biome Linting Errors

**Fix automatically:**
```bash
pnpm lint:fix
```

**Manual fixes needed:**
- Review warnings and errors
- Update code to match Biome rules
- Check `biome.json` for configuration

### TypeScript Errors

**Common fixes:**
1. Add proper type annotations
2. Fix import/export statements
3. Update deprecated APIs

**Check specific file:**
```bash
npx tsc --noEmit src/path/to/file.ts
```

## 🔐 Authentication Issues

### OAuth Not Working

**GitHub OAuth:**
1. Check GitHub App settings
2. Verify callback URL: `http://localhost:3000/api/auth/callback/github`
3. Ensure client ID and secret are correct

**Google OAuth:**
1. Check Google Cloud Console settings
2. Verify callback URL: `http://localhost:3000/api/auth/callback/google`
3. Ensure credentials are correct

**Session issues:**
```bash
# Clear browser cookies and local storage
# Or use incognito mode for testing
```

## 🌐 Internationalization Issues

### Translation Not Loading

**Check translation files:**
- Verify files exist in `messages/` directory
- Check import statements in components

**Clear Next.js cache:**
```bash
rm -rf .next
```

## 📱 Performance Issues

### Slow Development Server

**Solutions:**
1. Ensure using Turbopack:
   ```bash
   pnpm dev  # Should show "Turbopack" in output
   ```

2. Increase Node.js memory:
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" pnpm dev
   ```

3. Check system resources (RAM, CPU usage)

### Bundle Size Issues

**Analyze bundle:**
```bash
pnpm analyze
```

Review output for optimization opportunities.

## 🆘 Getting Help

### Debug Information to Collect

When asking for help, include:

1. **Environment info:**
   ```bash
   node --version
   pnpm --version
   docker --version
   ```

2. **Error messages:** Full stack traces
3. **Steps to reproduce:** Detailed steps
4. **Screenshots:** For UI issues
5. **Configuration:** Relevant config files

### Common Log Locations

- **Next.js logs:** Terminal where `pnpm dev` is running
- **Database logs:** `docker logs bocal-postgres`
- **Browser errors:** Developer Tools Console
- **Network errors:** Developer Tools Network tab

### Reset Everything (Last Resort)

**Complete reset (destroys all data):**
```bash
# Stop all processes
docker-compose down -v
rm -rf node_modules
rm -rf .next
rm pnpm-lock.yaml

# Fresh install
pnpm install
docker-compose up -d
pnpm migration:migrate
pnpm dev
```

**Note:** This will delete all database data and require reconfiguration.

## 📞 Support Channels

- **GitHub Issues:** [Report bugs](https://github.com/mtlaso/bocal/issues)
- **GitHub Discussions:** [Ask questions](https://github.com/mtlaso/bocal/discussions)
- **Documentation:** Check README.md and CONTRIBUTING.md

Remember: Most issues are configuration-related. Double-check your setup before seeking help! 🔍