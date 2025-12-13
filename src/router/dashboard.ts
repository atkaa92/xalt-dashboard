import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AssetsAddView from '@/views/assets/AssetsAddView.vue';
import AssetsView from '@/views/assets/AssetsView.vue';
import DashboardView from '@/views/DashboardView.vue';
import EventsView from '@/views/EventsView.vue';
import ProfileView from '@/views/ProfileView.vue';
import type { RouteRecordRaw } from 'vue-router';

export const dashboardRoutes: RouteRecordRaw = {
  path: '/',
  component: DefaultLayout,
  children: [
    {
      path: '',
      name: 'dashboard',
      component: DashboardView,
      alias: ['/dashboard', '/home'],
      meta: { requiresAuth: true },
    },
    { path: 'events', name: 'events', component: EventsView, meta: { requiresAuth: true } },
    { path: 'assets', name: 'assets', component: AssetsView, meta: { requiresAuth: true } },
    {
      path: 'add-assets',
      name: 'addAssets',
      component: AssetsAddView,
      meta: { requiresAuth: true },
    },
    { path: 'profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
  ],
};
