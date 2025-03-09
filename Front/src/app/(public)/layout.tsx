"use client";
import { ThemeModal } from '@components/ThemeModal.component';
import { useAuthentication } from '@hooks/useAuthentication.hook';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import { Box, Grid2 as Grid, IconButton, Toolbar, Typography, useTheme } from "@mui/material";
import { useRouter } from 'next/navigation';

export default ({ children } : { children: React.ReactNode }) => {
  const {
    palette
  } = useTheme();

  const {
    push
  } = useRouter();

  const {
    profile
  } = useAuthentication();

  const styles = {
    toolbar: {
      position: 'fixed',
      top: 0,
      width: '100vw',
      bgcolor: palette.primary.main,
      color: palette.primary.contrastText
    },
    contentToolbar: {
      width: '100%',
      alignItems: 'center',
    },
    content: {
      pt: 9,
      height: '100vh',
      px: 1
    },
    main: {
      height: '100vh',
    },
    icon: {
      color: palette.primary.contrastText
    }
  }

  return(
    <Box sx={styles.main} >
      <Box sx={styles.toolbar}>
        <Toolbar>          
          <Grid container spacing={1} sx={styles.contentToolbar} >
            <Grid size='auto'>
              <IconButton
                onClick={() => push('/')}>
                <HomeIcon sx={styles.icon} />
              </IconButton>
            </Grid>

            <Grid size='grow'>
              <Typography variant="h6" noWrap component="div">
                Page name
              </Typography>
            </Grid>

            <Grid size='auto'>
              <IconButton
                onClick={() => push(!!profile ? '/dashboard' : '/login')}>
                <LoginIcon sx={styles.icon} />
              </IconButton>
            </Grid>

            <Grid size='auto'>
              <ThemeModal />
            </Grid>
          </Grid>
        </Toolbar>
      </Box>

      <Box sx={styles.content}>
        { children }
      </Box>
    </Box>
  )
}