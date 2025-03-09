"use client";
import { Authentication } from "@domain/models/Authentication.model";
import { useAuthentication } from "@hooks/useAuthentication.hook";
import { useSwal } from "@hooks/useSwal.hook";
import { Box, Divider, Grid2 as Grid, Typography, useTheme } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default () => {
  const {
    Error
  } = useSwal();

  const {
    push
  } = useRouter();

  const {
    Authenticate,
    profile
  } = useAuthentication();

  const {
    palette
  } = useTheme();

  const handleSuccess = (data: Authentication) => Authenticate(data)
    .then(res => push('/dashboard'))
    .catch(ex => Error(ex.message));

  const styles = {
    main: {
      height: '100%'
    },
    logInColumn: {
      bgcolor: palette.primary.light,
      alignItems: 'center'
    },
    content: {
      m: 3
    },
    divider: {
      bgcolor: palette.primary.dark,
      mb: 2
    },
    text: {
      color: palette.primary.dark
    }
  }

  return (
    <Grid container sx={styles.main}>
      <Grid size={9}>

      </Grid>
      <Grid container size={3} sx={styles.logInColumn} >
        <Grid size={12}>
          <Box sx={styles.content} >
            <Grid container sx={{ justifyContent: 'center' }}>
              <Grid size={12}>
                <Typography variant="h4" sx={styles.text} gutterBottom textAlign='center' >
                  Sign In
                </Typography>
              </Grid>

              <Grid size={12}>
                <Divider sx={styles.divider} />
              </Grid>

              <Grid size='auto'>
                <GoogleLogin 
                  onSuccess={handleSuccess} 
                  onError={() => console.error("Login fallido")} />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}