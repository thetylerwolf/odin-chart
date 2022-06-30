import formatter from '../../utils/formatter'

const formatBar = (columns, colTypes) => {

  if(columns.length) {

    return columns.map((col,i) => col.map(val => {

        // Have to do some tricker with dates
        // for bar charts because they don't work
        // with time axis
        let v = val
        let format = formatter.number

        if(!i) {
          const f = colTypes[0].formatter
          const type = colTypes[0].type

          if(type === 'date') {
            v = formatter[ f ]( val )
            format = formatter.localeDate
          } else {
            format = formatter[ f ]
          }

        }

        return format( v ) || v
      })
    )

  }

  return []

}

export default formatBar
