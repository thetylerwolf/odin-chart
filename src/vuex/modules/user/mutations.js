// mutations
const mutations = {

  setLoginStatus ( state, status ) {
    state.loggedIn = status
  },

  setUser ( state, userData ) {
    state.user = {
      name: userData.attributes.fullName,
      email: userData.attributes.email,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      id: userData.id,
      data: userData
    }
    state.loggedIn = true
  },

  setColorPalettes( state, colorPalettes ) {
    // sorted newest to oldest
    if(colorPalettes && colorPalettes.length) {
      colorPalettes.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt) )
      state.colorPalettes = colorPalettes
    } else {
      state.colorPalettes = []
    }
  },

  setCharts( state, charts ) {
    state.charts = charts
  },

  setLoginError ( state, error ) {
    state.errorMessage = error
  },

  clearLoginError ( state ) {
    state.errorMessage = null
  },

  signout ( state ) {

    state.user = {
      name: null,
      email: null,
      emailVerified: null,
      uid: null,
    }
    state.loggedIn = false
    state.errorMessage = null

  },

  removeColorPalette( state, index ) {
    state.colorPalettes.splice( index, 1 )
  },

  setColorPaletteError( state, error ) {
    state.colorPaletteError = error
  },

  removeChart( state, index ) {
    state.charts.splice( index, 1 )
  },

  setChartError( state, error ) {
    state.chartError = error
  },

  updateChart( state, { index, keys }) {
    const updated = { ...state.charts[ index ], ...keys }

    state.charts.splice( index, 1, updated )
  }

}

export default mutations
