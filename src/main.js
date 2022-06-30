// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import i18n from '@/config/localization'
// TODO: Re-add gAuth
// import gAuth from '@/config/gAuth'
// eslint-disable-next-line
import VueAnalytics from 'vue-analytics'
// eslint-disable-next-line
import { set } from 'vue-analytics'

import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import 'element-ui/lib/theme-chalk/reset.css'
import './assets/scss/index.scss'

import './config/parse'

import App from './App'
import router from './router'
import store from './vuex/store'

import Default from './layouts/Default'
import Main from './layouts/Main'
import MainPublic from './layouts/MainPublic'

VueClipboard.config.autoSetContainer = true

Vue.use(VueClipboard)
Vue.use(ElementUI, { locale })
Vue.component('default-layout', Default)
Vue.component('main-layout', Main)
Vue.component('main-public-layout', MainPublic)

Vue.config.productionTip = false
Vue.use( VueAnalytics, {
  id: 'UA-62009464-4',
  router,
  debug: {
    sendHitTask: process.env.NODE_ENV === 'production',
  },
})

store.dispatch('user/checkLoggedIn').then(user => {
  if(user) {
    set('userid', user.id)
  }

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    i18n,
    // TODO: Re-add gAuth
    // gAuth,
    store,
    components: { App },
    template: '<App/>',
  })
})
