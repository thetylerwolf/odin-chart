// TODO: Set these all as pointer permissions
// as much as possible (seems that this can only
// be done via the dashboard or REST API)

Parse.Cloud.beforeSave('Charts', async (request) => {

  // Return if there is no user (because we changed
  // permissions after the user was deleted)
  if(!request.user) return

  const chart = request.object

  let ACL = request.object.getACL()

  if( !ACL ) {
    ACL = new Parse.ACL( request.user )

    ACL.setRoleReadAccess('Admin', true)
    ACL.setRoleWriteAccess('Admin', true)
  }

  if(chart.get('shared') === true) {
    ACL.setPublicReadAccess( true )
    ACL.setRoleReadAccess('StandardUser', true)
  } else {
    ACL.setPublicReadAccess( false )
    ACL.setRoleReadAccess('StandardUser', false)
  }

  chart.setACL( ACL )

  return chart

})

Parse.Cloud.beforeSave('ChartData', async (request) => {

  // Return if there is no user (because we changed
  // permissions after the user was deleted)
  if(!request.user) return

  const chartData = request.object

  let ACL = request.object.getACL()

  if( !ACL ) {
    ACL = new Parse.ACL( request.user )

    ACL.setRoleReadAccess('Admin', true)
    ACL.setRoleWriteAccess('Admin', true)
  }

  if(chartData.get('shared') === true) {
    ACL.setPublicReadAccess( true )
    ACL.setRoleReadAccess('StandardUser', true)
  } else {
    ACL.setPublicReadAccess( false )
    ACL.setRoleReadAccess('StandardUser', false)
  }

  chartData.setACL( ACL )
  // chartData.save(null, { useMasterKey: true })

  return chartData

})

// Set up for future functionality (sharing color palettes)
Parse.Cloud.beforeSave('ColorPalettes', async (request) => {

  // Return if there is no user (because we changed
  // permissions after the user was deleted)
  if(!request.user) return

  const colorPalette = request.object

  let ACL = request.object.getACL()

  if( !ACL ) {
    ACL = new Parse.ACL( request.user )

    ACL.setRoleReadAccess('Admin', true)
    ACL.setRoleWriteAccess('Admin', true)
  }

  if(colorPalette.get('shared') === true) {
    ACL.setPublicReadAccess( true )
    ACL.setRoleReadAccess('StandardUser', true)
  } else {
    ACL.setPublicReadAccess( false )
    ACL.setRoleReadAccess('StandardUser', false)
  }

  colorPalette.setACL( ACL )
  // colorPalette.save(null, { useMasterKey: true })

  return colorPalette

})

Parse.Cloud.beforeSave('Feedbacks', async (request) => {

  const feedback = request.object

  let ACL = request.object.getACL()

  if( !ACL ) {
    ACL = new Parse.ACL()

    ACL.setRoleReadAccess('Admin', true)
    ACL.setPublicReadAccess( false )
    ACL.setRoleReadAccess('StandardUser', false)
  }

  feedback.setACL( ACL )
  // feedback.save(null, { useMasterKey: true })

  return feedback

})

Parse.Cloud.afterSave(Parse.User, async (req) => {
    var user = req.object
    if (user.existed()) { return }

    var roleQuery = new Parse.Query( Parse.Role )
    roleQuery.equalTo('name', 'StandardUser')
    const role = await roleQuery.first({ useMasterKey: true })

    let userRole
    if (role) {
      role.getUsers().add(user)
      userRole = await role.save(null, { useMasterKey: true })
    } else {
      const myNewRole = new Parse.Role('StandardUser', new Parse.ACL())
      myNewRole.getUsers().add(user)
      userRole = await myNewRole.save(null, { useMasterKey: true })
    }

    const ACL = new Parse.ACL()

    ACL.setRoleReadAccess('Admin', true)
    ACL.setRoleWriteAccess('Admin', true)
    ACL.setReadAccess(user, true)
    ACL.setWriteAccess(user, true)
    // ACL.setRoleReadAccess(userRole, false)
    ACL.setPublicReadAccess( false )

    user.setACL( ACL )
    user.save(null, { useMasterKey: true })

    return user
})

Parse.Cloud.afterDelete(Parse.User, async (req) => {

  const user = req.object

  const ACL = new Parse.ACL()

  ACL.setRoleReadAccess('Admin', true)
  ACL.setRoleWriteAccess('Admin', true)
  ACL.setPublicReadAccess( false )

  const chartQuery = new Parse.Query('Charts')
  const dataQuery = new Parse.Query('ChartData')
  // const paletteQuery = new Parse.Query('ColorPalettes')

  chartQuery.limit(1000)
  chartQuery.include('createdBy')
  chartQuery.equalTo('createdBy', user)

  const charts = await chartQuery.find({ useMasterKey: true }).catch(err => console.log(err))

  charts.forEach(async chart => {
    try {
      chart.setACL( ACL )
      chart.set('shared', false)
      await chart.save(null, { useMasterKey: true })
    } catch(err) {
      console.log('error updating chart')
      console.log(err)
    }
  })

  dataQuery.limit(1000)
  dataQuery.include('createdBy')
  dataQuery.equalTo('createdBy', user)

  const data = await dataQuery.find({ useMasterKey: true }).catch(err => console.log(err))

  data.forEach(async d => {
    try {
      d.setACL( ACL )
      d.set('shared', false)
      await d.save(null, { useMasterKey: true })
    } catch(err) {
      console.log('error updating data')
      console.log(err)
    }

  })

})
