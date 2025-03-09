import { ThemeModal } from '@components/ThemeModal.component';
import { useAuthentication } from '@hooks/useAuthentication.hook';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Grid2 as Grid, IconButton, ListItemIcon, Menu, MenuItem, Toolbar, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const ToolbarComponent = ({
  drawerState,
  handleOpenDrawer
}) => {
  const [anchorEl, setAchorEl] = useState<HTMLElement>();
  const [open, setOpen] = useState<boolean>(false);
  const [modalThemeState, setModalThemeState] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const {
    push
  } = useRouter();

  const {
    userName
  } = useAuthentication();

  const {
    palette
  } = useTheme();

  const handleCloseModalState = () => setModalThemeState(false);

  useEffect(() => {
    const _anchorEl = document?.getElementById('open-menu');
    setAchorEl(_anchorEl);
  }, []);

  const styles = {
    toolbarBox: (drawerState: boolean) => ({
      position: 'fixed',
      top: 0,
      width: `calc(100vw - ${drawerState ? 'var(--drawer-width)' : '0px'})`,
      bgcolor: palette.primary.dark,
      color: palette.primary.contrastText
    }),
    containerToolbar: {
      width: '100%',
      alignItems: 'center'
    },
    drawerIcon: (drawerState: boolean) => ({
      mr: 2,
      display: drawerState && 'none',
      color: 'white'
    })
  }

  return (
    <Box sx={styles.toolbarBox(drawerState)} >
      <Toolbar>
        <Grid container sx={styles.containerToolbar} >
          <Grid size='auto'>
            <IconButton
              aria-label="open drawer"
              onClick={handleOpenDrawer}
              edge="start"
              sx={styles.drawerIcon(drawerState)} >
              <MenuIcon />
            </IconButton>
          </Grid>

          <Grid size='grow'>
            <Typography variant="h6" noWrap component="div">
              Template
            </Typography>
          </Grid>

          <Grid size='auto'>
            <Typography noWrap component="div">
              { userName }
            </Typography>
          </Grid>

          <Grid size='auto'>
            <IconButton
              id="open-menu"
              sx={{ color: 'white' }}
              onClick={handleOpen} >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{
                paper: {
                  style: {
                    maxHeight: 400,
                    width: '30ch',
                  },
                },
              }} >
              <MenuItem onClick={() => setModalThemeState(prev => !prev)} >
                <ListItemIcon>
                  <ColorLensIcon />
                </ListItemIcon>
                Theme
              </MenuItem>
              <MenuItem onClick={() => push('/logout')} >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                LogOut
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Toolbar>

      <ThemeModal
        modal
        handleCloseState={handleCloseModalState}
        state={modalThemeState} />
    </Box>
  )
}