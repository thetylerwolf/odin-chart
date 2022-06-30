import Parse from 'parse';
import { Create, Read, Update, Delete } from '../utils/dataAccess';

export const CHART_FIELDS = ['data_id', 'metadata', 'shared'];
export const COLOR_PALETTE_FIELDS = ['name', 'colors'];
export const CHARTS_DATA_FIELDS = ['data', 'shared'];
export const FEEDBACK_FIELDS = ['comment', 'type', 'state', 'location', 'user'];

export const ChartData = Parse.Object.extend('ChartData', undefined, {
  get: (id, parseJson, options) =>
    Read(
      ChartData,
      options || {
        id,
        parseJson,
      },
    ),

  create: async (obj) => {
    const chartData = await Create(ChartData, CHARTS_DATA_FIELDS, obj)
    return chartData
  },

  update: (id, obj) => Update(ChartData, id, CHARTS_DATA_FIELDS, obj),
});

export const Chart = Parse.Object.extend('Charts', undefined, {

  get: async (id, parseJson, options) => {

    const user = Parse.User.current()

    const chartId = id || (options && options.id);

    if (chartId) {
      const chart = await Read(Chart, options || { id: chartId, parseJson });

      if (chart.data || !chart.data_id) {
        return new Promise(resolve => resolve(chart));
      }

      const chartData = await ChartData.get(chart.data_id);

      return new Promise(resolve =>
        resolve({
          chart,
          data: chartData
        }),
      );

    }

    return Read(
      Chart,
      options || {
        id,
        equalTo: [['createdBy', user], ['deletedAt', null]],
        ascending: !id && 'createdAt',
        parseJson,
      },
    );
  },

  create: async (obj) => {
    const chartData = await ChartData.create({ data: obj.data, shared: obj.chart.shared });
    const chart = await Create(Chart, CHART_FIELDS, { ...obj.chart, data_id: chartData.id });

    return chart;
  },

  update: (id, obj) =>
    new Promise(async (resolve, reject) => {
      try {

        await Update(Chart, id, CHART_FIELDS, { ...obj.chart })

        if(obj.data) {
          await ChartData.update(obj.chart.data_id, { data: obj.data, shared: obj.chart.shared })
        } else if (obj.chart.data_id) {
          const chartData = await ChartData.get(obj.chart.data_id, false)
          await ChartData.update(chartData.id, { data: chartData.get('data'), shared: obj.chart.shared })
        }

        resolve(obj);
      } catch (err) {
        reject(err);
      }
    }),

  delete: id => Delete(Chart, id),
});

export const ColorPalette = Parse.Object.extend('ColorPalettes', undefined, {
  get: (id, parseJson, options) =>
    Read(
      ColorPalette,
      options || {
        id,
        equalTo: [['createdBy', Parse.User.current()], ['deletedAt', null]],
        descending: 'updatedAt',
        parseJson,
      },
    ),

  create: obj => Create(ColorPalette, COLOR_PALETTE_FIELDS, obj),

  update: (id, obj) => Update(ColorPalette, id, COLOR_PALETTE_FIELDS, obj),

  delete: id => Delete(ColorPalette, id),
});

export const Feedback = Parse.Object.extend('Feedbacks', undefined, {
  create: obj => Create(Feedback, FEEDBACK_FIELDS, obj),
});
