import DataSet from '@/utils/DataSet'

// mutations
const mutations = {

  setData( state, rawData ) {

    const data = new DataSet( rawData )

    state.rawData = rawData
    state.chartData = data.data
    state.columns = data.columns

  },

  setRandomSettings( state, settings ) {
    state.randomSettings = {
      ...state.randomSettings,
      ...settings
    }
  },

}

export default mutations
