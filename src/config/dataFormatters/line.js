import formatter from '../../utils/formatter'

const formatLine = (columns, colTypes) => {

  if( columns.length ) {

    const type = colTypes[0].formatter
    const format = formatter[ type ]
    const numberFormat = formatter.number

    return columns.map((col,i1) => {

      return col.map((val,i2) => {
        return [
          // x value for each point
          format( columns[0][i2] ),
          // y value for each point in this column
          numberFormat( val )
        ]
      })

    }).slice(1)

  }

  return []

}

export default formatLine
