module.exports = {
  apps: [
    {
      name: 'domiciliation-api',
      script: './back/server.js',
      cwd: '/var/www/domiciliation',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/var/log/domiciliation/error.log',
      out_file: '/var/log/domiciliation/out.log',
      max_memory_restart: '256M',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
    },
  ],
};
