import { getRandomData, DEFAULT_COLORS } from '../util';

export default {
  name: 'charts.table',
  icon: 'fas el-icon-fa-table',
  getRandomData,
  meta: {
    styles: [
      {
        type: 'color-picker',
        name: 'headerBorderColor',
        label: 'labels.chartOptions.headerBorderColor',
      },
      {
        type: 'color-picker',
        name: 'headerTextColor',
        label: 'labels.chartOptions.headerTextColor',
      },
      {
        type: 'color-picker',
        name: 'bodyBorderColor',
        label: 'labels.chartOptions.bodyBorderColor',
      },
      {
        type: 'color-picker',
        name: 'bodyTextColor',
        label: 'labels.chartOptions.bodyTextColor',
      },
      {
        type: 'radio',
        name: 'highlighted',
        status: 'highlightedOption',
        label: 'labels.chartOptions.highlighted',
        radioOptions: [
          { name: 'highlighted', value: true, default: true },
          { name: 'non-highlighted', value: false },
        ],
      },
      {
        type: 'number',
        name: 'rowHighlightInterval',
        range: [1, 5],
        default: 1,
        label: 'labels.chartOptions.rowHighlightInterval',
      },
      {
        type: 'color-picker',
        name: 'rowHighlightColor',
        label: 'labels.chartOptions.rowHighlightColor',
      },
    ],
    axisStyle: [
      {
        type: 'checkbox',
        name: 'showGrid',
        label: 'labels.chartOptions.showGrid',
      },
    ],
  },

  options: (rawData = [], color = DEFAULT_COLORS, options = {}) => ({
    data: rawData,
    color,
    ...options,
    animation:false,
  }),
};
