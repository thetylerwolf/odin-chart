import actions from './actions'
import mutations from './mutations'
import getters from './getters'

// initial state
// shape: [{ user: {name, email, emailVerified, uid}, loggedIn, errorMessage }]
const state = {
  user: {
    name: null,
    email: null,
    emailVerified: null,
    id: null,
  },
  colorPalettes: [],
  colorPaletteError: null,
  charts: [],
  chartError: null,
  loggedIn: false,
  errorMessage: null,
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
