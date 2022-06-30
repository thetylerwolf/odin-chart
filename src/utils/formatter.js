import numeral from 'numeral'
import { DateTime } from 'luxon'

export default {

  null: (d) => null,

  d: (val) => {
    if(val === null) return null
    return DateTime.fromFormat( val, 'D' ).toString()
  },

  iso: (val) => {
    if(val === null) return null
    return DateTime.fromISO( val ).toString()
  },

  sql: (val) => {
    if(val === null) return null
    return DateTime.fromSQL( val ).toString()
  },

  localeDate: (val) => {
    if(val === null) return null
    return DateTime.fromISO( val ).toLocaleString()
  },

  number: (val) => numeral( val ).value(),

  string: (val) => val,

}
