import { DateTime } from 'luxon'
import numeral from 'numeral'
import { zip } from 'd3-array'

export default class DataSet {

  constructor(data = []) {

    this.data = zip(...data)

    if(!data.length) {
      return
    }

    this.columns = this.checkDataTypes()
    this.data = this.data.map(d => d.slice(1))

  }

  setData(data) {
    if(!data) {
      throw new Error('DataSet setter requires data')
    }

    if(data.length) {
      this.columns = this.checkDataTypes()
    } else {
      this.columns = []
    }
  }

  checkDataTypes() {

    // can be any of: ['date', 'string', 'number']

    const cols = this.data

    const identifiedCols = cols.map(col => {
      const withoutHeaders = col.slice(1)
      const withoutNulls = withoutHeaders.filter((val) => !this.checkNull(val))

      // Check for each type here
      const isNull = !withoutNulls.length
      // If it is null, that's ok because it's an empty array
      // so the following checks will take 0 operations
      const isDate = withoutNulls.every(this.checkDate)
      const isNumber = withoutNulls.every(this.checkNumber)
      const isString = withoutNulls.every(this.checkString)

      return {
        null: isNull,
        date: isDate,
        string: isString,
        number: isNumber
      }
    })

    const colTypes = identifiedCols.map((c,i) => {
      const column = {
        type: '',
        axisType: '',
        formatter: '',
        title: ''
      }

      if(c.null) {
        column.formatter = 'null',
        column.type = 'null'
        column.axisType = null
      } else if (c.date) {
        column.formatter = this.checkDate( cols[i][1] )
        column.type = 'date'
        column.axisType = 'time'
      } else if (c.string) {
        column.formatter = 'string'
        column.type = 'string'
        column.axisType = 'category'
      } else if (c.number) {
        column.formatter = 'number'
        column.type = 'number'
        column.axisType = 'value'
      } else {
        // If nothing is a sure thing,
        // fall back to string.
        // Maybe give a notification in the future
        column.formatter = 'string'
        column.type = 'string'
        column.axisType = 'category'
      }

      column.title = this.data[i][0]

      return column
    })

    return colTypes
  }

  checkNull(val) {
    return val === null
  }

  checkDate(val) {
    if(typeof val === 'number' || val === null) return false

    const checks = [
      DateTime.fromISO( val ),
      DateTime.fromSQL( val ),
      DateTime.fromFormat( val, 'D' )
    ]

    let foundIndex = null
    // check if any are valid. If all are not, it's not dates
    const valid = checks.some((d, i) => {
      const isValid = Boolean( !d.invalid )
      if(isValid) {
        foundIndex = i
      }

      return isValid
    })

    let type = ''

    if(valid) {
      switch(foundIndex) {
        case 0:
          type = 'iso'
          break
        case 1:
          type = 'sql'
          break
        case 2:
          type = 'd'
          break
      }
    }

    return valid ? type : valid

  }

  checkNumber(val) {

    if(typeof val === 'number') return true

    return Boolean( numeral( val ).value() )

  }

  checkString(val) {

    if(typeof val === 'number' || val === null) return false

    const splitString = val.trim().split('')

    // If more characters than numbers,
    // call it a string
    const unitCount = splitString.reduce((prev, curr) => {
      if(+curr) {
        prev.num += 1
      } else {
        prev.char += 1
      }

      return prev

    }, { num: 0, char: 0 })

    return (unitCount.char >= unitCount.num)

  }

  formatCol(col, formatter) {
    let colParser = (d) => d

    switch (formatter) {
      case 'number':
        colParser = (d) => numeral(d).value()
        break
      case 'date':
        colParser = (d) => DateTime.fromFormat(d, 'D').toString()
        break
      case 'string':
        colParser = (d) => d
        break
      default:
        break
    }

    return col.map(colParser)
  }

}
