import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Test from '../views/Test.vue'
import StretchHistogramPage from '../views/StretchHistogramPage.vue'
import NegationPage from '@/views/NegationPage'
import TresholdPage from '@/views/TresholdPage'
import PosterizationPage from '@/views/PosterizationPage'
import BlurPage from '@/views/BlurPage'
import Filters2DPage from '@/views/Filters2DPage'
import MaskPage from '@/views/MaskPage'
import SegmentationPage from '@/views/SegmentationPage'

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
    path: '/filters2D',
    name: 'Filters2DPage',
    component: Filters2DPage
  },
  {
    path: '/Mask',
    name: 'MaskPage',
    component: MaskPage
  },
  {
    path: '/Segmentation',
    name: 'SegmentationPage',
    component: SegmentationPage
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
