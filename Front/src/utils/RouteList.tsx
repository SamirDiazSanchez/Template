import { Route } from '@domain/types/Route.model';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';

export const RouteList: Route[] = [
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
