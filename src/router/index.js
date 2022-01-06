import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Test from '../views/Test.vue'
import StretchHistogramPage from '../views/StretchHistogramPage.vue'
import NegationPage from '@/views/NegationPage'
import TresholdPage from '@/views/TresholdPage'
import PosterizationPage from '@/views/PosterizationPage'
import BlurPage from '@/views/BlurPage'
import Filters2DPage from '@/views/Filters2DPage'
import MaskPage from '@/views/MaskPage'
import SegmentationPage from '@/views/SegmentationPage'
import Files from '@/views/Files'

Vue.use(VueRouter)

// route level code-splitting
// this generates a separate chunk (about.[hash].js) for this route
// which is lazy-loaded when the route is visited.
const routes = [
  {
    path: '/',
    name: 'FilesPage',
    component: Files,
    // component: () => import(/* webpackChunkName: "about" */ '../views/Files.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
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
  // progowanie
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
  // wygładzanie liniowe (blur)
  {
    path: '/blur',
    name: 'BlurPage',
    component: BlurPage
  },
  // wyostrzanie liniowe
  {
    path: '/filters2D',
    name: 'Filters2DPage',
    component: Filters2DPage
  },
  // dwuargumentowe
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
  }
]

const router = new VueRouter({
  routes
})

export default router
