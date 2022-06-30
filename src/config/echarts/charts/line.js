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
  name: 'charts.line',
  icon: 'fas el-icon-fa-chart-line',
  getRandomData,
  meta: {
    canLegend: true,
    mods: [{
      title: 'settingsSections.mods',
      settings: [{
        name: 'mod',
        type: 'select',
        default: 'line',
        values: [{
          name: 'line',
          default: true,
          label: 'charts.line',
        },
        {
          name: 'area',
          default: false,
          label: 'charts.area',
        }],
      }]
    }],
    styles: [{
      settings: [
        {
          type: 'number',
          range: [1, 10],
          default: 2,
          name: 'lineWidth',
          label: 'labels.chartOptions.lineWidth',
        },
        {
          type: 'checkbox',
          name: 'lineLabels',
          default: false,
          label: 'labels.chartOptions.lineLabels',
        },
        {
          type: 'checkbox',
          name: 'interpolation',
          default: true,
          label: 'labels.chartOptions.interpolation',
        },
        {
          name: 'seriesSymbol',
          type: 'select',
          default: 'circle',
          placeholder: 'labels.chartOptions.legendSymbol',
          values: legendSettings.symbolTypes
        }
      ]
    }]
  },

  options: (rawData = [], color = [], options = {}, columns = []) => {
    const data = formatLine(rawData, columns, options);

    return {
      ...common.base(options, color),
      ...legend.standard(options),
      ...axis.cartesian(options, columns[0]),
      // dataset: {
      //   source: rawData,
      // },
      // series: rawData[0].map((items, index) => ({
      series: data.map((items, index) => ({
        type: 'line',
        data: items,
        // TODO: not sure what the conditional is for. Maybe can remove it
        name: items[index] === 0 ? '' : columns[index + 1].title,
        label: {
          show: options.lineLabels || false,
        },
        areaStyle: options.mod === 'area' ? {} : undefined,
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
