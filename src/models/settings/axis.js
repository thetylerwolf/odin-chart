export default [{
  title: 'settingsSections.general',
  settings: [{
    type: 'checkbox',
    name: 'showAxes',
    default: true,
    label: 'labels.chartOptions.showAxes',
  },{
    type: 'number',
    range: [0, 20],
    default: 1,
    name: 'axisLineWidth',
    label: 'labels.chartOptions.axisLineWidth'
  }]
},{
  title: 'settingsSections.xAxis',
  settings: [{
      type: 'checkbox',
      name: 'showXTickLines',
      default: true,
      label: 'labels.chartOptions.showXTickLines',
    },
    {
      type: 'checkbox',
      name: 'showXAxisLine',
      default: true,
      label: 'labels.chartOptions.showXAxisLine',
    },
    {
      type: 'checkbox',
      name: 'showXGrid',
      default: true,
      label: 'labels.chartOptions.showXGrid',
    },
    {
      type: 'number',
      range: [0, 20],
      default: 0,
      name: 'xAxisPadding',
      label: 'labels.chartOptions.showXAxisPadding',
    }
  ]
},{
  title: 'settingsSections.yAxis',
  settings: [{
    type: 'checkbox',
    name: 'showYTickLines',
    default: true,
    label: 'labels.chartOptions.showYTickLines',
  },
  {
    type: 'checkbox',
    name: 'showYAxisLine',
    default: true,
    label: 'labels.chartOptions.showYAxisLine',
  },
  {
    type: 'checkbox',
    name: 'showYGrid',
    default: true,
    label: 'labels.chartOptions.showYGrid',
  },
  {
    type: 'number',
    range: [0, 20],
    default: 0,
    name: 'yAxisPadding',
    label: 'labels.chartOptions.showYAxisPadding',
  }]
}]
