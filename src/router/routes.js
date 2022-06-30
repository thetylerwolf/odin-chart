export default [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/Login'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login'),
  },
  {
    path: '/resetpassword',
    name: 'resetPassword',
    component: () => import('@/views/ResetPassword'),
  },
  // TODO: remove blocking after alpha
  {

    path: '/signup/:status?',
    name: 'signup',
    component: () => import('@/views/SignUp'),
    beforeEnter: (to, from, next) => {

      if(process.env.NODE_ENV === 'production') {
        if(to.params.status === 'supersecret!') {
          return next()
        }

        return next('/')
      }

      return next()
    }
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      layout: 'main',
      auth: true,
    },
    component: () => import('@/views/Home'),
  },
  {
    path: '/designer/:id?',
    meta: {
      layout: 'main',
      auth: true,
    },
    component: () => import('@/views/ChartDesigner'),
  },
  {
    path: '/account',
    meta: {
      layout: 'main',
      auth: true,
    },
    component: () => import('@/views/Account'),
  },
  {
    path: '/plugins',
    meta: {
      layout: 'main',
      auth: true,
    },
    component: () => import('@/views/Plugins'),
  },
  {
    path: '/_/:id',
    component: () => import('@/views/ChartViewer'),
  },
  {
    path: '*',
    component: () => import('@/views/404'),
  },
  {
    path: '/faq',
    meta: {
      layout: 'main-public',
    },
    component: () => import('@/views/Faqs'),
  },
];
