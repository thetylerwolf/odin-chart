const axis = (options) => ({
  show: Boolean( options.showHoverBox ),
  trigger: 'axis'
})

const item = (options) => ({
  show: Boolean( options.showHoverBox ),
  trigger: 'item'
})

export {
  axis,
  item
}
