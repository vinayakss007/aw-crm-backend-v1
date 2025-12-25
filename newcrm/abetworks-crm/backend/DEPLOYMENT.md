# Deployment Guide for ABETWORKS CRM Backend

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Production Deployment](#production-deployment)
3. [Docker Deployment](#docker-deployment)
4. [PM2 Deployment](#pm2-deployment)
5. [Configuration](#configuration)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **CPU**: 2+ cores recommended
- **RAM**: 4GB+ minimum, 8GB+ recommended
- **Storage**: 10GB+ free space
- **OS**: Linux (Ubuntu 20.04 LTS or newer recommended)

### Software Requirements
- **Node.js**: v18.x or higher
- **npm**: v8.x or higher
- **PostgreSQL**: v12 or higher
- **Git**: v2.0 or higher

### External Services
- PostgreSQL database (managed or self-hosted)
- MinIO or AWS S3 for file storage (optional)
- SMTP server for email notifications (optional)

## Production Deployment

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/abetworks-crm-backend.git
cd abetworks-crm-backend
```

### 2. Install Dependencies
```bash
npm install --production
```

### 3. Build the Application
```bash
npm run build
```

### 4. Configure Environment Variables
Create a `.env.production` file with the following content:

```env
NODE_ENV=production
PORT=5000

# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRE=30d

# Server Configuration
LOG_LEVEL=info

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Database Connection Pooling
DB_MAX_CONNECTIONS=20
DB_MIN_CONNECTIONS=5
DB_CONNECTION_TIMEOUT=2000
DB_QUERY_TIMEOUT=30000
DB_IDLE_TIMEOUT=30000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
RATE_LIMIT_MESSAGE=Too many requests from this IP, please try again later.

# Logging Configuration
LOG_MAX_SIZE=20m
LOG_MAX_FILES=14d

# Security
HELMET_CSP=true
HELMET_DNS_PREFETCH=false
HELMET_FRAMEGUARD=true
HELMET_HIDE_POWERED_BY=true
HELMET_HSTS=true
HELMET_IE_NO_OPEN=true
HELMET_NO_SNIFF=true
HELMET_XSS_FILTER=true
```

### 5. Run Database Migrations
```bash
npm run migrate:prod
npm run migrate:custom-fields:prod
npm run migrate:audit-logs:prod
```

### 6. Start the Application
```bash
npm start
```

## Docker Deployment

### 1. Build the Docker Image
```bash
docker build -t abetworks-crm-backend .
```

### 2. Create Environment File
Create a `.env` file with your production environment variables:

```env
POSTGRES_DB=crm_db
POSTGRES_USER=crm_user
POSTGRES_PASSWORD=secure_password
DATABASE_URL=postgresql://crm_user:secure_password@db:5432/crm_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
```

### 3. Run with Docker Compose
```bash
docker-compose up -d
```

### 4. View Logs
```bash
docker-compose logs -f app
```

## PM2 Deployment

### 1. Install PM2
```bash
npm install -g pm2
```

### 2. Install Dependencies
```bash
npm install
npm run build
```

### 3. Start with PM2
```bash
# For development
pm2 start ecosystem.config.js --env development

# For staging
pm2 start ecosystem.config.js --env staging

# For production
pm2 start ecosystem.config.js --env production
```

### 4. Monitor the Application
```bash
# View application status
pm2 status

# View logs
pm2 logs

# Monitor resources
pm2 monit
```

### 5. Setup PM2 Startup
```bash
pm2 startup
pm2 save
```

## Configuration

### Environment Variables

#### Required Variables
- `NODE_ENV`: Environment mode (development, staging, production)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT signing
- `JWT_REFRESH_SECRET`: Secret for refresh token signing

#### Optional Variables
- `PORT`: Port to run the application on (default: 5000)
- `LOG_LEVEL`: Logging level (error, warn, info, debug) (default: info)
- `CORS_ORIGIN`: Allowed origins for CORS (comma-separated)
- `DB_MAX_CONNECTIONS`: Maximum database connections (default: 20)
- `RATE_LIMIT_MAX`: Max requests per window (default: 100)
- `RATE_LIMIT_WINDOW_MS`: Rate limit window in ms (default: 900000)

### Database Configuration
The application uses PostgreSQL with connection pooling. Recommended production settings:
- Maximum connections: 20
- Minimum connections: 5
- Connection timeout: 2000ms
- Query timeout: 30000ms
- Idle timeout: 30000ms

## Monitoring

### Health Checks
- `/health`: System health check
- `/ready`: Application readiness check

### Log Files
Logs are stored in the `logs/` directory:
- `error.log`: Error logs
- `combined.log`: Combined logs

### Performance Monitoring
- Monitor response times
- Track database connection usage
- Watch memory and CPU usage
- Monitor error rates

## Troubleshooting

### Common Issues

#### Database Connection Issues
1. Verify `DATABASE_URL` is correct
2. Check if database server is running
3. Ensure firewall rules allow connections
4. Verify database credentials

#### Port Already in Use
```bash
# Check what's using the port
sudo netstat -tulpn | grep :5000

# Kill the process if needed
sudo kill -9 $(sudo lsof -t -i:5000)
```

#### High Memory Usage
1. Check for memory leaks in the application
2. Adjust connection pool settings
3. Review caching strategy
4. Monitor for long-running processes

#### Slow Performance
1. Check database query performance
2. Review connection pooling settings
3. Monitor system resources
4. Check for blocking operations

### Debugging Production Issues

#### Enable Debug Logging
```bash
LOG_LEVEL=debug npm start
```

#### Check Application Status
```bash
# With PM2
pm2 status
pm2 logs --lines 100

# Check system resources
top
htop
```

#### Database Health
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity WHERE datname = 'your_database';

-- Check for long-running queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query 
FROM pg_stat_activity 
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';
```

### Rollback Procedure
If issues occur after deployment:
1. Stop the application
2. Deploy previous version
3. Restart the application
4. Monitor for stability

## Backup and Recovery

### Database Backup
```bash
pg_dump -h hostname -U username -d database_name > backup.sql
```

### Application Backup
Backup the following:
- Source code
- Environment files
- Database
- Uploaded files
- SSL certificates

### Recovery Process
1. Restore database from backup
2. Deploy application code
3. Configure environment variables
4. Start the application
5. Verify functionality

## Security Considerations

### Production Security
- Use HTTPS with valid certificates
- Implement rate limiting
- Regular security updates
- Monitor for vulnerabilities
- Use strong authentication

### Environment Security
- Protect environment files
- Use secrets management
- Regularly rotate secrets
- Limit access to production systems
- Implement proper access controls

## Performance Tuning

### Database Optimization
- Create proper indexes
- Optimize slow queries
- Monitor connection usage
- Tune PostgreSQL settings

### Application Optimization
- Implement caching strategies
- Optimize API responses
- Use compression
- Monitor memory usage

### Infrastructure Optimization
- Use CDN for static assets
- Implement load balancing
- Scale horizontally when needed
- Monitor system resources