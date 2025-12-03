import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AssetsView from '@/views/AssetsView.vue';
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
    },
    { path: 'events', name: 'events', component: EventsView },
    { path: 'assets', name: 'assets', component: AssetsView },
    { path: 'profile', name: 'profile', component: ProfileView },
  ],
};
