import chartTypes from '@/config/echarts/chartTypes'

export default [{
  title: 'settingsSections.basic',
  settings: [{
    name: 'title',
    type: 'text',
    default: '',
    placeholder: 'misc.chartName'
  },{
    name: 'selectedChart',
    type: 'select',
    default: chartTypes[0].name,
    placeholder: 'misc.chartType',
    values: chartTypes
  }]
}]
