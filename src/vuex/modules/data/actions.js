import { event } from 'vue-analytics'

import charts from '../../../config/echarts'
import { createCopy } from '../../../utils'

// actions
const actions = {

  updateData({ commit }, data) {
    commit('setData', data)

    event({
      eventCategory: 'data',
      eventAction: 'set',
      eventLabel: 'success',
      eventValue: data.length
    })
  },

  clearData({ commit }) {
    commit('setData', [])
  },

  updateRandomSettings({ commit }, settings) {
    commit('setRandomSettings', settings)
  },

  generateRandomData({ dispatch, state }, chart) {
    const { name } = chart.type;

    const data = charts[name].getRandomData(
      state.randomSettings && createCopy(state.randomSettings),
      chart
    );

    dispatch('updateData', data)
  },

}

export default actions
