"use client";
import DeleteIcon from '@mui/icons-material/Delete';
import { DataTable } from "@components/DataTable.component";
import { ModalSaveComponent } from "@components/ModalSave.component";
import { Module } from "@domain/models/Module.model";
import { Column } from "@domain/types/dataTable/Column.type";
import { useSwal } from "@hooks/useSwal.hook";
import { Grid2 as Grid, TextField, IconButton, Typography, useTheme } from "@mui/material";
import { useModuleService } from "@services/useModule.service";
import { useEffect, useState } from "react";
import { UseFormRegister } from "react-hook-form";

export default () => {
  const [page, setPage] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [contentData, setContentData] = useState<Module[]>([]);
  const [selected, setSelected] = useState<Module>();

  const {
    palette
  } = useTheme();

  const columns: Column[] = [
    {
      name: "Module",
      value: "moduleName"
    },
    {
      name: 'Description',
      value: 'description'
    },
    {
      name: 'State',
      width: 1,
      selector: (row) => row.isActive ? <Typography sx={{ color: 'green' }} >Active</Typography> : <Typography sx={{ color: 'red' }} >Inactive</Typography>
    },
    {
      name: '',
      width: 1,
      selector: (row: Module) => (
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
  
    const moduleService = useModuleService();
  
    const handleSelected = (data: Module[]) => setSelected(data[0]);
  
    const handleNextPage = () => setPage(prev => prev + 1);
    const handlePrevPage = () => setPage(prev => prev - 1);

    const handleDelete = (module: Module) => Warning(() => {
      moduleService.remove(module.moduleId)
        .then(() => Success('Module deleted successfully'))
        .catch(ex => Error(ex.message))
        .finally(() => getModules());
    });
    
    const handleSubmit = (data: Module) => {  
      if (data.moduleId) {
        Warning(() => {
          moduleService.update(data)
            .then(() => Success('Module updated successfully'))
            .catch(ex => Error(ex.message))
            .finally(() => getModules());
        });
      }
      else {
        moduleService.save(data)
          .then(() => {
            Success('Module saved successfully');
          })
          .catch(ex => Error(ex.message))
          .finally(() => {
            getModules();
          });
      }
    }
  
    const getModules = () => moduleService.getAll(page)
      .then(({ data: { result, rows } }) => {
        setContentData(result ?? []);
        setTotalRows(rows);
      })
      .catch(ex => Error(ex.message));
  
    useEffect(() => {
      getModules();
    }, [page]);

  return (
    <Grid container spacing={1} >
      <Grid container sx={{ justifyContent: 'flex-end' }} spacing={1} size={12}>
        <Grid size={2}>
          <ModalSaveComponent
            size='small'
            buttonText="Add module"
            titleModal="Add module"
            onSubmit={handleSubmit}
            Component={CustomComponent} />
        </Grid>

        {
          selected &&
          <Grid size={2}>
            <ModalSaveComponent
              size='small'
              buttonText="Edit module"
              titleModal="Edit module"
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
  moduleName: {
    required: "This field is required"
  }
}

const CustomComponent = ({
  data,
  register,
  errors
} : {
  data: any,
  text: string,
  register: UseFormRegister<any>,
  errors: any
}) => {
  return (
    <Grid container spacing={1} >
      <Grid size={12}>
        <TextField
          label="Module name"
          size="small"
          defaultValue={data.moduleName}
          {...register('moduleName', userFormRules.moduleName)}
          error={!!errors.moduleName}
          helperText={errors?.moduleName?.message}
          fullWidth />
      </Grid>

      <Grid size={12}>
        <TextField
          label="Description"
          size="small"
          multiline
          rows={4}
          defaultValue={data.description}
          {...register('description')}
          error={!!errors.description}
          helperText={errors?.description?.message}
          fullWidth />
      </Grid>
    </Grid>
  )
}