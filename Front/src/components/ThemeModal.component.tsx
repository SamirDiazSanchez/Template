import { useContextProvider } from "@hooks/useContextProvider.hook";
import { useStorage } from "@hooks/useStorage.hook";
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { Box, Button, Card, Divider, FormControl, FormControlLabel, Grid2 as Grid, IconButton, Modal, PaletteMode, Radio, RadioGroup, Typography, useTheme } from "@mui/material";
import { ColorThemes } from "@utils/ColorThemes";
import { useEffect, useState } from "react";
import { v4 as uuid } from 'uuid';

export const ThemeModal = ({
  button,
  modal,
  state,
  handleCloseState
} : {
  modal?: boolean,
  button?: boolean,
  state?: boolean,
  handleCloseState?: () => void
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const {
    changeColor,
    mode,
    changeMode
  } = useContextProvider();

  const {
    palette
  } = useTheme();

  const {
    set
  } = useStorage();

  const handleChangeTheme = (color: string) => {
    set('color', color);
    changeColor(color);
  }

  const handleChangeMode = (e: any) => {
    set('mode', e.target.value);
    changeMode(e.target.value as PaletteMode);
  }

  const handleClose = () => {
    handleCloseState && handleCloseState();
    setOpen(false);
  }

  const handleOpen = () => setOpen(true);

  useEffect(() => {
    setOpen(state);
  }, [state])

  const styles = {
    modal: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '70vw',
      bgcolor: palette.primary.light,
      color: palette.primary.dark,
      p: 5
    },
    divider: {
      m: 4,
      bgcolor: palette.primary.dark
    },
    icon: {
      color: palette.primary.contrastText
    }
  }

  return (
    <>
      {
        (button && !modal) &&
        <Button
          onClick={handleOpen} >
          <ColorLensIcon sx={styles.icon} /> Theme
        </Button>
      }
      {
        (!button && !modal) &&
        <IconButton
          onClick={handleOpen} >
          <ColorLensIcon sx={styles.icon} />
        </IconButton>
      }

      <Modal
        onClose={handleClose}
        open={open} >
        <Box sx={styles.modal}>
          <Grid container spacing={2} justifyContent='center' alignItems='center' >
            <Grid size='auto'>
              <Typography textAlign='center' variant="h5">
                Dark mode:
              </Typography>
            </Grid>

            <Grid size='auto'>
            <FormControl>
              <RadioGroup
                row
                value={mode}
                onChange={handleChangeMode} >
                <FormControlLabel value="light" control={<Radio />} label="Light" />
                <FormControlLabel value="dark" control={<Radio />} label="Dark" />
              </RadioGroup>
            </FormControl>
            </Grid>
          </Grid>

          <Divider sx={styles.divider} />

          <Grid spacing={1} container size={12}>
            {
              Object.keys(ColorThemes).map((theme) => (
                <Grid key={uuid()} size={3}>
                  <Card sx={{ bgcolor: ColorThemes[theme]['primary']['main'] }} >
                    <Grid container >
                      <Grid size={4}>
                        <Box sx={{ bgcolor: ColorThemes[theme]['primary']['dark'], p: 4 }} />
                      </Grid>

                      <Grid size={4}>
                        <Box sx={{ bgcolor: ColorThemes[theme]['primary']['main'], p: 4 }} />
                      </Grid>

                      <Grid size={4}>
                        <Box sx={{ bgcolor: ColorThemes[theme]['primary']['light'], p: 4 }} />
                      </Grid>
                    </Grid>

                    <Grid container >
                      <Grid size={4}>
                        <Box sx={{ bgcolor: ColorThemes[theme]['secondary']['dark'], p: 4 }} />
                      </Grid>

                      <Grid size={4}>
                        <Box sx={{ bgcolor: ColorThemes[theme]['secondary']['main'], p: 4 }} />
                      </Grid>

                      <Grid size={4}>
                        <Box sx={{ bgcolor: ColorThemes[theme]['secondary']['light'], p: 4 }} />
                      </Grid>
                    </Grid>

                    <Box sx={{ py: 2 }}>
                      <Typography textAlign='center' sx={{ textTransform: 'uppercase', color: ColorThemes[theme]['secondary']['contrastText'] }} >
                        {theme}
                      </Typography>
                    </Box>

                    <Box sx={{ p: 1 }}>
                      <Button
                        sx={{ bgcolor: ColorThemes[theme]['secondary']['main'], color: ColorThemes[theme]['secondary']['contrastText'] }}
                        onClick={() => handleChangeTheme(theme)}
                        variant="contained"
                        fullWidth >
                        Select
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))
            }
          </Grid>

          <Divider sx={styles.divider} />

          <Grid container>
            <Grid offset={10} size={2}>
              <Button
                color='secondary'
                variant='contained'
                onClick={handleClose}
                fullWidth >
                Close
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  )
}