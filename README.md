# JFS

1. Install serverless globally
```console
$ npm install serverless -g
```
2. Run serverless offline
```console
$ cd server
$ npm install
$ sls offline start
```

## Notes

To create migrations: 
```sh
node migrate.js create `migration name`
```