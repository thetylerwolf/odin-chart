import { event } from 'vue-analytics'

import {
  Chart
} from '../../../models'
import { createCopy } from '../../../utils'

// actions
const actions = {

  rebuildChart({ commit, rootState }) {
    commit('rebuildChart', {
      data: rootState.data.chartData,
      columnTypes: rootState.data.columns
    })
  },

  setColorPalette ({ commit, dispatch }, colorPalette) {

    commit('setColorPalette', colorPalette)
    dispatch('rebuildChart')
    commit('setNeedsSave', true)

    event({
      eventCategory: 'chartSetting',
      eventAction: 'set',
      eventLabel: 'colorPalette',
      eventValue: 1
    })

  },

  // updateSettingsUI({ commit }) {
  //   commit('refreshSelectedChart')
  // },

  updateSelectedChartType({ commit, dispatch }, chartType) {

    commit('setSelectedChartType', chartType)
    dispatch('rebuildChart')
    commit('setNeedsSave', true)

    event({
      eventCategory: 'chartSetting',
      eventAction: 'set',
      eventLabel: 'type',
      eventValue: chartType.name
    })

  },

  refreshSelectedChart({ commit }) {
    // Kick selectedChart to refresh chart settings
    // TODO: fix this
    commit('refreshSelectedChart')
  },

  updateChartSettings({ commit, dispatch }, settings) {

    commit('setChartSettings', settings)
    dispatch('rebuildChart')
    commit('setNeedsSave', true)

    event({
      eventCategory: 'chartSetting',
      eventAction: 'set',
      eventLabel: 'general',
      eventValue: Object.keys(settings).join('_')
    })

  },

  notifyDataUpdate({ commit }) {
    commit('setNeedsSave', true)
  },

  setChart({ commit, dispatch }, chart) {

    commit('setChart', chart)
    dispatch('rebuildChart')

  },

  showHideShareModal({ commit }, show) {

    commit('setModal', { key: 'showShareModal', value: show })

    event({
      eventCategory: 'UI',
      eventAction: 'showHide',
      eventLabel: 'shareModal',
      eventValue: show
    })

  },

  showHideDataViewModal({ commit }, show) {

    commit('setModal', { key: 'showDataViewModal', value: show })

    event({
      eventCategory: 'UI',
      eventAction: 'showHide',
      eventLabel: 'dataViewModal',
      eventValue: show
    })

  },

  showHideDataImportModal({ commit }, show) {

    commit('setModal', { key: 'showDataImportModal', value: show })

    event({
      eventCategory: 'UI',
      eventAction: 'showHide',
      eventLabel: 'dataImportModal',
      eventValue: show
    })

  },

  // TODO: Decide whether or not to keep this
  showHideRandomDataSettingsModal({ commit }, show) {

    commit('setModal', { key: 'showRandomDataSettingsModal', value: show })

    event({
      eventCategory: 'UI',
      eventAction: 'showHide',
      eventLabel: 'randomDataModal',
      eventValue: show
    })

  },

  setChartRenderer({ commit }, renderer) {

    commit('setChartRenderer', renderer)

  },

  clearChart({ commit }) {

    commit('clearChart')

  },

  loadChart({ commit, dispatch, state }, id) {

    commit('setLoading', true)

    return Chart.get(id)
      .then((result) => {

        commit('setChartFromLoad', result.chart)
        commit('setChartSaved', result.chart)

        const setChart = state.chartTypes.find(type => {
          return type.name === result.chart.metadata.type.name
        })

        commit('setSelectedChartType', setChart )
        dispatch('data/updateData', result.data.data, { root: true })
        dispatch('rebuildChart')
        commit('setLoading', false)
        commit('setNeedsSave', false)

        event({
          eventCategory: 'chart',
          eventAction: 'load',
          eventLabel: 'success',
          eventValue: 1
        })
      })
      .catch(err => {
        // eslint-disable-next-line
        console.error('error loading chart', id, err)
        commit('setControlsError', err)
        commit('setLoading', false)
        commit('setSubmitting', false)

        event({
          eventCategory: 'chart',
          eventAction: 'load',
          eventLabel: 'failure',
          eventValue: 1
        })
      })

  },

  loadChartForViewer({ commit, dispatch }, id) {

    return Chart.get(undefined, undefined, {
      id,
      equalTo: [['shared', true], ['deletedAt', null]],
    })
      .then((result) => {
        commit('setChartFromLoad', result.chart)
        commit('setChartSaved', result.chart)
        commit('setSelectedChartType')
        dispatch('data/updateData', result.data.data, { root: true })
        dispatch('rebuildChart')

        event({
          eventCategory: 'sharedChart',
          eventAction: 'load',
          eventLabel: 'success',
          eventValue: 1
        })
      })
      .catch(err => {
        // eslint-disable-next-line
        console.error(err)

        event({
          eventCategory: 'sharedChart',
          eventAction: 'load',
          eventLabel: 'failure',
          eventValue: 1
        })

        return err
      })

  },

  createChart({ commit, state, rootState }) {
    commit('setSubmitting', true)

    const settings = createCopy(state.settings)
    settings.colorPalette.createdBy = rootState.user.user.id

    const chartObject = {
      metadata: {
        type: {
          label: state.selectedChart.type.label,
          name: state.selectedChart.type.name
        },
        settings
      },
      shared: state.chartData.shared,
      data_id: state.chartData.data_id
    }

    return Chart.create({
      chart: chartObject,
      data: rootState.data.rawData
    })
      .then(result => {
        commit('setChartSaved', {
          objectId: result.id,
          data_id: result.attributes.data_id,
          shared: result.attributes.shared
        })
        // createCopy(result);
        // this.makeSvgCopy(result.id);
        commit('setSubmitting', false)
        commit('setNeedsSave', false)

        event({
          eventCategory: 'chart',
          eventAction: 'create',
          eventLabel: 'success',
          eventValue: state.selectedChart.type.name
        })
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.error(err)
        commit('setControlsError', err)
        commit('setSubmitting', false)

        event({
          eventCategory: 'chart',
          eventAction: 'create',
          eventLabel: 'failure',
          eventValue: state.selectedChart.type.name
        })

      })

  },

  updateChart({ commit, rootState, state }) {

    commit('setSubmitting', true)

    const settings = createCopy(state.settings)
    settings.colorPalette.createdBy = rootState.user.user.id


    const chartObject = {
      metadata: {
        type: {
          label: state.selectedChart.type.label,
          name: state.selectedChart.type.name
        },
        settings
      },
      shared: state.chartData.shared,
      data_id: state.chartData.data_id
    }

    return Chart.update(state.chartData.id, {
      chart: chartObject,
      data: rootState.data.rawData
    })
      .then(result => {
        commit('setChartSaved', {
          objectId: state.chartData.id,
          data_id: result.chart.data_id,
          shared: result.chart.shared
        })
        // createCopy(result)
        // this.makeSvgCopy(chart.objectId)
        commit('setSubmitting', false)
        commit('setNeedsSave', false)

        event({
          eventCategory: 'chart',
          eventAction: 'update',
          eventLabel: 'success',
          eventValue: state.selectedChart.type.name
        })
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.error(err)
        commit('setControlsError', err)
        commit('setSubmitting', false)

        event({
          eventCategory: 'chart',
          eventAction: 'update',
          eventLabel: 'failure',
          eventValue: state.selectedChart.type.name
        })
      })

  },

  duplicateChart({ state, rootState, commit, dispatch }) {

    if (state.chartData.id) {

        dispatch('updateChart')

        const chartObject = {
          metadata: {
            type: {
              label: state.selectedChart.type.label,
              name: state.selectedChart.type.name
            },
            settings: {
              ...state.settings,
              title: `Copy of ${ state.settings.title }`
            }
          },
          shared: state.chartData.shared,
          data_id: null
        }

        commit('setSubmitting', true)

        return Chart.create({
            chart: chartObject,
            data: rootState.data.rawData
          })
          .then(result => {
            commit('setSubmitting', false)

            event({
              eventCategory: 'chart',
              eventAction: 'duplicate',
              eventLabel: 'success',
              eventValue: state.selectedChart.type.name
            })
            return result
          })
          .catch((err) => {
            // eslint-disable-next-line
            console.error(err)
            commit('setControlsError', err)
            commit('setSubmitting', false)

            event({
              eventCategory: 'chart',
              eventAction: 'duplicate',
              eventLabel: 'failure',
              eventValue: state.selectedChart.type.name
            })
          })
      }

      return false

  },

  setChartSharing({ commit }, shared) {
    commit('setChartData', { shared })

    event({
      eventCategory: 'chart',
      eventAction: 'shared',
      eventLabel: 'shared',
      eventValue: shared
    })
  },

  // TODO: Don't use this for downloading images
  setSaveLocally({ commit }, saveLocally) {
    commit('setState', { key: 'saveLocally', value: saveLocally })
  },

}

export default actions
