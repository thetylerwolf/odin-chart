import numeral from 'numeral'

const formatMap = (result, options) => {
  if (options.mod === 'symbols' || options.mod === undefined) {
    return [
      result
        .map(item => [numeral(item[1]).value(), numeral(item[0]).value(), item[2] || `(${item[1]}, ${item[0]})`])
        .filter(v => v[0] && v[0] >= -180 && v[0] <= 180 && v[1] && v[1] >= -90 && v[1] <= 90),
    ];
  }

  if (options.mod === 'choropleth') {
    return [result.map(v => [v[0], numeral(v[1]).value()]).filter(v => v[1])];
  }

  return result;
};

export default formatMap
