// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/SpaceSushi/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Sushi Strongbox Generator',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        components: {
          default: () => import('@/pages/SushiGenerator.vue'),
        }
      },
    ],
  },
  {
    path: '/SpaceSushi/rails',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Book \'O Rails Generator',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        components: {
          default: () => import('@/pages/RailGenerator.vue'),
        }
      },
    ],
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
