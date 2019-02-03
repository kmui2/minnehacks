module.exports = {
  apps: [
    {
      name: "Minnehacks",
      script: "node server.js 2>&1 | rtail --name Minnehacks",

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      log: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
    },
  ],
  deploy: {
    // "production" is the environment name
    development: {
      // SSH user
      user: "root",
      // SSH host
      host: ["206.189.181.215"],
      // GIT remote/branch
      ref: "origin/deployment",
      // SSH options with no command-line flag, see 'man ssh'
      // can be either a single string or an array of strings
      ssh_options: "StrictHostKeyChecking=no",
      // GIT remote
      repo: "git@github.com:kmui2/minnehacks.git",
      // path in the server
      path: "/root",
      // post-deploy action
      "post-deploy": "npm install && npm run deploy:serve",
      env: {
        "NODE_ENV": "production",
        "PORT": 80,
      },
    },
  },
};