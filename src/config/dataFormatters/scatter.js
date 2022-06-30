import formatter from '../../utils/formatter'

const formatScatter = (data, colTypes, options) => {
  if(!colTypes.length) return []
  const rows = data[0]

  const dataDriven = options && options.mod === 'dataDriven'
  const stepSize = dataDriven ? 3 : 2

  const f = colTypes[0].formatter
  const type = colTypes[0].type
  let xFormatter = formatter[ f ]
  const numberFormatter = formatter.number

  let format = formatter.number

  if(type === 'date') {
    xFormatter = (v) => {
      const d = formatter[f](v)
      return formatter.localeDate( d )
    }
  }

  const chartData = []

  for (let i2 = 0; i2 < colTypes.length; i2 += stepSize) {
    const res = [];

    for (let i1 = 0; i1 < rows.length; i1 += 1) {

      if (dataDriven && data[i2] && data[i2 + 1] && data[i2 + 2] !== undefined ) {

        res.push([
          xFormatter(data[i2][i1]) || 0,
          numberFormatter(data[i2 + 1][i1]) || 0,
          (numberFormatter(data[i2 + 2][i1]) && Math.abs(data[i2 + 2][i1])) || 0,
        ])

      } else {
        // eslint-disable-next-line
        if(data[i2] && data[i2 + 1] !== undefined ) {
          res.push([
            xFormatter(data[i2][i1]) || 0,
            numberFormatter(data[i2 + 1][i1]) || 0
          ])
        } else {
          // eslint-disable-next-line
          continue
        }

      }

    }

    chartData.push(res)
  }

  return chartData.filter(row => row.length)

}

export default formatScatter
