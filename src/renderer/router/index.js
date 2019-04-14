import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'startscreen',
      component: require('@/components/StartScreen').default
    },
    {
      path: '/kc3-panel',
      name: 'kc3-panel',
      component: require('@/components/KC3Panel').default
    },
    {
      path: '/dev/icons',
      name: 'dev-icons',
      component: require('@/components/dev/Icons').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
