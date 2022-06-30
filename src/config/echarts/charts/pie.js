import {
  getRandomInteger,
  getRandomNumber
} from '../../../utils';

import {
  formatPie
} from '../../dataFormatters'

import {
  common,
  legend,
  tooltip,
} from '../configurations'

export default {
  name: 'charts.pie',
  icon: 'fas el-icon-fa-chart-pie',
  getRandomData: options => {
    const items = [
      ['IT', 'Financials', 'Energy', 'Transport', 'Politics', 'education'],
      ['Toyota', 'Suzuki', 'Honda', 'FAW', 'Nissan', 'Mitsubishi'],
      ['NOC', 'DRI ', 'FTI', 'NWS', 'CAH', 'Keys', 'ATVI', 'WDC'],
      [
        'Officer',
        'Accountant ',
        'Lawyer',
        'Architect',
        'Programmer',
        'Designer',
        'Consultant',
        'Secretary',
      ],
      [
        'Audiologist',
        'Allergist ',
        'Cardiologist',
        'Dentist',
        'Endocrinologist',
        'Epidemiologist',
        'Gynecologist',
        'Immunologist',
      ],
      ['detective', 'corporal ', 'sergeant', 'lieutenant', 'captain', 'officer'],
    ];
    return [
      ['x', 'y'],
      ...items[
        options && options.genRandomLabels === true ? getRandomInteger(0, items.length - 1) : 1
      ].map(item => [
        item,
        options && options.dataType === 'decimals'
          ? getRandomNumber(0, 10)
          : getRandomInteger(0, 10),
      ]),
    ];
  },
  meta: {
    canLegend: true,
    canAxis: false,
    mods: [{
      title: 'settingsSections.mods',
      settings: [{
        name: 'mod',
        type: 'select',
        default: 'donut',
        values: [{
          name: 'pie',
          label: 'charts.pie',
        },{
          name: 'donut',
          label: 'charts.donut',
        }],
      }],
    }],
    styles: [{
      settings: [{
        type: 'number',
        range: [0, 60],
        default: 20,
        noShowIf: 'pie',
        name: 'innerRadius',
        label: 'labels.chartOptions.innerRadius',
      },
      {
        type: 'checkbox',
        name: 'showLabels',
        default: true,
        label: 'labels.chartOptions.showLabels',
      }],
    }],
  },

  options: (rawData = [], color = [], options = {}, columns = []) => {
    const data = formatPie(rawData, columns, options);

    return {
      ...common.base(options, color),
      ...legend.standard(options),
      series: {
        type: 'pie',
        center: [ '50%', '55%'],
        radius: [
          // eslint-disable-next-line
          !options.mod || options.mod === 'pie'
            ? '0%'
            : options.innerRadius && Number(options.innerRadius) >= 0
            ? `${options.innerRadius}%`
            : '20%',
          '70%',
        ],
        data: data.length ? data : [],
        label: {
          show: options.showLabels || false,
        },
        labelLine: {
          show: false,
        },
      },
      tooltip: tooltip.item(options),
    };
  },
};
