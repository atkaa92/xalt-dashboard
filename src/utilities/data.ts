import type { NavItem, ProjectItem } from '@/utilities/types';
import { CalendarCheck, Images, LayoutDashboard, UserRoundPen } from 'lucide-vue-next';

export const navItems: NavItem[] = [
  { id: 1, label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { id: 2, label: 'Events', icon: CalendarCheck, to: '/events' },
  { id: 4, label: 'Assets', icon: Images, to: '/assets' },
  { id: 5, label: 'Profile', icon: UserRoundPen, to: '/profile' },
];

export const projects: ProjectItem[] = [
  {
    id: 1,
    title: 'XALT Demo - Live IP',
    lines: ['Mon Oct 06 2025 15:53 (10/6/25, 23:53, GMT+4)', 'America/New_York', '120 mins'],
    buttons: [
      'Copy Viewer Link',
      'Producer',
      'Commentator 1',
      'Commentator 2',
      'Commentator 2',
      'Monitor',
    ],
  },
  {
    id: 2,
    title: 'XALT Demo - Simulation',
    lines: ['Wed Oct 08 2025 09:08 (10/8/25, 13:08, GMT+4)', 'Africa/Abidjan', '120 mins'],
    buttons: [
      'Copy Viewer Link',
      'Producer',
      'Commentator 1',
      'Commentator 2',
      'Commentator 2',
      'Monitor',
    ],
  },
];
