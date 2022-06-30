import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const state = {
  rawData: [],
  chartData: [],
  randomSettings: {
    formatType: 'random',
    genRandomLabels: true,
  },
  columns: [],
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
