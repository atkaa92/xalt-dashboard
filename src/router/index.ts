import { authRoutes } from '@/router/auth';
import { dashboardRoutes } from '@/router/dashboard';
import NotFoundView from '@/views/NotFoundView.vue';
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  dashboardRoutes,
  authRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
  },
];

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
