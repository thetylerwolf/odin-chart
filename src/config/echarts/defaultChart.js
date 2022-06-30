import chartTypes from './chartTypes'
import axisStyles from './settings/axis'
import general from './settings/common'

// initial state
// shape: [{ user: {name, email, emailVerified, uid}, loggedIn, errorMessage }]
const defaultChart = {
  type: chartTypes[0],
  mods: chartTypes[0].meta.mods || [],
  orientations: chartTypes[0].meta.orientations || [],
  styles: chartTypes[0].meta.styles || [],
  axisStyles,
  ...general,
}

const defaultSettings = {}

Object.keys(defaultChart).forEach(key => {
  if( key === 'type' ) return

  const section = defaultChart[ key ]

  if(section.values && section.values.length) {

    const s = section.values.find(v => {
      return v.name === section.default
    })

    defaultSettings[ section.name ] = s.name

  } else if( section.length ) {

    section.forEach(v => {
      defaultSettings[ v.name ] = v.default
    })

  }
})

export {
  defaultSettings,
  defaultChart
}
