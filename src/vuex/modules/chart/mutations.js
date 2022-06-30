import {
  defaultChart,
  defaultSettings
} from '../../../config/echarts/defaultChart'
import charts from '../../../config/echarts'
import { createCopy } from '@/utils'
import chartSettings from '@/models/settings'

// mutations
const mutations = {

  rebuildChart( state, { data, columnTypes }) {

    state.chartOptions = charts[ state.selectedChart.type.name ].options(
      createCopy(data),
      state.settings.colorPalette.colors,
      state.settings,
      columnTypes,
    )
  },



  setChartSettings( state, settings ) {
    state.settings = {
      ...state.settings,
      ...settings
    }

    // Have to do this to get chart settings to refresh unfortunately
    state.selectedChart = createCopy(state.selectedChart)
  },

  setColorPalette( state, { colors, name, objectId }) {
    state.settings.colorPalette = {
      colors,
      name,
      originalId: objectId,
    }
  },

  setSelectedChartType( state, chartType ) {

    state.settings.selectedChart = chartType.name

    const basic = createCopy(chartSettings.basic)
    const composition = createCopy(chartSettings.composition)
    const chartStyle = [
      ...createCopy(chartType.meta.mods || []),
      ...createCopy(chartType.meta.styles || []),
      ...createCopy(chartSettings.chartStyle)
    ]

    const titles = createCopy(chartSettings.titles)
    const legend = chartType.meta.canLegend === false ? [] : createCopy(chartSettings.legend)
    const axis = chartType.meta.canAxis === false ? [] : createCopy(chartSettings.axis)
    const annotations = createCopy(chartSettings.annotations)
    const popover = createCopy(chartSettings.popover)

    const newChartType = {
      type: chartType,
      basic,
      composition,
      chartStyle,
      titles,
      legend,
      axis,
      annotations,
      popover,
    }

    const newSettings = {}

    // Set default settings and migrate
    // settings that have already been set
    // to the new chart
    Object.keys(newChartType).forEach(key => {
      if( key === 'type' ) return


      const sections = newChartType[ key ]

      sections.forEach(section => {
        const settings = section.settings

        if( settings && settings.length ) {

          settings.forEach(setting => {

            if(setting.values && setting.values.length) {
              const previousSetting = state.settings[ setting.name ]

              if(previousSetting !== undefined) {

                const f = setting.values.find(v => {
                  return v.name === previousSetting
                })

                if(f) {
                  setting.value = previousSetting
                  newSettings[ setting.name ] = f.name
                  return
                }

              }

              const s = setting.values.find(v => {
                return v.name === setting.default
              })

              newSettings[ setting.name ] = s.name

            } else {

              const previousSetting = state.settings[ setting.name ]

              if(previousSetting !== undefined) {
                // eslint-disable-next-line
                setting.value = previousSetting
                newSettings[ setting.name ] = previousSetting
                return

              }

              newSettings[ setting.name ] = setting.default
            }
          })

        }
      })
    })

    state.settings = {
      ...state.settings,
      ...newSettings,
      selectedChart: chartType.index
    }

    state.selectedChart = { ...newChartType }
  },

  refreshSelectedChart(state) {
    state.selectedChart = { ...state.selectedChart }
  },

  setSelectedChartMods( state, chartType ) {
    state.selectedChart.mods = chartType.meta.chartMods
  },

  setChartFromLoad( state, chart ) {
    if( chart.objectId ) {
      state.hasBeenSaved = true
    }

    state.settings = { ...chart.metadata.settings }
  },

  setModal( state, { key, value }) {
    state[ key ] = value
  },

  clearChart( state ) {
    state.hasBeenSaved = false
    state.chartData = {}
    state.settings = {
      colorPalette: {
        colors: []
      },
      ...createCopy( defaultSettings )
    }
    state.selectedChart = defaultChart
  },

  setChartSaved( state, chart ) {
    state.hasBeenSaved = true
    state.chartData.id = chart.objectId
    state.chartData.data_id = chart.data_id
    state.chartData.shared = chart.shared
  },

  setSubmitting( state, submitting ) {
    state.submitting = submitting
  },

  setLoading( state, loading ) {
    state.loading = loading
  },

  setChartRenderer( state, renderer ) {
    state.chartRenderer = renderer
  },

  setState( state, { key, value }) {
    state[key] = value
  },

  setChartData( state, chartData ) {
    state.chartData = { ...state.chartData, ...chartData }
  },

  setControlsError( state, err ) {
    state.designerControlsError = err
  },

  setNeedsSave( state, value ) {
    if(!state.loading) {
      state.needsSave = value
    }
  }

}

export default mutations
