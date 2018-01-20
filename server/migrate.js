var path = require('path')

var devConfig = {
  basedir: __dirname,
  migrationsDir: path.resolve(__dirname, 'migrations'),
  user: 'dbadmin',
  host: 'localhost',
  db: 'jfs'
}

var uatConfig = {
  basedir: __dirname,
  migrationsDir: path.resolve(__dirname, 'migrations'),
  user: 'dbadmin',
  host: 'jfs-prelaunch.ckiaj3czwtor.us-east-2.rds.amazonaws.com',
  db: 'jfs',
  password: process.env.DB_PASSWORD
}

var prodConfig = {
  basedir: __dirname,
  migrationsDir: path.resolve(__dirname, 'migrations'),
  user: 'jfs_prod',
  host: 'jfs-prelaunch.ckiaj3czwtor.us-east-2.rds.amazonaws.com',
  db: 'jfs_prod',
  password: process.env.DB_PASSWORD
}

const configs = {
  dev: devConfig,
  uat: uatConfig,
  production: prodConfig
}

const env = process.env.NODE_ENV || 'dev'

require('sql-migrations').run(configs[env])

//node ./migrate.js create migration_name
//node ./migrate.js migrate
//node ./migrate.js rollback
