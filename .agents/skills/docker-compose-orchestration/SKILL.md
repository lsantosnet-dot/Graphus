---
name: docker-compose-orchestration
description: Container orchestration with Docker Compose for multi-container applications, networking, volumes, and production deployment
---

A comprehensive skill for orchestrating multi-container applications using Docker Compose. This skill enables rapid development, deployment, and management of containerized applications with service definitions, networking strategies, volume management, health checks, and production-ready configurations.

Use this skill when:

- Building multi-container applications (microservices, full-stack apps)
- Setting up development environments with databases, caching, and services
- Orchestrating frontend, backend, and database services together
- Managing service dependencies and startup order
- Configuring networks and inter-service communication
- Implementing persistent storage with volumes
- Deploying applications to development, staging, or production
- Creating reproducible development environments
- Managing application lifecycle (start, stop, rebuild, scale)
- Monitoring application health and implementing health checks
- Migrating from single containers to multi-service architectures
- Testing distributed systems locally

### Docker Compose Philosophy
Docker Compose simplifies multi-container application management through:

- **Declarative Configuration**: Define entire application stacks in YAML
- **Service Abstraction**: Each component is a service with its own configuration
- **Automatic Networking**: Services can communicate by name automatically
- **Volume Management**: Persistent data and shared storage across containers
- **Environment Isolation**: Each project gets its own network namespace
- **Reproducibility**: Same configuration works across all environments

### Key Docker Compose Entities
1. **Services**: Individual containers and their configurations
2. **Networks**: Communication channels between services
3. **Volumes**: Persistent storage and data sharing
4. **Configs**: Non-sensitive configuration files
5. **Secrets**: Sensitive data (passwords, API keys)
6. **Projects**: Collection of services under a single namespace

### Compose File Structure
```yaml
version: "3.8"  # Compose file format version

services:       # Define containers
  service-name:
    # Service configuration

networks:       # Define custom networks
  network-name:
    # Network configuration

volumes:        # Define named volumes
  volume-name:
    # Volume configuration

configs:        # Application configs (optional)
  config-name:
    # Config source

secrets:        # Sensitive data (optional)
  secret-name:
    # Secret source
```

### Basic Service Definition
```yaml
services:
  web:
    image: nginx:alpine           # Use existing image
    container_name: my-web        # Custom container name
    restart: unless-stopped       # Restart policy
    ports:
      - "80:80"                   # Host:Container port mapping
    environment:
      - ENV_VAR=value             # Environment variables
    volumes:
      - ./html:/usr/share/nginx/html  # Volume mount
    networks:
      - frontend                  # Connect to network
```

### Build-Based Service
```yaml
services:
  app:
    build:
      context: ./app              # Build context directory
      dockerfile: Dockerfile      # Custom Dockerfile
      args:                       # Build arguments
        NODE_ENV: development
      target: development         # Multi-stage build target
    image: myapp:latest           # Tag resulting image
    ports:
      - "3000:3000"
```

### Service with Dependencies
```yaml
services:
  web:
    image: nginx
    depends_on:
      db:
        condition: service_healthy  # Wait for health check
      redis:
        condition: service_started  # Wait for start only

  db:
    image: postgres:15
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  redis:
    image: redis:alpine
```

### Service with Advanced Configuration
```yaml
services:
  backend:
    build: ./backend
    command: npm run dev          # Override default command
    working_dir: /app             # Set working directory
    user: "1000:1000"             # Run as specific user
    hostname: api-server          # Custom hostname
    domainname: example.com       # Domain name
    env_file:
      - .env                      # Load env from file
      - .env.local
    environment:
      DATABASE_URL: "postgresql://db:5432/myapp"
      REDIS_URL: "redis://cache:6379"
    volumes:
      - ./backend:/app            # Source code mount
      - /app/node_modules         # Preserve node_modules
      - app-data:/data            # Named volume
    ports:
      - "3000:3000"               # Application port
      - "9229:9229"               # Debug port
    expose:
      - "8080"                    # Expose to other services only
    networks:
      - backend
      - frontend
    labels:
      - "com.example.description=Backend API"
      - "com.example.version=1.0"
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### Service with Health Checks
```yaml
services:
  web:
    image: nginx
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Advanced Volume Configuration
```yaml
volumes:
  data:
    driver: local
    driver_opts:
      type: "nfs"
      o: "addr=10.40.0.199,nolock,soft,rw"
      device: ":/docker/example"

  cache:
    driver: local
    driver_opts:
      type: tmpfs
      device: tmpfs
      o: "size=100m,uid=1000"

  external-volume:
    external: true  # Volume created outside Compose
    name: my-existing-volume
```
