"use client";
import { DrawerComponent } from '@components/auth/Drawer.component';
import { ForbiddenComponent } from '@components/auth/Forbidden.component';
import { LoadingComponent } from '@components/auth/Loading.component';
import { ToolbarComponent } from '@components/auth/Toolbar.component';
import { UnauthorizeComponent } from '@components/auth/Unauthorize.component';
import { useAuthentication } from '@hooks/useAuthentication.hook';
import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import { RouteList } from '@utils/RouteList';
import { useEffect, useState } from 'react';

const styles = {
  main: {
    bgcolor: 'var(--theme-color)',
    height: '100vh',
  },
  content: (drawerOpen: boolean) => ({
    pl: (drawerOpen) ? `var(--drawer-width)` : null,
    transition: "margin 0.3s ease-in-out",
    pt: 7,
  }),
  child: {
    p: 2
  }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [drawerState, setDrawerState] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isAuthenticated, setIsAuthenticatd] = useState<boolean>(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  const handleOpenDrawer = () => setDrawerState(true);

  const handleCloseDrawer = () => setDrawerState(false);

  const pathname = usePathname();

  const {
    modules,
    profile,
  } = useAuthentication();

  useEffect(() => {
    if (profile) setIsAuthenticatd(true);
    else setIsAuthenticatd(false);
  }, [profile]);

  useEffect(() => {
    const _pathName = pathname.slice(0, -1);
    const routeExists = RouteList.find(route => route.path == _pathName);
    const currentRoute = modules ? modules?.find(route => route.path == _pathName) : null;

    if (!routeExists) setIsAuthorized(true);
    else if (currentRoute) setIsAuthorized(true);
    else setIsAuthorized(false);
  }, [pathname, modules]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [])

  return (
    <Box sx={styles.main}>
      { isLoading && <LoadingComponent /> }
      { (!isLoading && !isAuthenticated) && <UnauthorizeComponent /> }
      { (!isLoading && isAuthenticated && !isAuthorized) && <ForbiddenComponent /> }
      {
        (!isLoading && isAuthenticated && isAuthorized) &&
        <Box sx={styles.content(drawerState)}>
          <DrawerComponent
            open={drawerState}
            handleCloseDrawer={handleCloseDrawer} />
          <ToolbarComponent
            drawerState={drawerState}
            handleOpenDrawer={handleOpenDrawer} />
          <Box sx={styles.child}>
            { children }
          </Box>
        </Box>
      }
    </Box>
  )
}