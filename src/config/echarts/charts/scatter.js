import { getRandomData } from '../util';

import {
  formatScatter
} from '../../dataFormatters'

import {
  common,
  axis,
  legend,
  tooltip,
} from '../configurations'

export default {
  name: 'charts.scatter',
  icon: 'fas el-icon-fa-braille',
  getRandomData,
  meta: {
    canLegend: true,
    mods: [{
      title: 'settingsSections.mods',
      settings: [{
        name: 'mod',
        type: 'select',
        default: 'fixed',
        values: [
        {
          name: 'fixed',
          label: 'charts.fixed',
        },
        {
          name: 'dataDriven',
          label: 'charts.dataDriven',
        }]
      }]
    }],
    styles: [{
      settings: [{
        type: 'number',
        range: [1, 50],
        default: 10,
        name: 'symbolSize',
        noShowIf: 'dataDriven',
        label: 'labels.chartOptions.symbolSize',
      }]
    }]
  },

  options: (rawData = [], color = [], options = {}, columns = []) => {
    const data = formatScatter(rawData, columns, options);
    const dataDriven = options && options.mod === 'dataDriven'

    return {
      ...common.base(options, color),
      ...legend.standard(options),
      ...axis.cartesianScatter(options, columns[0]),
      series: data.map((values, index) => {
        const name = dataDriven ? columns[index * 3].title : columns[index * 2].title

        return {
          type: 'scatter',
          data: values.map(value => {
            let symbolSize = value[2] || Number(options.symbolSize) || 10;
            const minSymbolSize = 1;
            const maxSymbolSize = 200;

            if (value[2]) {
              if (value[2] < minSymbolSize) {
                symbolSize = minSymbolSize;
              } else if (value[2] > maxSymbolSize) {
                symbolSize = maxSymbolSize;
              }
            }

            return {
              value: [value[0], value[1]],
              symbolSize,
            };
          }),
          name,
          label: {
            show: options.lineLabels || false,
          },
        }
      }),
      color,
      tooltip: tooltip.item(options),
    };
  },
};
