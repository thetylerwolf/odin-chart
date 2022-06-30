//
// Deletes charts, chart data and color palettes for users that have been deleted
//

const Parse = require('parse/node')
const masterKey = require('../server/config.prod.json').masterKey

Parse.initialize('odin', null, masterKey);
// Parse.serverURL = "https://preview.odinchart.com/parse"
Parse.serverURL = "http://localhost:1337/parse"

const types = [ 'ColorPalettes', 'Charts', 'ChartData', '_Session' ]

types.forEach(type => {

  const query = new Parse.Query( type )
  query.limit(10000)

  query.find({ useMasterKey: true }).then(result => {

    console.log(type, result.length)

    result.forEach(async (object, i) => {

      let exists
      if(type === '_Session') {
        exists = await object.get('user').exists({ useMasterKey: true })
      } else {
        exists = await object.get('createdBy').exists({ useMasterKey: true })
      }

      if(!exists) {
        object.destroy({ useMasterKey: true })
      }

    })

  }).catch(err => console.log('err', err))

})
