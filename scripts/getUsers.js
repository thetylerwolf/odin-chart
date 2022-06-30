const Parse = require('parse/node')
const masterKey = require('../server/config.prod.json').masterKey

Parse.initialize('odin', null, masterKey);
Parse.serverURL = "https://preview.odinchart.com/parse"

const query = new Parse.Query('User')

query.find().then(users => {
  const ids = users.map(user => user.id)
  console.log(ids.length)
  console.log(ids.join(','))
})
