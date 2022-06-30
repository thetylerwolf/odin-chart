import formatter from '../../utils/formatter'

const formatPie = result => {
  if(!result.length) return []

  const dataCols = result.slice(1)

  // TODO: Make this work for multiple
  // data columns?
  const column = dataCols[0]
  // return dataCols.map(column => {
    return column.map((v,i) => {

      return {
        name: formatter.string( result[0][i] ),
        value: formatter.number(v)
      }

    })

  // })
}

export default formatPie
