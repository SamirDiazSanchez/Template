"use client";
import { Column } from "@domain/types/dataTable/Column.type";
import { Styles } from "@domain/types/dataTable/styles.type";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Checkbox, Divider, Grid2 as Grid, IconButton, Radio, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

export const DataTable = ({
  columns,
  data,
  sx,
  page,
  size,
  totalRows,
  rowsPerPage,
  handleNextPage,
  handlePrevPage,
  selectable,
  multiselctable,
  handleSelected
} : {
  columns: Column[],
  data: any[],
  sx?: Styles,
  page?: number,
  size?: string,
  totalRows?: number,
  rowsPerPage?: number,
  handleNextPage?: () => void,
  handlePrevPage?: () => void,
  selectable?: boolean,
  multiselctable?: boolean,
  handleSelected?: (data: any) => any
}) => {
  const [totalPages, setTotalPages] = useState<number>();
  const [customData, setCustomData] = useState<any[]>([]);

  const {
    palette
  } = useTheme();

  const selectedRow = (row: any) => {
    let _customData: any[];
    if (multiselctable) _customData = customData.map(el => (el.id == row.id ? { ...el, checked: !el.checked } :  el));
    else if (selectable) _customData = customData.map(el => (el.id == row.id ? { ...el, checked: !el.checked } :  { ...el, checked: false }));

    handleSelected && handleSelected(_customData.filter((el: { checked: any; }) => el.checked));
    setCustomData(_customData);
  }

  useEffect(() => {
    setTotalPages(Math.ceil((totalRows ?? 0)/(rowsPerPage ?? 10)));
  }, [page, totalRows]);

  useEffect(() => {
    setCustomData(data.map(el => ({ ...el, id: el.id ?? uuid() })) ?? []);
  }, [data]);

  const styles: Styles = {
    table: {
      bgcolor: palette.primary.light
    },
    header: {
      head: {
        bgcolor: palette.primary.main
      },
      cell: {
        color: palette.primary.contrastText
      },
      checkIconHeader: {
        textAlign: 'center',
        alignItems: 'center',
        px: 3
      }
    },
    body: {
      cell: {
        color: palette.primary.dark
      }
    },
    divider: {
      bgcolor: palette.secondary.light,
      m: 1
    },
    paginationBox: {
      alignItems: 'center',
      justifyContent: 'flex-end'
    },
    pagination: {
      text: {
        color: palette.primary.main
      }
    }
  }

  const customSx = { ...styles, ...sx };

  return (
    <Box>
      <TableContainer>
        <Table size={size as 'small' | 'medium'} sx={customSx.table} >
          <TableHead sx={customSx.header.head} >
            <TableRow>
              <TableCell sx={styles.header.checkIconHeader} width={1}>
                <CheckBoxIcon sx={{ color: palette.primary.contrastText }} />
              </TableCell>
              {
                columns?.map((el: Column) => (
                  <TableCell key={uuid()} width={el.width} sx={{ ...customSx.header.cell, ...el.sx}} >
                    { el.name }
                  </TableCell>   
                ))
              }
            </TableRow>
          </TableHead>

          <TableBody>
            {
              customData?.map((row, i) => (
                <TableRow onClick={() => selectedRow(row)} key={uuid()} >
                  <TableCell>
                    { 
                      (!selectable && multiselctable && row.checked) &&
                      <Checkbox
                        size="small"
                        checked={row.checked} />
                    }
                    
                    {
                      (selectable && !multiselctable && row.checked) &&
                      <Radio
                        size="small"
                        checked={row.checked} />
                    }
                  </TableCell>
                  {
                    columns?.map(el => (
                      <TableCell key={uuid()} sx={{...styles.body.cell, ...el.sx}} >
                        { (el.value && !el.selector ) && row[el.value] }
                        { (el.selector ) && el.selector(row) }
                      </TableCell>
                    ))
                  }
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
      
      <Divider sx={customSx.divider} />

      <Grid container spacing={1} sx={styles.paginationBox} >
        {
          page != 1 &&
          <Grid size='auto'>
            <IconButton
              color='secondary'
              onClick={handlePrevPage} >
              <KeyboardArrowLeftIcon />
            </IconButton>
          </Grid>
        }

        <Grid size='auto' >
          <Typography textAlign='end' sx={customSx.pagination.text} >
             { `Page ${page} - ${totalPages}` }
          </Typography>
        </Grid>

        {
          (page < totalPages && totalPages > 1) &&
          <Grid size='auto'>
            <IconButton
              color='secondary'
              onClick={handleNextPage} >
              <KeyboardArrowRightIcon />
            </IconButton>
          </Grid>
        }
      </Grid>
    </Box>
  )
}