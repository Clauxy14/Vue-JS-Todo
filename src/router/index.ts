import { createRouter, createWebHistory } from 'vue-router'
import ProtectedLayout from '../components/ProtectedLayout.vue'
import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import ErrorTestPage from '../pages/ErrorTestPage.vue'
import SimpleTest from '../components/SimpleTest.vue'
import NotFound from '../components/NotFound.vue'
import TodoDetails from '../components/TodoDetails.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: LoginPage,
    },
    {
      path: '/',
      component: ProtectedLayout,
      children: [
        {
          path: '',
          component: HomePage,
        },
        {
          path: 'profile',
          component: ProfilePage,
        },
      ],
    },
    {
      path: '/todos/:id',
      component: ProtectedLayout,
      children: [
        {
          path: '',
          component: TodoDetails,
        },
      ],
    },
    {
      path: '/simple-test',
      component: SimpleTest,
    },
    {
      path: '/error-test',
      component: ErrorTestPage,
    },
    {
      path: '/404',
      component: NotFound,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
    },
  ],
})

export default router
