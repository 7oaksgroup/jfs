var path = require('path')

var devConfig = {
  basedir: __dirname,
  migrationsDir: path.resolve(__dirname, 'migrations'),
  user: 'dbadmin',
  host: 'localhost',
  db: 'jfs'
}

var prodConfig = {
  basedir: __dirname,
  migrationsDir: path.resolve(__dirname, 'migrations'),
  user: 'dbadmin',
  host: 'jfs-prelaunch.ckiaj3czwtor.us-east-2.rds.amazonaws.com',
  db: 'jfs'
}

var config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig

require('sql-migrations').run(config)

//node ./migrate.js create migration_name
//node ./migrate.js migrate
//node ./migrate.js rollback
