const symbolTypes = [{
    name: 'circle',
    label: 'shapes.circle',
  },{
    name: 'rect',
    label: 'shapes.rectangle',
  },{
    name: 'triangle',
    label: 'shapes.triangle',
  },{
    name: 'none',
    label: 'shapes.none',
  }]

export default [{
  settings: [{
    type: 'checkbox',
    name: 'legend',
    default: true,
    label: 'labels.chartOptions.legend',
  }]
}]

export {
  // eslint-disable-next-line
  symbolTypes
}
