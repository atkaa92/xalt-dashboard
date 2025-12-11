import type { RouteRecordRaw } from 'vue-router';

export const authRoutes: RouteRecordRaw = {
  path: '/auth',
  component: () => import('@/layouts/AuthLayout.vue'),
  meta: { guest: true },
  children: [
    {
      path: 'login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
    },
    {
      path: 'register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
    },
  ],
};
