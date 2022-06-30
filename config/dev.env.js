'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SERVER_URL: '"http://localhost:1337/parse"',
  API_URL: '"http://localhost:1337/api"',
  databaseURI:'"mongodb://127.0.0.1:27017/odin"'
})
