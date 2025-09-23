module.exports = {
  apps: [{
    name: "sigo-api",
    script: "index.js",
    exec_mode: "fork",
    instances: 1,
    env: { NODE_ENV: "development" },
    env_production: { NODE_ENV: "production", PORT: 3001 }
  }]
}
