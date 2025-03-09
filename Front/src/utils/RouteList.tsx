import { Route } from '@domain/types/Route.model';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';

export const RouteList: Route[] = [
  {
    name: 'dashboard',
    path: '/dashboard',
    icon: <DashboardIcon />
  },
  {
    name: 'User',
    path: '/user',
    icon: <PersonIcon />
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: <AdminPanelSettingsIcon />
  }
];
