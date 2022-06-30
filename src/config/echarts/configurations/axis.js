const cartesian = (options, xColumn = { axisType: 'value' }) => {

  return {
    xAxis: [
      {
        show: options.showAxes || false,
        splitLine: {
          show: options.showXGrid || false,
        },
        // showGrid: true,
        axisTick: {
          show: options.showXTickLines || false,
        },
        axisLabel: {
          padding: options.xAxisPadding,
        },
        axisLine: {
          show: options.showXAxisLine || false,
          lineStyle: {
            width: options.axisLineWidth,
          },
        },
        type: xColumn.axisType,
      },
    ],
    yAxis: [
      {
        show: options.showAxes || false,
        splitLine: {
          show: options.showYGrid || false,
        },
        axisTick: {
          show: options.showYTickLines || false,
        },
        axisLabel: {
          padding: options.yAxisPadding,
        },
        axisLine: {
          show: options.showYAxisLine || false,
          lineStyle: {
            width: options.axisLineWidth,
          },
        },
      },
    ],
  }
}

const cartesianStacked = (options, xColumn = { axisType: 'category' }) => {
  const axes = cartesian( options, xColumn )
  const xType = 'category'

  axes.xAxis[0].type = xType
  axes.xAxis[0].boundaryGap = false

  return axes
}

const cartesianBar = (options, xColumn = { axisType: 'value' }) => {
  const axes = cartesian( options, xColumn )
  let xType

  switch(xColumn.axisType) {
    case 'time':
      xType = 'category'
      break
    default:
      xType = xColumn.axisType
  }

  axes.xAxis[0].type = xType

  return axes
}

const cartesianScatter = (options, xColumn = { axisType: 'value' }) => {
  const axes = cartesianBar( options, xColumn )
  if(xColumn.axisType === 'time') {
    axes.xAxis[0].boundaryGap = false
  }

  return axes
}

const radial = (options) => ({
  options
})

export {
  cartesian,
  cartesianBar,
  cartesianScatter,
  cartesianStacked,
  radial
}
