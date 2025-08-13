import { createRouter, createWebHistory } from 'vue-router'
import PricingPage from '@/pages/PricingPage.vue'
import PurchasePage from '@/pages/PurchasePage.vue'

// Get site name based on browser language
const getSiteName = () => {
  const lang = navigator.language.toLowerCase()
  const isZh = lang.startsWith('zh')
  return isZh 
    ? (import.meta.env.VITE_SITE_NAME_ZH || 'AI中转站')
    : (import.meta.env.VITE_SITE_NAME_EN || 'AI Relay')
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'pricing',
      component: PricingPage,
      meta: {
        title: getSiteName()
      }
    },
    {
      path: '/purchase/:planId',
      name: 'purchase',
      component: PurchasePage,
      meta: {
        title: `Purchase Plan - ${getSiteName()}`
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// Update document title on route change
router.beforeEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
})

export default router