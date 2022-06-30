import {
  getRandomData
} from '../util';

import {
  formatBar
} from '../../dataFormatters'

import {
  common,
  axis,
  legend,
  tooltip,
} from '../configurations'

export default {
  name: 'charts.bar',
  icon: 'fas el-icon-fa-chart-bar',
  getRandomData,
  meta: {
    canLegend: true,
    mods: [{
      title: 'settingsSections.mods',
      settings: [{
        name: 'mod',
        type: 'select',
        default: 'grouped',
        values: [
        {
          name: 'grouped',
          group: 'A',
          label: 'charts.groupedBar',
        },
        {
          name: 'stacked',
          group: 'A',
          label: 'charts.stackedBar',
        }],
      },
      {
        name: 'orientation',
        type: 'select',
        default: 'horizontal',
        values: [{
          name: 'horizontal',
          group: 'B',
          label: 'charts.horizontalBar',
        },
        {
          name: 'vertical',
          group: 'B',
          label: 'charts.verticalBar',
        }],
      }]
    }],
    // styles: [{
    //   settings: [{
    //     type: 'number',
    //     range: [5, 30],
    //     default: 5,
    //     name: 'barWidth',
    //     label: 'labels.chartOptions.barWidth',
    //   }],
    // }]
  },

  options: (rawData = [], color = [], options = {}, columns = []) => {

    const data = formatBar(rawData, columns, options);
    let seriesData = [];

    if (!rawData[0]) {
      seriesData = []
    } else if (options.mod === 'grouped' || options.mod === 'stacked') {

      seriesData = Array.from({ length: data.length })
        .map((name, i) => ({
          name: columns[i].title,
          type: 'bar',
          label: {
            normal: {
              show: false,
              position: 'insideRight',
            },
          },
          stack: options.mod === 'grouped' ? null : '1',
          data: data[i],
        }))
        .slice(1);

    } else {
      // TODO: Not sure what case this would be used in
      seriesData =
        data[0] &&
        data[0].length > 0 &&
        data.map((item, index) => ({
          type: 'bar',
          name: item[index] === 0 ? '' : columns[index + 1].title,
          data: item.map(i => i[1]).slice(1),
          barWidth: Number(options.barWidth) || 20,
          label: {
            show: options.lineLabels || false,
          },
        }));
    }

    const axisConfig = axis.cartesianBar(options, columns[0])

    const axis1 = options.orientation === 'horizontal' ? 'yAxis' : 'xAxis'
    const axis2 = options.orientation === 'horizontal' ? 'xAxis' : 'yAxis'

    return {
      ...common.base(options, color),
      ...legend.standard(options),
      [axis1]: {
        ...(axisConfig[axis1][0]),
        type: 'category',
        data: data.length ? data[0] : [],
      },
      [axis2]: {
        ...(axisConfig[axis2][0]),
        type: 'value',
      },
      series: seriesData,
      tooltip: tooltip.axis(options),
    };
  },
};
