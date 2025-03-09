"use client";
import { DataTable } from "@components/DataTable.component";
import { ModalSaveComponent } from "@components/ModalSave.component";
import { Profile } from "@domain/models/Profile.model";
import { Column } from "@domain/types/dataTable/Column.type";
import { Route } from "@domain/types/Route.model";
import { useSwal } from "@hooks/useSwal.hook";
import DeleteIcon from '@mui/icons-material/Delete';
import { Autocomplete, Chip, Grid2 as Grid, IconButton, TextField, Typography, useTheme } from "@mui/material";
import { useProfileService } from "@services/useProfile.service";
import { RouteList } from "@utils/RouteList";
import { useEffect, useState } from "react";
import { Control, Controller, UseFormRegister } from "react-hook-form";

export default () => {
  const [page, setPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [contentData, setContentData] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<Profile>();
  const [modules] = useState<Route[]>(RouteList ?? []);

  const {
    palette
  } = useTheme();

  const {
    Success,
    Error,
    Warning
  } = useSwal();

  const columns: Column[] = [
    {
      name: 'Profile name',
      value: 'profileName'
    },
    {
      name: 'Modules',
      selector: (row) => row.modules.split(',').map((module: string) => <Chip key={module} sx={styles.chipModules} label={module} />)
    },
    {
      name: 'State',
      width: 1,
      selector: (row) => row.isActive ? <Typography sx={{ color: 'green' }} >Active</Typography> : <Typography sx={{ color: 'red' }} >Inactive</Typography>
    },
    {
      name: '',
      width: 1,
      selector: (row: Profile) => (
        <IconButton
          disabled={!row.isActive}
          size="small"
          sx={{ color: palette.secondary.main }}
          onClick={() => handleDelete(row)} >
          <DeleteIcon />
        </IconButton>
      )
    }
  ]

  const profileService = useProfileService();

  const handleSelected = (data: Profile[]) => setSelected(data[0]);

  const handleNextPage = () => setPage(prev => prev + 1);
  const handlePrevPage = () => setPage(prev => prev - 1);

  const handleDelete = (profile: Profile) => Warning(() => {
    profileService
      .remove(profile.profileId)
      .then(() => Success('Profile deleted successfully'))
      .catch(ex => Error(ex.message))
      .finally(() => getProfiles());
  });

  const getProfiles = () => {
    profileService
      .getAll(page)
      .then(({ data : { result, rows }}) => {
        const profiles = result.map(profile => {
          const _moduleList = profile.modules.split(',').map(el => el.toLowerCase().trim());
          const _modules = RouteList.filter(el => _moduleList.includes(el.name.toLowerCase()));
          return { ...profile, moduleList: _modules };
        });

        setTotalRows(rows ?? 0);
        setContentData(Array.isArray(profiles) ? profiles : []);
      })
      .catch(ex => Error(ex.message));
  }

  const handleSubmit = (data: Profile) => {
    data.modules = data.moduleList.map(el => el.name).join(',');
    data.moduleList = null;
    if (data.profileId) {
      Warning(() => {
        profileService
          .edit(data)
          .then(() => Success('Profile updated successfully'))
          .catch(ex => Error(ex.message))
          .finally(() => {
            setSelected(undefined);
            getProfiles();
          });
      });
    }
    else {
      profileService
        .save(data)
        .then(() => Success('Profile saved successfully'))
        .catch(ex => Error(ex.message))
        .finally(() => getProfiles());
    }
  }

  useEffect(() => {
    getProfiles();
  }, [page]);

  const styles = {
    chipModules: {
      mr: 1,
      bgcolor: palette.primary.dark,
      color: palette.primary.contrastText
    }
  }

  return (
    <Grid container spacing={1} >
      <Grid container sx={{ justifyContent: 'flex-end' }} spacing={1} size={12}>
        <Grid size={2}>
          <ModalSaveComponent
            size='small'
            buttonText="Add profile"
            titleModal="Add profile"
            props={{ moduleList: modules }}
            onSubmit={handleSubmit}
            Component={CustomComponent} />
        </Grid>

        {
          selected &&
          <Grid size={2}>
            <ModalSaveComponent
              size='small'
              buttonText="Edit profile"
              titleModal="Edit profile"
              data={selected}
              props={{ moduleList: modules }}
              onSubmit={handleSubmit}
              Component={CustomComponent} />
          </Grid>
        }
      </Grid>
      <Grid size={12}>
        <DataTable
          page={page}
          size="small"
          totalRows={totalRows}
          columns={columns}
          data={contentData}
          selectable={true}
          handleSelected={handleSelected}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage} />
      </Grid>
    </Grid>
  )
}

const CustomComponent = ({
  data,
  register,
  control,
  moduleList,
  errors
} : {
  data: any,
  text: string,
  register: UseFormRegister<any>,
  control: Control,
  moduleList: Route[],
  errors: any
}) => {
  return (
    <Grid container spacing={1} >
      <Grid size={12}>
        <TextField
          label="Name"
          size="small"
          defaultValue={data.profileName}
          {...register('profileName', { required: "This filed is required" })}
          error={!!errors.profileName}
          helperText={errors?.profileName?.message}
          fullWidth />
      </Grid>

      <Grid size={12}>
        <Controller
          name="moduleList"
          control={control}
          rules={{ required: "This filed is required" }}
          render={({ field, fieldState }) => (
            <Autocomplete
              {...field}
              multiple
              options={moduleList}
              getOptionLabel={(option) => option.name}
              value={field.value}
              onChange={(_, v) => field.onChange(v) } 
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Modules"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )} />
          )} />
      </Grid>
    </Grid>
  )
}