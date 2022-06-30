import { getRandomData, DEFAULT_COLORS, getColors } from '../util';
import * as countries from '../../../assets/maps/index';
import { getRandomInteger } from '../../../utils';

import {
  formatMap
} from '../../dataFormatters'

export default {
  name: 'charts.map',
  icon: 'fas el-icon-fa-globe-americas',
  getRandomData: (options, chart) => {

    if (chart.mods.value === 'symbols' || chart.mods.value === undefined) {
      return getRandomData({ ...options, chart, length: 3, range: [-90, 90] });
    }

    if (chart.mods.value === 'choropleth') {
      const mapTypeName =
        chart.MapType && chart.MapType.type.name === 'USA' ? 'State' : 'Countries';

      return [
        [mapTypeName, 'Population'],
        ...countries.default[(chart.MapType && chart.MapType.type.name) || 'world'].map(state => [
          state.name,
          getRandomInteger(10000, 700000),
        ]),
      ];
    }

    return [];
  },
  meta: {
    mods: {
      name: 'mod',
      type: 'select',
      default: 'symbols',
      values: [{
        name: 'symbols',
        default: true,
        label: 'charts.symbolsOnMap',
      },{
        name: 'choropleth',
        label: 'charts.choropleth',
      }],
    },
    styles: [
      {
        type: 'number',
        range: [1, 50],
        default: 10,
        noShowIf: 'choropleth',
        name: 'symbolSize',
        label: 'labels.chartOptions.symbolSize',
      },
      {
        type: 'checkbox',
        name: 'showHoverBox',
        label: 'labels.chartOptions.showHoverbox',
      },
    ]
  },

  options: (rawData = [], color = DEFAULT_COLORS, options = {}) => {
    const data = formatMap(rawData, options);

    return {
      title: {
        text: options.title,
        show: options.showTitle || false,
      },
      geo:
        !options.mod || options.mod === 'symbols'
          ? {
              map: options.MapType ? options.MapType.name : 'world',
              roam: true,
              label: {
                show: true,
                normal: {
                  formatter: '{b}',
                  position: 'right',
                  show: false,
                },
              },
              tooltip: {
                show: !!options.showHoverBox,
              },
              backgroundColor: options.backgroundColor || 'transparent',
              itemStyle: {
                normal: {},
                emphasis: {
                  areaColor: getColors(color)[3 % getColors(color).length],
                },
              },
            }
          : {},
      series:
        !options.mod || options.mod === 'symbols'
          ? [
              {
                type: 'scatter',
                coordinateSystem: 'geo',
                data: data.length
                  ? data[0].map(item => ({
                      name: item[2],
                      value: item,
                    }))
                  : [],
                symbolSize: Number(options.symbolSize) || 20,
                label: {
                  show: true,
                  normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true,
                  },
                  emphasis: {
                    show: true,
                  },
                },
                itemStyle: {
                  normal: {
                    color: getColors(color)[0],
                  },
                },
              },
            ]
          : [
              {
                name: '',
                type: 'map',
                mapType: options.MapType ? options.MapType.name : 'world',
                roam: true,
                itemStyle: {
                  emphasis: { label: { show: true } },
                  normal: {
                    label: { show: false },
                  },
                },
                data: data.length
                  ? data[0].map(item => {
                      return { name: item[0], value: item[1] };
                    })
                  : [],
              },
            ],
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        show: !!options.showHoverBox,
        showDelay: 0,
        transitionDuration: 0.2,
        formatter(params) {
          let value = `${params.value}`.split('.');
          value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
          return `${params.seriesName}<br/>${params.name}: ${value}`;
        },
      },
      visualMap: {
        show: options.mod === 'choropleth',
        min: 0,
        max: 1000000,
        text: ['High', 'Low'],
        realtime: false,
        calculable: false,
        inRange: {
          color:
            color.length > 0
              ? color.slice(0, 4)
              : [
                  getColors(color)[2 % getColors(color).length],
                  getColors(color)[1 % getColors(color).length],
                ],
        },
      },
    };
  },
};
