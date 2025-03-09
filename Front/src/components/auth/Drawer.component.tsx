import { useAuthentication } from '@hooks/useAuthentication.hook';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import { RouteList } from '@utils/RouteList';
import { useRouter } from 'next/navigation';

export const DrawerComponent = ({
  open,
  handleCloseDrawer
} : {
  open: boolean,
  handleCloseDrawer?: () => void
}) => {
  const {
    modules
  } = useAuthentication();

  const {
    push
  } = useRouter();

  const {
    palette
  } = useTheme();

  const styles = {
    drawer: {
      width: 'var(--drawer-width)',
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: 'var(--drawer-width)',
        boxSizing: 'border-box',
        bgcolor: palette.primary.main,
        color: palette.primary.contrastText
      },
    }
  }

  return (
    <Drawer
      sx={styles.drawer}
      variant="persistent"
      anchor="left"
      open={open} >
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleCloseDrawer} sx={{ justifyContent: 'flex-end' }} >
            <ListItemIcon >
              <MenuOpenIcon sx={{ color: 'white' }} />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
      </List>

      <Divider sx={{ bgcolor: 'white' }} />

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => push(`/`) } >
            <ListItemIcon>
              <HomeIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary='Home' />
          </ListItemButton>
        </ListItem>

        {
          !!modules && modules?.map(module => {
            return (
              <ListItem key={module.name} disablePadding>
                <ListItemButton onClick={() => push(module.path) } >
                  <ListItemIcon>
                    {
                      RouteList.find(el => el.name == module.name)?.icon ? RouteList.find(el => el.name == module.name)?.icon : <ArrowForwardIcon />
                    }
                  </ListItemIcon>
                  <ListItemText primary={module.name} />
                </ListItemButton>
              </ListItem>
            );
          })
        }
      </List>
    </Drawer>
  )
}