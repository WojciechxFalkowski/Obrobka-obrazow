import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Test from '../views/Test.vue'
import StretchHistogramPage from '../views/StretchHistogramPage.vue'
import NegationPage from '@/views/NegationPage'
import TresholdPage from '@/views/TresholdPage'
import PosterizationPage from '@/views/PosterizationPage'
import BlurPage from '@/views/BlurPage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/stretch-histogram',
    name: 'StretchHistogramPage',
    component: StretchHistogramPage
  },
  {
    path: '/negation',
    name: 'NegationPage',
    component: NegationPage
  },
  {
    path: '/treshold',
    name: 'TresholdPage',
    component: TresholdPage
  },
  {
    path: '/posterization',
    name: 'PosterizationPage',
    component: PosterizationPage
  },
  {
    path: '/blur',
    name: 'BlurPage',
    component: BlurPage
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
  },
  {
    path: '/files',
    name: 'FilesPage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Files.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
