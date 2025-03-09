"use client";
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable } from "@components/DataTable.component";
import { ModalSaveComponent } from "@components/ModalSave.component";
import { Profile } from "@domain/models/Profile.model";
import { User } from "@domain/models/User.model";
import { Column } from "@domain/types/dataTable/Column.type";
import { useSwal } from "@hooks/useSwal.hook";
import { Autocomplete, Grid2 as Grid, IconButton, TextField, Typography, useTheme } from "@mui/material";
import { useProfileService } from "@services/useProfile.service";
import { useUserService } from "@services/useUser.service";
import { useEffect, useState } from "react";
import { UseFormRegister, Controller, Control } from "react-hook-form";

export default () => {
  const [page, setPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [contentData, setContentData] = useState<User[]>([]);
  const [selected, setSelected] = useState<User>();
  const [profileList, setProfileList] = useState<Profile[]>([]);

  const {
    palette
  } = useTheme();

  const columns: Column[] = [
    {
      name: 'Full name',
      value: 'fullName'
    },
    {
      name: 'Email',
      value: 'email'
    },
    {
      name: 'Profile',
      value: 'profileName'
    },
    {
      name: 'State',
      width: 1,
      selector: (row) => row.isActive ? <Typography sx={{ color: 'green' }} >Active</Typography> : <Typography sx={{ color: 'red' }} >Inactive</Typography>
    },
    {
      name: '',
      width: 1,
      selector: (row: User) => (
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

  const {
    Success,
    Error,
    Warning
  } = useSwal();

  const userService = useUserService();

  const profileService = useProfileService();

  const handleDelete = (user: User) => Warning(() => userService.remove(user.userId)
    .then(() => Success('User deleted successfully'))
    .catch(ex => Error(ex.message))
    .finally(() => getUsers()));

  const handleSelected = (data: User[]) => setSelected(data[0]);

  const handleNextPage = () => setPage(prev => prev + 1);
  const handlePrevPage = () => setPage(prev => prev - 1);
  
  const handleSubmit = (data: User) => {
    data.profileId = data.profile?.profileId;

    if (data.userId) {
      Warning(() => {
        userService
          .edit(data)
          .then(() => Success('User updated successfully'))
          .catch(error => Error(error.message))
          .finally(() => {
            setSelected(undefined);
            getUsers();
          });
      })
    }
    else {
      userService
        .save(data)
        .then(() => Success('User save successfully'))
        .catch(error => Error(error.message))
        .finally(() => {
          setSelected(undefined);
          getUsers();
        });
    }
  }

  const getProfiles = () => profileService
    .getList()
    .then(({ data }) => {
      setProfileList(Array.isArray(data) ? data : [])
    })
    .catch(error => Error(error.message));

  const getUsers = () => userService
    .getAll(page)
    .then(({ data : { result, rows }}) => {
      let users = result.map((user: User) => ({ ...user, profile: profileList.find(profile => profile.profileId === user.profileId) }));
      
      setContentData(users ?? []);
      setTotalRows(rows ?? 0);
    })
    .catch(error => Error(error.message));

  useEffect(() => {
    getProfiles();
  }, []);

  useEffect(() => {
    profileList.length > 0 && getUsers();
  }, [profileList, page]);

  return (
    <Grid container spacing={1} >
      <Grid container sx={{ justifyContent: 'flex-end' }} spacing={1} size={12}>
        <Grid size={2}>
          <ModalSaveComponent
            size='small'
            buttonText="Add user"
            titleModal="Add user"
            props={{ profileList }}
            onSubmit={handleSubmit}
            Component={CustomComponent} />
        </Grid>

        {
          selected &&
          <Grid size={2}>
            <ModalSaveComponent
              size='small'
              buttonText="Edit user"
              titleModal="Edit user"
              props={{ profileList }}
              data={selected}
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
          selectable
          handleSelected={handleSelected}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage} />
      </Grid>
    </Grid>
  )
}

const userFormRules = {
  userName: {
    required: "This field is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Enter a valid email",
    }
  },
  fullName: {
    required: "This field is required",
    minLength: {
      value: 6,
      message: "Full name must be at least 6 characters"
    }
  },
  email: {
    required: "This field is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Enter a valid email"
    }
  }
}

const CustomComponent = ({
  data,
  register,
  errors,
  control,
  profileList
} : {
  data: any,
  text: string,
  register: UseFormRegister<any>,
  errors: any,
  control: Control,
  profileList: Profile[]
}) => {
  return (
    <Grid container spacing={1} >
      <Grid size={12}>
        <TextField
          label="Full Name"
          size="small"
          defaultValue={data.fullName}
          {...register('fullName', userFormRules.fullName)}
          error={!!errors.fullName}
          helperText={errors?.fullName?.message}
          fullWidth />
      </Grid>

      <Grid size={12}>
        <TextField
          label="Email"
          size="small"
          defaultValue={data.email}
          {...register('email', userFormRules.email)}
          error={!!errors.email}
          helperText={errors?.email?.message}
          fullWidth />
      </Grid>

      <Grid size={12}>
        <Controller
          name="profile"
          control={control}
          rules={{ required: "This filed is required" }}
          render={({ field, fieldState }) => (
            <Autocomplete
              {...field}
              options={profileList}
              getOptionLabel={(option) => option.profileName}
              value={field.value}
              onChange={(_, v) => field.onChange(v)} 
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Profile"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )} />
          )} />
      </Grid>
    </Grid>
  )
}