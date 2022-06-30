import dateTime from '../../../utils/dateTime';
// import Parse from 'parse'

// getters
const getters = {

  getUser: (state) => {
    return state.user
  },

  // getParseUser: (state) => {
  //   return Parse.User.current()
  // },

  getErrorMessage: (state) => {
    return state.errorMessage
  },

  getLoginStatus: (state) => {
    return state.loggedIn
  },

  getColorPalettes: (state) => {
    return state.colorPalettes
  },

  getColorPaletteError: (state) => {
    return state.colorPaletteError
  },

  getCharts: (state) => {

    return state.charts.map(item => ({
      ...item,
      title: item.metadata ? item.metadata.settings.title || 'Untitled Chart' : 'Untitled Chart',
      type: item.metadata ? item.metadata.type.label : null,
      createdAt: dateTime(item.createdAt, {
        part: 'date',
      }),
    }));
  },

  getChartsError: (state) => {
    return state.chartsError
  }

}

export default getters
