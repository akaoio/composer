/**
 * PM2 Configuration for Composer Watch Service
 * Alternative to systemd for Node.js process management
 */

module.exports = {
  apps: [{
    name: 'composer-watch',
    script: './bin/composer-watch.js',
    args: '--daemon --health-check --port=3001',
    instances: 1,
    exec_mode: 'fork',
    
    // Auto-restart settings
    autorestart: true,
    watch: false, // Don't watch the app itself
    max_restarts: 10,
    min_uptime: '10s',
    
    // Environment
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    
    // Logging
    error_file: './logs/composer-watch-error.log',
    out_file: './logs/composer-watch-out.log',
    merge_logs: true,
    time: true,
    
    // Resource limits
    max_memory_restart: '500M',
    
    // Graceful shutdown
    kill_timeout: 5000,
    listen_timeout: 3000,
    
    // Monitoring
    instance_var: 'INSTANCE_ID',
    
    // Cron restart (optional - restart every day at 3 AM)
    // cron_restart: '0 3 * * *'
  }]
}