# 🚀 CI/CD Documentation

This directory contains GitHub Actions workflows for automated testing, building, and deployment of the Vue Element Plus Admin project.

## 📋 Available Workflows

### 1. 🚀 CI/CD Pipeline (`ci.yml`)

**Triggers:** Push to `main`/`dev`/`develop`, Pull Requests

**Features:**

- 🔍 **Code Quality**: ESLint, Prettier, Stylelint, TypeScript checking
- 🧪 **Testing**: Critical tests + full test suite with coverage
- 🏗️ **Building**: Multi-environment builds (dev, test, pro)
- 🔒 **Security**: Dependency vulnerability scanning
- 📦 **Analysis**: Bundle size analysis and dependency checking
- ⚡ **Performance**: Build performance monitoring
- 🚀 **Deployment**: Automated preview and production deployments

**Matrix Testing:**

- Node.js versions: 18, 20
- Build targets: dev, test, pro

### 2. 📦 Dependency Updates (`dependency-updates.yml`)

**Triggers:** Weekly schedule (Mondays 9 AM UTC), Manual dispatch

**Features:**

- 🔄 **Automated Updates**: Checks and updates outdated dependencies
- 🧪 **Validation**: Runs critical tests after updates
- 📝 **Pull Requests**: Creates PRs with detailed update information
- 🔒 **Security Monitoring**: Automated security vulnerability detection
- 🚨 **Issue Creation**: Creates GitHub issues for security vulnerabilities

### 3. 🚀 Release (`release.yml`)

**Triggers:** Git tags (`v*.*.*`), Manual workflow dispatch

**Features:**

- ✅ **Validation**: Comprehensive pre-release validation
- 🏗️ **Multi-Build**: Creates builds for all environments
- 📝 **Changelog**: Automated changelog generation
- 🎉 **GitHub Releases**: Creates releases with build artifacts
- 📊 **Checksums**: SHA256 checksums for all build artifacts
- 🚀 **Deployment**: Optional production deployment triggers

### 4. 📊 Code Quality Monitoring (`code-quality.yml`)

**Triggers:** Push to `main`/`dev`, Pull Requests, Weekly schedule

**Features:**

- 🔍 **Deep Analysis**: Detailed ESLint, formatting, and style analysis
- 📊 **Coverage Tracking**: Test coverage analysis and reporting
- 📦 **Bundle Analysis**: Bundle size monitoring and optimization suggestions
- 🔒 **Security Audits**: Regular security vulnerability scanning
- 📋 **Quality Reports**: Comprehensive quality scoring and summaries

## 🛠️ Setup Instructions

### Prerequisites

1. **Repository Secrets** (if using deployment):

   ```
   DEPLOY_TOKEN          # For deployment authentication
   CODECOV_TOKEN        # For code coverage reporting (optional)
   ```

2. **Branch Protection** (recommended):
   - Require status checks: ✅ CI/CD Pipeline
   - Require up-to-date branches
   - Restrict pushes to main branch

### Local Development Integration

The workflows integrate seamlessly with your local development setup:

```bash
# Run the same checks locally
pnpm lint:eslint          # ESLint (same as CI)
pnpm lint:format          # Prettier (same as CI)
pnpm lint:style           # Stylelint (same as CI)
pnpm ts:check             # TypeScript (same as CI)
pnpm test:critical        # Critical tests (same as CI)
pnpm test:coverage        # Full test suite (same as CI)

# Pre-push validation
pnpm test:pre-push        # Same tests as Husky pre-push hook
```

## 📊 Workflow Status

### Build Status Badges

Add these badges to your README.md:

```markdown
[![CI/CD Pipeline](https://github.com/YOUR_USERNAME/admin-vue/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/admin-vue/actions/workflows/ci.yml) [![Code Quality](https://github.com/YOUR_USERNAME/admin-vue/actions/workflows/code-quality.yml/badge.svg)](https://github.com/YOUR_USERNAME/admin-vue/actions/workflows/code-quality.yml) [![Security Audit](https://github.com/YOUR_USERNAME/admin-vue/actions/workflows/dependency-updates.yml/badge.svg)](https://github.com/YOUR_USERNAME/admin-vue/actions/workflows/dependency-updates.yml)
```

## 🔧 Customization

### Environment-Specific Configuration

Each workflow can be customized for your specific needs:

1. **Deployment Targets**: Update the deployment steps in `ci.yml` and `release.yml`
2. **Test Coverage**: Adjust coverage thresholds in `code-quality.yml`
3. **Security Levels**: Modify audit levels in `dependency-updates.yml`
4. **Notification**: Add Slack/Discord notifications to any workflow

### Adding New Environments

To add a new build environment (e.g., staging):

1. Add build script to `package.json`:

   ```json
   "build:staging": "vite build --mode staging"
   ```

2. Add to build matrix in `ci.yml` and `release.yml`:
   ```yaml
   strategy:
     matrix:
       build-target: [dev, test, staging, pro]
   ```

### Custom Deployment

Replace the deployment steps with your specific deployment commands:

```yaml
# Example: Deploy to AWS S3
- name: Deploy to S3
  run: |
    aws s3 sync dist/ s3://your-bucket --delete
    aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"

# Example: Deploy to Netlify
- name: Deploy to Netlify
  run: netlify deploy --prod --dir=dist

# Example: Deploy to Vercel
- name: Deploy to Vercel
  run: vercel --prod
```

## 🎯 Best Practices

### 1. **Fail Fast Strategy**

The workflows are designed to fail quickly on issues:

- Linting runs first (fastest feedback)
- Critical tests before full test suite
- Security checks run in parallel

### 2. **Caching Strategy**

- Node.js dependencies cached by pnpm
- Build artifacts cached between jobs
- Coverage reports preserved for 7 days

### 3. **Security First**

- Regular automated security audits
- Dependency vulnerability scanning
- Secrets properly managed through GitHub Secrets

### 4. **Performance Monitoring**

- Bundle size tracking
- Build time monitoring
- Performance regression detection

## 🚨 Troubleshooting

### Common Issues

1. **Test Failures**:

   ```bash
   # Run locally to debug
   pnpm test:critical
   pnpm test:run
   ```

2. **Build Failures**:

   ```bash
   # Check specific environment
   pnpm build:dev
   pnpm build:test
   pnpm build:pro
   ```

3. **Linting Issues**:

   ```bash
   # Auto-fix most issues
   pnpm lint:eslint
   pnpm lint:format
   pnpm lint:style
   ```

4. **Dependency Issues**:
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

### Getting Help

1. Check the [Actions tab](../../actions) for detailed logs
2. Review the workflow summary for quick issue identification
3. Use the GitHub Issues tab to report persistent problems

## 📈 Metrics & Monitoring

The workflows provide comprehensive metrics:

- **Code Quality Score**: A+ to C rating
- **Test Coverage**: Line, function, branch, and statement coverage
- **Bundle Size**: Per-chunk and total size analysis
- **Security Score**: Vulnerability count and severity
- **Build Performance**: Build time and optimization suggestions

---

_Last updated: $(date)_ _For questions or improvements, please open an issue or pull request._
