import { CircularProgress, Grid2 as Grid, Typography, useTheme } from "@mui/material";

export const LoadingComponent = ({ sx } : { sx?: any }) => {
  const {
    palette
  } = useTheme();

  const styles = {
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      height: "100vh"
    },
    progress: {
      color: palette.secondary.main
    },
    text: {
      color: palette.primary.dark
    }
  }
  
  return (
    <Grid
      container
      spacing={5}
      sx={styles.container} >
        <Grid size="auto">
          <CircularProgress sx={{ ...styles.progress, ...sx }} size={100} />
        </Grid>

        <Grid size='auto'>
          
          <Typography sx={styles.text} textAlign='center' variant="h2" >
            Loading...
          </Typography>
        </Grid>
    </Grid>
  )
}