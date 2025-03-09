import { Button, Divider, Grid2 as Grid, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";

export const UnauthorizeComponent = () => {
  const {
    push
  } = useRouter();

  const {
    palette
  } = useTheme();

  const styles = {
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      height: "100vh"
    },
    text: {
      color: palette.primary.contrastText
    },
    divider: {
      m: 2,
      bgcolor: palette.primary.light
    }
  }

  return (
    <Grid
      container
      sx={styles.container} >
      <Grid container size={6}>
        <Grid size={12}>
          <Typography sx={styles.text} textAlign='center' variant="h2" >
            401 | Unauthorize
          </Typography>
        </Grid>

        <Grid size={12}>
          <Divider sx={styles.divider} />
        </Grid>

        <Grid size={12}>
          <Button
            color='secondary'
            onClick={() => push('/login')}
            fullWidth >
            go to login
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}