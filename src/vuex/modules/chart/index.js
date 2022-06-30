import actions from './actions'
import mutations from './mutations'
import getters from './getters'

import chartTypes from '../../../config/echarts/chartTypes'
import { createCopy } from '../../../utils'

import {
  defaultChart,
  defaultSettings
} from '../../../config/echarts/defaultChart'

const state = {
  // Designer state
  submitting: false,
  loading: false,
  showShareModal: false,
  hasBeenSaved: false,
  needsSave: false,
  showDataImportModal: false,
  showDataViewModal: false,
  showRandomDataSettingsModal: false,
  chartRenderer: 'canvas',
  saveLocally: false,
  designerControlsError: '',
  // End Designer state
  selectedChart: { ...defaultChart },
  // The actual chart settings
  settings: {
    colorPalette: {
      colors: []
    },
    ...createCopy(defaultSettings)
  },
  // The object sent into echarts for presentation
  chartOptions: {},
  // metadata about the chart
  chartData: {
    shared: null,
    data_id: null,
    id: null
  },
  chartTypes
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
