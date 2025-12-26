module.exports = {
  apps: [{
    name: 'abetworks-crm-backend',
    script: './dist/server.js',
    
    // Environment variables
    env: {
      NODE_ENV: 'development',
      PORT: 5000,
      DATABASE_URL: 'postgresql://neondb_owner:npg_FZ5LUErbQly4@ep-blue-unit-adddwvsg-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
      JWT_SECRET: 'your-super-secret-jwt-key-change-in-production',
      JWT_REFRESH_SECRET: 'your-super-secret-refresh-key-change-in-production',
      LOG_LEVEL: 'debug'
    },
    
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000,
      DATABASE_URL: 'postgresql://neondb_owner:npg_FZ5LUErbQly4@ep-blue-unit-adddwvsg-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
      JWT_SECRET: 'super-secret-jwt-key-change-in-production',
      JWT_REFRESH_SECRET: 'super-secret-refresh-key-change-in-production',
      LOG_LEVEL: 'info',
      CORS_ORIGIN: 'https://yourdomain.com,https://www.yourdomain.com'
    },
    
    env_staging: {
      NODE_ENV: 'staging',
      PORT: 5000,
      DATABASE_URL: 'postgresql://neondb_owner:npg_FZ5LUErbQly4@ep-blue-unit-adddwvsg-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
      JWT_SECRET: 'staging-jwt-key-change-in-production',
      JWT_REFRESH_SECRET: 'staging-refresh-key-change-in-production',
      LOG_LEVEL: 'info',
      CORS_ORIGIN: 'https://staging.yourdomain.com'
    },
    
    // Process settings
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster', // Use cluster mode for multiple instances
    instance_var: 'NODE_APP_INSTANCE',
    
    // Restart settings
    autorestart: true,
    watch: false, // Turn off in production
    
    // Logging
    log_file: './logs/pm2-combined.log',
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    merge_logs: true,
    log_type: 'json',
    
    // Performance
    max_memory_restart: '1G',
    kill_timeout: 30000,
    wait_ready: true,
    listen_timeout: 10000,
    
    // Lifecycle hooks
    env_file: '.env',
    
    // Additional options
    max_restarts: 10,
    min_uptime: '10s',
    exp_backoff_restart_delay: 100,
    
    // Ignore files from watching (in development)
    ignore_watch: ['node_modules', 'logs', 'dist'],
    watch_options: {
      followSymlinks: false
    }
  }],
  
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'git@github.com:your-org/abetworks-crm-backend.git',
      path: '/var/www/abetworks-crm',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    },
    
    staging: {
      user: 'deploy',
      host: 'staging-server-ip',
      ref: 'origin/develop',
      repo: 'git@github.com:your-org/abetworks-crm-backend.git',
      path: '/var/www/abetworks-crm-staging',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging',
      'pre-setup': ''
    }
  }
};