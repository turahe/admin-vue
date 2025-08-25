# 🐳 Docker Setup Guide

This project includes comprehensive Docker configurations for both development and production environments with multi-stage builds optimized for performance and security.

## 📁 Docker Files Overview

### Development Setup

- **`Dockerfile.dev`**: Multi-stage development container
- **`docker-compose.dev.yaml`**: Development environment orchestration

### Production Setup

- **`Dockerfile`**: Multi-stage production build with Nginx
- **`docker-compose.yml`**: Production environment orchestration
- **`.dockerignore`**: Optimized build context exclusions

## 🚀 Quick Start

### Development Environment

```bash
# Start development environment
docker-compose -f docker-compose.dev.yaml up --build

# Access the application
open http://localhost:3000
```

### Production Environment

```bash
# Build and start production environment
docker-compose up --build

# Access the application
open http://localhost
```

## 🏗️ Multi-Stage Build Architecture

### Development Dockerfile (`Dockerfile.dev`)

```
┌─────────────────┐    ┌─────────────────┐
│  Dependencies   │───▶│  Development    │
│  Stage          │    │  Stage          │
│                 │    │                 │
│ • Install pnpm  │    │ • Copy deps     │
│ • Install deps  │    │ • Add security  │
│ • Cache layers  │    │ • Hot reload    │
└─────────────────┘    └─────────────────┘
```

**Features:**

- 🔄 **Hot Reload**: Live code changes with volume mounting
- 🔒 **Security**: Non-root user execution
- ⚡ **Performance**: Optimized layer caching
- 🏥 **Health Checks**: Built-in development server monitoring

### Production Dockerfile (`Dockerfile`)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Dependencies   │───▶│     Builder     │───▶│   Production    │
│  Stage          │    │     Stage       │    │     Stage       │
│                 │    │                 │    │                 │
│ • Install pnpm  │    │ • Copy deps     │    │ • Nginx server  │
│ • Install deps  │    │ • Build app     │    │ • Static files  │
│ • Cache layers  │    │ • Optimize      │    │ • Security      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Features:**

- 🗜️ **Minimal Size**: Only production assets in final image
- 🔒 **Security**: Nginx with security headers, non-root user
- ⚡ **Performance**: Gzip compression, static asset caching
- 🏥 **Health Checks**: Built-in health endpoint
- 🔄 **SPA Support**: Client-side routing support

## 🛠️ Configuration Details

### Development Configuration

```yaml
# docker-compose.dev.yaml
services:
  vue-element-plus-admin:
    build:
      target: development # Use development stage
    ports:
      - '3000:3000' # Development port
    volumes:
      - .:/app # Live code sync
      - /app/node_modules # Preserve node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true # File watching
```

### Production Configuration

```yaml
# docker-compose.yml
services:
  vue-element-plus-admin:
    build:
      target: production # Use production stage
    ports:
      - '80:80' # Standard HTTP port
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost/health']
```

## 📊 Performance Optimizations

### 1. **Layer Caching**

```dockerfile
# Dependencies installed separately for better caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
```

### 2. **Build Cache Mounting**

```dockerfile
RUN --mount=type=cache,target=/root/.pnpm \
    pnpm install --frozen-lockfile
```

### 3. **Nginx Optimizations**

- Gzip compression for text assets
- Long-term caching for static assets
- Security headers included
- SPA routing support

### 4. **Image Size Optimization**

- Alpine Linux base images
- Multi-stage builds
- Comprehensive `.dockerignore`
- Only production assets in final image

## 🔒 Security Features

### Container Security

- 🚫 **Non-root execution**: Custom user with minimal privileges
- 🛡️ **Security headers**: XSS, CSRF, and content-type protection
- 🔐 **Minimal attack surface**: Only necessary packages installed

### Nginx Security Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

## 🏥 Health Monitoring

### Development Health Check

```bash
# Check if development server is responding
wget --no-verbose --tries=1 --spider http://localhost:3000
```

### Production Health Check

```bash
# Check custom health endpoint
curl -f http://localhost/health
```

### Health Check Configuration

- **Interval**: 30 seconds
- **Timeout**: 3-10 seconds
- **Retries**: 3 attempts
- **Start Period**: 5-40 seconds

## 🚀 Usage Examples

### Development Workflow

```bash
# Start development environment
docker-compose -f docker-compose.dev.yaml up

# View logs
docker-compose -f docker-compose.dev.yaml logs -f

# Execute commands in container
docker-compose -f docker-compose.dev.yaml exec vue-element-plus-admin pnpm test

# Stop environment
docker-compose -f docker-compose.dev.yaml down
```

### Production Deployment

```bash
# Build production image
docker build -t vue-admin:latest .

# Run production container
docker run -d -p 80:80 --name vue-admin vue-admin:latest

# Check container health
docker ps
docker logs vue-admin

# Stop container
docker stop vue-admin && docker rm vue-admin
```

### Docker Compose Production

```bash
# Start production environment
docker-compose up -d

# Scale the application
docker-compose up -d --scale vue-element-plus-admin=3

# Update the application
docker-compose pull && docker-compose up -d

# View application logs
docker-compose logs -f vue-element-plus-admin
```

## 🔧 Customization

### Environment Variables

```bash
# Development
NODE_ENV=development
CHOKIDAR_USEPOLLING=true

# Production
NODE_ENV=production
```

### Port Configuration

```yaml
# Change ports in docker-compose files
ports:
  - '8080:80' # Custom port mapping
```

### Volume Mounting

```yaml
# Additional volumes for development
volumes:
  - .:/app
  - /app/node_modules
  - ~/.pnpm-store:/root/.pnpm # Share pnpm cache
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Change port in docker-compose file
   ports:
     - "3001:3000"
   ```

2. **Permission Issues**

   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

3. **Build Cache Issues**

   ```bash
   # Clear Docker cache
   docker system prune -f
   docker build --no-cache .
   ```

4. **Volume Mount Issues**
   ```bash
   # Remove volumes and recreate
   docker-compose down -v
   docker-compose up --build
   ```

### Performance Issues

1. **Slow File Watching**

   ```yaml
   environment:
     - CHOKIDAR_USEPOLLING=true
   ```

2. **Memory Issues**
   ```bash
   # Increase Docker memory limit
   # Docker Desktop → Settings → Resources → Memory
   ```

## 📋 Best Practices

### 1. **Image Optimization**

- Use multi-stage builds
- Minimize layer count
- Use .dockerignore effectively
- Pin base image versions

### 2. **Security**

- Run as non-root user
- Use official base images
- Keep images updated
- Scan for vulnerabilities

### 3. **Development**

- Use volume mounts for live reload
- Enable file watching
- Use development-specific configurations
- Include health checks

### 4. **Production**

- Optimize for size and performance
- Include security headers
- Use proper caching strategies
- Monitor application health

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)
- [Multi-stage Builds](https://docs.docker.com/develop/advanced-features/multistage-build/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Nginx Configuration](https://nginx.org/en/docs/)

---

_For questions or improvements, please open an issue or pull request._
