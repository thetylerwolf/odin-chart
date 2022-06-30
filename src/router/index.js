import Vue from 'vue';
import Router from 'vue-router';

import routes from './routes';
import store from '../vuex/store'

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = store.state.user.loggedIn
  const requiresAuth = to.matched.some(record => record.meta.auth)
  const isPreLogin = to.matched.some(record => record.name === 'index' || record.name === 'login' || record.name === 'signup')

  if (requiresAuth && !loggedIn) next('/')
  else if (!requiresAuth && loggedIn && isPreLogin) next('home')
  else next()
})

export default router;
