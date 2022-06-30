import {
  getRandomData
} from '../util';

import {
  formatLine
} from '../../dataFormatters'

import {
  common,
  axis,
  legend,
  tooltip,
} from '../configurations'

import * as legendSettings from '../settings/legend'

export default {
  name: 'charts.stackedArea',
  icon: 'fas el-icon-fa-chart-area',
  getRandomData,
  meta: {
    canLegend: true,
    styles: [{
      title: 'settingsSections.mods',
      settings: [{
        type: 'number',
        range: [1, 10],
        default: 1,
        name: 'lineWidth',
        label: 'labels.chartOptions.lineWidth',
      },
      {
        type: 'checkbox',
        default: false,
        name: 'lineLabels',
        label: 'labels.chartOptions.lineLabels',
      },
      {
        type: 'checkbox',
        default: true,
        name: 'interpolation',
        label: 'labels.chartOptions.interpolation',
      },
      {
        name: 'seriesSymbol',
        type: 'select',
        default: 'circle',
        placeholder: 'labels.chartOptions.legendSymbol',
        values: legendSettings.symbolTypes
      }]
    }]
  },

  options: (rawData = [], color = [], options = {}, columns = []) => {
    const data = formatLine(rawData, columns, options);

    return {
      ...common.base(options, color),
      ...legend.standard(options),
      ...axis.cartesianStacked(options, columns[0]),
      series: data.map((items, index) => ({
        type: 'line',
        data: items,
        stack: '1',
        name: items[index] === 0 ? '' : columns[index + 1].title,
        label: {
          show: options.lineLabels || false,
        },
        areaStyle: {},
        lineStyle: {
          width: Number(options.lineWidth) || 2,
        },
        symbol: options.seriesSymbol,
        symbolSize: 6,
        smooth: options.interpolation || false,
      })),
      tooltip: tooltip.axis(options),
    };
  },
};
