import charts from './'

export default Object.keys(charts).map((key, index) => ({
  name: key,
  index,
  label: charts[key].name,
  meta: charts[key].meta,
  icon: charts[key].icon
}))
