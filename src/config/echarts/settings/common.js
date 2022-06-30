import chartTypes from '../chartTypes'

export default {
  base: [{
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
  }],
  common: [{
    name: 'footnote',
    type: 'text',
    default: '',
    placeholder: 'labels.chartOptions.footnote'
  },{
    type: 'color-picker',
    name: 'backgroundColor',
    default: null,
    label: 'labels.chartOptions.backgroundColor'
  },{
    type: 'checkbox',
    name: 'showTitle',
    default: true,
    label: 'labels.chartOptions.showTitle'
  },{
    type: 'checkbox',
    name: 'drawAnimation',
    default: false,
    label: 'labels.chartOptions.drawAnimation'
  }]
}
