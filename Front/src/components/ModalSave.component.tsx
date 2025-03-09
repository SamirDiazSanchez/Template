import { Box, Button, Divider, Grid2 as Grid, Modal, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuid } from 'uuid';

export const ModalSaveComponent = ({
  size,
  Component,
  props,
  onSubmit,
  data,
  buttonText,
  titleModal
} : {
  size?: string,
  Component: React.ComponentType,
  props?: any,
  onSubmit: (data: any) => void,
  data?: any,
  buttonText?: string,
  titleModal?: string
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const uidForm = `form-${uuid()}`;

  const hookForm = useForm();

  const {
    palette
  } = useTheme();

  const submited = (formData: any) => {
    onSubmit(formData);
    hookForm.reset();
    handleClose();
  }

  const handleClose = () => setOpen(false);

  const handleOpen = () => setOpen(true);

  const values = hookForm.watch();

  const handleCancel = () => {
    hookForm.clearErrors();
    !data && hookForm.reset();
    handleClose();
  }

  useEffect(() => {
    if (data) {
      const entries = Object.entries(data);
      entries.forEach(([key, value]) => hookForm.setValue(key, value));
    }
  }, [data])

  const styles = {
    modal: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '50vw',
      p: 4,
      bgcolor: palette.background.default,
      border: `1px solid ${palette.secondary.main}`
    },
    form: {
      px: 3
    },
    divider: {
      bgcolor: palette.primary.dark,
      m: 2
    }
  };

  return (
    <>
      <Button
        size={size as "small" | "medium" | "large" | undefined}
        onClick={handleOpen}
        variant='contained'
        fullWidth >
        { buttonText ?? 'Modal button' }
      </Button>

      <Modal
        open={open} >
        <Box sx={styles.modal} >
          <Typography
            textAlign='center'
            variant='h6' >
            { titleModal ?? 'Edit' }
          </Typography>

          <Divider sx={styles.divider} />

          <form
            id={uidForm}
            onSubmit={hookForm.handleSubmit(submited)} >
            <Box sx={styles.form} >
              <Component
                {...props}
                data={values}
                {...hookForm}
                errors={hookForm.formState.errors} />
            </Box>
          </form>

          <Divider sx={styles.divider} />

          <Grid container spacing={1} >
            <Grid size='grow'>
              <Button
                size="small"
                variant="contained"
                color="primary"
                form={uidForm}
                type="submit"
                fullWidth >
                Submit
              </Button>
            </Grid>

            <Grid size='grow'>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={handleCancel}
                fullWidth >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  )
}